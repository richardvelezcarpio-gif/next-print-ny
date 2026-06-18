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

export default async function handler(req, res) {
  const action = paypalAction(req);

  if (action === "create") {
    await createPayPalOrder(req, res);
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
    const result = await updatePaidRecordIfPossible(orderNumber, paypalOrderId, payment);

    res.status(200).json({
      ok: true,
      captured: true,
      saved: result.saved,
      warning: result.warning,
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
    const result = await updatePaidRecordIfPossible(orderNumber, paypalOrderId, resource);

    res.status(200).json({
      received: true,
      orderNumber,
      saved: result.saved,
      warning: result.warning,
      eventType: event.event_type || "",
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Could not process PayPal webhook." });
  }
}

async function updatePaidRecordIfPossible(orderNumber, paypalOrderId, payment) {
  if (!hasSupabaseConfig()) {
    return {
      saved: false,
      warning: "Supabase is not configured, so the payment was captured but the admin record was not updated.",
    };
  }

  const result = await markOrderPaid(orderNumber, paypalOrderId, payment);
  return { saved: result.updated, warning: "" };
}

async function markOrderPaid(orderNumber, paypalOrderId, payment) {
  const record = await findOrderRecord(orderNumber);

  if (!record?.id) {
    throw new Error(`Order ${orderNumber} was not found in Supabase.`);
  }

  const paidAt = new Date().toISOString();
  const paidAmount = moneyToPayPalValue(payment.amount?.value);
  const note = [
    "PayPal payment received",
    `PayPal order: ${paypalOrderId}`,
    payment.id ? `PayPal capture: ${clean(payment.id, 120)}` : "",
    paidAmount ? `Paid amount: $${paidAmount}` : "",
    `Paid at: ${paidAt}`,
  ]
    .filter(Boolean)
    .join("\n");
  const currentDescription = String(record.description || "");
  const description = currentDescription.includes(paypalOrderId)
    ? currentDescription
    : clean([currentDescription, note].filter(Boolean).join("\n\n"), 5000);

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

  return { updated: true };
}

async function findOrderRecord(orderNumber) {
  const query = new URLSearchParams({
    select: "id,title,description,status,amount,customer_email,type",
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
