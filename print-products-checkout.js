const printSelectionKey = "nextPrintProductSelection";
const printFilesKey = "nextPrintProductFiles";
const printDetailsKey = "nextPrintProductDetails";

const checkoutParams = new URLSearchParams(window.location.search);
const checkoutStatus = checkoutParams.get("checkout");
const returnedOrder = normalizeOrderNumber(checkoutParams.get("order"));
const paypalToken = window.NextPrintPayPal?.paypalTokenFromParams(checkoutParams);
const stripeSessionId = checkoutParams.get("session_id");

const workspace = document.querySelector("#printCheckoutWorkspace");
const missingPanel = document.querySelector("#printCheckoutMissing");
const successPanel = document.querySelector("#printCheckoutSuccess");
const paidOrderNumber = document.querySelector("#printPaidOrderNumber");
const paidTrackLink = document.querySelector("#printPaidTrackLink");
const checkoutForm = document.querySelector("#printCheckoutForm");
const statusNode = document.querySelector("#printCheckoutStatus");
const addressFields = document.querySelector("#printAddressFields");
const pickupNote = document.querySelector("#printPickupNote");
const previewImage = document.querySelector("#printCheckoutPreview");
const nameCard = document.querySelector("#printCheckoutNameCard");
const nameCardTitle = document.querySelector("#printCheckoutNameTitle");
const nameCardMeta = document.querySelector("#printCheckoutNameMeta");
const totalNode = document.querySelector("#printCheckoutTotal");
const subtotalNode = document.querySelector("#printCheckoutSubtotal");
const taxNode = document.querySelector("#printCheckoutTax");
const shippingNode = document.querySelector("#printCheckoutShipping");
const shippingMessageNode = document.querySelector("#printShippingMessage");
const productNode = document.querySelector("#printCheckoutProduct");
const sizeNode = document.querySelector("#printCheckoutSize");
const quantityNode = document.querySelector("#printCheckoutQty");
const sidesNode = document.querySelector("#printCheckoutSides");
const itemsNode = document.querySelector("#printCheckoutItems");
const memberCompareNode = document.querySelector("#printCheckoutMemberCompare");
const memberPriceNode = document.querySelector("#printCheckoutMemberPrice");
const regularPriceNode = document.querySelector("#printCheckoutRegularPrice");
const savingsNode = document.querySelector("#printCheckoutSavings");
const stripeButton = document.querySelector("#printStripeButton");

const selection = loadJson(printSelectionKey);
const files = loadJson(printFilesKey) || [];
const baseDetails = String(sessionStorage.getItem(printDetailsKey) || "");
let preparedCheckoutPayload = null;
let currentTotals = null;
let memberActive = false;

if (checkoutStatus === "paypal-return" && returnedOrder && paypalToken) {
  window.NextPrintPayPal.captureReturn({
    orderNumber: returnedOrder,
    paypalOrderId: paypalToken,
    setStatus,
    onSuccess: showPaidState,
  });
} else if (checkoutStatus === "stripe-success" && returnedOrder && stripeSessionId) {
  confirmStripeReturn(returnedOrder, stripeSessionId);
} else if (checkoutStatus === "success" && returnedOrder) {
  showPaidState(returnedOrder);
} else if (!selection?.product || !selection?.quantity || !selection?.totalPrice) {
  showMissingState();
} else {
  renderCheckout(selection, files);
  detectMemberStatus();
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

stripeButton?.addEventListener("click", async () => {
  stripeButton.disabled = true;
  setStatus("Opening secure Stripe checkout...");

  try {
    if (!window.NextPrintStripe) {
      throw new Error("Stripe checkout is not ready. Please refresh and try again.");
    }
    const checkoutData = await window.NextPrintStripe.createCheckout(await prepareCheckoutPayload());
    window.NextPrintStripe.redirectToCheckout(checkoutData);
  } catch (error) {
    setStatus(error.message || "Could not open Stripe checkout. Please try again.", true);
    stripeButton.disabled = false;
  }
});

checkoutForm?.addEventListener("input", resetPreparedCheckout);
checkoutForm?.addEventListener("change", resetPreparedCheckout);
checkoutForm?.addEventListener("input", updateCheckoutTotals);
checkoutForm?.addEventListener("change", updateCheckoutTotals);

document.querySelectorAll("input[name='fulfillment']").forEach((input) => {
  input.addEventListener("change", updateFulfillmentFields);
});

function renderCheckout(orderSelection, orderFiles) {
  if (workspace) workspace.hidden = false;
  if (missingPanel) missingPanel.hidden = true;
  if (successPanel) successPanel.hidden = true;

  renderMemberComparison(orderSelection);
  if (productNode) productNode.textContent = orderSelection.label || orderSelection.product;
  if (sizeNode) sizeNode.textContent = orderSelection.sizeLabel || "Custom size";
  if (quantityNode) quantityNode.textContent = String(orderSelection.quantity);
  if (sidesNode) sidesNode.textContent = orderSelection.sides || "Front and Back";
  if (itemsNode) {
    const options = orderSelection.options || {};
    itemsNode.innerHTML = [
      options.roundedCorners ? `<span><b>Rounded Corners</b>${escapeHtml(options.roundedCorners)}</span>` : "",
      options.paperType ? `<span><b>Paper / Material</b>${escapeHtml(options.paperType)}</span>` : "",
      options.coating ? `<span><b>Coating</b>${escapeHtml(options.coating)}</span>` : "",
      options.folding ? `<span><b>Folding</b>${escapeHtml(options.folding)}</span>` : "",
      orderFiles.length ? `<span><b>Uploaded Files</b>${orderFiles.length} file${orderFiles.length === 1 ? "" : "s"}</span>` : "",
    ].filter(Boolean).join("");
  }

  const preview = orderSelection.uploadOnly
    ? null
    : orderFiles.find((file) => /front\.(png|jpe?g|webp)$/i.test(file?.name || ""));
  if (preview?.content && previewImage) {
    previewImage.src = `data:${preview.mimeType || mimeTypeForFile(preview.name)};base64,${preview.content}`;
    previewImage.hidden = false;
    if (nameCard) nameCard.hidden = true;
  } else {
    if (previewImage) {
      previewImage.removeAttribute("src");
      previewImage.hidden = true;
    }
    if (nameCard) nameCard.hidden = false;
    if (nameCardTitle) nameCardTitle.textContent = orderSelection.label || orderSelection.product;
    if (nameCardMeta) {
      nameCardMeta.textContent = orderFiles.length
        ? `${orderFiles.length} uploaded file${orderFiles.length === 1 ? "" : "s"} attached`
        : "Upload-only print order";
    }
  }

  updateFulfillmentFields();
  updateCheckoutTotals();
  mountPayPalButtons();
}

function renderMemberComparison(orderSelection) {
  const regularPrice = Number(orderSelection.regularPrice || orderSelection.totalPrice || 0);
  const memberPrice = Number(orderSelection.memberPrice || 0);
  const savings = Math.max(0, regularPrice - memberPrice);
  const hasMemberPrice = Number.isFinite(memberPrice) && memberPrice > 0 && savings > 0;

  if (memberCompareNode) memberCompareNode.hidden = !hasMemberPrice;
  if (!hasMemberPrice) return;
  if (memberPriceNode) memberPriceNode.textContent = money(memberPrice);
  if (regularPriceNode) regularPriceNode.textContent = money(regularPrice);
  if (savingsNode) savingsNode.textContent = money(savings);
}

function showPaidState(orderNumber) {
  if (workspace) workspace.hidden = true;
  if (missingPanel) missingPanel.hidden = true;
  if (successPanel) successPanel.hidden = false;
  if (paidOrderNumber) paidOrderNumber.textContent = orderNumber;
  if (paidTrackLink) paidTrackLink.href = `tracking.html?order=${encodeURIComponent(orderNumber)}`;
  sessionStorage.removeItem(printSelectionKey);
  sessionStorage.removeItem(printFilesKey);
  sessionStorage.removeItem(printDetailsKey);
}

function showMissingState() {
  if (workspace) workspace.hidden = true;
  if (successPanel) successPanel.hidden = true;
  if (missingPanel) missingPanel.hidden = false;
}

async function confirmStripeReturn(orderNumber, sessionId) {
  setStatus("Confirming Stripe payment...");
  try {
    if (!window.NextPrintStripe) throw new Error("Stripe checkout is not ready. Please refresh and try again.");
    await window.NextPrintStripe.confirmCheckout({ orderNumber, sessionId });
    showPaidState(orderNumber);
  } catch (error) {
    setStatus(error.message || "Could not confirm Stripe payment.", true);
    renderCheckout(selection, files);
  }
}

function updateFulfillmentFields() {
  const fulfillment = selectedFulfillment();
  const needsAddress = fulfillment !== "pickup";
  if (addressFields) addressFields.hidden = !needsAddress;
  if (pickupNote) pickupNote.hidden = needsAddress;
  addressFields?.querySelectorAll("input").forEach((input) => {
    const required = ["street", "city", "state", "zip"].includes(input.name);
    input.required = needsAddress && required;
    input.disabled = !needsAddress;
  });
  updateCheckoutTotals();
}

function updateCheckoutTotals() {
  if (!selection?.product || !window.NextPrintShippingCalculator?.calculateShipping) return;
  const destination = readDestination();
  currentTotals = window.NextPrintShippingCalculator.calculateShipping({
    productName: selection.product,
    method: selectedFulfillment(),
    destination,
    isMember: memberActive,
    subtotal: selection.totalPrice,
    quantity: selection.quantity,
  });

  if (subtotalNode) subtotalNode.textContent = money(currentTotals.subtotal);
  if (taxNode) taxNode.textContent = money(currentTotals.tax);
  if (shippingNode) shippingNode.textContent = currentTotals.available ? money(currentTotals.shipping) : "--";
  if (totalNode) totalNode.textContent = money(currentTotals.total);
  if (shippingMessageNode) {
    shippingMessageNode.textContent = currentTotals.unavailableReason || currentTotals.message;
    shippingMessageNode.classList.toggle("error", !currentTotals.available);
  }
}

async function detectMemberStatus() {
  try {
    const response = await fetch("/api/member?action=dashboard");
    if (!response.ok) return;
    const data = await response.json();
    memberActive = Boolean(data?.membership?.active);
    resetPreparedCheckout();
    updateCheckoutTotals();
  } catch {}
}

async function prepareCheckoutPayload() {
  if (!selection?.product) {
    throw new Error("Your print product order is missing. Please return to the product page.");
  }

  if (preparedCheckoutPayload) return preparedCheckoutPayload;

  const form = new FormData(checkoutForm);
  const customer = {
    name: clean(form.get("name")),
    phone: clean(form.get("phone")),
    email: clean(form.get("email")),
  };
  const fulfillment = selectedFulfillment();
  const needsAddress = fulfillment !== "pickup";
  const address = needsAddress ? {
    street: clean(form.get("street")),
    apartment: clean(form.get("apartment")),
    city: clean(form.get("city")),
    state: clean(form.get("state")).toUpperCase(),
    zip: clean(form.get("zip")),
  } : {};

  if (!customer.name || !customer.phone || !customer.email) {
    throw new Error("Please complete your name, phone, and email.");
  }

  if (needsAddress && (!address.street || !address.city || !address.state || !address.zip)) {
    throw new Error("Please complete the full delivery address.");
  }

  updateCheckoutTotals();
  if (!currentTotals?.available) {
    throw new Error(currentTotals?.unavailableReason || "This delivery option is not available for this address.");
  }

  setStatus("Saving your order before payment...");
  const details = buildFullDetails(selection, baseDetails, currentTotals);
  const orderResponse = await fetch("/api/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: localStorage.getItem("preferredLanguage") || "en",
      service: "Print Products",
      product: selection.product,
      quantity: String(selection.quantity),
      details,
      orderDate: toDateInputValue(new Date()),
      dueDate: toDateInputValue(daysFromNow(5)),
      budget: money(currentTotals.total),
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      fulfillment,
      address,
      shipping: {
        provider: currentTotals.provider,
        method: fulfillment,
        message: currentTotals.message,
        category: currentTotals.shippingCategory,
        cost: currentTotals.shipping,
        freeShippingApplied: currentTotals.freeShippingApplied,
        subtotal: currentTotals.subtotal,
        tax: currentTotals.tax,
        total: currentTotals.total,
      },
      files,
    }),
  });
  const orderData = await orderResponse.json();

  if (!orderResponse.ok) {
    throw new Error(orderData?.error || "Could not save the print order.");
  }

  const orderNumber = orderData.orderNumber;
  preparedCheckoutPayload = {
    orderNumber,
    itemName: `${selection.label || selection.product} - ${selection.quantity}`,
    amount: orderData.amount || currentTotals.total,
    customerName: customer.name,
    customerEmail: customer.email,
    source: "print-products-checkout",
    paymentOption: "Full payment",
    plan: selection.label || selection.product,
    fulfillment: fulfillmentLabel(fulfillment),
    shippingAddress: needsAddress ? formatAddress(address) : "",
    description: details,
    successPath: `/print-products-checkout.html?order=${encodeURIComponent(orderNumber)}`,
    cancelPath: `/print-products-checkout.html?order=${encodeURIComponent(orderNumber)}`,
  };

  return preparedCheckoutPayload;
}

function mountPayPalButtons() {
  window.NextPrintPayPal?.renderButtons({
    container: "#printPayPalButtons",
    fallbackButton: "#printPayFallback",
    getCheckout: prepareCheckoutPayload,
    setStatus,
    onSuccess: showPaidState,
  });
}

function resetPreparedCheckout() {
  preparedCheckoutPayload = null;
}

function buildFullDetails(orderSelection, details, totals) {
  return [
    details,
    "",
    `Product: ${orderSelection.product}`,
    `Size: ${orderSelection.sizeLabel || ""}`,
    `Quantity: ${orderSelection.quantity}`,
    `Subtotal: ${money(totals?.subtotal || orderSelection.totalPrice)}`,
    `Tax: ${money(totals?.tax || 0)}`,
    `Shipping: ${money(totals?.shipping || 0)}`,
    `Checkout amount: ${money(totals?.total || orderSelection.totalPrice)}`,
    totals?.message ? `Shipping message: ${totals.message}` : "",
    totals?.shippingCategory ? `Shipping category: ${totals.shippingCategory}` : "",
    orderSelection.memberPrice ? `Member price: ${money(orderSelection.memberPrice)}` : "",
    orderSelection.regularPrice ? `Regular customer price: ${money(orderSelection.regularPrice)}` : "",
    orderSelection.membershipSavings ? `Membership savings: ${money(orderSelection.membershipSavings)}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function selectedFulfillment() {
  return document.querySelector("input[name='fulfillment']:checked")?.value || "standard";
}

function readDestination() {
  const form = checkoutForm ? new FormData(checkoutForm) : new FormData();
  return {
    street: clean(form.get("street")),
    apartment: clean(form.get("apartment")),
    city: clean(form.get("city")),
    borough: clean(form.get("city")),
    state: clean(form.get("state")).toUpperCase(),
    zip: clean(form.get("zip")),
  };
}

function fulfillmentLabel(value) {
  if (value === "pickup") return "Store Pickup";
  if (value === "local_delivery") return "Local Delivery";
  if (value === "express") return "Express Shipping";
  return "Standard Shipping";
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

function mimeTypeForFile(fileName = "") {
  if (/\.jpe?g$/i.test(fileName)) return "image/jpeg";
  if (/\.webp$/i.test(fileName)) return "image/webp";
  return "image/png";
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
