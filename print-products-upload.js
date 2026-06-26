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
const detailsNode = document.querySelector("#printUploadDetails");
const orderDateNode = document.querySelector("#printUploadOrderDate");
const dueDateNode = document.querySelector("#printUploadDueDate");
const priceNode = document.querySelector("#printUploadPrice");
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
  if (workspace) workspace.hidden = false;
  if (missingPanel) missingPanel.hidden = true;
  if (titleNode) titleNode.textContent = product;
  if (orderDateNode) orderDateNode.value = orderDate;
  if (dueDateNode) dueDateNode.value = dueDate;
  if (priceNode) priceNode.value = money(totalPrice);

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
