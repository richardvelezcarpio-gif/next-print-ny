const TO_EMAIL = "nextprintny@gmail.com";
const DEFAULT_FROM_EMAIL = "Next Print NY <onboarding@resend.dev>";
const MAX_FILE_SIZE_BASE64 = 5.6 * 1024 * 1024;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const order = sanitizeOrder(req.body || {});

  if (!order.name || !order.phone || !order.service || !order.details) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  if (order.file?.content && String(order.file.content).length > MAX_FILE_SIZE_BASE64) {
    res.status(413).json({ error: "File too large" });
    return;
  }

  const orderNumber = buildOrderNumber();

  try {
    await sendOrderEmail(order, orderNumber);
    const saveResult = await saveOrderRecord(order, orderNumber);

    res.status(200).json({
      ok: true,
      orderNumber,
      whatsappUrl: buildWhatsappUrl(order, orderNumber),
      saved: saveResult.saved,
      warning: saveResult.warning,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function sendOrderEmail(order, orderNumber) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY missing");
  }

  const selectedLanguage = order.language === "en" ? "English" : "Español";
  const html = `
    <h2>Nueva orden web - ${escapeHtml(orderNumber)}</h2>
    <p><strong>Servicio:</strong> ${escapeHtml(order.service)}</p>
    <p><strong>Cliente:</strong> ${escapeHtml(order.name)}</p>
    <p><strong>Teléfono:</strong> ${escapeHtml(order.phone)}</p>
    <p><strong>Email:</strong> ${escapeHtml(order.email || "No incluido")}</p>
    <p><strong>Idioma:</strong> ${selectedLanguage}</p>
    <p><strong>Fecha necesaria:</strong> ${escapeHtml(order.dueDate || "No incluida")}</p>
    <p><strong>Presupuesto estimado:</strong> ${escapeHtml(order.budget || "No incluido")}</p>
    <p><strong>Detalles:</strong></p>
    <p>${escapeHtml(order.details).replace(/\n/g, "<br>")}</p>
  `;

  const attachments = order.file?.name && order.file?.content
    ? [
        {
          filename: order.file.name,
          content: order.file.content,
        },
      ]
    : [];

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL,
      to: TO_EMAIL,
      ...(order.email ? { reply_to: order.email } : {}),
      subject: `Nueva orden web ${orderNumber} - ${order.service}`,
      html,
      ...(attachments.length ? { attachments } : {}),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Could not send order email");
  }
}

async function saveOrderRecord(order, orderNumber) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { saved: false, warning: "Supabase not configured" };
  }

  const description = [
    `Order: ${orderNumber}`,
    `Service: ${order.service}`,
    `Details: ${order.details}`,
    order.budget ? `Budget: ${order.budget}` : "",
    order.file?.name ? `File: ${order.file.name}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const record = {
    type: "order",
    status: "new",
    title: `${orderNumber} - ${order.service}`,
    customer_name: order.name,
    customer_phone: order.phone,
    customer_email: order.email,
    description,
    amount: 0,
    quantity: 0,
    due_date: order.dueDate || null,
    file_url: "",
    created_by: "website-order",
  };

  const baseUrl = String(process.env.SUPABASE_URL).replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const response = await fetch(`${baseUrl}/rest/v1/business_records`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(record),
  });

  if (!response.ok) {
    const data = await response.text();
    return { saved: false, warning: data || "Could not save order" };
  }

  return { saved: true, warning: "" };
}

function sanitizeOrder(input) {
  const file = input.file?.name && input.file?.content
    ? {
        name: clean(input.file.name, 180),
        content: String(input.file.content || ""),
      }
    : null;

  return {
    language: input.language === "en" ? "en" : "es",
    service: clean(input.service, 80),
    details: clean(input.details, 1500),
    dueDate: clean(input.dueDate, 20),
    budget: clean(input.budget, 80),
    name: clean(input.name, 120),
    phone: clean(input.phone, 80),
    email: clean(input.email, 120),
    file,
  };
}

function buildOrderNumber() {
  const now = new Date();
  const date = now.toISOString().slice(2, 10).replace(/-/g, "");
  const time = now.toISOString().slice(11, 19).replace(/:/g, "");
  return `NP-${date}-${time}`;
}

function buildWhatsappUrl(order, orderNumber) {
  const message = [
    `Hello Next Print NY, I submitted order ${orderNumber}.`,
    `Service: ${order.service}`,
    `Name: ${order.name}`,
    `Phone: ${order.phone}`,
  ].join("\n");

  return `https://wa.me/12393337935?text=${encodeURIComponent(message)}`;
}

function clean(value, limit) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, limit);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
