const TO_EMAIL = "nextprintny@gmail.com";
const DEFAULT_FROM_EMAIL = "Next Print NY <onboarding@resend.dev>";
const MAX_FILE_SIZE_BASE64 = 17 * 1024 * 1024;
const ZELLE_ACCOUNT = "2393337935";

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

  const totalFileSize = order.files.reduce((total, file) => total + String(file.content || "").length, 0);
  if (totalFileSize > MAX_FILE_SIZE_BASE64) {
    res.status(413).json({ error: "File too large" });
    return;
  }

  const orderNumber = buildOrderNumber();

  try {
    const emailResult = await sendOrderEmails(order, orderNumber, req);
    const saveResult = await saveOrderRecord(order, orderNumber);

    res.status(200).json({
      ok: true,
      orderNumber,
      whatsappUrl: buildWhatsappUrl(order, orderNumber),
      saved: saveResult.saved,
      warning: [saveResult.warning, emailResult.warning].filter(Boolean).join(" | "),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function sendOrderEmails(order, orderNumber, req) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY missing");
  }

  const adminResult = await sendAdminOrderEmail(order, orderNumber, apiKey);
  const customerResult = order.email
    ? await sendCustomerOrderEmail(order, orderNumber, apiKey, publicBaseUrl(req))
    : { ok: false, warning: "Customer email not included" };

  return {
    ok: adminResult.ok,
    warning: customerResult.warning || "",
  };
}

async function sendAdminOrderEmail(order, orderNumber, apiKey) {
  const selectedLanguage = order.language === "en" ? "English" : "Español";
  const html = `
    <h2>Nueva orden web - ${escapeHtml(orderNumber)}</h2>
    <p><strong>Servicio:</strong> ${escapeHtml(order.service)}</p>
    <p><strong>Cliente:</strong> ${escapeHtml(order.name)}</p>
    <p><strong>Teléfono:</strong> ${escapeHtml(order.phone)}</p>
    <p><strong>Email:</strong> ${escapeHtml(order.email || "No incluido")}</p>
    <p><strong>Idioma:</strong> ${selectedLanguage}</p>
    <p><strong>Fecha necesaria:</strong> ${escapeHtml(order.dueDate || "No incluida")}</p>
    <p><strong>Precio:</strong> ${escapeHtml(order.budget || "No incluido")}</p>
    <p><strong>Zelle:</strong> ${escapeHtml(ZELLE_ACCOUNT)}</p>
    <p><strong>Nota para pago:</strong> Order ${escapeHtml(orderNumber)}</p>
    <p><strong>Detalles:</strong></p>
    <p>${escapeHtml(order.details).replace(/\n/g, "<br>")}</p>
  `;

  const attachments = order.files.map((file) => ({
    filename: file.name,
    content: file.content,
  }));

  await sendResendEmail(apiKey, {
    to: TO_EMAIL,
    replyTo: order.email,
    subject: `Nueva orden web ${orderNumber} - ${order.service}`,
    html,
    attachments,
  });

  return { ok: true, warning: "" };
}

async function sendCustomerOrderEmail(order, orderNumber, apiKey, baseUrl) {
  const isEnglish = order.language === "en";
  const trackUrl = `${baseUrl}/tracking.html?order=${encodeURIComponent(orderNumber)}`;
  const payUrl = `${baseUrl}/payments.html`;
  const subject = isEnglish
    ? `Next Print NY received your order ${orderNumber}`
    : `Next Print NY recibió tu orden ${orderNumber}`;
  const greeting = isEnglish ? `Hi ${escapeHtml(order.name)},` : `Hola ${escapeHtml(order.name)},`;
  const intro = isEnglish
    ? "We received your request. Keep this order number for tracking and payment reference."
    : "Recibimos tu solicitud. Guarda este número para rastrear tu orden y usarlo como referencia de pago.";
  const paymentCopy = isEnglish
    ? "If we confirm a total or deposit, you can pay by Zelle using the information below."
    : "Cuando confirmemos el total o depósito, puedes pagar por Zelle usando esta información.";
  const nextStep = isEnglish
    ? "We will review your request and contact you with the next step."
    : "Vamos a revisar tu solicitud y te contactaremos con el próximo paso.";
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#07142f;line-height:1.55">
      <h2 style="color:#05275c;margin-bottom:8px">${subject}</h2>
      <p>${greeting}</p>
      <p>${intro}</p>
      <p><strong>Order number:</strong> ${escapeHtml(orderNumber)}</p>
      <p><strong>Service:</strong> ${escapeHtml(order.service)}</p>
      <p><strong>Customer:</strong> ${escapeHtml(order.name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(order.phone)}</p>
      <p><strong>Date needed:</strong> ${escapeHtml(order.dueDate || (isEnglish ? "Not included" : "No incluida"))}</p>
      <div style="border-left:4px solid #03bfe7;background:#f2fcff;padding:14px 16px;margin:18px 0">
        <h3 style="margin:0 0 8px;color:#05275c">Zelle</h3>
        <p style="margin:0 0 6px">${paymentCopy}</p>
        <p style="margin:0"><strong>${isEnglish ? "Send to" : "Enviar a"}:</strong> ${escapeHtml(ZELLE_ACCOUNT)}</p>
        <p style="margin:0"><strong>${isEnglish ? "Note" : "Nota"}:</strong> Order ${escapeHtml(orderNumber)}</p>
      </div>
      <p><a href="${escapeHtml(trackUrl)}" style="color:#05275c;font-weight:bold">${isEnglish ? "Track your order" : "Rastrear tu orden"}</a></p>
      <p><a href="${escapeHtml(payUrl)}" style="color:#05275c;font-weight:bold">${isEnglish ? "Payment instructions" : "Instrucciones de pago"}</a></p>
      <p>${nextStep}</p>
      <p style="color:#66708a">Next Print NY<br />239 333 7935</p>
    </div>
  `;

  try {
    await sendResendEmail(apiKey, {
      to: order.email,
      replyTo: TO_EMAIL,
      subject,
      html,
    });
    return { ok: true, warning: "" };
  } catch (error) {
    return { ok: false, warning: `Customer email failed: ${error.message}` };
  }
}

async function sendResendEmail(apiKey, message) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL,
      to: message.to,
      ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      subject: message.subject,
      html: message.html,
      ...(message.attachments?.length ? { attachments: message.attachments } : {}),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Could not send order email");
  }

  return response.json();
}

async function saveOrderRecord(order, orderNumber) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { saved: false, warning: "Supabase not configured" };
  }

  const description = [
    `Order: ${orderNumber}`,
    `Service: ${order.service}`,
    `Details: ${order.details}`,
    order.budget ? `Price: ${order.budget}` : "",
    order.files.length ? `Files: ${order.files.map((file) => file.name).join(", ")}` : "",
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
  const filesInput = Array.isArray(input.files) ? input.files : input.file ? [input.file] : [];
  const files = filesInput
    .filter((file) => file?.name && file?.content)
    .slice(0, 8)
    .map((file) => ({
      name: clean(file.name, 180),
      content: String(file.content || ""),
    }));

  return {
    language: input.language === "en" ? "en" : "es",
    service: clean(input.service, 80),
    details: clean(input.details, 1500),
    dueDate: clean(input.dueDate, 20),
    budget: clean(input.budget, 80),
    name: clean(input.name, 120),
    phone: clean(input.phone, 80),
    email: clean(input.email, 120),
    files,
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

function publicBaseUrl(req) {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (envUrl) return String(envUrl).startsWith("http") ? String(envUrl).replace(/\/$/, "") : `https://${envUrl}`;

  const host = req.headers.host || "next-print-ny.vercel.app";
  const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
  return `${protocol}://${host}`;
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
