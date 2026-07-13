import crypto from "node:crypto";
import webpush from "web-push";
import { requireAdmin } from "../lib/admin-auth.js";

const TABLES = { customers: "portal_customers", estimates: "portal_estimates", items: "portal_estimate_items", projects: "portal_projects", files: "portal_files", messages: "portal_messages", payments: "portal_payments" };
const DEMO_TOKEN = "np_demo_8xK29mQa72";
const PUSH_SUBSCRIPTIONS = "portal_push_subscriptions";

export default async function handler(req, res) {
  try {
    const action = String(req.query?.action || req.body?.action || "");
    if (req.query?.endpoint === "notifications") return notificationHandler(req, res);
    if (req.method === "GET" && action === "admin") return adminList(req, res);
    if (req.method === "GET") return publicProject(req, res);
    if (req.method === "POST" && action === "payment") return reportPayment(req, res);
    if (req.method === "POST" && action === "decision") return updateCustomerDecision(req, res);
    if (req.method === "POST" && action === "message") return postMessage(req, res);
    if (req.method === "POST" && action === "estimate") return createEstimate(req, res);
    if (req.method === "POST" && action === "verify-payment") return verifyPayment(req, res);
    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    res.status(500).json({ error: "Portal request failed" });
  }
}

async function notificationHandler(req, res) {
  const session = requireAdmin(req, res);
  if (!session) return;
  const action = String(req.query?.action || req.body?.action || "status");
  if (req.method === "GET") return res.status(200).json({ pushConfigured: pushReady(), emailConfigured: emailReady(), publicKey: process.env.VAPID_PUBLIC_KEY || "", connected: false });
  if (action === "subscribe") return subscribePush(req, res, session);
  if (action === "unsubscribe") return unsubscribePush(req, res);
  if (action === "test-push") return sendTestPush(req, res, session);
  if (action === "test-email") return sendTestEmail(res);
  return res.status(400).json({ error: "Unknown notification action" });
}

async function subscribePush(req, res, session) {
  const subscription = req.body?.subscription;
  if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) return res.status(400).json({ error: "Invalid push subscription" });
  if (!configured()) return res.status(503).json({ error: "Supabase is not configured" });
  const rows = await many(`${PUSH_SUBSCRIPTIONS}?endpoint=eq.${encodeURIComponent(subscription.endpoint)}&select=id`);
  if (rows[0]) return res.status(200).json({ connected: true, duplicate: true });
  await request(PUSH_SUBSCRIPTIONS, { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ admin_email: session.email, endpoint: subscription.endpoint, subscription }) });
  return res.status(201).json({ connected: true });
}

async function unsubscribePush(req, res) {
  const endpoint = String(req.body?.endpoint || "");
  if (!endpoint) return res.status(400).json({ error: "Endpoint required" });
  if (configured()) await request(`${PUSH_SUBSCRIPTIONS}?endpoint=eq.${encodeURIComponent(endpoint)}`, { method: "DELETE" });
  return res.status(200).json({ connected: false });
}

async function sendTestPush(req, res, session) {
  if (!pushReady()) return res.status(503).json({ error: "VAPID is not configured" });
  if (!configured()) return res.status(503).json({ error: "Supabase is not configured" });
  webpush.setVapidDetails("mailto:nextprintny@gmail.com", process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
  const rows = await many(`${PUSH_SUBSCRIPTIONS}?admin_email=eq.${encodeURIComponent(session.email)}&select=*`);
  let sent = 0;
  for (const row of rows) {
    try { await webpush.sendNotification(row.subscription, JSON.stringify({ preview: "Test notification from Next Print NY", url: "/admin-portal.html" })); sent += 1; }
    catch (error) { if ([404, 410].includes(error.statusCode)) await request(`${PUSH_SUBSCRIPTIONS}?id=eq.${row.id}`, { method: "DELETE" }); }
  }
  return res.status(200).json({ sent, lastNotificationAt: new Date().toISOString() });
}

async function sendTestEmail(res) {
  if (!emailReady()) return res.status(503).json({ error: "Email notifications are not configured" });
  const recipient = process.env.ADMIN_NOTIFICATION_EMAIL || "nextprintny@gmail.com";
  const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL, to: recipient, subject: "Next Print NY — Test notification", html: "<p>Next Print NY Web Chat notification test.</p>" }) });
  const body = await response.json();
  return res.status(response.ok ? 200 : 502).json({ sent: response.ok, id: body.id || null, recipient, subject: "Next Print NY — Test notification" });
}

async function publicProject(req, res) {
  const token = safeToken(req.query?.token);
  if (!token) return res.status(404).json({ error: "Project portal not found" });
  if (!configured()) return token === DEMO_TOKEN ? res.status(200).json(demoPayload()) : res.status(503).json({ error: "Portal is being configured" });
  try {
    const project = await one(`${TABLES.projects}?secure_token=eq.${encodeURIComponent(token)}&select=*`);
    if (!project) return res.status(404).json({ error: "Project portal not found" });
    const [estimate, customer, items, files, messages, payments] = await Promise.all([
      one(`${TABLES.estimates}?id=eq.${project.estimate_id}&select=*`),
      one(`${TABLES.customers}?id=eq.${project.customer_id}&select=*`),
      many(`${TABLES.items}?estimate_id=eq.${project.estimate_id}&order=position.asc`),
      many(`${TABLES.files}?project_id=eq.${project.id}&order=created_at.desc`),
      many(`${TABLES.messages}?project_id=eq.${project.id}&order=created_at.asc`),
      many(`${TABLES.payments}?project_id=eq.${project.id}&order=created_at.desc`),
    ]);
    if (!estimate || !customer) return res.status(404).json({ error: "Project portal not found" });
    const { internal_notes, ...publicEstimate } = estimate;
    return res.status(200).json({ project, estimate: publicEstimate, customer, items, files, messages, payments });
  } catch {
    if (token === DEMO_TOKEN) return res.status(200).json(demoPayload());
    return res.status(503).json({ error: "Portal is being configured" });
  }
}

async function reportPayment(req, res) {
  const token = safeToken(req.body?.token);
  const amount = Number(req.body?.amount);
  if (!token || !Number.isFinite(amount) || amount <= 0) return res.status(400).json({ error: "A valid payment amount is required" });
  const project = configured() ? await one(`${TABLES.projects}?secure_token=eq.${encodeURIComponent(token)}&select=*`) : token === DEMO_TOKEN ? demoPayload().project : null;
  if (!project) return res.status(404).json({ error: "Project portal not found" });
  const payment = { project_id: project.id, estimate_id: project.estimate_id, method: "zelle", amount, status: "pending_verification", reference: clean(req.body?.reference, 100), proof_name: clean(req.body?.proofName, 160), proof_data_url: clean(req.body?.proofDataUrl, 1_500_000), submitted_at: new Date().toISOString() };
  if (!configured()) return res.status(200).json({ payment: { ...payment, id: "demo-payment", created_at: payment.submitted_at }, demo: true });
  const saved = await insert(TABLES.payments, payment);
  await patch(TABLES.projects, project.id, { payment_status: "pending_verification", status: "payment_pending_verification" });
  await notifyAdmin(`Payment pending verification: ${project.project_number}`, `A deposit payment of $${amount.toFixed(2)} was reported.`);
  res.status(200).json({ payment: saved });
}

async function postMessage(req, res) {
  const token = safeToken(req.body?.token);
  const body = clean(req.body?.body, 2000);
  if (!token || !body) return res.status(400).json({ error: "Message is required" });
  const project = configured() ? await one(`${TABLES.projects}?secure_token=eq.${encodeURIComponent(token)}&select=*`) : token === DEMO_TOKEN ? demoPayload().project : null;
  if (!project) return res.status(404).json({ error: "Project portal not found" });
  const message = { project_id: project.id, sender_role: "customer", body, read_at: null };
  if (!configured()) return res.status(200).json({ message: { ...message, id: "demo-message", created_at: new Date().toISOString() }, demo: true });
  const saved = await insert(TABLES.messages, message);
  await notifyAdmin(`New portal message: ${project.project_number}`, body.slice(0, 180));
  res.status(200).json({ message: saved });
}

async function adminList(req, res) {
  if (!requireAdmin(req, res)) return;
  if (!configured()) return res.status(200).json({ demo: true, projects: [demoPayload()] });
  const projects = await many(`${TABLES.projects}?select=*&order=created_at.desc`);
  res.status(200).json({ projects });
}

async function updateCustomerDecision(req, res) {
  const token = safeToken(req.body?.token);
  const decision = String(req.body?.decision || "");
  const statusByDecision = { accepted: "approved", changes: "changes_requested", rejected: "rejected" };
  if (!token || !statusByDecision[decision]) return res.status(400).json({ error: "A valid estimate decision is required" });
  const project = configured() ? await one(`${TABLES.projects}?secure_token=eq.${encodeURIComponent(token)}&select=*`) : token === DEMO_TOKEN ? demoPayload().project : null;
  if (!project) return res.status(404).json({ error: "Project portal not found" });
  if (!configured()) return res.status(200).json({ project: { ...project, status: statusByDecision[decision] }, demo: true });
  await patch(TABLES.projects, project.id, { status: statusByDecision[decision] });
  await notifyAdmin(`Estimate ${decision}: ${project.project_number}`, `The customer updated the estimate status to ${statusByDecision[decision]}.`);
  return res.status(200).json({ ok: true, status: statusByDecision[decision] });
}

async function createEstimate(req, res) {
  if (!requireAdmin(req, res)) return;
  const input = req.body || {};
  if (!configured()) return res.status(503).json({ error: "Supabase configuration is required to create estimates" });
  const customerData = { name: clean(input.customer?.name, 120), contact_name: clean(input.customer?.contactName, 120), email: clean(input.customer?.email, 160), phone: clean(input.customer?.phone, 50), billing_address: clean(input.customer?.billingAddress, 600) };
  const existingProject = clean(input.projectId, 80) ? await one(`${TABLES.projects}?id=eq.${encodeURIComponent(clean(input.projectId, 80))}&select=*`) : null;
  if (clean(input.projectId, 80) && !existingProject) return res.status(404).json({ error: "Estimate project not found" });
  const customer = existingProject ? (await patch(TABLES.customers, existingProject.customer_id, customerData))[0] : await insert(TABLES.customers, customerData);
  const number = clean(input.estimateNumber, 40) || `NP-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
  const estimateData = {
    estimate_number: number,
    customer_id: customer.id,
    status: input.status === "draft" ? "draft" : "sent",
    tax_mode: ["no_tax", "custom", "tax_exempt"].includes(input.taxMode) ? input.taxMode : "no_tax",
    tax_amount: money(input.taxAmount), shipping_amount: money(input.shipping), installation_amount: money(input.installation), additional_fees: money(input.additionalFees), discount_amount: money(input.discountAmount), deposit_required: money(input.depositRequired),
    estimate_date: safeDate(input.estimateDate), expiration_date: safeDate(input.expirationDate), project_title: clean(input.project?.title, 180), project_description: clean(input.project?.description, 4000), project_details: clean(input.project?.details, 8000), terms: clean(input.terms, 8000), internal_notes: clean(input.internalNotes, 8000), notes: clean(input.clientNotes, 2000)
  };
  const estimate = existingProject ? (await patch(TABLES.estimates, existingProject.estimate_id, estimateData))[0] : await insert(TABLES.estimates, estimateData);
  const items = Array.isArray(input.items) ? input.items.slice(0, 30) : [];
  if (existingProject) await request(`${TABLES.items}?estimate_id=eq.${encodeURIComponent(estimate.id)}`, { method: "DELETE" });
  await Promise.all(items.map((item, position) => insert(TABLES.items, { estimate_id: estimate.id, position, title: clean(item.title, 160), description: clean(item.description, 800), quantity: Math.max(1, Number(item.quantity) || 1), unit: clean(item.unit, 32) || "each", discount: Math.max(0, Math.min(100, Number(item.discount) || 0)), taxable: Boolean(item.taxable), unit_price: money(item.unitPrice) })));
  const projectStatus = input.status === "draft" ? "draft" : "sent";
  const project = existingProject ? (await patch(TABLES.projects, existingProject.id, { project_number: number, status: projectStatus }))[0] : await insert(TABLES.projects, { estimate_id: estimate.id, customer_id: customer.id, project_number: number, secure_token: `np_${crypto.randomBytes(18).toString("base64url")}`, status: projectStatus, payment_status: "unpaid" });
  const files = Array.isArray(input.files) ? input.files.slice(0, 12) : [];
  if (!existingProject) await Promise.all(files.map((file) => insert(TABLES.files, { project_id: project.id, source: "next_print", name: clean(file.name, 180), size_bytes: Math.max(0, Number(file.size) || 0), status: "received" })));
  res.status(201).json({ customer, estimate, project, portalUrl: `/project/${project.secure_token}` });
}

async function verifyPayment(req, res) {
  if (!requireAdmin(req, res)) return;
  const paymentId = clean(req.body?.paymentId, 80);
  if (!paymentId) return res.status(400).json({ error: "Payment id is required" });
  if (!configured()) return res.status(200).json({ ok: true, demo: true });
  const payment = await one(`${TABLES.payments}?id=eq.${encodeURIComponent(paymentId)}&select=*`);
  if (!payment || payment.status !== "pending_verification") return res.status(409).json({ error: "Payment cannot be verified" });
  await patch(TABLES.payments, payment.id, { status: "paid", verified_at: new Date().toISOString() });
  await patch(TABLES.projects, payment.project_id, { payment_status: "paid", status: "paid" });
  res.status(200).json({ ok: true });
}

function configured() { return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY); }
function pushReady() { return Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY); }
function emailReady() { return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL); }
function safeToken(value) { const token = String(value || ""); return /^np_[A-Za-z0-9_-]{10,80}$/.test(token) ? token : ""; }
function money(value) { return Math.max(0, Number(value) || 0); }
function safeDate(value) { const date = String(value || ""); return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null; }
function clean(value, max) { return String(value || "").replace(/[<>]/g, "").trim().slice(0, max); }
async function request(path, options = {}) { const response = await fetch(`${String(process.env.SUPABASE_URL).replace(/\/$/, "")}/rest/v1/${path}`, { ...options, headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`, "Content-Type": "application/json", ...(options.headers || {}) } }); if (!response.ok) throw new Error("Database request failed"); return response.status === 204 ? [] : response.json(); }
async function one(path) { const data = await request(path); return data[0] || null; }
async function many(path) { return request(path); }
async function insert(table, body) { const data = await request(table, { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify(body) }); return data[0]; }
async function patch(table, id, body) { return request(`${table}?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify(body) }); }
async function notifyAdmin(subject, text) { if (!process.env.RESEND_API_KEY) return; await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL || "Next Print NY <onboarding@resend.dev>", to: "nextprintny@gmail.com", subject, text }) }); }
function demoPayload() { const estimate = { id: "demo-estimate", estimate_number: "NP-2026-00125", status: "sent", tax_mode: "no_tax", tax_amount: 0, shipping_amount: 25, installation_amount: 0, additional_fees: 0, discount_amount: 0, deposit_required: 600, estimate_date: "2026-07-13", expiration_date: "2026-08-12", project_title: "Brand Visibility Campaign", project_description: "Premium print materials designed for a cohesive launch campaign.", project_details: "Materials: 16pt card stock, premium vinyl and aluminum hardware.\nColors: Full color CMYK.\nFinishing: Gloss finish, hemming and grommets.\nProduction time: 7–10 business days.", terms: "A 50% deposit starts production. Artwork approval is required before printing. Final balance is due before delivery." }; const project = { id: "demo-project", estimate_id: estimate.id, customer_id: "demo-customer", project_number: estimate.estimate_number, secure_token: DEMO_TOKEN, status: "sent", payment_status: "unpaid" }; const items = [{ id: "1", title: "Business Cards", description: "16pt card stock, full color, 2 sides", quantity: 1000, unit: "pcs", unit_price: .45, discount: 0, taxable: false }, { id: "2", title: "Flyers", description: "Gloss finish, 8.5 × 11 in", quantity: 500, unit: "pcs", unit_price: .17, discount: 0, taxable: false }, { id: "3", title: "Vinyl Banner", description: "13oz vinyl, hemmed and grommets", quantity: 1, unit: "each", unit_price: 75, discount: 0, taxable: false }, { id: "4", title: "Retractable Banner Stand", description: "Premium pull-up aluminum stand", quantity: 1, unit: "each", unit_price: 120, discount: 0, taxable: false }, { id: "5", title: "Design & production", description: "Custom setup and finishing", quantity: 1, unit: "service", unit_price: 1087.5, discount: 0, taxable: false }]; return { project, estimate, customer: { id: "demo-customer", name: "Bright Ideas Marketing", contact_name: "Jordan Smith", email: "jsmith@brightideas.com", phone: "", billing_address: "" }, items, files: [{ id: "f1", name: "Project Mockup.pdf", source: "next_print", status: "proof_ready", size_bytes: 2500000 }, { id: "f2", name: "Logo_BrightIdeas.png", source: "customer", status: "received", size_bytes: 1200000 }], messages: [{ id: "m1", sender_role: "admin", body: "Thank you for reviewing your estimate. How can we help today?", created_at: new Date().toISOString() }], payments: [] }; }
