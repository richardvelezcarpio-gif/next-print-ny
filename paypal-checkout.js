(function () {
  async function createCheckout(payload) {
    const response = await fetch("/api/paypal?action=create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok || !data.url) {
      throw new Error(data?.error || "Could not open PayPal checkout.");
    }

    return data;
  }

  async function captureReturn({ orderNumber, paypalOrderId, setStatus, onSuccess, onError }) {
    if (!orderNumber || !paypalOrderId) return false;

    try {
      setStatus?.("Confirming PayPal payment...");
      const response = await fetch("/api/paypal?action=capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, paypalOrderId }),
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data?.error || "Could not confirm PayPal payment.");
      }

      onSuccess?.(orderNumber, data);
    } catch (error) {
      setStatus?.(error.message || "Could not confirm PayPal payment.", true);
      onError?.(error);
    }

    return true;
  }

  function paypalTokenFromParams(params) {
    return params.get("token") || params.get("paypal_order_id") || params.get("paypalOrderId");
  }

  window.NextPrintPayPal = {
    createCheckout,
    captureReturn,
    paypalTokenFromParams,
  };
})();
