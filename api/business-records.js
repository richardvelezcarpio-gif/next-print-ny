import { requireAdmin } from "./_admin-auth.js";

const TABLE = "business_records";
const ALLOWED_TYPES = new Set(["order", "income", "expense", "inventory", "customer", "document"]);
const ALLOWED_STATUSES = new Set(["new", "in_progress", "waiting", "paid", "completed", "cancelled"]);

export default async function handler(req, res) {
  const session = requireAdmin(req, res);
  if (!session) return;

  if (!hasSupabaseConfig()) {
    res.status(500).json({
      error: "Supabase is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel.",
    });
    return;
  }

  try {
    if (req.method === "GET") {
      await listRecords(req, res);
      return;
    }

    if (req.method === "POST") {
      await createRecord(req, res, session);
      return;
    }

    if (req.method === "PATCH") {
      await updateRecord(req, res);
      return;
    }

    if (req.method === "DELETE") {
      await deleteRecord(req, res);
      return;
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function listRecords(req, res) {
  const url = new URL(req.url, `https://${req.headers.host || "localhost"}`);
  const type = sanitizeType(url.searchParams.get("type"));
  const status = sanitizeStatus(url.searchParams.get("status"));
  const query = new URLSearchParams({
    select: "*",
    order: "created_at.desc",
    limit: "200",
  });

  if (type) query.set("type", `eq.${type}`);
  if (status) query.set("status", `eq.${status}`);

  const response = await supabaseFetch(`${TABLE}?${query.toString()}`);
  const records = await response.json();
  sendSupabaseResponse(res, response, records);
}

async function createRecord(req, res, session) {
  const record = sanitizeRecord(req.body || {});
  record.created_by = session.email;

  const response = await supabaseFetch(TABLE, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(record),
  });
  const data = await response.json();
  sendSupabaseResponse(res, response, data);
}

async function updateRecord(req, res) {
  const id = String(req.body?.id || "").trim();
  if (!id) {
    res.status(400).json({ error: "Record id is required" });
    return;
  }

  const record = sanitizeRecord(req.body || {}, { partial: true });
  record.updated_at = new Date().toISOString();
  delete record.id;

  const response = await supabaseFetch(`${TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(record),
  });
  const data = await response.json();
  sendSupabaseResponse(res, response, data);
}

async function deleteRecord(req, res) {
  const url = new URL(req.url, `https://${req.headers.host || "localhost"}`);
  const id = String(url.searchParams.get("id") || "").trim();

  if (!id) {
    res.status(400).json({ error: "Record id is required" });
    return;
  }

  const response = await supabaseFetch(`${TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  if (response.ok) {
    res.status(200).json({ ok: true });
    return;
  }

  const data = await response.json();
  sendSupabaseResponse(res, response, data);
}

function sanitizeRecord(input, options = {}) {
  const partial = Boolean(options.partial);
  const record = {};
  const type = sanitizeType(input.type);
  const status = sanitizeStatus(input.status);

  if (!partial && !type) {
    throw new Error("Valid record type is required");
  }

  if (type || !partial) record.type = type;
  if (status || !partial) record.status = status || "new";
  if ("title" in input) record.title = clean(input.title, 160);
  if ("customer_name" in input) record.customer_name = clean(input.customer_name, 120);
  if ("customer_phone" in input) record.customer_phone = clean(input.customer_phone, 80);
  if ("customer_email" in input) record.customer_email = clean(input.customer_email, 120);
  if ("description" in input) record.description = clean(input.description, 1000);
  if ("amount" in input) {
    const amount = Number(input.amount || 0);
    record.amount = Number.isFinite(amount) ? amount : 0;
  }
  if ("quantity" in input) {
    const quantity = Number(input.quantity || 0);
    record.quantity = Number.isFinite(quantity) ? quantity : 0;
  }
  if ("due_date" in input) {
    const dueDate = String(input.due_date || "").trim();
    record.due_date = dueDate || null;
  }
  if ("file_url" in input) record.file_url = clean(input.file_url, 500);

  return record;
}

function sanitizeType(value) {
  const type = String(value || "").trim();
  return ALLOWED_TYPES.has(type) ? type : "";
}

function sanitizeStatus(value) {
  const status = String(value || "").trim();
  return ALLOWED_STATUSES.has(status) ? status : "";
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

function sendSupabaseResponse(res, response, data) {
  if (!response.ok) {
    res.status(response.status).json({ error: data?.message || data?.error || "Supabase request failed" });
    return;
  }

  res.status(200).json({ records: data });
}
