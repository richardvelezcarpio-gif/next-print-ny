import crypto from "node:crypto";
import { requireAdmin } from "../lib/admin-auth.js";

const PROJECTS_TABLE = "design_approval_projects";
const SAMPLES_TABLE = "design_approval_samples";
const RESPONSES_TABLE = "design_approval_responses";
const STORAGE_BUCKET = "project-assets";
const MAX_FILE_BYTES = 25 * 1024 * 1024;
const MAX_COMMENT_LENGTH = 2000;
const UPLOAD_TOKEN_TTL_MS = 2 * 60 * 60 * 1000;
const ALLOWED_FILE_TYPES = new Set(["image/jpeg", "image/png", "application/pdf"]);
const ALLOWED_RESPONSES = new Set(["approved", "changes_requested"]);
const TOKEN_PATTERN = /^dap_[A-Za-z0-9_-]{40,80}$/;

export default async function handler(req, res) {
  try {
    requireSupabase();
    const action = getAction(req);

    if (req.method === "GET" && action === "public") return await loadPublicProject(req, res);
    if (req.method === "POST" && action === "respond") return await submitResponse(req, res);

    if (!requireAdmin(req, res)) return;

    if (req.method === "GET" && action === "list") return await listProjects(res);
    if (req.method === "POST" && action === "create") return await createProject(req, res);
    if (req.method === "POST" && action === "sign-upload") return await signUpload(req, res);
    if (req.method === "POST" && action === "register-sample") return await registerSample(req, res);
    if (req.method === "POST" && action === "reopen") return await reopenProject(req, res);

    res.status(404).json({ error: "Unknown design approval action." });
  } catch (error) {
    const status = Number(error?.status) || 500;
    res.status(status).json({
      error: status >= 500 ? "The design approval service could not complete this request." : error.message,
    });
  }
}

async function listProjects(res) {
  const projects = await databaseJson(
    `${PROJECTS_TABLE}?select=id,secure_token,project_name,customer_name,customer_email,product_service,order_number,due_date,customer_notes,status,response_round,last_response_at,approved_sample_id,created_at,updated_at&order=updated_at.desc&limit=200`,
  );
  if (!projects.length) return res.status(200).json({ projects: [] });

  const ids = projects.map((project) => project.id).join(",");
  const [samples, responses] = await Promise.all([
    databaseJson(`${SAMPLES_TABLE}?project_id=in.(${ids})&select=id,project_id,file_name,file_url,file_type,version,status,customer_comment,responded_at,created_at&order=version.asc`),
    databaseJson(`${RESPONSES_TABLE}?project_id=in.(${ids})&select=project_id,sample_id,response_type,customer_comment,created_at&order=created_at.desc`),
  ]);
  const samplesByProject = groupBy(samples, "project_id");
  const responsesByProject = groupBy(responses, "project_id");
  const sampleById = new Map(samples.map((sample) => [sample.id, sample]));

  const output = [];
  for (const project of projects) {
    const projectSamples = samplesByProject.get(project.id) || [];
    const history = responseHistory(responsesByProject.get(project.id) || [], sampleById);
    output.push({
      secure_token: project.secure_token,
      project_name: project.project_name,
      customer_name: project.customer_name,
      customer_email: project.customer_email,
      product_service: project.product_service,
      order_number: project.order_number,
      due_date: project.due_date,
      customer_notes: project.customer_notes,
      status: project.status,
      last_response_at: project.last_response_at,
      approved_version: sampleById.get(project.approved_sample_id)?.version || null,
      latest_response: history[0] || null,
      history,
      created_at: project.created_at,
      updated_at: project.updated_at,
      samples: await Promise.all(projectSamples.map(publicSample)),
    });
  }

  res.setHeader("Cache-Control", "private, no-store, max-age=0");
  res.status(200).json({ projects: output });
}

async function createProject(req, res) {
  const input = validateProject(req.body || {});
  const record = {
    secure_token: `dap_${crypto.randomBytes(32).toString("base64url")}`,
    project_name: input.projectName,
    customer_name: input.customerName,
    customer_email: input.customerEmail,
    product_service: input.productService,
    order_number: input.orderNumber || null,
    due_date: input.dueDate || null,
    customer_notes: input.customerNotes || null,
    status: "pending",
  };
  const created = await databaseJson(PROJECTS_TABLE, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(record),
  });
  res.status(201).json({ project: publicProjectRecord(created[0]) });
}

async function signUpload(req, res) {
  const secureToken = validateSecureToken(req.body?.secureToken);
  const file = validateFileMetadata(req.body || {});
  await requireProjectByToken(secureToken);

  const tokenHash = hashSecureToken(secureToken);
  const storagePath = `design-approvals/${tokenHash.slice(0, 24)}/${crypto.randomUUID()}-${safeFileName(file.fileName)}`;
  const response = await storageRequest(`/object/upload/sign/${STORAGE_BUCKET}/${encodeStoragePath(storagePath)}`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  const data = await responseJson(response, "Could not prepare the sample upload.");
  const relativeUrl = data.url || data.signedURL || data.signedUrl;
  if (!relativeUrl) throw serviceError("Supabase did not return an upload URL.");

  const signedUrl = absoluteStorageUrl(relativeUrl);
  const uploadToken = createUploadToken({
    path: storagePath,
    tokenHash,
    fileName: file.fileName,
    fileType: file.fileType,
    fileSize: file.fileSize,
    expiresAt: Date.now() + UPLOAD_TOKEN_TTL_MS,
  });
  res.status(200).json({ signedUrl, uploadToken });
}

async function registerSample(req, res) {
  const secureToken = validateSecureToken(req.body?.secureToken);
  const upload = readUploadToken(req.body?.uploadToken);
  if (upload.tokenHash !== hashSecureToken(secureToken)) throw requestError("Invalid upload authorization.", 403);

  const project = await requireProjectByToken(secureToken);
  const stored = await storedObjectInfo(upload.path);
  const storedSize = Number(stored.size || stored.metadata?.size || 0);
  const storedType = String(stored.mimetype || stored.metadata?.mimetype || upload.fileType).toLowerCase();
  if (!storedSize || storedSize > MAX_FILE_BYTES || storedSize !== upload.fileSize || storedType !== upload.fileType || !ALLOWED_FILE_TYPES.has(storedType)) {
    await removeStoredObject(upload.path);
    throw requestError("The uploaded file is invalid or exceeds 25 MB.", 413);
  }

  const existing = await databaseJson(`${SAMPLES_TABLE}?project_id=eq.${encodeURIComponent(project.id)}&select=version&order=version.desc&limit=1`);
  const version = Number(existing[0]?.version || 0) + 1;
  const rows = await databaseJson(SAMPLES_TABLE, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      project_id: project.id,
      file_name: upload.fileName,
      file_url: upload.path,
      file_type: storedType,
      version,
      status: "pending",
    }),
  });
  await databaseJson(`${PROJECTS_TABLE}?id=eq.${encodeURIComponent(project.id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ updated_at: new Date().toISOString() }),
  });
  res.status(201).json({ sample: await publicSample(rows[0]) });
}

async function loadPublicProject(req, res) {
  const token = new URL(req.url, "http://local").searchParams.get("token") || "";
  if (!TOKEN_PATTERN.test(token)) return res.status(404).json({ error: "Project not found." });
  const data = await publicProjectData(token);
  if (!data) return res.status(404).json({ error: "Project not found." });
  res.setHeader("Cache-Control", "private, no-store, max-age=0");
  res.status(200).json(data);
}

async function submitResponse(req, res) {
  const secureToken = validateSecureToken(req.body?.secureToken, true);
  const version = validateVersion(req.body?.version);
  const responseType = String(req.body?.responseType || "").trim();
  const comment = cleanText(req.body?.comment, MAX_COMMENT_LENGTH + 1);
  if (!ALLOWED_RESPONSES.has(responseType)) throw requestError("Select Approve Design or Request Changes.");
  if (responseType === "changes_requested" && !comment) throw requestError("A comment is required when requesting changes.");
  if (comment.length > MAX_COMMENT_LENGTH) throw requestError(`Comments must be ${MAX_COMMENT_LENGTH} characters or fewer.`);

  try {
    await rpc("submit_design_approval_response", {
      p_secure_token: secureToken,
      p_version: version,
      p_response_type: responseType,
      p_comment: comment || null,
    });
  } catch (error) {
    throw mapResponseError(error);
  }

  const data = await publicProjectData(secureToken);
  const event = prepareNotificationEvent(data?.project, data?.history?.[0]);
  await queueResponseNotification(event);
  res.status(200).json({ ok: true, ...data });
}

async function reopenProject(req, res) {
  const secureToken = validateSecureToken(req.body?.secureToken);
  try {
    await rpc("reopen_design_approval_project", { p_secure_token: secureToken });
  } catch (error) {
    throw mapResponseError(error);
  }
  const projects = await adminProjectByToken(secureToken);
  res.status(200).json({ ok: true, project: projects });
}

async function publicProjectData(token) {
  const projects = await databaseJson(
    `${PROJECTS_TABLE}?secure_token=eq.${encodeURIComponent(token)}&select=id,project_name,customer_name,customer_email,product_service,order_number,due_date,customer_notes,status,last_response_at,approved_sample_id,created_at,updated_at&limit=1`,
  );
  const project = projects[0];
  if (!project) return null;

  const [samples, responses] = await Promise.all([
    databaseJson(`${SAMPLES_TABLE}?project_id=eq.${encodeURIComponent(project.id)}&select=id,file_name,file_url,file_type,version,status,customer_comment,responded_at,created_at&order=version.asc`),
    databaseJson(`${RESPONSES_TABLE}?project_id=eq.${encodeURIComponent(project.id)}&select=sample_id,response_type,customer_comment,created_at&order=created_at.desc`),
  ]);
  const sampleById = new Map(samples.map((sample) => [sample.id, sample]));
  return {
    project: {
      project_name: project.project_name,
      customer_name: project.customer_name,
      customer_email: project.customer_email,
      product_service: project.product_service,
      order_number: project.order_number,
      due_date: project.due_date,
      customer_notes: project.customer_notes,
      status: project.status,
      last_response_at: project.last_response_at,
      approved_version: sampleById.get(project.approved_sample_id)?.version || null,
      created_at: project.created_at,
      updated_at: project.updated_at,
    },
    samples: await Promise.all(samples.map(publicSample)),
    history: responseHistory(responses, sampleById),
  };
}

async function adminProjectByToken(token) {
  const data = await publicProjectData(token);
  if (!data) throw requestError("Project not found.", 404);
  return { secure_token: token, ...data.project, samples: data.samples, history: data.history, latest_response: data.history[0] || null };
}

function responseHistory(responses, sampleById) {
  return responses.map((response) => ({
    response_type: response.response_type,
    customer_comment: response.customer_comment,
    responded_at: response.created_at,
    version: sampleById.get(response.sample_id)?.version || null,
    file_name: sampleById.get(response.sample_id)?.file_name || null,
  }));
}

async function publicSample(sample) {
  return {
    file_name: sample.file_name,
    file_type: sample.file_type,
    version: sample.version,
    status: sample.status,
    customer_comment: sample.customer_comment,
    responded_at: sample.responded_at,
    created_at: sample.created_at,
    signed_url: await signedFileUrl(sample.file_url),
  };
}

function publicProjectRecord(project) {
  return {
    secure_token: project.secure_token,
    project_name: project.project_name,
    customer_name: project.customer_name,
    customer_email: project.customer_email,
    product_service: project.product_service,
    order_number: project.order_number,
    due_date: project.due_date,
    customer_notes: project.customer_notes,
    status: project.status,
    created_at: project.created_at,
    updated_at: project.updated_at,
  };
}

function validateProject(body) {
  const projectName = requiredText(body.projectName, "Project name", 160);
  const customerName = requiredText(body.customerName, "Customer name", 160);
  const customerEmail = String(body.customerEmail || "").trim().toLowerCase();
  const productService = requiredText(body.productService, "Product / Service", 160);
  const orderNumber = cleanText(body.orderNumber, 100);
  const dueDate = cleanText(body.dueDate, 10);
  const customerNotes = cleanText(body.customerNotes, 3000);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail) || customerEmail.length > 254) throw requestError("Enter a valid customer email.");
  if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) throw requestError("Enter a valid due date.");
  return { projectName, customerName, customerEmail, productService, orderNumber, dueDate, customerNotes };
}

function validateFileMetadata(body) {
  const fileName = requiredText(body.fileName, "File name", 220);
  const fileType = String(body.fileType || "").trim().toLowerCase();
  const fileSize = Number(body.fileSize);
  if (!ALLOWED_FILE_TYPES.has(fileType)) throw requestError("Only JPG, JPEG, PNG and PDF files are allowed.");
  if (!Number.isFinite(fileSize) || fileSize <= 0) throw requestError("The selected file is empty or invalid.");
  if (fileSize > MAX_FILE_BYTES) throw requestError("Each file must be 25 MB or smaller.", 413);
  return { fileName, fileType, fileSize };
}

function validateSecureToken(value, hideInvalid = false) {
  const token = String(value || "").trim();
  if (!TOKEN_PATTERN.test(token)) throw requestError(hideInvalid ? "Project not found." : "Invalid project token.", 404);
  return token;
}

function validateVersion(value) {
  const version = Number(value);
  if (!Number.isInteger(version) || version < 1 || version > 10000) throw requestError("Invalid sample version.");
  return version;
}

async function requireProjectByToken(token) {
  const rows = await databaseJson(`${PROJECTS_TABLE}?secure_token=eq.${encodeURIComponent(token)}&select=id,secure_token,status&limit=1`);
  if (!rows[0]) throw requestError("Project not found.", 404);
  return rows[0];
}

async function signedFileUrl(storagePath) {
  if (!storagePath) return null;
  const response = await storageRequest(`/object/sign/${STORAGE_BUCKET}/${encodeStoragePath(storagePath)}`, {
    method: "POST",
    body: JSON.stringify({ expiresIn: 3600 }),
  });
  const data = await responseJson(response, "Could not prepare the sample preview.");
  return data.signedURL || data.signedUrl ? absoluteStorageUrl(data.signedURL || data.signedUrl) : null;
}

async function storedObjectInfo(storagePath) {
  const response = await storageRequest(`/object/info/${STORAGE_BUCKET}/${encodeStoragePath(storagePath)}`);
  return responseJson(response, "The uploaded sample could not be verified.");
}

async function removeStoredObject(storagePath) {
  try {
    await responseJson(await storageRequest(`/object/${STORAGE_BUCKET}`, {
      method: "DELETE",
      body: JSON.stringify({ prefixes: [storagePath] }),
    }), "Could not remove invalid sample.");
  } catch {
    // Best-effort cleanup. The original validation error remains authoritative.
  }
}

async function rpc(functionName, body) {
  return databaseJson(`rpc/${functionName}`, { method: "POST", body: JSON.stringify(body) });
}

async function databaseJson(path, options = {}) {
  const response = await fetch(`${supabaseBaseUrl()}/rest/v1/${path}`, {
    ...options,
    headers: serviceHeaders(options.headers),
  });
  return responseJson(response, "Database request failed. Apply supabase-design-approval.sql first.");
}

function storageRequest(path, options = {}) {
  return fetch(`${supabaseBaseUrl()}/storage/v1${path}`, {
    ...options,
    headers: serviceHeaders(options.headers),
  });
}

function serviceHeaders(extra = {}) {
  return {
    apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function responseJson(response, fallback) {
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : []; } catch { data = null; }
  if (!response.ok) throw serviceError(data?.message || data?.error || fallback, response.status);
  return data;
}

function createUploadToken(payload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", uploadSigningSecret()).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

function readUploadToken(value) {
  const [encoded, signature] = String(value || "").split(".");
  if (!encoded || !signature) throw requestError("Invalid upload authorization.", 403);
  const expected = crypto.createHmac("sha256", uploadSigningSecret()).update(encoded).digest("base64url");
  if (!safeEqual(signature, expected)) throw requestError("Invalid upload authorization.", 403);
  let payload;
  try { payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")); } catch { throw requestError("Invalid upload authorization.", 403); }
  if (!payload?.path || !payload?.tokenHash || !payload?.fileName || !payload?.fileType || !Number.isFinite(payload?.fileSize) || payload.expiresAt < Date.now()) {
    throw requestError("Upload authorization expired or invalid.", 403);
  }
  return payload;
}

function uploadSigningSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
}

function hashSecureToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function safeEqual(first, second) {
  const a = Buffer.from(String(first));
  const b = Buffer.from(String(second));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function mapResponseError(error) {
  const message = String(error?.message || "");
  if (message.includes("PROJECT_NOT_FOUND")) return requestError("Project not found.", 404);
  if (message.includes("SAMPLE_NOT_FOUND")) return requestError("This sample version does not belong to the project.", 400);
  if (message.includes("COMMENT_REQUIRED")) return requestError("A comment is required when requesting changes.", 400);
  if (message.includes("COMMENT_TOO_LONG")) return requestError(`Comments must be ${MAX_COMMENT_LENGTH} characters or fewer.`, 400);
  if (message.includes("PROJECT_CLOSED") || message.includes("DUPLICATE_RESPONSE")) return requestError("This project already has a completed response.", 409);
  if (message.includes("PROJECT_ALREADY_OPEN")) return requestError("This project is already open.", 409);
  return error;
}

function prepareNotificationEvent(project, response) {
  if (!project || !response) return null;
  return Object.freeze({
    type: response.response_type,
    secureToken: null,
    projectName: project.project_name,
    version: response.version,
    respondedAt: response.responded_at,
  });
}

async function queueResponseNotification(_event) {
  // Integration point for the next sprint. No email provider is called here.
}

function groupBy(rows, key) {
  const grouped = new Map();
  for (const row of rows) {
    const values = grouped.get(row[key]) || [];
    values.push(row);
    grouped.set(row[key], values);
  }
  return grouped;
}

function absoluteStorageUrl(value) {
  return /^https?:\/\//i.test(value) ? value : `${supabaseBaseUrl()}/storage/v1${value.startsWith("/") ? "" : "/"}${value}`;
}

function getAction(req) {
  return new URL(req.url, "http://local").searchParams.get("action") || "";
}

function requiredText(value, label, maxLength) {
  const text = cleanText(value, maxLength);
  if (!text) throw requestError(`${label} is required.`);
  return text;
}

function cleanText(value, maxLength) {
  return String(value || "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, maxLength);
}

function safeFileName(value) {
  const normalized = String(value || "sample").normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g, "-");
  return normalized.replace(/^-+|-+$/g, "").slice(-140) || "sample";
}

function encodeStoragePath(value) {
  return String(value).split("/").map(encodeURIComponent).join("/");
}

function requestError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function serviceError(message, status = 500) {
  const error = new Error(message);
  error.status = status >= 400 && status < 500 ? status : 500;
  return error;
}

function requireSupabase() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) throw serviceError("Supabase is not configured.");
}

function supabaseBaseUrl() {
  return String(process.env.SUPABASE_URL).replace(/\/$/, "");
}

export const designApprovalValidation = {
  ALLOWED_FILE_TYPES,
  ALLOWED_RESPONSES,
  MAX_COMMENT_LENGTH,
  MAX_FILE_BYTES,
  TOKEN_PATTERN,
  validateFileMetadata,
  validateProject,
  validateSecureToken,
  validateVersion,
};
