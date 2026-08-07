const runtimeContent = {
  identity: {
    title: "Identity · 谁在回答",
    copy: "明确 Agent 身份、能力边界和使用入口，让一次回答属于具体责任主体，而不是匿名聊天能力。",
    flow: ["User Intent", "Nest Assistant", "Scoped Capability"],
    note: "Current 表示存在当前实现支撑，不等于完整产品验收已经完成。",
  },
  context: {
    title: "Context · 带什么进入模型",
    copy: "上下文不是字符串拼接，而是由身份、会话、知识、方法和当前目标共同形成的可追踪输入。",
    flow: ["Session", "Typed Context", "Model Input"],
    note: "上下文构建正在持续演进；概念图只表达责任，不承诺所有链路都已产品化。",
  },
  loop: {
    title: "Loop · 怎样持续推进",
    copy: "真正的 Agent Loop 会在目标、模型输出、工具结果与停止条件之间循环，而不是把一次 LLM 调用包装成 Agent。",
    flow: ["Goal", "Think / Act", "Observe / Stop"],
    note: "这是 Roadmap：Meepo 的生产级统一 Loop 仍是明确的后续方向。",
  },
  evidence: {
    title: "Evidence · 凭什么相信",
    copy: "回答需要保留知识来源、当前边界和诊断线索；能够展示来源，不等于来源已经支持全部结论。",
    flow: ["Knowledge", "Scoped RAG", "Answer + Sources"],
    note: "Current 支撑基础问答、范围化知识检索和来源引用，最新工作树仍需持续验证。",
  },
  session: {
    title: "Session · 什么需要延续",
    copy: "Session 让身份、上下文与历史结果跨轮次保持连续；可观察视图帮助人理解一次回答是如何形成的。",
    flow: ["Turns", "History", "Analysis View"],
    note: "会话与分析能力有当前基础；这里展示的是未来更统一的 Concept 视图。",
  },
};

const evidenceCases = [
  {
    origin: "用户输入",
    text: "“先看 GitHub Pages 的物理限制，再评估站点能做到多大。”",
    answer: "source",
    explanation: "这是提出者的原始要求。它决定研究顺序，但本身不是 GitHub Pages 限制的事实证据。",
  },
  {
    origin: "官方文档核对",
    text: "GitHub Pages 发布的是静态文件，并对站点体积、构建时长和带宽设有限制。",
    answer: "fact",
    explanation: "这是能够回到 GitHub 官方文档复核的外部事实；具体数值仍需在发布前按当前文档重新核对。",
  },
  {
    origin: "工程分析",
    text: "大型视频和模型资源会比普通文章更早触及仓库体积与带宽边界。",
    answer: "inference",
    explanation: "这是由资源特征和官方限制推导出的工程判断，合理但不是官方文档逐字给出的结论。",
  },
  {
    origin: "方案记录",
    text: "首版采用零后端的纯静态实现，不在浏览器中放置任何私密 API Key。",
    answer: "decision",
    explanation: "这是在约束和风险之间做出的实现选择，包含明确责任与可执行边界。",
  },
  {
    origin: "运行结果",
    text: "真实 GitHub Pages 地址可以在桌面和移动端打开，控制台没有页面错误。",
    answer: "fact",
    explanation: "只有在真实部署后按用户入口实际观察并留下证据，这句话才能作为当前运行事实。",
  },
  {
    origin: "未来讨论",
    text: "如果 Labs 需要多人共享状态，静态站点可能需要拆出独立服务。",
    answer: "inference",
    explanation: "这是条件化推断：它指出可能的演进方向，但既不是已决定路线，也不是已经发生的实现。",
  },
];

const header = document.querySelector("[data-header]");
const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".site-nav");
const progress = document.querySelector(".scroll-progress span");

menuButton?.addEventListener("click", () => {
  const open = navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  header?.classList.toggle("scrolled", window.scrollY > 80);
}, { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const runtimeTabs = document.querySelectorAll("[data-runtime]");
const runtimeTitle = document.querySelector("[data-runtime-title]");
const runtimeCopy = document.querySelector("[data-runtime-copy]");
const runtimeFlow = document.querySelector("[data-runtime-flow]");
const runtimeNote = document.querySelector("[data-runtime-note]");

runtimeTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const item = runtimeContent[tab.dataset.runtime];
    runtimeTabs.forEach((candidate) => {
      const active = candidate === tab;
      candidate.classList.toggle("active", active);
      candidate.setAttribute("aria-selected", String(active));
    });
    runtimeTitle.textContent = item.title;
    runtimeCopy.textContent = item.copy;
    runtimeFlow.innerHTML = `<span>${item.flow[0]}</span><i>→</i><strong>${item.flow[1]}</strong><i>→</i><span>${item.flow[2]}</span>`;
    runtimeNote.textContent = item.note;
  });
});

const lab = document.querySelector("[data-evidence-lab]");
if (lab) {
  let caseIndex = 0;
  let score = 0;
  const bestKey = "kael-lab:v1:evidence-best";
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
    answers.forEach((button) => {
      button.disabled = false;
      button.classList.remove("correct", "wrong");
    });
  };

  answers.forEach((button) => {
    button.addEventListener("click", () => {
      const item = evidenceCases[caseIndex];
      const correct = button.dataset.answer === item.answer;
      if (correct) score += 1;
      scoreNode.textContent = String(score).padStart(2, "0");
      answers.forEach((candidate) => {
        candidate.disabled = true;
        if (candidate.dataset.answer === item.answer) candidate.classList.add("correct");
      });
      if (!correct) button.classList.add("wrong");
      feedbackIcon.textContent = correct ? "✓" : "×";
      feedbackIcon.style.color = correct ? "var(--acid)" : "var(--coral)";
      feedbackTitle.textContent = correct ? "判断正确" : "这次分类不准确";
      feedbackCopy.textContent = item.explanation;
      next.textContent = caseIndex === evidenceCases.length - 1 ? "查看结果 →" : "下一题 →";
      feedback.hidden = false;
    });
  });

  next.addEventListener("click", () => {
    if (caseIndex < evidenceCases.length - 1) {
      caseIndex += 1;
      render();
      caseCard.scrollIntoView({ block: "center" });
      return;
    }
    const best = Math.max(score, getBest());
    localStorage.setItem(bestKey, String(best));
    caseCard.hidden = true;
    answerGrid.hidden = true;
    feedback.hidden = true;
    complete.hidden = false;
    finalScore.textContent = `${score} / ${evidenceCases.length}`;
    finalCopy.textContent = score === evidenceCases.length
      ? "你已经能稳定地区分来源、事实、推断和决定。下一步，是让真实项目也保持这种边界。"
      : "分类的价值不在得分，而在阻止推断伪装成事实、建议伪装成人的决定。";
  });

  restart.addEventListener("click", () => {
    caseIndex = 0;
    score = 0;
    complete.hidden = true;
    caseCard.hidden = false;
    answerGrid.hidden = false;
    render();
  });

  render();
}

document.querySelector("[data-year]").textContent = new Date().getFullYear();
