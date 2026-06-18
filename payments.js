const paymentOrderNote = document.querySelector("#paymentOrderNote");
const paymentCheckoutForm = document.querySelector("#paymentCheckoutForm");
const paymentOrderInput = document.querySelector("#paymentOrderInput");
const paymentAmountInput = document.querySelector("#paymentAmountInput");
const paymentStatus = document.querySelector("#paymentStatus");
const paymentParams = new URLSearchParams(window.location.search);
const paymentOrder = normalizePaymentOrder(paymentParams.get("order"));
const paymentAmount = normalizePaymentAmount(paymentParams.get("amount"));
const paymentCheckoutStatus = paymentParams.get("checkout");
const paymentPaypalToken = window.NextPrintPayPal?.paypalTokenFromParams(paymentParams);

if (paymentOrder && paymentOrderNote) {
  paymentOrderNote.textContent = paymentOrder;
}

if (paymentOrder && paymentOrderInput) {
  paymentOrderInput.value = paymentOrder;
}

if (paymentAmount && paymentAmountInput) {
  paymentAmountInput.value = paymentAmount;
}

if (paymentCheckoutStatus === "paypal-return" && paymentOrder && paymentPaypalToken) {
  window.NextPrintPayPal.captureReturn({
    orderNumber: paymentOrder,
    paypalOrderId: paymentPaypalToken,
    setStatus: (message, isError) => setPaymentStatus(message, isError ? "error" : "success"),
    onSuccess: (orderNumber) => {
      if (paymentOrderNote) paymentOrderNote.textContent = orderNumber;
      setPaymentStatus("PayPal payment received. Your order was updated.", "success");
    },
  });
} else if (paymentCheckoutStatus === "success" && paymentOrder) {
  setPaymentStatus("Payment received. Your order was updated.", "success");
}

paymentCheckoutForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const orderNumber = normalizePaymentOrder(paymentOrderInput?.value);
  const amount = normalizePaymentAmount(paymentAmountInput?.value);

  if (!orderNumber || !amount) {
    setPaymentStatus("Enter a valid order number and confirmed total.", "error");
    return;
  }

  const submitButton = paymentCheckoutForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  setPaymentStatus("Opening secure PayPal checkout...");

  try {
    if (!window.NextPrintPayPal) {
      throw new Error("PayPal checkout is not ready. Please refresh and try again.");
    }

    const data = await window.NextPrintPayPal.createCheckout({
      orderNumber,
      amount,
      itemName: `Next Print NY Order ${orderNumber}`,
      source: "payments-page",
      successPath: `/payments.html?order=${encodeURIComponent(orderNumber)}`,
      cancelPath: `/payments.html?order=${encodeURIComponent(orderNumber)}&amount=${encodeURIComponent(amount)}`,
    });

    window.location.href = data.url;
  } catch (error) {
    setPaymentStatus(error.message || "Could not open checkout. Please try again.", "error");
  } finally {
    submitButton.disabled = false;
  }
});

function normalizePaymentOrder(value) {
  return String(value || "")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .trim()
    .slice(0, 32)
    .toUpperCase();
}

function normalizePaymentAmount(value) {
  const amount = Number(String(value || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(amount) && amount > 0 ? amount.toFixed(2) : "";
}

function setPaymentStatus(message, tone = "") {
  if (!paymentStatus) return;
  paymentStatus.textContent = message;
  paymentStatus.className = `payment-status ${tone}`.trim();
}
