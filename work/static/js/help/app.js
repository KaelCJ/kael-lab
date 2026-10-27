(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHtml = value => String(value).replace(/[&<>"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]);

  const toast = $("[data-toast]");
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 1900);
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }

  $$('[data-copy]').forEach(button => button.addEventListener("click", async () => {
    const target = document.getElementById(button.dataset.copy);
    if (!target) return;
    try { await copyText(target.textContent.trim()); showToast("示例提示词已复制"); }
    catch { showToast("复制失败，请手动选择文本"); }
  }));

  const currentPage = document.body.dataset.page;
  $$('[data-nav-page]').forEach(link => {
    if (link.dataset.navPage === currentPage) link.setAttribute("aria-current", "page");
  });

  function initHub() {
    const topic = new URLSearchParams(location.search).get("topic");
    const topicMap = { collaboration: "work-item-help", nest: "nest-help", workbench: "workbench-help" };
    if (topicMap[topic]) requestAnimationFrame(() => document.getElementById(topicMap[topic])?.scrollIntoView());

    $$('[data-quick-group]').forEach(group => {
      const buttons = $$('[data-quick-button]', group);
      const panels = $$('[data-quick-panel]', group);
      buttons.forEach(button => button.addEventListener("click", () => {
        buttons.forEach(candidate => candidate.classList.toggle("is-active", candidate === button));
        panels.forEach(panel => { panel.hidden = panel.dataset.quickPanel !== button.dataset.quickButton; });
      }));
    });
  }

  const requirementScenarios = {
    source: {
      title: "让知识答案带着可核对来源回来",
      user: "一线研发与架构师",
      problem: "答案看起来正确，但使用者无法判断引用是否真的支持结论。",
      goal: "任何关键判断都能展开来源、片段和适用边界。",
      scope: ["答案卡展示来源数量与证据状态", "来源抽屉显示标题、片段、版本", "证据不足时明确停止并给出下一步"],
      out: ["自动替用户修改知识原文", "把相似词命中写成可靠引用", "为来源不足的答案补造结论"],
      acceptance: ["给定有来源答案，点击来源可看到支持该判断的片段", "给定来源版本冲突，界面标记冲突且不显示“已验证”", "给定无可靠来源，答案显示证据不足出口"],
      questions: ["来源新鲜度以什么字段判断？", "一个判断由多个来源共同支持时怎样表达？"],
      ready: 82
    },
    mobile: {
      title: "修复工作台在移动端的横向溢出",
      user: "使用手机查看执行状态的研发人员",
      problem: "长路径和事件内容把页面撑宽，主要动作移出视口。",
      goal: "390px 宽度下无需横向滚动即可查看状态和执行主要动作。",
      scope: ["工作台主视图适配 390px", "长路径允许安全换行", "停止与继续动作保持可见"],
      out: ["重做桌面信息架构", "改变后端事件协议", "承诺所有低端设备性能"],
      acceptance: ["390×844 下文档 scrollWidth 等于 clientWidth", "长路径不遮挡状态或操作", "键盘与触控均可触发停止动作"],
      questions: ["最小支持宽度是否就是 390px？"],
      ready: 91
    },
    onboarding: {
      title: "新成员能在十分钟内继续已有工作项",
      user: "首次参与 Agent 协作的产品与研发",
      problem: "只看到聊天记录，不知道目标、当前事实和下一步在哪里。",
      goal: "从代办、代码现场或编号进入同一工作项并找到恢复点。",
      scope: ["展示三种继续入口", "解释需求/方案/执行/测试/产出职责", "提示本轮授权边界"],
      out: ["自动替人选择目标", "无冲突检查地新建重复工作项", "自动删除历史会话"],
      acceptance: ["用户可从进行中列表进入工作项", "知道编号时可直接定位并看到下一步", "只记得代码问题时先只读匹配候选"],
      questions: [],
      ready: 96
    },
    vague: {
      title: "做一个更智能、更好用的看板",
      user: "尚未明确",
      problem: "“智能”和“好用”没有可观察定义，也没有目标角色或现场。",
      goal: "待澄清",
      scope: ["暂不进入方案与实施"],
      out: ["AI 猜测真实业务目标", "直接选择技术方案", "生成虚假的验收通过条件"],
      acceptance: ["先补齐目标用户、当前问题和可观察结果"],
      questions: ["谁在什么场景使用看板？", "现在最耗时的动作是什么？", "怎样观察“更好用”已经发生？", "是否已有同目标工作项？"],
      ready: 28
    }
  };

  function initRequirements() {
    const buttons = $$('[data-requirement-scenario]');
    const output = $('[data-requirement-output]');
    const build = $('[data-build-requirement]');
    if (!buttons.length || !output) return;
    let selected = "source";

    function list(items, mode = "") {
      return `<ul class="list ${mode}">${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
    }
    function render() {
      const item = requirementScenarios[selected];
      buttons.forEach(button => button.classList.toggle("is-active", button.dataset.requirementScenario === selected));
      const blocked = item.ready < 50;
      output.innerHTML = `
        <div class="output-head"><strong>${escapeHtml(item.title)}</strong><span class="status ${blocked ? "blocked" : "demo"}">${blocked ? "NEEDS CLARIFICATION" : "DEMO DRAFT"}</span></div>
        <div class="output-body">
          <div class="output-grid">
            <article class="metric"><small>目标用户</small><strong>${escapeHtml(item.user)}</strong><p>${escapeHtml(item.problem)}</p></article>
            <article class="metric"><small>期望结果</small><strong>${blocked ? "暂不实施" : "可验收"}</strong><p>${escapeHtml(item.goal)}</p></article>
            <article class="metric"><small>需求就绪度</small><strong>${item.ready}%</strong><div class="progress-track" aria-label="需求就绪度 ${item.ready}%"><i style="width:${item.ready}%"></i></div></article>
          </div>
          <div class="grid-2" style="margin-top:12px"><div><p class="eyebrow">IN SCOPE</p>${list(item.scope)}</div><div><p class="eyebrow">OUT OF SCOPE</p>${list(item.out, "warn")}</div></div>
          <p class="eyebrow" style="margin-top:18px">ACCEPTANCE CRITERIA</p>${list(item.acceptance)}
          ${item.questions.length ? `<p class="eyebrow" style="margin-top:18px">OPEN QUESTIONS</p>${list(item.questions, "warn")}` : ""}
        </div>`;
      if (build) build.disabled = blocked;
    }
    buttons.forEach(button => button.addEventListener("click", () => { selected = button.dataset.requirementScenario; render(); }));
    build?.addEventListener("click", () => {
      const item = requirementScenarios[selected];
      $('[data-work-item-preview]').innerHTML = `<div class="output-head"><strong>W-DEMO-042 · ${escapeHtml(item.title)}</strong><span class="status demo">DEMO ONLY</span></div><div class="output-body"><div class="output-grid"><article class="metric"><small>来源</small><strong>产品需求</strong><p>原始表达保留，当前草案独立维护。</p></article><article class="metric"><small>下一门禁</small><strong>人确认需求</strong><p>确认后才能进入架构方案。</p></article><article class="metric"><small>证据</small><strong>${item.acceptance.length} 条 AC</strong><p>页面生成不等于工作项真实创建。</p></article></div></div>`;
      showToast("已生成演示工作项预览，不会写入真实系统");
    });
    render();
  }

  const architectureOptions = {
    thin: { name: "A · 前端轻量增强", tag: "LOW CHANGE", summary: "在现有页面增加来源抽屉和证据状态，不改变问答协议。", scores: [5, 3, 4, 4], risk: "协议没有标准来源结构时，前端可能承担过多适配。", rollback: "移除新组件，保留旧答案卡。", recommend: "适合来源数据已经存在、目标是尽快改善可见性的场景。" },
    contract: { name: "B · 证据契约贯通", tag: "RECOMMENDED", summary: "定义答案判断—来源—片段—版本的稳定契约，再由前端消费。", scores: [3, 5, 5, 5], risk: "需要前后端和知识侧共同确认契约，首期协调成本更高。", rollback: "保留旧字段兼容一个版本，关闭新证据视图。", recommend: "适合要长期复用来源能力、避免每个产品重复解释的场景。" },
    rebuild: { name: "C · 重建知识检索链", tag: "HIGH CHANGE", summary: "同时调整检索、排序、回答和前端证据模型。", scores: [1, 4, 2, 2], risk: "把显示问题扩大为整条链路重建，验证面和回退成本过大。", rollback: "需要双轨流量与旧链保留，当前需求下不划算。", recommend: "只有现有检索质量也被真实证据证明不可用时才考虑。" }
  };

  function initArchitecture() {
    const cards = $$('[data-architecture-option]');
    const detail = $('[data-architecture-detail]');
    if (!cards.length || !detail) return;
    let selected = "contract";
    function render() {
      const item = architectureOptions[selected];
      cards.forEach(card => card.classList.toggle("is-active", card.dataset.architectureOption === selected));
      detail.innerHTML = `<div class="output-head"><strong>${escapeHtml(item.name)}</strong><span class="status ${selected === "contract" ? "current" : "demo"}">${escapeHtml(item.tag)}</span></div><div class="output-body"><p class="lead" style="margin:0 0 16px;font-size:12px">${escapeHtml(item.summary)}</p><table class="tradeoff-table"><thead><tr><th>交付速度</th><th>长期一致性</th><th>回退清晰度</th><th>证据可追溯</th></tr></thead><tbody><tr>${item.scores.map(score => `<td><span class="score">${score}</span> / 5</td>`).join("")}</tr></tbody></table><div class="grid-2" style="margin-top:14px"><div class="callout"><span class="status blocked">RISK</span><div><strong>关键代价</strong><p>${escapeHtml(item.risk)}</p></div></div><div class="callout"><span class="status info">ROLLBACK</span><div><strong>回退边界</strong><p>${escapeHtml(item.rollback)}</p></div></div></div><p class="quiet" style="margin-top:14px">AI 建议：${escapeHtml(item.recommend)} 最终选择仍需人确认。</p></div>`;
    }
    cards.forEach(card => card.addEventListener("click", () => { selected = card.dataset.architectureOption; render(); }));
    $('[data-build-plan]')?.addEventListener("click", () => {
      const plan = $('[data-plan-output]');
      plan.innerHTML = `<div class="step-list">
        <article class="step-item"><b>01</b><div><strong>冻结证据契约</strong><small>确认判断、来源、片段、版本和“不足”状态；所有者：架构 + 产品</small></div><span class="status human">HUMAN GATE</span></article>
        <article class="step-item"><b>02</b><div><strong>实现最小纵向链</strong><small>后端返回一条真实来源，前端展开并显示适用边界；所有者：研发</small></div><span class="status wait">READY</span></article>
        <article class="step-item"><b>03</b><div><strong>覆盖失败与冲突</strong><small>来源缺失、版本冲突、片段不支持判断时不得显示已验证；所有者：研发 + 测试</small></div><span class="status wait">PENDING</span></article>
        <article class="step-item"><b>04</b><div><strong>真实页面路径与验收</strong><small>自动检查、真实端到端、产品验收分别记录；所有者：测试 + 产品</small></div><span class="status wait">PENDING</span></article>
      </div>`;
      showToast("已生成演示执行步骤，等待人确认方案");
    });
    render();
  }

  const devSteps = [
    { id: "01", title: "回读需求与已确认方案", note: "确认 AC、范围、不做项和真实代码现场", state: "done" },
    { id: "02", title: "定义最小证据数据结构", note: "只实现当前契约，不预建 Registry", state: "active" },
    { id: "03", title: "接入答案卡与来源抽屉", note: "覆盖成功、缺失、冲突三类可见状态", state: "pending" },
    { id: "04", title: "执行分层检查并回流证据", note: "自动检查与真实页面路径分开记录", state: "pending" },
    { id: "05", title: "交接产品确认", note: "提供变化、限制、失败现场和回退方式", state: "pending" }
  ];

  function initDevelopment() {
    const list = $('[data-dev-steps]');
    const terminal = $('[data-dev-terminal]');
    if (!list || !terminal) return;
    let active = 1;
    let blocked = false;
    function stateLabel(state) { return { done: ["pass", "DONE"], active: ["current", "ACTIVE"], pending: ["wait", "PENDING"], blocked: ["blocked", "BLOCKED"] }[state]; }
    function render() {
      list.innerHTML = devSteps.map((step, index) => { const label = stateLabel(step.state); return `<button class="step-item ${index === active ? "is-active" : ""}" type="button" data-dev-step="${index}"><b>${step.id}</b><div><strong>${escapeHtml(step.title)}</strong><small>${escapeHtml(step.note)}</small></div><span class="status ${label[0]}">${label[1]}</span></button>`; }).join("");
      $$('[data-dev-step]', list).forEach(button => button.addEventListener("click", () => { active = Number(button.dataset.devStep); render(); updateTerminal("inspect"); }));
    }
    function updateTerminal(action) {
      const step = devSteps[active];
      const logs = {
        inspect: `[demo] selected STEP ${step.id}\n[scope] ${step.title}\n[note] ${step.note}\n[boundary] no real file or command was used`,
        run: `[demo] executing STEP ${step.id}\n<span class="ok">✓ scope checked</span>\n<span class="ok">✓ change preview produced</span>\n<span class="warn">! real runtime evidence still required</span>`,
        block: `[demo] STEP ${step.id} stopped\n<span class="err">× evidence contract owner is not confirmed</span>\n[next] keep failure record and request a human decision`,
        complete: `[demo] STEP ${step.id} completed\n<span class="ok">✓ output attached</span>\n<span class="ok">✓ automatic checks recorded separately</span>\n[next] move to the next confirmed step`
      };
      terminal.innerHTML = logs[action];
    }
    $('[data-dev-action="run"]')?.addEventListener("click", () => { blocked = false; devSteps[active].state = "active"; render(); updateTerminal("run"); });
    $('[data-dev-action="block"]')?.addEventListener("click", () => { blocked = true; devSteps[active].state = "blocked"; render(); updateTerminal("block"); showToast("已保留演示阻塞现场"); });
    $('[data-dev-action="complete"]')?.addEventListener("click", () => {
      if (blocked) { showToast("阻塞未解除，不能无痕改成完成"); return; }
      devSteps[active].state = "done";
      updateTerminal("complete");
      const next = devSteps.findIndex((step, index) => index > active && step.state === "pending");
      if (next >= 0) { active = next; devSteps[active].state = "active"; }
      render();
    });
    render(); updateTerminal("inspect");
  }

  const testScenarios = {
    auto: {
      title: "自动检查 · 当前构建",
      copy: "检查语法、静态链接、敏感模式和结构，不经过真实用户入口。",
      records: [
        ["PASS", "JavaScript 语法", "7 个脚本解析成功；只证明语法。"],
        ["PASS", "静态链接", "页面内相对目标存在；不证明部署后缓存。"],
        ["FAIL", "禁用内容扫描", "首次命中一个内部路径；失败记录保留，修复后形成新 Run。"]
      ]
    },
    e2e: {
      title: "真实端到端 · 页面入口",
      copy: "从当前构建的真实页面入口操作 DOM，观察最终用户可见结果。",
      records: [
        ["PASS", "来源抽屉成功路径", "用户点击来源后看到支持判断的片段。"],
        ["FAIL", "版本冲突路径", "冲突来源仍显示“已验证”；缺陷未被后续成功覆盖。"],
        ["NOT RUN", "真实账号权限路径", "缺少可用测试账号，本轮未执行。"]
      ]
    },
    uat: {
      title: "使用者验收 · 人的判断",
      copy: "产品或真实使用者判断结果是否解决问题，不能由自动脚本代签。",
      records: [
        ["WAIT", "产品验收", "等待产品确认“来源是否足以建立信任”。"],
        ["WAIT", "一线研发试用", "尚未安排真实使用者试用。"],
        ["NOT RUN", "发布接受", "页面测试通过也不自动授权发布。"]
      ]
    }
  };

  function initTesting() {
    const buttons = $$('[data-evidence-type]');
    const output = $('[data-evidence-output]');
    if (!buttons.length || !output) return;
    let selected = "auto";
    function badge(status) { return status === "PASS" ? "pass" : status === "FAIL" ? "fail" : status === "WAIT" ? "human" : "wait"; }
    function render() {
      const item = testScenarios[selected];
      buttons.forEach(button => button.classList.toggle("is-active", button.dataset.evidenceType === selected));
      output.innerHTML = `<div class="stage-top"><div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.copy)}</p></div><span class="status demo">DEMO RUNS</span></div>${item.records.map(([status,title,copy], index) => `<article class="run-record"><header><h4>RUN-${selected.toUpperCase()}-0${index + 1} · ${escapeHtml(title)}</h4><span class="status ${badge(status)}">${escapeHtml(status)}</span></header><p>${escapeHtml(copy)}</p></article>`).join("")}<div class="callout" style="margin-top:14px"><span class="status info">RULE</span><div><strong>证据不能跨类型升级</strong><p>自动检查通过不能写成真实端到端测试通过；真实页面路径通过也不能替代使用者验收。</p></div></div>`;
    }
    buttons.forEach(button => button.addEventListener("click", () => { selected = button.dataset.evidenceType; render(); }));
    $('[data-add-rerun]')?.addEventListener("click", () => showToast("演示：已保留旧失败，并新增独立复测 Run"));
    render();
  }

  const workflowStages = [
    { name: "产品需求", actor: "产品 + AI", input: "真实问题、目标用户、期望变化", ai: "查重、整理来源、生成 REQ/AC 草案", gate: "人确认需求与范围", output: "可验收需求基线" },
    { name: "架构方案", actor: "架构 + AI", input: "已确认需求、代码与约束", ai: "比较方案、代价、风险和回退", gate: "人选择方案", output: "方案与可执行步骤" },
    { name: "研发实施", actor: "研发 + AI", input: "已确认步骤、真实代码现场", ai: "按授权修改、检查并回流证据", gate: "范围变化或高影响动作停下", output: "当前构建与执行记录" },
    { name: "测试证据", actor: "测试 + AI", input: "当前构建、AC、真实环境条件", ai: "自动检查与真实路径分层执行", gate: "失败保留；缺条件写未执行", output: "分类型运行证据" },
    { name: "确认回流", actor: "产品 / 领导", input: "结果、限制、失败、证据新鲜度", ai: "汇总但不代替人的判断", gate: "人验收、决定发布或继续", output: "状态与下一轮目标" }
  ];

  function initWorkflow() {
    const buttons = $$('[data-workflow-stage]');
    const panel = $('[data-workflow-detail]');
    const progress = $('[data-workflow-progress]');
    if (!buttons.length || !panel) return;
    let active = 0;
    function render() {
      const item = workflowStages[active];
      buttons.forEach((button,index) => button.classList.toggle("is-active", index === active));
      if (progress) progress.style.width = `${((active + 1) / workflowStages.length) * 100}%`;
      panel.innerHTML = `<div class="output-head"><strong>STEP ${String(active + 1).padStart(2,"0")} · ${escapeHtml(item.name)}</strong><span class="status demo">${escapeHtml(item.actor)}</span></div><div class="output-body"><div class="output-grid"><article class="metric"><small>输入</small><strong>事实进入</strong><p>${escapeHtml(item.input)}</p></article><article class="metric"><small>AI 自动动作</small><strong>受控执行</strong><p>${escapeHtml(item.ai)}</p></article><article class="metric"><small>输出</small><strong>${escapeHtml(item.output)}</strong><p>输出回到同一工作项，供下一角色消费。</p></article></div><div class="callout" style="margin-top:14px"><span class="status human">HUMAN GATE</span><div><strong>${escapeHtml(item.gate)}</strong><p>AI 不把建议、页面状态或检查结果自动升级成人的决定。</p></div></div></div>`;
    }
    buttons.forEach((button,index) => button.addEventListener("click", () => { active = index; render(); }));
    $('[data-workflow-next]')?.addEventListener("click", () => { active = (active + 1) % workflowStages.length; render(); showToast(active === 0 ? "演示流程已回到新一轮需求" : `进入演示阶段：${workflowStages[active].name}`); });
    render();
  }

  const boardItems = [
    { id:"W-2048", title:"知识答案来源体验", team:"知识产品", state:"进行中", risk:"中", progress:68, owner:"林芷", people:["林芷","顾遥","周屿","AI"], updated:"今天 14:20", evidence:"2h", blocked:"证据契约等待确认", contributions:[["林芷","产品","需求与 5 条 AC"],["顾遥","架构","方案比较与契约草案"],["周屿","研发","完成最小纵向链"],["AI","协作 Agent","检查与证据汇总"]], timeline:[["14:20","真实页面路径发现冲突态缺陷"],["11:35","研发回流当前构建与自动检查"],["昨天","架构方案 B 获人确认"]] },
    { id:"W-2051", title:"移动端工作台适配", team:"执行平台", state:"测试中", risk:"低", progress:84, owner:"周屿", people:["周屿","叶澄","AI"], updated:"今天 13:10", evidence:"1h", blocked:"无", contributions:[["周屿","研发","移动布局实现"],["叶澄","测试","双视口页面路径"],["AI","协作 Agent","结构检查与复测"]], timeline:[["13:10","390×844 页面路径通过"],["10:40","长路径换行缺陷修复"],["昨天","方案与回退边界确认"]] },
    { id:"W-2054", title:"新成员协作上手指引", team:"协作方法", state:"进行中", risk:"低", progress:55, owner:"苏禾", people:["苏禾","林芷","AI"], updated:"今天 10:05", evidence:"4h", blocked:"等待首次使用者试用", contributions:[["苏禾","产品","使用流程与场景"],["林芷","体验","信息架构评审"],["AI","协作 Agent","页面原型"]], timeline:[["10:05","帮助中心结构完成"],["昨天","三种继续入口确认"],["2 天前","工作项创建需求建立"]] },
    { id:"W-2056", title:"Agent 运行证据模型", team:"执行平台", state:"阻塞", risk:"高", progress:32, owner:"顾遥", people:["顾遥","叶澄","AI"], updated:"昨天 18:30", evidence:"20h", blocked:"真实运行身份字段未确认", contributions:[["顾遥","架构","证据类型与边界"],["叶澄","测试","反例与失败保留规则"],["AI","协作 Agent","候选模型整理"]], timeline:[["昨天","因身份字段未确认停止实施"],["2 天前","测试指出检查/测试混淆风险"],["3 天前","形成第一版候选模型"]] },
    { id:"W-2060", title:"知识目录检索体验", team:"知识产品", state:"已完成", risk:"低", progress:100, owner:"林芷", people:["林芷","周屿","叶澄","AI"], updated:"2 天前", evidence:"2d", blocked:"无", contributions:[["林芷","产品","范围与验收"],["周屿","研发","目录筛选实现"],["叶澄","测试","真实入口回归"],["AI","协作 Agent","执行与记录"]], timeline:[["2 天前","产品验收并确认完成"],["3 天前","真实页面路径 6/6"],["4 天前","研发交付当前构建"]] },
    { id:"W-2063", title:"云执行授权可视化", team:"协作方法", state:"待方案", risk:"中", progress:18, owner:"苏禾", people:["苏禾","顾遥","AI"], updated:"3 天前", evidence:"3d", blocked:"授权粒度仍需产品确认", contributions:[["苏禾","产品","问题与用户路径"],["顾遥","架构","三种授权模型"],["AI","协作 Agent","风险与反例整理"]], timeline:[["3 天前","提出三种授权候选"],["4 天前","查重后绑定已有目标"],["5 天前","记录产品原始需求"]] },
    { id:"W-2068", title:"暂无负责人演示项", team:"知识产品", state:"待方案", risk:"高", progress:8, owner:"未分配", people:["AI"], updated:"6 天前", evidence:"6d", blocked:"缺少目标负责人", contributions:[["AI","协作 Agent","仅完成查重与问题整理"]], timeline:[["6 天前","因缺少目标负责人停止"]] }
  ];

  function initBoard() {
    const body = $('[data-board-body]');
    const detail = $('[data-board-detail]');
    const empty = $('[data-board-empty]');
    if (!body || !detail) return;
    let activeId = boardItems[0].id;
    const filters = { search: $('[data-filter="search"]'), team: $('[data-filter="team"]'), state: $('[data-filter="state"]'), risk: $('[data-filter="risk"]') };
    function statusClass(state) { return state === "已完成" ? "pass" : state === "阻塞" ? "blocked" : state === "测试中" ? "info" : state === "待方案" ? "wait" : "current"; }
    function initials(name) { return name === "AI" ? "AI" : name.slice(-1); }
    function visibleItems() {
      const q = filters.search.value.trim().toLowerCase();
      return boardItems.filter(item => (!q || `${item.id} ${item.title} ${item.owner}`.toLowerCase().includes(q)) && (!filters.team.value || item.team === filters.team.value) && (!filters.state.value || item.state === filters.state.value) && (!filters.risk.value || item.risk === filters.risk.value));
    }
    function renderDetail(item) {
      detail.innerHTML = `<div class="panel-title"><div><small>${escapeHtml(item.id)} · DEMO WORK ITEM</small><h3>${escapeHtml(item.title)}</h3></div><span class="status ${statusClass(item.state)}">${escapeHtml(item.state)}</span></div><div class="output-grid" style="margin-top:14px"><article class="metric"><small>负责人</small><strong>${escapeHtml(item.owner)}</strong><p>${escapeHtml(item.team)}</p></article><article class="metric"><small>进度</small><strong>${item.progress}%</strong><div class="progress-track"><i style="width:${item.progress}%"></i></div></article><article class="metric"><small>证据新鲜度</small><strong>${escapeHtml(item.evidence)}</strong><p>最近更新 ${escapeHtml(item.updated)}</p></article></div><div class="callout" style="margin-top:12px"><span class="status ${item.blocked === "无" ? "pass" : "blocked"}">${item.blocked === "无" ? "CLEAR" : "BLOCKER"}</span><div><strong>${escapeHtml(item.blocked)}</strong><p>阻塞是演示状态，不代表真实团队或人员表现。</p></div></div><p class="eyebrow" style="margin-top:18px">PARTICIPANTS & CONTRIBUTION</p><div class="contribution-list">${item.contributions.map(([name,role,work]) => `<article class="contribution"><span class="avatar">${escapeHtml(initials(name))}</span><div><strong>${escapeHtml(name)} · ${escapeHtml(role)}</strong><small>${escapeHtml(work)}</small></div><span class="status demo">DEMO</span></article>`).join("")}</div>`;
      $('[data-board-timeline]').innerHTML = item.timeline.map(([time,event]) => `<li><strong>${escapeHtml(event)}</strong><small>${escapeHtml(time)} · 演示活动</small></li>`).join("");
    }
    function render() {
      const items = visibleItems();
      if (!items.some(item => item.id === activeId)) activeId = items[0]?.id || "";
      body.innerHTML = items.map(item => `<tr data-board-row="${item.id}" class="${item.id === activeId ? "is-active" : ""}" tabindex="0"><td><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.id)} · DEMO</small></td><td><span class="status ${statusClass(item.state)}">${escapeHtml(item.state)}</span></td><td>${escapeHtml(item.owner)}<small>${escapeHtml(item.team)}</small></td><td>${item.progress}%<div class="mini-progress"><i style="width:${item.progress}%"></i></div></td><td><div class="avatar-stack">${item.people.slice(0,4).map(name => `<span class="avatar" title="${escapeHtml(name)}">${escapeHtml(initials(name))}</span>`).join("")}</div></td><td>${escapeHtml(item.risk)}<small>${escapeHtml(item.updated)}</small></td></tr>`).join("");
      empty.hidden = items.length > 0;
      detail.closest('[data-board-detail-wrap]').hidden = items.length === 0;
      $$('[data-board-row]', body).forEach(row => {
        const activate = () => { activeId = row.dataset.boardRow; render(); };
        row.addEventListener("click", activate);
        row.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); activate(); } });
      });
      const active = items.find(item => item.id === activeId);
      if (active) renderDetail(active);
      $('[data-count-visible]').textContent = items.length;
    }
    Object.values(filters).forEach(control => control.addEventListener(control.tagName === "INPUT" ? "input" : "change", render));
    $$('[data-reset-filters]').forEach(button => button.addEventListener("click", () => { Object.values(filters).forEach(control => { control.value = ""; }); render(); }));
    render();
  }

  const initializers = { hub: initHub, requirements: initRequirements, architecture: initArchitecture, development: initDevelopment, testing: initTesting, workflow: initWorkflow, board: initBoard };
  initializers[currentPage]?.();
})();
