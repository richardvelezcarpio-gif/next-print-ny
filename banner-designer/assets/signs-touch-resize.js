(() => {
  const mobileQuery = window.matchMedia("(max-width: 760px)");
  let activeResize = null;

  function resizeHandleFrom(target) {
    const canvasItem = target.closest?.(".canvas-item.selected");
    if (!canvasItem) return null;

    let element = target;
    while (element && element !== canvasItem) {
      if (window.getComputedStyle(element).cursor.includes("resize")) return element;
      element = element.parentElement;
    }

    return null;
  }

  function mouseEvent(type, target, point) {
    target.dispatchEvent(
      new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        view: window,
        button: 0,
        buttons: type === "mouseup" ? 0 : 1,
        clientX: point.clientX,
        clientY: point.clientY,
      })
    );
  }

  function startResize(event, point, sourceId) {
    if (!mobileQuery.matches) return;

    const handle = resizeHandleFrom(event.target);
    if (!handle) return;

    event.preventDefault();
    event.stopPropagation();
    activeResize = { handle, sourceId };
    document.body.classList.add("np-touch-resizing");
    mouseEvent("mousedown", handle, point);
  }

  function moveResize(event, point, sourceId) {
    if (!activeResize || activeResize.sourceId !== sourceId) return;
    event.preventDefault();
    mouseEvent("mousemove", document, point);
  }

  function stopResize(event, point, sourceId) {
    if (!activeResize || activeResize.sourceId !== sourceId) return;
    event.preventDefault();
    mouseEvent("mouseup", document, point);
    activeResize = null;
    document.body.classList.remove("np-touch-resizing");
  }

  if (window.PointerEvent) {
    document.addEventListener(
      "pointerdown",
      (event) => {
        if (event.pointerType === "touch") startResize(event, event, event.pointerId);
      },
      { capture: true, passive: false }
    );
    document.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerType === "touch") moveResize(event, event, event.pointerId);
      },
      { capture: true, passive: false }
    );
    document.addEventListener(
      "pointerup",
      (event) => {
        if (event.pointerType === "touch") stopResize(event, event, event.pointerId);
      },
      { capture: true, passive: false }
    );
    document.addEventListener(
      "pointercancel",
      (event) => {
        if (event.pointerType === "touch") stopResize(event, event, event.pointerId);
      },
      { capture: true, passive: false }
    );
  } else {
    document.addEventListener(
      "touchstart",
      (event) => {
        const point = event.changedTouches[0];
        if (point) startResize(event, point, point.identifier);
      },
      { capture: true, passive: false }
    );
    document.addEventListener(
      "touchmove",
      (event) => {
        const point = event.changedTouches[0];
        if (point) moveResize(event, point, point.identifier);
      },
      { capture: true, passive: false }
    );
    document.addEventListener(
      "touchend",
      (event) => {
        const point = event.changedTouches[0];
        if (point) stopResize(event, point, point.identifier);
      },
      { capture: true, passive: false }
    );
    document.addEventListener(
      "touchcancel",
      (event) => {
        const point = event.changedTouches[0];
        if (point) stopResize(event, point, point.identifier);
      },
      { capture: true, passive: false }
    );
  }
})();
