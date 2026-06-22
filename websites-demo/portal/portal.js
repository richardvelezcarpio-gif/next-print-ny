const portalParams = new URLSearchParams(location.search);
const portalOrder = portalParams.get("order") || "";
const lead = readLead();
const portalForm = document.querySelector("#portalForm");
const portalStatus = document.querySelector("#portalStatus");
document.querySelector("#portalOrder").textContent = portalOrder || lead.orderNumber || "your website order";
portalForm.businessName.value = lead.businessName || "";
portalForm.name.value = lead.contactName || "";
portalForm.phone.value = lead.phone || "";
portalForm.email.value = lead.email || "";

portalForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = portalForm.querySelector("button");
  button.disabled = true;
  portalStatus.textContent = "Sending your project brief...";
  try {
    const values = new FormData(portalForm);
    const files = await readFiles(values.getAll("files").filter((file) => file?.size));
    const details = [
      `Paid website order: ${portalOrder || lead.orderNumber || "Not provided"}`,
      `Business: ${values.get("businessName")}`,
      `Pages: ${values.getAll("pages").join(", ") || "Not selected"}`,
      `Features: ${values.getAll("features").join(", ") || "Not selected"}`,
      `Brand and inspiration: ${values.get("brand") || "Not provided"}`,
      `Project notes: ${values.get("notes")}`,
    ].join("\n\n");
    const response = await fetch("/api/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ service: "Website Project Content", product: "", quantity: "1", name: values.get("name"), phone: values.get("phone"), email: values.get("email"), fulfillment: "pickup", language: "en", details, files }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not send your brief.");
    portalStatus.textContent = "Your project brief was sent. Our website team will review it within one business day.";
    portalStatus.style.color = "#0b8b60";
    sessionStorage.setItem("nextPrintWebsiteBriefSent", "true");
  } catch (error) {
    portalStatus.textContent = error.message || "Please try again.";
    button.disabled = false;
  }
});
function readLead() { try { return JSON.parse(sessionStorage.getItem("nextPrintWebsiteLead")) || {}; } catch { return {}; } }
function readFiles(files) { return Promise.all(files.slice(0, 8).map((file) => new Promise((resolve, reject) => { if (file.size > 4 * 1024 * 1024) return reject(new Error(`${file.name} is larger than 4 MB.`)); const reader = new FileReader(); reader.onload = () => resolve({ name: file.name, content: String(reader.result).split(",").pop() }); reader.onerror = () => reject(new Error(`Could not read ${file.name}.`)); reader.readAsDataURL(file); }))); }
