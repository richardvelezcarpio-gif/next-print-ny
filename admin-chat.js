(() => {
  const modal = document.querySelector("#adminChatModal");
  const messages = document.querySelector("#adminChatMessages");
  const title = document.querySelector("#adminChatTitle");
  const form = document.querySelector("#adminChatForm");
  const status = document.querySelector("#adminChatStatus");
  let token = "";
  const esc = value => String(value ?? "").replace(/[&<>\"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[c]);
  const draw = list => { messages.innerHTML = list.map(message => `<article class="chat-bubble ${message.sender_role === "admin" ? "mine" : "theirs"}"><strong>${message.sender_role === "admin" ? "Next Print NY" : "Customer"}</strong><p>${esc(message.body)}</p><time>${new Date(message.created_at || Date.now()).toLocaleString()}</time></article>`).join("") || "<p class=\"chat-empty\">No messages yet.</p>"; messages.scrollTop = messages.scrollHeight; };
  async function openChat(value) { token = value; status.textContent = "Loading…"; const response = await fetch(`/api/project-portal?token=${encodeURIComponent(token)}`); const data = await response.json().catch(() => ({})); if (!response.ok) { status.textContent = data.error || "Conversation could not load."; return; } title.textContent = `Messages · ${data.project.project_number}`; draw(data.messages || []); status.textContent = ""; modal.showModal(); }
  new MutationObserver(() => document.querySelectorAll("#adminPortal .file a[href^='/project/']").forEach(link => { if (link.parentElement.querySelector(".admin-chat-open")) return; const button = document.createElement("button"); button.type = "button"; button.className = "secondary admin-chat-open"; button.textContent = "Messages"; button.onclick = () => openChat(link.getAttribute("href").split("/").pop()); link.after(button); })).observe(document.querySelector("#adminPortal"), { childList:true, subtree:true });
  document.querySelector("[data-close-admin-chat]").onclick = () => modal.close();
  form.onsubmit = async event => { event.preventDefault(); const body = form.elements.message.value.trim(); if (!body || !token) return; status.textContent = "Sending…"; const response = await fetch("/api/project-portal?action=admin-message", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ token, body }) }); const data = await response.json().catch(() => ({})); if (!response.ok) { status.textContent = data.error || "Message failed to send."; return; } const current = [...messages.querySelectorAll(".chat-bubble")].map(node => ({ sender_role:node.classList.contains("mine") ? "admin" : "customer", body:node.querySelector("p").textContent, created_at:node.querySelector("time").textContent })); current.push(data.message); form.reset(); status.textContent = "Sent"; draw(current); };
  form.elements.message.onkeydown = event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); form.requestSubmit(); } };
})();
