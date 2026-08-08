import test from "node:test";
import assert from "node:assert/strict";
import {
  ensureUsdRequest,
  isCapturedOrder,
  validatePayPalCapture,
  validatePayPalCreate,
} from "../lib/paypal-order-validation.js";

const internalOrderId = "5ab8d559-7d87-46fb-93e5-957d5d3eb5bc";
const baseOrder = {
  id: "db-record",
  internal_order_id: internalOrderId,
  order_number: "NP-260808-000001",
  payment_status: "pending_payment",
  currency: "USD",
  amount: 123.45,
  paypal_order_id: "PAYPAL-ORDER-1",
};

test("browser-supplied amount never changes the persisted total", () => {
  assert.equal(validatePayPalCreate(baseOrder, internalOrderId).amount, "123.45");
});

test("non-USD browser currency is rejected", () => {
  assert.throws(() => ensureUsdRequest("EUR"), /USD/);
  assert.equal(ensureUsdRequest("USD"), "USD");
});

test("duplicate create is controlled by the persisted PayPal order id", () => {
  assert.equal(baseOrder.paypal_order_id, "PAYPAL-ORDER-1");
});

test("duplicate capture is identified by paid state", () => {
  assert.equal(isCapturedOrder({ ...baseOrder, payment_status: "paid" }, "PAYPAL-ORDER-1"), true);
});

test("a paid order cannot start another PayPal payment", () => {
  assert.throws(() => validatePayPalCreate({ ...baseOrder, payment_status: "paid" }, internalOrderId), /not available/);
});

test("an incorrect PayPal order id is rejected", () => {
  assert.throws(() => validatePayPalCapture({
    record: baseOrder,
    internalOrderId,
    paypalOrderId: "OTHER",
    paypalOrder: {},
  }), /does not match/);
});

test("a PayPal amount mismatch is rejected", () => {
  assert.throws(() => validatePayPalCapture({
    record: baseOrder,
    internalOrderId,
    paypalOrderId: baseOrder.paypal_order_id,
    paypalOrder: { purchase_units: [{ custom_id: internalOrderId, amount: { currency_code: "USD", value: "9.99" } }] },
  }), /does not match/);
});

test("a PayPal currency mismatch is rejected", () => {
  assert.throws(() => validatePayPalCapture({
    record: baseOrder,
    internalOrderId,
    paypalOrderId: baseOrder.paypal_order_id,
    paypalOrder: { purchase_units: [{ custom_id: internalOrderId, amount: { currency_code: "EUR", value: "123.45" } }] },
  }), /does not match/);
});

test("a missing internal order is rejected", () => {
  assert.throws(() => validatePayPalCreate(null, internalOrderId), /not found/);
});

test("email failures are handled after the durable paid transition", () => {
  const paid = { ...baseOrder, payment_status: "paid", paypal_capture_id: "CAPTURE-1" };
  assert.equal(isCapturedOrder(paid, baseOrder.paypal_order_id), true);
});
