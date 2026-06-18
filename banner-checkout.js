const bannerSelectionKey = "nextBannerOrderSelection";
const bannerFilesKey = "nextBannerOrderFiles";
const bannerDetailsKey = "nextBannerOrderDetails";

const params = new URLSearchParams(window.location.search);
const checkoutStatus = params.get("checkout");
const returnedOrder = normalizeOrderNumber(params.get("order"));
const paypalToken = window.NextPrintPayPal?.paypalTokenFromParams(params);

const workspace = document.querySelector("#bannerCheckoutWorkspace");
const missingPanel = document.querySelector("#bannerCheckoutMissing");
const successPanel = document.querySelector("#bannerCheckoutSuccess");
const paidOrderNumber = document.querySelector("#bannerPaidOrderNumber");
const paidTrackLink = document.querySelector("#bannerPaidTrackLink");
const checkoutForm = document.querySelector("#bannerCheckoutForm");
const statusNode = document.querySelector("#bannerCheckoutStatus");
const addressFields = document.querySelector("#bannerAddressFields");
const pickupNote = document.querySelector("#bannerPickupNote");
const previewImage = document.querySelector("#bannerCheckoutPreview");
const totalNode = document.querySelector("#bannerCheckoutTotal");
const productNode = document.querySelector("#bannerCheckoutProduct");
const sizeNode = document.querySelector("#bannerCheckoutSize");
const sqftNode = document.querySelector("#bannerCheckoutSqft");
const quantityNode = document.querySelector("#bannerCheckoutQty");
const itemsNode = document.querySelector("#bannerCheckoutItems");

const selection = loadJson(bannerSelectionKey);
const files = loadJson(bannerFilesKey) || [];
const baseDetails = String(sessionStorage.getItem(bannerDetailsKey) || "");

if (checkoutStatus === "paypal-return" && returnedOrder && paypalToken) {
  window.NextPrintPayPal.captureReturn({
    orderNumber: returnedOrder,
    paypalOrderId: paypalToken,
    setStatus,
    onSuccess: showPaidState,
  });
} else if (checkoutStatus === "success" && returnedOrder) {
  showPaidState(returnedOrder);
} else if (!selection?.product || !selection?.totalPrice) {
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
        service: "Signs & Banners",
        product: "",
        quantity: "1",
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
      throw new Error(orderData?.error || "Could not save the banner order.");
    }

    const orderNumber = orderData.orderNumber;
    const checkoutData = await window.NextPrintPayPal.createCheckout({
      orderNumber,
      itemName: selection.label || selection.product,
      amount: orderData.amount || selection.totalPrice,
      customerName: customer.name,
      customerEmail: customer.email,
      source: "banner-checkout",
      paymentOption: "Full payment",
      plan: selection.label || selection.product,
      fulfillment: fulfillment === "pickup" ? "Pickup store" : "Shipping",
      shippingAddress: fulfillment === "shipping" ? formatAddress(address) : "",
      description: details,
      successPath: `/banner-checkout.html?order=${encodeURIComponent(orderNumber)}`,
      cancelPath: `/banner-checkout.html?order=${encodeURIComponent(orderNumber)}`,
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
  if (productNode) productNode.textContent = orderSelection.product;
  if (sizeNode) sizeNode.textContent = orderSelection.sizeLabel || "Custom size";
  if (sqftNode) sqftNode.textContent = Number(orderSelection.squareFeet || 0).toFixed(2);
  if (quantityNode) quantityNode.textContent = String(orderSelection.quantity || 1);
  if (itemsNode) {
    itemsNode.innerHTML = [
      `<span><b>Width</b>${escapeHtml(orderSelection.widthFt || "")} ft</span>`,
      `<span><b>Height</b>${escapeHtml(orderSelection.heightFt || "")} ft</span>`,
      orderFiles.length ? `<span><b>Design File</b>${orderFiles.length} PNG attached</span>` : "",
    ].filter(Boolean).join("");
  }

  const preview = orderFiles[0];
  if (preview?.content && previewImage) {
    previewImage.src = `data:image/png;base64,${preview.content}`;
    previewImage.hidden = false;
  }

  updateFulfillmentFields();
}

function showPaidState(orderNumber) {
  if (workspace) workspace.hidden = true;
  if (missingPanel) missingPanel.hidden = true;
  if (successPanel) successPanel.hidden = false;
  if (paidOrderNumber) paidOrderNumber.textContent = orderNumber;
  if (paidTrackLink) paidTrackLink.href = `tracking.html?order=${encodeURIComponent(orderNumber)}`;
  sessionStorage.removeItem(bannerSelectionKey);
  sessionStorage.removeItem(bannerFilesKey);
  sessionStorage.removeItem(bannerDetailsKey);
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
    `Square Feet: ${Number(orderSelection.squareFeet || 0).toFixed(2)}`,
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
