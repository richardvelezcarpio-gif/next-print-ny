const trackingForm = document.querySelector("#trackingForm");
const trackingInput = document.querySelector("#trackingInput");
const trackingStatus = document.querySelector("#trackingStatus");
const trackingResult = document.querySelector("#trackingResult");
const trackingOrderTitle = document.querySelector("#trackingOrderTitle");
const trackingCustomer = document.querySelector("#trackingCustomer");
const trackingUpdated = document.querySelector("#trackingUpdated");
const trackingWhatsapp = document.querySelector("#trackingWhatsapp");

const trackingOrder = new URLSearchParams(window.location.search).get("order");
if (trackingOrder && trackingInput) {
  trackingInput.value = trackingOrder;
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
    setTrackingStatus(getTrackingText("tracking.notFound", "Order not found. Check the number or contact us."), "error");
  }
});

function renderTrackingResult(order) {
  trackingOrderTitle.textContent = order.title || order.orderNumber;
  trackingCustomer.textContent = order.customerName || "-";
  trackingUpdated.textContent = formatTrackingDate(order.updatedAt);
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

function getTrackingText(key, fallback) {
  const language = localStorage.getItem("preferredLanguage") || "en";
  const dictionary = {
    es: {
      "tracking.loading": "Buscando orden...",
      "tracking.notFound": "No encontramos la orden. Revisa el número o contáctanos.",
    },
    en: {
      "tracking.loading": "Checking order...",
      "tracking.notFound": "Order not found. Check the number or contact us.",
    },
  };

  return dictionary[language]?.[key] || dictionary.en[key] || fallback;
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
