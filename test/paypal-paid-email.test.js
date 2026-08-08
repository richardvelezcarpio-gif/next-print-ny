import test from "node:test";
import assert from "node:assert/strict";
import {
  buildAdminNotification,
  buildCustomerReceipt,
  canSendPaidNotifications,
  emailNotificationsConfigured,
  EMAIL_ATTEMPT_MARKER,
  paidEmailWasAttempted,
} from "../lib/paypal-paid-email.js";

const paidOrder = {
  order_number: "NP-EMAIL-001",
  payment_status: "paid",
  paypal_capture_id: "CAPTURE-AUDIT-001",
  customer_name: "Customer Test",
  customer_email: "customer@example.test",
  customer_phone: "2125550101",
  description: "Product: Business Cards\nQuantity: 250",
  subtotal: 45,
  shipping_amount: 10.2,
  tax_amount: 3.99,
  amount: 59.19,
  delivery_address: { street: "1510 Gates Ave", city: "Brooklyn", state: "NY", zip: "11237", country: "US" },
};

test("customer receipt includes the paid order details without a PayPal capture id", () => {
  const receipt = buildCustomerReceipt(paidOrder, "https://www.nextprintnyc.com");
  for (const expected of ["Next Print NY", "Order Number", "Payment Status:", "Paid", "Business Cards", "Quantity: 250", "$45.00", "$10.20", "$3.99", "$59.19", "1510 Gates Ave", "Payment Method:", "PayPal"]) {
    assert.ok(receipt.html.includes(expected), `receipt should include ${expected}`);
  }
  assert.doesNotMatch(receipt.html, /CAPTURE-AUDIT-001/);
});

test("admin notification includes customer, order totals, provider, and capture audit id", () => {
  const notification = buildAdminNotification(paidOrder);
  for (const expected of ["Customer Test", "customer@example.test", "2125550101", "Business Cards", "PayPal", "CAPTURE-AUDIT-001", "$59.19", "1510 Gates Ave"]) {
    assert.ok(notification.html.includes(expected), `admin notification should include ${expected}`);
  }
});

test("post-payment emails are eligible only after a durable paid capture", () => {
  assert.equal(canSendPaidNotifications(paidOrder), true);
  assert.equal(canSendPaidNotifications({ ...paidOrder, payment_status: "pending_payment" }), false);
  assert.equal(canSendPaidNotifications({ ...paidOrder, paypal_capture_id: "" }), false);
});

test("paid-order emails stay disabled until both provider key and sender are configured", () => {
  assert.equal(emailNotificationsConfigured({}), false);
  assert.equal(emailNotificationsConfigured({ RESEND_API_KEY: "configured-key" }), false);
  assert.equal(emailNotificationsConfigured({ RESEND_FROM_EMAIL: "orders@example.test" }), false);
  assert.equal(emailNotificationsConfigured({ RESEND_API_KEY: "configured-key", RESEND_FROM_EMAIL: "orders@example.test" }), true);
});

test("durable email attempt marker prevents duplicate notifications on retry", () => {
  assert.equal(paidEmailWasAttempted(paidOrder), false);
  assert.equal(paidEmailWasAttempted({ ...paidOrder, description: `${paidOrder.description}\n${EMAIL_ATTEMPT_MARKER}` }), true);
});
