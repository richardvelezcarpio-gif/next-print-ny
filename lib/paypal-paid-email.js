import { moneyToPayPal } from "./paypal-order-validation.js";

export const EMAIL_ATTEMPT_MARKER = "Paid payment notification attempted";

// Payment confirmation emails remain opt-in until both a provider key and an
// approved sender are configured. This prevents an accidental fallback sender
// from enabling mail while the launch email provider is intentionally paused.
export function emailNotificationsConfigured(env = {}) {
  return Boolean(String(env.RESEND_API_KEY || "").trim() && String(env.RESEND_FROM_EMAIL || "").trim());
}

export function canSendPaidNotifications(record = {}) {
  return String(record.payment_status || "").toLowerCase() === "paid" && Boolean(record.paypal_capture_id);
}

export function paidEmailWasAttempted(record = {}) {
  return String(record.description || "").includes(EMAIL_ATTEMPT_MARKER);
}

export function buildCustomerReceipt(record = {}, baseUrl = "") {
  const orderNumber = escapeHtml(record.order_number || "");
  const trackingUrl = `${String(baseUrl || "").replace(/\/$/, "")}/tracking.html?order=${encodeURIComponent(record.order_number || "")}`;
  return {
    subject: `Next Print NY payment received - Order ${record.order_number || ""}`,
    html: `<div style="font-family:Arial,Helvetica,sans-serif;color:#07142f;line-height:1.55"><h2 style="color:#05275c">Next Print NY</h2><p>Hi ${escapeHtml(record.customer_name || "customer")},</p><p>Thank you for your order. Your payment has been confirmed.</p><p><strong>Order Number:</strong> ${orderNumber}<br><strong>Payment Status:</strong> Paid<br><strong>Payment Method:</strong> PayPal</p><h3>Items</h3>${productList(record)}<h3>Order summary</h3><p><strong>Subtotal:</strong> $${moneyToPayPal(record.subtotal)}<br><strong>Shipping:</strong> $${moneyToPayPal(record.shipping_amount)}<br><strong>Tax:</strong> $${moneyToPayPal(record.tax_amount)}<br><strong>Total:</strong> $${moneyToPayPal(record.amount)} USD</p><p><strong>Shipping address:</strong><br>${escapeHtml(formatDeliveryAddress(record.delivery_address))}</p><p><a href="${escapeHtml(trackingUrl)}" style="color:#05275c;font-weight:bold">Track your order</a></p><p>Thank you for choosing Next Print NY.</p></div>`,
  };
}

export function buildAdminNotification(record = {}) {
  return {
    subject: `Paid PayPal order ${record.order_number || ""}`,
    html: `<div style="font-family:Arial,Helvetica,sans-serif;color:#07142f;line-height:1.55"><h2>PayPal payment confirmed</h2><p><strong>Order number:</strong> ${escapeHtml(record.order_number || "")}<br><strong>Payment provider:</strong> PayPal<br><strong>PayPal capture ID:</strong> ${escapeHtml(record.paypal_capture_id || "")}</p><h3>Customer</h3><p><strong>Name:</strong> ${escapeHtml(record.customer_name || "")}<br><strong>Email:</strong> ${escapeHtml(record.customer_email || "")}<br><strong>Phone:</strong> ${escapeHtml(record.customer_phone || "")}</p><h3>Items</h3>${productList(record)}<p><strong>Shipping address:</strong><br>${escapeHtml(formatDeliveryAddress(record.delivery_address))}</p><h3>Order summary</h3><p><strong>Subtotal:</strong> $${moneyToPayPal(record.subtotal)}<br><strong>Shipping:</strong> $${moneyToPayPal(record.shipping_amount)}<br><strong>Tax:</strong> $${moneyToPayPal(record.tax_amount)}<br><strong>Total:</strong> $${moneyToPayPal(record.amount)} USD</p></div>`,
  };
}

function productList(record) {
  const product = descriptionValue(record.description, "Product") || record.title || "Print order";
  const quantity = descriptionValue(record.description, "Quantity") || record.quantity || "1";
  return `<ul><li><strong>${escapeHtml(product)}</strong> — Quantity: ${escapeHtml(quantity)}</li></ul>`;
}

function descriptionValue(description, label) {
  const match = String(description || "").match(new RegExp(`^${label}:\\s*(.+)$`, "mi"));
  return match?.[1]?.trim() || "";
}

function formatDeliveryAddress(address = {}) {
  return [address.street, address.apartment, [address.city, address.state, address.zip].filter(Boolean).join(" "), address.country].filter(Boolean).join(", ");
}

function escapeHtml(value) {
  return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
