const colors = [
  ["White", "#f7f7f4"], ["Black", "#17191d"], ["Navy", "#142b52"], ["Royal Blue", "#2359a7"], ["Red", "#c92f38"],
  ["Forest Green", "#24533c"], ["Sport Gray", "#aeb3b8"], ["Charcoal", "#474b50"], ["Maroon", "#692a38"], ["Sand", "#c9b998"],
];
const sizes = ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];
const state = { color: colors[0][0], colorHex: colors[0][1], size: "M", quantity: 1 };
const lang = localStorage.getItem("preferredLanguage") || "en";

const copy = {
  en: { kicker:"Custom apparel", title:"Gildan G500 Unisex Heavy Cotton", intro:"Choose your shirt color, size and quantity. Then create the front design in our online designer.", color:"Choose a color", size:"Choose a size", note:"Sizes 2XL–5XL add $4 per shirt.", quantity:"Quantity", unit:"Price per shirt", total:"Order total", delivery:"Delivery date: automatically 7 days after the order.", next:"Continue to designer" },
  es: { kicker:"Ropa personalizada", title:"Gildan G500 Unisex Heavy Cotton", intro:"Escoge el color, talla y cantidad. Luego crea el diseño frontal en nuestro diseñador en línea.", color:"Escoge un color", size:"Escoge una talla", note:"Las tallas 2XL–5XL agregan $4 por camiseta.", quantity:"Cantidad", unit:"Precio por camiseta", total:"Total del pedido", delivery:"Fecha de entrega: automáticamente 7 días después de la orden.", next:"Continuar al diseñador" },
};

const shirtPreview = document.querySelector("#shirtPreview");
const shirtColorName = document.querySelector("#shirtColorName");
const shirtColors = document.querySelector("#shirtColors");
const shirtSizes = document.querySelector("#shirtSizes");
const shirtQuantity = document.querySelector("#shirtQuantity");

renderLanguage(lang);
renderColors();
renderSizes();
updateSelection();

document.querySelectorAll("[data-shirt-lang]").forEach((button) => button.addEventListener("click", () => {
  localStorage.setItem("preferredLanguage", button.dataset.shirtLang);
  renderLanguage(button.dataset.shirtLang);
}));
shirtQuantity.addEventListener("input", () => { state.quantity = Math.max(1, Number(shirtQuantity.value) || 1); updateSelection(); });
document.querySelector("#shirtSelectionForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const params = new URLSearchParams({ color: state.color, hex: state.colorHex, size: state.size, quantity: String(state.quantity) });
  window.location.href = `tshirt-designer.html?${params.toString()}`;
});

function renderColors() {
  shirtColors.innerHTML = colors.map(([name, hex], index) => `<button type="button" class="shirt-color-swatch${index === 0 ? " active" : ""}" data-color="${name}" data-hex="${hex}" aria-label="${name}" title="${name}" style="--swatch:${hex}"><span></span></button>`).join("");
  shirtColors.addEventListener("click", (event) => {
    const button = event.target.closest("[data-color]"); if (!button) return;
    state.color = button.dataset.color; state.colorHex = button.dataset.hex;
    shirtColors.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
    updateSelection();
  });
}
function renderSizes() {
  shirtSizes.innerHTML = sizes.map((size) => `<button type="button" class="${size === state.size ? "active" : ""}" data-size="${size}"><strong>${size}</strong><small>${money(unitPrice(size))}</small></button>`).join("");
  shirtSizes.addEventListener("click", (event) => {
    const button = event.target.closest("[data-size]"); if (!button) return;
    state.size = button.dataset.size; shirtSizes.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button)); updateSelection();
  });
}
function updateSelection() {
  shirtPreview.style.setProperty("--shirt-color", state.colorHex); shirtColorName.textContent = state.color;
  const unit = unitPrice(state.size); document.querySelector("#shirtUnitPrice").textContent = money(unit); document.querySelector("#shirtTotal").textContent = money(unit * state.quantity);
}
function unitPrice(size) { return ["2XL","3XL","4XL","5XL"].includes(size) ? 18 : 14; }
function money(value) { return `$${value.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`; }
function renderLanguage(language) {
  const text = copy[language] || copy.en;
  [["shirtKicker","kicker"],["shirtTitle","title"],["shirtIntro","intro"],["colorTitle","color"],["sizeTitle","size"],["sizeNote","note"],["quantityLabel","quantity"],["unitPriceLabel","unit"],["totalLabel","total"],["deliveryNote","delivery"],["openDesigner","next"]].forEach(([id,key])=>{const node=document.querySelector(`#${id}`);if(node)node.textContent=text[key]});
}
