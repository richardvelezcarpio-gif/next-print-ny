const printSelectionKey = "nextPrintProductSelection";
const printFilesKey = "nextPrintProductFiles";
const printDetailsKey = "nextPrintProductDetails";

const productCatalog = [
  {
    id: "business-cards",
    product: "Business Cards",
    label: "Business Cards",
    category: "cards",
    sizeLabel: '3.75" x 2.25" with bleed',
    trimLabel: 'Trim: 3.5" x 2"',
    width: 3.75,
    height: 2.25,
    prices: [[100, 35], [250, 55], [500, 65], [1000, 119], [2500, 180], [5000, 220], [10000, 370]],
    image: "assets/printing-business-cards-ai.webp",
  },
  {
    id: "flyers-4x6",
    product: "Flyers 4x6",
    label: "Flyers 4x6",
    category: "flyers",
    sizeLabel: '4" x 6"',
    trimLabel: "Standard postcard flyer",
    width: 4,
    height: 6,
    prices: [[100, 49], [250, 79], [500, 99], [1000, 150], [2500, 249], [5000, 349], [10000, 420]],
    image: "assets/printing-flyers-ai.webp",
  },
  {
    id: "flyers-5x7",
    product: "Flyers 5x7",
    label: "Flyers 5x7",
    category: "flyers",
    sizeLabel: '5" x 7"',
    trimLabel: "Premium handout flyer",
    width: 5,
    height: 7,
    prices: [[100, 95], [250, 140], [500, 180], [1000, 240], [2500, 390], [5000, 450], [10000, 650]],
    image: "assets/printing-flyers-ai.webp",
  },
  {
    id: "flyers-85x11",
    product: "Flyers 8.5x11",
    label: "Flyers 8.5x11",
    category: "flyers",
    sizeLabel: '8.5" x 11"',
    trimLabel: "Full page flyer",
    width: 8.5,
    height: 11,
    prices: [[100, 160], [250, 200], [500, 280], [1000, 370], [2500, 550], [5000, 596], [10000, 890]],
    image: "assets/printing-flyers-ai.webp",
  },
  {
    id: "stickers-round-2",
    product: 'Stickers round 2"',
    label: 'Round Stickers 2" x 2"',
    category: "stickers",
    sizeLabel: 'Round 2" x 2"',
    trimLabel: "Circle sticker",
    width: 2,
    height: 2,
    shape: "round",
    prices: [[100, 70], [250, 116], [500, 130], [1000, 190], [2500, 280], [5000, 380], [10000, 580]],
    image: "assets/printing-stickers-ai.webp",
  },
  {
    id: "stickers-round-25",
    product: 'Stickers round 2.5"',
    label: 'Round Stickers 2.5" x 2.5"',
    category: "stickers",
    sizeLabel: 'Round 2.5" x 2.5"',
    trimLabel: "Circle sticker",
    width: 2.5,
    height: 2.5,
    shape: "round",
    prices: [[100, 100], [250, 180], [500, 190], [1000, 220], [2500, 350], [5000, 450], [10000, 720]],
    image: "assets/printing-stickers-ai.webp",
  },
  {
    id: "stickers-2x35",
    product: "Stickers 2x3.5",
    label: 'Stickers 2" x 3.5"',
    category: "stickers",
    sizeLabel: '2" x 3.5"',
    trimLabel: "Rectangle sticker",
    width: 3.5,
    height: 2,
    prices: [[100, 75], [250, 110], [500, 140], [1000, 160], [2500, 190], [5000, 240], [10000, 420]],
    image: "assets/printing-stickers-ai.webp",
  },
  {
    id: "stickers-2x2",
    product: "Stickers 2x2",
    label: 'Stickers 2" x 2"',
    category: "stickers",
    sizeLabel: '2" x 2"',
    trimLabel: "Square sticker",
    width: 2,
    height: 2,
    prices: [[100, 65], [250, 95], [500, 135], [1000, 155], [2500, 185], [5000, 230], [10000, 330]],
    image: "assets/printing-stickers-ai.webp",
  },
  {
    id: "stickers-2x4",
    product: "Stickers 2x4",
    label: 'Stickers 2" x 4"',
    category: "stickers",
    sizeLabel: '2" x 4"',
    trimLabel: "Rectangle sticker",
    width: 4,
    height: 2,
    prices: [[100, 90], [250, 135], [500, 160], [1000, 185], [2500, 230], [5000, 295], [10000, 480]],
    image: "assets/printing-stickers-ai.webp",
  },
];

const params = new URLSearchParams(window.location.search);
const editorRedirectTarget = getEditorRedirectTarget();
if (editorRedirectTarget) {
  window.location.replace(editorRedirectTarget);
}

const productSelect = document.querySelector("#printProductSelect");
const sizeSelect = document.querySelector("#printSizeSelect");
const quantitySelect = document.querySelector("#printQuantitySelect");
const optionFields = document.querySelector("#printOptionFields");
const bgColor1 = document.querySelector("#printBgColor1");
const bgColor2 = document.querySelector("#printBgColor2");
const addTextButton = document.querySelector("#printAddText");
const uploadInput = document.querySelector("#printUploadImage");
const selectedText = document.querySelector("#printSelectedText");
const selectedFont = document.querySelector("#printSelectedFont");
const selectedSize = document.querySelector("#printSelectedSize");
const selectedColor = document.querySelector("#printSelectedColor");
const duplicateButton = document.querySelector("#printDuplicateObject");
const deleteButton = document.querySelector("#printDeleteObject");
const designSizeNode = document.querySelector("#printDesignSize");
const sideTabs = document.querySelector("#printSideTabs");
const designCanvas = document.querySelector("#printDesignCanvas");
const saveButton = document.querySelector("#printSaveDesign");
const summaryProduct = document.querySelector("#printSummaryProduct");
const summarySize = document.querySelector("#printSummarySize");
const summaryQuantity = document.querySelector("#printSummaryQuantity");
const summarySides = document.querySelector("#printSummarySides");
const summaryTotal = document.querySelector("#printSummaryTotal");
const continueButton = document.querySelector("#printContinueCheckout");
const statusNode = document.querySelector("#printEditorStatus");

let currentProduct = editorRedirectTarget ? productCatalog[0] : findInitialProduct();
let currentQuantity = String(params.get("quantity") || currentProduct.prices[0][0]);
let currentSide = "front";
let selectedItemId = null;
let designState = {
  front: [defaultTextItem()],
  back: [defaultTextItem("Back Side")],
};

if (!editorRedirectTarget) {
  renderProductSelect();
  renderProduct();
  bindEvents();
}

function bindEvents() {
  productSelect?.addEventListener("change", () => {
    currentProduct = productCatalog.find((item) => item.id === productSelect.value) || productCatalog[0];
    currentQuantity = String(currentProduct.prices[0][0]);
    currentSide = "front";
    selectedItemId = null;
    designState = { front: [defaultTextItem()], back: [defaultTextItem("Back Side")] };
    renderProduct();
  });

  sizeSelect?.addEventListener("change", () => {
    currentProduct = productCatalog.find((item) => item.id === sizeSelect.value) || currentProduct;
    currentQuantity = String(currentProduct.prices[0][0]);
    selectedItemId = null;
    renderProduct();
  });

  quantitySelect?.addEventListener("change", () => {
    currentQuantity = quantitySelect.value;
    updateSummary();
  });

  optionFields?.addEventListener("change", () => {
    if (!availableSides().includes(currentSide)) currentSide = "front";
    renderSideTabs();
    renderCanvas();
    updateSummary();
  });

  [bgColor1, bgColor2].forEach((input) => {
    input?.addEventListener("input", renderCanvas);
  });

  addTextButton?.addEventListener("click", () => {
    const item = defaultTextItem("Your Text Here");
    designState[currentSide].push(item);
    selectedItemId = item.id;
    renderCanvas();
  });

  uploadInput?.addEventListener("change", handleUpload);
  selectedText?.addEventListener("input", updateSelectedText);
  selectedFont?.addEventListener("change", updateSelectedText);
  selectedSize?.addEventListener("input", updateSelectedText);
  selectedColor?.addEventListener("input", updateSelectedText);
  duplicateButton?.addEventListener("click", duplicateSelected);
  deleteButton?.addEventListener("click", deleteSelected);
  saveButton?.addEventListener("click", saveCurrentSidePng);
  continueButton?.addEventListener("click", continueToCheckout);
}

function getEditorRedirectTarget() {
  const requestedProduct = `${params.get("product") || ""} ${params.get("item") || ""}`.toLowerCase();
  if (!requestedProduct.trim()) return "";

  if (/menus?/.test(requestedProduct) || /door\s*hangers?/.test(requestedProduct)) {
    return `print-products-upload.html?${params.toString()}`;
  }

  if (/retractable/.test(requestedProduct) || /yard\s*signs?/.test(requestedProduct) || /\bbanners?\b/.test(requestedProduct)) {
    return "banner-designer/designer";
  }

  if (/t-?\s*shirts?/.test(requestedProduct) || /gildan/.test(requestedProduct)) {
    return "tshirt.html";
  }

  return "";
}

function findInitialProduct() {
  const rawProduct = params.get("product") || params.get("item") || "";
  const normalized = rawProduct.toLowerCase();
  return productCatalog.find((item) => item.product.toLowerCase() === normalized || item.label.toLowerCase() === normalized) || productCatalog[0];
}

function renderProductSelect() {
  if (!productSelect) return;
  productSelect.innerHTML = productCatalog
    .map((item) => `<option value="${escapeAttribute(item.id)}">${escapeHtml(item.label)}</option>`)
    .join("");
}

function renderProduct() {
  if (productSelect) productSelect.value = currentProduct.id;
  renderSizeSelect();
  renderQuantitySelect();
  renderOptionFields();
  renderSideTabs();
  renderCanvas();
  updateSummary();
}

function renderSizeSelect() {
  if (!sizeSelect) return;
  const siblings = productCatalog.filter((item) => item.category === currentProduct.category || item.product === currentProduct.product);
  sizeSelect.innerHTML = siblings
    .map((item) => `<option value="${escapeAttribute(item.id)}">${escapeHtml(item.sizeLabel)}</option>`)
    .join("");
  sizeSelect.value = currentProduct.id;
}

function renderQuantitySelect() {
  if (!quantitySelect) return;
  quantitySelect.innerHTML = currentProduct.prices
    .map(([quantity]) => `<option value="${quantity}">${quantity}</option>`)
    .join("");
  if (!currentProduct.prices.some(([quantity]) => String(quantity) === String(currentQuantity))) {
    currentQuantity = String(currentProduct.prices[0][0]);
  }
  quantitySelect.value = currentQuantity;
}

function renderOptionFields() {
  if (!optionFields) return;
  const isCard = currentProduct.category === "cards";
  const isSticker = currentProduct.category === "stickers";
  optionFields.innerHTML = `
    ${isCard ? selectField("roundedCorners", "Rounded Corners", ["No", "Yes"], "No") : ""}
    ${selectField("printedSide", "Printed Side", ["Front and Back", "Front Only"], isSticker ? "Front Only" : "Front and Back")}
    ${selectField("paperType", isSticker ? "Material" : "Paper Type", isSticker ? ["High Gloss White Outdoor Vinyl"] : ["14 pt. Cardstock", "100 lb. Gloss Text"], isSticker ? "High Gloss White Outdoor Vinyl" : "14 pt. Cardstock")}
    ${selectField("coating", "Coating", isSticker ? ["High Gloss"] : ["High Gloss", "Matte"], "High Gloss")}
  `;
}

function selectField(id, label, options, selected) {
  return `
    <label>
      ${escapeHtml(label)}
      <select id="${escapeAttribute(id)}">
        ${options.map((option) => `<option value="${escapeAttribute(option)}"${option === selected ? " selected" : ""}>${escapeHtml(option)}</option>`).join("")}
      </select>
    </label>
  `;
}

function renderSideTabs() {
  if (!sideTabs) return;
  const sides = availableSides();
  sideTabs.innerHTML = sides
    .map((side) => `<button class="${side === currentSide ? "active" : ""}" type="button" data-side="${side}">${side === "front" ? "Front" : "Back"}</button>`)
    .join("");
  sideTabs.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      currentSide = button.dataset.side;
      selectedItemId = null;
      renderSideTabs();
      renderCanvas();
    });
  });
}

function availableSides() {
  const printedSide = document.querySelector("#printedSide")?.value || "Front and Back";
  return printedSide === "Front Only" ? ["front"] : ["front", "back"];
}

function renderCanvas() {
  if (!designCanvas) return;
  const aspect = currentProduct.width / currentProduct.height;
  designCanvas.style.aspectRatio = `${currentProduct.width} / ${currentProduct.height}`;
  designCanvas.style.background = `linear-gradient(135deg, ${bgColor1?.value || "#dff8ff"}, ${bgColor2?.value || "#ffffff"})`;
  designCanvas.classList.toggle("round-product", currentProduct.shape === "round");
  if (designSizeNode) designSizeNode.textContent = `${currentProduct.sizeLabel} - ${currentSide === "front" ? "Front" : "Back"}`;

  const width = Math.min(620, Math.max(280, aspect >= 1 ? 620 : 440));
  designCanvas.style.maxWidth = `${width}px`;

  designCanvas.querySelectorAll(".print-canvas-item").forEach((node) => node.remove());
  currentItems().forEach((item) => designCanvas.appendChild(renderCanvasItem(item)));
  syncSelectedControls();
}

function renderCanvasItem(item) {
  const node = document.createElement("div");
  node.className = `print-canvas-item ${item.id === selectedItemId ? "selected" : ""}`;
  node.dataset.id = item.id;
  node.style.left = `${item.x}%`;
  node.style.top = `${item.y}%`;
  node.style.width = `${item.w}%`;
  node.style.height = `${item.h}%`;

  if (item.type === "image") {
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.name || "Uploaded artwork";
    node.appendChild(img);
  } else {
    node.textContent = item.text;
    node.style.color = item.color;
    node.style.fontFamily = item.font;
    node.style.fontSize = `${item.size}px`;
  }

  node.addEventListener("pointerdown", (event) => startDrag(event, item.id));
  node.addEventListener("click", (event) => {
    event.stopPropagation();
    selectedItemId = item.id;
    renderCanvas();
  });

  if (item.id === selectedItemId) {
    ["nw", "n", "ne", "e", "se", "s", "sw", "w"].forEach((handle) => {
      const grip = document.createElement("button");
      grip.type = "button";
      grip.className = `print-resize-handle ${handle}`;
      grip.dataset.resizeHandle = handle;
      grip.setAttribute("aria-label", `Resize ${handle}`);
      grip.addEventListener("pointerdown", (event) => startResize(event, item.id, handle));
      node.appendChild(grip);
    });
  }
  return node;
}

function startDrag(event, id) {
  event.preventDefault();
  selectedItemId = id;
  const item = findSelectedItem();
  const rect = designCanvas.getBoundingClientRect();
  const startX = event.clientX;
  const startY = event.clientY;
  const originalX = item.x;
  const originalY = item.y;

  const move = (moveEvent) => {
    const dx = ((moveEvent.clientX - startX) / rect.width) * 100;
    const dy = ((moveEvent.clientY - startY) / rect.height) * 100;
    item.x = clamp(originalX + dx, 0, 100 - item.w);
    item.y = clamp(originalY + dy, 0, 100 - item.h);
    renderCanvas();
  };

  const stop = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", stop);
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", stop);
}

function startResize(event, id, direction) {
  event.preventDefault();
  event.stopPropagation();
  selectedItemId = id;
  const item = findSelectedItem();
  if (!item) return;
  const rect = designCanvas.getBoundingClientRect();
  const startX = event.clientX;
  const startY = event.clientY;
  const original = {
    x: item.x,
    y: item.y,
    w: item.w,
    h: item.h,
  };
  const minW = item.type === "image" ? 8 : 12;
  const minH = item.type === "image" ? 8 : 8;

  const move = (moveEvent) => {
    const dx = ((moveEvent.clientX - startX) / rect.width) * 100;
    const dy = ((moveEvent.clientY - startY) / rect.height) * 100;
    const right = original.x + original.w;
    const bottom = original.y + original.h;
    let nextX = original.x;
    let nextY = original.y;
    let nextW = original.w;
    let nextH = original.h;

    if (direction.includes("e")) {
      nextW = clamp(original.w + dx, minW, 100 - original.x);
    }
    if (direction.includes("s")) {
      nextH = clamp(original.h + dy, minH, 100 - original.y);
    }
    if (direction.includes("w")) {
      nextX = clamp(original.x + dx, 0, right - minW);
      nextW = right - nextX;
    }
    if (direction.includes("n")) {
      nextY = clamp(original.y + dy, 0, bottom - minH);
      nextH = bottom - nextY;
    }

    item.x = nextX;
    item.y = nextY;
    item.w = nextW;
    item.h = nextH;
    renderCanvas();
  };

  const stop = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", stop);
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", stop);
}

function currentItems() {
  if (!designState[currentSide]) designState[currentSide] = [];
  return designState[currentSide];
}

function defaultTextItem(text = "Your Text Here") {
  return {
    id: `item-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type: "text",
    text,
    x: 25,
    y: 40,
    w: 50,
    h: 18,
    font: "Arial",
    size: 32,
    color: "#061a35",
  };
}

function handleUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (file.size > 4 * 1024 * 1024) {
    setStatus("Please upload an image smaller than 4 MB.", true);
    event.target.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const src = String(reader.result || "");
    const item = {
      id: `image-${Date.now()}`,
      type: "image",
      name: file.name,
      src,
      x: 20,
      y: 20,
      w: 60,
      h: 48,
    };
    currentItems().push(item);
    selectedItemId = item.id;
    renderCanvas();
    setStatus("Image added to the design.");
  };
  reader.readAsDataURL(file);
  event.target.value = "";
}

function syncSelectedControls() {
  const item = findSelectedItem();
  const isText = item?.type === "text";
  if (selectedText) {
    selectedText.value = isText ? item.text : "";
    selectedText.disabled = !isText;
  }
  if (selectedFont) {
    selectedFont.value = isText ? item.font : "Arial";
    selectedFont.disabled = !isText;
  }
  if (selectedSize) {
    selectedSize.value = isText ? item.size : 32;
    selectedSize.disabled = !isText;
  }
  if (selectedColor) {
    selectedColor.value = isText ? item.color : "#061a35";
    selectedColor.disabled = !isText;
  }
}

function updateSelectedText() {
  const item = findSelectedItem();
  if (!item || item.type !== "text") return;
  item.text = selectedText?.value || "";
  item.font = selectedFont?.value || "Arial";
  item.size = Number(selectedSize?.value || 32);
  item.color = selectedColor?.value || "#061a35";
  renderCanvas();
}

function duplicateSelected() {
  const item = findSelectedItem();
  if (!item) return;
  const clone = { ...item, id: `item-${Date.now()}`, x: clamp(item.x + 5, 0, 100 - item.w), y: clamp(item.y + 5, 0, 100 - item.h) };
  currentItems().push(clone);
  selectedItemId = clone.id;
  renderCanvas();
}

function deleteSelected() {
  if (!selectedItemId) return;
  designState[currentSide] = currentItems().filter((item) => item.id !== selectedItemId);
  selectedItemId = null;
  renderCanvas();
}

function findSelectedItem() {
  return currentItems().find((item) => item.id === selectedItemId) || null;
}

function updateSummary() {
  const price = selectedPrice();
  if (summaryProduct) summaryProduct.textContent = currentProduct.label;
  if (summarySize) summarySize.textContent = currentProduct.sizeLabel;
  if (summaryQuantity) summaryQuantity.textContent = currentQuantity;
  if (summarySides) summarySides.textContent = document.querySelector("#printedSide")?.value || "Front and Back";
  if (summaryTotal) summaryTotal.textContent = money(price);
}

function selectedPrice() {
  return Number(currentProduct.prices.find(([quantity]) => String(quantity) === String(currentQuantity))?.[1] || currentProduct.prices[0][1]);
}

async function saveCurrentSidePng() {
  const dataUrl = await createPreview(currentSide);
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `${currentProduct.id}-${currentSide}.png`;
  link.click();
  setStatus("Design PNG saved.");
}

async function continueToCheckout() {
  continueButton.disabled = true;
  setStatus("Preparing checkout...");
  try {
    const sides = availableSides();
    const files = [];
    for (const side of sides) {
      const dataUrl = await createPreview(side, { format: "image/jpeg", maxSize: 900, quality: 0.86 });
      files.push({
        name: `${currentProduct.id}-${side}.jpg`,
        content: dataUrl.split(",")[1] || "",
        mimeType: "image/jpeg",
      });
    }

    const options = collectOptions();
    const details = buildDetails(options);
    const selection = {
      source: "print-products-editor",
      product: currentProduct.product,
      label: currentProduct.label,
      category: currentProduct.category,
      sizeLabel: currentProduct.sizeLabel,
      trimLabel: currentProduct.trimLabel,
      quantity: String(currentQuantity),
      totalPrice: selectedPrice(),
      sides: options.printedSide,
      options,
      background: {
        color1: bgColor1?.value || "#dff8ff",
        color2: bgColor2?.value || "#ffffff",
      },
    };

    sessionStorage.setItem(printSelectionKey, JSON.stringify(selection));
    sessionStorage.setItem(printFilesKey, JSON.stringify(files));
    sessionStorage.setItem(printDetailsKey, details);
    window.location.href = "print-products-checkout.html";
  } catch (error) {
    const isQuotaError = error?.name === "QuotaExceededError" || /quota/i.test(error?.message || "");
    setStatus(isQuotaError ? "The design was too large to prepare. Please use a smaller image and try again." : error.message || "Could not prepare checkout.", true);
    continueButton.disabled = false;
  }
}

function collectOptions() {
  return {
    roundedCorners: document.querySelector("#roundedCorners")?.value || "",
    printedSide: document.querySelector("#printedSide")?.value || "Front and Back",
    paperType: document.querySelector("#paperType")?.value || "",
    coating: document.querySelector("#coating")?.value || "",
  };
}

function buildDetails(options) {
  return [
    `Product: ${currentProduct.product}`,
    `Display name: ${currentProduct.label}`,
    `Size: ${currentProduct.sizeLabel}`,
    currentProduct.trimLabel ? `Trim / notes: ${currentProduct.trimLabel}` : "",
    `Quantity: ${currentQuantity}`,
    `Printed Side: ${options.printedSide}`,
    options.roundedCorners ? `Rounded Corners: ${options.roundedCorners}` : "",
    options.paperType ? `Paper / Material: ${options.paperType}` : "",
    options.coating ? `Coating: ${options.coating}` : "",
    `Design sides submitted: ${availableSides().join(", ")}`,
    `Checkout amount: ${money(selectedPrice())}`,
  ]
    .filter(Boolean)
    .join("\n");
}

async function createPreview(side, options = {}) {
  const canvas = document.createElement("canvas");
  const aspect = currentProduct.width / currentProduct.height;
  const maxSize = Number(options.maxSize || 1200);
  if (aspect >= 1) {
    canvas.width = maxSize;
    canvas.height = Math.round(maxSize / aspect);
  } else {
    canvas.height = maxSize;
    canvas.width = Math.round(maxSize * aspect);
  }
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, bgColor1?.value || "#dff8ff");
  gradient.addColorStop(1, bgColor2?.value || "#ffffff");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(5, 39, 92, 0.25)";
  ctx.lineWidth = Math.max(4, canvas.width * 0.006);
  ctx.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);
  ctx.setLineDash([18, 14]);
  ctx.strokeStyle = "rgba(5, 39, 92, 0.4)";
  ctx.strokeRect(canvas.width * 0.08, canvas.height * 0.08, canvas.width * 0.84, canvas.height * 0.84);
  ctx.setLineDash([]);

  const sideItems = designState[side] || [];
  for (const item of sideItems) {
    const x = (item.x / 100) * canvas.width;
    const y = (item.y / 100) * canvas.height;
    const w = (item.w / 100) * canvas.width;
    const h = (item.h / 100) * canvas.height;
    if (item.type === "image") {
      const image = await loadImage(item.src);
      ctx.drawImage(image, x, y, w, h);
    } else {
      ctx.fillStyle = item.color || "#061a35";
      ctx.font = `900 ${Math.max(18, item.size * 2)}px ${item.font || "Arial"}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      wrapCanvasText(ctx, item.text || "", x + w / 2, y + h / 2, w * 0.92, Math.max(24, item.size * 2.2));
    }
  }
  return canvas.toDataURL(options.format || "image/png", options.quality || 0.92);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  });
  if (line) lines.push(line);
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((row, index) => ctx.fillText(row, x, startY + index * lineHeight));
}

function setStatus(message, isError = false) {
  if (!statusNode) return;
  statusNode.textContent = message;
  statusNode.classList.toggle("error", isError);
}

function money(value) {
  return `$${Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}
