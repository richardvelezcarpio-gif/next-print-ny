import { requireAdmin } from "./_admin-auth.js";

const TO_EMAIL = "nextprintny@gmail.com";
const TABLE = "business_records";
const ALLOWED_TYPES = new Set(["order", "income", "expense", "inventory", "customer", "document"]);
const ALLOWED_STATUSES = new Set(["new", "in_progress", "waiting", "paid", "completed", "cancelled"]);
const DEFAULT_FROM_EMAIL = "Next Print NY <onboarding@resend.dev>";
const MAX_FILE_SIZE_BASE64 = 17 * 1024 * 1024;

export default async function handler(req, res) {
  const session = requireAdmin(req, res);
  if (!session) return;

  if (!hasSupabaseConfig()) {
    res.status(500).json({
      error: "Supabase is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel.",
    });
    return;
  }

  try {
    if (req.method === "GET") {
      await listRecords(req, res);
      return;
    }

    if (req.method === "POST") {
      await createRecord(req, res, session);
      return;
    }

    if (req.method === "PATCH") {
      await updateRecord(req, res);
      return;
    }

    if (req.method === "DELETE") {
      await deleteRecord(req, res);
      return;
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function listRecords(req, res) {
  const url = new URL(req.url, `https://${req.headers.host || "localhost"}`);
  const type = sanitizeType(url.searchParams.get("type"));
  const status = sanitizeStatus(url.searchParams.get("status"));
  const query = new URLSearchParams({
    select: "*",
    order: "created_at.desc",
    limit: "200",
  });

  if (type) query.set("type", `eq.${type}`);
  if (status) query.set("status", `eq.${status}`);

  const response = await supabaseFetch(`${TABLE}?${query.toString()}`);
  const records = await response.json();
  sendSupabaseResponse(res, response, records);
}

async function createRecord(req, res, session) {
  const record = sanitizeRecord(req.body || {});
  const files = sanitizeFiles(req.body || {});
  const totalFileSize = files.reduce((total, file) => total + String(file.content || "").length, 0);

  if (totalFileSize > MAX_FILE_SIZE_BASE64) {
    res.status(413).json({ error: "File too large" });
    return;
  }

  record.created_by = session.email;
  prepareAdminOrder(record);

  const response = await supabaseFetch(TABLE, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(record),
  });
  const data = await response.json();

  if (!response.ok) {
    sendSupabaseResponse(res, response, data);
    return;
  }

  const savedRecord = Array.isArray(data) ? data[0] : null;
  const warnings = [];

  if (savedRecord?.type === "order") {
    const ownerWarning = await trySendOwnerOrderEmail(savedRecord, files, req);
    if (ownerWarning) warnings.push(ownerWarning);
  }

  const customerWarning =
    req.body?.send_invoice && savedRecord?.type === "order" && savedRecord.customer_email
      ? await trySendInvoiceEmail(savedRecord, req, "invoice")
      : "";
  if (customerWarning) warnings.push(customerWarning);

  res.status(200).json({ records: data, warning: warnings.join(" | ") });
}

async function updateRecord(req, res) {
  const id = String(req.body?.id || "").trim();
  if (!id) {
    res.status(400).json({ error: "Record id is required" });
    return;
  }

  const record = sanitizeRecord(req.body || {}, { partial: true });
  record.updated_at = new Date().toISOString();
  delete record.id;

  const response = await supabaseFetch(`${TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(record),
  });
  const data = await response.json();

  if (!response.ok) {
    sendSupabaseResponse(res, response, data);
    return;
  }

  const savedRecord = Array.isArray(data) ? data[0] : null;
  const warning =
    req.body?.status === "paid" && savedRecord?.type === "order" && savedRecord.customer_email
      ? await trySendInvoiceEmail(savedRecord, req, "receipt")
      : "";

  res.status(200).json({ records: data, warning });
}

async function deleteRecord(req, res) {
  const url = new URL(req.url, `https://${req.headers.host || "localhost"}`);
  const id = String(url.searchParams.get("id") || "").trim();

  if (!id) {
    res.status(400).json({ error: "Record id is required" });
    return;
  }

  const response = await supabaseFetch(`${TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  if (response.ok) {
    res.status(200).json({ ok: true });
    return;
  }

  const data = await response.json();
  sendSupabaseResponse(res, response, data);
}

function sanitizeRecord(input, options = {}) {
  const partial = Boolean(options.partial);
  const record = {};
  const type = sanitizeType(input.type);
  const status = sanitizeStatus(input.status);

  if (!partial && !type) {
    throw new Error("Valid record type is required");
  }

  if (type || !partial) record.type = type;
  if (status || !partial) record.status = status || "new";
  if ("title" in input) record.title = clean(input.title, 160);
  if ("customer_name" in input) record.customer_name = clean(input.customer_name, 120);
  if ("customer_phone" in input) record.customer_phone = clean(input.customer_phone, 80);
  if ("customer_email" in input) record.customer_email = clean(input.customer_email, 120);
  if ("description" in input) record.description = clean(input.description, 1000);
  if ("amount" in input) {
    const amount = Number(input.amount || 0);
    record.amount = Number.isFinite(amount) ? amount : 0;
  }
  if ("quantity" in input) {
    const quantity = Number(input.quantity || 0);
    record.quantity = Number.isFinite(quantity) ? quantity : 0;
  }
  if ("due_date" in input) {
    const dueDate = String(input.due_date || "").trim();
    record.due_date = dueDate || null;
  }
  if ("file_url" in input) record.file_url = clean(input.file_url, 500);

  return record;
}

function sanitizeFiles(input) {
  const filesInput = Array.isArray(input.files) ? input.files : [];
  return filesInput
    .filter((file) => file?.name && file?.content)
    .slice(0, 8)
    .map((file) => ({
      name: clean(file.name, 180),
      content: String(file.content || ""),
    }));
}

function prepareAdminOrder(record) {
  if (record.type !== "order") return;

  const orderNumber = getOrderNumber(record) || buildOrderNumber();
  const title = record.title || "Order";
  const description = record.description || "";

  if (!getOrderNumber({ title, description })) {
    record.title = `${orderNumber} - ${title}`;
    record.description = [`Order: ${orderNumber}`, description].filter(Boolean).join("\n");
  }

  if (!record.due_date) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    record.due_date = toDateInputValue(dueDate);
  }
}

async function trySendInvoiceEmail(record, req, kind) {
  try {
    await sendInvoiceEmail(record, req, kind);
    return "";
  } catch (error) {
    return `Invoice email failed: ${error.message}`;
  }
}

async function trySendOwnerOrderEmail(record, files, req) {
  try {
    await sendOwnerOrderEmail(record, files, req);
    return "";
  } catch (error) {
    return `Admin email failed: ${error.message}`;
  }
}

async function sendOwnerOrderEmail(record, files, req) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY missing");

  const orderNumber = getOrderNumber(record);
  const baseUrl = publicBaseUrl(req);
  const invoiceUrl = `${baseUrl}/invoice.html?order=${encodeURIComponent(orderNumber)}`;
  const trackingUrl = `${baseUrl}/tracking.html?order=${encodeURIComponent(orderNumber)}`;

  await sendResendEmail(apiKey, {
    to: TO_EMAIL,
    replyTo: record.customer_email,
    subject: `Nueva orden custom ${orderNumber || ""} - ${record.title || "Next Print NY"}`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#07142f;line-height:1.55">
        <h2 style="color:#05275c;margin-bottom:8px">Nueva orden custom - ${escapeHtml(orderNumber || "Sin número")}</h2>
        <p><strong>Cliente:</strong> ${escapeHtml(record.customer_name || "No incluido")}</p>
        <p><strong>Teléfono:</strong> ${escapeHtml(record.customer_phone || "No incluido")}</p>
        <p><strong>Email:</strong> ${escapeHtml(record.customer_email || "No incluido")}</p>
        <p><strong>Total:</strong> ${money(Number(record.amount || 0))}</p>
        <p><strong>Entrega:</strong> ${escapeHtml(record.due_date || "No incluida")}</p>
        <p><strong>Detalles:</strong></p>
        <p>${escapeHtml(record.description || "").replace(/\n/g, "<br>")}</p>
        <p><a href="${escapeHtml(invoiceUrl)}" style="color:#05275c;font-weight:bold">Abrir invoice</a></p>
        <p><a href="${escapeHtml(trackingUrl)}" style="color:#05275c;font-weight:bold">Abrir tracking</a></p>
      </div>
    `,
    attachments: files.map((file) => ({
      filename: file.name,
      content: file.content,
    })),
  });
}

async function sendInvoiceEmail(record, req, kind) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY missing");

  const orderNumber = getOrderNumber(record);
  if (!orderNumber) throw new Error("Order number missing");

  const baseUrl = publicBaseUrl(req);
  const invoiceUrl = `${baseUrl}/invoice.html?order=${encodeURIComponent(orderNumber)}`;
  const trackingUrl = `${baseUrl}/tracking.html?order=${encodeURIComponent(orderNumber)}`;
  const isReceipt = kind === "receipt";
  const subject = isReceipt
    ? `Next Print NY payment receipt ${orderNumber}`
    : `Next Print NY invoice ${orderNumber}`;
  const title = isReceipt ? "Payment received" : "Invoice ready";
  const copy = isReceipt
    ? "We received your payment. You can open or print your receipt using the link below."
    : "Your invoice is ready. You can open it, print it, or use it for payment reference.";

  await sendResendEmail(apiKey, {
    to: record.customer_email,
    subject,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#07142f;line-height:1.55">
        <h2 style="color:#05275c;margin-bottom:8px">${title} - ${escapeHtml(orderNumber)}</h2>
        <p>Hi ${escapeHtml(record.customer_name || "customer")},</p>
        <p>${copy}</p>
        <p><strong>Order:</strong> ${escapeHtml(orderNumber)}</p>
        <p><strong>Total:</strong> ${money(Number(record.amount || 0))}</p>
        <p><a href="${escapeHtml(invoiceUrl)}" style="color:#05275c;font-weight:bold">Open invoice / receipt</a></p>
        <p><a href="${escapeHtml(trackingUrl)}" style="color:#05275c;font-weight:bold">Track order</a></p>
        <p style="color:#66708a">Next Print NY<br />239 333 7935</p>
      </div>
    `,
  });
}

async function sendResendEmail(apiKey, message) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL,
      to: message.to,
      ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      subject: message.subject,
      html: message.html,
      ...(message.attachments?.length ? { attachments: message.attachments } : {}),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Could not send invoice email");
  }
}

function getOrderNumber(record) {
  const source = `${record.title || ""}\n${record.description || ""}`;
  const match = source.match(/\bNP-\d{6}-\d{6}\b/i);
  return match ? match[0].toUpperCase() : "";
}

function buildOrderNumber() {
  const now = new Date();
  const date = now.toISOString().slice(2, 10).replace(/-/g, "");
  const time = now.toISOString().slice(11, 19).replace(/:/g, "");
  return `NP-${date}-${time}`;
}

function toDateInputValue(date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function publicBaseUrl(req) {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (envUrl) return String(envUrl).startsWith("http") ? String(envUrl).replace(/\/$/, "") : `https://${envUrl}`;

  const host = req.headers.host || "next-print-ny.vercel.app";
  const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
  return `${protocol}://${host}`;
}

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value || 0);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sanitizeType(value) {
  const type = String(value || "").trim();
  return ALLOWED_TYPES.has(type) ? type : "";
}

function sanitizeStatus(value) {
  const status = String(value || "").trim();
  return ALLOWED_STATUSES.has(status) ? status : "";
}

function clean(value, limit) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, limit);
}

function hasSupabaseConfig() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

async function supabaseFetch(path, options = {}) {
  const baseUrl = String(process.env.SUPABASE_URL || "").replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    return await fetch(`${baseUrl}/rest/v1/${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

function sendSupabaseResponse(res, response, data) {
  if (!response.ok) {
    res.status(response.status).json({ error: data?.message || data?.error || "Supabase request failed" });
    return;
  }

  res.status(200).json({ records: data });
}
