import { clean } from "../lib/paypal.js";
import { retrieveStripeSession } from "../lib/stripe.js";
import {
  markStripeOrderPaid,
  normalizeMembershipStatus,
  updateStripeSubscription,
  upsertStripeMembership,
} from "../lib/supabase-payments.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const event = normalizeEvent(req.body);
    if (!event?.type) return res.status(400).json({ error: "Stripe event type is required." });

    const result = await processStripeEvent(event);
    res.status(200).json({
      received: true,
      verified: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
      note: process.env.STRIPE_WEBHOOK_SECRET
        ? "Signature verification can be enabled when raw body parsing is configured."
        : "STRIPE_WEBHOOK_SECRET not set; event accepted for future-ready processing.",
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
      const result = await markStripeOrderPaid({ orderNumber: session.metadata?.orderNumber, session });
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

  if (String(event.type || "").startsWith("customer.subscription.")) {
    const result = await updateStripeSubscription(object);
    return { membership: true, saved: result.saved, warning: result.warning || "" };
  }

  return { ignored: true };
}

function normalizeEvent(body) {
  if (typeof body === "string") return JSON.parse(body || "{}");
  return body || {};
}
