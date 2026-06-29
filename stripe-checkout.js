(function () {
  async function stripeApiRequest(url, options, fallbackMessage) {
    let response;
    try {
      response = await fetch(url, options);
    } catch (error) {
      throw new Error(error.message || "Could not reach Stripe checkout API.");
    }

    const text = await response.text();
    const data = parseJson(text);

    if (!response.ok) {
      if (!data?.error && [404, 405, 501].includes(response.status)) {
        throw new Error("Stripe checkout API is not running. Use Vercel dev or deploy the site to Vercel before testing payments.");
      }
      throw new Error(data?.error || `${fallbackMessage} HTTP ${response.status}.`);
    }

    if (!data || typeof data !== "object") {
      throw new Error("Stripe checkout API returned an invalid response.");
    }

    return data;
  }

  async function createCheckout(payload) {
    return stripeApiRequest("/api/create-stripe-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    }, "Could not open Stripe checkout.");
  }

  async function confirmCheckout(payload) {
    return stripeApiRequest("/api/create-stripe-checkout-session?action=confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    }, "Could not confirm Stripe payment.");
  }

  async function createSubscriptionCheckout() {
    return stripeApiRequest("/api/create-stripe-subscription-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    }, "Could not open Stripe membership checkout.");
  }

  async function confirmSubscription(payload) {
    return stripeApiRequest("/api/create-stripe-subscription-session?action=confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    }, "Could not confirm Stripe membership.");
  }

  function redirectToCheckout(data) {
    if (!data?.url) throw new Error("Stripe did not return a checkout URL.");
    window.location.href = data.url;
  }

  window.NextPrintStripe = {
    createCheckout,
    confirmCheckout,
    createSubscriptionCheckout,
    confirmSubscription,
    redirectToCheckout,
  };

  function parseJson(text) {
    if (!text) return {};
    try {
      return JSON.parse(text);
    } catch {
      return {};
    }
  }
})();
