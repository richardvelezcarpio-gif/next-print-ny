(() => {
  const observer = new MutationObserver(mount);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  mount();

  function mount() {
    const top = document.querySelector(".canvas-top");
    if (!top || document.querySelector("#saveBannerToDashboard")) return;
    const button = document.createElement("button");
    button.id = "saveBannerToDashboard";
    button.className = "save-btn member-editor-save";
    button.type = "button";
    button.textContent = "Save to Dashboard";
    button.addEventListener("click", saveBanner);
    top.appendChild(button);
    observer.disconnect();
    loadBannerReference();
  }

  async function saveBanner() {
    const button = document.querySelector("#saveBannerToDashboard");
    button.disabled = true;
    button.textContent = "Saving...";
    try {
      const designData = await readBannerDesign();
      localStorage.setItem("nextPrintSavedBannerDesign", JSON.stringify(designData));
      const existingId = new URLSearchParams(location.search).get("design") || "";
      const response = await fetch("/api/member?action=design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: existingId,
          name: `${designData.product || "Banner"} ${designData.width || ""}x${designData.height || ""}`.trim(),
          editorType: "banner",
          product: designData.product || "Banner",
          designData,
          assets: designData.objects.filter((item) => item.type === "image" && item.image).map((item, index) => ({ name: `banner-artwork-${index + 1}.png`, type: item.image.slice(5, item.image.indexOf(";")) || "image/png", content: item.image.split(",").pop() })),
        }),
      });
      const data = await response.json();
      if (response.status === 401) {
        if (confirm("Sign in to save this banner in your dashboard?")) location.href = `/member-login.html?return=${encodeURIComponent(location.href)}`;
        return;
      }
      if (!response.ok) throw new Error(data.error || "Could not save banner.");
      if (!existingId && data.design?.id) { const url = new URL(location.href); url.searchParams.set("design", data.design.id); history.replaceState({}, "", url); }
      button.textContent = "Saved";
      setTimeout(() => { button.textContent = "Save to Dashboard"; }, 1800);
    } catch (error) {
      alert(error.message || "Could not save this banner.");
    } finally { button.disabled = false; if (button.textContent === "Saving...") button.textContent = "Save to Dashboard"; }
  }

  async function readBannerDesign() {
    const selects = [...document.querySelectorAll(".details-card select")];
    const inputs = [...document.querySelectorAll(".details-card input")];
    const objects = await Promise.all([...document.querySelectorAll(".banner-canvas .canvas-item")].map(async (node) => {
      const rect = node.getBoundingClientRect();
      const canvasRect = document.querySelector(".banner-canvas")?.getBoundingClientRect() || rect;
      const image = node.querySelector("img");
      return {
        type: image ? "image" : "text",
        text: node.querySelector(".text-item")?.textContent || "",
        image: image ? await imageData(image.src) : "",
        x: rect.left - canvasRect.left,
        y: rect.top - canvasRect.top,
        width: rect.width,
        height: rect.height,
        style: node.querySelector(".text-item")?.getAttribute("style") || "",
      };
    }));
    return { product: selects[0]?.value || "Banner", width: inputs[0]?.value || "", height: inputs[1]?.value || "", color1: inputs[2]?.value || "#0b2a44", color2: inputs[3]?.value || "#123f6d", objects, savedAt: new Date().toISOString() };
  }

  async function imageData(src) {
    if (src.startsWith("data:")) return src;
    try { const blob = await fetch(src).then((response) => response.blob()); return await new Promise((resolve) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result || "")); reader.readAsDataURL(blob); }); } catch { return ""; }
  }

  async function loadBannerReference() {
    const id = new URLSearchParams(location.search).get("design");
    if (!id) return;
    try {
      const response = await fetch(`/api/member?action=design&id=${encodeURIComponent(id)}`), data = await response.json();
      const saved = data.design?.design_data;
      if (!saved) return;
      const selects = [...document.querySelectorAll(".details-card select")], inputs = [...document.querySelectorAll(".details-card input")];
      setValue(selects[0], saved.product, "change"); setValue(inputs[0], saved.width, "input"); setValue(inputs[1], saved.height, "input"); setValue(inputs[2], saved.color1, "input"); setValue(inputs[3], saved.color2, "input");
      document.querySelector("#saveBannerToDashboard").textContent = "Saved design loaded";
      setTimeout(() => { document.querySelector("#saveBannerToDashboard").textContent = "Save to Dashboard"; }, 1800);
    } catch {}
  }
  function setValue(node, value, eventName) { if (!node || value == null) return; const setter = Object.getOwnPropertyDescriptor(node instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype, "value")?.set; setter?.call(node, value); node.dispatchEvent(new Event(eventName, { bubbles: true })); }
})();
