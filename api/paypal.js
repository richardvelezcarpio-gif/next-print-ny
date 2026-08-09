import {
  buildReturnUrl,
  clean,
  hasPayPalConfig,
  paypalFetch,
  sanitizeCheckoutInput,
  verifyPayPalWebhook,
} from "../lib/paypal.js";
import {
  ensureUsdRequest,
  isCapturedOrder,
  moneyToPayPal,
  validatePayPalCapture,
  validatePayPalCreate,
} from "../lib/paypal-order-validation.js";
import {
  buildAdminNotification,
  buildCustomerReceipt,
  canSendPaidNotifications,
  emailNotificationsConfigured,
  EMAIL_ATTEMPT_MARKER,
  paidEmailWasAttempted,
} from "../lib/paypal-paid-email.js";
import { normalizeSupabaseSecret, normalizeSupabaseUrl } from "../lib/supabase-url.js";

const TABLE = "business_records";
const SUPPORT_EMAIL = "nextprintny@gmail.com";
const DEFAULT_FROM_EMAIL = "Next Print NY <onboarding@resend.dev>";

export default async function handler(req, res) {
  const action = paypalAction(req);
  if (action === "config") return handlePayPalConfig(req, res);
  if (action === "create") return createPayPalOrder(req, res);
  if (action === "capture") return capturePayPalOrder(req, res);
  if (action === "webhook") return handlePayPalWebhook(req, res);
  return res.status(404).json({ error: "Unknown PayPal action." });
}

function handlePayPalConfig(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const clientId = clean(process.env.PAYPAL_CLIENT_ID, 260);
  return res.status(200).json({
    ok: true,
    enabled: Boolean(clientId),
    clientId,
    currency: "USD",
    environment: process.env.PAYPAL_ENVIRONMENT === "live" ? "live" : "sandbox",
  });
}

async function createPayPalOrder(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!hasPayPalConfig() || !hasSupabaseConfig()) return res.status(500).json({ error: "PayPal or order storage is not configured." });

  const checkout = sanitizeCheckoutInput(req.body || {});
  if (!checkout.internalOrderId && !checkout.orderNumber) return res.status(400).json({ error: "An existing internal order is required." });

  try {
    ensureUsdRequest(checkout.currency);
    // Older invoice/payment links carry only orderNumber. They can only resolve a record
    // that already has a structured internal id; no client price or currency is accepted.
    const record = checkout.internalOrderId
      ? await findOrderByInternalId(checkout.internalOrderId)
      : await findOrderByNumber(checkout.orderNumber);
    const stored = validatePayPalCreate(record, record.internal_order_id);

    if (record.paypal_order_id) {
      const existing = await paypalFetch(`/v2/checkout/orders/${encodeURIComponent(record.paypal_order_id)}`);
      const approvalUrl = approvalLink(existing);
      if (!approvalUrl) throw new Error("A PayPal order is already active for this checkout. Please resume or cancel it before retrying.");
      return res.status(200).json(paypalResponse(existing, record, stored.amount, approvalUrl, true));
    }

    const returnUrl = buildReturnUrl(req, checkout.successPath, { checkout: "paypal-return", order: record.order_number, internal: record.internal_order_id });
    const cancelUrl = buildReturnUrl(req, checkout.cancelPath, { checkout: "cancelled", order: record.order_number, internal: record.internal_order_id });
    const paypalOrder = await paypalFetch("/v2/checkout/orders", {
      method: "POST",
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          custom_id: record.internal_order_id,
          invoice_id: record.order_number,
          description: `Next Print NY order ${record.order_number}`,
          amount: { currency_code: "USD", value: stored.amount },
        }],
        payment_source: {
          paypal: {
            experience_context: {
              brand_name: "Next Print NY",
              user_action: "PAY_NOW",
              shipping_preference: "NO_SHIPPING",
              return_url: returnUrl,
              cancel_url: cancelUrl,
            },
          },
        },
      }),
    });
    const approvalUrl = approvalLink(paypalOrder);
    if (!paypalOrder.id || !approvalUrl) throw new Error("PayPal did not return an approval URL.");

    const persisted = await persistPayPalOrderId(record, paypalOrder.id);
    if (!persisted.ok) throw new Error(persisted.error);
    const activeOrder = persisted.record;
    if (activeOrder.paypal_order_id !== paypalOrder.id) {
      const existing = await paypalFetch(`/v2/checkout/orders/${encodeURIComponent(activeOrder.paypal_order_id)}`);
      const existingApproval = approvalLink(existing);
      if (!existingApproval) throw new Error("A concurrent payment request created an active PayPal order. Please retry.");
      return res.status(200).json(paypalResponse(existing, activeOrder, stored.amount, existingApproval, true));
    }
    return res.status(200).json(paypalResponse(paypalOrder, activeOrder, stored.amount, approvalUrl, false));
  } catch (error) {
    return res.status(400).json({ error: publicError(error, "Could not create PayPal checkout.") });
  }
}

async function capturePayPalOrder(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!hasPayPalConfig() || !hasSupabaseConfig()) return res.status(500).json({ error: "PayPal or order storage is not configured." });

  const internalOrderId = clean(req.body?.internalOrderId, 80);
  const paypalOrderId = clean(req.body?.paypalOrderId || req.body?.token, 120);
  if (!internalOrderId || !paypalOrderId) return res.status(400).json({ error: "Internal order id and PayPal order id are required." });

  try {
    let record = await findOrderByInternalId(internalOrderId);
    if (isCapturedOrder(record, paypalOrderId)) return res.status(200).json(idempotentCaptureResponse(record));
    if (record?.paypal_capture_id) throw new Error("This order already has a captured payment and requires review.");

    const paypalOrder = await paypalFetch(`/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}`);
    validatePayPalCapture({ record, internalOrderId, paypalOrderId, paypalOrder });
    const capture = await paypalFetch(`/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`, { method: "POST", body: "{}" });
    if (clean(capture.status, 40) !== "COMPLETED") throw new Error(`PayPal payment is ${clean(capture.status, 40) || "not complete"}.`);

    const payment = capture.purchase_units?.[0]?.payments?.captures?.[0] || {};
    if (!payment.id || payment.status !== "COMPLETED" || payment.amount?.currency_code !== "USD" || payment.amount?.value !== moneyToPayPal(record.amount)) {
      throw new Error("PayPal capture does not match the persisted USD order total.");
    }

    const saved = await persistPaidCapture(record, payment.id);
    if (!saved.ok) throw new Error(saved.error);
    record = saved.record;
    const email = await sendPaidNotificationsOnce(record, req);
    return res.status(200).json({
      ok: true,
      captured: true,
      saved: true,
      idempotent: saved.idempotent,
      emailSent: email.sent,
      emailWarning: email.warning,
      status: "COMPLETED",
      orderNumber: record.order_number,
      internalOrderId: record.internal_order_id,
      paypalOrderId: record.paypal_order_id,
      captureId: record.paypal_capture_id,
      amount: moneyToPayPal(record.amount),
      currency: "USD",
    });
  } catch (error) {
    return res.status(400).json({ error: publicError(error, "Could not confirm PayPal payment.") });
  }
}

async function handlePayPalWebhook(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const event = req.body || {};
    const verification = await verifyPayPalWebhook(req, event);
    if (!verification.ok) return res.status(200).json({ received: true, ignored: true });
    if (String(event.event_type || "").startsWith("BILLING.SUBSCRIPTION.")) {
      return res.status(200).json({ received: true, membership: true, ...(await updateMemberSubscription(event)) });
    }
    // Checkout capture is confirmed by the authenticated server-side capture route. A verified
    // PayPal webhook is acknowledged but never allowed to mark an order paid on its own.
    return res.status(200).json({ received: true, ignored: true, reason: "Checkout capture is confirmed server-side." });
  } catch (error) {
    return res.status(500).json({ error: publicError(error, "Could not process PayPal webhook.") });
  }
}

async function findOrderByInternalId(internalOrderId) {
  const query = new URLSearchParams({
    select: "id,internal_order_id,order_number,title,quantity,payment_status,status,payment_provider,currency,subtotal,shipping_amount,tax_amount,amount,delivery_address,customer_name,customer_email,customer_phone,description,paypal_order_id,paypal_capture_id,paid_at,created_at,updated_at",
    internal_order_id: `eq.${internalOrderId}`,
    type: "eq.order",
    limit: "1",
  });
  const response = await supabaseFetch(`${TABLE}?${query.toString()}`);
  const data = await response.json().catch(() => []);
  if (!response.ok) throw new Error(data?.message || data?.error || "Could not look up the stored order.");
  const record = Array.isArray(data) ? data[0] : null;
  if (!record?.id) throw new Error("Stored internal order was not found.");
  return record;
}

async function findOrderByNumber(orderNumber) {
  const query = new URLSearchParams({
    select: "id,internal_order_id,order_number,title,quantity,payment_status,status,payment_provider,currency,subtotal,shipping_amount,tax_amount,amount,delivery_address,customer_name,customer_email,customer_phone,description,paypal_order_id,paypal_capture_id,paid_at,created_at,updated_at",
    order_number: `eq.${clean(orderNumber, 80)}`,
    type: "eq.order",
    limit: "1",
  });
  const response = await supabaseFetch(`${TABLE}?${query.toString()}`);
  const data = await response.json().catch(() => []);
  if (!response.ok) throw new Error(data?.message || data?.error || "Could not look up the stored order.");
  const record = Array.isArray(data) ? data[0] : null;
  if (!record?.id || !record.internal_order_id) throw new Error("Stored internal order was not found.");
  return record;
}

async function persistPayPalOrderId(record, paypalOrderId) {
  const now = new Date().toISOString();
  const response = await supabaseFetch(`${TABLE}?id=eq.${encodeURIComponent(record.id)}&paypal_order_id=is.null&payment_status=in.(pending_payment,payment_failed)`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal,count=exact" },
    body: JSON.stringify({ paypal_order_id: paypalOrderId, payment_provider: "paypal", updated_at: now }),
  });
  if (response.ok && rowsWereUpdated(response)) return { ok: true, record: { ...record, paypal_order_id: paypalOrderId, payment_provider: "paypal", updated_at: now } };
  const current = await findOrderByInternalId(record.internal_order_id);
  if (current.paypal_order_id) return { ok: true, record: current };
  return { ok: false, error: "Could not persist the PayPal order id." };
}

async function persistPaidCapture(record, captureId) {
  const paidAt = new Date().toISOString();
  const response = await supabaseFetch(`${TABLE}?id=eq.${encodeURIComponent(record.id)}&paypal_order_id=eq.${encodeURIComponent(record.paypal_order_id)}&payment_status=in.(pending_payment,payment_failed)`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal,count=exact" },
    body: JSON.stringify({
      status: "paid",
      payment_status: "paid",
      payment_provider: "paypal",
      paypal_capture_id: captureId,
      paid_at: paidAt,
      updated_at: paidAt,
    }),
  });
  if (response.ok && rowsWereUpdated(response)) {
    return {
      ok: true,
      record: { ...record, status: "paid", payment_status: "paid", payment_provider: "paypal", paypal_capture_id: captureId, paid_at: paidAt, updated_at: paidAt },
      idempotent: false,
    };
  }
  const current = await findOrderByInternalId(record.internal_order_id);
  if (isCapturedOrder(current, record.paypal_order_id) && current.paypal_capture_id === captureId) {
    return { ok: true, record: current, idempotent: true };
  }
  return { ok: false, error: "Could not persist the verified PayPal capture." };
}

async function sendPaidNotificationsOnce(record, req) {
  if (!emailNotificationsConfigured(process.env)) return { sent: false, warning: "Paid-order email notifications are disabled until an approved provider key and sender are configured; payment remains paid." };
  if (!canSendPaidNotifications(record)) return { sent: false, warning: "Paid-order email was skipped because the durable capture is not available." };
  if (paidEmailWasAttempted(record)) return { sent: false, warning: "" };
  const note = `${EMAIL_ATTEMPT_MARKER}: ${new Date().toISOString()}`;
  const marked = await markEmailAttempt(record, note);
  if (!marked) return { sent: false, warning: "" };
  try {
    await sendCustomerConfirmationEmail(record, req);
    await sendBusinessNotificationEmail(record);
    return { sent: true, warning: "" };
  } catch (error) {
    await appendEmailError(record, error);
    return { sent: false, warning: "Payment is paid; email delivery failed and was recorded." };
  }
}

async function markEmailAttempt(record, note) {
  const description = clean([record.description, note].filter(Boolean).join("\n\n"), 5000);
  const marker = encodeURIComponent(`*${EMAIL_ATTEMPT_MARKER}*`);
  const response = await supabaseFetch(`${TABLE}?id=eq.${encodeURIComponent(record.id)}&description=not.ilike.${marker}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal,count=exact" },
    body: JSON.stringify({ description, updated_at: new Date().toISOString() }),
  });
  return response.ok && rowsWereUpdated(response);
}

async function appendEmailError(record, error) {
  const description = clean([record.description, `Payment email delivery failed: ${clean(error?.message, 300)}`].filter(Boolean).join("\n\n"), 5000);
  await supabaseFetch(`${TABLE}?id=eq.${encodeURIComponent(record.id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ description, updated_at: new Date().toISOString() }),
  }).catch(() => null);
}

async function sendCustomerConfirmationEmail(record, req) {
  if (!record.customer_email) return;
  const message = buildCustomerReceipt(record, publicBaseUrl(req));
  await sendResendEmail({
    to: record.customer_email,
    replyTo: SUPPORT_EMAIL,
    ...message,
  });
}

async function sendBusinessNotificationEmail(record) {
  const message = buildAdminNotification(record);
  await sendResendEmail({
    to: process.env.ADMIN_NOTIFICATION_EMAIL || SUPPORT_EMAIL,
    replyTo: record.customer_email || undefined,
    ...message,
  });
}

async function sendResendEmail(message) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL, to: message.to, ...(message.replyTo ? { reply_to: message.replyTo } : {}), subject: message.subject, html: message.html }),
  });
  if (!response.ok) throw new Error("Resend rejected the paid-order notification.");
}

async function updateMemberSubscription(event) {
  if (!hasSupabaseConfig()) return { saved: false, warning: "Supabase is not configured." };
  const resource = event.resource || {};
  const record = { status: String(resource.status || "APPROVAL_PENDING").toLowerCase(), paypal_subscription_id: clean(resource.id, 160), paypal_plan_id: clean(resource.plan_id, 160), current_period_start: resource.start_time || null, current_period_end: resource.billing_info?.next_billing_time || null, updated_at: new Date().toISOString() };
  const userId = clean(resource.custom_id, 80);
  const filter = userId ? `user_id=eq.${encodeURIComponent(userId)}` : `paypal_subscription_id=eq.${encodeURIComponent(record.paypal_subscription_id)}`;
  const response = await supabaseFetch(`member_memberships?${filter}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(record) });
  return { saved: response.ok };
}

function approvalLink(order) { return (order.links || []).find((link) => link.rel === "payer-action" || link.rel === "approve")?.href || ""; }
function rowsWereUpdated(response) { return /\/(?:[1-9]\d*)$/.test(String(response.headers.get("content-range") || "")); }
function paypalResponse(order, record, amount, approvalUrl, idempotent) { return { ok: true, provider: "paypal", id: order.id, url: approvalUrl, approvalUrl, amount: Number(amount), currency: "USD", orderNumber: record.order_number, internalOrderId: record.internal_order_id, idempotent }; }
function idempotentCaptureResponse(record) { return { ok: true, captured: true, saved: true, idempotent: true, status: "COMPLETED", orderNumber: record.order_number, internalOrderId: record.internal_order_id, paypalOrderId: record.paypal_order_id, captureId: record.paypal_capture_id, amount: moneyToPayPal(record.amount), currency: "USD" }; }
function paypalAction(req) { const url = new URL(req.url, `https://${req.headers.host || "localhost"}`); return clean(url.searchParams.get("action") || req.body?.action || (req.headers["paypal-transmission-id"] ? "webhook" : ""), 40) || "create"; }
function hasSupabaseConfig() { return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY); }
function formatDeliveryAddress(address = {}) { return [address.street, address.apartment, [address.city, address.state, address.zip].filter(Boolean).join(" ")].filter(Boolean).join(", "); }
function publicBaseUrl(req) { const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL; if (envUrl) return String(envUrl).startsWith("http") ? String(envUrl).replace(/\/$/, "") : `https://${envUrl}`; const host = req.headers.host || "next-print-ny.vercel.app"; return `${host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https"}://${host}`; }
function escapeHtml(value) { return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"); }
function publicError(error, fallback) { const message = String(error?.message || fallback); return message.includes("SUPABASE") || message.includes("Bearer") ? fallback : message; }

async function supabaseFetch(path, options = {}) {
  const baseUrl = normalizeSupabaseUrl(process.env.SUPABASE_URL);
  const key = normalizeSupabaseSecret(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    return await fetch(`${baseUrl}/rest/v1/${path}`, { ...options, signal: controller.signal, headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...(options.headers || {}) } });
  } finally { clearTimeout(timeout); }
}
