(function calculateShippingModule(root) {
  const profiles = root.NextPrintShippingProfiles || safeRequire("../data/shippingProfiles.js");
  const rules = root.NextPrintShippingRules || safeRequire("./shippingRules.js");

  const TAX_RATE = 0.08875;
  const LOCAL_DELIVERY_FEE = 18;
  const STANDARD_RATES = {
    STANDARD: { base: 8, perLb: 1.1 },
    HEAVY: { base: 14, perLb: 1.4 },
    OVERSIZE: { base: 18, perLb: 1.8 },
    HEAVY_OVERSIZE: { base: 28, perLb: 2.2 },
  };
  const EXPRESS_UPCHARGE = {
    STANDARD: 18,
    HEAVY: 24,
    OVERSIZE: 32,
    HEAVY_OVERSIZE: 45,
  };

  function calculateShipping({
    productId,
    productName,
    method = "standard",
    destination = {},
    isMember = false,
    subtotal = 0,
    quantity = 1,
    taxRate = TAX_RATE,
  } = {}) {
    const profile = profiles.getShippingProfile(productId || productName) || defaultProfile(productName);
    const normalizedMethod = normalizeMethod(method);
    const normalizedQuantity = Math.max(1, Number(quantity) || 1);
    const normalizedSubtotal = roundMoney(subtotal);
    const state = rules.normalizeState(destination.state);
    const freeShippingApplied = rules.isMemberFreeShippingEligible({
      isMember,
      profile,
      method: normalizedMethod,
      state,
    });

    let available = true;
    let unavailableReason = "";
    let shippingCost = 0;

    if (normalizedMethod === rules.SHIPPING_METHODS.PICKUP) {
      shippingCost = 0;
    } else if (normalizedMethod === rules.SHIPPING_METHODS.LOCAL_DELIVERY) {
      available = rules.isLocalDeliveryEligible(destination);
      unavailableReason = available ? "" : "Local Delivery is only available in Brooklyn or Queens.";
      shippingCost = available ? LOCAL_DELIVERY_FEE : 0;
    } else if (freeShippingApplied) {
      shippingCost = 0;
    } else {
      shippingCost = approximateCarrierRate(profile, normalizedQuantity);
      if (normalizedMethod === rules.SHIPPING_METHODS.EXPRESS) {
        shippingCost += EXPRESS_UPCHARGE[profile.shippingCategory] || EXPRESS_UPCHARGE.STANDARD;
      }
    }

    const tax = roundMoney(normalizedSubtotal * taxRate);
    const shipping = roundMoney(shippingCost);
    const total = roundMoney(normalizedSubtotal + tax + shipping);

    return {
      available,
      unavailableReason,
      method: normalizedMethod,
      provider: profile.provider,
      productId: profile.productId,
      productName: profile.productName,
      shippingCategory: profile.shippingCategory,
      baseWeightLb: profile.baseWeightLb,
      boxSize: profile.boxSize,
      subtotal: normalizedSubtotal,
      tax,
      shipping,
      total,
      freeShippingApplied,
      message: rules.checkoutShippingMessage({ method: normalizedMethod, isMember, freeShippingApplied }),
      profile,
    };
  }

  function approximateCarrierRate(profile, quantity) {
    const rate = STANDARD_RATES[profile.shippingCategory] || STANDARD_RATES.STANDARD;
    const packageMultiplier = Math.max(1, Math.ceil(quantity / 5000));
    const estimatedWeight = Math.max(profile.baseWeightLb, profile.baseWeightLb * packageMultiplier);
    return rate.base + estimatedWeight * rate.perLb;
  }

  function normalizeMethod(method) {
    const value = String(method || "").toLowerCase();
    if (value === "pickup") return rules.SHIPPING_METHODS.PICKUP;
    if (value === "local" || value === "local_delivery" || value === "local-delivery") return rules.SHIPPING_METHODS.LOCAL_DELIVERY;
    if (value === "express") return rules.SHIPPING_METHODS.EXPRESS;
    return rules.SHIPPING_METHODS.STANDARD;
  }

  function defaultProfile(productName) {
    return {
      productId: profiles.normalizeProductName(productName || "print-products"),
      productName: productName || "Print Products",
      provider: "NextDayFlyers",
      baseWeightLb: 5,
      boxSize: "12 x 9 x 4",
      shippingCategory: "STANDARD",
      allowPickup: true,
      allowLocalDelivery: true,
      allowStandardShipping: true,
      allowExpressShipping: true,
      freeShippingEligible: false,
    };
  }

  function roundMoney(value) {
    const amount = Number(value || 0);
    return Math.round((Number.isFinite(amount) ? amount : 0) * 100) / 100;
  }

  function safeRequire(path) {
    try {
      if (typeof require === "function") return require(path);
    } catch {}
    return {};
  }

  const api = {
    TAX_RATE,
    LOCAL_DELIVERY_FEE,
    calculateShipping,
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.NextPrintShippingCalculator = api;
})(typeof window !== "undefined" ? window : globalThis);
