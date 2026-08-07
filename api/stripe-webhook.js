import { clean } from "../lib/paypal.js";
import Stripe from "stripe";
import { retrieveStripePaymentIntent, retrieveStripeSession } from "../lib/stripe.js";
import {
  markStripeOrderPaid,
  markStripeOrderFailed,
  markStripeOrderRefunded,
  normalizeMembershipStatus,
  updateStripeSubscription,
  upsertStripeMembership,
} from "../lib/supabase-payments.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.STRIPE_WEBHOOK_SECRET || !process.env.STRIPE_SECRET_KEY) {
    return res.status(503).json({ error: "Stripe webhook verification is not configured." });
  }

  try {
    const signature = req.headers["stripe-signature"];
    if (!signature) return res.status(400).json({ error: "Stripe signature is required." });
    const rawBody = await readRawBody(req);
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    let event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
      return res.status(400).json({ error: `Invalid Stripe signature: ${error.message}` });
    }

    const result = await processStripeEvent(event);
    res.status(200).json({
      received: true,
      verified: true,
      eventType: event.type,
      ...result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Could not process Stripe webhook." });
  }
}

async function processStripeEvent(event) {
  const object = event.data?.object || {};

  if (event.type === "checkout.session.completed") {
    if (object.mode === "payment") {
      const session = object.payment_status ? object : await retrieveStripeSession(object.id);
      const result = await markStripeOrderPaid({ orderNumber: session.metadata?.orderNumber, session, eventId: event.id });
      return { payment: true, saved: result.saved, warning: result.warning || "" };
    }

    if (object.mode === "subscription") {
      const session = object.subscription && typeof object.subscription === "object"
        ? object
        : await retrieveStripeSession(object.id);
      const subscription = typeof session.subscription === "object" ? session.subscription : {};
      const userId = clean(session.client_reference_id || session.metadata?.userId || subscription.metadata?.userId, 120);
      const email = clean(session.customer_details?.email || session.customer_email || session.metadata?.email || subscription.metadata?.email, 180);
      const status = normalizeMembershipStatus(subscription.status || "active");
      const nextBillingDate = subscription.current_period_end
        ? new Date(Number(subscription.current_period_end) * 1000).toISOString()
        : null;
      const result = await upsertStripeMembership({ id: userId, email }, {
        membership_status: status,
        subscription_status: clean(subscription.status, 80) || status,
        payment_status: clean(session.payment_status, 80) || "paid",
        stripe_subscription_id: clean(subscription.id || session.subscription, 180),
        stripe_customer_id: clean(session.customer, 180),
        next_billing_date: nextBillingDate,
      });
      return { membership: true, saved: result.saved, warning: result.warning || "" };
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const result = await markStripeOrderFailed({ orderNumber: object.metadata?.orderNumber, paymentIntent: object, eventId: event.id });
    return { paymentFailed: true, saved: result.saved, warning: result.warning || "" };
  }

  if (event.type === "charge.refunded") {
    const paymentIntent = typeof object.payment_intent === "object"
      ? object.payment_intent
      : await retrieveStripePaymentIntent(object.payment_intent);
    const result = await markStripeOrderRefunded({ orderNumber: paymentIntent?.metadata?.orderNumber || object.metadata?.orderNumber, charge: object, paymentIntent, eventId: event.id });
    return { refunded: true, saved: result.saved, warning: result.warning || "" };
  }

  if (String(event.type || "").startsWith("customer.subscription.")) {
    const result = await updateStripeSubscription(object);
    return { membership: true, saved: result.saved, warning: result.warning || "" };
  }

  return { ignored: true };
}

export const config = { api: { bodyParser: false } };

function readRawBody(req) {
  if (Buffer.isBuffer(req.body)) return Promise.resolve(req.body);
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}
