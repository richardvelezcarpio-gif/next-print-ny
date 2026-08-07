(function shippingRulesModule(root) {
  const FREE_SHIPPING_STATES = ["NY", "NJ", "CT", "PA", "MA", "RI", "VT", "NH", "ME", "DE", "MD"];
  const BLOCKED_FREE_SHIPPING_STATES = ["VA", "DC", "NC", "SC", "GA", "FL"];
  const SHIPPING_METHODS = {
    STANDARD: "standard",
    EXPRESS: "express",
  };

  function normalizeState(value) {
    return String(value || "").trim().toUpperCase().slice(0, 2);
  }

  function isMemberFreeShippingEligible({ isMember = false, profile = null, method = "", state = "" } = {}) {
    const destinationState = normalizeState(state);
    return Boolean(
      isMember &&
      profile?.freeShippingEligible &&
      method === SHIPPING_METHODS.STANDARD &&
      FREE_SHIPPING_STATES.includes(destinationState) &&
      !BLOCKED_FREE_SHIPPING_STATES.includes(destinationState)
    );
  }

  function checkoutShippingMessage({ method = "", isMember = false, freeShippingApplied = false } = {}) {
    if (method === SHIPPING_METHODS.EXPRESS) return isMember ? "Member Shipping Rate Applied" : "Express Shipping";
    if (freeShippingApplied) return "Member Free Shipping Applied";
    if (isMember) return "Member Shipping Rate Applied";
    return "Standard Shipping";
  }

  const api = {
    FREE_SHIPPING_STATES,
    BLOCKED_FREE_SHIPPING_STATES,
    SHIPPING_METHODS,
    normalizeState,
    isMemberFreeShippingEligible,
    checkoutShippingMessage,
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.NextPrintShippingRules = api;
})(typeof window !== "undefined" ? window : globalThis);
