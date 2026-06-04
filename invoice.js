const invoiceLookupForm = document.querySelector("#invoiceLookupForm");
const invoiceLookupInput = document.querySelector("#invoiceLookupInput");
const invoiceStatus = document.querySelector("#invoiceStatus");
const invoiceCard = document.querySelector("#invoiceCard");
const invoicePrintButton = document.querySelector("#invoicePrintButton");
const invoicePayLink = document.querySelector("#invoicePayLink");
const invoiceTrackLink = document.querySelector("#invoiceTrackLink");
const invoiceKind = document.querySelector("#invoiceKind");
const invoiceNumber = document.querySelector("#invoiceNumber");
const invoiceStatusLabel = document.querySelector("#invoiceStatusLabel");
const invoiceCustomer = document.querySelector("#invoiceCustomer");
const invoiceCustomerInfo = document.querySelector("#invoiceCustomerInfo");
const invoiceOrderDate = document.querySelector("#invoiceOrderDate");
const invoiceDueDate = document.querySelector("#invoiceDueDate");
const invoiceItems = document.querySelector("#invoiceItems");
const invoiceNotes = document.querySelector("#invoiceNotes");
const invoiceSubtotal = document.querySelector("#invoiceSubtotal");
const invoiceTotal = document.querySelector("#invoiceTotal");
const invoiceZelleNote = document.querySelector("#invoiceZelleNote");

const statusLabels = {
  new: "Received",
  in_progress: "In review",
  waiting: "Waiting",
  paid: "Payment received",
  completed: "Completed",
  cancelled: "Cancelled",
};

const params = new URLSearchParams(window.location.search);
const initialOrder = normalizeOrderNumber(params.get("order"));
const shouldPrint = params.get("print") === "1";

if (initialOrder && invoiceLookupInput) {
  invoiceLookupInput.value = initialOrder;
  window.setTimeout(() => openInvoice(initialOrder), 150);
}

invoiceLookupForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  openInvoice(invoiceLookupInput.value);
});

invoicePrintButton?.addEventListener("click", () => window.print());

async function openInvoice(value) {
  const orderNumber = normalizeOrderNumber(value);
  if (!orderNumber) return;

  setInvoiceStatus("Loading invoice...");
  invoiceCard.hidden = true;

  try {
    const response = await fetch(`/api/track-order?order=${encodeURIComponent(orderNumber)}`, { cache: "no-store" });
    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Invoice not found");

    renderInvoice(data.order);
    setInvoiceStatus("");
    invoiceCard.hidden = false;
    if (shouldPrint) {
      window.setTimeout(() => window.print(), 500);
    }
  } catch (error) {
    setInvoiceStatus("Invoice not found. Check the order number or contact us.", "error");
  }
}

function renderInvoice(order) {
  const details = parseOrderDetails(order.description);
  const amount = Number(order.amount || details.price || 0);
  const quantity = details.quantity || Number(order.quantity || 1) || 1;
  const product = details.product || cleanTitle(order.title, order.orderNumber);
  const itemPrice = amount || details.price || 0;
  const statusText = statusLabels[order.status] || order.status || "Received";
  const isReceipt = ["paid", "completed"].includes(order.status);

  invoiceKind.textContent = isReceipt ? "RECEIPT" : "INVOICE";
  invoiceNumber.textContent = order.orderNumber;
  invoiceStatusLabel.textContent = statusText;
  invoiceCustomer.textContent = order.customerFullName || order.customerName || "Customer";
  invoiceCustomerInfo.innerHTML = [order.customerPhone, order.customerEmail].filter(Boolean).map(escapeHtml).join("<br />") || "-";
  invoiceOrderDate.textContent = formatDate(order.createdAt);
  invoiceDueDate.textContent = order.dueDate ? formatDate(order.dueDate) : "-";
  invoicePayLink.href = `payments.html?order=${encodeURIComponent(order.orderNumber)}`;
  invoiceTrackLink.href = `tracking.html?order=${encodeURIComponent(order.orderNumber)}`;
  invoiceZelleNote.textContent = `Order ${order.orderNumber}`;
  invoiceNotes.textContent = buildNotes(order.description);

  invoiceItems.innerHTML = `
    <tr>
      <td>
        <strong>${escapeHtml(product)}</strong>
        <small>${escapeHtml(order.title || order.orderNumber)}</small>
      </td>
      <td>${escapeHtml(String(quantity))}</td>
      <td>${money(itemPrice)}</td>
      <td>${money(amount)}</td>
    </tr>
  `;
  invoiceSubtotal.textContent = money(amount);
  invoiceTotal.textContent = money(amount);
}

function parseOrderDetails(description) {
  const text = String(description || "");
  return {
    product: lineValue(text, /(?:product|producto)\s*:\s*(.+)/i),
    quantity: Number(lineValue(text, /(?:quantity|cantidad)\s*:\s*([0-9]+)/i)) || 0,
    price: parseMoney(lineValue(text, /(?:price|precio|suggested sale price)\s*:\s*(.+)/i)),
  };
}

function lineValue(text, regex) {
  const match = text.match(regex);
  return match ? String(match[1] || "").split("\n")[0].trim() : "";
}

function buildNotes(description) {
  const lines = String(description || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^(order|service|product|quantity|price|precio|suggested sale price|order date|delivery date|files|internal notes|notas internas)\s*:/i.test(line));

  return lines.length ? lines.join(" · ") : "Thank you for choosing Next Print NY.";
}

function cleanTitle(title, orderNumber) {
  return String(title || orderNumber || "Next Print NY service")
    .replace(orderNumber || "", "")
    .replace(/^\s*-\s*/, "")
    .trim() || "Next Print NY service";
}

function normalizeOrderNumber(value) {
  return String(value || "")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .trim()
    .toUpperCase();
}

function parseMoney(value) {
  const amount = Number(String(value || "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

function formatDate(value) {
  if (!value) return "-";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00`) : new Date(value);
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

function setInvoiceStatus(text, tone = "") {
  invoiceStatus.textContent = text;
  invoiceStatus.className = `tracking-status ${tone}`.trim();
}

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value || 0);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
