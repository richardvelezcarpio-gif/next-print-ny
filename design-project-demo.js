(() => {
  "use strict";

  const TOKEN_PATTERN = /^dap_[A-Za-z0-9_-]{40,80}$/;
  const MAX_COMMENT_LENGTH = 2000;
  const token = new URLSearchParams(window.location.search).get("token") || "";
  const nameElement = document.querySelector("#proofProjectName");
  const statusElement = document.querySelector("#proofProjectStatus");
  const samplesGrid = document.querySelector("#proofSamplesGrid");
  const loadMessage = document.querySelector("#proofLoadMessage");
  const historySection = document.querySelector("#proofHistorySection");
  const historyList = document.querySelector("#proofResponseHistory");
  let currentProject = null;
  let submitting = false;

  if (!nameElement || !statusElement || !samplesGrid || !loadMessage) return;
  if (!TOKEN_PATTERN.test(token)) return showNotFound();
  loadProject();

  async function loadProject() {
    loadMessage.textContent = "Loading design proofs…";
    try {
      const response = await fetch(`/api/design-approval?action=public&token=${encodeURIComponent(token)}`, { cache: "no-store" });
      const data = await parseResponse(response);
      renderProject(data.project, Array.isArray(data.samples) ? data.samples : [], Array.isArray(data.history) ? data.history : []);
    } catch (error) {
      if (error.status === 404) showNotFound();
      else showError(error.message);
    }
  }

  function renderProject(project, samples, history) {
    currentProject = project;
    document.title = `${project.project_name} — Design Proof | Next Print NY`;
    setText("proofProjectName", project.project_name);
    setText("proofProjectEyebrow", `Design Proof${project.order_number ? ` • ${project.order_number}` : ""}`);
    setText("proofCustomerName", project.customer_name);
    setText("proofCustomerEmail", project.customer_email);
    setText("proofProductService", project.product_service);
    setText("proofOrderNumber", project.order_number || "Not assigned");
    setText("proofSampleCount", `${samples.length} design sample${samples.length === 1 ? "" : "s"}`);
    setText("proofDueDate", formatDate(project.due_date));
    setText("proofSamplesLabel", `${samples.length} Design Sample${samples.length === 1 ? "" : "s"}`);
    setText("proofResponseInstruction", project.status === "pending" ? "Choose one response per project" : `Response completed: ${statusLabel(project.status)}`);
    renderStatus(project.status);

    const notesSection = document.querySelector("#proofNotesSection");
    if (project.customer_notes) {
      setText("proofCustomerNotes", project.customer_notes);
      notesSection.hidden = false;
    } else {
      notesSection.hidden = true;
    }

    samplesGrid.replaceChildren();
    loadMessage.textContent = project.status === "approved"
      ? `Thank you. Version ${project.approved_version || ""} was approved successfully.`.trim()
      : project.status === "changes_requested"
        ? "Your change request was sent successfully."
        : "";
    loadMessage.className = `proof-load-message${project.status === "pending" ? "" : " is-success"}`;
    if (!samples.length) loadMessage.textContent = "No design samples have been uploaded for this project yet.";
    for (const sample of samples) samplesGrid.append(sampleCard(sample, project.status));
    renderHistory(history, project.status);
  }

  function sampleCard(sample, projectStatus) {
    const card = element("article", "sample-review-card");
    const stage = element("div", "sample-image-stage");
    stage.append(element("span", "version-pill", `Version ${sample.version}`));
    if (sample.file_type?.startsWith("image/") && sample.signed_url) {
      const img = document.createElement("img");
      img.src = sample.signed_url;
      img.alt = `${sample.file_name}, version ${sample.version}`;
      stage.append(img);
    } else {
      const pdf = element("a", "sample-pdf-preview", "Open PDF Sample");
      pdf.href = sample.signed_url || "#";
      pdf.target = "_blank";
      pdf.rel = "noreferrer";
      pdf.setAttribute("aria-label", `Open ${sample.file_name}`);
      stage.append(pdf);
    }

    const body = element("div", "sample-card-body");
    const title = element("div", "sample-title");
    const titleText = document.createElement("div");
    titleText.append(element("h3", "", sample.file_name));
    titleText.append(element("p", "", statusLabel(sample.status)));
    title.append(titleText, element("span", "", `V${sample.version}`));

    const options = element("div", "response-options");
    options.setAttribute("aria-label", `Response options for version ${sample.version}`);
    const approve = responseButton("approve-option", "✓ Approve Design", "approved");
    const changes = responseButton("changes-option", "✎ Request Changes", "changes_requested");
    options.append(approve, changes);

    const commentsLabel = document.createElement("label");
    commentsLabel.append(document.createTextNode("Comments"));
    const textarea = document.createElement("textarea");
    textarea.rows = 4;
    textarea.maxLength = MAX_COMMENT_LENGTH;
    textarea.placeholder = "Share any changes, questions or approval notes...";
    if (sample.customer_comment) textarea.value = sample.customer_comment;
    commentsLabel.append(textarea);

    const send = element("button", "send-response-button", "Send Response →");
    send.type = "button";
    const message = element("p", "sample-response-message");
    const closed = projectStatus !== "pending";
    for (const control of [approve, changes, textarea, send]) control.disabled = closed;

    approve.addEventListener("click", () => selectResponse("approved"));
    changes.addEventListener("click", () => selectResponse("changes_requested"));
    send.addEventListener("click", submitSelectedResponse);

    function selectResponse(responseType) {
      if (currentProject?.status !== "pending" || submitting) return;
      card.dataset.response = responseType;
      approve.classList.toggle("is-selected", responseType === "approved");
      changes.classList.toggle("is-selected", responseType === "changes_requested");
      textarea.required = responseType === "changes_requested";
      message.textContent = responseType === "changes_requested" ? "Describe the required changes before sending." : "Version selected for approval.";
      message.className = "sample-response-message";
      if (textarea.required) textarea.focus();
    }

    async function submitSelectedResponse() {
      const responseType = card.dataset.response;
      const comment = textarea.value.trim();
      message.className = "sample-response-message";
      if (!responseType) return showCardError("Select Approve Design or Request Changes first.");
      if (responseType === "changes_requested" && !comment) return showCardError("A comment is required when requesting changes.");
      if (comment.length > MAX_COMMENT_LENGTH) return showCardError(`Comments must be ${MAX_COMMENT_LENGTH} characters or fewer.`);
      if (submitting || currentProject?.status !== "pending") return showCardError("This project already has a completed response.");

      submitting = true;
      disableAllResponseControls(true);
      send.textContent = "Sending…";
      try {
        const data = await postResponse({ secureToken: token, version: sample.version, responseType, comment });
        renderProject(data.project, data.samples || [], data.history || []);
      } catch (error) {
        submitting = false;
        if (currentProject?.status === "pending") disableAllResponseControls(false);
        send.textContent = "Send Response →";
        showCardError(error.message || "The response could not be sent.");
      }
    }

    function showCardError(text) {
      message.textContent = text;
      message.className = "sample-response-message is-error";
    }

    body.append(title, options, commentsLabel, send, message);
    card.append(stage, body);
    return card;
  }

  function renderHistory(history, status) {
    if (!historySection || !historyList) return;
    historySection.hidden = history.length === 0;
    setText("proofCurrentState", `Current status: ${statusLabel(status)}`);
    historyList.replaceChildren();
    for (const response of history) {
      const item = element("article", "response-history-item");
      const heading = element("div", "response-history-heading");
      heading.append(statusBadge(response.response_type), element("strong", "", `Version ${response.version || "—"}`));
      item.append(heading);
      if (response.customer_comment) item.append(element("p", "", response.customer_comment));
      item.append(element("time", "", formatDateTime(response.responded_at)));
      historyList.append(item);
    }
  }

  function responseButton(className, label, responseType) {
    const button = element("button", className, label);
    button.type = "button";
    button.dataset.responseType = responseType;
    return button;
  }

  function disableAllResponseControls(disabled) {
    document.querySelectorAll(".response-options button, .sample-card-body textarea, .send-response-button").forEach((control) => { control.disabled = disabled; });
  }

  async function postResponse(body) {
    const response = await fetch("/api/design-approval?action=respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return parseResponse(response);
  }

  async function parseResponse(response) {
    let data = {};
    try { data = await response.json(); } catch { data = {}; }
    if (!response.ok) {
      const error = new Error(data.error || "The request could not be completed.");
      error.status = response.status;
      throw error;
    }
    return data;
  }

  function renderStatus(status) {
    const values = {
      approved: ["status-approved", "Approved"],
      changes_requested: ["status-changes", "Changes Requested"],
      pending: ["status-pending", "Pending Review"],
    };
    const [className, label] = values[status] || values.pending;
    statusElement.className = `status-badge ${className}`;
    statusElement.replaceChildren(element("i"), document.createTextNode(label));
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

  function showNotFound() {
    document.title = "Project Not Found | Next Print NY";
    nameElement.textContent = "Project not found";
    loadMessage.textContent = "This design proof link is invalid or no longer available.";
    samplesGrid.replaceChildren();
    document.querySelector(".proof-project-summary")?.setAttribute("hidden", "");
    document.querySelector("#proofNotesSection")?.setAttribute("hidden", "");
    document.querySelector(".samples-heading")?.setAttribute("hidden", "");
    historySection?.setAttribute("hidden", "");
  }

  function showError(message) {
    nameElement.textContent = "Design proof unavailable";
    loadMessage.textContent = message || "The project could not be loaded.";
    loadMessage.className = "proof-load-message is-error";
    samplesGrid.replaceChildren();
  }

  function statusLabel(status) {
    if (status === "approved") return "Approved";
    if (status === "changes_requested") return "Changes Requested";
    return "Pending Review";
  }

  function formatDate(value) {
    if (!value) return "Not specified";
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? "Not specified" : date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }

  function formatDateTime(value) {
    const date = new Date(value || "");
    return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
  }

  function setText(id, value) {
    const node = document.getElementById(id);
    if (node) node.textContent = String(value ?? "");
  }

  function element(tagName, className = "", text = "") {
    const node = document.createElement(tagName);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }
})();
