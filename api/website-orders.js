const TABLE = "business_records";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!hasSupabaseConfig()) {
    res.status(500).json({
      error: "Supabase is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel.",
    });
    return;
  }

  const order = sanitizeWebsiteOrder(req.body || {});

  if (!order.businessName || !order.phone || !order.email) {
    res.status(400).json({ error: "Business name, phone, and email are required." });
    return;
  }

  const orderNumber = buildOrderNumber();
  const record = buildBusinessRecord(order, orderNumber);

  try {
    const response = await supabaseFetch(TABLE, {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(record),
    });
    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json({
        error: data?.message || data?.error || "Could not save website request.",
      });
      return;
    }

    res.status(200).json({
      ok: true,
      orderNumber,
      amount: record.amount,
      title: record.title,
      customerName: record.customer_name,
      customerEmail: record.customer_email,
      description: record.description,
      records: data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

function buildBusinessRecord(order, orderNumber) {
  const description = [
    `Order: ${orderNumber}`,
    "Source: Website Project Portal",
    `Template: ${order.template || "Not selected"}`,
    `Plan: ${order.plan || "Not selected"}`,
    order.paymentOption ? `Payment option: ${order.paymentOption}` : "",
    order.planPrice ? `One-time price: ${order.planPrice}` : "",
    order.planDeposit ? `First payment: ${order.planDeposit}` : "",
    order.planMonthly ? `Monthly payment: ${order.planMonthly}` : "",
    order.planMonths ? `Monthly term: ${order.planMonths}` : "",
    order.domainFee ? `Domain: ${order.domainFee}` : "",
    order.maintenanceFee ? `Maintenance: ${order.maintenanceFee}` : "",
    order.businessCategory ? `Business category: ${order.businessCategory}` : "",
    order.contactName ? `Contact name: ${order.contactName}` : "",
    order.pagesNeeded.length ? `Pages needed: ${order.pagesNeeded.join(", ")}` : "",
    order.features.length ? `Features: ${order.features.join(", ")}` : "",
    order.contentBlocks.length ? `Content blocks: ${order.contentBlocks.join(", ")}` : "",
    order.projectDetails ? `Project details:\n${order.projectDetails}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    type: "order",
    status: "new",
    title: `${orderNumber} - Website Project - ${order.businessName}`,
    customer_name: order.contactName || order.businessName,
    customer_phone: order.phone,
    customer_email: order.email,
    description: clean(description, 5000),
    amount: planAmount(order),
    quantity: 1,
    due_date: defaultDueDate(),
    file_url: "",
    created_by: "website-project-portal",
  };
}

function sanitizeWebsiteOrder(input) {
  return {
    template: clean(input.template, 120),
    plan: clean(input.plan, 80),
    paymentOption: clean(input.paymentOption, 180),
    planPrice: clean(input.planPrice, 40),
    planDeposit: clean(input.planDeposit, 40),
    planMonthly: clean(input.planMonthly, 40),
    planMonths: clean(input.planMonths, 40),
    domainFee: clean(input.domainFee, 40),
    maintenanceFee: clean(input.maintenanceFee, 40),
    businessName: clean(input.businessName, 140),
    contactName: clean(input.contactName, 140),
    phone: clean(input.phone, 80),
    email: clean(input.email, 140),
    businessCategory: clean(input.businessCategory, 120),
    pagesNeeded: cleanList(input.pagesNeeded, 14, 80),
    features: cleanList(input.features, 20, 100),
    contentBlocks: cleanList(input.contentBlocks, 20, 120),
    projectDetails: clean(input.projectDetails, 3500),
  };
}

function cleanList(value, maxItems, maxLength) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => clean(item, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

function planAmount(order) {
  const selectedAmount = parseMoney(order.planDeposit || order.planPrice);
  if (selectedAmount) return selectedAmount;

  const normalized = String(order.plan || "").toLowerCase();

  if (normalized.includes("basic")) return 499;
  if (normalized.includes("growth")) return 1000;
  if (normalized.includes("master")) return 1600;

  return 0;
}

function parseMoney(value) {
  const amount = Number(String(value || "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

function defaultDueDate() {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);
  return toDateInputValue(dueDate);
}

function buildOrderNumber() {
  const now = new Date();
  const date = now.toISOString().slice(2, 10).replace(/-/g, "");
  const time = now.toISOString().slice(11, 19).replace(/:/g, "");
  return `NP-${date}-${time}`;
}

function toDateInputValue(date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
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
