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
    memberPrices: [[100, 25.75], [250, 29.87], [500, 31.93], [1000, 42.28], [2500, 85.5], [5000, 116.4], [10000, 254.4]],
    prices: [[100, 35], [250, 45], [500, 55], [1000, 70], [2500, 110], [5000, 155], [10000, 303]],
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
    memberPrices: [[100, 28.84], [250, 50.43], [500, 58.67], [1000, 69.02], [2500, 149.35], [5000, 178.22], [10000, 278.81]],
    prices: [[100, 41], [250, 65], [500, 75], [1000, 85], [2500, 170], [5000, 210], [10000, 340]],
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
    memberPrices: [[100, 59.7], [250, 87.51], [500, 102.95], [1000, 118.46], [2500, 227.62], [5000, 295.28], [10000, 413.02]],
    prices: [[100, 75], [250, 104], [500, 126], [1000, 149], [2500, 285], [5000, 371], [10000, 523]],
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
    memberPrices: [[100, 130.21], [250, 147.74], [500, 164.29], [1000, 220.1], [2500, 335.76], [5000, 380.03], [10000, 665.32]],
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
    memberPrices: [[100, 42.25], [250, 74.12], [500, 62.79], [1000, 72.06], [2500, 113.31], [5000, 184.32], [10000, 322.01]],
    prices: [[100, 52], [250, 85], [500, 90], [1000, 96], [2500, 145], [5000, 226], [10000, 399]],
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
    memberPrices: [[100, 52.49], [250, 102.95], [500, 107.08], [1000, 115.37], [2500, 166.84], [5000, 255.43], [10000, 425.39]],
    prices: [[100, 62], [250, 123], [500, 128], [1000, 138], [2500, 204], [5000, 314], [10000, 533]],
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
    memberPrices: [[100, 27.78], [250, 46.31], [500, 48.37], [1000, 52.49], [2500, 80.3], [5000, 125.64], [10000, 216.27]],
    prices: [[100, 38], [250, 56], [500, 62], [1000, 65], [2500, 110], [5000, 153], [10000, 267]],
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
    memberPrices: [[100, 23.66], [250, 31.93], [500, 32.97], [1000, 37.05], [2500, 57.64], [5000, 90.6], [10000, 156.51]],
    prices: [[100, 28], [250, 38], [500, 48], [1000, 56], [2500, 70], [5000, 109], [10000, 191]],
    image: "assets/printing-stickers-ai.webp",
  },
  {
    id: "stickers-4x4",
    product: "Stickers 4x4",
    label: 'Stickers 4" x 4"',
    category: "stickers",
    sizeLabel: '4" x 4"',
    trimLabel: "Rectangle sticker",
    width: 4,
    height: 4,
    memberPrices: [[100, 53.52], [250, 94.72], [500, 99.88], [1000, 109.86], [2500, 169.9], [5000, 261.56], [10000, 435.61]],
    prices: [[100, 65], [250, 115], [500, 123], [1000, 133], [2500, 207], [5000, 322], [10000, 542]],
    image: "assets/printing-stickers-ai.webp",
  },
];

const params = new URLSearchParams(window.location.search);
if (params.get("customBanner") === "1") {
  const width = clamp(Number(params.get("width") || 2), 1, 100);
  const height = clamp(Number(params.get("height") || 4), 1, 100);
  const quantity = Math.max(1, Math.round(Number(params.get("quantity") || 1)));
  const material = params.get("material") || "13 oz. Standard Vinyl";
  const memberPrice = Number(String(params.get("memberPrice") || "").replace(/[^0-9.]/g, "")) || width * height * 7 * quantity;
  const price = Number(String(params.get("price") || "").replace(/[^0-9.]/g, "")) || width * height * 9 * quantity;
  productCatalog.unshift({
    id: "custom-banner",
    product: params.get("product") || `${material} ${width} ft x ${height} ft`,
    label: material === "Window Vinyl" ? "Window Vinyl" : "Custom Banner",
    category: "banners",
    sizeLabel: `${width} ft x ${height} ft`,
    trimLabel: material === "Window Vinyl" ? "Window vinyl - no banner treatment" : "Custom vinyl banner",
    width,
    height,
    memberPrices: [[quantity, memberPrice]],
    prices: [[quantity, price]],
    image: "assets/catalog-banners.png",
    material,
    treatment: params.get("treatment") || "None",
  });
}
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
const summaryMemberPrice = document.querySelector("#printSummaryMemberPrice");
const summaryRegularPrice = document.querySelector("#printSummaryRegularPrice");
const summarySavings = document.querySelector("#printSummarySavings");
const continueButton = document.querySelector("#printContinueCheckout");
const statusNode = document.querySelector("#printEditorStatus");
const preflightButton = document.querySelector("#printRunPreflight");
const preflightResult = document.querySelector("#printPreflightResult");
const editorToolrail = document.querySelector(".print-editor-toolrail");
const editorDrawer = document.querySelector("#printEditorDrawer");
const desktopToolbar = document.querySelector(".print-desktop-toolbar");
const objectToolbar = document.querySelector(".print-object-toolbar");
const toolbarFont = document.querySelector("#printToolbarFont");
const toolbarSize = document.querySelector("#printToolbarSize");
const toolbarColor = document.querySelector("#printToolbarColor");
const toolbarDelete = document.querySelector("#printToolbarDelete");
const toolbarDuplicate = document.querySelector("#printToolbarDuplicate");
const toolbarFlip = document.querySelector("#printToolbarFlip");
const toolbarRemoveBg = document.querySelector("#printToolbarRemoveBg");
const toolbarBold = document.querySelector("#printToolbarBold");
const toolbarItalic = document.querySelector("#printToolbarItalic");
const toolbarCurve = document.querySelector("#printToolbarCurve");
const toolbarOutline = document.querySelector("#printToolbarOutline");
const toolbarShadow = document.querySelector("#printToolbarShadow");
const toolbarOpacity = document.querySelector("#printToolbarOpacity");
const toolbarRotate = document.querySelector("#printToolbarRotate");
const savePrintButton = document.querySelector("#printSavePrint");
const editorHeroTitle = document.querySelector("#printEditorHeroTitle");
const editorHeroKicker = document.querySelector("#printEditorHeroKicker");
const editorHeroCopy = document.querySelector("#printEditorHeroCopy");
const editorHeroImage = document.querySelector("#printEditorHeroImage");
const editorStartButton = document.querySelector("#printEditorStart");
const selectionCompact = document.querySelector("#printSelectionCompact");
const changeSelectionLink = document.querySelector("#printChangeSelection");
const studioOrder = document.querySelector("#printStudioOrder");
const studioBack = document.querySelector("#printStudioBack");
const studioSave = document.querySelector("#printStudioSave");

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

const solidBackgroundColors = [
  ["White", "#ffffff"],
  ["Black", "#111827"],
  ["Navy", "#082d5e"],
  ["Blue", "#1877f2"],
  ["Sky", "#6ed5f6"],
  ["Teal", "#14b8a6"],
  ["Green", "#22a447"],
  ["Lime", "#8bcf3f"],
  ["Yellow", "#f5cf3a"],
  ["Orange", "#f68b2c"],
  ["Red", "#e33c3c"],
  ["Pink", "#eb6ea5"],
  ["Purple", "#7d59c8"],
  ["Brown", "#85523a"],
  ["Gray", "#9ca3af"],
  ["Light Gray", "#e5e7eb"],
  ["Cream", "#fff5d8"],
  ["Beige", "#e8d2b5"],
  ["Light Blue", "#e0f5ff"],
  ["Light Green", "#e5f8e7"],
];

let currentProduct = editorRedirectTarget ? productCatalog[0] : findInitialProduct();
let currentQuantity = String(params.get("quantity") || currentProduct.prices[0][0]);
let currentSide = "front";
let selectedItemId = null;
let activeEditorTool = params.get("directUpload") === "1" ? "uploads" : "";
let canvasZoom = 1;
let guidesVisible = true;
let aiImageResults = [];
let snapEnabled = true;
let undoHistory = [];
let redoHistory = [];
let historyTimer = null;
let designState = {
  front: [defaultTextItem()],
  back: [defaultTextItem("Back Side")],
};

if (!editorRedirectTarget) {
  renderProductSelect();
  renderProduct();
  bindEvents();
  renderEditorDrawer();
  rememberHistory();
  loadMemberDesignFromQuery();
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

  addTextButton?.addEventListener("click", addEditorText);

  uploadInput?.addEventListener("change", handleUpload);
  selectedText?.addEventListener("input", updateSelectedText);
  selectedFont?.addEventListener("change", updateSelectedText);
  selectedSize?.addEventListener("input", updateSelectedText);
  selectedColor?.addEventListener("input", updateSelectedText);
  duplicateButton?.addEventListener("click", duplicateSelected);
  deleteButton?.addEventListener("click", deleteSelected);
  toolbarFont?.addEventListener("change", () => updateSelectedText("toolbar"));
  toolbarSize?.addEventListener("input", () => updateSelectedText("toolbar"));
  toolbarColor?.addEventListener("input", () => updateSelectedText("toolbar"));
  toolbarDelete?.addEventListener("click", deleteSelected);
  toolbarDuplicate?.addEventListener("click", duplicateSelected);
  toolbarFlip?.addEventListener("click", flipSelectedItem);
  toolbarRemoveBg?.addEventListener("click", removeBackgroundSelected);
  toolbarBold?.addEventListener("click", () => toggleTextStyle("bold"));
  toolbarItalic?.addEventListener("click", () => toggleTextStyle("italic"));
  toolbarCurve?.addEventListener("click", () => toggleTextStyle("curve"));
  toolbarOutline?.addEventListener("click", () => toggleTextStyle("outline"));
  toolbarShadow?.addEventListener("click", () => toggleTextStyle("shadow"));
  toolbarOpacity?.addEventListener("input", updateSelectedImageEffects);
  toolbarRotate?.addEventListener("input", updateSelectedImageEffects);
  saveButton?.addEventListener("click", saveCurrentSidePng);
  studioSave?.addEventListener("click", saveProjectToDashboard);
  savePrintButton?.addEventListener("click", savePrintReadyPng);
  continueButton?.addEventListener("click", continueToCheckout);
  preflightButton?.addEventListener("click", runPreflight);

  editorToolrail?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-editor-tool]");
    if (!button) return;
    const requestedTool = button.dataset.editorTool || "templates";
    if (requestedTool === "text") {
      activeEditorTool = "";
      editorToolrail.querySelectorAll("button").forEach((item) => {
        item.classList.remove("active");
        item.setAttribute("aria-pressed", "false");
      });
      renderEditorDrawer();
      addEditorText();
      return;
    }
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
    if (event.target.matches("[data-object-effect-control]")) updateObjectEffectControl(event.target);
  });
  editorDrawer?.addEventListener("input", (event) => {
    if (event.target.matches("[data-object-effect-control]")) updateObjectEffectControl(event.target);
  });
  desktopToolbar?.addEventListener("click", handleCanvasToolbarAction);
  editorStartButton?.addEventListener("click", () => {
    document.querySelector(".print-design-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function renderEditorDrawer() {
  if (!editorDrawer) return;

  editorToolrail?.querySelectorAll("button[data-editor-tool]").forEach((button) => {
    const isActive = button.dataset.editorTool === activeEditorTool;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (!activeEditorTool) {
    editorDrawer.replaceChildren();
    editorDrawer.classList.remove("is-open");
    return;
  }

  const toolContent = {
    templates: renderBackgroundTemplatePanel("Business Card Background Templates"),
    backgrounds: renderSolidBackgroundPanel(),
    text: renderToolPanel("Text", "Add editable copy to the selected side.", '<button class="drawer-action primary" type="button" data-drawer-action="add-text">Add text</button>'),
    textfx: renderTextEffectsPanel(),
    uploads: renderUploadPanel("Upload artwork", "Add PNG, JPG or WEBP artwork to the selected side."),
    photos: `${renderUploadPanel("Photos", "Upload a photo, then use Remove Background for light or white backdrops.")}<div class="drawer-actions"><button class="drawer-action" type="button" data-drawer-action="remove-background">Remove Background</button></div>`,
    crop: renderCropPanel(),
    elements: renderToolPanel("Elements", "Add printable shapes and accents to your design.", '<button class="drawer-action" type="button" data-drawer-action="add-shape" data-shape="rect">Rectangle</button><button class="drawer-action" type="button" data-drawer-action="add-shape" data-shape="rounded">Rounded</button><button class="drawer-action" type="button" data-drawer-action="add-shape" data-shape="square">Square</button><button class="drawer-action" type="button" data-drawer-action="add-shape" data-shape="circle">Circle</button><button class="drawer-action" type="button" data-drawer-action="add-shape" data-shape="line">Line</button><button class="drawer-action" type="button" data-drawer-action="add-shape" data-shape="triangle">Triangle</button><button class="drawer-action" type="button" data-drawer-action="add-shape" data-shape="diamond">Diamond</button><button class="drawer-action" type="button" data-drawer-action="add-shape" data-shape="star">Star</button><button class="drawer-action" type="button" data-drawer-action="add-shape" data-shape="arrow">Arrow</button><button class="drawer-action" type="button" data-drawer-action="add-shape" data-shape="hexagon">Hexagon</button><button class="drawer-action" type="button" data-drawer-action="add-shape" data-shape="heart">Heart</button><button class="drawer-action" type="button" data-drawer-action="add-shape" data-shape="frame">Frame</button>'),
    shapes: renderToolPanel("Shapes", "Add a color block or line behind your artwork.", '<button class="drawer-action" type="button" data-drawer-action="add-shape" data-shape="rect">Add rectangle</button><button class="drawer-action" type="button" data-drawer-action="add-shape" data-shape="circle">Add circle</button>'),
    icons: renderIconPanel(),
    logos: renderUploadPanel("Logos", "Upload your business logo and place it on the card."),
    qr: renderQrPanel(),
    layers: renderLayersPanel(),
    mockups: renderMockupPanel(),
    ai: renderAiImagePanel(),
  };

  editorDrawer.innerHTML = toolContent[activeEditorTool] || toolContent.templates;
  editorDrawer.classList.add("is-open");
}

function renderUploadPanel(title, copy) {
  return `
    <div class="drawer-heading"><div><span>Artwork</span><h3>${escapeHtml(title)}</h3></div></div>
    <p class="drawer-copy">${escapeHtml(copy)}</p>
    <div class="drawer-actions"><button class="drawer-action primary" type="button" data-drawer-action="choose-upload">Choose file</button><input id="printDrawerUpload" type="file" data-drawer-upload accept="image/png,image/jpeg,image/webp" /></div>
  `;
}

function renderCropPanel() {
  const item = findSelectedItem();
  if (!item || item.type !== "image") return renderToolPanel("Crop image", "Select an uploaded image, then choose a Photoshop-style crop shape.", "");
  const shapes = [["", "Original"], ["square", "Square"], ["circle", "Circle"], ["rounded", "Rounded"], ["triangle", "Triangle"], ["diamond", "Diamond"], ["hexagon", "Hexagon"], ["star", "Star"], ["heart", "Heart"]];
  return `
    <div class="drawer-heading"><div><span>Photo edit</span><h3>Crop image</h3></div><small>Selected photo</small></div>
    <p class="drawer-copy">Apply a non-destructive crop shape. You can restore Original at any time.</p>
    <div class="drawer-actions crop-manual-actions">
      <button class="drawer-action primary" type="button" data-drawer-action="start-custom-crop">Custom crop</button>
      ${item.cropDraft ? '<button class="drawer-action primary" type="button" data-drawer-action="apply-custom-crop">Apply crop</button><button class="drawer-action" type="button" data-drawer-action="cancel-custom-crop">Cancel</button>' : ""}
      ${item.customCrop ? '<button class="drawer-action" type="button" data-drawer-action="reset-custom-crop">Reset manual crop</button>' : ""}
    </div>
    <div class="crop-shape-grid">
      ${shapes.map(([shape, label]) => `<button class="drawer-action ${item.cropShape === shape ? "active" : ""}" type="button" data-drawer-action="set-crop" data-crop-shape="${shape}"><span class="crop-shape-preview crop-${shape || "original"}"></span>${escapeHtml(label)}</button>`).join("")}
    </div>
  `;
}

function renderTextEffectsPanel() {
  const item = findSelectedItem();
  if (!item) {
    return renderToolPanel("FX Studio", "Select text, a photo, or a shape to edit its fill, effects and print settings.", "");
  }
  const value = (key, fallback) => escapeAttribute(item[key] ?? fallback);
  const mode = item.curveMode || "straight";
  const effectButton = (label, key) => `<button class="drawer-action ${item[key] ? "active" : ""}" type="button" data-drawer-action="toggle-text-effect" data-text-effect="${key}">${label}</button>`;
  const modeButton = (label, key) => `<button class="drawer-action ${mode === key ? "active" : ""}" type="button" data-drawer-action="set-text-curve" data-curve-mode="${key}">${label}</button>`;
  const fillControls = item.type !== "image" ? `
    <div class="drawer-heading text-fx-shape-heading"><div><span>Color</span><h3>Fill & Gradient</h3></div></div>
    <div class="text-fx-modes">
      <button class="drawer-action ${item.fillMode !== "gradient" ? "active" : ""}" type="button" data-drawer-action="set-fill-mode" data-fill-mode="solid">Solid</button>
      <button class="drawer-action ${item.fillMode === "gradient" ? "active" : ""}" type="button" data-drawer-action="set-fill-mode" data-fill-mode="gradient">Gradient</button>
      <button class="drawer-action" type="button" data-drawer-action="eyedropper">Eyedropper</button>
      <button class="drawer-action" type="button" data-drawer-action="sample-image-color">Sample image</button>
    </div>
    <div class="text-fx-grid fx-fill-grid">
      <label>Fill color<input type="color" data-object-effect-control data-effect-key="color" value="${value("color", "#061a35")}" /></label>
      <label>Gradient start<input type="color" data-object-effect-control data-effect-key="fillStart" value="${value("fillStart", item.color || "#061a35")}" /></label>
      <label>Gradient end<input type="color" data-object-effect-control data-effect-key="fillEnd" value="${value("fillEnd", "#12c5df")}" /></label>
    </div>` : "";
  const imageControls = item.type === "image" ? `
    <div class="drawer-heading text-fx-shape-heading"><div><span>Photo edit</span><h3>Crop & Adjust</h3></div></div>
    <div class="text-fx-modes">
      <button class="drawer-action ${item.cropShape === "circle" ? "active" : ""}" type="button" data-drawer-action="set-crop" data-crop-shape="circle">Crop circle</button>
      <button class="drawer-action ${item.cropShape === "square" ? "active" : ""}" type="button" data-drawer-action="set-crop" data-crop-shape="square">Crop square</button>
      <button class="drawer-action ${item.cropShape === "rounded" ? "active" : ""}" type="button" data-drawer-action="set-crop" data-crop-shape="rounded">Rounded</button>
      <button class="drawer-action" type="button" data-drawer-action="open-crop-panel">All crop shapes</button>
      <button class="drawer-action ${!item.cropShape ? "active" : ""}" type="button" data-drawer-action="set-crop" data-crop-shape="">Reset crop</button>
      <button class="drawer-action" type="button" data-drawer-action="eyedropper">Eyedropper</button>
    </div>
    <div class="text-fx-grid fx-photo-grid">
      <label>Brightness<input type="range" min="0" max="200" value="${value("brightness", 100)}" data-object-effect-control data-effect-key="brightness" /><output>${value("brightness", 100)}%</output></label>
      <label>Saturation<input type="range" min="0" max="200" value="${value("saturation", 100)}" data-object-effect-control data-effect-key="saturation" /><output>${value("saturation", 100)}%</output></label>
      <label>Blur<input type="range" min="0" max="24" value="${value("blur", 0)}" data-object-effect-control data-effect-key="blur" /><output>${value("blur", 0)} px</output></label>
      <label>Filter<select data-object-effect-control data-effect-key="filterPreset"><option value="normal"${(item.filterPreset || "normal") === "normal" ? " selected" : ""}>Normal</option><option value="grayscale"${item.filterPreset === "grayscale" ? " selected" : ""}>Grayscale</option><option value="sepia"${item.filterPreset === "sepia" ? " selected" : ""}>Sepia</option><option value="vintage"${item.filterPreset === "vintage" ? " selected" : ""}>Vintage</option><option value="cool"${item.filterPreset === "cool" ? " selected" : ""}>Cool</option><option value="contrast"${item.filterPreset === "contrast" ? " selected" : ""}>High contrast</option></select></label>
    </div>` : "";
  const textControls = item.type === "text" ? `
    <div class="drawer-heading text-fx-shape-heading"><div><span>Typography studio</span><h3>Text Effects</h3></div><small>Selected text</small></div>
    <div class="text-fx-modes">
      ${effectButton("Outline", "outline")}
      ${effectButton("Shadow", "shadow")}
      ${effectButton("Stroke", "stroke")}
      ${effectButton("Glow", "glow")}
    </div>
    <div class="text-fx-grid">
      <label>Outline color<input type="color" data-object-effect-control data-effect-key="outlineColor" value="${value("outlineColor", "#ffffff")}" /></label>
      <label>Outline width<input type="range" min="0" max="16" value="${value("outlineWidth", 2)}" data-object-effect-control data-effect-key="outlineWidth" /><output>${value("outlineWidth", 2)} px</output></label>
      <label>Shadow color<input type="color" data-object-effect-control data-effect-key="shadowColor" value="${value("shadowColor", "#10233d")}" /></label>
      <label>Shadow strength<input type="range" min="0" max="36" value="${value("shadowBlur", 8)}" data-object-effect-control data-effect-key="shadowBlur" /><output>${value("shadowBlur", 8)} px</output></label>
      <label>Stroke color<input type="color" data-object-effect-control data-effect-key="strokeColor" value="${value("strokeColor", "#0b8df4")}" /></label>
      <label>Stroke width<input type="range" min="0" max="16" value="${value("strokeWidth", 2)}" data-object-effect-control data-effect-key="strokeWidth" /><output>${value("strokeWidth", 2)} px</output></label>
      <label>Glow color<input type="color" data-object-effect-control data-effect-key="glowColor" value="${value("glowColor", "#12c5df")}" /></label>
      <label>Glow strength<input type="range" min="0" max="48" value="${value("glowBlur", 14)}" data-object-effect-control data-effect-key="glowBlur" /><output>${value("glowBlur", 14)} px</output></label>
    </div>
    <div class="drawer-heading text-fx-shape-heading"><div><span>Text shape</span><h3>Curve & Wrap</h3></div></div>
    <div class="text-fx-modes">
      ${modeButton("Straight", "straight")}
      ${modeButton("Wrap", "wrap")}
      ${modeButton("Arc", "arc")}
      ${modeButton("Circle", "circle")}
      ${modeButton("Banner", "banner")}
    </div>
    <div class="text-fx-grid text-fx-curve-control"><label>Curve amount<input type="range" min="0" max="100" value="${value("curveAmount", 65)}" data-object-effect-control data-effect-key="curveAmount" /><output>${value("curveAmount", 65)}%</output></label></div>` : "";
  return `
    <div class="drawer-heading"><div><span>Professional editor</span><h3>FX Studio</h3></div><small>${escapeHtml(item.type)}</small></div>
    <p class="drawer-copy">Fill, image adjustments, crop, effects, alignment and print production controls.</p>
    ${fillControls}
    ${imageControls}
    ${textControls}
    <div class="drawer-heading text-fx-shape-heading"><div><span>Arrange</span><h3>Align, lock & print</h3></div></div>
    <div class="text-fx-modes fx-arrange-actions">
      <button class="drawer-action" type="button" data-drawer-action="align-selected" data-align="align-left">Left</button>
      <button class="drawer-action" type="button" data-drawer-action="align-selected" data-align="align-center">Center</button>
      <button class="drawer-action" type="button" data-drawer-action="align-selected" data-align="align-right">Right</button>
      <button class="drawer-action" type="button" data-drawer-action="align-selected" data-align="align-middle">Middle</button>
      <button class="drawer-action ${item.locked ? "active" : ""}" type="button" data-drawer-action="toggle-selected-lock">${item.locked ? "Unlock layer" : "Lock layer"}</button>
      <button class="drawer-action primary" type="button" data-drawer-action="run-preflight">Check bleed</button>
      <button class="drawer-action primary" type="button" data-drawer-action="save-print-ready">Export 300 DPI</button>
    </div>
  `;
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

function renderSolidBackgroundPanel() {
  return `
    <div class="drawer-heading"><div><span>Canvas color</span><h3>Solid Background Colors</h3></div><small>20 colors</small></div>
    <div class="background-template-grid solid-background-grid">
      ${solidBackgroundColors
        .map(
          ([label, color], index) => `
            <button type="button" class="background-template solid-background" data-drawer-action="solid-background" data-solid-color-index="${index}" style="--template-start:${escapeAttribute(color)};--template-end:${escapeAttribute(color)}">
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

function renderIconPanel() {
  const icons = [
    ["Star", "★"], ["Check", "✓"], ["Heart", "♥"], ["Phone", "☎"], ["Email", "✉"], ["Location", "⌖"],
    ["Clock", "◷"], ["Calendar", "▣"], ["Globe", "◎"], ["Camera", "▧"], ["User", "●"], ["Home", "⌂"],
    ["Arrow right", "→"], ["Arrow left", "←"], ["Arrow up", "↑"], ["Arrow down", "↓"], ["Plus", "+"], ["Info", "i"],
    ["Dollar", "$"], ["Percent", "%"], ["Instagram", "◎"], ["Facebook", "f"], ["WhatsApp", "WA"], ["Chat", "…"],
  ];
  return renderToolPanel(
    "Icons",
    "Insert an editable icon, then move or resize it on the design.",
    icons.map(([label, icon]) => `<button class="drawer-action" type="button" data-drawer-action="add-icon" data-icon="${escapeAttribute(icon)}">${escapeHtml(icon)} ${escapeHtml(label)}</button>`).join("")
  );
}

function renderQrPanel() {
  return `
    <div class="drawer-heading"><div><span>QR code</span><h3>Create a Functional QR</h3></div></div>
    <div class="ai-image-controls">
      <input id="printQrValue" type="url" placeholder="https://your-link.com or phone number" />
      <button class="drawer-action primary" type="button" data-drawer-action="generate-qr">Generate QR</button>
      <button class="drawer-action" type="button" data-drawer-action="add-qr">Add sample</button>
    </div>
    <p class="drawer-copy">Use a URL, phone number, menu link, Instagram profile or payment link.</p>
  `;
}

function renderMockupPanel() {
  const mockups = [
    ["card", "Business Card"],
    ["stack", "Card Stack"],
    ["poster", "Poster / Flyer"],
    ["phone", "Smartphone"],
    ["screen", "Desktop Screen"],
    ["sign", "Store Sign"],
  ];
  return `
    <div class="drawer-heading"><div><span>Preview</span><h3>Design Mockups</h3></div></div>
    <p class="drawer-copy">See your current design in a realistic presentation without leaving the editor.</p>
    <div class="mockup-option-grid">
      ${mockups.map(([type, label]) => `<button type="button" class="mockup-option mockup-${type}" data-drawer-action="show-mockup" data-mockup-type="${type}"><span></span>${escapeHtml(label)}</button>`).join("")}
    </div>
  `;
}

function renderAiImagePanel() {
  const results = aiImageResults.length
    ? `<div class="ai-image-results">${aiImageResults
        .map((image, index) => `<button type="button" class="ai-image-result" data-drawer-action="add-ai-image" data-ai-image-index="${index}" title="Add ${escapeAttribute(image.alt)}"><img src="${escapeAttribute(image.preview)}" alt="${escapeAttribute(image.alt)}" /><span>${escapeHtml(image.credit || "Image")}</span></button>`)
        .join("")}</div>`
    : '<p class="drawer-copy">Search real photos or generate a new image without leaving the editor.</p>';
  return `
    <div class="drawer-heading"><div><span>AI tools</span><h3>Find or Generate Images</h3></div></div>
    <div class="ai-image-controls">
      <input id="printAiImagePrompt" type="search" maxlength="120" placeholder="Search or describe an image..." />
      <button class="drawer-action" type="button" data-drawer-action="search-ai-images">Search Photos</button>
      <button class="drawer-action primary" type="button" data-drawer-action="generate-ai-image">Generate with AI</button>
      <button class="drawer-action" type="button" data-drawer-action="remove-background">Remove Background</button>
      <button class="drawer-action" type="button" data-drawer-action="center-selected">Center selected</button>
    </div>
    <p id="printAiImageStatus" class="drawer-copy" aria-live="polite"></p>
    ${results}
  `;
}

function renderLayersPanel() {
  const items = currentItems();
  const layerRows = items.length
    ? items
        .slice()
        .reverse()
        .map(
          (item) => `<div class="layer-row ${item.id === selectedItemId ? "active" : ""}"><button type="button" data-drawer-action="select-layer" data-layer-id="${escapeAttribute(item.id)}"><span>${escapeHtml(layerName(item))}</span><small>${escapeHtml(item.type)}</small></button><button type="button" data-drawer-action="toggle-layer-visible" data-layer-id="${escapeAttribute(item.id)}">${item.visible === false ? "Show" : "Hide"}</button><button type="button" data-drawer-action="toggle-layer-lock" data-layer-id="${escapeAttribute(item.id)}">${item.locked ? "Unlock" : "Lock"}</button></div>`
        )
        .join("")
    : '<p class="drawer-copy">No objects on this side yet.</p>';
  return `<div class="drawer-heading"><div><span>Arrange</span><h3>Layers & Projects</h3></div></div><div class="layer-actions"><button class="drawer-action" type="button" data-drawer-action="layer-up">Bring forward</button><button class="drawer-action" type="button" data-drawer-action="layer-down">Send backward</button><button class="drawer-action" type="button" data-drawer-action="save-project">Save project</button><button class="drawer-action" type="button" data-drawer-action="load-project">Load saved</button></div><div class="layer-list">${layerRows}</div>`;
}

function handleDrawerAction(event) {
  const button = event.target.closest("[data-drawer-action]");
  if (!button) return;
  const action = button.dataset.drawerAction;

  if (action === "background") {
    const template = backgroundTemplates[Number(button.dataset.templateIndex)];
    if (!template) return;
    rememberHistory();
    if (bgColor1) bgColor1.value = template[1];
    if (bgColor2) bgColor2.value = template[2];
    renderCanvas();
    rememberHistory();
    return;
  }
  if (action === "solid-background") {
    const color = solidBackgroundColors[Number(button.dataset.solidColorIndex)]?.[1];
    if (!color) return;
    rememberHistory();
    if (bgColor1) bgColor1.value = color;
    if (bgColor2) bgColor2.value = color;
    renderCanvas();
    rememberHistory();
    return;
  }
  if (action === "add-text") addEditorText();
  if (action === "add-shape") addShape(button.dataset.shape || "rect");
  if (action === "add-icon") addEditorIcon(button.dataset.icon || "★");
  if (action === "add-qr") addQrPlaceholder();
  if (action === "generate-qr") generateQrCode();
  if (action === "show-mockup") showMockupPreview(button.dataset.mockupType || "card");
  if (action === "remove-background") removeBackgroundSelected();
  if (action === "center-selected") centerSelectedItem();
  if (action === "search-ai-images") searchEditorImages("search");
  if (action === "generate-ai-image") searchEditorImages("generate");
  if (action === "add-ai-image") addAiImage(Number(button.dataset.aiImageIndex));
  if (action === "toggle-text-effect") toggleTextStyle(button.dataset.textEffect || "outline");
  if (action === "choose-upload") editorDrawer?.querySelector("#printDrawerUpload")?.click();
  if (action === "open-crop-panel") {
    activeEditorTool = "crop";
    editorToolrail?.querySelectorAll("button").forEach((entry) => entry.classList.toggle("active", entry.dataset.editorTool === "crop"));
    renderEditorDrawer();
  }
  if (action === "set-text-curve") setTextCurve(button.dataset.curveMode || "straight");
  if (action === "set-fill-mode") setSelectedFillMode(button.dataset.fillMode || "solid");
  if (action === "set-crop") setSelectedCrop(button.dataset.cropShape || "");
  if (action === "start-custom-crop") startCustomCrop();
  if (action === "apply-custom-crop") applyCustomCrop();
  if (action === "cancel-custom-crop") cancelCustomCrop();
  if (action === "reset-custom-crop") resetCustomCrop();
  if (action === "eyedropper") openEyedropper();
  if (action === "sample-image-color") sampleSelectedImageColor();
  if (action === "align-selected") alignSelectedItem(button.dataset.align || "align-center");
  if (action === "toggle-selected-lock") toggleSelectedLock();
  if (action === "run-preflight") runPreflight();
  if (action === "save-print-ready") savePrintReadyPng();
  if (action === "select-layer") {
    selectedItemId = button.dataset.layerId || null;
    renderCanvas();
    renderEditorDrawer();
  }
  if (action === "toggle-layer-visible" || action === "toggle-layer-lock") {
    const item = currentItems().find((entry) => entry.id === button.dataset.layerId);
    if (!item) return;
    rememberHistory();
    if (action === "toggle-layer-visible") item.visible = item.visible === false;
    if (action === "toggle-layer-lock") item.locked = !item.locked;
    renderCanvas();
    renderEditorDrawer();
  }
  if (action === "layer-up") moveSelectedLayer(1);
  if (action === "layer-down") moveSelectedLayer(-1);
  if (action === "save-project") saveProject();
  if (action === "load-project") loadProject();
}

async function showMockupPreview(type) {
  try {
    setStatus("Preparing mockup preview...");
    const preview = await createPreview(currentSide, { maxSize: 1000, includeGuides: false });
    document.querySelector(".mockup-preview-modal")?.remove();
    const modal = document.createElement("div");
    modal.className = "mockup-preview-modal";
    modal.innerHTML = `<div class="mockup-preview-dialog"><button type="button" class="mockup-close" aria-label="Close mockup">Close</button><h2>${escapeHtml(type.replace(/-/g, " "))} mockup</h2><div class="mockup-stage mockup-stage-${escapeAttribute(type)}"><div class="mockup-art"><img src="${preview}" alt="Current design mockup" /></div></div><p>Preview only. Your original design stays editable.</p></div>`;
    modal.addEventListener("click", (event) => {
      if (event.target === modal || event.target.closest(".mockup-close")) modal.remove();
    });
    document.body.appendChild(modal);
    setStatus("Mockup preview opened.");
  } catch (error) {
    setStatus("Could not prepare the mockup preview.", true);
  }
}

function buildEditableProject() {
  return {
    productId: currentProduct.id,
    quantity: currentQuantity,
    designState,
    color1: bgColor1?.value || "#dff8ff",
    color2: bgColor2?.value || "#ffffff",
    savedAt: new Date().toISOString(),
  };
}

function saveProject() {
  const project = buildEditableProject();
  try {
    localStorage.setItem("nextPrintSavedEditorProject", JSON.stringify(project));
    setStatus("Project saved on this device.");
  } catch (error) {
    setStatus("Project is too large to save on this device.", true);
  }
}

async function saveProjectToDashboard() {
  const project = buildEditableProject();
  try { localStorage.setItem("nextPrintSavedEditorProject", JSON.stringify(project)); } catch {}
  setStatus("Saving editable design to your dashboard...");
  try {
    const existingId = new URLSearchParams(location.search).get("design") || "";
    const response = await fetch("/api/member?action=design", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: existingId,
        name: `${currentProduct.name} - ${new Date().toLocaleDateString()}`,
        editorType: "print-products",
        product: currentProduct.name,
        designData: project,
        assets: Object.values(project.designState || {}).flat().filter((item) => item.type === "image" && item.src?.startsWith("data:")).map((item) => ({ name: item.name || "design-artwork.png", type: item.src.slice(5, item.src.indexOf(";")) || "image/png", content: item.src.split(",").pop() })),
      }),
    });
    const data = await response.json();
    if (response.status === 401) {
      setStatus("Saved on this device. Sign in to save permanently.", true);
      if (window.confirm("Sign in to save this editable design in your dashboard?")) {
        location.href = `member-login.html?return=${encodeURIComponent(location.href)}`;
      }
      return;
    }
    if (!response.ok) throw new Error(data.error || "Could not save design.");
    if (!existingId && data.design?.id) {
      const url = new URL(location.href);
      url.searchParams.set("design", data.design.id);
      history.replaceState({}, "", url);
    }
    setStatus(data.membershipActive ? "Design saved to your member dashboard." : "Design saved. Activate membership for unlimited designs.");
  } catch (error) {
    setStatus(error.message || "Could not save this design.", true);
  }
}

async function loadMemberDesignFromQuery() {
  const designId = new URLSearchParams(location.search).get("design");
  if (!designId) return;
  try {
    const response = await fetch(`/api/member?action=design&id=${encodeURIComponent(designId)}`);
    const data = await response.json();
    if (!response.ok || !data.design?.design_data) return;
    const saved = data.design.design_data;
    const product = productCatalog.find((item) => item.id === saved.productId);
    if (product) currentProduct = product;
    currentQuantity = String(saved.quantity || currentProduct.prices[0][0]);
    designState = saved.designState || designState;
    selectedItemId = null;
    if (bgColor1) bgColor1.value = saved.color1 || "#dff8ff";
    if (bgColor2) bgColor2.value = saved.color2 || "#ffffff";
    renderProduct();
    rememberHistory();
    setStatus("Saved dashboard design loaded.");
  } catch {}
}

function loadProject() {
  try {
    const saved = JSON.parse(localStorage.getItem("nextPrintSavedEditorProject") || "null");
    if (!saved?.designState) {
      setStatus("No saved project found on this device.", true);
      return;
    }
    const product = productCatalog.find((item) => item.id === saved.productId);
    if (product) currentProduct = product;
    currentQuantity = String(saved.quantity || currentProduct.prices[0][0]);
    designState = saved.designState;
    selectedItemId = null;
    if (bgColor1) bgColor1.value = saved.color1 || "#dff8ff";
    if (bgColor2) bgColor2.value = saved.color2 || "#ffffff";
    renderProduct();
    rememberHistory();
    setStatus("Saved project loaded.");
  } catch (error) {
    setStatus("Could not load the saved project.", true);
  }
}

async function generateQrCode() {
  const value = String(document.querySelector("#printQrValue")?.value || "").trim();
  if (!value) {
    setStatus("Enter a link or phone number for the QR code.", true);
    return;
  }
  try {
    setStatus("Generating QR code...");
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=900x900&format=png&data=${encodeURIComponent(value)}`;
    const src = await remoteImageToDataUrl(url);
    rememberHistory();
    const item = { id: `qr-${Date.now()}`, type: "image", name: "Functional QR code", src, x: 68, y: 62, w: 18, h: 24 };
    currentItems().push(item);
    selectedItemId = item.id;
    renderCanvas();
    setStatus("Functional QR code added.");
  } catch (error) {
    setStatus("Could not generate the QR code. Try again.", true);
  }
}

async function searchEditorImages(mode) {
  const promptInput = document.querySelector("#printAiImagePrompt");
  const status = document.querySelector("#printAiImageStatus");
  const prompt = String(promptInput?.value || "").trim();
  if (!prompt) {
    if (status) status.textContent = "Write what you want to search or generate first.";
    return;
  }
  if (status) status.textContent = mode === "generate" ? "Generating image..." : "Searching photos...";
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: mode === "generate" ? "image-generate" : "image-search", [mode === "generate" ? "prompt" : "query"]: prompt }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || "Could not find images.");
    aiImageResults = Array.isArray(data.images) ? data.images.slice(0, 12) : [];
    renderEditorDrawer();
  } catch (error) {
    if (status) status.textContent = error.message || "Could not find images.";
  }
}

async function addAiImage(index) {
  const image = aiImageResults[index];
  if (!image?.src) return;
  try {
    setStatus("Adding image to the design...");
    const src = image.src.startsWith("data:") ? image.src : await remoteImageToDataUrl(image.src);
    const item = {
      id: `ai-image-${Date.now()}`,
      type: "image",
      name: image.alt || "AI image",
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
  } catch (error) {
    setStatus("Could not add this image. Try another result.", true);
  }
}

async function remoteImageToDataUrl(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Could not download image.");
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function handleCanvasToolbarAction(event) {
  const button = event.target.closest("button[data-canvas-action]");
  if (!button) return;
  const action = button.dataset.canvasAction;
  if (action === "undo") {
    undoDesign();
    return;
  }
  if (action === "redo") {
    redoDesign();
    return;
  }
  if (action.startsWith("align-")) {
    alignSelectedItem(action);
    return;
  }
  if (action === "toggle-snap") {
    snapEnabled = !snapEnabled;
    button.classList.toggle("active", snapEnabled);
    setStatus(snapEnabled ? "Smart snap enabled." : "Smart snap disabled.");
    return;
  }
  if (action === "zoom-in") canvasZoom = clamp(canvasZoom + 0.1, 0.8, 1.3);
  if (action === "zoom-out") canvasZoom = clamp(canvasZoom - 0.1, 0.8, 1.3);
  if (action === "center") centerSelectedItem();
  if (action === "toggle-guides") {
    guidesVisible = !guidesVisible;
    designCanvas?.classList.toggle("guides-hidden", !guidesVisible);
  }
  renderCanvas();
  rememberHistory();
}

function designSnapshot() {
  return JSON.stringify({
    designState,
    currentSide,
    selectedItemId,
    color1: bgColor1?.value || "#dff8ff",
    color2: bgColor2?.value || "#ffffff",
  });
}

function rememberHistory() {
  const snapshot = designSnapshot();
  if (undoHistory.at(-1) === snapshot) return;
  undoHistory.push(snapshot);
  if (undoHistory.length > 30) undoHistory.shift();
  redoHistory = [];
}

function restoreHistory(snapshot) {
  const state = JSON.parse(snapshot);
  designState = state.designState || { front: [], back: [] };
  currentSide = state.currentSide || "front";
  selectedItemId = state.selectedItemId || null;
  if (bgColor1) bgColor1.value = state.color1 || "#dff8ff";
  if (bgColor2) bgColor2.value = state.color2 || "#ffffff";
  renderSideTabs();
  renderCanvas();
  renderEditorDrawer();
}

function undoDesign() {
  if (undoHistory.length < 2) {
    setStatus("Nothing to undo yet.", true);
    return;
  }
  const current = undoHistory.pop();
  redoHistory.push(current);
  restoreHistory(undoHistory.at(-1));
  setStatus("Last change undone.");
}

function redoDesign() {
  const next = redoHistory.pop();
  if (!next) {
    setStatus("Nothing to redo yet.", true);
    return;
  }
  undoHistory.push(next);
  restoreHistory(next);
  setStatus("Change restored.");
}

function alignSelectedItem(action) {
  const item = findSelectedItem();
  if (!item) {
    setStatus("Select an object to align it.", true);
    return;
  }
  rememberHistory();
  if (action === "align-left") item.x = 0;
  if (action === "align-center") item.x = (100 - item.w) / 2;
  if (action === "align-right") item.x = 100 - item.w;
  if (action === "align-middle") item.y = (100 - item.h) / 2;
  renderCanvas();
  rememberHistory();
}

function addEditorText() {
  rememberHistory();
  const item = defaultTextItem("Your Text Here");
  currentItems().push(item);
  selectedItemId = item.id;
  renderCanvas();
  rememberHistory();
  requestAnimationFrame(() => {
    const editableNode = designCanvas?.querySelector(`[data-id="${CSS.escape(item.id)}"] .print-canvas-text-content`);
    editableNode?.focus();
    placeCaretAtEnd(editableNode);
  });
  renderEditorDrawer();
}

function addEditorIcon(icon) {
  rememberHistory();
  const item = defaultTextItem(icon);
  item.x = 40;
  item.y = 38;
  item.w = 20;
  item.h = 24;
  item.size = 52;
  currentItems().push(item);
  selectedItemId = item.id;
  renderCanvas();
  rememberHistory();
  renderEditorDrawer();
}

function addShape(shape) {
  rememberHistory();
  const item = {
    id: `shape-${Date.now()}`,
    type: "shape",
    shape,
    color: "#0b8df4",
    x: 30,
    y: 32,
    w: shape === "line" ? 42 : shape === "square" || shape === "circle" || shape === "diamond" || shape === "star" || shape === "heart" ? 24 : 28,
    h: shape === "line" ? 4 : shape === "square" || shape === "circle" || shape === "diamond" || shape === "star" || shape === "heart" ? 24 : 26,
  };
  currentItems().push(item);
  selectedItemId = item.id;
  renderCanvas();
  rememberHistory();
  renderEditorDrawer();
}

function addQrPlaceholder() {
  rememberHistory();
  const item = { id: `qr-${Date.now()}`, type: "qr", x: 68, y: 62, w: 18, h: 24 };
  currentItems().push(item);
  selectedItemId = item.id;
  renderCanvas();
  rememberHistory();
  renderEditorDrawer();
}

function centerSelectedItem() {
  const item = findSelectedItem();
  if (!item) {
    setStatus("Select an object to center.", true);
    return;
  }
  rememberHistory();
  item.x = clamp((100 - item.w) / 2, 0, 100 - item.w);
  item.y = clamp((100 - item.h) / 2, 0, 100 - item.h);
  renderCanvas();
  rememberHistory();
  renderEditorDrawer();
}

function moveSelectedLayer(direction) {
  const items = currentItems();
  const index = items.findIndex((item) => item.id === selectedItemId);
  if (index < 0) return;
  const nextIndex = clamp(index + direction, 0, items.length - 1);
  if (nextIndex === index) return;
  rememberHistory();
  [items[index], items[nextIndex]] = [items[nextIndex], items[index]];
  renderCanvas();
  rememberHistory();
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
  const isBanner = currentProduct.category === "banners";
  optionFields.innerHTML = `
    ${isCard ? selectField("roundedCorners", "Rounded Corners", ["No", "Yes"], params.get("roundedCorners") || "No") : ""}
    ${selectField("printedSide", "Printed Side", isBanner ? ["Front Only"] : ["Front and Back", "Front Only"], params.get("printedSide") || (isSticker || isBanner ? "Front Only" : "Front and Back"))}
    ${selectField("paperType", isBanner ? "Material" : isSticker ? "Material" : "Paper Type", isBanner ? [currentProduct.material || "13 oz. Standard Vinyl"] : isSticker ? ["High Gloss White Outdoor Vinyl"] : ["14 pt. Cardstock", "100 lb. Gloss Text"], isBanner ? (currentProduct.material || "13 oz. Standard Vinyl") : params.get("paperType") || (isSticker ? "High Gloss White Outdoor Vinyl" : "14 pt. Cardstock"))}
    ${selectField("coating", isBanner ? "Treatment" : "Coating", isBanner ? [currentProduct.treatment || "None"] : isSticker ? ["High Gloss"] : ["High Gloss", "Matte"], isBanner ? (currentProduct.treatment || "None") : params.get("coating") || "High Gloss")}
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
  currentItems().filter((item) => item.visible !== false).forEach((item) => designCanvas.appendChild(renderCanvasItem(item)));
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
    if (item.flipX) img.classList.add("flipped");
    if (item.cropShape) img.classList.add(`crop-${item.cropShape}`);
    img.style.clipPath = cropClipPath(item.cropShape);
    img.style.filter = imageFilterStyle(item);
    if (item.customCrop && !item.cropDraft) {
      const crop = item.customCrop;
      node.classList.add("has-custom-crop");
      node.style.overflow = "hidden";
      img.style.position = "absolute";
      img.style.maxWidth = "none";
      img.style.width = `${100 / crop.w}%`;
      img.style.height = `${100 / crop.h}%`;
      img.style.left = `${(-crop.x / crop.w) * 100}%`;
      img.style.top = `${(-crop.y / crop.h) * 100}%`;
      img.style.objectFit = "fill";
    }
    node.appendChild(img);
    if (item.cropDraft) node.appendChild(renderCustomCropSelection(item));
    node.style.opacity = String(item.opacity ?? 1);
    node.style.transform = `rotate(${item.rotation || 0}deg)`;
  } else if (item.type === "shape") {
    node.classList.add("print-shape-item", `shape-${item.shape || "rect"}`);
    node.style.background = itemFillStyle(item);
  } else if (item.type === "qr") {
    const qr = document.createElement("span");
    qr.className = "print-qr-art";
    qr.setAttribute("aria-label", "QR placeholder");
    node.appendChild(qr);
  } else {
    if (item.curve) {
      node.appendChild(renderCurvedText(item));
      node.style.transform = `rotate(${item.rotation || 0}deg)`;
      node.addEventListener("click", (event) => {
        event.stopPropagation();
        selectedItemId = item.id;
        renderCanvas();
      });
      return appendObjectHandles(node, item);
    }
    const textContent = document.createElement("span");
    textContent.className = "print-canvas-text-content";
    textContent.textContent = item.text;
    textContent.style.color = item.color;
    textContent.style.fontFamily = item.font;
    textContent.style.fontSize = `${item.size}px`;
    textContent.style.fontWeight = item.bold ? "900" : "700";
    textContent.style.fontStyle = item.italic ? "italic" : "normal";
    textContent.style.webkitTextStroke = item.stroke ? `${item.strokeWidth || 2}px ${item.strokeColor || "#0b8df4"}` : "0";
    textContent.style.textShadow = textEffectShadow(item);
    textContent.style.whiteSpace = item.wrap ? "normal" : "nowrap";
    if (item.fillMode === "gradient") {
      textContent.style.background = itemFillStyle(item);
      textContent.style.webkitBackgroundClip = "text";
      textContent.style.backgroundClip = "text";
      textContent.style.color = "transparent";
    }
    node.appendChild(textContent);
    if (item.id === selectedItemId) {
      textContent.contentEditable = "true";
      textContent.spellcheck = false;
      textContent.setAttribute("aria-label", "Editable text");
      textContent.addEventListener("input", () => {
        item.text = textContent.textContent || "";
        syncSelectedControls();
      });
      textContent.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          textContent.blur();
          event.preventDefault();
        }
        if (event.key === "Enter") event.preventDefault();
      });
    }
  }

  if (item.type !== "text") node.addEventListener("pointerdown", (event) => startDrag(event, item.id));
  node.addEventListener("click", (event) => {
    event.stopPropagation();
    selectedItemId = item.id;
    if (item.type === "text") {
      renderCanvas();
      requestAnimationFrame(() => {
        const editableNode = designCanvas.querySelector(`[data-id="${CSS.escape(item.id)}"] .print-canvas-text-content`);
        editableNode?.focus();
        placeCaretAtEnd(editableNode);
      });
    } else {
      renderCanvas();
    }
  });

  return appendObjectHandles(node, item);
}

function renderCustomCropSelection(item) {
  const crop = item.cropDraft;
  const selection = document.createElement("div");
  selection.className = "print-custom-crop-selection";
  selection.style.left = `${crop.x}%`;
  selection.style.top = `${crop.y}%`;
  selection.style.width = `${crop.w}%`;
  selection.style.height = `${crop.h}%`;
  selection.addEventListener("pointerdown", (event) => startCustomCropDrag(event, item.id));
  ["nw", "ne", "se", "sw"].forEach((direction) => {
    const handle = document.createElement("button");
    handle.type = "button";
    handle.className = `print-crop-handle ${direction}`;
    handle.setAttribute("aria-label", "Resize crop selection");
    handle.addEventListener("pointerdown", (event) => startCustomCropResize(event, item.id, direction));
    selection.appendChild(handle);
  });
  return selection;
}

function appendObjectHandles(node, item) {
  if (item.id === selectedItemId) {
    if (item.type === "text") {
      const moveHandle = document.createElement("button");
      moveHandle.type = "button";
      moveHandle.className = "print-move-handle";
      moveHandle.textContent = "Move";
      moveHandle.contentEditable = "false";
      moveHandle.setAttribute("aria-label", "Move text");
      moveHandle.addEventListener("pointerdown", (event) => startDrag(event, item.id));
      node.appendChild(moveHandle);
    }
    ["nw", "n", "ne", "e", "se", "s", "sw", "w"].forEach((handle) => {
      const grip = document.createElement("button");
      grip.type = "button";
      grip.className = `print-resize-handle ${handle}`;
      grip.dataset.resizeHandle = handle;
      grip.contentEditable = "false";
      grip.setAttribute("aria-label", `Resize ${handle}`);
      grip.addEventListener("pointerdown", (event) => startResize(event, item.id, handle));
      node.appendChild(grip);
    });
  }
  return node;
}

function renderCurvedText(item) {
  const namespace = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(namespace, "svg");
  svg.classList.add("print-curved-text");
  svg.setAttribute("viewBox", "0 0 1000 300");
  svg.setAttribute("aria-label", item.text || "Curved text");
  const path = document.createElementNS(namespace, "path");
  const pathId = `curve-${item.id}`;
  path.setAttribute("id", pathId);
  const amount = Number(item.curveAmount ?? 65);
  const pathValue = item.curveMode === "circle"
    ? "M 500 150 m -130 0 a 130 130 0 1 1 260 0 a 130 130 0 1 1 -260 0"
    : item.curveMode === "banner"
      ? `M 65 158 Q 280 ${158 - amount} 500 158 Q 720 ${158 + amount} 935 158`
      : `M 70 245 Q 500 ${245 - amount * 2.7} 930 245`;
  path.setAttribute("d", pathValue);
  path.setAttribute("fill", "none");
  const text = document.createElementNS(namespace, "text");
  text.setAttribute("fill", item.color || "#061a35");
  text.setAttribute("font-family", item.font || "Arial");
  text.setAttribute("font-size", String(Math.max(44, item.size * 2)));
  text.setAttribute("font-weight", item.bold ? "900" : "700");
  text.setAttribute("font-style", item.italic ? "italic" : "normal");
  if (item.stroke) {
    text.setAttribute("stroke", item.strokeColor || "#0b8df4");
    text.setAttribute("stroke-width", String(item.strokeWidth || 2));
    text.setAttribute("paint-order", "stroke");
  }
  if (item.outline || item.shadow || item.glow) text.style.filter = textEffectSvgFilter(item);
  const textPath = document.createElementNS(namespace, "textPath");
  textPath.setAttribute("href", `#${pathId}`);
  textPath.setAttribute("startOffset", "50%");
  textPath.setAttribute("text-anchor", "middle");
  textPath.textContent = item.text || "Your Text Here";
  text.appendChild(textPath);
  svg.append(path, text);
  return svg;
}

function textEffectShadow(item) {
  const effects = [];
  if (item.outline) {
    const width = Number(item.outlineWidth ?? 2);
    const color = item.outlineColor || "#ffffff";
    effects.push(`${width}px 0 ${color}`, `-${width}px 0 ${color}`, `0 ${width}px ${color}`, `0 -${width}px ${color}`);
  }
  if (item.shadow) {
    const blur = Number(item.shadowBlur ?? 8);
    effects.push(`3px 4px ${blur}px ${item.shadowColor || "#10233d"}`);
  }
  if (item.glow) effects.push(`0 0 ${Number(item.glowBlur ?? 14)}px ${item.glowColor || "#12c5df"}`);
  return effects.length ? effects.join(", ") : "none";
}

function itemFillStyle(item) {
  if (item.fillMode === "gradient") return `linear-gradient(135deg, ${item.fillStart || item.color || "#061a35"}, ${item.fillEnd || "#12c5df"})`;
  return item.color || "#0b8df4";
}

function imageFilterStyle(item) {
  const preset = {
    normal: "",
    grayscale: "grayscale(1)",
    sepia: "sepia(.85)",
    vintage: "sepia(.45) contrast(1.1)",
    cool: "hue-rotate(165deg) saturate(1.2)",
    contrast: "contrast(1.35) saturate(1.1)",
  }[item.filterPreset || "normal"] || "";
  return `brightness(${item.brightness ?? 100}%) saturate(${item.saturation ?? 100}%) blur(${item.blur ?? 0}px) ${preset}`.trim();
}

function cropClipPath(shape) {
  return {
    circle: "circle(50% at 50% 50%)",
    rounded: "inset(0 round 16%)",
    triangle: "polygon(50% 0, 100% 100%, 0 100%)",
    diamond: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)",
    hexagon: "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)",
    star: "polygon(50% 0, 61% 35%, 98% 35%, 68% 56%, 79% 92%, 50% 70%, 21% 92%, 32% 56%, 2% 35%, 39% 35%)",
    heart: "polygon(50% 100%, 0 50%, 0 24%, 14% 5%, 32% 5%, 50% 22%, 68% 5%, 86% 5%, 100% 24%, 100% 50%)",
  }[shape] || "none";
}

function textEffectSvgFilter(item) {
  const filters = [];
  if (item.outline) {
    const width = Number(item.outlineWidth ?? 2);
    const color = item.outlineColor || "#ffffff";
    filters.push(`drop-shadow(${width}px 0 ${color})`, `drop-shadow(-${width}px 0 ${color})`, `drop-shadow(0 ${width}px ${color})`, `drop-shadow(0 -${width}px ${color})`);
  }
  if (item.shadow) filters.push(`drop-shadow(3px 4px ${Number(item.shadowBlur ?? 8)}px ${item.shadowColor || "#10233d"})`);
  if (item.glow) filters.push(`drop-shadow(0 0 ${Number(item.glowBlur ?? 14)}px ${item.glowColor || "#12c5df"})`);
  return filters.join(" ");
}

function placeCaretAtEnd(node) {
  if (!node || !window.getSelection) return;
  const range = document.createRange();
  range.selectNodeContents(node);
  range.collapse(false);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

function startDrag(event, id) {
  event.preventDefault();
  selectedItemId = id;
  const item = findSelectedItem();
  if (!item || item.locked) return;
  rememberHistory();
  const rect = designCanvas.getBoundingClientRect();
  const startX = event.clientX;
  const startY = event.clientY;
  const originalX = item.x;
  const originalY = item.y;

  const move = (moveEvent) => {
    const dx = ((moveEvent.clientX - startX) / rect.width) * 100;
    const dy = ((moveEvent.clientY - startY) / rect.height) * 100;
    item.x = snapPercent(clamp(originalX + dx, 0, 100 - item.w));
    item.y = snapPercent(clamp(originalY + dy, 0, 100 - item.h));
    renderCanvas();
  };

  const stop = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", stop);
    rememberHistory();
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
  if (item.locked) return;
  rememberHistory();
  const rect = designCanvas.getBoundingClientRect();
  const startX = event.clientX;
  const startY = event.clientY;
  const original = {
    x: item.x,
    y: item.y,
    w: item.w,
    h: item.h,
    size: item.size,
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

    item.x = snapPercent(nextX);
    item.y = snapPercent(nextY);
    item.w = snapPercent(nextW);
    item.h = snapPercent(nextH);
    if (item.type === "text") {
      const horizontalScale = nextW / original.w;
      const verticalScale = nextH / original.h;
      const scale = direction === "n" || direction === "s" ? verticalScale : horizontalScale;
      item.size = clamp(Math.round(original.size * scale), 12, 250);
    }
    renderCanvas();
  };

  const stop = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", stop);
    rememberHistory();
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", stop);
}

function snapPercent(value) {
  if (!snapEnabled) return value;
  const snapped = Math.round(value / 2) * 2;
  return Math.abs(snapped - value) < 0.85 ? snapped : value;
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
  if (toolbarFont) {
    toolbarFont.value = isText ? item.font : "Arial";
    toolbarFont.disabled = !isText;
  }
  if (toolbarSize) {
    toolbarSize.value = isText ? item.size : 32;
    toolbarSize.disabled = !isText;
  }
  if (toolbarColor) {
    toolbarColor.value = isText ? item.color : "#061a35";
    toolbarColor.disabled = !isText;
  }
  if (objectToolbar) objectToolbar.classList.toggle("has-text-selection", isText);
  if (toolbarFlip) toolbarFlip.disabled = item?.type !== "image";
  if (toolbarRemoveBg) toolbarRemoveBg.disabled = item?.type !== "image";
  [toolbarBold, toolbarItalic, toolbarCurve, toolbarOutline, toolbarShadow].forEach((button) => {
    if (!button) return;
    const key = button === toolbarBold ? "bold" : button === toolbarItalic ? "italic" : button === toolbarCurve ? "curve" : button === toolbarOutline ? "outline" : "shadow";
    button.disabled = !isText;
    button.classList.toggle("active", Boolean(item?.[key]));
  });
  if (toolbarOpacity) {
    toolbarOpacity.value = String(Math.round((item?.type === "image" ? item.opacity ?? 1 : 1) * 100));
    toolbarOpacity.disabled = item?.type !== "image";
  }
  if (toolbarRotate) {
    toolbarRotate.value = String(item?.type === "image" ? item.rotation || 0 : 0);
    toolbarRotate.disabled = item?.type !== "image";
  }
}

function updateSelectedText(source = "sidebar") {
  const item = findSelectedItem();
  if (!item || item.type !== "text") return;
  const isToolbar = source === "toolbar";
  item.text = selectedText?.value || item.text || "";
  item.font = (isToolbar ? toolbarFont?.value : selectedFont?.value) || "Arial";
  item.size = Number((isToolbar ? toolbarSize?.value : selectedSize?.value) || 32);
  item.color = (isToolbar ? toolbarColor?.value : selectedColor?.value) || "#061a35";
  renderCanvas();
}

function flipSelectedItem() {
  const item = findSelectedItem();
  if (!item || item.type !== "image") {
    setStatus("Select an image to flip it.", true);
    return;
  }
  item.flipX = !item.flipX;
  renderCanvas();
  setStatus("Image flipped horizontally.");
}

function toggleTextStyle(style) {
  const item = findSelectedItem();
  if (!item || item.type !== "text") {
    setStatus("Select text to use this text tool.", true);
    return;
  }
  rememberHistory();
  item[style] = !item[style];
  renderCanvas();
  rememberHistory();
}

function setTextCurve(mode) {
  const item = findSelectedItem();
  if (!item || item.type !== "text") {
    setStatus("Select text to shape it.", true);
    return;
  }
  rememberHistory();
  item.curveMode = mode;
  item.curve = mode === "arc" || mode === "circle" || mode === "banner";
  item.wrap = mode === "wrap";
  item.curveAmount ??= 65;
  renderCanvas();
  renderEditorDrawer();
  rememberHistory();
}

function updateObjectEffectControl(control) {
  const item = findSelectedItem();
  const key = control.dataset.effectKey;
  if (!item || !key) return;
  const rangeValue = control.type === "range";
  item[key] = rangeValue ? Number(control.value) : control.value;
  if (key === "filterPreset") item[key] = control.value;
  const output = control.parentElement?.querySelector("output");
  if (output) {
    const suffix = key === "curveAmount" || key === "brightness" || key === "saturation" ? "%" : " px";
    output.textContent = `${control.value}${rangeValue ? suffix : ""}`;
  }
  renderCanvas();
}

function setSelectedFillMode(mode) {
  const item = findSelectedItem();
  if (!item || item.type === "image") return;
  rememberHistory();
  item.fillMode = mode;
  item.fillStart ||= item.color || "#061a35";
  item.fillEnd ||= "#12c5df";
  renderCanvas();
  renderEditorDrawer();
  rememberHistory();
}

function setSelectedCrop(shape) {
  const item = findSelectedItem();
  if (!item || item.type !== "image") {
    setStatus("Select a photo to crop it.", true);
    return;
  }
  rememberHistory();
  item.cropShape = shape || "";
  renderCanvas();
  renderEditorDrawer();
  rememberHistory();
}

function startCustomCrop() {
  const item = findSelectedItem();
  if (!item || item.type !== "image") {
    setStatus("Select a photo to create a custom crop.", true);
    return;
  }
  const saved = item.customCrop || { x: 8, y: 8, w: 84, h: 84 };
  item.cropDraft = { ...saved };
  renderCanvas();
  renderEditorDrawer();
  setStatus("Drag the crop window or its corners, then choose Apply crop.");
}

function applyCustomCrop() {
  const item = findSelectedItem();
  if (!item?.cropDraft) return;
  rememberHistory();
  item.customCrop = { ...item.cropDraft };
  delete item.cropDraft;
  renderCanvas();
  renderEditorDrawer();
  rememberHistory();
  setStatus("Custom crop applied. You can reset it any time.");
}

function cancelCustomCrop() {
  const item = findSelectedItem();
  if (!item?.cropDraft) return;
  delete item.cropDraft;
  renderCanvas();
  renderEditorDrawer();
}

function resetCustomCrop() {
  const item = findSelectedItem();
  if (!item?.customCrop) return;
  rememberHistory();
  delete item.customCrop;
  delete item.cropDraft;
  renderCanvas();
  renderEditorDrawer();
  rememberHistory();
}

function startCustomCropDrag(event, id) {
  event.preventDefault();
  event.stopPropagation();
  const item = currentItems().find((entry) => entry.id === id);
  const crop = item?.cropDraft;
  if (!item || !crop) return;
  const node = designCanvas.querySelector(`[data-id="${CSS.escape(id)}"]`);
  const rect = node?.getBoundingClientRect();
  if (!rect) return;
  const startX = event.clientX;
  const startY = event.clientY;
  const original = { ...crop };
  const move = (moveEvent) => {
    const dx = ((moveEvent.clientX - startX) / rect.width) * 100;
    const dy = ((moveEvent.clientY - startY) / rect.height) * 100;
    item.cropDraft.x = clamp(original.x + dx, 0, 100 - original.w);
    item.cropDraft.y = clamp(original.y + dy, 0, 100 - original.h);
    renderCanvas();
  };
  const stop = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", stop);
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", stop);
}

function startCustomCropResize(event, id, direction) {
  event.preventDefault();
  event.stopPropagation();
  const item = currentItems().find((entry) => entry.id === id);
  const crop = item?.cropDraft;
  if (!item || !crop) return;
  const node = designCanvas.querySelector(`[data-id="${CSS.escape(id)}"]`);
  const rect = node?.getBoundingClientRect();
  if (!rect) return;
  const startX = event.clientX;
  const startY = event.clientY;
  const original = { ...crop };
  const minSize = 12;
  const move = (moveEvent) => {
    const dx = ((moveEvent.clientX - startX) / rect.width) * 100;
    const dy = ((moveEvent.clientY - startY) / rect.height) * 100;
    const right = original.x + original.w;
    const bottom = original.y + original.h;
    let x = original.x;
    let y = original.y;
    let w = original.w;
    let h = original.h;
    if (direction.includes("e")) w = clamp(original.w + dx, minSize, 100 - original.x);
    if (direction.includes("s")) h = clamp(original.h + dy, minSize, 100 - original.y);
    if (direction.includes("w")) { x = clamp(original.x + dx, 0, right - minSize); w = right - x; }
    if (direction.includes("n")) { y = clamp(original.y + dy, 0, bottom - minSize); h = bottom - y; }
    item.cropDraft = { x, y, w, h };
    renderCanvas();
  };
  const stop = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", stop);
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", stop);
}

function toggleSelectedLock() {
  const item = findSelectedItem();
  if (!item) return;
  item.locked = !item.locked;
  renderCanvas();
  renderEditorDrawer();
  setStatus(item.locked ? "Layer locked." : "Layer unlocked.");
}

async function openEyedropper() {
  if (typeof window.EyeDropper !== "function") {
    setStatus("Your browser does not support the screen eyedropper. Use Sample image instead.", true);
    return;
  }
  try {
    const picker = new window.EyeDropper();
    const result = await picker.open();
    applySampledColor(result.sRGBHex);
  } catch (error) {
    if (error?.name !== "AbortError") setStatus("Could not pick that color.", true);
  }
}

async function sampleSelectedImageColor() {
  const item = findSelectedItem();
  const source = item?.type === "image" ? item : currentItems().find((entry) => entry.type === "image");
  if (!source) {
    setStatus("Add or select an image first, then use Sample image.", true);
    return;
  }
  try {
    const image = await loadImage(source.src);
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(image, 0, 0, 1, 1);
    const [red, green, blue] = context.getImageData(0, 0, 1, 1).data;
    applySampledColor(`#${[red, green, blue].map((value) => value.toString(16).padStart(2, "0")).join("")}`);
  } catch (error) {
    setStatus("Could not sample this image color.", true);
  }
}

function applySampledColor(color) {
  const item = findSelectedItem();
  if (!item || item.type === "image") {
    setStatus(`Sampled ${color}. Select text or a shape to apply it.`, true);
    return;
  }
  item.color = color;
  item.fillStart = color;
  if (toolbarColor) toolbarColor.value = color;
  if (selectedColor) selectedColor.value = color;
  renderCanvas();
  renderEditorDrawer();
  setStatus(`Applied sampled color ${color}.`);
}

function updateSelectedImageEffects() {
  const item = findSelectedItem();
  if (!item || item.type !== "image") return;
  rememberHistory();
  item.opacity = Number(toolbarOpacity?.value || 100) / 100;
  item.rotation = Number(toolbarRotate?.value || 0);
  renderCanvas();
  rememberHistory();
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
  rememberHistory();
  designState[currentSide] = currentItems().filter((item) => item.id !== selectedItemId);
  selectedItemId = null;
  renderCanvas();
}

function runPreflight() {
  const warnings = [];
  const items = currentItems();
  const isCard = currentProduct.category === "cards";
  const safe = isCard ? { x: 6.6667, y: 11.1111, width: 86.6666, height: 77.7778 } : { x: 8, y: 8, width: 84, height: 84 };
  const safeRight = safe.x + safe.width;
  const safeBottom = safe.y + safe.height;

  if (!items.length) warnings.push("Add at least one design object.");
  items.forEach((item) => {
    if (item.type === "text" && !String(item.text || "").trim()) warnings.push("Remove or fill an empty text object.");
    if (item.x < safe.x || item.y < safe.y || item.x + item.w > safeRight || item.y + item.h > safeBottom) {
      warnings.push(`${layerName(item)} extends outside the safe zone.`);
    }
  });

  const message = warnings.length
    ? `Review before printing: ${[...new Set(warnings)].slice(0, 3).join(" ")}`
    : "Print ready: all objects are inside the safe zone.";
  if (preflightResult) preflightResult.textContent = message;
  preflightResult?.classList.toggle("has-warning", Boolean(warnings.length));
  setStatus(message, Boolean(warnings.length));
  return warnings;
}

function findSelectedItem() {
  return currentItems().find((item) => item.id === selectedItemId) || null;
}

function updateSummary() {
  const price = selectedPrice();
  const memberPrice = selectedMemberPrice();
  const savings = Math.max(0, price - memberPrice);
  if (summaryProduct) summaryProduct.textContent = currentProduct.label;
  if (summarySize) summarySize.textContent = currentProduct.sizeLabel;
  if (summaryQuantity) summaryQuantity.textContent = currentQuantity;
  if (summarySides) summarySides.textContent = document.querySelector("#printedSide")?.value || "Front and Back";
  if (summaryTotal) summaryTotal.textContent = money(price);
  if (summaryMemberPrice) summaryMemberPrice.textContent = money(memberPrice);
  if (summaryRegularPrice) summaryRegularPrice.textContent = money(price);
  if (summarySavings) summarySavings.textContent = money(savings);
  updateCompactSelection(price);
}

function updateCompactSelection(price) {
  const summary = `${currentProduct.label} · ${currentProduct.sizeLabel} · ${currentQuantity} · ${money(price)}`;
  if (selectionCompact) selectionCompact.textContent = summary;
  if (studioOrder) studioOrder.textContent = summary;
  if (changeSelectionLink) {
    const groupName = { cards: "Business Cards", flyers: "Flyers", stickers: "Stickers" }[currentProduct.category] || "Business Cards";
    changeSelectionLink.href = `printing.html#${encodeURIComponent(groupName)}`;
    if (studioBack) studioBack.href = changeSelectionLink.href;
  }
}

function selectedPrice() {
  return Number(currentProduct.prices.find(([quantity]) => String(quantity) === String(currentQuantity))?.[1] || currentProduct.prices[0][1]);
}

function selectedMemberPrice() {
  const prices = currentProduct.memberPrices || currentProduct.prices;
  return Number(prices.find(([quantity]) => String(quantity) === String(currentQuantity))?.[1] || prices[0]?.[1] || selectedPrice());
}

async function saveCurrentSidePng() {
  const dataUrl = await createPreview(currentSide);
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `${currentProduct.id}-${currentSide}.png`;
  link.click();
  setStatus("Design PNG saved.");
}

async function savePrintReadyPng() {
  const warnings = runPreflight();
  const maxSize = Math.max(currentProduct.width, currentProduct.height) * 300;
  const dataUrl = await createPreview(currentSide, { maxSize, includeGuides: false });
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `${currentProduct.id}-${currentSide}-print-300dpi.png`;
  link.click();
  setStatus(warnings.length ? "300 DPI export saved. Review the bleed and safe-zone warnings before production." : "Print-ready 300 DPI PNG saved. Bleed and safe zone passed.", Boolean(warnings.length));
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
      memberPrice: selectedMemberPrice(),
      regularPrice: selectedPrice(),
      membershipSavings: Math.max(0, selectedPrice() - selectedMemberPrice()),
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
    material: currentProduct.material || "",
    treatment: currentProduct.treatment || "",
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
    options.material ? `Material: ${options.material}` : "",
    options.treatment ? `Treatment: ${options.treatment}` : "",
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
  if (options.includeGuides ?? guidesVisible) {
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
    if (item.visible === false) continue;
    const x = (item.x / 100) * canvas.width;
    const y = (item.y / 100) * canvas.height;
    const w = (item.w / 100) * canvas.width;
    const h = (item.h / 100) * canvas.height;
    if (item.type === "image") {
      const image = await loadImage(item.src);
      ctx.save();
      ctx.globalAlpha = item.opacity ?? 1;
      ctx.filter = imageFilterStyle(item);
      if (item.rotation) {
        ctx.translate(x + w / 2, y + h / 2);
        ctx.rotate((Number(item.rotation) * Math.PI) / 180);
        ctx.translate(-(x + w / 2), -(y + h / 2));
      }
      clipPreviewImage(ctx, item.cropShape, x, y, w, h);
      const crop = item.customCrop;
      const sourceX = crop ? (image.naturalWidth || image.width) * (crop.x / 100) : 0;
      const sourceY = crop ? (image.naturalHeight || image.height) * (crop.y / 100) : 0;
      const sourceW = crop ? (image.naturalWidth || image.width) * (crop.w / 100) : (image.naturalWidth || image.width);
      const sourceH = crop ? (image.naturalHeight || image.height) * (crop.h / 100) : (image.naturalHeight || image.height);
      if (item.flipX) {
        ctx.translate(x + w, y);
        ctx.scale(-1, 1);
        ctx.drawImage(image, sourceX, sourceY, sourceW, sourceH, 0, 0, w, h);
      } else {
        ctx.drawImage(image, sourceX, sourceY, sourceW, sourceH, x, y, w, h);
      }
      ctx.restore();
    } else if (item.type === "shape") {
      const fill = item.fillMode === "gradient"
        ? (() => { const gradient = ctx.createLinearGradient(x, y, x + w, y + h); gradient.addColorStop(0, item.fillStart || item.color || "#0b8df4"); gradient.addColorStop(1, item.fillEnd || "#12c5df"); return gradient; })()
        : item.color || "#0b8df4";
      drawPreviewShape(ctx, item.shape, x, y, w, h, fill);
    } else if (item.type === "qr") {
      drawQrPlaceholder(ctx, x, y, w, h);
    } else {
      ctx.fillStyle = item.fillMode === "gradient"
        ? (() => { const gradient = ctx.createLinearGradient(x, y, x + w, y + h); gradient.addColorStop(0, item.fillStart || item.color || "#061a35"); gradient.addColorStop(1, item.fillEnd || "#12c5df"); return gradient; })()
        : item.color || "#061a35";
      ctx.font = `${item.italic ? "italic " : ""}${item.bold ? "900" : "700"} ${Math.max(18, item.size * 2)}px ${item.font || "Arial"}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (item.curve) {
        drawCurvedCanvasText(ctx, item, x, y, w, h);
      } else {
        if (item.shadow || item.glow) {
          ctx.shadowColor = item.glow ? (item.glowColor || "#12c5df") : (item.shadowColor || "#10233d");
          ctx.shadowBlur = item.glow ? Number(item.glowBlur ?? 14) : Number(item.shadowBlur ?? 8);
          ctx.shadowOffsetX = item.size * 0.08;
          ctx.shadowOffsetY = item.size * 0.1;
        }
        if (item.outline || item.stroke) {
          ctx.lineWidth = item.stroke ? Number(item.strokeWidth ?? 2) * 2 : Number(item.outlineWidth ?? 2) * 2;
          ctx.strokeStyle = item.stroke ? (item.strokeColor || "#0b8df4") : (item.outlineColor || "#ffffff");
          wrapCanvasText(ctx, item.text || "", x + w / 2, y + h / 2, w * 0.92, Math.max(24, item.size * 2.2), true);
        }
        wrapCanvasText(ctx, item.text || "", x + w / 2, y + h / 2, w * 0.92, Math.max(24, item.size * 2.2));
        ctx.shadowColor = "transparent";
      }
    }
  }
  return canvas.toDataURL(options.format || "image/png", options.quality || 0.92);
}

function drawPreviewShape(context, shape, x, y, width, height, color) {
  context.fillStyle = color;
  context.strokeStyle = color;
  if (shape === "line") {
    context.lineWidth = Math.max(5, height);
    context.beginPath();
    context.moveTo(x, y + height / 2);
    context.lineTo(x + width, y + height / 2);
    context.stroke();
    return;
  }
  if (shape === "circle") {
    context.beginPath();
    context.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
    context.fill();
    return;
  }
  if (shape === "frame") {
    context.lineWidth = Math.max(4, Math.min(width, height) * 0.1);
    context.strokeRect(x, y, width, height);
    return;
  }
  const points = {
    triangle: [[0.5, 0], [1, 1], [0, 1]],
    diamond: [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]],
    arrow: [[0, 0.35], [0.58, 0.35], [0.58, 0], [1, 0.5], [0.58, 1], [0.58, 0.65], [0, 0.65]],
    hexagon: [[0.25, 0], [0.75, 0], [1, 0.5], [0.75, 1], [0.25, 1], [0, 0.5]],
    heart: [[0.5, 1], [0, 0.48], [0, 0.24], [0.13, 0.05], [0.32, 0.04], [0.5, 0.22], [0.68, 0.04], [0.87, 0.05], [1, 0.24], [1, 0.48]],
    star: [[0.5, 0], [0.61, 0.35], [0.98, 0.35], [0.68, 0.56], [0.79, 0.92], [0.5, 0.7], [0.21, 0.92], [0.32, 0.56], [0.02, 0.35], [0.39, 0.35]],
  }[shape];
  if (!points) {
    context.fillRect(x, y, width, height);
    return;
  }
  context.beginPath();
  points.forEach(([px, py], index) => {
    const pointX = x + px * width;
    const pointY = y + py * height;
    if (index === 0) context.moveTo(pointX, pointY);
    else context.lineTo(pointX, pointY);
  });
  context.closePath();
  context.fill();
}

function clipPreviewImage(context, shape, x, y, width, height) {
  if (!shape) return;
  context.beginPath();
  if (shape === "circle") {
    context.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
  } else if (shape === "square") {
    const side = Math.min(width, height);
    context.rect(x + (width - side) / 2, y + (height - side) / 2, side, side);
  } else if (shape === "rounded") {
    context.roundRect(x, y, width, height, Math.min(width, height) * 0.16);
  } else {
    const points = {
      triangle: [[0.5, 0], [1, 1], [0, 1]],
      diamond: [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]],
      hexagon: [[0.25, 0], [0.75, 0], [1, 0.5], [0.75, 1], [0.25, 1], [0, 0.5]],
      star: [[0.5, 0], [0.61, 0.35], [0.98, 0.35], [0.68, 0.56], [0.79, 0.92], [0.5, 0.7], [0.21, 0.92], [0.32, 0.56], [0.02, 0.35], [0.39, 0.35]],
      heart: [[0.5, 1], [0, 0.48], [0, 0.24], [0.13, 0.05], [0.32, 0.04], [0.5, 0.22], [0.68, 0.04], [0.87, 0.05], [1, 0.24], [1, 0.48]],
    }[shape];
    if (!points) return;
    points.forEach(([px, py], index) => {
      const pointX = x + px * width;
      const pointY = y + py * height;
      if (index === 0) context.moveTo(pointX, pointY);
      else context.lineTo(pointX, pointY);
    });
    context.closePath();
  }
  context.clip();
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

function drawCurvedCanvasText(ctx, item, x, y, width, height) {
  const letters = Array.from(item.text || "Your Text Here");
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const amount = Number(item.curveAmount ?? 65);
  const mode = item.curveMode || "arc";
  ctx.save();
  letters.forEach((letter, index) => {
    const progress = index / Math.max(1, letters.length - 1);
    ctx.save();
    if (mode === "circle") {
      const radius = Math.min(width, height) * 0.34;
      const angle = -Math.PI * 0.86 + progress * Math.PI * 1.72;
      ctx.translate(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
      ctx.rotate(angle + Math.PI / 2);
    } else if (mode === "banner") {
      const horizontal = x + width * (0.1 + progress * 0.8);
      const wave = Math.sin((progress - 0.5) * Math.PI * 2) * amount * 0.42;
      ctx.translate(horizontal, centerY + wave);
      ctx.rotate(Math.cos((progress - 0.5) * Math.PI * 2) * amount * 0.007);
    } else {
      const radius = Math.max(width * 0.55, height * 0.8);
      const start = Math.PI * 1.18;
      const end = Math.PI * (1.18 + 0.64 + amount * 0.002);
      const angle = start + (end - start) * progress;
      const arcCenterY = y + height * (1.1 + (100 - amount) * 0.002);
      ctx.translate(centerX + Math.cos(angle) * radius, arcCenterY + Math.sin(angle) * radius);
      ctx.rotate(angle + Math.PI / 2);
    }
    ctx.fillText(letter, 0, 0);
    ctx.restore();
  });
  ctx.restore();
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, stroke = false) {
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
  lines.forEach((row, index) => stroke ? ctx.strokeText(row, x, startY + index * lineHeight) : ctx.fillText(row, x, startY + index * lineHeight));
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
