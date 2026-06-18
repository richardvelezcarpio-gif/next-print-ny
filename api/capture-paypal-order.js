import { clean, hasPayPalConfig, moneyToPayPalValue, paypalFetch } from "./_paypal.js";

const TABLE = "business_records";

export default async function handler(req, res) {
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
    let saved = false;
    let warning = "";

    if (hasSupabaseConfig()) {
      const result = await markOrderPaid(orderNumber, paypalOrderId, payment);
      saved = result.updated;
    } else {
      warning = "Supabase is not configured, so the payment was captured but the admin record was not updated.";
    }

    res.status(200).json({
      ok: true,
      captured: true,
      saved,
      warning,
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
    .replace(/[^a-zA-Z0-9-]/g, "")
    .trim()
    .slice(0, 32)
    .toUpperCase();
}
