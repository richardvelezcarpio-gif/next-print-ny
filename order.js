const smartOrderForm = document.querySelector("#smartOrderForm");
const orderFile = document.querySelector("#orderFile");
const orderFileName = document.querySelector("#orderFileName");
const orderStatus = document.querySelector("#orderStatus");
const orderSuccess = document.querySelector("#orderSuccess");
const orderNumber = document.querySelector("#orderNumber");
const orderWhatsapp = document.querySelector("#orderWhatsapp");
const orderTrackLink = document.querySelector("#orderTrackLink");
const orderZelleEmail = document.querySelector("#orderZelleEmail");
const orderZelleNote = document.querySelector("#orderZelleNote");
const orderCopyZelle = document.querySelector("#orderCopyZelle");
const orderCopyNumber = document.querySelector("#orderCopyNumber");
const orderMaxFileSize = 4 * 1024 * 1024;
const localOrdersKey = "nextPrintRecentOrders";
const zelleEmail = "nextprintny@gmail.com";

orderCopyZelle?.addEventListener("click", () => copyOrderValue(zelleEmail, orderCopyZelle, "zelle.copyEmail"));
orderCopyNumber?.addEventListener("click", () => copyOrderValue(orderNumber.textContent, orderCopyNumber, "zelle.copyOrder"));

orderFile?.addEventListener("change", () => {
  const file = orderFile.files?.[0];

  if (!file) {
    orderFileName.textContent = getOrderText("order.fileHint", "PDF, JPG, PNG or design file. Optional.");
    return;
  }

  if (file.size > orderMaxFileSize) {
    orderFile.value = "";
    orderFileName.textContent = getOrderText("order.fileTooLarge", "File must be under 4 MB.");
    orderFileName.classList.add("error");
    return;
  }

  orderFileName.classList.remove("error");
  orderFileName.textContent = file.name;
});

smartOrderForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  setOrderStatus(getOrderText("order.sending", "Sending order..."));

  const submitButton = smartOrderForm.querySelector("button[type='submit']");
  submitButton.disabled = true;

  try {
    const formData = new FormData(smartOrderForm);
    const file = orderFile.files?.[0];
    const payload = {
      language: localStorage.getItem("preferredLanguage") || "en",
      service: formData.get("service"),
      details: formData.get("details"),
      dueDate: formData.get("dueDate"),
      budget: formData.get("budget"),
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      file: file
        ? {
            name: file.name,
            content: await fileToBase64(file),
          }
        : null,
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
    if (orderZelleEmail) orderZelleEmail.textContent = zelleEmail;
    if (orderZelleNote) orderZelleNote.textContent = `Order ${data.orderNumber}`;
    orderWhatsapp.href = data.whatsappUrl || orderWhatsapp.href;
    if (orderTrackLink) {
      orderTrackLink.href = `tracking.html?order=${encodeURIComponent(data.orderNumber)}`;
    }
    orderSuccess.hidden = false;
    smartOrderForm.reset();
    orderFileName.textContent = getOrderText("order.fileHint", "PDF, JPG, PNG or design file. Optional.");
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
      "order.fileHint": "PDF, JPG, PNG o archivo de diseño. Opcional.",
      "order.fileTooLarge": "El archivo debe pesar menos de 4 MB.",
      "order.sending": "Enviando orden...",
      "order.sent": "Orden enviada.",
      "order.configError": "El formulario necesita RESEND_API_KEY en Vercel.",
      "order.error": "No se pudo enviar. Llámanos o escríbenos por WhatsApp.",
      "zelle.copyEmail": "Copiar email de Zelle",
      "zelle.copyOrder": "Copiar número de orden",
      "zelle.copied": "Copiado",
    },
    en: {
      "order.fileHint": "PDF, JPG, PNG or design file. Optional.",
      "order.fileTooLarge": "File must be under 4 MB.",
      "order.sending": "Sending order...",
      "order.sent": "Order sent.",
      "order.configError": "Order form needs RESEND_API_KEY in Vercel.",
      "order.error": "Could not send. Please call or WhatsApp us.",
      "zelle.copyEmail": "Copy Zelle email",
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
