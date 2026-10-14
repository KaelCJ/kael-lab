(() => {
  const body = document.body;
  const viewButtons = [...document.querySelectorAll("[data-view-target]")];
  const themeButtons = [...document.querySelectorAll("[data-theme-target]")];
  const nodes = [...document.querySelectorAll("[data-node]")];
  const slides = [...document.querySelectorAll("[data-slide]")];
  const previousButton = document.querySelector("[data-slide-prev]");
  const nextButton = document.querySelector("[data-slide-next]");
  const page = document.querySelector("[data-slide-page]");
  const progress = document.querySelector("[data-slide-progress]");
  let slideIndex = 0;

  function setView(view, options = {}) {
    if (!viewButtons.some(button => button.dataset.viewTarget === view)) return;
    body.dataset.view = view;
    viewButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.viewTarget === view)));
    if (view === "briefing") renderSlide(slideIndex);
    if (options.focus) {
      const panel = document.querySelector(`[data-view-panel="${view}"]`);
      panel?.focus({ preventScroll: true });
    }
  }

  function setTheme(theme) {
    if (!themeButtons.some(button => button.dataset.themeTarget === theme)) return;
    body.dataset.theme = theme;
    themeButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.themeTarget === theme)));
  }

  function selectNode(node) {
    if (!node) return;
    nodes.forEach(candidate => {
      const selected = candidate === node;
      candidate.classList.toggle("is-selected", selected);
      candidate.setAttribute("aria-pressed", String(selected));
    });
    const inspector = document.querySelector("[data-inspector]");
    if (!inspector) return;
    const state = inspector.querySelector("[data-inspector-state]");
    inspector.querySelector("[data-inspector-index]").textContent = node.dataset.index || "NODE";
    inspector.querySelector("[data-inspector-title]").textContent = node.dataset.title || node.textContent.trim();
    inspector.querySelector("[data-inspector-detail]").textContent = node.dataset.detail || "选择节点查看责任说明。";
    inspector.querySelector("[data-inspector-owner]").textContent = node.dataset.owner || "页面公开派生表达";
    inspector.querySelector("[data-inspector-boundary]").textContent = node.dataset.boundary || "不由静态页面证明真实运行能力。";
    state.textContent = node.dataset.state || "PUBLIC VIEW";
    state.className = `status-chip ${node.dataset.stateClass || ""}`.trim();
  }

  function renderSlide(index) {
    if (!slides.length) return;
    slideIndex = Math.max(0, Math.min(index, slides.length - 1));
    slides.forEach((slide, candidateIndex) => {
      const active = candidateIndex === slideIndex;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    if (page) page.textContent = `${String(slideIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    if (progress) progress.style.transform = `scaleX(${(slideIndex + 1) / slides.length})`;
    if (previousButton) previousButton.disabled = slideIndex === 0;
    if (nextButton) nextButton.disabled = slideIndex === slides.length - 1;
  }

  function stepSlide(delta) {
    renderSlide(slideIndex + delta);
  }

  viewButtons.forEach(button => button.addEventListener("click", () => setView(button.dataset.viewTarget)));
  themeButtons.forEach(button => button.addEventListener("click", () => setTheme(button.dataset.themeTarget)));
  nodes.forEach(node => node.addEventListener("click", () => selectNode(node)));
  previousButton?.addEventListener("click", () => stepSlide(-1));
  nextButton?.addEventListener("click", () => stepSlide(1));

  document.addEventListener("keydown", event => {
    if (body.dataset.view !== "briefing" || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) return;
    if (["ArrowRight", "ArrowDown", "PageDown"].includes(event.key)) { event.preventDefault(); stepSlide(1); }
    if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) { event.preventDefault(); stepSlide(-1); }
    if (event.key === "Home") { event.preventDefault(); renderSlide(0); }
    if (event.key === "End") { event.preventDefault(); renderSlide(slides.length - 1); }
  });

  setView(body.dataset.view || "architecture");
  setTheme(body.dataset.theme || "paper");
  selectNode(nodes.find(node => node.classList.contains("is-selected")) || nodes[0]);
  renderSlide(0);
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
