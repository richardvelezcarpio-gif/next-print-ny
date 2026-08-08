import test from "node:test";
import assert from "node:assert/strict";
import { buildReturnUrl, publicBaseUrl } from "../lib/paypal.js";

function request(host) {
  return { headers: { host } };
}

test("localhost return URLs always use HTTP", () => {
  assert.equal(publicBaseUrl(request("localhost:4173"), { VERCEL_URL: "preview.vercel.app" }), "http://localhost:4173");
  assert.match(buildReturnUrl(request("localhost:4173"), "/payments.html", { checkout: "paypal-return" }), /^http:\/\/localhost:4173\//);
  assert.match(buildReturnUrl(request("localhost:4173"), "/payments.html", { checkout: "cancelled" }), /^http:\/\/localhost:4173\//);
});

test("127.0.0.1 return URLs always use HTTP", () => {
  assert.equal(publicBaseUrl(request("127.0.0.1:4173"), { NEXT_PUBLIC_SITE_URL: "https://www.nextprintnyc.com" }), "http://127.0.0.1:4173");
});

test("production domain uses HTTPS", () => {
  assert.equal(publicBaseUrl(request("www.nextprintnyc.com"), { NEXT_PUBLIC_SITE_URL: "https://www.nextprintnyc.com" }), "https://www.nextprintnyc.com");
});

test("Vercel preview domain uses HTTPS", () => {
  assert.equal(publicBaseUrl(request("preview-123.vercel.app"), { VERCEL_URL: "preview-123.vercel.app" }), "https://preview-123.vercel.app");
});
