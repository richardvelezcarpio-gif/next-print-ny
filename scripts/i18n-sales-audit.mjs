import fs from "node:fs";

const source = fs.readFileSync(new URL("../script.js", import.meta.url), "utf8");
const requiredSpanish = ["Printing Made Simple.", "Signs & Banners", "Shop by Category", "Choose Product", "Continue to Checkout", "Finish your print order", "Customer information", "Pay with PayPal"];
const missing = requiredSpanish.filter((text) => !source.includes(`"${text}":`));
const esStart = source.indexOf("  es: {");
const enStart = source.indexOf("  en: {");
const enEnd = source.indexOf("\n};\n\nlet currentLanguage");
const keys = (part) => [...part.matchAll(/^\s*"([^"]+)":/gm)].map((match) => match[1]);
const es = new Set(keys(source.slice(esStart, enStart)));
const en = new Set(keys(source.slice(enStart, enEnd)));
const parity = [...es].filter((key) => !en.has(key)).concat([...en].filter((key) => !es.has(key)));
if (missing.length || parity.length) {
  console.error(JSON.stringify({ missing, parity }, null, 2));
  process.exit(1);
}
console.log("Sales-flow i18n audit passed: base EN/ES keys have parity and priority presentation entries exist.");
