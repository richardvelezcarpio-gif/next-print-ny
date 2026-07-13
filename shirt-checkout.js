const selectionKey = "nextPrintTshirtSelection";
const filesKey = "nextPrintTshirtFiles";
const detailsKey = "nextPrintTshirtDetails";

const checkoutParams = new URLSearchParams(window.location.search);
const checkoutStatus = checkoutParams.get("checkout");
const returnedOrder = normalizeOrderNumber(checkoutParams.get("order"));
const paypalToken = window.NextPrintPayPal?.paypalTokenFromParams(checkoutParams);

const workspace = document.querySelector("#shirtCheckoutWorkspace");
const missingPanel = document.querySelector("#shirtCheckoutMissing");
const successPanel = document.querySelector("#shirtCheckoutSuccess");
const paidOrderNumber = document.querySelector("#shirtPaidOrderNumber");
const paidTrackLink = document.querySelector("#shirtPaidTrackLink");
const checkoutForm = document.querySelector("#shirtCheckoutForm");
const statusNode = document.querySelector("#shirtCheckoutStatus");
const addressFields = document.querySelector("#shirtAddressFields");
const pickupNote = document.querySelector("#shirtPickupNote");
const previewImage = document.querySelector("#shirtCheckoutPreview");
const totalNode = document.querySelector("#shirtCheckoutTotal");
const quantityNode = document.querySelector("#shirtCheckoutQty");
const printNode = document.querySelector("#shirtCheckoutPrint");
const itemsNode = document.querySelector("#shirtCheckoutItems");

const selection = loadJson(selectionKey);
const files = loadJson(filesKey) || [];
const baseDetails = String(sessionStorage.getItem(detailsKey) || "");
let preparedCheckoutPayload = null;

if (checkoutStatus === "paypal-return" && returnedOrder && paypalToken) {
  window.NextPrintPayPal.captureReturn({
    orderNumber: returnedOrder,
    paypalOrderId: paypalToken,
    setStatus,
    onSuccess: showPaidState,
  });
} else if (checkoutStatus === "success" && returnedOrder) {
  showPaidState(returnedOrder);
} else if (!selection?.items?.length) {
  showMissingState();
} else {
  renderCheckout(selection, files);
}

checkoutForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = checkoutForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  setStatus("Opening backup PayPal checkout...");

  try {
    if (!window.NextPrintPayPal) {
      throw new Error("PayPal checkout is not ready. Please refresh and try again.");
    }

    const checkoutData = await window.NextPrintPayPal.createCheckout(await prepareCheckoutPayload());

    window.location.href = checkoutData.url;
  } catch (error) {
    setStatus(error.message || "Could not open checkout. Please try again.", true);
    submitButton.disabled = false;
  }
});

checkoutForm?.addEventListener("input", resetPreparedCheckout);
checkoutForm?.addEventListener("change", resetPreparedCheckout);

document.querySelectorAll("input[name='fulfillment']").forEach((input) => {
  input.addEventListener("change", updateFulfillmentFields);
});

function renderCheckout(orderSelection, orderFiles) {
  if (workspace) workspace.hidden = false;
  if (missingPanel) missingPanel.hidden = true;
  if (successPanel) successPanel.hidden = true;

  if (totalNode) totalNode.textContent = money(orderSelection.totalPrice);
  if (quantityNode) quantityNode.textContent = `${orderSelection.totalQuantity} shirt${orderSelection.totalQuantity === 1 ? "" : "s"}`;
  if (printNode) printNode.textContent = orderSelection.printOptionLabel || "Custom print";
  if (itemsNode) {
    itemsNode.innerHTML = orderSelection.items
      .map((item) => `<span><b>${escapeHtml(item.color)} ${escapeHtml(item.size)}</b>${escapeHtml(String(item.quantity))} x ${money(item.unitPrice)}</span>`)
      .join("");
  }

  const preview = orderFiles.find((file) => /preview\.png$/i.test(file?.name || "")) || orderFiles[0];
  if (preview?.content && previewImage) {
    previewImage.src = `data:image/png;base64,${preview.content}`;
  }

  updateFulfillmentFields();
  mountPayPalButtons();
}

function showPaidState(orderNumber) {
  if (workspace) workspace.hidden = true;
  if (missingPanel) missingPanel.hidden = true;
  if (successPanel) successPanel.hidden = false;
  if (paidOrderNumber) paidOrderNumber.textContent = orderNumber;
  if (paidTrackLink) paidTrackLink.href = `tracking.html?order=${encodeURIComponent(orderNumber)}`;
  sessionStorage.removeItem(selectionKey);
  sessionStorage.removeItem(filesKey);
  sessionStorage.removeItem(detailsKey);
}

function showMissingState() {
  if (workspace) workspace.hidden = true;
  if (successPanel) successPanel.hidden = true;
  if (missingPanel) missingPanel.hidden = false;
}

function updateFulfillmentFields() {
  const fulfillment = document.querySelector("input[name='fulfillment']:checked")?.value || "shipping";
  const isShipping = fulfillment === "shipping";
  if (addressFields) addressFields.hidden = !isShipping;
  if (pickupNote) pickupNote.hidden = isShipping;
  addressFields?.querySelectorAll("input").forEach((input) => {
    const required = ["street", "city", "state", "zip"].includes(input.name);
    input.required = isShipping && required;
    input.disabled = !isShipping;
  });
}

async function prepareCheckoutPayload() {
  if (!selection?.items?.length) {
    throw new Error("Your shirt order is missing. Please return to the designer.");
  }

  if (preparedCheckoutPayload) return preparedCheckoutPayload;

  const form = new FormData(checkoutForm);
  const customer = {
    name: clean(form.get("name")),
    phone: clean(form.get("phone")),
    email: clean(form.get("email")),
  };
  const fulfillment = form.get("fulfillment") === "pickup" ? "pickup" : "shipping";
  const address = fulfillment === "shipping" ? {
    street: clean(form.get("street")),
    apartment: clean(form.get("apartment")),
    city: clean(form.get("city")),
    state: clean(form.get("state")).toUpperCase(),
    zip: clean(form.get("zip")),
  } : {};

  if (!customer.name || !customer.phone || !customer.email) {
    throw new Error("Please complete your name, phone, and email.");
  }

  if (fulfillment === "shipping" && (!address.street || !address.city || !address.state || !address.zip)) {
    throw new Error("Please complete the full shipping address.");
  }

  setStatus("Saving your order before payment...");
  const details = buildFullDetails(selection, baseDetails);
  const orderResponse = await fetch("/api/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: localStorage.getItem("preferredLanguage") || "en",
      service: "T-Shirts & Apparel",
      product: "Gildan G500 T-Shirt Mix",
      quantity: String(selection.totalQuantity),
      details,
      orderDate: toDateInputValue(new Date()),
      dueDate: toDateInputValue(daysFromNow(7)),
      budget: money(selection.totalPrice),
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      fulfillment,
      address,
      files,
    }),
  });
  const orderData = await orderResponse.json();

  if (!orderResponse.ok) {
    throw new Error(orderData?.error || "Could not save the T-shirt order.");
  }

  const orderNumber = orderData.orderNumber;
  preparedCheckoutPayload = {
    orderNumber,
    itemName: `Custom T-Shirts - ${selection.totalQuantity} shirt${selection.totalQuantity === 1 ? "" : "s"}`,
    amount: orderData.amount || selection.totalPrice,
    customerName: customer.name,
    customerEmail: customer.email,
    source: "tshirt-checkout",
    paymentOption: "Full payment",
    plan: "Custom T-Shirts",
    fulfillment: fulfillment === "pickup" ? "Pickup store" : "Shipping",
    shippingAddress: fulfillment === "shipping" ? formatAddress(address) : "",
    description: details,
    successPath: `/shirt-checkout.html?order=${encodeURIComponent(orderNumber)}`,
    cancelPath: `/shirt-checkout.html?order=${encodeURIComponent(orderNumber)}`,
  };

  return preparedCheckoutPayload;
}

function mountPayPalButtons() {
  window.NextPrintPayPal?.renderButtons({
    container: "#shirtPayPalButtons",
    fallbackButton: "#shirtPayFallback",
    getCheckout: prepareCheckoutPayload,
    setStatus,
    onSuccess: showPaidState,
  });
}

function resetPreparedCheckout() {
  preparedCheckoutPayload = null;
}

function buildFullDetails(orderSelection, details) {
  return [
    details,
    "",
    `Checkout amount: ${money(orderSelection.totalPrice)}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function formatAddress(address) {
  return [
    address.street,
    address.apartment,
    [address.city, address.state, address.zip].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(", ");
}

function loadJson(key) {
  try {
    return JSON.parse(sessionStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

function setStatus(message, isError = false) {
  if (!statusNode) return;
  statusNode.textContent = message;
  statusNode.classList.toggle("error", isError);
}

function daysFromNow(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

function toDateInputValue(date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function normalizeOrderNumber(value) {
  return String(value || "")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .trim()
    .slice(0, 32)
    .toUpperCase();
}

function clean(value) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, 180);
}

function money(value) {
  const amount = Number(value || 0);
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
