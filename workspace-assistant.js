const personas = {
  newcomer: { note: "我刚进入一个复杂工作空间，不知道当前事实和下一步。", defaultScenario: "next" },
  lead: { note: "我负责目标和关键取舍，需要纠正 Agent、确认方案并控制范围。", defaultScenario: "correct" },
  executor: { note: "我需要执行 Audit、审批动作并把明确步骤交给 Codex。", defaultScenario: "audit" },
};

const scenarios = {
  next: {
    title: "我不知道下一步做什么",
    subtitle: "Workspace Agent 已读取模拟规则、索引和 R001 当前入口",
    contextTitle: "R001 · Solution",
    chip: "R001 · Solution · Audit",
    facts: [["工作项", "R001"], ["当前入口", "Solution"], ["最近结果", "Requirement Audit"], ["推荐动作", "Solution Audit"]],
    skills: ["work-item", "solution-audit", "workspace-guide"],
    decision: ["NEXT ACTION", "是否现在开始 Solution Audit", "推荐，但必须由你启动；Audit 发现问题不会自动整改。"],
    boundary: "Agent 根据 Demo Data 给出下一步建议；没有真实读取任何 Workspace。",
    messages: [
      { role: "user", text: "我不知道下一步做什么。" },
      { role: "agent", heading: "你好，我已经看过当前工作空间", text: "当前 <strong>R001</strong> 的 Requirement 已完成 Audit，正在维护 <strong>Solution</strong>。下一步不是直接写代码，而是检查方案是否真正承接需求。", bullets: ["建议：开始 Solution Audit", "需要解释时：先问我怎么做", "方案确认后：再生成范围明确的 Codex Task"], actions: [["start-audit", "开始 Solution Audit", "primary"], ["explain", "问我怎么做"], ["handoff", "让 Codex 执行"]] },
    ],
  },
  create: {
    title: "创建或继续工作项",
    subtitle: "先查重、保存来源，再决定创建还是继续",
    contextTitle: "目标识别 · 待定位",
    chip: "Workspace · Work Item Discovery",
    facts: [["用户目标", "桌面交付体验"], ["查重结果", "发现 R001"], ["建议归属", "继续已有项"], ["写入状态", "尚未发生"]],
    skills: ["work-item", "requirement", "source-trace"],
    decision: ["WORK ITEM", "继续 R001 还是创建新项", "Agent 推荐继续 R001，因为目标与已有范围高度重合。"],
    boundary: "创建工作项不产生业务代码实施授权；本 Mock 不会写入目录或索引。",
    messages: [
      { role: "user", text: "我要做一个正式桌面 UI，Codex 先用 Mock。帮我建立工作项。" },
      { role: "agent", heading: "我先查了已有工作项", text: "目标与 <strong>R001 · 交付体验升级</strong> 高度相关。R001 已包含桌面体验和 Mock Runtime 边界；新建工作项会制造第二份需求真源。", bullets: ["推荐：把这句话保存为 R001 的新来源", "更新 Requirement 中的产品目标", "再评估 Solution 与执行步骤的真实影响"], actions: [["continue-item", "继续 R001", "primary"], ["compare-item", "查看查重依据"], ["new-item", "仍然创建新项"]] },
    ],
  },
  correct: {
    title: "纠正 Agent 对目标的理解",
    subtitle: "把人的决定传播到真正受影响的下游",
    contextTitle: "R001 · 认知变化",
    chip: "R001 · User Decision · Impact",
    facts: [["新决定", "正式 Desktop UI"], ["被否定", "浏览器临时原型"], ["影响范围", "Requirement / Solution"], ["代码授权", "无"]],
    skills: ["requirement", "impact-analysis", "decision-trace"],
    decision: ["USER DECISION", "UI Mock 的产品含义", "正式桌面 UI + Mock Codex Runtime；浏览器原型不再作为目标态。"],
    boundary: "用户决定可以更新需求与方案，但不自动产生技术选型、文件修改或迁移授权。",
    messages: [
      { role: "user", text: "你理解错了。我要的是未来正式 Desktop UI 的 Mock，不是浏览器临时原型。" },
      { role: "agent", heading: "收到，这是目标纠正，不是普通建议", text: "我会把它记录为人的明确决定：<strong>UI 就是未来正式界面，当前只 Mock Codex Runtime</strong>。", bullets: ["Requirement：明确产品形态与非目标", "Solution：重新核对 Shell、UI 和 Gateway 边界", "Execution：只标记可能受影响，等待方案确认后再调整"], actions: [["accept-correction", "确认并更新影响面", "primary"], ["show-impact", "查看影响范围"], ["reject-change", "撤销这次纠正"]] },
    ],
  },
  decide: {
    title: "辅助技术决策",
    subtitle: "先拆开被混为一谈的约束，再让人选择",
    contextTitle: "R001 · 技术取舍",
    chip: "Decision · Packaging · UI",
    facts: [["代码库", "可保持一套"], ["业务 JAR", "可跨平台"], ["零安装发行", "平台相关"], ["决定状态", "待确认"]],
    skills: ["solution", "tradeoff", "fact-check"],
    decision: ["TECH DECISION", "优先锁定什么", "建议锁定一套源码、一个 UI 和一个 Gateway；不把单一物理文件设为产品目标。"],
    boundary: "这是基于已知约束的候选方案比较，不代表技术选型已确认或产品已经实现。",
    messages: [
      { role: "user", text: "一个 JAR 做不到吗？" },
      { role: "agent", heading: "先把四个概念拆开", text: "<strong>一个代码库、一个业务 JAR、一个跨平台发行包、用户零安装</strong>不是同一个要求。前两项可以共用；包含原生 Runtime 的最终发行物通常与平台相关。", bullets: ["选项 A：优先单一 JAR，接受用户已有兼容 Runtime", "选项 B：优先现代 UI 和零安装，按平台打包发行", "稳定边界：一套源码、一个 UI、一个 Gateway 抽象"], actions: [["choose-modern", "选择现代 UI + 分平台发行", "primary"], ["choose-jar", "坚持单一 JAR"], ["need-evidence", "查看需要补充的证据"]] },
    ],
  },
  audit: {
    title: "执行 Solution Audit",
    subtitle: "审计只报告发现，整改仍由人决定",
    contextTitle: "R001 · Solution Audit",
    chip: "R001 · Solution · Audit Ready",
    facts: [["审计对象", "Solution v0.3"], ["上游基线", "Requirement v0.4"], ["发现", "尚未运行"], ["自动整改", "禁止"]],
    skills: ["solution-audit", "traceability", "boundary-check"],
    decision: ["AUDIT SCOPE", "是否检查方案承接与过度设计", "运行后只展示发现；不会直接改写 Solution。"],
    boundary: "Mock Audit 使用固定演示结果，不是对真实文档的审计，也不会修改任何文件。",
    messages: [
      { role: "agent", heading: "Solution Audit 已准备好", text: "我会检查 Requirement 到 Solution 的承接、关键取舍、影响范围、回退边界和是否存在过度设计。", bullets: ["输入：Requirement v0.4 / Solution v0.3", "输出：结论和可定位发现", "整改：需要你明确决定"], actions: [["run-audit", "运行 Solution Audit", "primary"], ["audit-scope", "查看审计范围"]] },
    ],
  },
  codex: {
    title: "把明确步骤交给 Codex",
    subtitle: "Handoff 只携带一个步骤和必要上下文",
    contextTitle: "R001 · STEP-02",
    chip: "R001 · STEP-02 · Codex Handoff",
    facts: [["目标步骤", "STEP-02 UI Shell"], ["审批模式", "文件写入前确认"], ["预计文件", "3"], ["运行状态", "未启动"]],
    skills: ["codex-handoff", "execution", "approval"],
    decision: ["EXECUTION", "是否启动 STEP-02", "Task 只包含 UI Shell，不包含 Runtime 接入、发布或无关重构。"],
    boundary: "Mock 只模拟 Codex 事件、审批和 Diff；不会启动进程、调用 API 或修改文件。",
    messages: [
      { role: "agent", heading: "Codex Task 已按单步边界生成", text: "目标是实现 <strong>STEP-02 · Desktop UI Shell</strong>。Task 已包含当前事实、允许写入范围、项目规则、验证入口和明确不做项。", bullets: ["写入：UI Shell 的 3 个演示文件", "不做：真实 Codex Gateway、发布打包、工作项迁移", "遇到范围变化：立即停止并回报"], actions: [["start-codex", "启动模拟 Codex", "primary"], ["preview-task", "预览 Task"], ["interrupt", "中断"]] },
    ],
  },
};

let currentPersona = "newcomer";
let currentScenario = "next";
let toastTimer;

const personaButtons = [...document.querySelectorAll("[data-persona]")];
const personaNote = document.querySelector("[data-persona-note]");
const scenarioTabs = [...document.querySelectorAll("[data-scenario]")];
const conversation = document.querySelector("[data-conversation]");
const conversationScroll = document.querySelector("[data-conversation-scroll]");
const titleNode = document.querySelector("[data-scenario-title]");
const subtitleNode = document.querySelector("[data-scenario-subtitle]");
const contextTitle = document.querySelector("[data-context-title]");
const contextFacts = document.querySelector("[data-context-facts]");
const contextSkills = document.querySelector("[data-context-skills]");
const contextDecisions = document.querySelector("[data-context-decisions]");
const contextBoundary = document.querySelector("[data-context-boundary]");
const contextChip = document.querySelector("[data-context-chip]");
const assistantInput = document.querySelector("[data-assistant-input]");
const composerError = document.querySelector("[data-composer-error]");
const toast = document.querySelector("[data-toast]");

const escapeHtml = (value) => value.replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character]));
const showToast = (message) => {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = setTimeout(() => { toast.hidden = true; }, 2800);
};

const renderMessage = (message) => {
  const bullets = message.bullets ? `<ul>${message.bullets.map((item) => `<li>${item}</li>`).join("")}</ul>` : "";
  const actions = message.actions ? `<div class="action-row">${message.actions.map(([action, label, kind = ""]) => `<button class="scenario-action ${kind}" type="button" data-action="${action}">${label}</button>`).join("")}</div>` : "";
  return `<article class="message ${message.role}"><span class="message-avatar">${message.role === "agent" ? "W" : "YOU"}</span><div class="message-body"><span class="message-meta">${message.role === "agent" ? "WORKSPACE AGENT" : "USER"}</span><div class="message-content">${message.heading ? `<h2>${message.heading}</h2>` : ""}<p>${message.text}</p>${message.extra || ""}${bullets}${actions}</div></div></article>`;
};

const renderScenario = (scenarioId) => {
  currentScenario = scenarioId;
  const scenario = scenarios[scenarioId];
  titleNode.textContent = scenario.title;
  subtitleNode.textContent = scenario.subtitle;
  contextTitle.textContent = scenario.contextTitle;
  contextChip.textContent = scenario.chip;
  contextFacts.innerHTML = scenario.facts.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("");
  contextSkills.innerHTML = scenario.skills.map((skill) => `<span>${skill}</span>`).join("");
  contextDecisions.innerHTML = `<div class="decision-card"><span>${scenario.decision[0]}</span><strong>${scenario.decision[1]}</strong><p>${scenario.decision[2]}</p></div>`;
  contextBoundary.textContent = scenario.boundary;
  conversation.innerHTML = scenario.messages.map(renderMessage).join("");
  scenarioTabs.forEach((tab) => {
    const active = tab.dataset.scenario === scenarioId;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  assistantInput.placeholder = scenarioId === "next" ? "例如：我不知道下一步做什么" : `继续询问：${scenario.title}`;
  composerError.hidden = true;
  conversationScroll.scrollTop = 0;
};

const appendAgentResult = (heading, text, extra = "") => {
  conversation.insertAdjacentHTML("beforeend", renderMessage({ role: "agent", heading, text, extra }));
  conversationScroll.scrollTop = conversationScroll.scrollHeight;
};

const actions = {
  "start-audit": () => { renderScenario("audit"); showToast("已切换到 Solution Audit 场景"); },
  explain: () => appendAgentResult("怎么做", "先核对 Audit 输入范围，再运行只读审计；看到发现后，由你决定是否建立整改动作。"),
  handoff: () => { renderScenario("codex"); showToast("已生成单步 Codex Handoff"); },
  "continue-item": () => appendAgentResult("已选择继续 R001", "模拟结果：新输入会作为来源追加，随后只更新真实受影响的 Requirement 与 Solution。"),
  "compare-item": () => appendAgentResult("查重依据", "R001 已包含正式 UI、Mock Runtime 与桌面交付边界；新目标没有独立生命周期，因此建议继续。"),
  "new-item": () => appendAgentResult("需要你再确认", "新建会形成第二个高度相关工作项。Mock 保留该决定，不自动创建目录或编号。"),
  "accept-correction": () => appendAgentResult("影响面已确认", "模拟更新：Requirement 的产品形态与非目标已调整；Solution 标记为需要重新核对，代码仍未修改。"),
  "show-impact": () => appendAgentResult("真实影响范围", "Requirement、Solution 和后续 STEP-02 可能受影响；Testing 仅在方案稳定后更新，当前实现不被静默改写。"),
  "reject-change": () => appendAgentResult("已撤销本次模拟纠正", "原有 Demo Data 保持不变。"),
  "choose-modern": () => appendAgentResult("决定已记录", "选择现代 UI 与分平台发行；稳定边界是一套源码、一个 UI 和一个 Gateway。此决定仍需进入 Solution。"),
  "choose-jar": () => appendAgentResult("约束已记录", "坚持单一 JAR 将改变 UI 技术与零安装目标，需要重新评估体验代价和 Runtime 前提。"),
  "need-evidence": () => appendAgentResult("仍需回源", "需要核对目标平台、用户是否已有 Runtime、离线要求、UI 能力和发行签名约束。"),
  "run-audit": () => {
    appendAgentResult("Solution Audit 完成 · Mock", "发现 2 项：一项需求承接缺口，一项未确认的发行假设。", "<div class=\"result-card\"><strong>结论：需要人工决定是否整改</strong><p>Audit 没有修改 Solution，也没有创建执行任务。</p></div>");
  },
  "audit-scope": () => appendAgentResult("审计范围", "检查需求承接、关键决定、模块影响、回退边界、过度设计和未验证假设；不检查真实代码实现。"),
  "start-codex": () => {
    appendAgentResult("Codex Run · Mock", "已进入模拟执行流。", "<div class=\"progress-run\"><div class=\"run-step done\"><i></i><span>Task accepted</span><span>DONE</span></div><div class=\"run-step done\"><i></i><span>Workspace rules loaded</span><span>DONE</span></div><div class=\"run-step running\"><i></i><span>Waiting for file-write approval</span><span>WAITING</span></div></div><div class=\"action-row\"><button class=\"scenario-action primary\" type=\"button\" data-action=\"approve-write\">批准模拟写入</button><button class=\"scenario-action\" type=\"button\" data-action=\"interrupt\">中断</button></div>");
  },
  "preview-task": () => appendAgentResult("Task 预览", "目标：完成 STEP-02 UI Shell；输入：已确认 Solution；写入：3 个演示文件；不做：Runtime 接入、发布和无关重构。"),
  "approve-write": () => appendAgentResult("Turn completed · Mock", "模拟审批已通过，3 个文件进入 Demo Diff；没有真实文件被修改。"),
  interrupt: () => appendAgentResult("Run interrupted · Mock", "模拟运行已中断，现场和已完成事件保留。"),
};

conversation.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const action = actions[button.dataset.action];
  if (action) action();
});
scenarioTabs.forEach((tab) => tab.addEventListener("click", () => renderScenario(tab.dataset.scenario)));
personaButtons.forEach((button) => button.addEventListener("click", () => {
  currentPersona = button.dataset.persona;
  personaButtons.forEach((candidate) => { const active = candidate === button; candidate.classList.toggle("is-active", active); candidate.setAttribute("aria-pressed", String(active)); });
  personaNote.textContent = personas[currentPersona].note;
  renderScenario(personas[currentPersona].defaultScenario);
}));

const sendInput = () => {
  const value = assistantInput.value.trim();
  if (!value) { composerError.hidden = false; assistantInput.focus(); return; }
  composerError.hidden = true;
  conversation.insertAdjacentHTML("beforeend", renderMessage({ role: "user", text: escapeHtml(value) }));
  assistantInput.value = "";
  const normalized = value.toLowerCase();
  const target = normalized.includes("下一步") || normalized.includes("不知道") ? "next"
    : normalized.includes("工作项") || normalized.includes("创建") ? "create"
      : normalized.includes("理解错") || normalized.includes("纠正") || normalized.includes("不是") ? "correct"
        : normalized.includes("jar") || normalized.includes("选型") || normalized.includes("技术") ? "decide"
          : normalized.includes("audit") || normalized.includes("审计") ? "audit"
            : normalized.includes("codex") || normalized.includes("执行") ? "codex" : null;
  if (target && target !== currentScenario) {
    setTimeout(() => { renderScenario(target); showToast(`已根据输入切换到“${scenarios[target].title}”`); }, 180);
  } else {
    setTimeout(() => appendAgentResult("我会先基于当前上下文回答", `这个 Mock 只覆盖六个预设场景。当前我能帮你继续处理“${scenarios[currentScenario].title}”，或从上方切换其他场景。`), 180);
  }
};
document.querySelector("[data-send]").addEventListener("click", sendInput);
assistantInput.addEventListener("keydown", (event) => { if ((event.ctrlKey || event.metaKey) && event.key === "Enter") sendInput(); });
document.querySelector("[data-reset]").addEventListener("click", () => { currentPersona = "newcomer"; personaButtons[0].click(); showToast("场景已重置"); });
document.querySelectorAll("[data-artifact]").forEach((button) => button.addEventListener("click", () => showToast(`已定位模拟入口：R001 / ${button.dataset.artifact}`)));
document.querySelectorAll("[data-work-item], [data-nav]").forEach((button) => button.addEventListener("click", () => showToast("该入口在第一版 Mock 中只展示定位反馈")));

renderScenario(currentScenario);
