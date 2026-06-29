import { catalogPriceFor, memberCatalogPriceFor } from "../lib/printing-prices.js";

const TO_EMAIL = "nextprintny@gmail.com";
const DEFAULT_FROM_EMAIL = "Next Print NY <onboarding@resend.dev>";
const MAX_FILE_SIZE_BASE64 = 17 * 1024 * 1024;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const order = sanitizeOrder(req.body || {});
  const catalogPrice = catalogPriceFor(order.product, order.quantity, order.details);
  const memberCatalogPrice = memberCatalogPriceFor(order.product, order.quantity, order.details);

  if (!order.name || !order.phone || !order.service || !order.details) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  if (order.product && !catalogPrice && !memberCatalogPrice) {
    res.status(400).json({ error: "Invalid catalog product or quantity" });
    return;
  }

  if (catalogPrice) {
    const submittedAmount = parseMoney(order.budget);
    const regularAmount = parseMoney(catalogPrice);
    const memberAmount = parseMoney(memberCatalogPrice);
    const minimumAmount = Math.min(...[regularAmount, memberAmount].filter((amount) => amount > 0));
    order.budget = submittedAmount >= minimumAmount ? `$${submittedAmount.toFixed(2)}` : catalogPrice;
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
      amount: parseMoney(order.budget),
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
    ${order.product ? `<p><strong>Producto:</strong> ${escapeHtml(order.product)}</p>` : ""}
    ${order.quantity ? `<p><strong>Cantidad:</strong> ${escapeHtml(order.quantity)}</p>` : ""}
    <p><strong>Cliente:</strong> ${escapeHtml(order.name)}</p>
    <p><strong>Teléfono:</strong> ${escapeHtml(order.phone)}</p>
    <p><strong>Email:</strong> ${escapeHtml(order.email || "No incluido")}</p>
    <p><strong>Entrega:</strong> ${escapeHtml(fulfillmentLabel(order, false))}</p>
    ${order.fulfillment === "shipping" ? `<p><strong>Dirección:</strong> ${escapeHtml(formatAddress(order.address))}</p>` : ""}
    <p><strong>Idioma:</strong> ${selectedLanguage}</p>
    <p><strong>Fecha del pedido:</strong> ${escapeHtml(order.orderDate || "No incluida")}</p>
    <p><strong>Fecha de entrega:</strong> ${escapeHtml(order.dueDate || "No incluida")}</p>
    <p><strong>Precio:</strong> ${escapeHtml(order.budget || "No incluido")}</p>
    <p><strong>Número de orden:</strong> ${escapeHtml(orderNumber)}</p>
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
  const invoiceUrl = `${baseUrl}/invoice.html?order=${encodeURIComponent(orderNumber)}`;
  const subject = isEnglish
    ? `Next Print NY received your order ${orderNumber}`
    : `Next Print NY recibió tu orden ${orderNumber}`;
  const greeting = isEnglish ? `Hi ${escapeHtml(order.name)},` : `Hola ${escapeHtml(order.name)},`;
  const intro = isEnglish
    ? "We received your request. Keep this order number for tracking and payment reference."
    : "Recibimos tu solicitud. Guarda este número para rastrear tu orden y usarlo como referencia de pago.";
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
      <p><strong>${isEnglish ? "Delivery option" : "Opción de entrega"}:</strong> ${escapeHtml(fulfillmentLabel(order, isEnglish))}</p>
      ${order.fulfillment === "shipping" ? `<p><strong>${isEnglish ? "Shipping address" : "Dirección de envío"}:</strong> ${escapeHtml(formatAddress(order.address))}</p>` : ""}
      <p><strong>${isEnglish ? "Order date" : "Fecha del pedido"}:</strong> ${escapeHtml(order.orderDate || (isEnglish ? "Not included" : "No incluida"))}</p>
      <p><strong>${isEnglish ? "Delivery date" : "Fecha de entrega"}:</strong> ${escapeHtml(order.dueDate || (isEnglish ? "Not included" : "No incluida"))}</p>
      <p><a href="${escapeHtml(invoiceUrl)}" style="color:#05275c;font-weight:bold">${isEnglish ? "Open invoice / receipt" : "Abrir invoice / recibo"}</a></p>
      <p><a href="${escapeHtml(trackUrl)}" style="color:#05275c;font-weight:bold">${isEnglish ? "Track your order" : "Rastrear tu orden"}</a></p>
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
    order.product ? `Product: ${order.product}` : "",
    order.quantity ? `Quantity: ${order.quantity}` : "",
    `Details: ${order.details}`,
    order.fulfillment ? `Fulfillment: ${fulfillmentLabel(order)}` : "",
    order.fulfillment === "shipping" ? `Shipping address: ${formatAddress(order.address)}` : "",
    order.orderDate ? `Order date: ${order.orderDate}` : "",
    order.dueDate ? `Delivery date: ${order.dueDate}` : "",
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
    amount: parseMoney(order.budget),
    quantity: order.quantity,
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
    product: clean(input.product, 120),
    details: clean(input.details, 1500),
    orderDate: clean(input.orderDate, 20),
    dueDate: clean(input.dueDate, 20),
    budget: clean(input.budget, 80),
    quantity: parseQuantity(input.quantity),
    name: clean(input.name, 120),
    phone: clean(input.phone, 80),
    email: clean(input.email, 120),
    fulfillment: input.fulfillment === "pickup" ? "pickup" : input.fulfillment === "shipping" ? "shipping" : "",
    address: sanitizeAddress(input.address || {}),
    files,
  };
}

function sanitizeAddress(input) {
  return {
    street: clean(input.street, 180),
    apartment: clean(input.apartment, 80),
    city: clean(input.city, 100),
    state: clean(input.state, 30),
    zip: clean(input.zip, 30),
  };
}

function fulfillmentLabel(order, isEnglish = true) {
  if (order.fulfillment === "pickup") return isEnglish ? "Pickup store" : "Recogida en tienda";
  if (order.fulfillment === "shipping") return isEnglish ? "Shipping" : "Envío";
  return isEnglish ? "Not selected" : "No seleccionado";
}

function formatAddress(address = {}) {
  return [
    address.street,
    address.apartment,
    [address.city, address.state, address.zip].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(", ");
}

function buildOrderNumber() {
  const now = new Date();
  const date = now.toISOString().slice(2, 10).replace(/-/g, "");
  const time = now.toISOString().slice(11, 19).replace(/:/g, "");
  return `NP-${date}-${time}`;
}

function parseMoney(value) {
  const amount = Number(String(value || "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

function parseQuantity(value) {
  const quantity = Number.parseInt(String(value || "0"), 10);
  return Number.isFinite(quantity) && quantity > 0 ? quantity : 0;
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
