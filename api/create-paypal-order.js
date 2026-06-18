import {
  buildReturnUrl,
  hasPayPalConfig,
  moneyToPayPalValue,
  paypalFetch,
  sanitizeCheckoutInput,
} from "./_paypal.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!hasPayPalConfig()) {
    res.status(500).json({
      error: "PayPal is not configured. Add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in Vercel.",
    });
    return;
  }

  const checkout = sanitizeCheckoutInput(req.body || {});
  const amount = moneyToPayPalValue(checkout.amount);

  if (!checkout.orderNumber) {
    res.status(400).json({ error: "Order number is required." });
    return;
  }

  if (!amount) {
    res.status(400).json({ error: "A valid checkout amount is required." });
    return;
  }

  try {
    const returnUrl = buildReturnUrl(req, checkout.successPath, {
      checkout: "paypal-return",
      order: checkout.orderNumber,
    });
    const cancelUrl = buildReturnUrl(req, checkout.cancelPath, {
      checkout: "cancelled",
      order: checkout.orderNumber,
    });
    const description = checkout.description || `Next Print NY order ${checkout.orderNumber}`;

    const paypalOrder = await paypalFetch("/v2/checkout/orders", {
      method: "POST",
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            custom_id: checkout.orderNumber,
            description,
            amount: {
              currency_code: checkout.currency || "USD",
              value: amount,
            },
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              brand_name: "Next Print NY",
              user_action: "PAY_NOW",
              shipping_preference: "NO_SHIPPING",
              return_url: returnUrl,
              cancel_url: cancelUrl,
            },
          },
        },
      }),
    });

    const approvalUrl = (paypalOrder.links || []).find((link) => {
      return link.rel === "payer-action" || link.rel === "approve";
    })?.href;

    if (!approvalUrl) {
      throw new Error("PayPal did not return an approval URL.");
    }

    res.status(200).json({
      ok: true,
      provider: "paypal",
      id: paypalOrder.id,
      url: approvalUrl,
      approvalUrl,
      amount: Number(amount),
      orderNumber: checkout.orderNumber,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Could not create PayPal checkout." });
  }
}
