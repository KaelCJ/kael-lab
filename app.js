(() => {
  const ecosystems = {
    kael: { index: "01 / KAEL", state: "PUBLIC METHOD", title: "让人的目标和判断始终在场", copy: "Kael 负责协作方法、工作项、知识准入与证据判断。Agent 可以分析和建议，但不能把推断写成人的决定。", points: ["工作项", "来源", "证据", "最终判断"], href: "#method", link: "进入 Kael 方法 →", stateClass: "current" },
    meepo: { index: "02 / MEEPO", state: "CURRENT PRACTICE", title: "让 Agent 产品在真实工程里长出来", copy: "Meepo 是 Agent 产品、Workbench 与运行能力的孵化实践。它承担实现和验证，但不替代 Kael 的方法所有权，也不替代 Lanox 的品牌表达。", points: ["Agent 产品", "Workbench", "运行能力", "实践证据"], href: "help/index.html?topic=collaboration", link: "进入人机协作帮助 →", stateClass: "current" },
    nest: { index: "03 / JUGG · NEST", state: "ENGINEERING", title: "把工程经验变成可复用能力和可靠知识", copy: "Jugg / Nest 保存工程事实、组件经验与知识产品。知识库让用户从目录、文档和来源出发，得到能够继续行动的答案。", points: ["工程事实", "能力资产", "知识库", "来源"], href: "help/index.html?topic=nest", link: "进入 Nest 知识库帮助 →", stateClass: "current" },
    lanox: { index: "04 / LANOX", state: "DIRECTION", title: "把能力组织成未来技术品牌和产品矩阵", copy: "Lanox 面向未来的通用 Agent、垂直领域产品、Agent Framework、企业能力与基础设施价值。页面区分 Current、Direction 与 Roadmap。", points: ["通用 Agent", "垂直产品", "Framework", "品牌"], href: "lanox/index.html", link: "进入 Lanox →", stateClass: "direction" }
  };
  const cards = [...document.querySelectorAll("[data-ecosystem]")];
  const detail = document.querySelector("[data-ecosystem-detail]");
  function selectEcosystem(key) {
    const item = ecosystems[key];
    if (!item || !detail) return;
    cards.forEach(card => { const active = card.dataset.ecosystem === key; card.classList.toggle("is-active", active); card.setAttribute("aria-pressed", String(active)); });
    detail.querySelector("[data-detail-index]").textContent = item.index;
    const state = detail.querySelector("[data-detail-state]");
    state.textContent = item.state; state.className = `card-state ${item.stateClass}`;
    detail.querySelector("[data-detail-title]").textContent = item.title;
    detail.querySelector("[data-detail-copy]").textContent = item.copy;
    detail.querySelector("[data-detail-points]").innerHTML = item.points.map(point => `<span>${point}</span>`).join("");
    const link = detail.querySelector("[data-detail-link]"); link.href = item.href; link.textContent = item.link;
  }
  cards.forEach(card => card.addEventListener("click", () => selectEcosystem(card.dataset.ecosystem)));

  const cases = [
    { origin: "用户输入", text: "“先看公开站点的物理限制，再评估能做到多大。”", answer: "source", explanation: "这是提出者的原始要求。它决定研究顺序，但本身不是平台限制的事实证据。" },
    { origin: "官方文档核对", text: "静态托管发布的是公开文件，不适合保存私密凭据与服务端状态。", answer: "fact", explanation: "这是能够回到平台约束和公开文件特性核对的事实。" },
    { origin: "工程分析", text: "多人共享运行状态需要独立服务，而不是继续堆在静态页面里。", answer: "inference", explanation: "这是由静态边界推导的工程判断，合理但不是已实现事实。" },
    { origin: "方案记录", text: "首版只做公开 Concept Mock，不连接真实 Workspace 或模型。", answer: "decision", explanation: "这是在安全、范围和展示目标之间作出的明确选择。" },
    { origin: "运行结果", text: "真实发布地址可以在桌面和移动端打开，控制台没有页面错误。", answer: "fact", explanation: "只有完成真实部署并实际观察后，这句话才能成为当前运行事实。" },
    { origin: "未来讨论", text: "如果实验需要多人协作，后续可能拆出受控服务。", answer: "inference", explanation: "这是条件化推断，不是既定路线，也不是已经发生的实现。" }
  ];
  const lab = document.querySelector("[data-evidence-lab]");
  if (lab) {
    let index = 0, score = 0;
    const bestKey = "kael-lab:v2:evidence-best";
    const getBest = () => Number.parseInt(localStorage.getItem(bestKey) || "0", 10);
    const answers = [...lab.querySelectorAll("[data-answer]")];
    const card = lab.querySelector(".case-card"), grid = lab.querySelector(".answer-grid"), feedback = lab.querySelector("[data-feedback]"), complete = lab.querySelector("[data-complete]");
    function render() {
      const item = cases[index];
      lab.querySelector("[data-case-number]").textContent = `${String(index + 1).padStart(2,"0")} / ${String(cases.length).padStart(2,"0")}`;
      lab.querySelector("[data-score]").textContent = String(score).padStart(2,"0");
      lab.querySelector("[data-best]").textContent = getBest() ? `${getBest()} / ${cases.length}` : "—";
      lab.querySelector("[data-lab-progress]").style.width = `${((index + 1) / cases.length) * 100}%`;
      lab.querySelector("[data-case-origin]").textContent = item.origin; lab.querySelector("[data-case-text]").textContent = item.text;
      feedback.hidden = true; answers.forEach(button => { button.disabled = false; button.classList.remove("correct","wrong"); });
    }
    answers.forEach(button => button.addEventListener("click", () => {
      const item = cases[index], correct = button.dataset.answer === item.answer; if (correct) score += 1;
      lab.querySelector("[data-score]").textContent = String(score).padStart(2,"0");
      answers.forEach(candidate => { candidate.disabled = true; if (candidate.dataset.answer === item.answer) candidate.classList.add("correct"); });
      if (!correct) button.classList.add("wrong");
      lab.querySelector("[data-feedback-title]").textContent = correct ? "判断正确" : "这次分类不准确";
      lab.querySelector("[data-feedback-copy]").textContent = item.explanation;
      lab.querySelector("[data-next]").textContent = index === cases.length - 1 ? "查看结果 →" : "下一题 →"; feedback.hidden = false;
    }));
    lab.querySelector("[data-next]").addEventListener("click", () => {
      if (index < cases.length - 1) { index += 1; render(); card.scrollIntoView({ block: "center" }); return; }
      localStorage.setItem(bestKey, String(Math.max(score, getBest()))); card.hidden = true; grid.hidden = true; feedback.hidden = true; complete.hidden = false;
      lab.querySelector("[data-final-score]").textContent = `${score} / ${cases.length}`;
      lab.querySelector("[data-final-copy]").textContent = score === cases.length ? "你已经能稳定地区分来源、事实、推断和决定。" : "分类的价值在于阻止推断伪装成事实、建议伪装成人的决定。";
    });
    lab.querySelector("[data-restart]").addEventListener("click", () => { index = 0; score = 0; complete.hidden = true; card.hidden = false; grid.hidden = false; render(); });
    render();
  }
  selectEcosystem("kael");
  document.querySelector("[data-year]").textContent = new Date().getFullYear();
})();
