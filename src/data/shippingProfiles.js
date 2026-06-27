(function shippingProfilesModule(root) {
  const PROVIDER = "NextDayFlyers";
  const CATEGORY = {
    STANDARD: "STANDARD",
    OVERSIZE: "OVERSIZE",
    HEAVY: "HEAVY",
    HEAVY_OVERSIZE: "HEAVY_OVERSIZE",
  };

  const shippingProfiles = [
    profile("business-cards", "Business Cards", 2, "12 x 9 x 4", CATEGORY.STANDARD, true),
    profile("flyers", "Flyers", 5, "12 x 9 x 4", CATEGORY.STANDARD, true),
    profile("stickers-labels", "Stickers & Labels", 2, "10 x 8 x 4", CATEGORY.STANDARD, true),
    profile("menus", "Menus", 8, "13 x 10 x 4", CATEGORY.HEAVY, true),
    profile("banners", "Banners", 6, "24 x 6 x 6", CATEGORY.OVERSIZE, false),
    profile("yard-signs", "Yard Signs", 10, "26 x 20 x 4", CATEGORY.OVERSIZE, false),
    profile("retractable-banners", "Retractable Banners", 18, "36 x 10 x 10", CATEGORY.HEAVY_OVERSIZE, false),
    profile("t-shirts-apparel", "T-Shirts & Apparel", 3, "14 x 10 x 4", CATEGORY.STANDARD, false),
    profile("posters", "Posters", 4, "20 x 4 x 4", CATEGORY.OVERSIZE, true),
    profile("brochures", "Brochures", 6, "12 x 9 x 5", CATEGORY.HEAVY, true),
    profile("door-hangers", "Door Hangers", 5, "12 x 9 x 4", CATEGORY.STANDARD, true),
    profile("window-graphics", "Window Graphics", 7, "24 x 6 x 6", CATEGORY.OVERSIZE, false),
    profile("invoices", "Invoices", 6, "12 x 9 x 4", CATEGORY.HEAVY, false),
    profile("window-decals", "Window Decals", 5, "18 x 4 x 4", CATEGORY.OVERSIZE, false),
  ];

  const aliases = new Map([
    ["business card", "business-cards"],
    ["flyer", "flyers"],
    ["sticker", "stickers-labels"],
    ["label", "stickers-labels"],
    ["menu", "menus"],
    ["retractable", "retractable-banners"],
    ["banner", "banners"],
    ["yard", "yard-signs"],
    ["t-shirt", "t-shirts-apparel"],
    ["tshirt", "t-shirts-apparel"],
    ["shirt", "t-shirts-apparel"],
    ["poster", "posters"],
    ["brochure", "brochures"],
    ["door", "door-hangers"],
    ["window graphic", "window-graphics"],
    ["window decal", "window-decals"],
    ["decal", "window-decals"],
    ["invoice", "invoices"],
  ]);

  function profile(productId, productName, baseWeightLb, boxSize, shippingCategory, freeShippingEligible) {
    return {
      productId,
      productName,
      provider: PROVIDER,
      baseWeightLb,
      boxSize,
      shippingCategory,
      allowPickup: true,
      allowLocalDelivery: true,
      allowStandardShipping: true,
      allowExpressShipping: true,
      freeShippingEligible,
    };
  }

  function normalizeProductName(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function getShippingProfile(productIdOrName) {
    const normalized = normalizeProductName(productIdOrName);
    const direct = shippingProfiles.find((item) => item.productId === normalized);
    if (direct) return direct;

    const readable = String(productIdOrName || "").toLowerCase();
    for (const [keyword, productId] of aliases.entries()) {
      if (readable.includes(keyword)) {
        return shippingProfiles.find((item) => item.productId === productId) || null;
      }
    }

    return null;
  }

  const api = {
    SHIPPING_PROVIDER: PROVIDER,
    SHIPPING_CATEGORIES: CATEGORY,
    shippingProfiles,
    getShippingProfile,
    normalizeProductName,
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.NextPrintShippingProfiles = api;
})(typeof window !== "undefined" ? window : globalThis);
