const smartOrderForm = document.querySelector("#smartOrderForm");
const orderFile = document.querySelector("#orderFile");
const orderFileName = document.querySelector("#orderFileName");
const orderStatus = document.querySelector("#orderStatus");
const orderSuccess = document.querySelector("#orderSuccess");
const orderNumber = document.querySelector("#orderNumber");
const orderWhatsapp = document.querySelector("#orderWhatsapp");
const orderTrackLink = document.querySelector("#orderTrackLink");
const orderInvoiceLink = document.querySelector("#orderInvoiceLink");
const orderZelleEmail = document.querySelector("#orderZelleEmail");
const orderZelleNote = document.querySelector("#orderZelleNote");
const orderCopyZelle = document.querySelector("#orderCopyZelle");
const orderCopyNumber = document.querySelector("#orderCopyNumber");
const orderPayZelle = document.querySelector("#orderPayZelle");
const orderDateInput = document.querySelector("#orderDateInput");
const deliveryDateInput = document.querySelector("#deliveryDateInput");
const orderMaxFileSize = 4 * 1024 * 1024;
const orderMaxTotalFileSize = 12 * 1024 * 1024;
const localOrdersKey = "nextPrintRecentOrders";
const zelleAccount = "2393337935";

setAutomaticOrderDates();
prefillOrderFromCatalog();

orderCopyZelle?.addEventListener("click", () => copyOrderValue(zelleAccount, orderCopyZelle, "zelle.copyEmail"));
orderCopyNumber?.addEventListener("click", () => copyOrderValue(orderNumber.textContent, orderCopyNumber, "zelle.copyOrder"));

orderFile?.addEventListener("change", () => {
  const files = Array.from(orderFile.files || []);

  if (!files.length) {
    orderFileName.textContent = getOrderText("order.fileHint", "PDF, JPG, PNG or design files. Optional.");
    return;
  }

  const oversizedFile = files.find((file) => file.size > orderMaxFileSize);
  const totalSize = files.reduce((total, file) => total + file.size, 0);

  if (oversizedFile || totalSize > orderMaxTotalFileSize) {
    orderFile.value = "";
    orderFileName.textContent = oversizedFile
      ? getOrderText("order.fileTooLarge", "Each file must be under 4 MB.")
      : getOrderText("order.filesTooLarge", "All files together must be under 12 MB.");
    orderFileName.classList.add("error");
    return;
  }

  orderFileName.classList.remove("error");
  orderFileName.textContent = files.map((file) => file.name).join(", ");
});

smartOrderForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  setOrderStatus(getOrderText("order.sending", "Sending order..."));

  const submitButton = smartOrderForm.querySelector("button[type='submit']");
  submitButton.disabled = true;

  try {
    const formData = new FormData(smartOrderForm);
    const files = Array.from(orderFile.files || []);
    const payload = {
      language: localStorage.getItem("preferredLanguage") || "en",
      service: formData.get("service"),
      details: formData.get("details"),
      orderDate: formData.get("orderDate"),
      dueDate: formData.get("dueDate"),
      budget: formData.get("budget"),
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      files: await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          content: await fileToBase64(file),
        }))
      ),
    };

    const response = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Order failed");

    rememberLocalOrder({
      orderNumber: data.orderNumber,
      service: payload.service,
      name: payload.name,
      dueDate: payload.dueDate,
    });

    orderNumber.textContent = data.orderNumber;
    if (orderZelleEmail) orderZelleEmail.textContent = zelleAccount;
    if (orderZelleNote) orderZelleNote.textContent = `Order ${data.orderNumber}`;
    if (orderPayZelle) orderPayZelle.href = `payments.html?order=${encodeURIComponent(data.orderNumber)}`;
    orderWhatsapp.href = data.whatsappUrl || orderWhatsapp.href;
    if (orderTrackLink) {
      orderTrackLink.href = `tracking.html?order=${encodeURIComponent(data.orderNumber)}`;
    }
    if (orderInvoiceLink) {
      orderInvoiceLink.href = `invoice.html?order=${encodeURIComponent(data.orderNumber)}`;
    }
    orderSuccess.hidden = false;
    smartOrderForm.reset();
    setAutomaticOrderDates();
    orderFileName.textContent = getOrderText("order.fileHint", "PDF, JPG, PNG or design files. Optional.");
    setOrderStatus(getOrderText("order.sent", "Order sent."));
    orderSuccess.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    setOrderStatus(
      error.message === "RESEND_API_KEY missing"
        ? getOrderText("order.configError", "Order form needs RESEND_API_KEY in Vercel.")
        : getOrderText("order.error", "Could not send. Please call or WhatsApp us."),
      "error"
    );
  } finally {
    submitButton.disabled = false;
  }
});

function setOrderStatus(text, tone = "") {
  if (!orderStatus) return;
  orderStatus.textContent = text;
  orderStatus.className = `order-status ${tone}`.trim();
}

function setAutomaticOrderDates() {
  const orderDate = new Date();
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(orderDate.getDate() + 7);

  if (orderDateInput) orderDateInput.value = toDateInputValue(orderDate);
  if (deliveryDateInput) deliveryDateInput.value = toDateInputValue(deliveryDate);
}

function toDateInputValue(date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function prefillOrderFromCatalog() {
  if (!smartOrderForm) return;

  const params = new URLSearchParams(window.location.search);
  const product = cleanParam(params.get("product"));
  const quantity = cleanParam(params.get("quantity"));
  const price = cleanParam(params.get("price"));
  const details = cleanParam(params.get("details"));
  const service = cleanParam(params.get("service")) || "Printing";

  if (!product && !details) return;

  const detailsInput = smartOrderForm.querySelector('[name="details"]');
  const budgetInput = smartOrderForm.querySelector('[name="budget"]');

  if (detailsInput) {
    detailsInput.value = details || `Product: ${product}\nQuantity: ${quantity}\nSuggested sale price: ${price}`;
  }

  if (budgetInput && price) {
    budgetInput.value = price;
  }
}

function cleanParam(value) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, 500);
}

async function copyOrderValue(value, button, labelKey) {
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

  button.textContent = getOrderText("zelle.copied", "Copied");
  window.setTimeout(() => {
    button.textContent = getOrderText(labelKey, button.textContent);
  }, 1300);
}

function getOrderText(key, fallback) {
  const language = localStorage.getItem("preferredLanguage") || "en";
  const dictionary = {
    es: {
      "order.fileHint": "PDF, JPG, PNG o archivos de diseño. Opcional.",
      "order.fileTooLarge": "Cada archivo debe pesar menos de 4 MB.",
      "order.filesTooLarge": "Todos los archivos juntos deben pesar menos de 12 MB.",
      "order.sending": "Enviando orden...",
      "order.sent": "Orden enviada.",
      "order.configError": "El formulario necesita RESEND_API_KEY en Vercel.",
      "order.error": "No se pudo enviar. Llámanos o escríbenos por WhatsApp.",
      "zelle.copyEmail": "Copiar teléfono de Zelle",
      "zelle.copyOrder": "Copiar número de orden",
      "zelle.copied": "Copiado",
    },
    en: {
      "order.fileHint": "PDF, JPG, PNG or design files. Optional.",
      "order.fileTooLarge": "Each file must be under 4 MB.",
      "order.filesTooLarge": "All files together must be under 12 MB.",
      "order.sending": "Sending order...",
      "order.sent": "Order sent.",
      "order.configError": "Order form needs RESEND_API_KEY in Vercel.",
      "order.error": "Could not send. Please call or WhatsApp us.",
      "zelle.copyEmail": "Copy Zelle phone",
      "zelle.copyOrder": "Copy order number",
      "zelle.copied": "Copied",
    },
  };

  return dictionary[language]?.[key] || dictionary.en[key] || fallback;
}

function rememberLocalOrder(order) {
  try {
    const savedOrders = JSON.parse(localStorage.getItem(localOrdersKey) || "[]");
    const localOrder = {
      orderNumber: order.orderNumber,
      title: `${order.orderNumber} - ${order.service}`,
      status: "new",
      customerName: String(order.name || "").trim().split(/\s+/)[0] || "",
      dueDate: order.dueDate || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const nextOrders = [
      localOrder,
      ...savedOrders.filter((item) => item.orderNumber !== order.orderNumber),
    ].slice(0, 10);
    localStorage.setItem(localOrdersKey, JSON.stringify(nextOrders));
  } catch {
    // Local fallback is helpful but not required for submitting the order.
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      resolve(result.split(",")[1] || "");
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
