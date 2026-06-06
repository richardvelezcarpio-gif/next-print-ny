const colors = [
  ["White", "#f7f7f4"],
  ["Black", "#17191d"],
  ["Navy", "#142b52"],
  ["Royal Blue", "#2359a7"],
  ["Red", "#c92f38"],
  ["Forest Green", "#24533c"],
  ["Sport Gray", "#aeb3b8"],
  ["Charcoal", "#474b50"],
  ["Maroon", "#692a38"],
  ["Sand", "#c9b998"],
];
const sizes = ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];
const selectionKey = "nextPrintTshirtSelection";
const state = {
  color: colors[0][0],
  colorHex: colors[0][1],
  quantities: Object.fromEntries(colors.map(([color]) => [color, Object.fromEntries(sizes.map((size) => [size, 0]))])),
};
const lang = localStorage.getItem("preferredLanguage") || "en";

const copy = {
  en: {
    kicker: "Custom apparel",
    title: "Gildan G500 Unisex Heavy Cotton",
    intro: "Professional custom T-shirts with left chest and back print options. Choose from 10 basic colors and create your design online.",
    each: "each",
    factBrand: "Gildan G500 heavy cotton",
    factColors: "10 colors available",
    factDelivery: "7-day delivery date",
    designCta: "Design Shirt",
    color: "Choose a color",
    size: "Choose quantities by size",
    note: "S-XL are $14 each. 2XL-5XL are $18 each.",
    quantity: "Total shirts",
    total: "Order total",
    delivery: "Delivery date: automatically 7 days after the order.",
    next: "Continue to designer",
    empty: "Add at least one quantity to continue.",
    summary: "Selected shirts",
    areaTitle: "Print areas",
    areaText: "Front left chest: 4 x 4 in · Back: 14 x 14 in",
  },
  es: {
    kicker: "Ropa personalizada",
    title: "Gildan G500 Unisex Heavy Cotton",
    intro: "Camisetas personalizadas profesionales con impresión en pecho izquierdo y espalda. Escoge entre 10 colores básicos y diseña en línea.",
    each: "cada una",
    factBrand: "Gildan G500 algodón heavy cotton",
    factColors: "10 colores disponibles",
    factDelivery: "Entrega automática en 7 días",
    designCta: "Diseñar camiseta",
    color: "Escoge un color",
    size: "Escoge cantidades por talla",
    note: "S-XL cuestan $14 cada una. 2XL-5XL cuestan $18 cada una.",
    quantity: "Total de camisetas",
    total: "Total del pedido",
    delivery: "Fecha de entrega: automáticamente 7 días después de la orden.",
    next: "Continuar al diseñador",
    empty: "Agrega al menos una cantidad para continuar.",
    summary: "Camisetas seleccionadas",
    areaTitle: "Áreas de impresión",
    areaText: "Frente izquierdo: 4 x 4 pulgadas · Espalda: 14 x 14 pulgadas",
  },
};

const shirtPreview = document.querySelector("#shirtPreview");
const shirtColorName = document.querySelector("#shirtColorName");
const shirtColors = document.querySelector("#shirtColors");
const shirtSizes = document.querySelector("#shirtSizes");
const shirtOrderSummary = document.querySelector("#shirtOrderSummary");
const form = document.querySelector("#shirtSelectionForm");

renderLanguage(lang);
renderColors();
renderSizeRows();
updateSelection();

document.querySelectorAll("[data-shirt-lang]").forEach((button) =>
  button.addEventListener("click", () => {
    localStorage.setItem("preferredLanguage", button.dataset.shirtLang);
    renderLanguage(button.dataset.shirtLang);
    updateSelection();
  })
);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const selection = buildSelection();
  if (!selection.items.length) {
    shirtOrderSummary.innerHTML = `<p class="error">${activeCopy().empty}</p>`;
    return;
  }
  sessionStorage.setItem(selectionKey, JSON.stringify(selection));
  window.location.href = "tshirt-designer.html";
});

function renderColors() {
  shirtColors.innerHTML = colors
    .map(
      ([name, hex], index) =>
        `<button type="button" class="shirt-color-swatch${index === 0 ? " active" : ""}" data-color="${name}" data-hex="${hex}" aria-label="${name}" title="${name}" style="--swatch:${hex}"><span></span></button>`
    )
    .join("");

  shirtColors.addEventListener("click", (event) => {
    const button = event.target.closest("[data-color]");
    if (!button) return;
    state.color = button.dataset.color;
    state.colorHex = button.dataset.hex;
    shirtColors.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
    renderSizeRows();
    updateSelection();
  });
}

function renderSizeRows() {
  const colorQuantities = state.quantities[state.color];
  shirtSizes.innerHTML = sizes
    .map(
      (size) => `
        <label class="shirt-size-qty">
          <span class="shirt-size-code">${size}</span>
          <span class="shirt-size-price">${money(unitPrice(size))}</span>
          <input type="number" min="0" max="500" value="${colorQuantities[size] || 0}" data-size="${size}" inputmode="numeric" aria-label="${state.color} ${size} quantity" />
        </label>`
    )
    .join("");

  shirtSizes.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
      const value = Math.max(0, Math.min(500, Number.parseInt(input.value || "0", 10) || 0));
      state.quantities[state.color][input.dataset.size] = value;
      input.value = String(value);
      updateSelection();
    });
  });
}

function updateSelection() {
  shirtPreview.style.setProperty("--shirt-color", state.colorHex);
  shirtColorName.textContent = state.color;
  const selection = buildSelection();
  document.querySelector("#shirtTotalQty").textContent = String(selection.totalQuantity);
  document.querySelector("#shirtTotal").textContent = money(selection.totalPrice);
  renderSummary(selection);
}

function renderSummary(selection) {
  if (!selection.items.length) {
    shirtOrderSummary.innerHTML = `<strong>${activeCopy().summary}</strong><p>${activeCopy().empty}</p>`;
    return;
  }

  shirtOrderSummary.innerHTML = `
    <strong>${activeCopy().summary}</strong>
    <div>
      ${selection.items
        .map(
          (item) =>
            `<span><b>${item.color}</b> ${item.size}: ${item.quantity} × ${money(item.unitPrice)} = ${money(item.lineTotal)}</span>`
        )
        .join("")}
    </div>`;
}

function buildSelection() {
  const items = [];
  colors.forEach(([color, hex]) => {
    sizes.forEach((size) => {
      const quantity = state.quantities[color][size] || 0;
      if (!quantity) return;
      const unit = unitPrice(size);
      items.push({ color, hex, size, quantity, unitPrice: unit, lineTotal: unit * quantity });
    });
  });

  return {
    product: "Gildan G500 T-Shirt Mix",
    brand: "Gildan G500 Unisex Heavy Cotton",
    items,
    totalQuantity: items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: items.reduce((total, item) => total + item.lineTotal, 0),
  };
}

function unitPrice(size) {
  return ["2XL", "3XL", "4XL", "5XL"].includes(size) ? 18 : 14;
}

function money(value) {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function activeCopy() {
  return copy[localStorage.getItem("preferredLanguage") || "en"] || copy.en;
}

function renderLanguage(language) {
  const text = copy[language] || copy.en;
  [
    ["shirtKicker", "kicker"],
    ["shirtTitle", "title"],
    ["shirtIntro", "intro"],
    ["shirtEachLabel", "each"],
    ["shirtFactBrand", "factBrand"],
    ["shirtFactColors", "factColors"],
    ["shirtFactDelivery", "factDelivery"],
    ["shirtDesignCta", "designCta"],
    ["colorTitle", "color"],
    ["sizeTitle", "size"],
    ["sizeNote", "note"],
    ["quantityLabel", "quantity"],
    ["totalLabel", "total"],
    ["deliveryNote", "delivery"],
    ["openDesigner", "next"],
    ["printAreaTitle", "areaTitle"],
    ["printAreaText", "areaText"],
  ].forEach(([id, key]) => {
    const node = document.querySelector(`#${id}`);
    if (node) node.textContent = text[key];
  });
}
