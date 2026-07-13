const adminPortal = document.querySelector("#adminPortal");
const estimateDialog = document.querySelector("#estimateDialog");
const notificationResult = document.querySelector("#notificationResult");
const pushState = document.querySelector("#pushState");
const pushDetail = document.querySelector("#pushDetail");
const emailState = document.querySelector("#emailState");
const emailDetail = document.querySelector("#emailDetail");
const emailTestMetadata = document.querySelector("#emailTestMetadata");
const pushLastNotification = document.querySelector("#pushLastNotification");
const controls = {
  enable: document.querySelector("#enableNotifications"), disable: document.querySelector("#disableNotifications"),
  reconnect: document.querySelector("#reconnectNotifications"), testPush: document.querySelector("#testPush"), testEmail: document.querySelector("#testEmail")
};
let notificationConfig = { pushConfigured: false, emailConfigured: false, publicKey: "" };
let registration;

if (estimateDialog) document.querySelector("#newEstimate").onclick = () => estimateDialog.showModal();
const esc = (value = "") => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const isPushSupported = () => "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
const setResult = (message, error = false) => { notificationResult.textContent = message; notificationResult.classList.toggle("is-error", error); };
const setState = (node, detailNode, label, type = "neutral", detailText = "") => { node.textContent = label; node.className = `notification-state state-${type}`; detailNode.textContent = detailText; };
const setBusy = (button, busy) => { button.disabled = busy; button.dataset.original ||= button.textContent; button.textContent = busy ? "Please wait…" : button.dataset.original; };

async function notificationRequest(action, options = {}) {
  const response = await fetch(`/api/notifications?action=${encodeURIComponent(action)}`, {
    method: options.method || "POST", headers: { "Content-Type": "application/json" }, body: options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Notification request failed.");
  return data;
}

function publicKeyBytes(key) {
  const padding = "=".repeat((4 - key.length % 4) % 4);
  const base64 = (key + padding).replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(base64), character => character.charCodeAt(0));
}

async function getRegistration() {
  if (!isPushSupported()) throw new Error("Push notifications are not supported by this browser.");
  registration ||= await navigator.serviceWorker.register("/push-sw.js", { scope: "/" });
  return registration;
}

function updatePushButtons({ connected = false, disabled = false } = {}) {
  controls.enable.disabled = disabled || connected;
  controls.disable.disabled = disabled || !connected;
  controls.reconnect.disabled = disabled;
  controls.testPush.disabled = disabled || !connected;
}

async function refreshNotificationSettings() {
  emailTestMetadata.hidden = true;
  if (!isPushSupported()) {
    setState(pushState, pushDetail, "Not Supported", "error", "This browser cannot receive web push notifications."); updatePushButtons({ disabled: true });
  }
  try {
    notificationConfig = await notificationRequest("status", { method: "GET" });
  } catch (error) {
    setState(pushState, pushDetail, "Error", "error", "The notification service could not be reached.");
    setState(emailState, emailDetail, "Not Configured", "warning", "The email service could not be reached.");
    updatePushButtons({ disabled: true });
    controls.testEmail.disabled = true;
    setResult(error.message, true);
    return;
  }
  if (notificationConfig.emailConfigured) setState(emailState, emailDetail, "Configured", "connected", "A secure administrative sender is configured.");
  else setState(emailState, emailDetail, "Not Configured", "warning", "Add the Resend environment variables to enable email alerts.");
  controls.testEmail.disabled = !notificationConfig.emailConfigured;
  if (!isPushSupported()) return;
  if (!notificationConfig.pushConfigured || !notificationConfig.publicKey) {
    setState(pushState, pushDetail, "Configuration Missing", "warning", "Add the VAPID environment variables to enable push alerts."); updatePushButtons({ disabled: true }); return;
  }
  if (Notification.permission === "denied") {
    setState(pushState, pushDetail, "Permission Denied", "error", "Allow notifications in browser settings to reconnect."); updatePushButtons({ disabled: true }); return;
  }
  try {
    const current = await (await getRegistration()).pushManager.getSubscription();
    if (current) { setState(pushState, pushDetail, "Connected", "connected", "This browser is registered for secure project alerts."); updatePushButtons({ connected: true }); }
    else { setState(pushState, pushDetail, "Not Connected", "neutral", "Enable browser notifications on this device."); updatePushButtons(); }
  } catch (error) {
    setState(pushState, pushDetail, "Error", "error", "The browser could not register the service worker."); updatePushButtons({ disabled: true }); setResult(error.message, true);
  }
}

async function enablePush(forceReconnect = false) {
  if (!notificationConfig.pushConfigured || !notificationConfig.publicKey) return setResult("Push configuration is missing on the server.", true);
  const button = forceReconnect ? controls.reconnect : controls.enable;
  setBusy(button, true);
  try {
    const serviceWorker = await getRegistration();
    if (Notification.permission === "denied") throw new Error("Notification permission is denied in this browser.");
    const permission = Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
    if (permission !== "granted") throw new Error("Notification permission was not granted.");
    let subscription = await serviceWorker.pushManager.getSubscription();
    if (forceReconnect && subscription) { await notificationRequest("unsubscribe", { body: { endpoint: subscription.endpoint } }); await subscription.unsubscribe(); subscription = null; }
    subscription ||= await serviceWorker.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: publicKeyBytes(notificationConfig.publicKey) });
    await notificationRequest("subscribe", { body: { subscription: subscription.toJSON() } });
    setResult("Push notifications are connected.");
    await refreshNotificationSettings();
  } catch (error) {
    const denied = Notification.permission === "denied" || /permission/i.test(error.message);
    setState(pushState, pushDetail, denied ? "Permission Denied" : "Error", "error", error.message);
    setResult(error.message, true);
  } finally { setBusy(button, false); }
}

async function disablePush() {
  setBusy(controls.disable, true);
  try {
    const subscription = await (await getRegistration()).pushManager.getSubscription();
    if (subscription) { await notificationRequest("unsubscribe", { body: { endpoint: subscription.endpoint } }); await subscription.unsubscribe(); }
    setResult("Push notifications are disconnected."); await refreshNotificationSettings();
  } catch (error) { setResult(error.message, true); } finally { setBusy(controls.disable, false); }
}

async function sendTestPush() {
  setBusy(controls.testPush, true);
  try { const result = await notificationRequest("test-push"); pushLastNotification.hidden = false; pushLastNotification.textContent = `Last notification: ${new Date(result.lastNotificationAt || Date.now()).toLocaleString()}.`; setResult("Test push sent. Check this device."); }
  catch (error) { setResult(error.message, true); } finally { setBusy(controls.testPush, false); }
}

async function sendTestEmail() {
  setBusy(controls.testEmail, true);
  try {
    const result = await notificationRequest("test-email");
    setState(emailState, emailDetail, "Last Test Sent", "connected", "The test was accepted by the email provider.");
    emailTestMetadata.hidden = false;
    emailTestMetadata.innerHTML = `<dt>Recipient</dt><dd>${esc(result.recipient || "Configured admin email")}</dd><dt>Subject</dt><dd>${esc(result.subject || "Next Print NY test notification")}</dd><dt>Message ID</dt><dd>${esc(result.messageId || result.id || "Accepted")}</dd><dt>Status</dt><dd>Sent</dd><dt>Date and time</dt><dd>${esc(new Date().toLocaleString())}</dd>`;
    setResult("Test email sent to the configured administrative address.");
  } catch (error) { setState(emailState, emailDetail, "Last Test Failed", "error", error.message); setResult(error.message, true); } finally { setBusy(controls.testEmail, false); }
}

async function loadAdmin() {
  const response = await fetch("/api/project-portal?action=admin"); const body = await response.json();
  if (!response.ok) { adminPortal.innerHTML = `<section class="card"><h2>Admin login required</h2><p>${esc(body.error)}</p><a class="primary" href="admin.html">Open Admin Login</a></section>`; return; }
  const projects = body.projects || [];
  adminPortal.innerHTML = `<section class="card estimate"><h2>Active estimates & projects</h2>${projects.map(entry => { const project = entry.project || entry; const estimate = entry.estimate || {}; const payments = entry.payments || []; return `<article class="file"><strong>${esc(project.project_number || estimate.estimate_number)}</strong><span>${esc(project.status)} · ${esc(project.payment_status)}</span>${project.secure_token ? `<a href="/project/${encodeURIComponent(project.secure_token)}">Open customer portal</a>` : ""}${payments.filter(payment => payment.status === "pending_verification").map(payment => `<button class="primary verify" data-payment="${esc(payment.id)}">Verify and Mark as Paid</button>`).join("")}</article>`; }).join("") || "<p>No estimates yet.</p>"}</section>`;
  document.querySelectorAll(".verify").forEach(button => button.onclick = () => verify(button.dataset.payment));
}
async function verify(paymentId) { const response = await fetch("/api/project-portal?action=verify-payment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paymentId }) }); if (!response.ok) return alert("Verification failed."); loadAdmin(); }
const legacyEstimateForm = document.querySelector("#estimateForm");
if (legacyEstimateForm) legacyEstimateForm.onsubmit = async event => { event.preventDefault(); const form = new FormData(event.currentTarget); const payload = Object.fromEntries(form.entries()); const response = await fetch("/api/project-portal?action=estimate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); const result = await response.json(); document.querySelector("#estimateStatus").textContent = response.ok ? `Created ${result.estimate?.estimate_number || "estimate"}.` : result.error; if (response.ok) { event.currentTarget.reset(); estimateDialog.close(); loadAdmin(); } };
controls.enable.onclick = () => enablePush(); controls.disable.onclick = disablePush; controls.reconnect.onclick = () => enablePush(true); controls.testPush.onclick = sendTestPush; controls.testEmail.onclick = sendTestEmail;
const conversationId = new URLSearchParams(location.search).get("conversation");
if (conversationId) setResult(`Conversation ${conversationId} is selected. Open Messages to reply.`);
loadAdmin(); refreshNotificationSettings();
