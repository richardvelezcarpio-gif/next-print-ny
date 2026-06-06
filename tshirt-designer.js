const params = new URLSearchParams(location.search);
const selectionKey = "nextPrintTshirtSelection";
const filesKey = "nextPrintTshirtFiles";
const detailsKey = "nextPrintTshirtDetails";
const language = localStorage.getItem("preferredLanguage") || "en";
const canvas = document.querySelector("#shirtCanvas");
const ctx = canvas.getContext("2d");
const sideButtons = document.querySelectorAll("[data-side]");
let activeSide = "front";
let originalArtwork = null;
let dragging = false;

const fallbackSelection = {
  product: "Gildan G500 T-Shirt Mix",
  brand: "Gildan G500 Unisex Heavy Cotton",
  items: [{
    color: params.get("color") || "White",
    hex: /^#[0-9a-f]{6}$/i.test(params.get("hex") || "") ? params.get("hex") : "#f7f7f4",
    size: params.get("size") || "M",
    quantity: Math.max(1, Number(params.get("quantity")) || 1),
    unitPrice: unitPrice(params.get("size") || "M"),
    lineTotal: unitPrice(params.get("size") || "M") * Math.max(1, Number(params.get("quantity")) || 1),
  }],
};
fallbackSelection.totalQuantity = fallbackSelection.items[0].quantity;
fallbackSelection.totalPrice = fallbackSelection.items[0].lineTotal;

const selection = loadSelection() || fallbackSelection;
const previewItem = selection.items[0] || fallbackSelection.items[0];
const designs = {
  front: { artwork: null, text: "", color: "#05275c", size: 34, shape: "straight", scale: 62, position: { x: 413, y: 310 } },
  back: { artwork: null, text: "", color: "#05275c", size: 52, shape: "straight", scale: 70, position: { x: 360, y: 392 } },
};

const translations = {
  en: {
    kicker: "Online T-shirt designer",
    title: "Create your shirt design",
    intro: "Upload artwork or add text. Use the left chest 4 x 4 area and the back 14 x 14 area.",
    hint: "Choose a side, then drag the image or text inside the print area.",
    side: "Design side",
    front: "Front left chest 4 x 4",
    back: "Back 14 x 14",
    artwork: "Add artwork",
    choose: "Choose image",
    text: "Add text",
    placeholder: "Your text",
    color: "Color",
    size: "Size",
    shape: "Text shape",
    straight: "Straight",
    arcUp: "Arc up",
    arcDown: "Arc down",
    circle: "Circle",
    scale: "Artwork size",
    center: "Center design",
    clear: "Clear side",
    approve: "Approve design and order",
  },
  es: {
    kicker: "Diseñador de camisetas en línea",
    title: "Crea el diseño de tu camiseta",
    intro: "Sube una imagen o agrega texto. Usa el área izquierda del pecho 4 x 4 y la espalda 14 x 14.",
    hint: "Escoge un lado y mueve la imagen o el texto dentro del área de impresión.",
    side: "Lado del diseño",
    front: "Frente izquierdo 4 x 4",
    back: "Espalda 14 x 14",
    artwork: "Agregar imagen",
    choose: "Escoger imagen",
    text: "Agregar texto",
    placeholder: "Tu texto",
    color: "Color",
    size: "Tamaño",
    shape: "Forma del texto",
    straight: "Recto",
    arcUp: "Arco arriba",
    arcDown: "Arco abajo",
    circle: "Círculo",
    scale: "Tamaño de imagen",
    center: "Centrar diseño",
    clear: "Borrar lado",
    approve: "Aprobar diseño y ordenar",
  },
};

renderLanguage(language);
renderSummary();
loadSideControls();
draw();

document.querySelector("#designFile").addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (file.size > 4 * 1024 * 1024) return setStatus("The image must be under 4 MB.", true);
  originalArtwork = { name: file.name, content: await fileToBase64(file) };
  const image = new Image();
  image.onload = () => {
    designs[activeSide].artwork = image;
    centerDesign();
    draw();
  };
  image.src = URL.createObjectURL(file);
});

["designText", "designTextColor", "designTextSize", "designTextShape", "designScale"].forEach((id) => {
  document.querySelector(`#${id}`).addEventListener("input", () => {
    const design = designs[activeSide];
    design.text = document.querySelector("#designText").value;
    design.color = document.querySelector("#designTextColor").value;
    design.size = Number(document.querySelector("#designTextSize").value);
    design.shape = document.querySelector("#designTextShape").value;
    design.scale = Number(document.querySelector("#designScale").value);
    draw();
  });
});

sideButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeSide = button.dataset.side;
    sideButtons.forEach((item) => item.classList.toggle("active", item === button));
    loadSideControls();
    draw();
  });
});

document.querySelector("#centerDesign").addEventListener("click", () => {
  centerDesign();
  draw();
});
document.querySelector("#clearDesign").addEventListener("click", () => {
  designs[activeSide] = { ...designs[activeSide], artwork: null, text: "", shape: "straight" };
  if (activeSide === "front") originalArtwork = null;
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
document.querySelector("#continueOrder").addEventListener("click", continueOrder);
document.querySelectorAll("[data-designer-lang]").forEach((button) =>
  button.addEventListener("click", () => {
    localStorage.setItem("preferredLanguage", button.dataset.designerLang);
    renderLanguage(button.dataset.designerLang);
    renderSummary();
  })
);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#eef5fb";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawShirt();
  const area = printAreaFor(activeSide);
  ctx.save();
  ctx.setLineDash([8, 7]);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#15bde5";
  ctx.strokeRect(area.x, area.y, area.width, area.height);
  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.fillRect(area.x, area.y - 32, area.width, 26);
  ctx.fillStyle = "#05275c";
  ctx.font = "900 16px Arial";
  ctx.textAlign = "center";
  ctx.fillText(activeSide === "front" ? "4 x 4 LEFT CHEST" : "14 x 14 BACK", area.x + area.width / 2, area.y - 13);
  ctx.restore();
  drawDesign(activeSide);
}

function drawShirt() {
  const hex = previewItem.hex || "#f7f7f4";
  const gradient = ctx.createLinearGradient(120, 100, 600, 760);
  gradient.addColorStop(0, lighten(hex, 20));
  gradient.addColorStop(0.46, hex);
  gradient.addColorStop(1, darken(hex, 14));
  ctx.save();
  ctx.fillStyle = gradient;
  ctx.strokeStyle = "#c7d4e2";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(235, 130);
  ctx.lineTo(300, 100);
  ctx.quadraticCurveTo(360, 145, 420, 100);
  ctx.lineTo(485, 130);
  ctx.lineTo(625, 235);
  ctx.lineTo(555, 345);
  ctx.lineTo(495, 300);
  ctx.lineTo(520, 730);
  ctx.lineTo(200, 730);
  ctx.lineTo(225, 300);
  ctx.lineTo(165, 345);
  ctx.lineTo(95, 235);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.globalAlpha = 0.18;
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.moveTo(248, 154);
  ctx.quadraticCurveTo(360, 220, 472, 154);
  ctx.lineTo(492, 725);
  ctx.lineTo(228, 725);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = "#07142f";
  ctx.fillRect(224, 300, 16, 425);
  ctx.fillRect(480, 300, 16, 425);
  ctx.globalAlpha = 1;
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.beginPath();
  ctx.ellipse(360, 115, 61, 34, 0, 0, Math.PI);
  ctx.fill();
  ctx.restore();
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

function moveDesign(event) {
  const rect = canvas.getBoundingClientRect();
  const x = (event.clientX - rect.left) * (canvas.width / rect.width);
  const y = (event.clientY - rect.top) * (canvas.height / rect.height);
  const area = printAreaFor(activeSide);
  designs[activeSide].position.x = Math.min(area.x + area.width, Math.max(area.x, x));
  designs[activeSide].position.y = Math.min(area.y + area.height, Math.max(area.y, y));
  draw();
}

function printAreaFor(side) {
  return side === "front"
    ? { x: 374, y: 230, width: 78, height: 78 }
    : { x: 242, y: 245, width: 236, height: 236 };
}

function centerDesign() {
  const area = printAreaFor(activeSide);
  designs[activeSide].position = { x: area.x + area.width / 2, y: area.y + area.height / 2 };
}

async function continueOrder() {
  activeSide = "back";
  sideButtons.forEach((item) => item.classList.toggle("active", item.dataset.side === "back"));
  draw();
  const backPreview = canvas.toDataURL("image/png").split(",")[1];
  activeSide = "front";
  sideButtons.forEach((item) => item.classList.toggle("active", item.dataset.side === "front"));
  draw();
  const frontPreview = canvas.toDataURL("image/png").split(",")[1];

  try {
    sessionStorage.setItem(
      filesKey,
      JSON.stringify([
        { name: "tshirt-front-left-chest-preview.png", content: frontPreview },
        { name: "tshirt-back-preview.png", content: backPreview },
        ...(originalArtwork ? [originalArtwork] : []),
      ])
    );
  } catch {}

  const details = buildOrderDetails();
  try {
    sessionStorage.setItem(detailsKey, details);
  } catch {}

  const orderParams = new URLSearchParams({
    service: "Printing",
    product: "Gildan G500 T-Shirt Mix",
    quantity: String(selection.totalQuantity),
    price: money(selection.totalPrice),
    details,
  });
  location.href = `order.html?${orderParams.toString()}`;
}

function buildOrderDetails() {
  return [
    "Product: Gildan G500 T-Shirt",
    "Brand: Gildan G500 Unisex Heavy Cotton",
    "Front print area: Left chest 4 x 4 inches",
    "Back print area: 14 x 14 inches",
    "Selected shirts:",
    ...selection.items.map(
      (item) => `- ${item.color} / ${item.size}: ${item.quantity} x ${money(item.unitPrice)} = ${money(item.lineTotal)}`
    ),
    `Total quantity: ${selection.totalQuantity}`,
    `Suggested sale price: ${money(selection.totalPrice)}`,
    `Front text: ${designs.front.text.trim() || "None"}`,
    `Front text shape: ${shapeLabel(designs.front.shape)}`,
    `Back text: ${designs.back.text.trim() || "None"}`,
    `Back text shape: ${shapeLabel(designs.back.shape)}`,
  ].join("\n");
}

function renderSummary() {
  const isSpanish = (localStorage.getItem("preferredLanguage") || "en") === "es";
  document.querySelector("#shirtSummary").innerHTML = `
    <strong>Gildan G500</strong>
    <span>${selection.totalQuantity} ${isSpanish ? "camisetas" : "shirts"} / ${selection.items.length} ${isSpanish ? "combinaciones" : "combinations"}</span>
    <div>${selection.items.map((item) => `<span>${item.color} ${item.size}: ${item.quantity}</span>`).join("")}</div>
    <b>${money(selection.totalPrice)}</b>`;
}

function loadSideControls() {
  const design = designs[activeSide];
  document.querySelector("#designText").value = design.text;
  document.querySelector("#designTextColor").value = design.color;
  document.querySelector("#designTextSize").value = design.size;
  document.querySelector("#designTextShape").value = design.shape;
  document.querySelector("#designScale").value = design.scale;
}

function shapeLabel(shape) {
  return {
    straight: "Straight",
    arcUp: "Arc up",
    arcDown: "Arc down",
    circle: "Circle",
  }[shape] || "Straight";
}

function loadSelection() {
  try {
    const data = JSON.parse(sessionStorage.getItem(selectionKey) || "");
    if (!Array.isArray(data.items) || !data.items.length) return null;
    return data;
  } catch {
    return null;
  }
}

function unitPrice(size) {
  return ["2XL", "3XL", "4XL", "5XL"].includes(size) ? 18 : 14;
}

function money(value) {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function lighten(hex, amount) {
  return adjustColor(hex, amount);
}

function darken(hex, amount) {
  return adjustColor(hex, -amount);
}

function adjustColor(hex, amount) {
  const clean = String(hex || "#ffffff").replace("#", "");
  const value = clean.length === 6 ? clean : "ffffff";
  const channels = [0, 2, 4].map((index) => Math.max(0, Math.min(255, Number.parseInt(value.slice(index, index + 2), 16) + amount)));
  return `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
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

function renderLanguage(lang) {
  const text = translations[lang] || translations.en;
  [
    ["designerKicker", "kicker"],
    ["designerTitle", "title"],
    ["designerIntro", "intro"],
    ["canvasHint", "hint"],
    ["sideTitle", "side"],
    ["frontSideButton", "front"],
    ["backSideButton", "back"],
    ["artworkTitle", "artwork"],
    ["designFileLabel", "choose"],
    ["textTitle", "text"],
    ["textColorLabel", "color"],
    ["textSizeLabel", "size"],
    ["textShapeLabel", "shape"],
    ["shapeStraight", "straight"],
    ["shapeArcUp", "arcUp"],
    ["shapeArcDown", "arcDown"],
    ["shapeCircle", "circle"],
    ["scaleTitle", "scale"],
    ["centerDesign", "center"],
    ["clearDesign", "clear"],
    ["continueOrder", "approve"],
  ].forEach(([id, key]) => {
    const node = document.querySelector(`#${id}`);
    if (node) node.textContent = text[key];
  });
  document.querySelector("#designText").placeholder = text.placeholder;
}
