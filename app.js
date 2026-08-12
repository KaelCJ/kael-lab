const centerViews = {
  all: "从人的目标出发，经过工作空间、Agent 与知识能力，最终用证据回到人的判断。",
  human: "突出需要人拥有的目标、关键取舍和最终判断；Agent 的建议不会自动升级为决定。",
  work: "突出从工作项定位、下一步引导到执行交接的连续工作链。",
  agent: "突出 Agent 消费知识与技能、执行受控动作并回传结果的责任。",
  trust: "突出来源、审计、失败、真实结果和未验证边界怎样形成可信反馈。",
};

const capabilityContent = {
  workbench: {
    kicker: "L3 · AGENT WORKBENCH",
    title: "让执行过程可以被人看见和干预",
    copy: "任务、审批、工具动作、文件变化、中断和恢复属于同一个可观察运行过程；Concept 不等于已经连接真实 Codex。",
  },
  knowledge: {
    kicker: "L4 · KNOWLEDGE & SKILLS",
    title: "让正确知识在正确时刻进入上下文",
    copy: "Workspace 负责发现当前规则和事实入口，Skill 负责特定方法；两者都不能靠无限提示词堆叠替代。",
  },
  evidence: {
    kicker: "L5 · EVIDENCE & AUDIT",
    title: "让检查结果拥有准确的名字",
    copy: "静态检查、真实运行、用户确认和未执行内容分别记录，避免绿色检查被写成产品已经完成。",
  },
};

const evidenceCases = [
  { origin: "用户输入", text: "“先看公开站点的物理限制，再评估能做到多大。”", answer: "source", explanation: "这是提出者的原始要求。它决定研究顺序，但本身不是平台限制的事实证据。" },
  { origin: "官方文档核对", text: "静态托管发布的是公开文件，不适合保存私密凭据与服务端状态。", answer: "fact", explanation: "这是能够回到平台约束和公开文件特性核对的事实。" },
  { origin: "工程分析", text: "多人共享运行状态需要独立服务，而不是继续堆在静态页面里。", answer: "inference", explanation: "这是由静态边界推导的工程判断，合理但不是已实现事实。" },
  { origin: "方案记录", text: "首版只做公开 Concept Mock，不连接真实 Workspace 或模型。", answer: "decision", explanation: "这是在安全、范围和展示目标之间做出的明确选择。" },
  { origin: "运行结果", text: "真实发布地址可以在桌面和移动端打开，控制台没有页面错误。", answer: "fact", explanation: "只有完成真实部署并实际观察后，这句话才能成为当前运行事实。" },
  { origin: "未来讨论", text: "如果实验需要多人协作，后续可能拆出受控服务。", answer: "inference", explanation: "这是条件化推断，不是既定路线，也不是已经发生的实现。" },
];

const header = document.querySelector("[data-header]");
const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".site-nav");
const progress = document.querySelector(".scroll-progress span");

menuButton?.addEventListener("click", () => {
  const open = navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});
navigation?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  navigation.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
}));
window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  header?.classList.toggle("scrolled", window.scrollY > 80);
}, { passive: true });

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
  }), { threshold: .1 });
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("visible"));
}

const centerFilters = [...document.querySelectorAll("[data-center-filter]")];
const capabilityRows = [...document.querySelectorAll("[data-tags]")];
const centerExplanation = document.querySelector("[data-center-explanation]");
centerFilters.forEach((button) => button.addEventListener("click", () => {
  const filter = button.dataset.centerFilter;
  centerFilters.forEach((candidate) => {
    const active = candidate === button;
    candidate.classList.toggle("is-active", active);
    candidate.setAttribute("aria-pressed", String(active));
  });
  centerExplanation.textContent = centerViews[filter];
  capabilityRows.forEach((row) => row.classList.toggle("is-dimmed", filter !== "all" && !row.dataset.tags.split(" ").includes(filter)));
}));

const capabilityKicker = document.querySelector("[data-capability-kicker]");
const capabilityTitle = document.querySelector("[data-capability-title]");
const capabilityCopy = document.querySelector("[data-capability-copy]");
document.querySelectorAll("[data-capability]").forEach((button) => button.addEventListener("click", () => {
  const content = capabilityContent[button.dataset.capability];
  capabilityKicker.textContent = content.kicker;
  capabilityTitle.textContent = content.title;
  capabilityCopy.textContent = content.copy;
}));

const lab = document.querySelector("[data-evidence-lab]");
if (lab) {
  let caseIndex = 0;
  let score = 0;
  const bestKey = "kael-lab:v2:evidence-best";
  const getBest = () => Number.parseInt(localStorage.getItem(bestKey) || "0", 10);
  const caseNumber = lab.querySelector("[data-case-number]");
  const scoreNode = lab.querySelector("[data-score]");
  const bestNode = lab.querySelector("[data-best]");
  const labProgress = lab.querySelector("[data-lab-progress]");
  const caseOrigin = lab.querySelector("[data-case-origin]");
  const caseText = lab.querySelector("[data-case-text]");
  const answers = [...lab.querySelectorAll("[data-answer]")];
  const feedback = lab.querySelector("[data-feedback]");
  const feedbackIcon = lab.querySelector("[data-feedback-icon]");
  const feedbackTitle = lab.querySelector("[data-feedback-title]");
  const feedbackCopy = lab.querySelector("[data-feedback-copy]");
  const next = lab.querySelector("[data-next]");
  const complete = lab.querySelector("[data-complete]");
  const finalScore = lab.querySelector("[data-final-score]");
  const finalCopy = lab.querySelector("[data-final-copy]");
  const restart = lab.querySelector("[data-restart]");
  const caseCard = lab.querySelector(".case-card");
  const answerGrid = lab.querySelector(".answer-grid");

  const render = () => {
    const item = evidenceCases[caseIndex];
    caseNumber.textContent = `${String(caseIndex + 1).padStart(2, "0")} / ${String(evidenceCases.length).padStart(2, "0")}`;
    scoreNode.textContent = String(score).padStart(2, "0");
    bestNode.textContent = getBest() ? `${getBest()} / ${evidenceCases.length}` : "—";
    labProgress.style.width = `${((caseIndex + 1) / evidenceCases.length) * 100}%`;
    caseOrigin.textContent = item.origin;
    caseText.textContent = item.text;
    feedback.hidden = true;
    answers.forEach((button) => { button.disabled = false; button.classList.remove("correct", "wrong"); });
  };
  answers.forEach((button) => button.addEventListener("click", () => {
    const item = evidenceCases[caseIndex];
    const correct = button.dataset.answer === item.answer;
    if (correct) score += 1;
    scoreNode.textContent = String(score).padStart(2, "0");
    answers.forEach((candidate) => { candidate.disabled = true; if (candidate.dataset.answer === item.answer) candidate.classList.add("correct"); });
    if (!correct) button.classList.add("wrong");
    feedbackIcon.textContent = correct ? "✓" : "×";
    feedbackTitle.textContent = correct ? "判断正确" : "这次分类不准确";
    feedbackCopy.textContent = item.explanation;
    next.textContent = caseIndex === evidenceCases.length - 1 ? "查看结果 →" : "下一题 →";
    feedback.hidden = false;
  }));
  next.addEventListener("click", () => {
    if (caseIndex < evidenceCases.length - 1) { caseIndex += 1; render(); caseCard.scrollIntoView({ block: "center" }); return; }
    localStorage.setItem(bestKey, String(Math.max(score, getBest())));
    caseCard.hidden = true; answerGrid.hidden = true; feedback.hidden = true; complete.hidden = false;
    finalScore.textContent = `${score} / ${evidenceCases.length}`;
    finalCopy.textContent = score === evidenceCases.length ? "你已经能稳定地区分来源、事实、推断和决定。" : "分类的价值在于阻止推断伪装成事实、建议伪装成人的决定。";
  });
  restart.addEventListener("click", () => { caseIndex = 0; score = 0; complete.hidden = true; caseCard.hidden = false; answerGrid.hidden = false; render(); });
  render();
}

document.querySelector("[data-year]").textContent = new Date().getFullYear();
