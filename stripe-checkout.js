(function () {
  async function createCheckout(payload) {
    const response = await fetch("/api/create-stripe-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data?.error || "Could not open Stripe checkout.");
    return data;
  }

  async function confirmCheckout(payload) {
    const response = await fetch("/api/create-stripe-checkout-session?action=confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data?.error || "Could not confirm Stripe payment.");
    return data;
  }

  async function createSubscriptionCheckout() {
    const response = await fetch("/api/create-stripe-subscription-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data?.error || "Could not open Stripe membership checkout.");
    return data;
  }

  async function confirmSubscription(payload) {
    const response = await fetch("/api/create-stripe-subscription-session?action=confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data?.error || "Could not confirm Stripe membership.");
    return data;
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
})();
