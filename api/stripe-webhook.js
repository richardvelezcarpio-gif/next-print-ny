import crypto from "node:crypto";

const TABLE = "business_records";
const SIGNATURE_TOLERANCE_SECONDS = Number(process.env.STRIPE_WEBHOOK_TOLERANCE_SECONDS || 300);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    res.status(500).json({
      error: "Stripe webhook is not configured. Add STRIPE_WEBHOOK_SECRET in Vercel.",
    });
    return;
  }

  if (!hasSupabaseConfig()) {
    res.status(500).json({
      error: "Supabase is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel.",
    });
    return;
  }

  try {
    const rawBody = await readRawBody(req);
    verifyStripeSignature(rawBody, req.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET);

    const event = JSON.parse(rawBody.toString("utf8"));

    if (!isPaidCheckoutEvent(event)) {
      res.status(200).json({ received: true, ignored: true, type: event.type });
      return;
    }

    const session = event.data?.object || {};
    const orderNumber = normalizeOrderNumber(session.metadata?.order_number || session.client_reference_id);

    if (!orderNumber) {
      res.status(400).json({ error: "Stripe session is missing order_number metadata." });
      return;
    }

    const result = await markOrderPaid(orderNumber, session);

    res.status(200).json({
      received: true,
      orderNumber,
      updated: result.updated,
      status: result.status,
    });
  } catch (error) {
    res.status(400).json({ error: error.message || "Stripe webhook failed." });
  }
}

function isPaidCheckoutEvent(event) {
  if (event?.type === "checkout.session.completed") return true;
  if (event?.type === "checkout.session.async_payment_succeeded") return true;
  return false;
}

async function markOrderPaid(orderNumber, session) {
  const record = await findOrderRecord(orderNumber);

  if (!record?.id) {
    throw new Error(`Order ${orderNumber} was not found in Supabase.`);
  }

  const currentDescription = String(record.description || "");
  const stripeSessionId = clean(session.id, 120);
  const stripePaymentIntent = clean(session.payment_intent, 120);
  const paidAmount = centsToMoney(session.amount_total || session.amount_subtotal);
  const paidAt = new Date().toISOString();
  const stripeNote = [
    "Stripe payment received",
    stripeSessionId ? `Stripe session: ${stripeSessionId}` : "",
    stripePaymentIntent ? `Payment intent: ${stripePaymentIntent}` : "",
    paidAmount ? `Paid amount: ${money(paidAmount)}` : "",
    `Paid at: ${paidAt}`,
  ]
    .filter(Boolean)
    .join("\n");
  const description = currentDescription.includes(stripeSessionId)
    ? currentDescription
    : clean([currentDescription, stripeNote].filter(Boolean).join("\n\n"), 5000);

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

  const savedRecord = Array.isArray(data) ? data[0] : null;
  return {
    updated: true,
    status: savedRecord?.status || "paid",
  };
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

function verifyStripeSignature(rawBody, signatureHeader, secret) {
  const signature = parseStripeSignature(signatureHeader);
  if (!signature.timestamp || !signature.signatures.length) {
    throw new Error("Stripe signature header is invalid.");
  }

  const timestampSeconds = Number(signature.timestamp);
  if (!Number.isFinite(timestampSeconds)) {
    throw new Error("Stripe signature timestamp is invalid.");
  }

  const ageSeconds = Math.abs(Date.now() / 1000 - timestampSeconds);
  if (ageSeconds > SIGNATURE_TOLERANCE_SECONDS) {
    throw new Error("Stripe signature timestamp is outside the tolerance window.");
  }

  const signedPayload = `${signature.timestamp}.${rawBody.toString("utf8")}`;
  const expected = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");
  const matched = signature.signatures.some((candidate) => secureCompare(candidate, expected));

  if (!matched) {
    throw new Error("Stripe signature verification failed.");
  }
}

function parseStripeSignature(value) {
  const parts = String(value || "").split(",");
  const parsed = {
    timestamp: "",
    signatures: [],
  };

  parts.forEach((part) => {
    const [key, signatureValue] = part.split("=");
    if (key === "t") parsed.timestamp = signatureValue || "";
    if (key === "v1" && signatureValue) parsed.signatures.push(signatureValue);
  });

  return parsed;
}

function secureCompare(left, right) {
  const leftBuffer = Buffer.from(String(left || ""), "utf8");
  const rightBuffer = Buffer.from(String(right || ""), "utf8");
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

async function readRawBody(req) {
  if (Buffer.isBuffer(req.rawBody)) return req.rawBody;
  if (typeof req.rawBody === "string") return Buffer.from(req.rawBody, "utf8");
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === "string") return Buffer.from(req.body, "utf8");

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

function normalizeOrderNumber(value) {
  return String(value || "")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .trim()
    .slice(0, 32)
    .toUpperCase();
}

function centsToMoney(value) {
  const amount = Number(value || 0);
  return Number.isFinite(amount) && amount > 0 ? Number((amount / 100).toFixed(2)) : 0;
}

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value || 0);
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
