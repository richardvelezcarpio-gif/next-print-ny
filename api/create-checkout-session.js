const DEFAULT_CURRENCY = "usd";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    res.status(500).json({
      error: "Stripe is not configured. Add STRIPE_SECRET_KEY in Vercel.",
    });
    return;
  }

  const checkout = sanitizeCheckoutInput(req.body || {});
  const amountCents = moneyToCents(checkout.amount);

  if (!checkout.orderNumber) {
    res.status(400).json({ error: "Order number is required." });
    return;
  }

  if (!amountCents) {
    res.status(400).json({ error: "A valid checkout amount is required." });
    return;
  }

  try {
    const origin = publicBaseUrl(req);
    const successUrl = buildReturnUrl(origin, checkout.successPath, {
      checkout: "success",
      order: checkout.orderNumber,
      session_id: "{CHECKOUT_SESSION_ID}",
    });
    const cancelUrl = buildReturnUrl(origin, checkout.cancelPath, {
      checkout: "cancelled",
      order: checkout.orderNumber,
    });
    const metadata = buildMetadata(checkout);
    const description = checkout.description || `Next Print NY order ${checkout.orderNumber}`;
    const sessionPayload = {
      mode: "payment",
      payment_method_types: ["card"],
      client_reference_id: checkout.orderNumber,
      customer_email: checkout.customerEmail || undefined,
      success_url: successUrl,
      cancel_url: cancelUrl,
      phone_number_collection: {
        enabled: true,
      },
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description,
          metadata,
        },
      },
      line_items: [
        {
          price_data: {
            currency: checkout.currency,
            unit_amount: amountCents,
            product_data: {
              name: checkout.itemName,
              description,
            },
          },
          quantity: 1,
        },
      ],
      metadata,
      payment_intent_data: {
        metadata,
      },
    };

    const session = await stripeFetch("/v1/checkout/sessions", sessionPayload);

    res.status(200).json({
      ok: true,
      id: session.id,
      url: session.url,
      amount: centsToMoney(amountCents),
      orderNumber: checkout.orderNumber,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Could not create checkout session." });
  }
}

async function stripeFetch(path, payload) {
  const response = await fetch(`https://api.stripe.com${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: toFormBody(payload),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Stripe checkout request failed.");
  }

  return data;
}

function sanitizeCheckoutInput(input) {
  return {
    orderNumber: clean(input.orderNumber, 80),
    itemName: clean(input.itemName, 160) || "Next Print NY Order",
    amount: clean(input.amount, 40),
    currency: clean(input.currency, 10).toLowerCase() || DEFAULT_CURRENCY,
    customerEmail: clean(input.customerEmail, 160),
    customerName: clean(input.customerName, 160),
    source: clean(input.source, 80),
    paymentOption: clean(input.paymentOption, 220),
    plan: clean(input.plan, 80),
    monthlyAmount: clean(input.monthlyAmount, 40),
    monthlyTerm: clean(input.monthlyTerm, 40),
    domainFee: clean(input.domainFee, 40),
    maintenanceFee: clean(input.maintenanceFee, 40),
    fulfillment: clean(input.fulfillment, 40),
    shippingAddress: clean(input.shippingAddress, 300),
    description: clean(input.description, 1000),
    successPath: normalizePath(input.successPath, "/payments.html"),
    cancelPath: normalizePath(input.cancelPath, "/payments.html"),
  };
}

function buildMetadata(checkout) {
  return {
    order_number: checkout.orderNumber,
    source: checkout.source || "next-print-ny",
    customer_name: checkout.customerName,
    payment_option: checkout.paymentOption,
    plan: checkout.plan,
    monthly_amount: checkout.monthlyAmount,
    monthly_term: checkout.monthlyTerm,
    domain_fee: checkout.domainFee,
    maintenance_fee: checkout.maintenanceFee,
    fulfillment: checkout.fulfillment,
    shipping_address: checkout.shippingAddress,
  };
}

function toFormBody(value, params = new URLSearchParams(), prefix = "") {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      toFormBody(item, params, `${prefix}[${index}]`);
    });
    return params;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => {
      if (item === undefined || item === null || item === "") return;
      const nextPrefix = prefix ? `${prefix}[${key}]` : key;
      toFormBody(item, params, nextPrefix);
    });
    return params;
  }

  if (prefix) params.append(prefix, String(value));
  return params;
}

function buildReturnUrl(origin, path, query) {
  const url = new URL(path, origin);
  Object.entries(query).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });
  return url.toString().replace("%7BCHECKOUT_SESSION_ID%7D", "{CHECKOUT_SESSION_ID}");
}

function normalizePath(value, fallback) {
  const path = clean(value, 240);
  if (!path) return fallback;
  if (path.startsWith("https://") || path.startsWith("http://")) return path;
  return path.startsWith("/") ? path : `/${path}`;
}

function publicBaseUrl(req) {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (envUrl) return String(envUrl).startsWith("http") ? String(envUrl).replace(/\/$/, "") : `https://${envUrl}`;

  const host = req.headers.host || "localhost:4178";
  const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
  return `${protocol}://${host}`;
}

function moneyToCents(value) {
  const amount = Number(String(value || "").replace(/[^0-9.-]/g, ""));
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return Math.round(amount * 100);
}

function centsToMoney(value) {
  return Number((Number(value || 0) / 100).toFixed(2));
}

function clean(value, limit) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, limit);
}
