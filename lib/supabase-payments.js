import { clean, moneyToPayPalValue } from "./paypal.js";

const ORDER_TABLE = "business_records";
const MEMBERSHIP_TABLE = "member_memberships";
const MEMBERSHIP_PRICE = 35;

export function hasSupabasePaymentConfig() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function markStripeOrderPaid({ orderNumber, session }) {
  const normalizedOrder = normalizeOrderNumber(orderNumber || session?.metadata?.orderNumber);
  if (!normalizedOrder) return { saved: false, warning: "Order number is missing." };
  if (!hasSupabasePaymentConfig()) return { saved: false, warning: "Supabase is not configured." };

  const record = await findOrderRecord(normalizedOrder);
  if (!record?.id) return { saved: false, warning: `Order ${normalizedOrder} was not found in Supabase.` };

  const paidAt = new Date().toISOString();
  const stripeSessionId = clean(session?.id, 180);
  const paymentIntent = clean(session?.payment_intent, 180);
  const amount = moneyToPayPalValue(Number(session?.amount_total || 0) / 100 || record.amount);
  const note = [
    "Stripe payment received",
    stripeSessionId ? `Stripe session: ${stripeSessionId}` : "",
    paymentIntent ? `Stripe payment intent: ${paymentIntent}` : "",
    amount ? `Paid amount: $${amount}` : "",
    `Paid at: ${paidAt}`,
  ].filter(Boolean).join("\n");
  const description = String(record.description || "").includes(stripeSessionId)
    ? record.description
    : clean([record.description, note].filter(Boolean).join("\n\n"), 5000);

  const patch = {
    status: "paid",
    description,
    updated_at: paidAt,
    payment_provider: "stripe",
    payment_status: "paid",
    stripe_customer_id: clean(session?.customer, 180),
  };

  const result = await patchOrder(record.id, patch);
  if (result.ok) return { saved: true, orderNumber: normalizedOrder };

  const fallback = await patchOrder(record.id, {
    status: "paid",
    description,
    updated_at: paidAt,
  });
  return {
    saved: fallback.ok,
    orderNumber: normalizedOrder,
    warning: fallback.ok ? "Payment saved, but Stripe payment columns are not in Supabase yet." : result.warning,
  };
}

export async function upsertStripeMembership(user, values = {}) {
  if (!hasSupabasePaymentConfig()) return { saved: false, warning: "Supabase is not configured." };
  const userId = clean(user?.id || values.userId, 120);
  const email = clean(user?.email || values.email, 180);
  if (!userId || !email) return { saved: false, warning: "Member user id and email are required." };

  const status = clean(values.membership_status || values.status || "active", 80);
  const now = new Date().toISOString();
  const nextBillingDate = clean(values.next_billing_date, 80) || null;
  const fullRecord = {
    user_id: userId,
    email,
    status,
    monthly_price: MEMBERSHIP_PRICE,
    payment_provider: "stripe",
    payment_status: clean(values.payment_status || "paid", 80),
    membership_status: status,
    subscription_status: clean(values.subscription_status || status, 80),
    stripe_subscription_id: clean(values.stripe_subscription_id, 180),
    stripe_customer_id: clean(values.stripe_customer_id, 180),
    next_billing_date: nextBillingDate,
    current_period_start: clean(values.current_period_start, 80) || null,
    current_period_end: nextBillingDate,
    updated_at: now,
  };

  const response = await supabaseFetch(`${MEMBERSHIP_TABLE}?on_conflict=user_id`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(fullRecord),
  });
  if (response.ok) return { saved: true, status, userId };

  const warning = await safeResponseMessage(response);
  const legacyResponse = await supabaseFetch(`${MEMBERSHIP_TABLE}?on_conflict=user_id`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({
      user_id: userId,
      email,
      status,
      monthly_price: MEMBERSHIP_PRICE,
      current_period_start: fullRecord.current_period_start,
      current_period_end: nextBillingDate,
      updated_at: now,
    }),
  });

  return {
    saved: legacyResponse.ok,
    status,
    userId,
    warning: legacyResponse.ok ? "Membership saved, but Stripe membership columns are not in Supabase yet." : warning,
  };
}

export async function updateStripeSubscription(subscription) {
  if (!subscription?.id) return { saved: false, warning: "Stripe subscription id is missing." };
  if (!hasSupabasePaymentConfig()) return { saved: false, warning: "Supabase is not configured." };

  const userId = clean(subscription.metadata?.userId, 120);
  const email = clean(subscription.metadata?.email, 180);
  const nextBillingDate = subscription.current_period_end
    ? new Date(Number(subscription.current_period_end) * 1000).toISOString()
    : null;
  const status = normalizeMembershipStatus(subscription.status);

  if (userId && email) {
    return upsertStripeMembership({ id: userId, email }, {
      membership_status: status,
      subscription_status: clean(subscription.status, 80) || status,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer,
      next_billing_date: nextBillingDate,
      payment_status: status === "active" ? "paid" : status,
    });
  }

  const response = await supabaseFetch(`${MEMBERSHIP_TABLE}?stripe_subscription_id=eq.${encodeURIComponent(subscription.id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      status,
      payment_provider: "stripe",
      membership_status: status,
      subscription_status: clean(subscription.status, 80) || status,
      stripe_customer_id: clean(subscription.customer, 180),
      next_billing_date: nextBillingDate,
      current_period_end: nextBillingDate,
      updated_at: new Date().toISOString(),
    }),
  });

  return { saved: response.ok, status, warning: response.ok ? "" : await safeResponseMessage(response) };
}

export function normalizeMembershipStatus(status) {
  const value = clean(status, 80).toLowerCase();
  if (["active", "trialing"].includes(value)) return "active";
  if (["canceled", "cancelled"].includes(value)) return "cancelled";
  if (["past_due", "unpaid", "incomplete_expired"].includes(value)) return "suspended";
  return value || "approval_pending";
}

async function findOrderRecord(orderNumber) {
  const query = new URLSearchParams({
    select: "id,title,description,status,amount,customer_name,customer_email,type",
    type: "eq.order",
    order: "created_at.desc",
    limit: "1",
  });
  query.set("or", `(title.ilike.*${orderNumber}*,description.ilike.*${orderNumber}*)`);
  const response = await supabaseFetch(`${ORDER_TABLE}?${query.toString()}`);
  const data = await response.json().catch(() => []);
  if (!response.ok) throw new Error(data?.message || data?.error || "Could not look up order.");
  return Array.isArray(data) ? data[0] || null : null;
}

async function patchOrder(id, patch) {
  const response = await supabaseFetch(`${ORDER_TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(patch),
  });
  return { ok: response.ok, warning: response.ok ? "" : await safeResponseMessage(response) };
}

async function supabaseFetch(path, options = {}) {
  const baseUrl = String(process.env.SUPABASE_URL || "").replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return fetch(`${baseUrl}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
}

async function safeResponseMessage(response) {
  const data = await response.json().catch(() => null);
  return data?.message || data?.error || response.statusText || "Supabase update failed.";
}

function normalizeOrderNumber(value) {
  return String(value || "")
    .match(/\bNP-[a-zA-Z0-9-]+\b/)?.[0]
    ?.replace(/[^a-zA-Z0-9-]/g, "")
    .trim()
    .slice(0, 32)
    .toUpperCase() || "";
}
