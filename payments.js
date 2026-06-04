const paymentOrderNote = document.querySelector("#paymentOrderNote");
const paymentOrder = normalizePaymentOrder(new URLSearchParams(window.location.search).get("order"));

if (paymentOrder && paymentOrderNote) {
  paymentOrderNote.textContent = `Order ${paymentOrder}`;
}

function normalizePaymentOrder(value) {
  return String(value || "")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .trim()
    .slice(0, 32)
    .toUpperCase();
}
