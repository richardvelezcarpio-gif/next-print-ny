import {
  buildReturnUrl,
  clean,
  hasPayPalConfig,
  moneyToPayPalValue,
  paypalFetch,
  sanitizeCheckoutInput,
  verifyPayPalWebhook,
} from "../lib/paypal.js";

const TABLE = "business_records";
const SUPPORT_EMAIL = "nextprintny@gmail.com";
const DEFAULT_FROM_EMAIL = "Next Print NY <onboarding@resend.dev>";
const CUSTOMER_EMAIL_MARKER = "Customer confirmation email sent";

export default async function handler(req, res) {
  const action = paypalAction(req);

  if (action === "create") {
    await createPayPalOrder(req, res);
    return;
  }

  if (action === "config") {
    handlePayPalConfig(req, res);
    return;
  }

  if (action === "capture") {
    await capturePayPalOrder(req, res);
    return;
  }

  if (action === "webhook") {
    await handlePayPalWebhook(req, res);
    return;
  }

  res.status(404).json({ error: "Unknown PayPal action." });
}

function handlePayPalConfig(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const clientId = clean(process.env.PAYPAL_CLIENT_ID, 260);

  res.status(200).json({
    ok: true,
    enabled: Boolean(clientId),
    clientId,
    currency: "USD",
    environment: process.env.PAYPAL_ENV === "live" ? "live" : "sandbox",
  });
}

async function createPayPalOrder(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!hasPayPalConfig()) {
    res.status(500).json({
      error: "PayPal is not configured. Add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in Vercel.",
    });
    return;
  }

  const checkout = sanitizeCheckoutInput(req.body || {});
  const amount = moneyToPayPalValue(checkout.amount);

  if (!checkout.orderNumber) {
    res.status(400).json({ error: "Order number is required." });
    return;
  }

  if (!amount) {
    res.status(400).json({ error: "A valid checkout amount is required." });
    return;
  }

  try {
    const returnUrl = buildReturnUrl(req, checkout.successPath, {
      checkout: "paypal-return",
      order: checkout.orderNumber,
    });
    const cancelUrl = buildReturnUrl(req, checkout.cancelPath, {
      checkout: "cancelled",
      order: checkout.orderNumber,
    });
    const description = checkout.description || `Next Print NY order ${checkout.orderNumber}`;

    const paypalOrder = await paypalFetch("/v2/checkout/orders", {
      method: "POST",
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            custom_id: checkout.orderNumber,
            description,
            amount: {
              currency_code: checkout.currency || "USD",
              value: amount,
            },
          },
        ],
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

    const approvalUrl = (paypalOrder.links || []).find((link) => {
      return link.rel === "payer-action" || link.rel === "approve";
    })?.href;

    if (!approvalUrl) {
      throw new Error("PayPal did not return an approval URL.");
    }

    res.status(200).json({
      ok: true,
      provider: "paypal",
      id: paypalOrder.id,
      url: approvalUrl,
      approvalUrl,
      amount: Number(amount),
      orderNumber: checkout.orderNumber,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Could not create PayPal checkout." });
  }
}

async function capturePayPalOrder(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!hasPayPalConfig()) {
    res.status(500).json({
      error: "PayPal is not configured. Add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in Vercel.",
    });
    return;
  }

  const orderNumber = normalizeOrderNumber(req.body?.orderNumber);
  const paypalOrderId = clean(req.body?.paypalOrderId || req.body?.token, 120);

  if (!orderNumber || !paypalOrderId) {
    res.status(400).json({ error: "Order number and PayPal token are required." });
    return;
  }

  try {
    const capture = await paypalFetch(`/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`, {
      method: "POST",
      body: "{}",
    });
    const status = clean(capture.status, 40);

    if (status !== "COMPLETED") {
      res.status(400).json({ error: `PayPal payment is ${status || "not complete"}.` });
      return;
    }

    const payment = capture.purchase_units?.[0]?.payments?.captures?.[0] || {};
    const result = await updatePaidRecordIfPossible(orderNumber, paypalOrderId, payment, req);

    res.status(200).json({
      ok: true,
      captured: true,
      saved: result.saved,
      warning: result.warning,
      emailSent: result.emailSent,
      emailWarning: result.emailWarning,
      status,
      orderNumber,
      paypalOrderId,
      captureId: payment.id || "",
      amount: payment.amount?.value || "",
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Could not confirm PayPal payment." });
  }
}

async function handlePayPalWebhook(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const event = req.body || {};
    const verification = await verifyPayPalWebhook(req, event);

    if (!verification.ok) {
      res.status(200).json({
        received: true,
        ignored: true,
        reason: verification.reason || verification.status || "PayPal webhook not verified",
      });
      return;
    }

    if (String(event.event_type || "").startsWith("BILLING.SUBSCRIPTION.")) {
      const membershipResult = await updateMemberSubscription(event);
      res.status(200).json({ received: true, membership: true, ...membershipResult, eventType: event.event_type || "" });
      return;
    }

    const orderNumber = orderNumberFromPayPalEvent(event);
    if (!orderNumber) {
      res.status(200).json({ received: true, ignored: true, reason: "No Next Print NY order number in event." });
      return;
    }

    const resource = event.resource || {};
    const paypalOrderId = clean(
      resource.supplementary_data?.related_ids?.order_id || resource.id || event.id,
      120
    );
    const result = await updatePaidRecordIfPossible(orderNumber, paypalOrderId, resource, req);

    res.status(200).json({
      received: true,
      orderNumber,
      saved: result.saved,
      warning: result.warning,
      emailSent: result.emailSent,
      emailWarning: result.emailWarning,
      eventType: event.event_type || "",
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Could not process PayPal webhook." });
  }
}

async function updateMemberSubscription(event) {
  if (!hasSupabaseConfig()) return { saved: false, warning: "Supabase is not configured." };
  const resource = event.resource || {};
  const subscriptionId = clean(resource.id, 160);
  const userId = clean(resource.custom_id, 80);
  const statusMap = { ACTIVE: "active", SUSPENDED: "suspended", CANCELLED: "cancelled", EXPIRED: "suspended", APPROVAL_PENDING: "approval_pending" };
  const status = statusMap[String(resource.status || "").toUpperCase()] || "approval_pending";
  const record = {
    status,
    paypal_subscription_id: subscriptionId,
    paypal_plan_id: clean(resource.plan_id, 160),
    current_period_start: resource.start_time || null,
    current_period_end: resource.billing_info?.next_billing_time || null,
    updated_at: new Date().toISOString(),
  };
  const filter = userId
    ? `user_id=eq.${encodeURIComponent(userId)}`
    : `paypal_subscription_id=eq.${encodeURIComponent(subscriptionId)}`;
  const response = await supabaseFetch(`member_memberships?${filter}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(record),
  });
  const data = await response.json().catch(() => []);
  if (!response.ok) return { saved: false, warning: data?.message || "Could not update membership." };
  return { saved: true, status, subscriptionId };
}

async function updatePaidRecordIfPossible(orderNumber, paypalOrderId, payment, req) {
  if (!hasSupabaseConfig()) {
    return {
      saved: false,
      warning: "Supabase is not configured, so the payment was captured but the admin record was not updated.",
      emailSent: false,
      emailWarning: "Customer confirmation email was not sent because Supabase is not configured.",
    };
  }

  const result = await markOrderPaid(orderNumber, paypalOrderId, payment, req);
  return {
    saved: result.updated,
    warning: result.warning || "",
    emailSent: result.emailSent,
    emailWarning: result.emailWarning || "",
  };
}

async function markOrderPaid(orderNumber, paypalOrderId, payment, req) {
  const record = await findOrderRecord(orderNumber);

  if (!record?.id) {
    throw new Error(`Order ${orderNumber} was not found in Supabase.`);
  }

  const paidAt = new Date().toISOString();
  const paidAmount = moneyToPayPalValue(payment.amount?.value);
  const currentDescription = String(record.description || "");
  const paymentAlreadyRecorded = currentDescription.includes(paypalOrderId);
  const emailAlreadySent = currentDescription.includes(CUSTOMER_EMAIL_MARKER);
  const note = [
    "PayPal payment received",
    `PayPal order: ${paypalOrderId}`,
    payment.id ? `PayPal capture: ${clean(payment.id, 120)}` : "",
    paidAmount ? `Paid amount: $${paidAmount}` : "",
    `Paid at: ${paidAt}`,
  ]
    .filter(Boolean)
    .join("\n");
  const description = paymentAlreadyRecorded
    ? currentDescription
    : clean([currentDescription, note].filter(Boolean).join("\n\n"), 5000);

  if (!paymentAlreadyRecorded || record.status !== "paid") {
    const response = await supabaseFetch(`${TABLE}?id=eq.${encodeURIComponent(record.id)}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        status: "paid",
        description,
        updated_at: paidAt,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || data?.error || "Could not mark order as paid.");
    }
  }

  if (!record.customer_email) {
    return {
      updated: true,
      emailSent: false,
      emailWarning: "Customer email is missing, so no confirmation email was sent.",
    };
  }

  if (emailAlreadySent) {
    return { updated: true, emailSent: false, emailWarning: "" };
  }

  const emailResult = await trySendCustomerConfirmationEmail({
    record,
    orderNumber,
    paypalOrderId,
    payment,
    paidAt,
    req,
  });

  if (!emailResult.sent) {
    return {
      updated: true,
      emailSent: false,
      emailWarning: emailResult.warning,
    };
  }

  const emailNote = `${CUSTOMER_EMAIL_MARKER}: ${new Date().toISOString()}`;
  const descriptionWithEmail = clean([description, emailNote].filter(Boolean).join("\n\n"), 5000);
  const emailResponse = await supabaseFetch(`${TABLE}?id=eq.${encodeURIComponent(record.id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      description: descriptionWithEmail,
      updated_at: new Date().toISOString(),
    }),
  });

  if (!emailResponse.ok) {
    const data = await emailResponse.text();
    return {
      updated: true,
      emailSent: true,
      emailWarning: data || "Confirmation email was sent, but the email marker could not be saved.",
    };
  }

  return { updated: true, emailSent: true, emailWarning: "" };
}

async function findOrderRecord(orderNumber) {
  const query = new URLSearchParams({
    select: "id,title,description,status,amount,customer_name,customer_email,type",
    type: "eq.order",
    order: "created_at.desc",
    limit: "1",
  });
  query.set("or", `(title.ilike.*${orderNumber}*,description.ilike.*${orderNumber}*)`);

  const response = await supabaseFetch(`${TABLE}?${query.toString()}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Could not look up order.");
  }

  return Array.isArray(data) ? data[0] : null;
}

async function trySendCustomerConfirmationEmail(details) {
  try {
    await sendCustomerConfirmationEmail(details);
    return { sent: true, warning: "" };
  } catch (error) {
    return { sent: false, warning: `Customer confirmation email failed: ${error.message}` };
  }
}

async function sendCustomerConfirmationEmail({ record, orderNumber, paypalOrderId, payment, paidAt, req }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY missing");

  const baseUrl = publicBaseUrl(req);
  const invoiceUrl = `${baseUrl}/invoice.html?order=${encodeURIComponent(orderNumber)}`;
  const trackingUrl = `${baseUrl}/tracking.html?order=${encodeURIComponent(orderNumber)}`;
  const paidAmount = moneyToPayPalValue(payment.amount?.value) || moneyToPayPalValue(record.amount);
  const customerName = clean(record.customer_name, 120) || "customer";
  const subject = `Next Print NY payment received - Order ${orderNumber}`;

  await sendResendEmail(apiKey, {
    to: record.customer_email,
    replyTo: SUPPORT_EMAIL,
    subject,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#07142f;line-height:1.55;max-width:640px;margin:0 auto">
        <h2 style="color:#05275c;margin-bottom:8px">Payment received</h2>
        <p>Hi ${escapeHtml(customerName)},</p>
        <p>Thank you for your payment. Your Next Print NY order is confirmed.</p>
        <div style="background:#eef7ff;border:1px solid #cfe5ff;border-radius:12px;padding:18px;margin:20px 0">
          <p style="margin:0 0 8px"><strong>Order number:</strong> ${escapeHtml(orderNumber)}</p>
          ${paidAmount ? `<p style="margin:0 0 8px"><strong>Amount paid:</strong> ${escapeHtml(money(Number(paidAmount)))}</p>` : ""}
          <p style="margin:0 0 8px"><strong>PayPal order:</strong> ${escapeHtml(paypalOrderId)}</p>
          <p style="margin:0"><strong>Paid at:</strong> ${escapeHtml(formatDateTime(paidAt))}</p>
        </div>
        <p>You can keep this email for your records. We will contact you if we need anything else for your order.</p>
        <p><a href="${escapeHtml(invoiceUrl)}" style="color:#05275c;font-weight:bold">Open invoice / receipt</a></p>
        <p><a href="${escapeHtml(trackingUrl)}" style="color:#05275c;font-weight:bold">Track your order</a></p>
        <p style="color:#66708a">Next Print NY<br />239 333 7935<br />${escapeHtml(SUPPORT_EMAIL)}</p>
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
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Could not send confirmation email");
  }

  return response.json();
}

function paypalAction(req) {
  const url = new URL(req.url, `https://${req.headers.host || "localhost"}`);
  const explicitAction = clean(url.searchParams.get("action") || req.body?.action, 40);
  if (explicitAction) return explicitAction;
  if (req.headers["paypal-transmission-id"]) return "webhook";
  if (req.body?.paypalOrderId || req.body?.token) return "capture";
  return "create";
}

function orderNumberFromPayPalEvent(event) {
  const resource = event.resource || {};
  const candidates = [
    resource.custom_id,
    resource.invoice_id,
    resource.purchase_units?.[0]?.custom_id,
    resource.purchase_units?.[0]?.payments?.captures?.[0]?.custom_id,
    event.summary,
  ];

  for (const value of candidates) {
    const normalized = normalizeOrderNumber(value);
    if (normalized) return normalized;
  }

  return "";
}

function hasSupabaseConfig() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function publicBaseUrl(req) {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (envUrl) return String(envUrl).startsWith("http") ? String(envUrl).replace(/\/$/, "") : `https://${envUrl}`;

  const host = req.headers.host || "next-print-ny.vercel.app";
  const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
  return `${protocol}://${host}`;
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

function normalizeOrderNumber(value) {
  return String(value || "")
    .match(/\bNP-[a-zA-Z0-9-]+\b/)?.[0]
    ?.replace(/[^a-zA-Z0-9-]/g, "")
    .trim()
    .slice(0, 32)
    .toUpperCase() || "";
}

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value || 0);
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value || "");
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/New_York",
  });
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
