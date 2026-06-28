import { clean } from "../lib/paypal.js";
import {
  createOneTimeCheckoutSession,
  normalizeStripePaymentStatus,
  retrieveStripeSession,
  stripePublicConfig,
} from "../lib/stripe.js";
import { markStripeOrderPaid } from "../lib/supabase-payments.js";

export default async function handler(req, res) {
  const action = stripeCheckoutAction(req);

  try {
    if (action === "config") return handleConfig(req, res);
    if (action === "confirm") return confirmStripePayment(req, res);
    return createStripeCheckout(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message || "Stripe checkout error." });
  }
}

function handleConfig(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  res.status(200).json({ ok: true, ...stripePublicConfig() });
}

async function createStripeCheckout(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const session = await createOneTimeCheckoutSession(req, req.body || {});
  res.status(200).json({
    ok: true,
    provider: "stripe",
    id: session.id,
    url: session.url,
    orderNumber: clean(req.body?.orderNumber, 80),
  });
}

async function confirmStripePayment(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const sessionId = clean(req.body?.sessionId || req.body?.session_id, 180);
  const orderNumber = clean(req.body?.orderNumber || req.body?.order, 80);
  if (!sessionId) return res.status(400).json({ error: "Stripe session id is required." });

  const session = await retrieveStripeSession(sessionId);
  const status = normalizeStripePaymentStatus(session);
  if (status !== "paid") {
    return res.status(400).json({ error: `Stripe payment is ${status || "not paid"}.`, status });
  }

  const sessionOrder = clean(session.metadata?.orderNumber, 80);
  if (orderNumber && sessionOrder && orderNumber !== sessionOrder) {
    return res.status(403).json({ error: "This Stripe session belongs to another order." });
  }

  const result = await markStripeOrderPaid({ orderNumber: orderNumber || sessionOrder, session });
  res.status(200).json({
    ok: true,
    paid: true,
    provider: "stripe",
    sessionId: session.id,
    orderNumber: orderNumber || sessionOrder,
    payment_status: status,
    saved: result.saved,
    warning: result.warning || "",
  });
}

function stripeCheckoutAction(req) {
  const url = new URL(req.url, `https://${req.headers.host || "localhost"}`);
  return clean(url.searchParams.get("action") || req.body?.action || "create", 40);
}
