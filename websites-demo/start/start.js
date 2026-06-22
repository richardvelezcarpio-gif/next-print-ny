const PLANS = {
  basic: { name: "Basic", full: 499, deposit: 300, monthly: 35, months: 12 },
  growth: { name: "Growth", full: 1000, deposit: 400, monthly: 40, months: 24 },
  master: { name: "Master", full: 1600, deposit: 600, monthly: 70, months: 24 },
  pro: { name: "Web Printing + CRM Pro", full: 2500, deposit: 2500, monthly: 125, months: 12 },
};

const params = new URLSearchParams(window.location.search);
const planKey = PLANS[params.get("plan")] ? params.get("plan") : "growth";
const plan = PLANS[planKey];
const initialPayment = params.get("payment") === "full" ? "full" : "monthly";
const form = document.querySelector("#websiteStartForm");
const summary = document.querySelector("#planSummary");
const status = document.querySelector("#formStatus");
const selectedPayment = form.elements.payment;

selectedPayment.value = initialPayment;
renderSummary();
selectedPayment.forEach((input) => input.addEventListener("change", renderSummary));

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = form.querySelector("button");
  const values = new FormData(form);
  const payment = values.get("payment");
  const dueToday = payment === "full" ? plan.full + 40 : plan.deposit + 40;
  button.disabled = true;
  status.textContent = "Creating your secure website order...";

  const payload = {
    template: "Custom website build",
    plan: plan.name,
    paymentOption: payment === "full" ? "One-time payment" : `${money(plan.deposit)} down + ${money(plan.monthly)}/mo`,
    planPrice: money(plan.full),
    planDeposit: payment === "monthly" ? money(plan.deposit) : "",
    planMonthly: payment === "monthly" ? money(plan.monthly) : "",
    planMonths: payment === "monthly" ? `${plan.months} months` : "",
    domainFee: "$40",
    maintenanceFee: "$60",
    initialPayment: money(dueToday),
    monthlyBillingDay: "15",
    businessName: values.get("businessName"), contactName: values.get("contactName"), phone: values.get("phone"), email: values.get("email"),
    businessCategory: values.get("businessCategory"), pagesNeeded: ["Home", "Services", "Contact"], features: [], contentBlocks: [], projectDetails: values.get("projectDetails"),
  };

  try {
    const response = await fetch("/api/website-orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not create your website order.");
    sessionStorage.setItem("nextPrintWebsiteLead", JSON.stringify({ ...payload, orderNumber: data.orderNumber, amount: data.amount }));
    window.location.href = `/payments.html?order=${encodeURIComponent(data.orderNumber)}&amount=${encodeURIComponent(data.amount)}&return=${encodeURIComponent("/websites-demo/success/")}`;
  } catch (error) {
    status.textContent = error.message || "Please try again.";
    button.disabled = false;
  }
});

function renderSummary() {
  const payment = form.elements.payment.value;
  const detail = payment === "full" ? `${money(plan.full)} today + $40 domain` : `${money(plan.deposit)} today + $40 domain, then ${money(plan.monthly)}/month for ${plan.months} months`;
  summary.innerHTML = `<div><span>Selected plan</span><strong>${plan.name}</strong></div><div><span>Due today</span><strong>${payment === "full" ? money(plan.full + 40) : money(plan.deposit + 40)}</strong><span>${detail}</span></div>`;
}
function money(value) { return `$${Number(value).toLocaleString("en-US")}`; }
