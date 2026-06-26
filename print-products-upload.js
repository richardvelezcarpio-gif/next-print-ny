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
const dueDate = toDateInputValue(daysFromNow(5));

if (!product || !quantity || !Number.isFinite(totalPrice) || totalPrice <= 0) {
  showMissingState();
} else {
  renderUploadOrder();
}

fileInput?.addEventListener("change", updateFileLabel);

continueButton?.addEventListener("click", async () => {
  if (!product) return;
  continueButton.disabled = true;
  setStatus("Preparing checkout...");

  try {
    const files = await readSelectedFiles(fileInput?.files || []);
    const uploadedLabel = files.length
      ? `${files.length} uploaded file${files.length === 1 ? "" : "s"}`
      : "No file uploaded yet";
    const fullDetails = [
      detailsText,
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
      product,
      label: product,
      sizeLabel: detailsMap.Size || inferSize(product),
      quantity,
      totalPrice,
      memberPrice: Number.isFinite(memberPrice) && memberPrice > 0 ? memberPrice : null,
      regularPrice: totalPrice,
      membershipSavings: Number.isFinite(memberPrice) && memberPrice > 0 ? Math.max(0, totalPrice - memberPrice) : null,
      sides: buildSidesLabel(detailsMap),
      options: {
        frontSide: detailsMap["Front Side"] || "",
        backSide: detailsMap["Back Side"] || "",
        paperType: detailsMap["Paper Stock"] || detailsMap["Paper Type"] || "",
        coating: detailsMap.Coating || "",
        folding: detailsMap["Folding Option"] || "",
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
  const displayPrice = Number.isFinite(memberPrice) && memberPrice > 0 ? memberPrice : totalPrice;
  const savings = Number.isFinite(memberPrice) && memberPrice > 0 ? Math.max(0, totalPrice - memberPrice) : 0;
  const assetSet = productAssets(product);

  if (workspace) workspace.hidden = false;
  if (missingPanel) missingPanel.hidden = true;
  if (titleNode) titleNode.textContent = product;
  if (crumbNode) crumbNode.textContent = product;
  if (optionsTitleNode) optionsTitleNode.textContent = `Customize your ${product}`;
  if (optionCountNode) optionCountNode.textContent = detailsMap.Size ? "Selected size option" : "Selected print product";
  if (subtitleNode) subtitleNode.textContent = productCopy(product);
  if (orderDateNode) orderDateNode.value = orderDate;
  if (dueDateNode) dueDateNode.value = dueDate;
  if (priceNode) priceNode.value = money(totalPrice);
  if (totalNode) totalNode.textContent = money(displayPrice);
  if (retailPriceNode) retailPriceNode.textContent = money(totalPrice);
  if (memberPriceNode) memberPriceNode.textContent = money(displayPrice);
  if (savingsNode) savingsNode.textContent = money(savings);
  if (tableRetailNode) tableRetailNode.textContent = money(totalPrice);
  if (tableMemberNode) tableMemberNode.textContent = money(displayPrice);
  if (imageNode) imageNode.src = assetSet[0];
  if (thumbOneNode) thumbOneNode.src = assetSet[0];
  if (thumbTwoNode) thumbTwoNode.src = assetSet[1];
  if (thumbThreeNode) thumbThreeNode.src = assetSet[2];
  if (designOnlineLink) designOnlineLink.href = designOnlineHref();

  if (detailsNode) {
    const rows = detailsText
      ? parseDetailRows(detailsText)
      : [
        ["Product", product],
        ["Size", inferSize(product)],
        ["Quantity", quantity],
      ];
    rows.push(
      ["Regular customer price", money(totalPrice)],
      Number.isFinite(memberPrice) && memberPrice > 0 ? ["Member price", money(memberPrice)] : null,
      Number.isFinite(memberPrice) && memberPrice > 0 ? ["Membership savings", money(Math.max(0, totalPrice - memberPrice))] : null,
    );

    detailsNode.innerHTML = rows
      .filter((row) => row?.[1])
      .map(([label, value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`)
      .join("");
  }

  updateFileLabel();
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
  const nextParams = new URLSearchParams(window.location.search);
  if (!nextParams.get("product") && product) nextParams.set("product", product);
  if (!nextParams.get("quantity") && quantity) nextParams.set("quantity", quantity);
  if (!nextParams.get("price") && priceText) nextParams.set("price", priceText);
  if (!nextParams.get("memberPrice") && memberPriceText) nextParams.set("memberPrice", memberPriceText);
  if (!nextParams.get("details") && detailsText) nextParams.set("details", detailsText);
  nextParams.delete("directUpload");
  return `print-products-editor.html?${nextParams.toString()}`;
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
