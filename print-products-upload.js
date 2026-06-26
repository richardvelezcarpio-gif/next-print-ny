const printSelectionKey = "nextPrintProductSelection";
const printFilesKey = "nextPrintProductFiles";
const printDetailsKey = "nextPrintProductDetails";

const params = new URLSearchParams(window.location.search);
const product = clean(params.get("product"));
const quantity = clean(params.get("quantity"));
const priceText = clean(params.get("price"));
const memberPriceText = clean(params.get("memberPrice"));
const detailsText = cleanMultiline(params.get("details"));
const detailsMap = parseDetails(detailsText);
const totalPrice = parseMoney(priceText);
const memberPrice = parseMoney(memberPriceText);
const priceCatalog = buildPriceCatalog();
let selectedProduct = findCatalogProduct(product, detailsMap);
let currentDetailsMap = { ...detailsMap };
let currentQuantity = Number(quantity) || selectedProduct?.defaultQuantity || 1;
let currentRetailPrice = totalPrice;
let currentMemberPrice = memberPrice;
let currentSavings = 0;

const workspace = document.querySelector("#printUploadWorkspace");
const missingPanel = document.querySelector("#printUploadMissing");
const titleNode = document.querySelector("#printUploadTitle");
const crumbNode = document.querySelector("#printUploadCrumb");
const subtitleNode = document.querySelector("#printUploadSubtitle");
const optionCountNode = document.querySelector("#printUploadOptionCount");
const optionsTitleNode = document.querySelector("#printUploadOptionsTitle");
const detailsNode = document.querySelector("#printUploadDetails");
const orderDateNode = document.querySelector("#printUploadOrderDate");
const dueDateNode = document.querySelector("#printUploadDueDate");
const priceNode = document.querySelector("#printUploadPrice");
const totalNode = document.querySelector("#printUploadTotal");
const retailPriceNode = document.querySelector("#printUploadRetailPrice");
const memberPriceNode = document.querySelector("#printUploadMemberPrice");
const savingsNode = document.querySelector("#printUploadSavings");
const tableRetailNode = document.querySelector("#printUploadTableRetail");
const tableMemberNode = document.querySelector("#printUploadTableMember");
const deliveryNoteNode = document.querySelector("#printUploadDeliveryNote");
const imageNode = document.querySelector("#printUploadImage");
const thumbOneNode = document.querySelector("#printUploadThumbOne");
const thumbTwoNode = document.querySelector("#printUploadThumbTwo");
const thumbThreeNode = document.querySelector("#printUploadThumbThree");
const designOnlineLink = document.querySelector("#printUploadDesignOnline");
const fileInput = document.querySelector("#printUploadFiles");
const fileText = document.querySelector("#printUploadFileText");
const continueButton = document.querySelector("#printUploadContinue");
const statusNode = document.querySelector("#printUploadStatus");

const orderDate = toDateInputValue(new Date());
const dueDate = toDateInputValue(daysFromNow(3));

if (!product || (!selectedProduct && (!Number.isFinite(totalPrice) || totalPrice <= 0))) {
  showMissingState();
} else {
  renderUploadOrder();
}

fileInput?.addEventListener("change", updateFileLabel);

continueButton?.addEventListener("click", async () => {
  if (!product && !selectedProduct) return;
  continueButton.disabled = true;
  setStatus("Preparing checkout...");

  try {
    const files = await readSelectedFiles(fileInput?.files || []);
    const uploadedLabel = files.length
      ? `${files.length} uploaded file${files.length === 1 ? "" : "s"}`
      : "No file uploaded yet";
    const fullDetails = [
      serializeCurrentDetails(),
      "",
      `Upload status: ${uploadedLabel}`,
      `Order date: ${orderDate}`,
      `Delivery date: ${dueDate}`,
    ]
      .filter(Boolean)
      .join("\n")
      .trim();

    sessionStorage.setItem(printSelectionKey, JSON.stringify({
      source: "print-products-upload",
      uploadOnly: true,
      product: selectedProduct?.name || product,
      label: selectedProduct?.name || product,
      sizeLabel: currentDetailsMap.Size || inferSize(selectedProduct?.name || product),
      quantity: String(currentQuantity),
      totalPrice: currentRetailPrice,
      memberPrice: Number.isFinite(currentMemberPrice) && currentMemberPrice > 0 ? currentMemberPrice : null,
      regularPrice: currentRetailPrice,
      membershipSavings: currentSavings,
      sides: buildSidesLabel(currentDetailsMap),
      options: {
        frontSide: currentDetailsMap["Front Side"] || "",
        backSide: currentDetailsMap["Back Side"] || "",
        paperType: currentDetailsMap["Paper Stock"] || currentDetailsMap["Paper Type"] || "",
        coating: currentDetailsMap.Coating || "",
        folding: currentDetailsMap["Folding Option"] || "",
      },
    }));
    sessionStorage.setItem(printFilesKey, JSON.stringify(files));
    sessionStorage.setItem(printDetailsKey, fullDetails);
    window.location.href = "print-products-checkout.html";
  } catch (error) {
    setStatus(error.message || "Could not prepare checkout. Please try again.", true);
    continueButton.disabled = false;
  }
});

function renderUploadOrder() {
  refreshCurrentPricing();
  const displayProduct = selectedProduct?.name || product;
  const displayPrice = currentMemberPrice || currentRetailPrice;
  const assetSet = productAssets(displayProduct);

  if (workspace) workspace.hidden = false;
  if (missingPanel) missingPanel.hidden = true;
  if (titleNode) titleNode.textContent = displayProduct;
  if (crumbNode) crumbNode.textContent = displayProduct;
  if (optionsTitleNode) optionsTitleNode.textContent = `Customize your ${displayProduct}`;
  if (optionCountNode) optionCountNode.textContent = selectedProduct?.sizeOptions?.length > 1 ? `${selectedProduct.sizeOptions.length} size options` : "Selected size option";
  if (subtitleNode) subtitleNode.textContent = productCopy(displayProduct);
  if (orderDateNode) orderDateNode.value = orderDate;
  if (dueDateNode) dueDateNode.value = dueDate;
  if (priceNode) priceNode.value = money(currentRetailPrice);
  if (totalNode) totalNode.textContent = money(displayPrice);
  if (retailPriceNode) retailPriceNode.textContent = money(currentRetailPrice);
  if (memberPriceNode) memberPriceNode.textContent = money(displayPrice);
  if (savingsNode) savingsNode.textContent = money(currentSavings);
  if (tableRetailNode) tableRetailNode.textContent = money(currentRetailPrice);
  if (tableMemberNode) tableMemberNode.textContent = money(displayPrice);
  if (deliveryNoteNode) deliveryNoteNode.textContent = deliveryNote(displayProduct);
  if (imageNode) imageNode.src = assetSet[0];
  if (thumbOneNode) thumbOneNode.src = assetSet[0];
  if (thumbTwoNode) thumbTwoNode.src = assetSet[1];
  if (thumbThreeNode) thumbThreeNode.src = assetSet[2];
  if (designOnlineLink) designOnlineLink.href = designOnlineHref();

  if (detailsNode) {
    renderOptionsForm();
  }

  updateFileLabel();
}

function renderOptionsForm() {
  const displayProduct = selectedProduct?.name || product;
  const rows = optionRowsFor(displayProduct);
  detailsNode.innerHTML = rows
    .filter((row) => row?.value || row?.options)
    .map((row) => optionRowHtml(row))
    .join("");

  detailsNode.querySelectorAll("select").forEach((select) => {
    select.addEventListener("change", handleOptionChange);
  });
}

function optionRowsFor(displayProduct) {
  const rows = [
    {
      key: "Product",
      label: "Product",
      value: displayProduct,
      options: selectedProduct ? priceCatalog.map((item) => item.name) : null,
    },
    {
      key: "Size",
      label: "Size",
      value: currentDetailsMap.Size || selectedProduct?.sizeOptions?.[0] || inferSize(displayProduct),
      options: selectedProduct?.sizeOptions,
    },
    {
      key: "Quantity",
      label: "Quantity",
      value: String(currentQuantity),
      options: selectedProduct?.quantities?.map(String),
    },
    { key: "Rounded Corners", label: "Rounded Corners", value: currentDetailsMap["Rounded Corners"] || "No", options: selectedProduct?.roundedCorners },
    { key: "Printed Side", label: "Printed Side", value: currentDetailsMap["Printed Side"] || currentDetailsMap.Sides || currentDetailsMap["Front Side"] || "Front and Back", options: selectedProduct?.printedSides },
    { key: "Paper Stock", label: "Paper Stock", value: currentDetailsMap["Paper Stock"] || currentDetailsMap["Paper Type"] || selectedProduct?.paperStock, options: selectedProduct?.paperStocks },
    { key: "Coating", label: "Coating", value: currentDetailsMap.Coating || selectedProduct?.coating, options: selectedProduct?.coatings },
    { key: "Folding Option", label: "Folding Option", value: currentDetailsMap["Folding Option"], options: selectedProduct?.foldingOptions },
    { key: "Regular customer price", label: "Regular Customer Price", value: money(currentRetailPrice) },
    { key: "Member price", label: "Member Price", value: money(currentMemberPrice || currentRetailPrice) },
    { key: "Membership savings", label: "Membership Savings", value: money(currentSavings) },
  ];
  return rows.filter((row) => row.value || row.options?.length);
}

function optionRowHtml(row) {
  const value = row.value || row.options?.[0] || "";
  const options = normalizeOptions(row.options);
  if (options.length > 1) {
    return `
      <label class="print-upload-option-row">
        <span>${escapeHtml(row.label)}</span>
        <select data-option-key="${escapeHtml(row.key)}">
          ${options.map((option) => `<option value="${escapeHtml(option)}"${String(option) === String(value) ? " selected" : ""}>${escapeHtml(option)}</option>`).join("")}
        </select>
      </label>
    `;
  }
  return `<div><span>${escapeHtml(row.label)}</span><strong>${escapeHtml(value)}</strong></div>`;
}

function handleOptionChange(event) {
  const key = event.target.dataset.optionKey;
  const value = event.target.value;
  if (key === "Product") {
    selectedProduct = findCatalogProduct(value, {}) || selectedProduct;
    currentDetailsMap = defaultDetailsFor(selectedProduct);
    currentQuantity = selectedProduct?.defaultQuantity || selectedProduct?.quantities?.[0] || 1;
  } else if (key === "Quantity") {
    currentQuantity = Number(value) || currentQuantity;
  } else {
    currentDetailsMap[key] = value;
    if (key === "Size" && selectedProduct) {
      selectedProduct = findCatalogProduct(selectedProduct.name, { ...currentDetailsMap, Size: value }) || selectedProduct;
      currentDetailsMap = { ...defaultDetailsFor(selectedProduct), ...currentDetailsMap, Size: value };
    }
  }
  renderUploadOrder();
}

function refreshCurrentPricing() {
  const catalogRetail = selectedProduct?.prices?.get(Number(currentQuantity));
  const catalogMember = selectedProduct?.memberPrices?.get(Number(currentQuantity));
  currentRetailPrice = catalogRetail || totalPrice || currentRetailPrice || 0;
  currentMemberPrice = catalogMember || memberPrice || currentRetailPrice;
  currentSavings = Math.max(0, currentRetailPrice - currentMemberPrice);
  currentDetailsMap = { ...defaultDetailsFor(selectedProduct), ...currentDetailsMap };
}

function showMissingState() {
  if (workspace) workspace.hidden = true;
  if (missingPanel) missingPanel.hidden = false;
}

function updateFileLabel() {
  if (!fileText || !fileInput) return;
  const files = Array.from(fileInput.files || []);
  if (!files.length) {
    fileText.textContent = "No file selected";
    return;
  }
  fileText.textContent = files.length === 1
    ? files[0].name
    : `${files.length} files selected`;
}

async function readSelectedFiles(fileList) {
  const files = Array.from(fileList || []);
  if (files.length > 6) {
    throw new Error("Please upload 6 files or fewer.");
  }

  const maxFileSize = 6 * 1024 * 1024;
  const maxTotalSize = 12 * 1024 * 1024;
  const totalSize = files.reduce((total, file) => total + file.size, 0);
  if (totalSize > maxTotalSize) {
    throw new Error("Files are too large together. Please keep the upload under 12MB.");
  }

  return Promise.all(files.map(async (file) => {
    if (file.size > maxFileSize) {
      throw new Error(`${file.name} is too large. Please keep each file under 6MB.`);
    }

    return {
      name: cleanFileName(file.name),
      content: await fileToBase64(file),
    };
  }));
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || "").split(",").pop() || "");
    reader.onerror = () => reject(new Error(`Could not read ${file.name}.`));
    reader.readAsDataURL(file);
  });
}

function parseDetails(value) {
  const map = {};
  parseDetailRows(value).forEach(([label, detailValue]) => {
    map[label] = detailValue;
  });
  return map;
}

function parseDetailRows(value) {
  return String(value || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separator = line.indexOf(":");
      if (separator === -1) return ["Info", line];
      return [
        line.slice(0, separator).trim(),
        line.slice(separator + 1).trim(),
      ];
    });
}

function buildSidesLabel(map) {
  const front = map["Front Side"];
  const back = map["Back Side"];
  if (front && back) return `Front: ${front} / Back: ${back}`;
  return map["Printed Side"] || "Front and Back";
}

function inferSize(name) {
  const menu = String(name || "").match(/Menus\s+(.+)/i);
  if (menu) return `${menu[1].replace(/x/i, " x ")} Take Out Menus`;
  const hanger = String(name || "").match(/Door Hangers\s+(.+)/i);
  if (hanger) return hanger[1].replace(/x/i, " x ");
  return "Custom size";
}

function productCopy(name) {
  const value = String(name || "").toLowerCase();
  if (value.includes("business")) return "Make the first impression feel professional with sharp cards, premium finish, and fast local service.";
  if (value.includes("flyer")) return "Promote events, specials, and services with full color flyers that are ready to share.";
  if (value.includes("sticker")) return "Custom stickers and labels for packaging, branding, giveaways, and daily business needs.";
  if (value.includes("menu")) return "Clean, full color menus for restaurants, takeout, cafes, and food service promotions.";
  if (value.includes("door")) return "Door hangers designed to get noticed in neighborhoods, buildings, and local campaigns.";
  if (value.includes("poster")) return "Vibrant posters for events, storefronts, promotions, announcements, and displays.";
  if (value.includes("invoice")) return "Professional invoice and form printing for organized business paperwork.";
  if (value.includes("brochure")) return "Folded brochures with clear information, strong presentation, and premium color.";
  if (value.includes("banner") || value.includes("vinyl")) return "Large format printing for storefronts, events, promotions, and brand visibility.";
  if (value.includes("yard")) return "Durable yard signs for campaigns, real estate, events, and local advertising.";
  return "Review your print order, compare member savings, and choose design online or file upload.";
}

function productAssets(name) {
  const value = String(name || "").toLowerCase();
  if (value.includes("flyer")) return ["assets/printing-premium-flyers.png", "assets/catalog-flyers.png", "assets/home-product-flyers.png"];
  if (value.includes("sticker")) return ["assets/printing-premium-stickers.png", "assets/catalog-stickers.png", "assets/home-product-stickers.png"];
  if (value.includes("menu")) return ["assets/printing-premium-menus.png", "assets/catalog-menus.png", "assets/printing-menus-ai.webp"];
  if (value.includes("door")) return ["assets/printing-premium-doorhangers.png", "assets/catalog-door-hangers.png", "assets/home-product-doorhangers.png"];
  if (value.includes("poster")) return ["assets/printing-premium-posters.png", "assets/home-product-posters.png", "assets/printing-premium-posters.png"];
  if (value.includes("invoice")) return ["assets/printing-premium-invoices.png", "assets/home-product-invoices.png", "assets/printing-premium-invoices.png"];
  if (value.includes("brochure")) return ["assets/printing-premium-brochures.png", "assets/printing-premium-brochures.png", "assets/catalog-flyers.png"];
  if (value.includes("retractable")) return ["assets/printing-premium-retractables.png", "assets/catalog-retractable-banners.png", "assets/signandbanners.png"];
  if (value.includes("banner") || value.includes("vinyl")) return ["assets/printing-premium-banners.png", "assets/catalog-banners.png", "assets/printing-banners-ai.webp"];
  if (value.includes("yard")) return ["assets/catalog-yard-signs.png", "assets/printing-premium-banners.png", "assets/signandbanners.png"];
  if (value.includes("t-shirt") || value.includes("shirt")) return ["assets/printing-premium-tshirts.png", "assets/customtshirts.png", "assets/home-card-shirts.png"];
  return ["assets/printing-premium-businesscards.png", "assets/catalog-business-cards.png", "assets/home-product-businesscards.png"];
}

function designOnlineHref() {
  const nextParams = new URLSearchParams();
  nextParams.set("product", selectedProduct?.name || product);
  nextParams.set("quantity", String(currentQuantity));
  nextParams.set("price", money(currentRetailPrice).replace("$", ""));
  nextParams.set("memberPrice", money(currentMemberPrice || currentRetailPrice).replace("$", ""));
  nextParams.set("details", serializeCurrentDetails());
  nextParams.delete("directUpload");
  return `print-products-editor.html?${nextParams.toString()}`;
}

function serializeCurrentDetails() {
  return optionRowsFor(selectedProduct?.name || product)
    .filter((row) => !/price|savings/i.test(row.key))
    .map((row) => `${row.key}: ${row.value || ""}`)
    .join("\n");
}

function defaultDetailsFor(item) {
  if (!item) return {};
  return {
    Size: item.size,
    "Rounded Corners": item.roundedCorners?.[0] || "",
    "Printed Side": item.printedSides?.[0] || "Front and Back",
    "Paper Stock": item.paperStock || item.paperStocks?.[0] || "",
    Coating: item.coating || item.coatings?.[0] || "",
    "Folding Option": item.foldingOptions?.[0] || "",
  };
}

function normalizeOptions(options) {
  return [...new Set((options || []).filter(Boolean).map(String))];
}

function deliveryNote(name) {
  return memberFreeShippingEligible(name)
    ? "Ready in 3 business days. Free pickup in Brooklyn. Member free shipping on eligible products in the East USA."
    : "Ready in 3 business days. Free pickup in Brooklyn. Shipping is calculated by size and delivery area.";
}

function memberFreeShippingEligible(name) {
  const value = String(name || "").toLowerCase();
  return [
    "business",
    "flyer",
    "sticker",
    "menu",
    "door",
    "poster",
    "invoice",
    "brochure",
    "bookmark",
  ].some((keyword) => value.includes(keyword));
}

function findCatalogProduct(name, map = {}) {
  const value = String(name || "").toLowerCase();
  const wantedSize = String(map.Size || "").toLowerCase();
  if (!wantedSize) {
    const exact = priceCatalog.find((item) => item.name.toLowerCase() === value);
    if (exact) return exact;
  }
  return priceCatalog.find((item) => {
    const nameMatches = item.aliases.some((alias) => value.includes(alias));
    if (!nameMatches) return false;
    if (!wantedSize) return true;
    return item.size.toLowerCase() === wantedSize || item.aliases.some((alias) => wantedSize.includes(alias));
  }) || priceCatalog.find((item) => item.name.toLowerCase() === value);
}

function buildPriceCatalog() {
  const baseRows = [
    ["Business Cards", "Business Cards", '3.75 x 2.25 with bleed', [[100, 35, 25.75], [250, 45, 29.87], [500, 55, 31.93], [1000, 70, 42.28], [2500, 110, 85.5], [5000, 155, 116.4], [10000, 303, 254.4]], ["business cards"], "14 pt. Cardstock", "High Gloss"],
    ["Flyers 4x6", "Flyers", "4 x 6", [[100, 41, 28.84], [250, 65, 50.43], [500, 75, 58.67], [1000, 85, 69.02], [2500, 170, 149.35], [5000, 210, 178.22], [10000, 340, 278.81]], ["flyers", "4x6"], "14 pt. Cardstock", "High Gloss"],
    ["Flyers 5x7", "Flyers", "5 x 7", [[100, 75, 59.7], [250, 104, 87.51], [500, 126, 102.95], [1000, 149, 118.46], [2500, 285, 227.62], [5000, 371, 295.28], [10000, 523, 413.02]], ["flyers", "5x7"], "14 pt. Cardstock", "High Gloss"],
    ["Flyers 8.5x11", "Flyers", "8.5 x 11", [[100, 160, 130.21], [250, 200, 147.74], [500, 280, 164.29], [1000, 370, 220.1], [2500, 550, 335.76], [5000, 596, 380.03], [10000, 890, 665.32]], ["flyers", "8.5x11"], "14 pt. Cardstock", "High Gloss"],
    ['Stickers round 2"', "Stickers", 'Round 2"', [[100, 52, 42.25], [250, 85, 74.12], [500, 90, 62.79], [1000, 96, 72.06], [2500, 145, 113.31], [5000, 226, 184.32], [10000, 399, 322.01]], ["stickers", "round 2"], "Premium Sticker", "Full Color"],
    ['Stickers round 2.5"', "Stickers", 'Round 2.5"', [[100, 62, 52.49], [250, 123, 102.95], [500, 128, 107.08], [1000, 138, 115.37], [2500, 204, 166.84], [5000, 314, 255.43], [10000, 533, 425.39]], ["stickers", "round 2.5"], "Premium Sticker", "Full Color"],
    ["Stickers 2x3.5", "Stickers", "2 x 3.5", [[100, 38, 27.78], [250, 56, 46.31], [500, 62, 48.37], [1000, 65, 52.49], [2500, 110, 80.3], [5000, 153, 125.64], [10000, 267, 216.27]], ["stickers", "2x3.5"], "Premium Sticker", "Full Color"],
    ["Stickers 2x2", "Stickers", "2 x 2", [[100, 28, 23.66], [250, 38, 31.93], [500, 48, 32.97], [1000, 56, 37.05], [2500, 70, 57.64], [5000, 109, 90.6], [10000, 191, 156.51]], ["stickers", "2x2"], "Premium Sticker", "Full Color"],
    ["Stickers 4x4", "Stickers", "4 x 4", [[100, 65, 53.52], [250, 115, 94.72], [500, 123, 99.88], [1000, 133, 109.86], [2500, 207, 169.9], [5000, 322, 261.56], [10000, 542, 435.61]], ["stickers", "4x4"], "Premium Sticker", "Full Color"],
    ["Menus 8.5x11", "Menus", "8.5 x 11", [[100, 160, 130.21], [250, 200, 147.74], [500, 280, 164.29], [1000, 370, 220.1], [2500, 550, 335.76], [5000, 596, 380.03], [10000, 890, 665.32]], ["menus", "8.5x11"], "14 pt. Cardstock", "High Gloss"],
    ["Menus 11x17", "Menus", "11 x 17", [[100, 333, 268.39], [250, 453, 363.72], [500, 606, 485.55], [1000, 696, 556.97], [2500, 904, 720.19], [5000, 1096, 871.89], [10000, 1622, 1290.45]], ["menus", "11x17"], "14 pt. Cardstock", "High Gloss"],
    ["Door Hangers 4x11", "Door Hangers", "4 x 11", [[100, 133, 110.9], [250, 174, 144.36], [500, 201, 166.35], [1000, 223, 184.16], [2500, 451, 367.43], [5000, 508, 412.48], [10000, 1007, 813.31]], ["door hangers", "4x11"], "14 pt. Cardstock", "High Gloss"],
    ["Door Hangers 3.5x8.5", "Door Hangers", "3.5 x 8.5", [[100, 127, 83.64], [250, 166, 107.73], [500, 192, 123.4], [1000, 213, 134.96], [2500, 428, 269.86], [5000, 483, 301.98], [10000, 958, 594.31]], ["door hangers", "3.5x8.5"], "14 pt. Cardstock", "High Gloss"],
    ["Poster 11x17", "Posters", "11 x 17", [[10, 55, 47.57], [20, 99, 83.11], [30, 141, 118.68], [40, 184, 154.2], [50, 227, 189.75]], ["poster", "11x17"], "Premium Poster", "Full Color"],
    ["Poster 13x19", "Posters", "13 x 19", [[10, 67, 59], [20, 124, 106], [30, 183, 152.97], [40, 240, 199.95], [50, 298, 247]], ["poster", "13x19"], "Premium Poster", "Full Color"],
    ["Brochures 8.5x11", "Brochures", "8.5 x 11", [[100, 140, 109.29], [250, 192, 158.89], [500, 221, 183.34], [1000, 290, 235.81], [2500, 459, 373.85], [5000, 521, 424.23], [10000, 963, 788.9]], ["brochures", "8.5x11"], "Gloss Text", "Full Color"],
    ["Brochures 11x17", "Brochures", "11 x 17", [[100, 320, 248], [250, 435, 330], [500, 545, 400], [1000, 612, 475], [2500, 993, 795], [5000, 1205, 958], [10000, 1783, 1410]], ["brochures", "11x17"], "Gloss Text", "Full Color"],
    ["Bookmarks 2x6", "Bookmarks", "2 x 6", [[100, 41, 37], [250, 56, 54.6], [500, 68, 62.84], [1000, 75, 69.02], [2500, 120, 105.7], [5000, 147, 131], [10000, 295, 245]], ["bookmarks", "2x6"], "14 pt. Cardstock", "High Gloss"],
  ];

  const groupedSizes = baseRows.reduce((groups, row) => {
    const group = row[1];
    groups[group] = groups[group] || [];
    groups[group].push(row[2]);
    return groups;
  }, {});

  return baseRows.map(([name, group, size, tiers, aliases, paperStock, coating]) => ({
    name,
    group,
    size,
    aliases: [...aliases, name.toLowerCase(), group.toLowerCase()],
    sizeOptions: groupedSizes[group],
    quantities: tiers.map(([qty]) => qty),
    prices: new Map(tiers.map(([qty, retail]) => [qty, retail])),
    memberPrices: new Map(tiers.map(([qty, , member]) => [qty, member])),
    defaultQuantity: tiers[0][0],
    roundedCorners: ["No", "Yes"],
    printedSides: ["Front and Back", "Front Only"],
    paperStock,
    paperStocks: paperStock ? [paperStock] : [],
    coating,
    coatings: coating ? [coating, "Matte", "No Coating"] : [],
    foldingOptions: group === "Brochures" ? ["Tri-fold", "Half-fold", "No Fold"] : [],
  }));
}

function daysFromNow(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

function toDateInputValue(date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function parseMoney(value) {
  const amount = Number(String(value || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

function money(value) {
  const amount = Number(value || 0);
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function clean(value) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, 180);
}

function cleanMultiline(value) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n")
    .slice(0, 1500);
}

function cleanFileName(value) {
  return String(value || "upload-file")
    .replace(/[<>:"/\\|?*]+/g, "-")
    .trim()
    .slice(0, 120) || "upload-file";
}

function setStatus(message, isError = false) {
  if (!statusNode) return;
  statusNode.textContent = message;
  statusNode.classList.toggle("error", isError);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
