const printSelectionKey = "nextPrintProductSelection";
const printFilesKey = "nextPrintProductFiles";
const printDetailsKey = "nextPrintProductDetails";

const checkoutParams = new URLSearchParams(window.location.search);
const checkoutStatus = checkoutParams.get("checkout");
const returnedOrder = normalizeOrderNumber(checkoutParams.get("order"));
const paypalToken = window.NextPrintPayPal?.paypalTokenFromParams(checkoutParams);

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
const productNode = document.querySelector("#printCheckoutProduct");
const sizeNode = document.querySelector("#printCheckoutSize");
const quantityNode = document.querySelector("#printCheckoutQty");
const sidesNode = document.querySelector("#printCheckoutSides");
const itemsNode = document.querySelector("#printCheckoutItems");

const selection = loadJson(printSelectionKey);
const files = loadJson(printFilesKey) || [];
const baseDetails = String(sessionStorage.getItem(printDetailsKey) || "");

if (checkoutStatus === "paypal-return" && returnedOrder && paypalToken) {
  window.NextPrintPayPal.captureReturn({
    orderNumber: returnedOrder,
    paypalOrderId: paypalToken,
    setStatus,
    onSuccess: showPaidState,
  });
} else if (checkoutStatus === "success" && returnedOrder) {
  showPaidState(returnedOrder);
} else if (!selection?.product || !selection?.quantity || !selection?.totalPrice) {
  showMissingState();
} else {
  renderCheckout(selection, files);
}

checkoutForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!selection?.product) return;

  const submitButton = checkoutForm.querySelector("button[type='submit']");
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
    setStatus("Please complete your name, phone, and email.", true);
    return;
  }

  if (fulfillment === "shipping" && (!address.street || !address.city || !address.state || !address.zip)) {
    setStatus("Please complete the full shipping address.", true);
    return;
  }

  submitButton.disabled = true;
  setStatus("Saving order and opening secure PayPal checkout...");

  try {
    if (!window.NextPrintPayPal) {
      throw new Error("PayPal checkout is not ready. Please refresh and try again.");
    }

    const details = buildFullDetails(selection, baseDetails);
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
      throw new Error(orderData?.error || "Could not save the print order.");
    }

    const orderNumber = orderData.orderNumber;
    const checkoutData = await window.NextPrintPayPal.createCheckout({
      orderNumber,
      itemName: `${selection.label || selection.product} - ${selection.quantity}`,
      amount: orderData.amount || selection.totalPrice,
      customerName: customer.name,
      customerEmail: customer.email,
      source: "print-products-checkout",
      paymentOption: "Full payment",
      plan: selection.label || selection.product,
      fulfillment: fulfillment === "pickup" ? "Pickup store" : "Shipping",
      shippingAddress: fulfillment === "shipping" ? formatAddress(address) : "",
      description: details,
      successPath: `/print-products-checkout.html?order=${encodeURIComponent(orderNumber)}`,
      cancelPath: `/print-products-checkout.html?order=${encodeURIComponent(orderNumber)}`,
    });

    window.location.href = checkoutData.url;
  } catch (error) {
    setStatus(error.message || "Could not open checkout. Please try again.", true);
    submitButton.disabled = false;
  }
});

document.querySelectorAll("input[name='fulfillment']").forEach((input) => {
  input.addEventListener("change", updateFulfillmentFields);
});

function renderCheckout(orderSelection, orderFiles) {
  if (workspace) workspace.hidden = false;
  if (missingPanel) missingPanel.hidden = true;
  if (successPanel) successPanel.hidden = true;

  if (totalNode) totalNode.textContent = money(orderSelection.totalPrice);
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

function buildFullDetails(orderSelection, details) {
  return [
    details,
    "",
    `Product: ${orderSelection.product}`,
    `Size: ${orderSelection.sizeLabel || ""}`,
    `Quantity: ${orderSelection.quantity}`,
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
