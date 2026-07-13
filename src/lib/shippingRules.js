(function shippingRulesModule(root) {
  const FREE_SHIPPING_STATES = ["NY", "NJ", "CT", "PA", "MA", "RI", "VT", "NH", "ME", "DE", "MD"];
  const BLOCKED_FREE_SHIPPING_STATES = ["VA", "DC", "NC", "SC", "GA", "FL"];
  const LOCAL_DELIVERY_AREAS = ["BROOKLYN", "QUEENS"];
  const SHIPPING_METHODS = {
    PICKUP: "pickup",
    LOCAL_DELIVERY: "local_delivery",
    STANDARD: "standard",
    EXPRESS: "express",
  };

  function normalizeState(value) {
    return String(value || "").trim().toUpperCase().slice(0, 2);
  }

  function normalizeArea(value) {
    return String(value || "").trim().toUpperCase();
  }

  function isLocalDeliveryEligible({ city = "", borough = "", state = "" } = {}) {
    const normalizedState = normalizeState(state);
    if (normalizedState && normalizedState !== "NY") return false;
    const area = normalizeArea(borough || city);
    return LOCAL_DELIVERY_AREAS.includes(area);
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
    if (method === SHIPPING_METHODS.PICKUP) return "Store Pickup — Free";
    if (method === SHIPPING_METHODS.LOCAL_DELIVERY) return "Local Delivery — Brooklyn/Queens only";
    if (method === SHIPPING_METHODS.EXPRESS) return isMember ? "Member Shipping Rate Applied" : "Express Shipping";
    if (freeShippingApplied) return "Member Free Shipping Applied";
    if (isMember) return "Member Shipping Rate Applied";
    return "Standard Shipping";
  }

  const api = {
    FREE_SHIPPING_STATES,
    BLOCKED_FREE_SHIPPING_STATES,
    LOCAL_DELIVERY_AREAS,
    SHIPPING_METHODS,
    normalizeState,
    isLocalDeliveryEligible,
    isMemberFreeShippingEligible,
    checkoutShippingMessage,
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.NextPrintShippingRules = api;
})(typeof window !== "undefined" ? window : globalThis);
