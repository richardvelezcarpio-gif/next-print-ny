(() => {
  "use strict";

  const MAX_FILE_BYTES = 25 * 1024 * 1024;
  const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "application/pdf"]);
  const form = document.querySelector("#designProjectForm");
  const fileInput = document.querySelector("#designFileInput");
  const dropZone = document.querySelector("#designDropZone");
  const browseButton = document.querySelector("#browseDesignFiles");
  const selectedFilesElement = document.querySelector("#selectedDesignFiles");
  const saveButton = document.querySelector("#saveDesignProject");
  const saveLabel = saveButton?.querySelector(".save-project-label");
  const messageElement = document.querySelector("#designSaveMessage");
  const projectsBody = document.querySelector("#designProjectsBody");
  const projectSearch = document.querySelector("#projectSearch");
  const adminPanel = document.querySelector("#adminResponsePanel");
  const adminHistory = document.querySelector("#adminResponseHistory");
  const adminSummary = document.querySelector("#adminResponseSummary");
  const adminMessage = document.querySelector("#adminResponseMessage");
  const reopenButton = document.querySelector("#reopenDesignProject");

  if (!form || !fileInput || !dropZone || !saveButton || !projectsBody) return;

  let selectedFiles = [];
  let projects = [];
  let pendingProjectToken = null;
  let managedProjectToken = null;

  browseButton.addEventListener("click", (event) => {
    event.stopPropagation();
    fileInput.click();
  });
  dropZone.addEventListener("click", () => fileInput.click());
  dropZone.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      fileInput.click();
    }
  });
  fileInput.addEventListener("change", () => addFiles(fileInput.files));

  for (const eventName of ["dragenter", "dragover"]) {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.add("is-dragging");
    });
  }
  for (const eventName of ["dragleave", "drop"]) {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.remove("is-dragging");
    });
  }
  dropZone.addEventListener("drop", (event) => addFiles(event.dataTransfer?.files));
  saveButton.addEventListener("click", saveProject);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    saveProject();
  });
  projectSearch?.addEventListener("input", renderProjects);
  document.querySelector("#closeAdminResponsePanel")?.addEventListener("click", () => { adminPanel.hidden = true; });
  reopenButton?.addEventListener("click", reopenManagedProject);

  loadProjects();

  function addFiles(fileList) {
    const incoming = Array.from(fileList || []);
    const errors = [];

    for (const file of incoming) {
      const error = fileValidationError(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
        continue;
      }
      const duplicate = selectedFiles.some(
        (item) => item.file.name === file.name && item.file.size === file.size && item.file.lastModified === file.lastModified,
      );
      if (!duplicate) {
        selectedFiles.push({
          id: crypto.randomUUID(),
          file,
          previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
          status: "Ready",
        });
      }
    }

    fileInput.value = "";
    renderSelectedFiles();
    if (errors.length) showMessage(errors.join(" "), "error");
  }

  function renderSelectedFiles() {
    selectedFilesElement.replaceChildren();
    for (const item of selectedFiles) {
      const row = element("div", "selected-file-row");
      const preview = item.previewUrl
        ? image(item.previewUrl, `${item.file.name} preview`, "selected-file-preview")
        : element("span", "selected-file-pdf", "PDF");
      const details = element("div", "selected-file-details");
      details.append(element("strong", "", item.file.name));
      details.append(element("small", "", `${formatBytes(item.file.size)} • ${item.status}`));
      const remove = element("button", "selected-file-remove", "Remove");
      remove.type = "button";
      remove.disabled = item.status === "Uploading…";
      remove.addEventListener("click", () => removeSelectedFile(item.id));
      row.append(preview, details, remove);
      selectedFilesElement.append(row);
    }
  }

  function removeSelectedFile(id) {
    const item = selectedFiles.find((candidate) => candidate.id === id);
    if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
    selectedFiles = selectedFiles.filter((candidate) => candidate.id !== id);
    renderSelectedFiles();
  }

  async function saveProject() {
    clearMessage();
    if (!form.reportValidity()) return;

    setSaving(true);
    try {
      if (!pendingProjectToken) {
        const created = await api("create", {
          projectName: value("projectName"),
          customerName: value("customerName"),
          customerEmail: value("customerEmail"),
          productService: value("productService"),
          orderNumber: value("orderNumber"),
          dueDate: value("dueDate"),
          customerNotes: value("customerNotes"),
        });
        pendingProjectToken = created.project.secure_token;
      }

      const failures = [];
      for (const item of [...selectedFiles]) {
        try {
          item.status = "Uploading…";
          renderSelectedFiles();
          const signed = await api("sign-upload", {
            secureToken: pendingProjectToken,
            fileName: item.file.name,
            fileType: item.file.type,
            fileSize: item.file.size,
          });
          await uploadFile(signed.signedUrl, item.file);
          item.status = "Saving sample…";
          renderSelectedFiles();
          await api("register-sample", {
            secureToken: pendingProjectToken,
            uploadToken: signed.uploadToken,
          });
          removeSelectedFile(item.id);
        } catch (error) {
          item.status = "Upload failed";
          failures.push(`${item.file.name}: ${error.message}`);
          renderSelectedFiles();
        }
      }

      if (failures.length) {
        showMessage(`The project was created, but some samples need to be retried. ${failures.join(" ")}`, "error");
        if (saveLabel) saveLabel.textContent = "Retry Uploads";
        return;
      }

      form.reset();
      pendingProjectToken = null;
      if (saveLabel) saveLabel.textContent = "New Project";
      showMessage("Project and samples saved successfully.", "success");
      await loadProjects();
    } catch (error) {
      showMessage(error.message || "The project could not be saved.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function uploadFile(signedUrl, file) {
    const body = new FormData();
    body.append("cacheControl", "3600");
    body.append("", file);
    const response = await fetch(signedUrl, { method: "PUT", body });
    if (!response.ok) {
      let message = "The file upload failed.";
      try {
        const data = await response.json();
        message = data.message || data.error || message;
      } catch {
        // Preserve the safe fallback.
      }
      throw new Error(message);
    }
  }

  async function loadProjects() {
    projectsBody.replaceChildren(tableMessage("Loading projects…"));
    try {
      const data = await apiGet("list");
      projects = Array.isArray(data.projects) ? data.projects : [];
      renderProjects();
    } catch (error) {
      projects = [];
      projectsBody.replaceChildren(tableMessage(error.message || "Projects could not be loaded."));
    }
  }

  function renderProjects() {
    const term = String(projectSearch?.value || "").trim().toLowerCase();
    const filtered = projects.filter((project) =>
      [project.project_name, project.customer_name, project.customer_email, project.order_number]
        .some((value) => String(value || "").toLowerCase().includes(term)),
    );

    projectsBody.replaceChildren();
    if (!filtered.length) {
      projectsBody.append(tableMessage(term ? "No projects match this search." : "No projects have been created yet."));
      return;
    }

    for (const project of filtered) projectsBody.append(projectRow(project));
  }

  function projectRow(project) {
    const samples = Array.isArray(project.samples) ? project.samples : [];
    const firstSample = samples[0];
    const row = document.createElement("tr");

    const previewCell = cell("Preview");
    if (firstSample?.signed_url && firstSample.file_type?.startsWith("image/")) {
      previewCell.append(image(firstSample.signed_url, `${project.project_name} preview`, "proof-thumbnail"));
    } else {
      previewCell.append(element("span", "proof-thumbnail-placeholder", firstSample?.file_type === "application/pdf" ? "PDF" : "—"));
    }

    const projectCell = cell("Project");
    projectCell.append(element("strong", "", project.project_name));
    projectCell.append(element("small", "", `${project.product_service}\n⇧ ${samples.length} sample${samples.length === 1 ? "" : "s"} uploaded`));

    const customerCell = cell("Customer");
    customerCell.append(element("strong", "", project.customer_name));
    customerCell.append(element("small", "", project.customer_email));

    const orderCell = cell("Order #", project.order_number || "—");
    const sampleCell = cell("Samples");
    sampleCell.append(element("span", "sample-count", `▧  ${samples.length}`));

    const statusCell = cell("Status");
    statusCell.append(statusBadge(project.status));
    if (project.latest_response) statusCell.append(element("small", "project-latest-response", `V${project.latest_response.version || "—"} • ${project.latest_response.customer_comment || statusText(project.latest_response.response_type)}`));

    const date = new Date(project.updated_at);
    const updatedCell = cell("Updated");
    updatedCell.append(element("strong", "", Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })));
    updatedCell.append(element("small", "", Number.isNaN(date.getTime()) ? "" : date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })));

    const actionsCell = cell("Actions");
    const link = element("a", "view-project-button view-project-outline", "◉  View Project");
    link.href = `design-project-demo.html?token=${encodeURIComponent(project.secure_token)}`;
    const manage = element("button", "view-project-button view-project-outline manage-project-button", "History");
    manage.type = "button";
    manage.addEventListener("click", () => showAdminHistory(project.secure_token));
    actionsCell.append(link, manage);

    row.append(previewCell, projectCell, customerCell, orderCell, sampleCell, statusCell, updatedCell, actionsCell);
    return row;
  }

  function statusBadge(status) {
    const values = {
      approved: ["status-approved", "Approved"],
      changes_requested: ["status-changes", "Changes Requested"],
      pending: ["status-pending", "Pending Review"],
    };
    const [className, label] = values[status] || values.pending;
    return element("span", `status-badge ${className}`, label);
  }

  function showAdminHistory(secureToken) {
    const project = projects.find((candidate) => candidate.secure_token === secureToken);
    if (!project || !adminPanel || !adminHistory || !adminSummary) return;
    managedProjectToken = secureToken;
    adminPanel.hidden = false;
    setElementText("adminResponseProjectName", project.project_name);
    adminMessage.textContent = "";
    adminMessage.className = "design-save-message";
    adminSummary.replaceChildren();
    adminSummary.append(summaryItem("Current Status", statusText(project.status)));
    adminSummary.append(summaryItem("Last Response", formatDateTime(project.last_response_at)));
    adminSummary.append(summaryItem("Latest Comment", project.latest_response?.customer_comment || "No comment"));
    adminSummary.append(summaryItem("Related Version", project.latest_response?.version ? `Version ${project.latest_response.version}` : "—"));
    adminHistory.replaceChildren();
    const history = Array.isArray(project.history) ? project.history : [];
    if (!history.length) adminHistory.append(element("p", "history-empty", "No customer responses yet."));
    for (const response of history) adminHistory.append(historyItem(response));
    reopenButton.disabled = project.status === "pending";
    reopenButton.textContent = project.status === "pending" ? "Project Is Open" : "Reopen Project";
    adminPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  async function reopenManagedProject() {
    if (!managedProjectToken || reopenButton.disabled) return;
    reopenButton.disabled = true;
    reopenButton.textContent = "Reopening…";
    try {
      await api("reopen", { secureToken: managedProjectToken });
      adminMessage.textContent = "Project reopened successfully. The customer can respond again.";
      adminMessage.className = "design-save-message is-success";
      await loadProjects();
      showAdminHistory(managedProjectToken);
    } catch (error) {
      adminMessage.textContent = error.message || "The project could not be reopened.";
      adminMessage.className = "design-save-message is-error";
      reopenButton.disabled = false;
      reopenButton.textContent = "Reopen Project";
    }
  }

  function summaryItem(label, value) {
    const item = element("div", "admin-summary-item");
    item.append(element("span", "", label), element("strong", "", value));
    return item;
  }

  function historyItem(response) {
    const item = element("article", "response-history-item");
    const heading = element("div", "response-history-heading");
    heading.append(statusBadge(response.response_type), element("strong", "", response.version ? `Version ${response.version}` : "Version unavailable"));
    item.append(heading);
    if (response.customer_comment) item.append(element("p", "", response.customer_comment));
    item.append(element("time", "", formatDateTime(response.responded_at)));
    return item;
  }

  function statusText(status) {
    if (status === "approved") return "Approved";
    if (status === "changes_requested") return "Changes Requested";
    return "Pending Review";
  }

  function formatDateTime(value) {
    const date = new Date(value || "");
    if (Number.isNaN(date.getTime())) return "No response yet";
    return date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
  }

  function setElementText(id, value) {
    const node = document.getElementById(id);
    if (node) node.textContent = String(value || "");
  }

  async function api(action, body) {
    const response = await fetch(`/api/design-approval?action=${encodeURIComponent(action)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return parseResponse(response);
  }

  async function apiGet(action) {
    return parseResponse(await fetch(`/api/design-approval?action=${encodeURIComponent(action)}`, { cache: "no-store" }));
  }

  async function parseResponse(response) {
    let data = {};
    try {
      data = await response.json();
    } catch {
      // Use the fallback below.
    }
    if (!response.ok) throw new Error(data.error || "The request could not be completed.");
    return data;
  }

  function setSaving(saving) {
    saveButton.disabled = saving;
    form.setAttribute("aria-busy", String(saving));
    if (saveLabel && saving) saveLabel.textContent = pendingProjectToken ? "Uploading…" : "Saving…";
    if (saveLabel && !saving && pendingProjectToken) saveLabel.textContent = "Retry Uploads";
    if (saveLabel && !saving && !pendingProjectToken && saveLabel.textContent === "Saving…") saveLabel.textContent = "New Project";
  }

  function fileValidationError(file) {
    if (!ALLOWED_TYPES.has(file.type)) return "Only JPG, JPEG, PNG and PDF files are allowed.";
    if (!file.size) return "The file is empty.";
    if (file.size > MAX_FILE_BYTES) return "The file is larger than 25 MB.";
    return "";
  }

  function showMessage(message, type) {
    messageElement.textContent = message;
    messageElement.className = `design-save-message is-${type}`;
  }

  function clearMessage() {
    messageElement.textContent = "";
    messageElement.className = "design-save-message";
  }

  function value(id) {
    return String(document.getElementById(id)?.value || "").trim();
  }

  function cell(label, text) {
    const td = document.createElement("td");
    td.dataset.label = label;
    if (text !== undefined) td.textContent = text;
    return td;
  }

  function tableMessage(message) {
    const row = document.createElement("tr");
    const td = element("td", "projects-empty-state", message);
    td.colSpan = 8;
    row.append(td);
    return row;
  }

  function element(tagName, className = "", text = "") {
    const node = document.createElement(tagName);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function image(src, alt, className) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.className = className;
    return img;
  }

  function formatBytes(bytes) {
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
})();
