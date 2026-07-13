(function () {
  let configPromise = null;
  let sdkPromise = null;

  async function getConfig() {
    if (!configPromise) {
      configPromise = fetch("/api/paypal?action=config")
        .then((response) => response.json().then((data) => ({ response, data })))
        .then(({ response, data }) => {
          if (!response.ok || !data.enabled || !data.clientId) {
            throw new Error(data?.error || "PayPal buttons are not configured yet.");
          }

          return data;
        });
    }

    return configPromise;
  }

  async function loadSdk() {
    if (window.paypal?.Buttons) return window.paypal;

    if (!sdkPromise) {
      sdkPromise = getConfig().then((config) => {
        return new Promise((resolve, reject) => {
          const existing = document.querySelector("script[data-next-print-paypal-sdk='true']");
          if (existing) {
            existing.addEventListener("load", () => resolve(window.paypal));
            existing.addEventListener("error", () => reject(new Error("Could not load PayPal buttons.")));
            return;
          }

          const script = document.createElement("script");
          const params = new URLSearchParams({
            "client-id": config.clientId,
            currency: config.currency || "USD",
            intent: "capture",
            components: "buttons",
            "enable-funding": "card,paylater",
          });

          script.src = `https://www.paypal.com/sdk/js?${params.toString()}`;
          script.async = true;
          script.dataset.nextPrintPaypalSdk = "true";
          script.onload = () => resolve(window.paypal);
          script.onerror = () => reject(new Error("Could not load PayPal buttons."));
          document.head.appendChild(script);
        });
      });
    }

    return sdkPromise;
  }

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

  async function captureCheckout(orderNumber, paypalOrderId) {
    const response = await fetch("/api/paypal?action=capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNumber, paypalOrderId }),
    });
    const data = await response.json();

    if (!response.ok || !data.ok) {
      throw new Error(data?.error || "Could not confirm PayPal payment.");
    }

    return data;
  }

  async function captureReturn({ orderNumber, paypalOrderId, setStatus, onSuccess, onError }) {
    if (!orderNumber || !paypalOrderId) return false;

    try {
      setStatus?.("Confirming PayPal payment...");
      const data = await captureCheckout(orderNumber, paypalOrderId);

      onSuccess?.(orderNumber, data);
    } catch (error) {
      setStatus?.(error.message || "Could not confirm PayPal payment.", true);
      onError?.(error);
    }

    return true;
  }

  async function renderButtons({
    container,
    getCheckout,
    setStatus,
    onSuccess,
    onError,
    fallbackButton,
    style,
  }) {
    const target = typeof container === "string" ? document.querySelector(container) : container;
    const fallback = typeof fallbackButton === "string" ? document.querySelector(fallbackButton) : fallbackButton;

    if (!target || typeof getCheckout !== "function") return false;

    try {
      setStatus?.("Loading secure PayPal buttons...");
      const paypal = await loadSdk();
      target.innerHTML = "";

      let activeCheckout = null;
      const buttons = paypal.Buttons({
        style: {
          layout: "vertical",
          shape: "rect",
          color: "gold",
          label: "pay",
          height: 48,
          ...(style || {}),
        },
        async createOrder() {
          setStatus?.("Preparing your secure payment...");
          const payload = await getCheckout();
          activeCheckout = await createCheckout(payload);
          return activeCheckout.id;
        },
        async onApprove(data) {
          const orderNumber = activeCheckout?.orderNumber || activeCheckout?.order || "";
          const paypalOrderId = data.orderID || activeCheckout?.id;
          setStatus?.("Confirming PayPal payment...");
          const capture = await captureCheckout(orderNumber, paypalOrderId);
          setStatus?.("Payment received. Thank you.");
          onSuccess?.(orderNumber, capture);
        },
        onCancel() {
          setStatus?.("Payment was cancelled. You can try again when ready.");
        },
        onError(error) {
          const message = error?.message || "Could not complete PayPal checkout.";
          setStatus?.(message, true);
          onError?.(error);
        },
      });

      if (!buttons.isEligible?.() && typeof buttons.isEligible === "function") {
        throw new Error("PayPal buttons are not eligible on this device.");
      }

      await buttons.render(target);
      target.hidden = false;
      if (fallback) fallback.hidden = true;
      setStatus?.("Choose PayPal or card to pay securely.");
      return true;
    } catch (error) {
      if (fallback) fallback.hidden = false;
      setStatus?.(error.message || "PayPal buttons are unavailable. Use the backup checkout button.", true);
      onError?.(error);
      return false;
    }
  }

  function paypalTokenFromParams(params) {
    return params.get("token") || params.get("paypal_order_id") || params.get("paypalOrderId");
  }

  window.NextPrintPayPal = {
    getConfig,
    loadSdk,
    createCheckout,
    captureCheckout,
    captureReturn,
    renderButtons,
    paypalTokenFromParams,
  };
})();
