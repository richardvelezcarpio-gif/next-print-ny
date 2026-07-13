import { buildReturnUrl, clean, moneyToPayPalValue, sanitizeCheckoutInput } from "./paypal.js";

const STRIPE_API_BASE = "https://api.stripe.com/v1";
const MEMBERSHIP_PRICE = 35;

export function hasStripeConfig() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function hasStripeSubscriptionConfig() {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_MEMBERSHIP_PRICE_ID);
}

export function stripePublicConfig() {
  return {
    enabled: Boolean(process.env.VITE_STRIPE_PUBLISHABLE_KEY && process.env.STRIPE_SECRET_KEY),
    publishableKey: clean(process.env.VITE_STRIPE_PUBLISHABLE_KEY, 260),
  };
}

export async function createOneTimeCheckoutSession(req, input) {
  if (!hasStripeConfig()) throw new Error("Stripe is not configured.");

  const checkout = sanitizeCheckoutInput(input || {});
  const amountCents = moneyToCents(checkout.amount);

  if (!checkout.orderNumber) throw new Error("Order number is required.");
  if (!amountCents) throw new Error("A valid checkout amount is required.");

  const successUrl = stripeReturnUrl(req, checkout.successPath, {
    checkout: "stripe-success",
    order: checkout.orderNumber,
    session_id: "{CHECKOUT_SESSION_ID}",
  });
  const cancelUrl = buildReturnUrl(req, checkout.cancelPath, {
    checkout: "cancelled",
    order: checkout.orderNumber,
  });

  return stripeFetch("/checkout/sessions", {
    method: "POST",
    body: stripeForm({
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: checkout.customerEmail || undefined,
      billing_address_collection: "auto",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: (checkout.currency || "USD").toLowerCase(),
            unit_amount: amountCents,
            product_data: {
              name: checkout.itemName || `Next Print NY Order ${checkout.orderNumber}`,
              description: checkout.description || `Next Print NY order ${checkout.orderNumber}`,
            },
          },
        },
      ],
      metadata: stripeMetadata({
        orderNumber: checkout.orderNumber,
        source: checkout.source,
        paymentOption: checkout.paymentOption,
        plan: checkout.plan,
        fulfillment: checkout.fulfillment,
      }),
      payment_intent_data: {
        metadata: stripeMetadata({
          orderNumber: checkout.orderNumber,
          source: checkout.source,
          paymentProvider: "stripe",
        }),
      },
    }),
  });
}

export async function createMembershipCheckoutSession(req, user) {
  if (!hasStripeSubscriptionConfig()) {
    throw new Error("Stripe membership is not configured.");
  }

  const successUrl = stripeReturnUrl(req, "/member-dashboard.html", {
    membership: "stripe-return",
    session_id: "{CHECKOUT_SESSION_ID}",
  });
  const cancelUrl = buildReturnUrl(req, "/membership.html", {
    membership: "cancelled",
  });

  return stripeFetch("/checkout/sessions", {
    method: "POST",
    body: stripeForm({
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: clean(user?.email, 180) || undefined,
      client_reference_id: clean(user?.id, 120),
      payment_method_types: ["card"],
      line_items: [
        {
          price: clean(process.env.STRIPE_MEMBERSHIP_PRICE_ID, 180),
          quantity: 1,
        },
      ],
      metadata: stripeMetadata({
        userId: user?.id,
        email: user?.email,
        source: "next-print-pro-membership",
        monthlyPrice: MEMBERSHIP_PRICE,
      }),
      subscription_data: {
        metadata: stripeMetadata({
          userId: user?.id,
          email: user?.email,
          source: "next-print-pro-membership",
        }),
      },
    }),
  });
}

export async function retrieveStripeSession(sessionId) {
  const id = clean(sessionId, 180);
  if (!id) throw new Error("Stripe session id is required.");
  return stripeFetch(`/checkout/sessions/${encodeURIComponent(id)}?expand[]=subscription`);
}

export async function retrieveStripeSubscription(subscriptionId) {
  const id = clean(subscriptionId, 180);
  if (!id) return null;
  return stripeFetch(`/subscriptions/${encodeURIComponent(id)}`);
}

export function membershipNextBillingDate(session) {
  const subscription = session?.subscription && typeof session.subscription === "object"
    ? session.subscription
    : null;
  const unix = subscription?.current_period_end;
  if (!unix) return null;
  return new Date(Number(unix) * 1000).toISOString();
}

export function normalizeStripePaymentStatus(session) {
  const value = clean(session?.payment_status || session?.status, 80).toLowerCase();
  if (value === "paid" || value === "complete") return "paid";
  if (value === "unpaid") return "unpaid";
  return value || "pending";
}

export function normalizeStripeSubscriptionStatus(session) {
  const subscription = session?.subscription && typeof session.subscription === "object"
    ? session.subscription
    : null;
  return clean(subscription?.status || session?.status, 80).toLowerCase() || "pending";
}

export function moneyToCents(value) {
  const amount = Number(moneyToPayPalValue(value));
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return Math.round(amount * 100);
}

async function stripeFetch(path, options = {}) {
  if (!hasStripeConfig()) throw new Error("Stripe is not configured.");
  const response = await fetch(`${STRIPE_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      ...(options.body instanceof URLSearchParams ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data?.error?.message || "Stripe request failed.");
  }

  return data;
}

function stripeForm(data) {
  const params = new URLSearchParams();
  appendStripeParam(params, "", data);
  return params;
}

function appendStripeParam(params, prefix, value) {
  if (value === undefined || value === null || value === "") return;
  if (Array.isArray(value)) {
    value.forEach((entry, index) => appendStripeParam(params, `${prefix}[${index}]`, entry));
    return;
  }
  if (typeof value === "object") {
    Object.entries(value).forEach(([key, entry]) => {
      appendStripeParam(params, prefix ? `${prefix}[${key}]` : key, entry);
    });
    return;
  }
  params.append(prefix, String(value));
}

function stripeReturnUrl(req, path, query) {
  return buildReturnUrl(req, path, query)
    .replace(/%7B/g, "{")
    .replace(/%7D/g, "}");
}

function stripeMetadata(values) {
  return Object.fromEntries(
    Object.entries(values)
      .map(([key, value]) => [key, clean(value, 500)])
      .filter(([, value]) => value)
  );
}
