const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector("#menu");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const chatMessages = document.querySelector("#chatMessages");
const uploadForm = document.querySelector("#uploadForm");
const uploadFile = document.querySelector("#uploadFile");
const uploadStatus = document.querySelector("#uploadStatus");
const languageButtons = document.querySelectorAll("[data-lang]");
const maxUploadSize = 4 * 1024 * 1024;

const translations = {
  es: {
    "nav.print": "Impresión",
    "nav.consultant": "Agente consultor",
    "nav.multi": "Multiservicios",
    "nav.ai": "Asistente IA",
    "nav.contact": "Contáctanos",
    "hero.badge": "Orgullosamente ecuatorianos",
    "hero.title": "Imprimimos. Te ayudamos. Hacemos que las cosas sucedan.",
    "hero.copy":
      "Servicios de impresión, trámites, DMV, E-ZPass, documentos, pagos, traducciones y asistencia personalizada en Brooklyn.",
    "hero.call": "Llamar ahora",
    "hero.ask": "Preguntar a la IA",
    "hero.quality": "Alta calidad",
    "hero.fast": "Entrega rápida",
    "hero.prices": "Precios excelentes",
    "hero.bilingual": "Bilingüe ES / EN",
    "upload.eyebrow": "Ordena tus copias",
    "upload.title": "Sube tus archivos",
    "upload.subtitle": "Full color / blanco y negro",
    "upload.name": "Nombre",
    "upload.email": "Email",
    "upload.phone": "Teléfono",
    "upload.notes": "Detalles del pedido",
    "upload.notesPlaceholder": "Cantidad, tamaño, color, fecha...",
    "upload.choose": "Escoger archivo",
    "upload.button": "Upload your files",
    "upload.selected": "Archivo seleccionado:",
    "upload.sending": "Enviando archivo...",
    "upload.success": "Listo. Tu archivo fue enviado a Next Print NY.",
    "upload.error": "No se pudo enviar. Llama al 239 333 7935 o intenta de nuevo.",
    "upload.configError": "El formulario está listo, pero falta configurar RESEND_API_KEY en Vercel.",
    "upload.sizeError": "El archivo debe pesar menos de 4 MB.",
    "tabs.print": "🖨️ Impresión",
    "tabs.consultant": "🤝 Agente consultor",
    "tabs.multi": "👥 Multiservicios",
    "services.eyebrow": "Todo en un solo lugar",
    "services.title": "Servicios principales",
    "print.title": "Servicios de impresión",
    "print.item1": "Tarjetas de presentación",
    "print.item2": "Volantes, postales y banners",
    "print.item3": "Perchas para puertas y stickers",
    "print.item4": "Letreros, afiches y menús",
    "print.item5": "Rotulación de vehículos",
    "print.item6": "Letreros para autos y jardín",
    "print.item7": "Impresión en camisetas",
    "print.item8": "Bordados, folletos y facturas",
    "print.note": "Alta calidad, entrega rápida, precios excelentes.",
    "consultant.title": "Servicios de agente consultor",
    "consultant.item1": "Formularios y asistencia del DMV",
    "consultant.item2": "Registro de E-ZPass",
    "consultant.item3": "Formación de empresas LLC, S-Corp y Corporaciones",
    "consultant.item4": "Asistencia de seguros",
    "consultant.item5": "Orientación de préstamos y financiamiento",
    "consultant.item6": "Preparación de documentos",
    "consultant.item7": "Coordinación con abogados",
    "consultant.item8": "Registro de negocio, EIN e ITIN",
    "consultant.item9": "Asistencia con trámites de inmigración",
    "multi.title": "Multiservicios",
    "multi.item1": "Traducciones inglés - español",
    "multi.item2": "Pago de facturas",
    "multi.item3": "Pago de tickets de tránsito y estacionamiento",
    "multi.item4": "Asistencia con formularios generales",
    "multi.item5": "Servicios administrativos",
    "multi.item6": "Referencias a notaría",
    "multi.item7": "Soluciones de E-ZPass y DMV",
    "multi.item8": "Y mucho más",
    "multi.note": "Sirviendo con calidad y compromiso.",
    "support.dmv": "Asistencia para formularios, pagos y orientación.",
    "support.insuranceTitle": "Seguros",
    "support.insurance": "Compensación laboral y responsabilidad civil.",
    "support.housingTitle": "Servicios de vivienda",
    "support.housing": "Compramos casas en efectivo y vendemos casas.",
    "support.loansTitle": "Préstamos y financiamiento",
    "support.loans": "Te guiamos para obtener el financiamiento que necesitas.",
    "ai.eyebrow": "Asistente IA",
    "ai.title": "Pregunta lo que necesites",
    "ai.item1": "Respuestas rápidas sobre servicios",
    "ai.item2": "Soporte 24/7 cuando esté conectado a Vercel",
    "ai.item3": "Bilingüe español e inglés",
    "ai.item4": "Cotizaciones iniciales al instante",
    "chat.title": "Chat con IA",
    "chat.identity": "Identidad: Next Print NY",
    "chat.welcome":
      "Hola, soy el asistente de Next Print NY. Puedo ayudarte con impresión, DMV, E-ZPass, pagos, traducciones y cotizaciones.",
    "chat.label": "Escribe tu pregunta",
    "chat.placeholder": "Pregunta ahora...",
    "chat.send": "Enviar",
    "chat.loading": "Escribiendo respuesta...",
    "contact.eyebrow": "Estamos aquí para ayudarte",
    "contact.title": "Ahorra tiempo. Ahorra dinero. Obtén resultados.",
    "contact.telegram": "💬 Chat en Telegram",
    "contact.ai": "🤖 Chat con IA",
    "footer.tagline": "Impresiones de calidad. A tiempo. Siempre.",
  },
  en: {
    "nav.print": "Printing",
    "nav.consultant": "Consulting agent",
    "nav.multi": "Multiservices",
    "nav.ai": "AI assistant",
    "nav.contact": "Contact us",
    "hero.badge": "Proudly Ecuadorian",
    "hero.title": "We print. We help. We make things happen.",
    "hero.copy":
      "Printing, DMV, E-ZPass, documents, payments, translations and personalized assistance in Brooklyn.",
    "hero.call": "Call now",
    "hero.ask": "Ask the AI",
    "hero.quality": "High quality",
    "hero.fast": "Fast delivery",
    "hero.prices": "Excellent prices",
    "hero.bilingual": "Bilingual ES / EN",
    "upload.eyebrow": "Order your copies",
    "upload.title": "Upload your files",
    "upload.subtitle": "Full color / black and white",
    "upload.name": "Name",
    "upload.email": "Email",
    "upload.phone": "Phone",
    "upload.notes": "Order details",
    "upload.notesPlaceholder": "Quantity, size, color, date...",
    "upload.choose": "Choose file",
    "upload.button": "Upload your files",
    "upload.selected": "Selected file:",
    "upload.sending": "Sending file...",
    "upload.success": "Done. Your file was sent to Next Print NY.",
    "upload.error": "Could not send. Call 239 333 7935 or try again.",
    "upload.configError": "The form is ready, but RESEND_API_KEY must be configured in Vercel.",
    "upload.sizeError": "The file must be under 4 MB.",
    "tabs.print": "🖨️ Printing",
    "tabs.consultant": "🤝 Consulting agent",
    "tabs.multi": "👥 Multiservices",
    "services.eyebrow": "Everything in one place",
    "services.title": "Main services",
    "print.title": "Printing services",
    "print.item1": "Business cards",
    "print.item2": "Flyers, postcards and banners",
    "print.item3": "Door hangers and stickers",
    "print.item4": "Signs, posters and menus",
    "print.item5": "Vehicle lettering",
    "print.item6": "Car and yard signs",
    "print.item7": "T-shirt printing",
    "print.item8": "Embroidery, brochures and invoices",
    "print.note": "High quality, fast delivery, excellent prices.",
    "consultant.title": "Consulting agent services",
    "consultant.item1": "DMV forms and assistance",
    "consultant.item2": "E-ZPass registration",
    "consultant.item3": "Business formation: LLC, S-Corp and Corporations",
    "consultant.item4": "Insurance assistance",
    "consultant.item5": "Loan and financing guidance",
    "consultant.item6": "Document preparation",
    "consultant.item7": "Coordination with attorneys",
    "consultant.item8": "Business registration, EIN and ITIN",
    "consultant.item9": "Immigration paperwork assistance",
    "multi.title": "Multiservices",
    "multi.item1": "English - Spanish translations",
    "multi.item2": "Bill payments",
    "multi.item3": "Traffic and parking ticket payments",
    "multi.item4": "General form assistance",
    "multi.item5": "Administrative services",
    "multi.item6": "Notary referrals",
    "multi.item7": "E-ZPass and DMV solutions",
    "multi.item8": "And much more",
    "multi.note": "Serving with quality and commitment.",
    "support.dmv": "Assistance with forms, payments and guidance.",
    "support.insuranceTitle": "Insurance",
    "support.insurance": "Workers compensation and general liability.",
    "support.housingTitle": "Housing services",
    "support.housing": "We buy houses for cash and sell homes.",
    "support.loansTitle": "Loans and financing",
    "support.loans": "We guide you to obtain the financing you need.",
    "ai.eyebrow": "AI Assistant",
    "ai.title": "Ask what you need",
    "ai.item1": "Fast answers about services",
    "ai.item2": "24/7 support when connected to Vercel",
    "ai.item3": "Bilingual Spanish and English",
    "ai.item4": "Instant initial quotes",
    "chat.title": "Chat with AI",
    "chat.identity": "Identity: Next Print NY",
    "chat.welcome":
      "Hi, I am the Next Print NY assistant. I can help with printing, DMV, E-ZPass, payments, translations and quotes.",
    "chat.label": "Type your question",
    "chat.placeholder": "Ask now...",
    "chat.send": "Send",
    "chat.loading": "Writing response...",
    "contact.eyebrow": "We are here to help",
    "contact.title": "Save time. Save money. Get results.",
    "contact.telegram": "💬 Chat on Telegram",
    "contact.ai": "🤖 Chat with AI",
    "footer.tagline": "Quality prints. On time. Always.",
  },
};

const fallbackAnswers = {
  es: [
    {
      keywords: ["precio", "cotizacion", "cotización", "quote"],
      answer:
        "Para una cotización rápida, dime el servicio, cantidad, tamaño, material y fecha que lo necesitas. También puedes llamar al 239 333 7935.",
    },
    {
      keywords: ["dmv", "ezpass", "e-zpass", "ticket"],
      answer:
        "Podemos ayudarte con formularios del DMV, E-ZPass y pagos de tickets. Visítanos en 1510 Gates Ave, Brooklyn, NY 11237 o llama al 239 333 7935.",
    },
    {
      keywords: ["traduccion", "traducción", "translate", "english", "español"],
      answer:
        "Ofrecemos asistencia con traducciones inglés - español. Cuéntame qué documento tienes y para cuándo lo necesitas.",
    },
    {
      keywords: ["tarjeta", "volante", "banner", "camiseta", "sticker", "impresion", "impresión"],
      answer:
        "Hacemos tarjetas, volantes, banners, stickers, letreros, camisetas, bordados y más. Para cotizar, comparte cantidad, tamaño y fecha de entrega.",
    },
  ],
  en: [
    {
      keywords: ["price", "quote", "estimate", "cost", "cotizacion", "cotización"],
      answer:
        "For a quick quote, tell me the service, quantity, size, material and deadline. You can also call 239 333 7935.",
    },
    {
      keywords: ["dmv", "ezpass", "e-zpass", "ticket"],
      answer:
        "We can help with DMV forms, E-ZPass and ticket payments. Visit us at 1510 Gates Ave, Brooklyn, NY 11237 or call 239 333 7935.",
    },
    {
      keywords: ["translation", "translate", "english", "spanish", "español"],
      answer:
        "We offer English - Spanish translation assistance. Tell me what document you have and when you need it.",
    },
    {
      keywords: ["card", "flyer", "banner", "shirt", "sticker", "print", "printing"],
      answer:
        "We print business cards, flyers, banners, stickers, signs, shirts, embroidery and more. For a quote, share quantity, size and delivery date.",
    },
  ],
};

let currentLanguage = localStorage.getItem("preferredLanguage") || "es";

function t(key) {
  return translations[currentLanguage][key] || translations.es[key] || key;
}

function applyLanguage(language) {
  currentLanguage = translations[language] ? language : "es";
  localStorage.setItem("preferredLanguage", currentLanguage);
  document.documentElement.lang = currentLanguage;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    element.textContent = t(key);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.getAttribute("data-i18n-placeholder");
    element.setAttribute("placeholder", t(key));
  });

  languageButtons.forEach((button) => {
    const isActive = button.dataset.lang === currentLanguage;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

menuToggle?.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

menu?.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    menu.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }
});

languageButtons.forEach((button) => {
  button.addEventListener("click", () => applyLanguage(button.dataset.lang));
});

function addMessage(text, type) {
  const message = document.createElement("div");
  message.className = `message ${type}`;
  message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function localReply(text) {
  const normalized = text.toLowerCase();
  const answers = fallbackAnswers[currentLanguage] || fallbackAnswers.es;
  const match = answers.find((item) =>
    item.keywords.some((keyword) => normalized.includes(keyword))
  );

  return (
    match?.answer ||
    (currentLanguage === "en"
      ? "Thanks for contacting Next Print NY. I can guide you with printing, consulting services, DMV, E-ZPass, payments, translations and paperwork. What do you need today?"
      : "Gracias por escribir a Next Print NY. Puedo orientarte sobre impresión, agente consultor, DMV, E-ZPass, pagos, traducciones y trámites. ¿Qué necesitas hacer hoy?")
  );
}

async function askAssistant(message) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, language: currentLanguage }),
    });

    if (!response.ok) {
      throw new Error("AI endpoint unavailable");
    }

    const data = await response.json();
    return data.reply || localReply(message);
  } catch {
    return localReply(message);
  }
}

chatForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = chatInput.value.trim();

  if (!message) return;

  addMessage(message, "user");
  chatInput.value = "";
  chatInput.disabled = true;

  addMessage(t("chat.loading"), "bot");
  const loadingMessage = chatMessages.lastElementChild;
  const reply = await askAssistant(message);
  loadingMessage.textContent = reply;

  chatInput.disabled = false;
  chatInput.focus();
});

function setUploadStatus(text, type = "") {
  if (!uploadStatus) return;
  uploadStatus.textContent = text;
  uploadStatus.className = `upload-status ${type}`.trim();
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

uploadFile?.addEventListener("change", () => {
  const file = uploadFile.files?.[0];

  if (!file) {
    setUploadStatus("");
    return;
  }

  if (file.size > maxUploadSize) {
    uploadFile.value = "";
    setUploadStatus(t("upload.sizeError"), "error");
    return;
  }

  setUploadStatus(`${t("upload.selected")} ${file.name}`);
});

uploadForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const file = uploadFile.files?.[0];

  if (!file) return;

  if (file.size > maxUploadSize) {
    setUploadStatus(t("upload.sizeError"), "error");
    return;
  }

  const formData = new FormData(uploadForm);
  const submitButtonText = uploadForm.querySelector(".upload-submit");
  const originalButtonText = submitButtonText?.textContent || t("upload.button");

  setUploadStatus(t("upload.sending"));
  uploadForm.querySelectorAll("input, textarea").forEach((field) => {
    field.disabled = true;
  });
  if (submitButtonText) submitButtonText.textContent = t("upload.sending");

  try {
    const fileContent = await fileToBase64(file);
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: currentLanguage,
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        notes: formData.get("notes"),
        file: {
          name: file.name,
          type: file.type || "application/octet-stream",
          content: fileContent,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Upload failed");
    }

    uploadForm.reset();
    setUploadStatus(t("upload.success"), "success");
  } catch (error) {
    const message =
      error.message === "RESEND_API_KEY missing" ? t("upload.configError") : t("upload.error");
    setUploadStatus(message, "error");
  } finally {
    uploadForm.querySelectorAll("input, textarea").forEach((field) => {
      field.disabled = false;
    });
    if (submitButtonText) submitButtonText.textContent = originalButtonText;
  }
});

applyLanguage(currentLanguage);
