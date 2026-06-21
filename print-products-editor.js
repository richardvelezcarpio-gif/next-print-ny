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
const editorToolrail = document.querySelector(".print-editor-toolrail");
const editorDrawer = document.querySelector("#printEditorDrawer");
const desktopToolbar = document.querySelector(".print-desktop-toolbar");
const editorHeroTitle = document.querySelector("#printEditorHeroTitle");
const editorHeroKicker = document.querySelector("#printEditorHeroKicker");
const editorHeroCopy = document.querySelector("#printEditorHeroCopy");
const editorHeroImage = document.querySelector("#printEditorHeroImage");
const editorStartButton = document.querySelector("#printEditorStart");

const backgroundTemplates = [
  ["Ocean", "#e8fbff", "#1ab9e8"],
  ["Navy", "#061a35", "#1667a8"],
  ["Sky", "#f6fdff", "#7bdcf2"],
  ["Mint", "#f2fff9", "#4ed5b2"],
  ["Sunset", "#fff1ed", "#ff9b78"],
  ["Rose", "#fff4fa", "#ef84bd"],
  ["Lavender", "#f6f1ff", "#9277e8"],
  ["Lemon", "#fffde9", "#f5c84b"],
  ["Coral", "#fff0ed", "#ff6b5f"],
  ["Forest", "#effcf6", "#16966b"],
  ["Midnight", "#111a38", "#384f9b"],
  ["Cobalt", "#edf4ff", "#2f6cea"],
  ["Sand", "#fff9ef", "#dca15f"],
  ["Plum", "#fbf1ff", "#8d4cb7"],
  ["Ice", "#ffffff", "#c8eff8"],
  ["Slate", "#f3f6fa", "#71849a"],
  ["Berry", "#fff2f6", "#bd3f6b"],
  ["Teal", "#effefd", "#24bfb8"],
  ["Peach", "#fff6ed", "#f4ae66"],
  ["Charcoal", "#f2f4f7", "#27364a"],
];

let currentProduct = editorRedirectTarget ? productCatalog[0] : findInitialProduct();
let currentQuantity = String(params.get("quantity") || currentProduct.prices[0][0]);
let currentSide = "front";
let selectedItemId = null;
let activeEditorTool = "";
let canvasZoom = 1;
let guidesVisible = true;
let designState = {
  front: [defaultTextItem()],
  back: [defaultTextItem("Back Side")],
};

if (!editorRedirectTarget) {
  renderProductSelect();
  renderProduct();
  bindEvents();
  renderEditorDrawer();
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

  editorToolrail?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-editor-tool]");
    if (!button) return;
    const requestedTool = button.dataset.editorTool || "templates";
    activeEditorTool = activeEditorTool === requestedTool ? "" : requestedTool;
    editorToolrail.querySelectorAll("button").forEach((item) => {
      const isActive = item === button && Boolean(activeEditorTool);
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    renderEditorDrawer();
  });

  editorDrawer?.addEventListener("click", handleDrawerAction);
  editorDrawer?.addEventListener("change", (event) => {
    if (event.target.matches("input[data-drawer-upload]")) handleUpload(event);
  });
  desktopToolbar?.addEventListener("click", handleCanvasToolbarAction);
  editorStartButton?.addEventListener("click", () => {
    document.querySelector(".print-design-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function renderEditorDrawer() {
  if (!editorDrawer) return;

  if (!activeEditorTool) {
    editorDrawer.replaceChildren();
    editorDrawer.classList.remove("is-open");
    return;
  }

  const toolContent = {
    templates: renderBackgroundTemplatePanel("Business Card Background Templates"),
    backgrounds: renderBackgroundTemplatePanel("Backgrounds"),
    text: renderToolPanel("Text", "Add editable copy to the selected side.", '<button class="drawer-action primary" type="button" data-drawer-action="add-text">Add text</button>'),
    uploads: renderToolPanel("Upload artwork", "Add PNG, JPG or WEBP artwork to the selected side.", '<label class="drawer-upload">Choose image<input type="file" data-drawer-upload accept="image/png,image/jpeg,image/webp" /></label>'),
    photos: renderToolPanel("Photos", "Upload a photo, then use Remove Background for light or white backdrops.", '<label class="drawer-upload">Upload photo<input type="file" data-drawer-upload accept="image/png,image/jpeg,image/webp" /></label><button class="drawer-action" type="button" data-drawer-action="remove-background">Remove Background</button>'),
    elements: renderToolPanel("Elements", "Add simple printable elements.", '<button class="drawer-action" type="button" data-drawer-action="add-shape" data-shape="rect">Rectangle</button><button class="drawer-action" type="button" data-drawer-action="add-shape" data-shape="circle">Circle</button><button class="drawer-action" type="button" data-drawer-action="add-shape" data-shape="line">Line</button>'),
    shapes: renderToolPanel("Shapes", "Add a color block or line behind your artwork.", '<button class="drawer-action" type="button" data-drawer-action="add-shape" data-shape="rect">Add rectangle</button><button class="drawer-action" type="button" data-drawer-action="add-shape" data-shape="circle">Add circle</button>'),
    icons: renderToolPanel("Icons", "Insert a simple icon as editable text.", '<button class="drawer-action" type="button" data-drawer-action="add-icon" data-icon="★">Star</button><button class="drawer-action" type="button" data-drawer-action="add-icon" data-icon="✓">Check</button><button class="drawer-action" type="button" data-drawer-action="add-icon" data-icon="☎">Phone</button>'),
    logos: renderToolPanel("Logos", "Upload your business logo and place it on the card.", '<label class="drawer-upload">Upload logo<input type="file" data-drawer-upload accept="image/png,image/jpeg,image/webp" /></label>'),
    qr: renderToolPanel("QR Code", "Add a scannable-style placeholder and replace it later with your real QR image if needed.", '<button class="drawer-action" type="button" data-drawer-action="add-qr">Add QR placeholder</button>'),
    layers: renderLayersPanel(),
    ai: renderToolPanel("AI tools", "Use a clean artwork photo for the best result.", '<button class="drawer-action" type="button" data-drawer-action="remove-background">Remove Background</button><button class="drawer-action" type="button" data-drawer-action="center-selected">Center selected</button>'),
  };

  editorDrawer.innerHTML = toolContent[activeEditorTool] || toolContent.templates;
  editorDrawer.classList.add("is-open");
}

function renderBackgroundTemplatePanel(title) {
  return `
    <div class="drawer-heading"><div><span>Business Cards</span><h3>${title}</h3></div><small>20 backgrounds</small></div>
    <div class="background-template-grid">
      ${backgroundTemplates
        .map(
          ([label, color1, color2], index) => `
            <button type="button" class="background-template" data-drawer-action="background" data-template-index="${index}" style="--template-start:${escapeAttribute(color1)};--template-end:${escapeAttribute(color2)}">
              <span>${escapeHtml(label)}</span>
            </button>
          `
        )
        .join("")}
    </div>
  `;
}

function renderToolPanel(title, copy, actions) {
  return `<div class="drawer-heading"><div><span>Editor tool</span><h3>${escapeHtml(title)}</h3></div></div><p class="drawer-copy">${escapeHtml(copy)}</p><div class="drawer-actions">${actions}</div>`;
}

function renderLayersPanel() {
  const items = currentItems();
  const layerRows = items.length
    ? items
        .slice()
        .reverse()
        .map(
          (item) => `<button type="button" class="layer-row ${item.id === selectedItemId ? "active" : ""}" data-drawer-action="select-layer" data-layer-id="${escapeAttribute(item.id)}"><span>${escapeHtml(layerName(item))}</span><small>${escapeHtml(item.type)}</small></button>`
        )
        .join("")
    : '<p class="drawer-copy">No objects on this side yet.</p>';
  return `<div class="drawer-heading"><div><span>Arrange</span><h3>Layers</h3></div></div><div class="layer-actions"><button class="drawer-action" type="button" data-drawer-action="layer-up">Bring forward</button><button class="drawer-action" type="button" data-drawer-action="layer-down">Send backward</button></div><div class="layer-list">${layerRows}</div>`;
}

function handleDrawerAction(event) {
  const button = event.target.closest("[data-drawer-action]");
  if (!button) return;
  const action = button.dataset.drawerAction;

  if (action === "background") {
    const template = backgroundTemplates[Number(button.dataset.templateIndex)];
    if (!template) return;
    if (bgColor1) bgColor1.value = template[1];
    if (bgColor2) bgColor2.value = template[2];
    renderCanvas();
    return;
  }
  if (action === "add-text") addEditorText();
  if (action === "add-shape") addShape(button.dataset.shape || "rect");
  if (action === "add-icon") addEditorIcon(button.dataset.icon || "★");
  if (action === "add-qr") addQrPlaceholder();
  if (action === "remove-background") removeBackgroundSelected();
  if (action === "center-selected") centerSelectedItem();
  if (action === "select-layer") {
    selectedItemId = button.dataset.layerId || null;
    renderCanvas();
    renderEditorDrawer();
  }
  if (action === "layer-up") moveSelectedLayer(1);
  if (action === "layer-down") moveSelectedLayer(-1);
}

function handleCanvasToolbarAction(event) {
  const button = event.target.closest("button[data-canvas-action]");
  if (!button) return;
  const action = button.dataset.canvasAction;
  if (action === "zoom-in") canvasZoom = clamp(canvasZoom + 0.1, 0.8, 1.3);
  if (action === "zoom-out") canvasZoom = clamp(canvasZoom - 0.1, 0.8, 1.3);
  if (action === "center") centerSelectedItem();
  if (action === "toggle-guides") {
    guidesVisible = !guidesVisible;
    designCanvas?.classList.toggle("guides-hidden", !guidesVisible);
  }
  renderCanvas();
}

function addEditorText() {
  const item = defaultTextItem("Your Text Here");
  currentItems().push(item);
  selectedItemId = item.id;
  renderCanvas();
  renderEditorDrawer();
}

function addEditorIcon(icon) {
  const item = defaultTextItem(icon);
  item.x = 40;
  item.y = 38;
  item.w = 20;
  item.h = 24;
  item.size = 52;
  currentItems().push(item);
  selectedItemId = item.id;
  renderCanvas();
  renderEditorDrawer();
}

function addShape(shape) {
  const item = {
    id: `shape-${Date.now()}`,
    type: "shape",
    shape,
    color: "#0b8df4",
    x: 30,
    y: 32,
    w: shape === "line" ? 42 : 28,
    h: shape === "line" ? 4 : 26,
  };
  currentItems().push(item);
  selectedItemId = item.id;
  renderCanvas();
  renderEditorDrawer();
}

function addQrPlaceholder() {
  const item = { id: `qr-${Date.now()}`, type: "qr", x: 68, y: 62, w: 18, h: 24 };
  currentItems().push(item);
  selectedItemId = item.id;
  renderCanvas();
  renderEditorDrawer();
}

function centerSelectedItem() {
  const item = findSelectedItem();
  if (!item) {
    setStatus("Select an object to center.", true);
    return;
  }
  item.x = clamp((100 - item.w) / 2, 0, 100 - item.w);
  item.y = clamp((100 - item.h) / 2, 0, 100 - item.h);
  renderCanvas();
  renderEditorDrawer();
}

function moveSelectedLayer(direction) {
  const items = currentItems();
  const index = items.findIndex((item) => item.id === selectedItemId);
  if (index < 0) return;
  const nextIndex = clamp(index + direction, 0, items.length - 1);
  if (nextIndex === index) return;
  [items[index], items[nextIndex]] = [items[nextIndex], items[index]];
  renderCanvas();
  renderEditorDrawer();
}

function layerName(item) {
  if (item.type === "text") return item.text || "Text";
  if (item.type === "image") return item.name || "Image";
  if (item.type === "qr") return "QR placeholder";
  return item.shape === "circle" ? "Circle" : item.shape === "line" ? "Line" : "Rectangle";
}

function getEditorRedirectTarget() {
  const requestedProduct = `${params.get("product") || ""} ${params.get("item") || ""}`.toLowerCase();
  if (!requestedProduct.trim()) return "";

  if (/menus?/.test(requestedProduct) || /door\s*hangers?/.test(requestedProduct)) {
    return `print-products-upload.html?${params.toString()}`;
  }

  if (/retractable/.test(requestedProduct) || /yard\s*signs?/.test(requestedProduct) || /\bbanners?\b/.test(requestedProduct)) {
    return bannerDesignerRedirect(requestedProduct);
  }

  if (/t-?\s*shirts?/.test(requestedProduct) || /gildan/.test(requestedProduct)) {
    return "tshirt.html";
  }

  return "";
}

function bannerDesignerRedirect(requestedProduct) {
  const normalized = String(requestedProduct || "").toLowerCase();
  const params = new URLSearchParams();

  if (/retractable/.test(normalized)) {
    params.set("product", "Retractable Banner");
    params.set("width", "3");
    params.set("height", "7");
  } else if (/yard\s*signs?/.test(normalized)) {
    params.set("product", "Yard Sign");
    params.set("width", "1.5");
    params.set("height", "2");
  } else {
    params.set("product", "Banner");
    params.set("width", "4");
    params.set("height", "4");
  }

  return `banner-designer/designer?${params.toString()}`;
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
  renderEditorDrawer();
  updateEditorHero();
  updateSummary();
}

function updateEditorHero() {
  if (editorHeroKicker) editorHeroKicker.textContent = currentProduct.category === "cards" ? "Business printing" : "Custom print products";
  if (editorHeroTitle) {
    const words = currentProduct.label.split(" ");
    const splitAt = Math.max(1, Math.ceil(words.length / 2));
    const first = words.slice(0, splitAt).join(" ");
    const second = words.slice(splitAt).join(" ") || first;
    editorHeroTitle.innerHTML = `${escapeHtml(first)}<br /><strong>${escapeHtml(second)}</strong>`;
  }
  if (editorHeroCopy) editorHeroCopy.textContent = `Create sharp, polished ${currentProduct.label.toLowerCase()} with the size, quantity and finish your business needs.`;
  if (editorHeroImage) {
    editorHeroImage.src = currentProduct.image;
    editorHeroImage.alt = `${currentProduct.label} from Next Print NY`;
  }
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
  designCanvas.style.transform = `scale(${canvasZoom})`;
  designCanvas.style.transformOrigin = "center";
  designCanvas.classList.toggle("round-product", currentProduct.shape === "round");
  designCanvas.classList.toggle("business-card-canvas", currentProduct.category === "cards");
  designCanvas.classList.toggle("guides-hidden", !guidesVisible);
  if (designSizeNode) designSizeNode.textContent = `${currentProduct.sizeLabel} - ${currentSide === "front" ? "Front" : "Back"}`;

  const isDesktopEditor = window.matchMedia("(min-width: 761px)").matches;
  const width = Math.min(620, Math.max(280, aspect >= 1 ? 620 : 440));
  designCanvas.style.maxWidth = isDesktopEditor ? "none" : `${width}px`;

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
  } else if (item.type === "shape") {
    node.classList.add("print-shape-item", `shape-${item.shape || "rect"}`);
    node.style.background = item.color || "#0b8df4";
  } else if (item.type === "qr") {
    const qr = document.createElement("span");
    qr.className = "print-qr-art";
    qr.setAttribute("aria-label", "QR placeholder");
    node.appendChild(qr);
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

async function removeBackgroundSelected() {
  const item = findSelectedItem();
  if (!item || item.type !== "image") {
    setStatus("Select a photo first to remove its background.", true);
    return;
  }

  try {
    setStatus("Removing light background...");
    const image = await loadImage(item.src);
    const scale = Math.min(1, 1600 / Math.max(image.naturalWidth || image.width, image.naturalHeight || image.height));
    const width = Math.max(1, Math.round((image.naturalWidth || image.width) * scale));
    const height = Math.max(1, Math.round((image.naturalHeight || image.height) * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(image, 0, 0, width, height);
    const pixels = context.getImageData(0, 0, width, height);

    for (let index = 0; index < pixels.data.length; index += 4) {
      const red = pixels.data[index];
      const green = pixels.data[index + 1];
      const blue = pixels.data[index + 2];
      const lightest = Math.max(red, green, blue);
      const darkest = Math.min(red, green, blue);
      const brightness = (red + green + blue) / 3;
      const isLowSaturation = lightest - darkest < 34;
      if (brightness > 236 && isLowSaturation) {
        pixels.data[index + 3] = 0;
      } else if (brightness > 214 && isLowSaturation) {
        pixels.data[index + 3] = Math.round(((236 - brightness) / 22) * pixels.data[index + 3]);
      }
    }

    context.putImageData(pixels, 0, 0);
    item.src = canvas.toDataURL("image/png");
    renderCanvas();
    setStatus("Light background removed. Review the edges before checkout.");
  } catch (error) {
    setStatus("Could not remove this background. Try a clear JPG or PNG photo.", true);
  }
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
  if (guidesVisible) {
    ctx.lineWidth = Math.max(4, canvas.width * 0.004);
    ctx.strokeStyle = "rgba(231, 63, 92, 0.55)";
    ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
    ctx.setLineDash([16, 12]);
    if (currentProduct.category === "cards") {
      const trimX = canvas.width * 0.033333;
      const trimY = canvas.height * 0.055556;
      const safeX = canvas.width * 0.066667;
      const safeY = canvas.height * 0.111111;
      ctx.strokeStyle = "rgba(26, 154, 216, 0.68)";
      ctx.strokeRect(trimX, trimY, canvas.width - trimX * 2, canvas.height - trimY * 2);
      ctx.strokeStyle = "rgba(46, 166, 104, 0.72)";
      ctx.strokeRect(safeX, safeY, canvas.width - safeX * 2, canvas.height - safeY * 2);
    } else {
      ctx.strokeStyle = "rgba(46, 166, 104, 0.72)";
      ctx.strokeRect(canvas.width * 0.08, canvas.height * 0.08, canvas.width * 0.84, canvas.height * 0.84);
    }
    ctx.setLineDash([]);
  }

  const sideItems = designState[side] || [];
  for (const item of sideItems) {
    const x = (item.x / 100) * canvas.width;
    const y = (item.y / 100) * canvas.height;
    const w = (item.w / 100) * canvas.width;
    const h = (item.h / 100) * canvas.height;
    if (item.type === "image") {
      const image = await loadImage(item.src);
      ctx.drawImage(image, x, y, w, h);
    } else if (item.type === "shape") {
      ctx.fillStyle = item.color || "#0b8df4";
      if (item.shape === "circle") {
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(x, y, w, h);
      }
    } else if (item.type === "qr") {
      drawQrPlaceholder(ctx, x, y, w, h);
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

function drawQrPlaceholder(context, x, y, width, height) {
  const cell = Math.max(4, Math.floor(Math.min(width, height) / 9));
  context.fillStyle = "#ffffff";
  context.fillRect(x, y, width, height);
  context.fillStyle = "#061a35";
  for (let row = 0; row < 9; row += 1) {
    for (let column = 0; column < 9; column += 1) {
      const corner = (row < 3 && column < 3) || (row < 3 && column > 5) || (row > 5 && column < 3);
      const pattern = (row * 5 + column * 3) % 4 === 0;
      if (corner || pattern) context.fillRect(x + column * cell, y + row * cell, cell, cell);
    }
  }
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
