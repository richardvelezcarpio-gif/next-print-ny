const TABLE = "business_records";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    res.status(500).json({ error: "Tracking is not configured yet" });
    return;
  }

  const url = new URL(req.url, `https://${req.headers.host || "localhost"}`);
  const orderNumber = normalizeOrderNumber(url.searchParams.get("order"));

  if (!orderNumber) {
    res.status(400).json({ error: "Order number is required" });
    return;
  }

  try {
    const query = new URLSearchParams({
      select: "title,status,customer_name,customer_phone,customer_email,due_date,amount,quantity,created_at,updated_at,description",
      type: "eq.order",
      order: "created_at.desc",
      limit: "1",
    });
    query.set("or", `(title.ilike.*${orderNumber}*,description.ilike.*${orderNumber}*)`);

    const response = await supabaseFetch(`${TABLE}?${query.toString()}`);
    const records = await response.json();

    if (!response.ok) {
      res.status(response.status).json({ error: records?.message || "Could not track order" });
      return;
    }

    if (!Array.isArray(records) || !records.length) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const record = records[0];
    res.status(200).json({
      order: {
        orderNumber,
        title: publicTitle(record.title, orderNumber),
        status: record.status || "new",
        customerName: firstName(record.customer_name),
        customerFullName: publicText(record.customer_name, 120),
        customerPhone: publicText(record.customer_phone, 80),
        customerEmail: publicText(record.customer_email, 120),
        dueDate: record.due_date || "",
        amount: recordAmount(record),
        quantity: Number(record.quantity || 0),
        createdAt: record.created_at || "",
        updatedAt: record.updated_at || record.created_at || "",
        description: publicDescription(record.description),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function supabaseFetch(path) {
  const baseUrl = String(process.env.SUPABASE_URL || "").replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    return await fetch(`${baseUrl}/rest/v1/${path}`, {
      signal: controller.signal,
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeOrderNumber(value) {
  return String(value || "")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .trim()
    .slice(0, 32)
    .toUpperCase();
}

function publicTitle(title, orderNumber) {
  return String(title || orderNumber)
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, 120);
}

function firstName(value) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 1)
    .join(" ");
}

function publicText(value, limit) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, limit);
}

function publicDescription(value) {
  return String(value || "")
    .split(/\n+/)
    .filter((line) => !/^\s*(internal notes|notas internas)\s*:/i.test(line))
    .join("\n")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, 1500);
}

function recordAmount(record) {
  const amount = Number(record.amount || 0);
  if (Number.isFinite(amount) && amount > 0) return amount;

  const priceLine = String(record.description || "").match(
    /(?:price|precio|suggested sale price)\s*:\s*\$?\s*([0-9,]+(?:\.[0-9]{1,2})?)/i
  );
  if (!priceLine) return 0;

  const parsed = Number(priceLine[1].replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}
