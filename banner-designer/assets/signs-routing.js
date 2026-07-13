(() => {
  const designerPath = "/banner-designer/designer";
  const productOptions = ["Banner", "Vinyl Banner", "Retractable Banner", "Yard Sign"];
  const landingProductTargets = {
    "vinyl banners": printProductEditorUrl({
      product: "Banner 24x36",
      quantity: "1",
      price: "23.95",
      memberPrice: "18.95",
      details: [
        "Product: Banner 24x36",
        "Size: 24 x 36",
        "Quantity: 1",
        "Front Side: Full Color",
        "Back Side: No Printing",
        "Material: 13 oz. Standard Vinyl",
        "Treatment: None",
      ],
    }),
    "retractable banners": printProductEditorUrl({
      product: "Retractable Banner 22x80",
      quantity: "1",
      price: "149.95",
      memberPrice: "120.00",
      details: [
        "Product: Retractable Banner 22x80",
        "Size: 22 x 80",
        "Quantity: 1",
        "Display Options: Stand + 1 Banner",
        "Banner Stand: Standard Retractable",
        "Front Side: Full Color",
        "Back Side: No Printing",
        "Material: 13 oz. Smooth Blockout Vinyl",
        "Panels: 1 Panel",
      ],
    }),
    "step & repeat": printProductEditorUrl({
      product: "Backdrop 60x96",
      quantity: "1",
      price: "134.95",
      memberPrice: "107.99",
      details: [
        "Product: Backdrop 60x96",
        "Size: 60 x 96",
        "Quantity: 1",
        "Front Side: Full Color",
        "Back Side: No Printing",
        "Material: Backdrop Material",
        "Treatment: None",
      ],
    }),
    "window decals": printProductUploadUrl({
      product: "Stickers 4x4",
      quantity: "100",
      price: "65.00",
      memberPrice: "53.52",
      details: [
        "Product: Stickers 4x4",
        "Size: 4 x 4",
        "Quantity: 100",
        "Front Side: Full Color",
        "Back Side: No Printing",
        "Material: Premium Sticker",
        "Coating: Full Color",
      ],
    }),
  };
  const heroStartTarget = landingProductTargets["vinyl banners"];
  const heroUploadTarget = printProductUploadUrl({
    product: "Banner 24x36",
    quantity: "1",
    price: "23.95",
    memberPrice: "18.95",
    details: [
      "Product: Banner 24x36",
      "Size: 24 x 36",
      "Quantity: 1",
      "Front Side: Full Color",
      "Back Side: No Printing",
      "Material: 13 oz. Standard Vinyl",
      "Treatment: None",
    ],
  });
  const defaultsByProduct = {
    Banner: { width: "4", height: "4" },
    "Vinyl Banner": { width: "4", height: "4" },
    "Retractable Banner": { width: "3", height: "7" },
    "Yard Sign": { width: "1.5", height: "2" },
  };
  let appliedInitialRoute = false;
  let pendingFrame = 0;

  function printProductEditorUrl(config) {
    return printProductUrl("/print-products-editor.html", config);
  }

  function printProductUploadUrl(config) {
    return printProductUrl("/print-products-upload.html", config);
  }

  function printProductUrl(path, config) {
    const params = new URLSearchParams({
      product: config.product,
      quantity: config.quantity,
      price: config.price,
      memberPrice: config.memberPrice,
      details: config.details.join("\n"),
    });
    return `${path}?${params.toString()}`;
  }

  function isDesignerRoute() {
    return window.location.pathname.replace(/\/+$/, "") === designerPath;
  }

  function normalizeProduct(value) {
    const text = String(value || "").toLowerCase();
    if (text.includes("retractable")) return "Retractable Banner";
    if (text.includes("yard")) return "Yard Sign";
    if (text.includes("vinyl")) return "Vinyl Banner";
    return "Banner";
  }

  function cleanNumber(value) {
    const number = Number(String(value || "").replace(/[^0-9.]/g, ""));
    return Number.isFinite(number) && number > 0 ? String(number) : "";
  }

  function desiredConfig() {
    const params = new URLSearchParams(window.location.search);
    const product = normalizeProduct(params.get("product") || params.get("item") || "Banner");
    const fallback = defaultsByProduct[product] || defaultsByProduct.Banner;

    return {
      product,
      width: cleanNumber(params.get("width")) || fallback.width,
      height: cleanNumber(params.get("height")) || fallback.height,
    };
  }

  function setNativeValue(element, value) {
    if (!element) return;
    const prototype = element instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;

    if (setter) {
      setter.call(element, value);
    } else {
      element.value = value;
    }

    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function ensureProductOptions(select) {
    if (!select) return;
    const currentOptions = Array.from(select.options).map((option) => option.value || option.textContent.trim());

    if (currentOptions.length === productOptions.length && currentOptions.every((value, index) => value === productOptions[index])) {
      return;
    }

    const currentValue = productOptions.includes(select.value) ? select.value : normalizeProduct(select.value);
    select.replaceChildren();

    productOptions.forEach((label) => {
      const option = document.createElement("option");
      option.value = label;
      option.textContent = label;
      select.appendChild(option);
    });

    setNativeValue(select, currentValue);
  }

  function getControls() {
    const details = document.querySelector(".details-card");
    if (!details) return {};

    const selects = details.querySelectorAll("select");
    const numberInputs = details.querySelectorAll('input[type="number"]');

    return {
      productSelect: selects[0],
      widthInput: numberInputs[0],
      heightInput: numberInputs[1],
    };
  }

  function syncDesignerRoute() {
    if (!isDesignerRoute()) return;

    const { productSelect, widthInput, heightInput } = getControls();
    if (!productSelect || !widthInput || !heightInput) return;

    ensureProductOptions(productSelect);
    widthInput.step = "0.5";
    heightInput.step = "0.5";

    if (appliedInitialRoute) return;

    const config = desiredConfig();
    setNativeValue(productSelect, config.product);
    setNativeValue(widthInput, config.width);
    setNativeValue(heightInput, config.height);
    appliedInitialRoute = true;
  }

  function fixFooterLinks() {
    document.querySelectorAll(".footer a").forEach((link) => {
      const text = link.textContent.trim().toLowerCase();

      if (text === "banners" || text === "vinyl banners") {
        link.href = "/printing.html#banners";
      } else if (text === "retractable banners") {
        link.href = "/printing.html#retractable-banners";
      } else if (text === "yard signs") {
        link.href = "/printing.html#yard-signs";
      } else if (text === "decals & stickers") {
        link.href = "/printing.html#stickers";
      }
    });
  }

  function routeLandingButtons() {
    document.querySelectorAll(".product-card").forEach((card) => {
      const title = card.querySelector("h3")?.textContent.trim().toLowerCase();
      const target = landingProductTargets[title];
      const link = card.querySelector("a");

      if (!target || !link) return;
      link.href = target;
      link.setAttribute("data-next-print-route", "new-print-product-flow");
    });

    const heroLinks = document.querySelectorAll(".hero-buttons a");
    const startLink = heroLinks[0];
    const uploadLink = heroLinks[1];

    if (startLink) {
      startLink.href = heroStartTarget;
      startLink.setAttribute("data-next-print-route", "new-print-product-flow");
    }

    if (uploadLink) {
      uploadLink.href = heroUploadTarget;
      uploadLink.setAttribute("data-next-print-route", "new-print-product-flow");
    }
  }

  function targetForLandingClick(event) {
    const productCard = event.target.closest?.(".product-card");
    if (productCard) {
      const title = productCard.querySelector("h3")?.textContent.trim().toLowerCase();
      return landingProductTargets[title] || "";
    }

    const heroLink = event.target.closest?.(".hero-buttons a");
    if (!heroLink) return "";

    const text = heroLink.textContent.trim().toLowerCase();
    if (text.includes("upload")) return heroUploadTarget;
    if (text.includes("start")) return heroStartTarget;
    return "";
  }

  function handleLandingClick(event) {
    const target = targetForLandingClick(event);
    if (!target) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
    window.location.href = target;
  }

  function fitDesignerCanvas() {
    const wrapper = document.querySelector(".canvas-wrapper");
    const canvas = document.querySelector(".banner-canvas");
    if (!wrapper || !canvas) return;

    const styles = window.getComputedStyle(wrapper);
    const inlineWidth = Number.parseFloat(canvas.style.width);
    const inlineHeight = Number.parseFloat(canvas.style.height);
    const naturalWidth = Number.isFinite(inlineWidth) && inlineWidth > 0 ? inlineWidth : canvas.offsetWidth;
    const naturalHeight = Number.isFinite(inlineHeight) && inlineHeight > 0 ? inlineHeight : canvas.offsetHeight;
    const horizontalPadding = Number.parseFloat(styles.paddingLeft) + Number.parseFloat(styles.paddingRight);
    const availableWidth = Math.max(160, wrapper.clientWidth - horizontalPadding);

    if (!naturalWidth || !naturalHeight || !availableWidth) return;

    const scale = Math.min(1, availableWidth / naturalWidth);

    canvas.style.flex = "0 0 auto";
    canvas.style.maxWidth = "none";
    canvas.style.transformOrigin = "top left";

    if ("zoom" in canvas.style) {
      canvas.style.zoom = scale < 1 ? String(scale) : "";
      canvas.style.transform = "";
      canvas.style.marginRight = "";
      canvas.style.marginBottom = "";
      return;
    }

    canvas.style.zoom = "";
    canvas.style.transform = scale < 1 ? `scale(${scale})` : "";
    canvas.style.marginRight = scale < 1 ? `${naturalWidth * (scale - 1)}px` : "";
    canvas.style.marginBottom = scale < 1 ? `${naturalHeight * (scale - 1)}px` : "";
  }

  function scheduleSync() {
    window.cancelAnimationFrame(pendingFrame);
    pendingFrame = window.requestAnimationFrame(() => {
      syncDesignerRoute();
      fixFooterLinks();
      routeLandingButtons();
      fitDesignerCanvas();
    });
  }

  document.addEventListener("click", handleLandingClick, true);
  document.addEventListener("DOMContentLoaded", scheduleSync);
  window.addEventListener("resize", scheduleSync);
  new MutationObserver(scheduleSync).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style", "class"],
  });
  window.setTimeout(scheduleSync, 250);
  window.setTimeout(scheduleSync, 900);
})();
