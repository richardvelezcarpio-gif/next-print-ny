const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector("#menu");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const chatMessages = document.querySelector("#chatMessages");

const fallbackAnswers = [
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
];

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

function addMessage(text, type) {
  const message = document.createElement("div");
  message.className = `message ${type}`;
  message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function localReply(text) {
  const normalized = text.toLowerCase();
  const match = fallbackAnswers.find((item) =>
    item.keywords.some((keyword) => normalized.includes(keyword))
  );

  return (
    match?.answer ||
    "Gracias por escribir a Next Print NY. Puedo orientarte sobre impresión, agente consultor, DMV, E-ZPass, pagos, traducciones y trámites. ¿Qué necesitas hacer hoy?"
  );
}

async function askAssistant(message) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
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

  addMessage("Escribiendo respuesta...", "bot");
  const loadingMessage = chatMessages.lastElementChild;
  const reply = await askAssistant(message);
  loadingMessage.textContent = reply;

  chatInput.disabled = false;
  chatInput.focus();
});
