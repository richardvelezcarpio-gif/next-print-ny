import crypto from "node:crypto";
import webpush from "web-push";
import { requireAdmin } from "../lib/admin-auth.js";

const TABLES = { customers: "portal_customers", estimates: "portal_estimates", items: "portal_estimate_items", projects: "portal_projects", files: "portal_files", messages: "portal_messages", payments: "portal_payments" };
const DEMO_TOKEN = "np_demo_8xK29mQa72";
const ZELLE = { recipientName: "Richard Velez", recipientNumber: "(239) 333-7935" };
const PUSH_SUBSCRIPTIONS = "portal_push_subscriptions";

export default async function handler(req, res) {
  try {
    const action = String(req.query?.action || req.body?.action || "");
    if (req.query?.endpoint === "notifications") return notificationHandler(req, res);
    if (req.method === "GET" && action === "admin") return adminList(req, res);
    if (req.method === "GET") return publicProject(req, res);
    if (req.method === "POST" && action === "payment") return reportPayment(req, res);
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
  res.status(200).json({ project, estimate, customer, items, files, messages, payments, zelle: ZELLE });
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
  await notifyAdmin(`Zelle payment pending verification: ${project.project_number}`, `A Zelle payment of $${amount.toFixed(2)} was reported.`);
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

async function createEstimate(req, res) {
  if (!requireAdmin(req, res)) return;
  const input = req.body || {};
  if (!configured()) return res.status(503).json({ error: "Supabase configuration is required to create estimates" });
  const customer = await insert(TABLES.customers, { name: clean(input.customer?.name, 120), contact_name: clean(input.customer?.contactName, 120), email: clean(input.customer?.email, 160) });
  const number = `NP-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
  const estimate = await insert(TABLES.estimates, { estimate_number: number, customer_id: customer.id, status: "sent", tax_mode: ["no_tax", "custom", "tax_exempt"].includes(input.taxMode) ? input.taxMode : "no_tax", tax_amount: Number(input.taxAmount) || 0, shipping_amount: Number(input.shipping) || 0, notes: clean(input.notes, 2000) });
  const items = Array.isArray(input.items) ? input.items.slice(0, 30) : [];
  await Promise.all(items.map((item, position) => insert(TABLES.items, { estimate_id: estimate.id, position, title: clean(item.title, 160), description: clean(item.description, 800), quantity: Math.max(1, Number(item.quantity) || 1), unit_price: Math.max(0, Number(item.unitPrice) || 0) })));
  const project = await insert(TABLES.projects, { estimate_id: estimate.id, customer_id: customer.id, project_number: number, secure_token: `np_${crypto.randomBytes(18).toString("base64url")}`, status: "sent", payment_status: "unpaid" });
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
function clean(value, max) { return String(value || "").replace(/[<>]/g, "").trim().slice(0, max); }
async function request(path, options = {}) { const response = await fetch(`${String(process.env.SUPABASE_URL).replace(/\/$/, "")}/rest/v1/${path}`, { ...options, headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`, "Content-Type": "application/json", ...(options.headers || {}) } }); if (!response.ok) throw new Error("Database request failed"); return response.status === 204 ? [] : response.json(); }
async function one(path) { const data = await request(path); return data[0] || null; }
async function many(path) { return request(path); }
async function insert(table, body) { const data = await request(table, { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify(body) }); return data[0]; }
async function patch(table, id, body) { return request(`${table}?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify(body) }); }
async function notifyAdmin(subject, text) { if (!process.env.RESEND_API_KEY) return; await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL || "Next Print NY <onboarding@resend.dev>", to: "nextprintny@gmail.com", subject, text }) }); }
function demoPayload() { const estimate = { id: "demo-estimate", estimate_number: "NP-2026-00125", status: "sent", tax_mode: "no_tax", tax_amount: 0, shipping_amount: 25, notes: "Thank you for the opportunity to work with us." }; const project = { id: "demo-project", estimate_id: estimate.id, customer_id: "demo-customer", project_number: estimate.estimate_number, secure_token: DEMO_TOKEN, status: "sent", payment_status: "unpaid" }; const items = [{ id: "1", title: "Business Cards", description: "16pt card stock, full color, 2 sides", quantity: 1000, unit_price: .45 }, { id: "2", title: "Flyers", description: "Gloss finish, 8.5 × 11 in", quantity: 500, unit_price: .17 }, { id: "3", title: "Vinyl Banner", description: "13oz vinyl, hemmed and grommets", quantity: 1, unit_price: 75 }, { id: "4", title: "Retractable Banner Stand", description: "Premium pull-up aluminum stand", quantity: 1, unit_price: 120 }, { id: "5", title: "Design & production", description: "Custom setup and finishing", quantity: 1, unit_price: 1087.5 }]; return { project, estimate, customer: { id: "demo-customer", name: "Bright Ideas Marketing", contact_name: "Jordan Smith", email: "jsmith@brightideas.com" }, items, files: [{ id: "f1", name: "Project Mockup.pdf", source: "next_print", status: "proof_ready", size_bytes: 2500000 }, { id: "f2", name: "Logo_BrightIdeas.png", source: "customer", status: "received", size_bytes: 1200000 }], messages: [{ id: "m1", sender_role: "admin", body: "Thank you for reviewing your estimate. How can we help today?", created_at: new Date().toISOString() }], payments: [], zelle: ZELLE }; }
