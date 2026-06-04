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
      select: "title,status,customer_name,due_date,amount,created_at,updated_at,description",
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
        dueDate: record.due_date || "",
        amount: Number(record.amount || 0),
        createdAt: record.created_at || "",
        updatedAt: record.updated_at || record.created_at || "",
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
