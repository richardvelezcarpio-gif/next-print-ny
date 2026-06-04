const trackingForm = document.querySelector("#trackingForm");
const trackingInput = document.querySelector("#trackingInput");
const trackingStatus = document.querySelector("#trackingStatus");
const trackingResult = document.querySelector("#trackingResult");
const trackingOrderTitle = document.querySelector("#trackingOrderTitle");
const trackingCustomer = document.querySelector("#trackingCustomer");
const trackingUpdated = document.querySelector("#trackingUpdated");
const trackingAmountRow = document.querySelector("#trackingAmountRow");
const trackingAmount = document.querySelector("#trackingAmount");
const trackingWhatsapp = document.querySelector("#trackingWhatsapp");
const trackingZelleEmail = document.querySelector("#trackingZelleEmail");
const trackingZelleNote = document.querySelector("#trackingZelleNote");
const trackingCopyZelle = document.querySelector("#trackingCopyZelle");
const trackingCopyNumber = document.querySelector("#trackingCopyNumber");
const localOrdersKey = "nextPrintRecentOrders";
const zelleEmail = "nextprintny@gmail.com";

trackingCopyZelle?.addEventListener("click", () => copyTrackingValue(zelleEmail, trackingCopyZelle, "zelle.copyEmail"));
trackingCopyNumber?.addEventListener("click", () => {
  const orderNumber = normalizeTrackingOrder(trackingInput?.value || trackingOrderTitle?.textContent || "");
  copyTrackingValue(orderNumber, trackingCopyNumber, "zelle.copyOrder");
});

const trackingOrder = new URLSearchParams(window.location.search).get("order");
if (trackingOrder && trackingInput) {
  trackingInput.value = trackingOrder;
}

if (trackingOrder) {
  window.setTimeout(() => {
    trackingForm?.requestSubmit();
  }, 250);
}

trackingForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const orderNumber = normalizeTrackingOrder(trackingInput.value);

  if (!orderNumber) return;

  setTrackingStatus(getTrackingText("tracking.loading", "Checking order..."));
  trackingResult.hidden = true;

  try {
    const response = await fetch(`/api/track-order?order=${encodeURIComponent(orderNumber)}`);
    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Order not found");

    renderTrackingResult(data.order);
    setTrackingStatus("");
  } catch (error) {
    const localOrder = findLocalOrder(orderNumber);

    if (localOrder) {
      renderTrackingResult(localOrder);
      setTrackingStatus(getTrackingText("tracking.local", "Showing your local order confirmation. We will update the live status soon."));
      return;
    }

    setTrackingStatus(getTrackingText("tracking.notFound", "Order not found. Check the number or contact us."), "error");
  }
});

function renderTrackingResult(order) {
  trackingOrderTitle.textContent = order.title || order.orderNumber;
  trackingCustomer.textContent = order.customerName || "-";
  trackingUpdated.textContent = formatTrackingDate(order.updatedAt);
  const amount = Number(order.amount || 0);
  if (trackingAmountRow && trackingAmount) {
    trackingAmountRow.hidden = !amount;
    trackingAmount.textContent = amount ? money(amount) : "-";
  }
  if (trackingZelleEmail) trackingZelleEmail.textContent = zelleEmail;
  if (trackingZelleNote) trackingZelleNote.textContent = `Order ${order.orderNumber}`;
  trackingWhatsapp.href = `https://wa.me/12393337935?text=${encodeURIComponent(
    `Hello Next Print NY, I want to ask about order ${order.orderNumber}.`
  )}`;
  updateTimeline(order.status);
  trackingResult.hidden = false;
}

function updateTimeline(status) {
  const order = ["new", "in_progress", "waiting", "paid", "completed"];
  const normalizedStatus = status === "cancelled" ? "waiting" : status;
  const activeIndex = Math.max(0, order.indexOf(normalizedStatus));

  document.querySelectorAll("[data-status-step]").forEach((element) => {
    const stepIndex = order.indexOf(element.dataset.statusStep);
    element.classList.toggle("done", stepIndex <= activeIndex);
    element.classList.toggle("current", stepIndex === activeIndex);
  });
}

function setTrackingStatus(text, tone = "") {
  trackingStatus.textContent = text;
  trackingStatus.className = `tracking-status ${tone}`.trim();
}

async function copyTrackingValue(value, button, labelKey) {
  const text = String(value || "").trim();
  if (!text || !button) return;

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
  } else {
    const input = document.createElement("input");
    input.value = text;
    document.body.append(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }

  button.textContent = getTrackingText("zelle.copied", "Copied");
  window.setTimeout(() => {
    button.textContent = getTrackingText(labelKey, button.textContent);
  }, 1300);
}

function getTrackingText(key, fallback) {
  const language = localStorage.getItem("preferredLanguage") || "en";
  const dictionary = {
    es: {
      "tracking.loading": "Buscando orden...",
      "tracking.local": "Mostrando tu confirmación local. Actualizaremos el estado en vivo pronto.",
      "tracking.notFound": "No encontramos la orden. Revisa el número o contáctanos.",
      "zelle.copyEmail": "Copiar email de Zelle",
      "zelle.copyOrder": "Copiar número de orden",
      "zelle.copied": "Copiado",
    },
    en: {
      "tracking.loading": "Checking order...",
      "tracking.local": "Showing your local order confirmation. We will update the live status soon.",
      "tracking.notFound": "Order not found. Check the number or contact us.",
      "zelle.copyEmail": "Copy Zelle email",
      "zelle.copyOrder": "Copy order number",
      "zelle.copied": "Copied",
    },
  };

  return dictionary[language]?.[key] || dictionary.en[key] || fallback;
}

function findLocalOrder(orderNumber) {
  try {
    const savedOrders = JSON.parse(localStorage.getItem(localOrdersKey) || "[]");
    return savedOrders.find((order) => normalizeTrackingOrder(order.orderNumber) === orderNumber) || null;
  } catch {
    return null;
  }
}

function normalizeTrackingOrder(value) {
  return String(value || "")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .trim()
    .toUpperCase();
}

function formatTrackingDate(value) {
  if (!value) return "-";
  const language = localStorage.getItem("preferredLanguage") || "en";
  return new Date(value).toLocaleString(language === "es" ? "es-US" : "en-US");
}

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value || 0);
}
