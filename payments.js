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
} else {
  mountPaymentButtons();
}

paymentCheckoutForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = paymentCheckoutForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  setPaymentStatus("Opening backup PayPal checkout...");

  try {
    if (!window.NextPrintPayPal) {
      throw new Error("PayPal checkout is not ready. Please refresh and try again.");
    }

    const data = await window.NextPrintPayPal.createCheckout(getPaymentPayload());

    window.location.href = data.url;
  } catch (error) {
    setPaymentStatus(error.message || "Could not open checkout. Please try again.", "error");
  } finally {
    submitButton.disabled = false;
  }
});

paymentCheckoutForm?.addEventListener("input", () => {
  setPaymentStatus("Choose PayPal or card to pay securely.");
});

function getPaymentPayload() {
  const orderNumber = normalizePaymentOrder(paymentOrderInput?.value);
  const amount = normalizePaymentAmount(paymentAmountInput?.value);

  if (!orderNumber || !amount) {
    throw new Error("Enter a valid order number and confirmed total.");
  }

  return {
    orderNumber,
    amount,
    itemName: `Next Print NY Order ${orderNumber}`,
    source: "payments-page",
    successPath: `/payments.html?order=${encodeURIComponent(orderNumber)}`,
    cancelPath: `/payments.html?order=${encodeURIComponent(orderNumber)}&amount=${encodeURIComponent(amount)}`,
  };
}

function mountPaymentButtons() {
  window.NextPrintPayPal?.renderButtons({
    container: "#paymentPayPalButtons",
    fallbackButton: "#paymentPayFallback",
    getCheckout: getPaymentPayload,
    setStatus: (message, isError) => setPaymentStatus(message, isError ? "error" : "success"),
    onSuccess: (orderNumber) => {
      if (paymentOrderNote) paymentOrderNote.textContent = orderNumber;
      setPaymentStatus("PayPal payment received. Your order was updated.", "success");
    },
  });
}

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
