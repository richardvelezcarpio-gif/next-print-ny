(() => {
  const builder = document.querySelector("#estimateBuilder");
  if (!builder) return;
  const dashboard = document.querySelector("#adminDashboard");
  const form = document.querySelector("#estimateBuilderForm");
  const rows = document.querySelector("#estimateItems");
  const summary = document.querySelector("#estimateSummary");
  const status = document.querySelector("#estimateBuilderStatus");
  const filesInput = document.querySelector("#estimateFiles");
  const fileList = document.querySelector("#filePreviewList");
  const secureLink = document.querySelector("#copySecureLink");
  let files = [];
  let portalUrl = "";
  let savedProjectId = "";
  const money = value => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value) || 0);
  const input = (name, value, type = "text", extra = "") => `<input data-item="${name}" type="${type}" value="${String(value ?? "").replace(/\"/g, "&quot;")}" ${extra}>`;
  const nextNumber = () => `NP-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
  const today = () => new Date().toISOString().slice(0, 10);
  const afterThirtyDays = () => { const date = new Date(); date.setDate(date.getDate() + 30); return date.toISOString().slice(0, 10); };

  function resetBuilder() {
    form.reset(); files = []; portalUrl = ""; savedProjectId = ""; secureLink.disabled = true;
    form.elements.estimateNumber.value = nextNumber(); form.elements.estimateDate.value = today(); form.elements.expirationDate.value = afterThirtyDays();
    rows.innerHTML = ""; addRow({ title: "Print service", quantity: 1, unit: "each", unitPrice: 0, discount: 0 }); renderFiles(); updateTotals(); status.textContent = "";
  }
  function addRow(item = {}) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${input("title", item.title || "", "text", "required aria-label=\"Product or service\"")}</td><td>${input("description", item.description || "", "text", "aria-label=\"Description\"")}</td><td>${input("quantity", item.quantity || 1, "number", "min=\"1\" step=\"1\" aria-label=\"Quantity\"")}</td><td>${input("unit", item.unit || "each", "text", "aria-label=\"Unit\"")}</td><td>${input("unitPrice", item.unitPrice || 0, "number", "min=\"0\" step=\"0.01\" aria-label=\"Unit price\"")}</td><td>${input("discount", item.discount || 0, "number", "min=\"0\" max=\"100\" step=\"0.01\" aria-label=\"Line discount\"")}</td><td><label class="checkbox-only"><input data-item="taxable" type="checkbox" ${item.taxable ? "checked" : ""}><span class="sr-only">Taxable</span></label></td><td class="line-total">$0.00</td><td class="line-actions"><button type="button" data-action="duplicate" title="Duplicate item">⧉</button><button type="button" data-action="delete" title="Delete item">×</button></td>`;
    rows.append(tr);
  }
  function getItems() { return [...rows.children].map(row => ({ title: row.querySelector('[data-item="title"]').value.trim(), description: row.querySelector('[data-item="description"]').value.trim(), quantity: Math.max(1, Number(row.querySelector('[data-item="quantity"]').value) || 1), unit: row.querySelector('[data-item="unit"]').value.trim() || "each", unitPrice: Math.max(0, Number(row.querySelector('[data-item="unitPrice"]').value) || 0), discount: Math.max(0, Math.min(100, Number(row.querySelector('[data-item="discount"]').value) || 0)), taxable: row.querySelector('[data-item="taxable"]').checked })); }
  function updateTotals() {
    const items = getItems(); let subtotal = 0;
    [...rows.children].forEach((row, index) => { const item = items[index]; const total = item.quantity * item.unitPrice * (1 - item.discount / 100); subtotal += total; row.querySelector(".line-total").textContent = money(total); });
    const read = name => Math.max(0, Number(form.elements[name].value) || 0);
    const discount = read("discountAmount"), tax = read("taxAmount"), shipping = read("shipping"), installation = read("installation"), fees = read("additionalFees"), deposit = read("depositRequired");
    const grand = Math.max(0, subtotal - discount + tax + shipping + installation + fees);
    summary.innerHTML = `<div><dt>Subtotal</dt><dd>${money(subtotal)}</dd></div><div><dt>Discount</dt><dd>−${money(discount)}</dd></div><div><dt>Tax</dt><dd>${money(tax)}</dd></div><div><dt>Shipping</dt><dd>${money(shipping)}</dd></div><div><dt>Installation</dt><dd>${money(installation)}</dd></div><div><dt>Additional fees</dt><dd>${money(fees)}</dd></div><div class="summary-total"><dt>Grand Total</dt><dd>${money(grand)}</dd></div><div class="summary-balance"><dt>Balance Due</dt><dd>${money(Math.max(0, grand - deposit))}</dd></div>`;
  }
  function renderFiles() { fileList.innerHTML = files.map((file, index) => `<article><span>${file.type.startsWith("image/") ? "Image" : "File"}</span><div><strong>${escapeHtml(file.name)}</strong><small>${Math.max(1, Math.round(file.size / 1024))} KB · private until saved</small></div><button type="button" data-file-index="${index}" aria-label="Remove ${escapeHtml(file.name)}">×</button></article>`).join("") || "<p class=\"file-empty\">No files attached yet.</p>"; }
  function escapeHtml(value) { return String(value).replace(/[&<>"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]); }
  function payload(statusOverride) {
    const project = { title: form.elements.projectTitle.value, description: form.elements.projectDescription.value, details: [`Measurements: ${form.elements.measurements.value}`, `Materials: ${form.elements.materials.value}`, `Colors: ${form.elements.colors.value}`, `Finishing: ${form.elements.finishing.value}`, `Installation: ${form.elements.installationDetails.value}`, `Production time: ${form.elements.productionTime.value}`].filter(line => !line.endsWith(": ")).join("\n") };
    return { action: "estimate", status: statusOverride, projectId: savedProjectId, customer: { name: form.elements.customerName.value, contactName: form.elements.contactName.value, email: form.elements.email.value, phone: form.elements.phone.value, billingAddress: form.elements.billingAddress.value }, estimateNumber: form.elements.estimateNumber.value, estimateDate: form.elements.estimateDate.value, expirationDate: form.elements.expirationDate.value, project, items: getItems(), discountAmount: form.elements.discountAmount.value, taxMode: form.elements.taxMode.value, taxAmount: form.elements.taxAmount.value, shipping: form.elements.shipping.value, installation: form.elements.installation.value, additionalFees: form.elements.additionalFees.value, depositRequired: form.elements.depositRequired.value, terms: form.elements.terms.value, internalNotes: form.elements.internalNotes.value, files: files.map(file => ({ name: file.name, size: file.size, type: file.type })) };
  }
  async function saveEstimate(statusOverride = "draft") {
    if (!form.reportValidity()) return;
    status.textContent = statusOverride === "sent" ? "Sending estimate…" : "Saving draft…";
    const response = await fetch("/api/project-portal?action=estimate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload(statusOverride)) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) { status.textContent = result.error || "The estimate could not be saved."; status.classList.add("is-error"); return; }
    portalUrl = result.portalUrl || portalUrl; savedProjectId = result.project?.id || savedProjectId; secureLink.disabled = !portalUrl; status.classList.remove("is-error"); status.textContent = statusOverride === "sent" ? "Estimate sent. Secure link is ready." : "Draft saved. Secure link is ready.";
  }
  document.querySelector("#newEstimate").onclick = () => { dashboard.hidden = true; builder.hidden = false; resetBuilder(); window.scrollTo({ top: 0, behavior: "smooth" }); };
  document.querySelector("#backToEstimates").onclick = () => { builder.hidden = true; dashboard.hidden = false; };
  document.querySelector("#addItem").addEventListener("click", () => { addRow(); updateTotals(); });
  rows.addEventListener("input", updateTotals);
  rows.addEventListener("click", event => { const button = event.target.closest("button[data-action]"); if (!button) return; const row = button.closest("tr"); if (button.dataset.action === "delete") { if (rows.children.length > 1) row.remove(); } else { const item = getItems()[[...rows.children].indexOf(row)]; addRow(item); } updateTotals(); });
  form.addEventListener("input", event => { if (event.target.matches("input, select")) updateTotals(); });
  form.addEventListener("submit", event => { event.preventDefault(); saveEstimate("draft"); });
  document.querySelector("#sendEstimate").onclick = () => saveEstimate("sent");
  document.querySelector("#previewEstimate").onclick = () => { const win = window.open("", "_blank", "noopener,noreferrer"); if (win) { win.document.write(`<title>Estimate preview</title><pre>${escapeHtml(JSON.stringify(payload("draft"), null, 2))}</pre>`); win.document.close(); } };
  document.querySelector("#downloadEstimate").onclick = () => window.print();
  secureLink.onclick = async () => { if (!portalUrl) return; try { await navigator.clipboard.writeText(`${location.origin}${portalUrl}`); status.textContent = "Secure link copied."; } catch { status.textContent = `${location.origin}${portalUrl}`; } };
  document.querySelectorAll("[data-builder-tab]").forEach(button => button.onclick = () => { document.querySelectorAll("[data-builder-tab]").forEach(tab => tab.classList.toggle("is-active", tab === button)); document.querySelectorAll("[data-builder-panel]").forEach(panel => panel.classList.toggle("is-active", panel.dataset.builderPanel === button.dataset.builderTab)); });
  filesInput.onchange = event => { const allowed = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf", "image/svg+xml"]); files = [...files, ...[...event.target.files].filter(file => allowed.has(file.type) && file.size > 0 && file.size <= 15 * 1024 * 1024)].slice(0, 12); event.target.value = ""; renderFiles(); };
  fileList.onclick = event => { const button = event.target.closest("button[data-file-index]"); if (!button) return; files.splice(Number(button.dataset.fileIndex), 1); renderFiles(); };
})();
