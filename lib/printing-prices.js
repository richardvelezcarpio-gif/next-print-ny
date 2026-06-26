const printingPrices = {
  "Business Cards": { 100: 35, 250: 45, 500: 55, 1000: 70, 2500: 110, 5000: 155, 10000: 303 },
  "Flyers 4x6": { 100: 41, 250: 65, 500: 75, 1000: 85, 2500: 170, 5000: 210, 10000: 340 },
  "Flyers 5x7": { 100: 75, 250: 104, 500: 126, 1000: 149, 2500: 285, 5000: 371, 10000: 523 },
  "Flyers 8.5x11": { 100: 160, 250: 200, 500: 280, 1000: 370, 2500: 550, 5000: 596, 10000: 890 },
  'Stickers round 2"': { 100: 52, 250: 85, 500: 90, 1000: 96, 2500: 145, 5000: 226, 10000: 399 },
  'Stickers round 2.5"': { 100: 62, 250: 123, 500: 128, 1000: 138, 2500: 204, 5000: 314, 10000: 533 },
  "Stickers 2x3.5": { 100: 38, 250: 56, 500: 62, 1000: 65, 2500: 110, 5000: 153, 10000: 267 },
  "Stickers 2x2": { 100: 28, 250: 38, 500: 48, 1000: 56, 2500: 70, 5000: 109, 10000: 191 },
  "Stickers 4x4": { 100: 65, 250: 115, 500: 123, 1000: 133, 2500: 207, 5000: 322, 10000: 542 },
  "Menus 8.5x11": { 100: 160, 250: 200, 500: 280, 1000: 370, 2500: 550, 5000: 596, 10000: 890 },
  "Menus 11x17": { 100: 333, 250: 453, 500: 606, 1000: 696, 2500: 904, 5000: 1096, 10000: 1622 },
  "Banner 2x4": { 1: 88 },
  "Banner 2x6": { 1: 120 },
  "Banner 3x6": { 1: 180 },
  "Banner 2x8": { 1: 221.33 },
  "Banner 2x10": { 1: 267.33 },
  "Door Hangers 4x11": { 100: 133, 250: 174, 500: 201, 1000: 223, 2500: 451, 5000: 508, 10000: 1007 },
  "Door Hangers 3.5x8.5": { 100: 127, 250: 166, 500: 192, 1000: 213, 2500: 428, 5000: 483, 10000: 958 },
  "Retractable Banner": { 1: 180, 2: 360, 3: 540, 4: 720, 5: 900, 6: 1080, 7: 1260, 8: 1440, 9: 1620, 10: 1800 },
  "Poster 11x17": { 10: 55, 20: 99, 30: 141, 40: 184, 50: 227 },
  "Poster 13x19": { 10: 67, 20: 124, 30: 183, 40: 240, 50: 298 },
  "INVOICES 8.5X11 2 PARTS": { 5: 93, 10: 124, 20: 185, 30: 305 },
  "INVOICES 8.5X5.5 2 PARTS": { 5: 62, 10: 79, 20: 112, 30: 184, 40: 219, 50: 285 },
  "Brochures 8.5x11": { 100: 140, 250: 192, 500: 221, 1000: 290, 2500: 459, 5000: 521, 10000: 963 },
  "Brochures 11x17": { 100: 320, 250: 435, 500: 545, 1000: 612, 2500: 993, 5000: 1205, 10000: 1783 },
  "Bookmarks 2x6": { 100: 41, 250: 56, 500: 68, 1000: 75, 2500: 120, 5000: 147, 10000: 295 },
};

const memberPrintingPrices = {
  "Business Cards": { 100: 25.75, 250: 29.87, 500: 31.93, 1000: 42.28, 2500: 85.5, 5000: 116.4, 10000: 254.4 },
  "Flyers 4x6": { 100: 28.84, 250: 50.43, 500: 58.67, 1000: 69.02, 2500: 149.35, 5000: 178.22, 10000: 278.81 },
  "Flyers 5x7": { 100: 59.7, 250: 87.51, 500: 102.95, 1000: 118.46, 2500: 227.62, 5000: 295.28, 10000: 413.02 },
  "Flyers 8.5x11": { 100: 130.21, 250: 147.74, 500: 164.29, 1000: 220.1, 2500: 335.76, 5000: 380.03, 10000: 665.32 },
  'Stickers round 2"': { 100: 42.25, 250: 74.12, 500: 62.79, 1000: 72.06, 2500: 113.31, 5000: 184.32, 10000: 322.01 },
  'Stickers round 2.5"': { 100: 52.49, 250: 102.95, 500: 107.08, 1000: 115.37, 2500: 166.84, 5000: 255.43, 10000: 425.39 },
  "Stickers 2x3.5": { 100: 27.78, 250: 46.31, 500: 48.37, 1000: 52.49, 2500: 80.3, 5000: 125.64, 10000: 216.27 },
  "Stickers 2x2": { 100: 23.66, 250: 31.93, 500: 32.97, 1000: 37.05, 2500: 57.64, 5000: 90.6, 10000: 156.51 },
  "Stickers 4x4": { 100: 53.52, 250: 94.72, 500: 99.88, 1000: 109.86, 2500: 169.9, 5000: 261.56, 10000: 435.61 },
  "Menus 8.5x11": { 100: 130.21, 250: 147.74, 500: 164.29, 1000: 220.1, 2500: 335.76, 5000: 380.03, 10000: 665.32 },
  "Menus 11x17": { 100: 268.39, 250: 363.72, 500: 485.55, 1000: 556.97, 2500: 720.19, 5000: 871.89, 10000: 1290.45 },
  "Door Hangers 4x11": { 100: 110.9, 250: 144.36, 500: 166.35, 1000: 184.16, 2500: 367.43, 5000: 412.48, 10000: 813.31 },
  "Door Hangers 3.5x8.5": { 100: 83.64, 250: 107.73, 500: 123.4, 1000: 134.96, 2500: 269.86, 5000: 301.98, 10000: 594.31 },
  "Poster 11x17": { 10: 47.57, 20: 83.11, 30: 118.68, 40: 154.2, 50: 189.75 },
  "Poster 13x19": { 10: 59, 20: 106, 30: 152.97, 40: 199.95, 50: 247 },
  "INVOICES 8.5X11 2 PARTS": { 5: 77.22, 10: 100.91, 20: 148.17, 30: 237.87 },
  "INVOICES 8.5X5.5 2 PARTS": { 5: 51.49, 10: 65.88, 20: 91.64, 30: 147.24, 40: 172.99, 50: 222.42 },
  "Brochures 8.5x11": { 100: 109.29, 250: 158.89, 500: 183.34, 1000: 235.81, 2500: 373.85, 5000: 424.23, 10000: 788.9 },
  "Brochures 11x17": { 100: 248, 250: 330, 500: 400, 1000: 475, 2500: 795, 5000: 958, 10000: 1410 },
  "Bookmarks 2x6": { 100: 37, 250: 54.6, 500: 62.84, 1000: 69.02, 2500: 105.7, 5000: 131, 10000: 245 },
};

export function catalogPriceFor(product, quantity, details = "") {
  if (String(product || "") === "Gildan G500 T-Shirt Mix") {
    return catalogTshirtMixPrice(details);
  }

  const shirtMatch = String(product || "").match(/^Gildan G500 T-Shirt \((S|M|L|XL|2XL|3XL|4XL|5XL)\)$/);
  if (shirtMatch) {
    const count = Number(quantity);
    if (!Number.isInteger(count) || count < 1) return "";
    const unitPrice = ["2XL", "3XL", "4XL", "5XL"].includes(shirtMatch[1]) ? 18 : 14;
    return `$${(count * unitPrice).toFixed(2)}`;
  }

  if (String(product || "") === "Yard Sign") {
    const count = Number(quantity);
    if (!Number.isInteger(count) || count < 1) return "";
    const unitPrice = count <= 25 ? 40 : count <= 50 ? 35 : 30;
    return `$${(count * unitPrice).toFixed(2)}`;
  }

  const amount = printingPrices[String(product || "")]?.[Number(quantity)];
  return Number.isFinite(amount) ? `$${amount.toFixed(2)}` : "";
}

export function memberCatalogPriceFor(product, quantity, details = "") {
  if (String(product || "") === "Gildan G500 T-Shirt Mix") {
    return catalogTshirtMixMemberPrice(details);
  }

  const shirtMatch = String(product || "").match(/^Gildan G500 T-Shirt \((S|M|L|XL|2XL|3XL|4XL|5XL)\)$/);
  if (shirtMatch) {
    const count = Number(quantity);
    if (!Number.isInteger(count) || count < 1) return "";
    return `$${(count * 15).toFixed(2)}`;
  }

  const productName = String(product || "");
  if (productName === "Yard Sign") return catalogPriceFor(product, quantity, details);
  const amount = memberPrintingPrices[productName]?.[Number(quantity)];
  return Number.isFinite(amount) ? `$${amount.toFixed(2)}` : "";
}

function catalogTshirtMixMemberPrice(details) {
  const linePattern = /^-\s+.+?\s\/\s(S|M|L|XL|2XL|3XL|4XL|5XL):\s+(\d+)\s+x\s+\$(14|18)\.00\s+=\s+\$([0-9,]+\.\d{2})$/gm;
  let match;
  let totalQuantity = 0;

  while ((match = linePattern.exec(String(details || "")))) {
    const quantity = Number(match[2]);
    if (!Number.isInteger(quantity) || quantity < 1) return "";
    totalQuantity += quantity;
  }

  return totalQuantity > 0 ? `$${(totalQuantity * 15).toFixed(2)}` : "";
}

function catalogTshirtMixPrice(details) {
  const linePattern = /^-\s+.+?\s\/\s(S|M|L|XL|2XL|3XL|4XL|5XL):\s+(\d+)\s+x\s+\$(14|18)\.00\s+=\s+\$([0-9,]+\.\d{2})$/gm;
  let match;
  let total = 0;
  let lines = 0;

  while ((match = linePattern.exec(String(details || "")))) {
    const size = match[1];
    const quantity = Number(match[2]);
    const unit = Number(match[3]);
    const lineTotal = Number(match[4].replace(/,/g, ""));
    const expectedUnit = ["2XL", "3XL", "4XL", "5XL"].includes(size) ? 18 : 14;
    const expectedLine = quantity * expectedUnit;

    if (!Number.isInteger(quantity) || quantity < 1 || unit !== expectedUnit || Math.abs(lineTotal - expectedLine) > 0.01) {
      return "";
    }

    total += expectedLine;
    lines += 1;
  }

  return lines > 0 ? `$${total.toFixed(2)}` : "";
}
