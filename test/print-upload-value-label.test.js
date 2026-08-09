import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const uploadSource = readFileSync(new URL("../print-products-upload.js", import.meta.url), "utf8");
const i18nSource = readFileSync(new URL("../script.js", import.meta.url), "utf8");

test("print-upload options keep their internal value while rendering a translated label", () => {
  assert.match(uploadSource, /<option value="\$\{escapeHtml\(option\)\}"/);
  assert.match(uploadSource, />\$\{escapeHtml\(labelFor\(option\)\)\}<\/option>/);
  assert.match(i18nSource, /"Matte": "Mate"/);
});

test("print-upload checkout payload continues to use the unmodified order state", () => {
  assert.match(uploadSource, /product: selectedProduct\?\.name \|\| product/);
  assert.match(uploadSource, /quantity: String\(currentQuantity\)/);
  assert.match(uploadSource, /paperType: currentDetailsMap\["Paper Stock"\] \|\| currentDetailsMap\["Paper Type"\] \|\| ""/);
  assert.match(uploadSource, /coating: currentDetailsMap\.Coating \|\| ""/);
});

test("language rendering is presentation-only and does not mutate option state", () => {
  assert.match(uploadSource, /function labelFor\(value\)/);
  assert.match(uploadSource, /window\.NextPrintI18n\?\.t\(String\(value\)\)/);
  assert.match(uploadSource, /const value = event\.target\.value;/);
  assert.match(uploadSource, /currentDetailsMap\[key\] = value;/);
});
