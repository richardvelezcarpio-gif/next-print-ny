import { clean } from "../lib/paypal.js";
import { normalizedMember, requireMemberSession } from "../lib/member-session.js";
import {
  createMembershipCheckoutSession,
  membershipNextBillingDate,
  normalizeStripePaymentStatus,
  normalizeStripeSubscriptionStatus,
  retrieveStripeSession,
} from "../lib/stripe.js";
import { normalizeMembershipStatus, upsertStripeMembership } from "../lib/supabase-payments.js";

export default async function handler(req, res) {
  const action = stripeSubscriptionAction(req);

  try {
    const session = await requireMemberSession(req, res);
    if (!session) return;
    if (action === "confirm") return confirmStripeMembership(req, res, session.user);
    return createStripeMembership(req, res, session.user);
  } catch (error) {
    res.status(500).json({ error: error.message || "Stripe membership error." });
  }
}

async function createStripeMembership(req, res, user) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const stripeSession = await createMembershipCheckoutSession(req, user);
  await upsertStripeMembership(normalizedMember(user), {
    membership_status: "approval_pending",
    subscription_status: "checkout_pending",
    payment_status: "checkout_pending",
    stripe_customer_id: stripeSession.customer,
  });

  res.status(200).json({
    ok: true,
    provider: "stripe",
    id: stripeSession.id,
    url: stripeSession.url,
  });
}

async function confirmStripeMembership(req, res, user) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const sessionId = clean(req.body?.sessionId || req.body?.session_id, 180);
  if (!sessionId) return res.status(400).json({ error: "Stripe session id is required." });

  const stripeSession = await retrieveStripeSession(sessionId);
  const ownerId = clean(stripeSession.client_reference_id || stripeSession.metadata?.userId, 120);
  if (ownerId && ownerId !== user.id) return res.status(403).json({ error: "This membership belongs to another account." });

  const paymentStatus = normalizeStripePaymentStatus(stripeSession);
  const subscriptionStatus = normalizeStripeSubscriptionStatus(stripeSession);
  const membershipStatus = normalizeMembershipStatus(subscriptionStatus);
  const nextBillingDate = membershipNextBillingDate(stripeSession);
  const subscription = typeof stripeSession.subscription === "object" ? stripeSession.subscription : {};
  const result = await upsertStripeMembership(normalizedMember(user), {
    membership_status: membershipStatus,
    subscription_status: subscriptionStatus,
    payment_status: paymentStatus,
    stripe_subscription_id: clean(subscription?.id || stripeSession.subscription, 180),
    stripe_customer_id: clean(stripeSession.customer, 180),
    next_billing_date: nextBillingDate,
    current_period_start: subscription?.current_period_start
      ? new Date(Number(subscription.current_period_start) * 1000).toISOString()
      : null,
  });

  res.status(200).json({
    ok: true,
    provider: "stripe",
    membership: {
      status: membershipStatus,
      subscription_status: subscriptionStatus,
      payment_status: paymentStatus,
      next_billing_date: nextBillingDate,
    },
    saved: result.saved,
    warning: result.warning || "",
  });
}

function stripeSubscriptionAction(req) {
  const url = new URL(req.url, `https://${req.headers.host || "localhost"}`);
  return clean(url.searchParams.get("action") || req.body?.action || "create", 40);
}
