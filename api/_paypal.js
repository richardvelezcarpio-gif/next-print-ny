const DEFAULT_CURRENCY = "USD";

export function paypalBaseUrl() {
  if (process.env.PAYPAL_API_BASE) return String(process.env.PAYPAL_API_BASE).replace(/\/$/, "");
  return process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

export function hasPayPalConfig() {
  return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

export async function paypalFetch(path, options = {}) {
  const accessToken = await getPayPalAccessToken();
  const response = await fetch(`${paypalBaseUrl()}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data?.message || data?.details?.[0]?.description || "PayPal request failed.");
  }

  return data;
}

export function sanitizeCheckoutInput(input) {
  return {
    orderNumber: clean(input.orderNumber, 80),
    itemName: clean(input.itemName, 160) || "Next Print NY Order",
    amount: clean(input.amount, 40),
    currency: clean(input.currency, 10).toUpperCase() || DEFAULT_CURRENCY,
    customerEmail: clean(input.customerEmail, 160),
    customerName: clean(input.customerName, 160),
    source: clean(input.source, 80),
    paymentOption: clean(input.paymentOption, 220),
    plan: clean(input.plan, 80),
    monthlyAmount: clean(input.monthlyAmount, 40),
    monthlyTerm: clean(input.monthlyTerm, 40),
    monthlyBillingDay: clean(input.monthlyBillingDay, 20),
    firstMonthlyDueDate: clean(input.firstMonthlyDueDate, 30),
    domainFee: clean(input.domainFee, 40),
    maintenanceFee: clean(input.maintenanceFee, 40),
    maintenanceDueDate: clean(input.maintenanceDueDate, 30),
    fulfillment: clean(input.fulfillment, 40),
    shippingAddress: clean(input.shippingAddress, 300),
    description: clean(input.description, 1500),
    successPath: normalizePath(input.successPath, "/payments.html"),
    cancelPath: normalizePath(input.cancelPath, "/payments.html"),
  };
}

export function moneyToPayPalValue(value) {
  const amount = Number(String(value || "").replace(/[^0-9.-]/g, ""));
  if (!Number.isFinite(amount) || amount <= 0) return "";
  return amount.toFixed(2);
}

export function buildReturnUrl(req, path, query) {
  const url = new URL(path, publicBaseUrl(req));
  Object.entries(query).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });
  return url.toString();
}

export function clean(value, limit) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, limit);
}

async function getPayPalAccessToken() {
  if (!hasPayPalConfig()) {
    throw new Error("PayPal is not configured. Add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in Vercel.");
  }

  const credentials = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
  const response = await fetch(`${paypalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await response.json();

  if (!response.ok || !data.access_token) {
    throw new Error(data?.error_description || "Could not authenticate with PayPal.");
  }

  return data.access_token;
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
