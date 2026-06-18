const colors = [
  ["White", "#f7f7f4", "white"],
  ["Black", "#17191d", "black"],
  ["Navy", "#142b52", "navy"],
  ["Royal Blue", "#2359a7", "royal-blue"],
  ["Red", "#c92f38", "red"],
  ["Forest Green", "#24533c", "forest-green"],
  ["Sport Gray", "#aeb3b8", "sport-gray"],
  ["Charcoal", "#474b50", "charcoal"],
  ["Maroon", "#692a38", "maroon"],
  ["Sand", "#c9b998", "sand"],
];
const sizes = ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];
const selectionKey = "nextPrintTshirtSelection";
const filesKey = "nextPrintTshirtFiles";
const detailsKey = "nextPrintTshirtDetails";
const lang = localStorage.getItem("preferredLanguage") || "en";

const state = {
  color: colors[0][0],
  colorHex: colors[0][1],
  colorSlug: colors[0][2],
  printOption: "frontBack",
  activeSide: "front",
  quantities: Object.fromEntries(colors.map(([color]) => [color, Object.fromEntries(sizes.map((size) => [size, 0]))])),
};

const designs = {
  front: { artwork: null, text: "", color: "#05275c", size: 34, shape: "straight", scale: 62, position: { x: 413, y: 310 } },
  back: { artwork: null, text: "", color: "#05275c", size: 52, shape: "straight", scale: 70, position: { x: 360, y: 392 } },
};

let originalArtwork = null;
let dragging = false;
let mockupImage = new Image();

const copy = {
  en: {
    kicker: "Custom apparel",
    title: "Custom T-Shirts|Made Your Way",
    intro: "High quality prints. Any design, any color, any size. Perfect for your business, event, team or organization.",
    color: "Choose a color",
    size: "Choose quantities by size",
    note: "S-XL are $14 each. 2XL-5XL are $18 each.",
    quantity: "Total shirts",
    total: "Order total",
    delivery: "Delivery date: automatically 7 days after the order.",
    next: "Approve design and order",
    empty: "Add at least one quantity to continue.",
    summary: "Selected shirts",
    areaTitle: "Print areas",
    areaText: {
      frontBack: "Front left chest: 4 x 4 in · Back: 14 x 14 in",
      frontOnly: "Front only: 14 x 14 in",
    },
  },
  es: {
    kicker: "Ropa personalizada",
    title: "Camisetas custom|a tu manera",
    intro: "Impresiones de alta calidad. Cualquier diseño, color y talla. Perfecto para tu negocio, evento, equipo u organización.",
    color: "Escoge un color",
    size: "Escoge cantidades por talla",
    note: "S-XL cuestan $14 cada una. 2XL-5XL cuestan $18 cada una.",
    quantity: "Total de camisetas",
    total: "Total del pedido",
    delivery: "Fecha de entrega: automáticamente 7 días después de la orden.",
    next: "Aprobar diseño y ordenar",
    empty: "Agrega al menos una cantidad para continuar.",
    summary: "Camisetas seleccionadas",
    areaTitle: "Áreas de impresión",
    areaText: {
      frontBack: "Frente izquierdo: 4 x 4 pulgadas · Espalda: 14 x 14 pulgadas",
      frontOnly: "Solo frente: 14 x 14 pulgadas",
    },
  },
};

const canvas = document.querySelector("#shirtCanvas");
const ctx = canvas.getContext("2d");
const shirtColorName = document.querySelector("#shirtColorName");
const shirtColors = document.querySelector("#shirtColors");
const shirtSizes = document.querySelector("#shirtSizes");
const shirtOrderSummary = document.querySelector("#shirtOrderSummary");
const sideOrderSummary = document.querySelector("#sideOrderSummary");
const form = document.querySelector("#shirtSelectionForm");
const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector("#menu");
const frontSideButton = document.querySelector("#frontSideButton");
const backSideButton = document.querySelector("#backSideButton");
const frontOnlyButton = document.querySelector("[data-print-option='frontOnly']");

renderLanguage(lang);
renderColors();
renderSizeRows();
loadMockup();
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
  continueOrder();
});

document.querySelector("#approveDesignOrder").addEventListener("click", continueOrder);

[frontSideButton, backSideButton].forEach((button) => {
  button.addEventListener("click", () => {
    state.printOption = "frontBack";
    state.activeSide = button.dataset.side;
    setPrintUi();
    loadSideControls();
    loadMockup();
  });
});

frontOnlyButton.addEventListener("click", () => {
  state.printOption = "frontOnly";
  state.activeSide = "front";
  setPrintUi();
  loadSideControls();
  loadMockup();
});

document.querySelector("#designFile").addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (file.size > 4 * 1024 * 1024) return setStatus("The image must be under 4 MB.", true);
  originalArtwork = { name: file.name, content: await fileToBase64(file) };
  const image = new Image();
  image.onload = () => {
    designs[state.activeSide].artwork = image;
    centerDesign();
    draw();
  };
  image.src = URL.createObjectURL(file);
});

["designText", "designTextColor", "designTextSize", "designTextShape", "designScale"].forEach((id) => {
  document.querySelector(`#${id}`).addEventListener("input", () => {
    const design = designs[state.activeSide];
    design.text = document.querySelector("#designText").value;
    design.color = document.querySelector("#designTextColor").value;
    design.size = Number(document.querySelector("#designTextSize").value);
    design.shape = document.querySelector("#designTextShape").value;
    design.scale = Number(document.querySelector("#designScale").value);
    draw();
  });
});

document.querySelector("#centerDesign").addEventListener("click", () => {
  centerDesign();
  draw();
});

document.querySelector("#clearDesign").addEventListener("click", () => {
  designs[state.activeSide] = { ...designs[state.activeSide], artwork: null, text: "", shape: "straight" };
  if (state.activeSide === "front") originalArtwork = null;
  loadSideControls();
  draw();
});

canvas.addEventListener("pointerdown", (event) => {
  dragging = true;
  moveDesign(event);
});

canvas.addEventListener("pointermove", (event) => {
  if (dragging) moveDesign(event);
});

window.addEventListener("pointerup", () => {
  dragging = false;
});

if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function renderColors() {
  shirtColors.innerHTML = colors
    .map(
      ([name, hex], index) =>
        `<button type="button" class="shirt-color-swatch${index === 0 ? " active" : ""}" data-color="${name}" data-hex="${hex}" data-slug="${colors[index][2]}" aria-label="${name}" title="${name}" style="--swatch:${hex}"><span></span></button>`
    )
    .join("");

  shirtColors.addEventListener("click", (event) => {
    const button = event.target.closest("[data-color]");
    if (!button) return;
    state.color = button.dataset.color;
    state.colorHex = button.dataset.hex;
    state.colorSlug = button.dataset.slug;
    shirtColors.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
    renderSizeRows();
    updateSelection();
    loadMockup();
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
  shirtColorName.textContent = `${state.color} ${state.activeSide === "back" ? "Back" : "Front"}`;
  const selection = buildSelection();
  const shirtTotalQty = document.querySelector("#shirtTotalQty");
  const shirtTotal = document.querySelector("#shirtTotal");
  if (shirtTotalQty) shirtTotalQty.textContent = String(selection.totalQuantity);
  if (shirtTotal) shirtTotal.textContent = money(selection.totalPrice);
  document.querySelector("#sideShirtTotal").textContent = money(selection.totalPrice);
  updatePrintAreaText();
  renderSummary(selection);
  setPrintUi();
}

function updatePrintAreaText() {
  const printAreaText = document.querySelector("#printAreaText");
  if (printAreaText) printAreaText.textContent = activeCopy().areaText[state.printOption] || activeCopy().areaText.frontBack;
}

function renderSummary(selection) {
  if (!selection.items.length) {
    const empty = `<strong>${activeCopy().summary}</strong><p>${activeCopy().empty}</p>`;
    if (shirtOrderSummary) shirtOrderSummary.innerHTML = empty;
    sideOrderSummary.innerHTML = `<p>${activeCopy().empty}</p>`;
    return;
  }

  const rows = selection.items
    .map((item) => `<span><b>${item.color}</b> ${item.size}: ${item.quantity} × ${money(item.unitPrice)} = ${money(item.lineTotal)}</span>`)
    .join("");
  if (shirtOrderSummary) shirtOrderSummary.innerHTML = `<strong>${activeCopy().summary}</strong><div>${rows}</div>`;
  sideOrderSummary.innerHTML = rows;
}

function buildSelection() {
  const items = [];
  colors.forEach(([color, hex, slug]) => {
    sizes.forEach((size) => {
      const quantity = state.quantities[color][size] || 0;
      if (!quantity) return;
      const unit = unitPrice(size);
      items.push({ color, hex, slug, size, quantity, unitPrice: unit, lineTotal: unit * quantity });
    });
  });

  return {
    product: "Gildan G500 T-Shirt Mix",
    brand: "Gildan G500 Unisex Heavy Cotton",
    printOption: state.printOption,
    printOptionLabel: state.printOption === "frontOnly" ? "Front only 14 x 14 in" : "Front left chest 4 x 4 + Back 14 x 14 in",
    items,
    totalQuantity: items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: items.reduce((total, item) => total + item.lineTotal, 0),
  };
}

function loadMockup() {
  mockupImage = new Image();
  mockupImage.onload = draw;
  mockupImage.onerror = draw;
  mockupImage.src = `assets/tshirts/${state.colorSlug}-${state.activeSide === "back" ? "back" : "front"}.png`;
}

function setPrintUi() {
  const isFrontOnly = state.printOption === "frontOnly";
  frontOnlyButton.classList.toggle("active", isFrontOnly);
  frontSideButton.classList.toggle("active", !isFrontOnly && state.activeSide === "front");
  backSideButton.classList.toggle("active", !isFrontOnly && state.activeSide === "back");
  frontSideButton.disabled = isFrontOnly;
  backSideButton.disabled = isFrontOnly;
  if (isFrontOnly) state.activeSide = "front";
  updatePrintAreaText();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#eef5fb";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawMockup();
  drawDesign(state.activeSide);
}

function drawMockup() {
  if (mockupImage.complete && mockupImage.naturalWidth) {
    const width = 530;
    const height = 600;
    ctx.drawImage(mockupImage, (canvas.width - width) / 2, 92, width, height);
    return;
  }
  ctx.fillStyle = state.colorHex;
  ctx.fillRect(230, 150, 260, 500);
}

function drawDesign(side) {
  const design = designs[side];
  const area = printAreaFor(side);
  if (design.artwork) {
    const scale = design.scale / 100;
    const max = Math.min(area.width, area.height) * scale;
    const ratio = Math.min(max / design.artwork.width, max / design.artwork.height);
    const width = design.artwork.width * ratio;
    const height = design.artwork.height * ratio;
    ctx.drawImage(design.artwork, design.position.x - width / 2, design.position.y - height / 2, width, height);
  }
  if (design.text.trim()) {
    ctx.save();
    ctx.fillStyle = design.color;
    ctx.font = `900 ${design.size}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    drawTextShape(design, area);
    ctx.restore();
  }
}

function drawTextShape(design, area) {
  const text = design.text.trim();
  if (design.shape === "straight") {
    ctx.fillText(text, design.position.x, design.position.y, area.width - 10);
    return;
  }

  if (design.shape === "circle") {
    drawCircularText(text, design.position.x, design.position.y, Math.min(area.width, area.height) * 0.34);
    return;
  }

  const bendUp = design.shape === "arcUp";
  const radius = Math.max(area.width * 0.58, 48);
  const measuredWidth = ctx.measureText(text).width;
  const maxAngle = Math.min(Math.PI * 1.55, Math.max(Math.PI * 0.5, measuredWidth / radius));
  const start = -maxAngle / 2;
  const step = text.length > 1 ? maxAngle / (text.length - 1) : 0;
  [...text].forEach((letter, index) => {
    const angle = start + step * index;
    const x = design.position.x + Math.sin(angle) * radius;
    const y = design.position.y + (bendUp ? 1 : -1) * (Math.cos(angle) * radius - radius);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((bendUp ? 1 : -1) * angle * 0.24);
    ctx.fillText(letter, 0, 0);
    ctx.restore();
  });
}

function drawCircularText(text, centerX, centerY, radius) {
  const letters = [...text];
  const step = (Math.PI * 2) / Math.max(letters.length, 1);
  const start = -Math.PI / 2 - (step * (letters.length - 1)) / 2;
  letters.forEach((letter, index) => {
    const angle = start + step * index;
    ctx.save();
    ctx.translate(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillText(letter, 0, 0);
    ctx.restore();
  });
}

function printAreaFor(side) {
  if (side === "front" && state.printOption === "frontOnly") return { x: 242, y: 300, width: 236, height: 236 };
  return side === "front" ? { x: 385, y: 245, width: 78, height: 78 } : { x: 242, y: 300, width: 236, height: 236 };
}

function moveDesign(event) {
  const rect = canvas.getBoundingClientRect();
  const x = (event.clientX - rect.left) * (canvas.width / rect.width);
  const y = (event.clientY - rect.top) * (canvas.height / rect.height);
  const area = printAreaFor(state.activeSide);
  designs[state.activeSide].position.x = Math.min(area.x + area.width, Math.max(area.x, x));
  designs[state.activeSide].position.y = Math.min(area.y + area.height, Math.max(area.y, y));
  draw();
}

function centerDesign() {
  const area = printAreaFor(state.activeSide);
  designs[state.activeSide].position = { x: area.x + area.width / 2, y: area.y + area.height / 2 };
}

async function continueOrder() {
  const selection = buildSelection();
  if (!selection.items.length) {
    if (shirtOrderSummary) shirtOrderSummary.innerHTML = `<p class="error">${activeCopy().empty}</p>`;
    setStatus(activeCopy().empty, true);
    return;
  }

  try {
    sessionStorage.setItem(selectionKey, JSON.stringify(selection));
    sessionStorage.setItem(detailsKey, buildOrderDetails(selection));
    sessionStorage.setItem(filesKey, JSON.stringify(await buildPreviewFiles()));
  } catch {}

  location.href = "shirt-checkout.html";
}

async function buildPreviewFiles() {
  const currentSide = state.activeSide;
  const files = [];
  state.activeSide = "front";
  setPrintUi();
  await loadMockupForCurrentSide();
  draw();
  files.push({ name: state.printOption === "frontOnly" ? "tshirt-front-14x14-preview.png" : "tshirt-front-left-chest-preview.png", content: canvas.toDataURL("image/png").split(",")[1] });
  if (state.printOption !== "frontOnly") {
    state.activeSide = "back";
    setPrintUi();
    await loadMockupForCurrentSide();
    draw();
    files.push({ name: "tshirt-back-preview.png", content: canvas.toDataURL("image/png").split(",")[1] });
  }
  if (originalArtwork) files.push(originalArtwork);
  state.activeSide = currentSide;
  setPrintUi();
  loadMockup();
  return files;
}

function loadMockupForCurrentSide() {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      mockupImage = image;
      resolve();
    };
    image.onerror = resolve;
    image.src = `assets/tshirts/${state.colorSlug}-${state.activeSide === "back" ? "back" : "front"}.png`;
  });
}

function buildOrderDetails(selection) {
  const lines = [
    "Product: Gildan G500 T-Shirt",
    "Brand: Gildan G500 Unisex Heavy Cotton",
    `Print option: ${selection.printOptionLabel}`,
    state.printOption === "frontOnly" ? "Front print area: 14 x 14 inches" : "Front print area: Left chest 4 x 4 inches",
  ];
  if (state.printOption !== "frontOnly") lines.push("Back print area: 14 x 14 inches");
  lines.push(
    "Selected shirts:",
    ...selection.items.map((item) => `- ${item.color} / ${item.size}: ${item.quantity} x ${money(item.unitPrice)} = ${money(item.lineTotal)}`),
    `Total quantity: ${selection.totalQuantity}`,
    `Suggested sale price: ${money(selection.totalPrice)}`,
    `Front text: ${designs.front.text.trim() || "None"}`,
    `Front text shape: ${shapeLabel(designs.front.shape)}`
  );
  if (state.printOption !== "frontOnly") {
    lines.push(`Back text: ${designs.back.text.trim() || "None"}`, `Back text shape: ${shapeLabel(designs.back.shape)}`);
  }
  return lines.join("\n");
}

function loadSideControls() {
  const design = designs[state.activeSide];
  document.querySelector("#designText").value = design.text;
  document.querySelector("#designTextColor").value = design.color;
  document.querySelector("#designTextSize").value = design.size;
  document.querySelector("#designTextShape").value = design.shape;
  document.querySelector("#designScale").value = design.scale;
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
  document.querySelectorAll("[data-shirt-lang]").forEach((button) => button.classList.toggle("active", button.dataset.shirtLang === language));
  [
    ["shirtKicker", "kicker"],
    ["shirtIntro", "intro"],
    ["colorTitle", "color"],
    ["sizeTitle", "size"],
    ["sizeNote", "note"],
    ["quantityLabel", "quantity"],
    ["totalLabel", "total"],
    ["deliveryNote", "delivery"],
    ["openDesigner", "next"],
    ["approveDesignOrder", "next"],
    ["printAreaTitle", "areaTitle"],
  ].forEach(([id, key]) => {
    const node = document.querySelector(`#${id}`);
    if (node) node.textContent = text[key];
  });
  const printAreaText = document.querySelector("#printAreaText");
  if (printAreaText) printAreaText.textContent = text.areaText[state.printOption] || text.areaText.frontBack;
  const titleNode = document.querySelector("#shirtTitle");
  if (titleNode) {
    const [lineOne, lineTwo] = text.title.split("|");
    titleNode.innerHTML = `<span>${lineOne || ""}</span><strong>${lineTwo || ""}</strong>`;
  }
}

function shapeLabel(shape) {
  return { straight: "Straight", arcUp: "Arc up", arcDown: "Arc down", circle: "Circle" }[shape] || "Straight";
}

function setStatus(text, error = false) {
  const node = document.querySelector("#designerStatus");
  node.textContent = text;
  node.classList.toggle("error", error);
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || "").split(",")[1] || "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
