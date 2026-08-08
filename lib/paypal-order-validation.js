export const PAYPAL_CURRENCY = "USD";
export const PAYPAL_PAYMENT_STATUSES = new Set(["pending_payment", "payment_failed"]);

export function moneyToMinorSafe(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return null;
  return Math.round(number * 100);
}

export function moneyToPayPal(value) {
  const minor = moneyToMinorSafe(value);
  return minor === null ? "" : (minor / 100).toFixed(2);
}

export function paymentStatus(record = {}) {
  return String(record.payment_status || record.status || "").trim().toLowerCase();
}

export function ensureUsdRequest(requestedCurrency) {
  const currency = String(requestedCurrency || "").trim().toUpperCase();
  if (currency && currency !== PAYPAL_CURRENCY) {
    throw new Error("Only USD payments are supported.");
  }
  return PAYPAL_CURRENCY;
}

export function validatePayPalCreate(record, internalOrderId) {
  if (!record?.id || !record.internal_order_id) throw new Error("Stored internal order was not found.");
  if (String(record.internal_order_id) !== String(internalOrderId)) throw new Error("Internal order does not match the stored order.");
  const status = paymentStatus(record);
  if (status === "paid" || status === "refunded") throw new Error("This order is not available for a new PayPal payment.");
  if (!PAYPAL_PAYMENT_STATUSES.has(status)) throw new Error("This order is not in a payable state.");
  if (String(record.currency || PAYPAL_CURRENCY).toUpperCase() !== PAYPAL_CURRENCY) throw new Error("Stored order currency must be USD.");
  const amount = moneyToPayPal(record.amount);
  if (!amount || Number(amount) <= 0) throw new Error("Stored order total is invalid.");
  return { amount, currency: PAYPAL_CURRENCY, status };
}

export function validatePayPalCapture({ record, internalOrderId, paypalOrderId, paypalOrder }) {
  const payment = validatePayPalCreate(record, internalOrderId);
  if (!paypalOrderId || String(record.paypal_order_id || "") !== String(paypalOrderId)) {
    throw new Error("PayPal order does not match the stored Next Print NY order.");
  }
  const unit = paypalOrder?.purchase_units?.[0] || {};
  if (
    String(unit.custom_id || "") !== String(internalOrderId) ||
    String(unit.amount?.currency_code || "").toUpperCase() !== PAYPAL_CURRENCY ||
    String(unit.amount?.value || "") !== payment.amount
  ) {
    throw new Error("PayPal order total, currency, or internal order does not match the stored order.");
  }
  return payment;
}

export function isCapturedOrder(record = {}, paypalOrderId = "") {
  return paymentStatus(record) === "paid" && (!paypalOrderId || String(record.paypal_order_id || "") === String(paypalOrderId));
}
