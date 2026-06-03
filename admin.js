const loginView = document.querySelector("#loginView");
const dashboardView = document.querySelector("#dashboardView");
const loginForm = document.querySelector("#loginForm");
const loginStatus = document.querySelector("#loginStatus");
const recordForm = document.querySelector("#recordForm");
const recordStatus = document.querySelector("#recordStatus");
const recordsList = document.querySelector("#recordsList");
const recordCount = document.querySelector("#recordCount");
const sessionEmail = document.querySelector("#sessionEmail");
const logoutButton = document.querySelector("#logoutButton");
const refreshButton = document.querySelector("#refreshButton");
const filterButtons = document.querySelectorAll("[data-filter]");
const openOrders = document.querySelector("#openOrders");
const incomeTotal = document.querySelector("#incomeTotal");
const expenseTotal = document.querySelector("#expenseTotal");
const balanceTotal = document.querySelector("#balanceTotal");

const typeLabels = {
  order: "Pedido",
  income: "Ingreso",
  expense: "Gasto",
  inventory: "Inventario",
  customer: "Cliente",
  document: "Documento",
};

const statusLabels = {
  new: "Nuevo",
  in_progress: "En proceso",
  waiting: "Esperando",
  paid: "Pagado",
  completed: "Completado",
  cancelled: "Cancelado",
};

let records = [];
let activeFilter = "all";

init();

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus(loginStatus, "Entrando...", "");

  const submitButton = loginForm.querySelector("button");
  submitButton.disabled = true;

  try {
    const body = Object.fromEntries(new FormData(loginForm));
    const { response, data } = await fetchJson("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error(data.error || "No se pudo entrar");
    await showDashboard(data.email);
  } catch (error) {
    setStatus(loginStatus, error.message, "error");
  } finally {
    submitButton.disabled = false;
  }
});

recordForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus(recordStatus, "Guardando...", "");

  const submitButton = recordForm.querySelector("button");
  submitButton.disabled = true;

  try {
    const body = Object.fromEntries(new FormData(recordForm));
    const { response, data } = await fetchJson("/api/business-records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error(data.error || "No se pudo guardar");
    recordForm.reset();
    setStatus(recordStatus, "Registro guardado.", "success");
    await loadRecords();
  } catch (error) {
    setStatus(recordStatus, error.message, "error");
  } finally {
    submitButton.disabled = false;
  }
});

logoutButton?.addEventListener("click", async () => {
  await fetch("/api/admin-logout", { method: "POST" });
  dashboardView.hidden = true;
  loginView.hidden = false;
});

refreshButton?.addEventListener("click", loadRecords);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderRecords();
  });
});

recordsList?.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;

  if (action === "complete") {
    await updateRecord(id, { status: "completed" });
  }

  if (action === "delete") {
    await deleteRecord(id);
  }
});

async function init() {
  try {
    const { data } = await fetchJson("/api/admin-login");

    if (data.authenticated) {
      await showDashboard(data.email);
    } else {
      loginView.hidden = false;
      dashboardView.hidden = true;
    }
  } catch {
    loginView.hidden = false;
    dashboardView.hidden = true;
  }
}

async function showDashboard(email) {
  loginView.hidden = true;
  dashboardView.hidden = false;
  sessionEmail.textContent = email ? `Sesión: ${email}` : "Sesión privada";
  await loadRecords();
}

async function loadRecords() {
  refreshButton.disabled = true;

  try {
    const { response, data } = await fetchJson("/api/business-records");

    if (!response.ok) throw new Error(data.error || "No se pudieron cargar los registros");
    records = Array.isArray(data.records) ? data.records : [];
    renderRecords();
    setStatus(recordStatus, "", "");
  } catch (error) {
    records = [];
    renderRecords();
    setStatus(recordStatus, error.message, "error");
  } finally {
    refreshButton.disabled = false;
  }
}

async function updateRecord(id, changes) {
  const { response, data } = await fetchJson("/api/business-records", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...changes }),
  });

  if (!response.ok) {
    setStatus(recordStatus, data.error || "No se pudo actualizar", "error");
    return;
  }

  await loadRecords();
}

async function deleteRecord(id) {
  const { response, data } = await fetchJson(`/api/business-records?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    setStatus(recordStatus, data.error || "No se pudo borrar", "error");
    return;
  }

  await loadRecords();
}

async function fetchJson(url, options = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      ...options,
      cache: "no-store",
      signal: controller.signal,
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    return { response, data };
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("El servidor tardó demasiado. Refresca la página e intenta otra vez.");
    }

    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

function renderRecords() {
  renderMetrics();

  const visibleRecords =
    activeFilter === "all" ? records : records.filter((record) => record.type === activeFilter);

  recordCount.textContent = `${visibleRecords.length} ${visibleRecords.length === 1 ? "registro" : "registros"}`;

  if (!visibleRecords.length) {
    recordsList.innerHTML = `<div class="empty-state">No hay registros en esta sección.</div>`;
    return;
  }

  recordsList.innerHTML = visibleRecords.map(renderRecord).join("");
}

function renderRecord(record) {
  const amount = Number(record.amount || 0);
  const quantity = Number(record.quantity || 0);
  const createdAt = record.created_at ? new Date(record.created_at).toLocaleString("es-US") : "";
  const fileLink = record.file_url
    ? `<a href="${escapeAttribute(record.file_url)}" target="_blank" rel="noreferrer">Abrir archivo</a>`
    : "";

  return `
    <article class="record-card">
      <div class="record-top">
        <div>
          <h3 class="record-title">${escapeHtml(record.title || "Sin título")}</h3>
          <p class="record-meta">${escapeHtml(record.customer_name || "Sin cliente")} ${record.customer_phone ? `- ${escapeHtml(record.customer_phone)}` : ""}</p>
        </div>
        <strong>${amount ? money(amount) : ""}</strong>
      </div>
      <div class="pill-row">
        <span class="pill">${typeLabels[record.type] || record.type}</span>
        <span class="pill">${statusLabels[record.status] || record.status}</span>
        ${quantity ? `<span class="pill">Cant. ${quantity}</span>` : ""}
        ${record.due_date ? `<span class="pill">${escapeHtml(record.due_date)}</span>` : ""}
      </div>
      ${record.description ? `<p class="record-description">${escapeHtml(record.description)}</p>` : ""}
      <p class="record-meta">${createdAt}</p>
      <div class="record-actions">
        <button class="complete-button" type="button" data-action="complete" data-id="${escapeAttribute(record.id)}">Completar</button>
        ${fileLink}
        <button class="delete-button" type="button" data-action="delete" data-id="${escapeAttribute(record.id)}">Borrar</button>
      </div>
    </article>
  `;
}

function renderMetrics() {
  const openOrderCount = records.filter(
    (record) => record.type === "order" && !["completed", "cancelled"].includes(record.status)
  ).length;
  const income = sumByType("income");
  const expenses = sumByType("expense");

  openOrders.textContent = openOrderCount;
  incomeTotal.textContent = money(income);
  expenseTotal.textContent = money(expenses);
  balanceTotal.textContent = money(income - expenses);
}

function sumByType(type) {
  return records
    .filter((record) => record.type === type)
    .reduce((total, record) => total + Number(record.amount || 0), 0);
}

function setStatus(element, message, tone) {
  element.textContent = message;
  element.className = `status-text ${tone || ""}`.trim();
}

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value || 0);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}
