import test from "node:test";
import assert from "node:assert/strict";
import { isValidSupabaseUrl, normalizeSupabaseSecret, normalizeSupabaseUrl } from "../lib/supabase-url.js";
import { normalizeOrderNumber, trackingFailureOutcome, trackingLookupOutcome } from "../api/track-order.js";

test("empty tracking input is rejected before querying Supabase", () => {
  assert.equal(normalizeOrderNumber(""), "");
  assert.equal(normalizeOrderNumber("< >"), "");
});

test("missing tracking record returns controlled 404", () => {
  assert.deepEqual(trackingLookupOutcome("NP-MISSING", true, []), { status: 404, body: { error: "Order not found" } });
});

test("existing tracking record returns 200", () => {
  const result = trackingLookupOutcome("NP-FOUND", true, [{ title: "NP-FOUND - Print", status: "new", customer_name: "Test Customer", amount: 10, quantity: 1 }]);
  assert.equal(result.status, 200);
  assert.equal(result.body.order.orderNumber, "NP-FOUND");
});

test("infrastructure failures are controlled and do not leak details", () => {
  const result = trackingLookupOutcome("NP-ERROR", false, { message: "sensitive upstream detail" });
  assert.equal(result.status, 500);
  assert.equal(result.body.error, "Tracking service is temporarily unavailable.");
  assert.doesNotMatch(result.body.error, /sensitive|upstream/i);
  assert.deepEqual(trackingFailureOutcome(), result);
});

test("Supabase URL normalization removes accidental angle brackets", () => {
  const wrapped = "<https://example.supabase.co/>";
  assert.equal(normalizeSupabaseUrl(wrapped), "https://example.supabase.co");
  assert.equal(isValidSupabaseUrl(wrapped), true);
  assert.equal(isValidSupabaseUrl("<not-a-url>"), false);
});

test("Supabase secret normalization removes accidental angle brackets", () => {
  assert.equal(normalizeSupabaseSecret("<sb_secret_example>"), "sb_secret_example");
});
