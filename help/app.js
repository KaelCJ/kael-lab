(() => {
  const demos = {
    "collaboration-create": {
      title: "创建或绑定工作项",
      copy: "先告诉 Agent 目标，并明确“创建工作项”。Agent 应先查现有项；同一目标已经存在时继续原编号，不重复建项。",
      prompt: "为“优化知识问答来源体验”创建工作项，先查重，再整理需求和验收标准。",
      preview: [["CHECK", "查询现有工作项与目标关键词"], ["MATCH", "没有同一目标时分配新编号"], ["READY", "建立来源、需求、方案、执行与产出导航"]],
      boundary: "创建目录不等于已获准修改产品、运行命令、提交或发布。"
    },
    "collaboration-structure": {
      title: "理解目录职责",
      copy: "入口只导航；来源保留原话；需求保存当前基线；方案记录取舍；执行分开计划与实际；测试记录证据；产出面向最终使用者。",
      prompt: "解释 R<编号> 当前各目录的职责，并指出这次应该读哪些文件；只读，不修改。",
      preview: [["README", "当前简介与交付导航"], ["SOURCE → REQ", "原话与当前需求分离"], ["PLAN → FACT", "方案与实际执行分离"], ["EVIDENCE", "检查只证明对应对象"]],
      boundary: "不要把状态、正文和事实复制到多个入口；每类内容只由一个当前所有者维护。"
    },
    "collaboration-continue": {
      title: "继续已有工作项",
      copy: "可从代办进入，可先查看代码现场再匹配，也可直接指定 R 编号。无论从哪里进入，都要回读当前事实，而不是靠上次 Session 的记忆。",
      prompt: "继续 R<编号>。先回读当前需求、方案、执行记录和代码现场，再告诉我下一步；暂不修改。",
      preview: [["1 / TODO", "从进行中列表选择"], ["2 / CODE", "由当前问题和改动匹配唯一工作项"], ["3 / ID", "直接指定 R 编号继续"]],
      boundary: "如果编号重复、目录缺失或当前问题不属于该目标，应停下并暴露冲突。"
    },
    "collaboration-authority": {
      title: "说清本轮授权",
      copy: "查看、设计、修改、验证、提交和发布是不同动作。越接近真实写入和外部副作用，授权对象、范围和停止条件越要具体。",
      prompt: "继续 R<编号>：允许修改帮助页并做本地浏览器验证；不要提交、发布或修改产品源码。",
      preview: [["READ", "查看项目事实"], ["WRITE", "只改帮助页范围"], ["RUN", "允许本地静态验证"], ["STOP", "Git 与外部发布保持未授权"]],
      boundary: "“可以看看”不能被扩展成修改；“方案没问题”也不能被扩展成实施和发布。"
    },
    "collaboration-archive": {
      title: "Session 太长时手动收口",
      copy: "先把稳定事实回写到唯一工作项，再手动调用归档检查。它核对当前 Session、目录、索引和引用，适合时才归档；需要继续时取消归档原项。",
      prompt: "$nest-archive-check：检查当前 Session 是否已完整回写；满足唯一归属与无冲突时再归档。",
      preview: [["PERSIST", "来源、需求、方案、实际动作已回写"], ["CHECK", "唯一编号、目录、引用与未完成目标"], ["DECIDE", "保持活动 / 可恢复归档 / 停止处理"]],
      boundary: "当前是手动 Skill；自动触发归档检查只是 Roadmap，不能写成已存在能力。"
    },
    "nest-browse": {
      title: "浏览主题与目录",
      copy: "从领域主题进入目录，观察文档标题、层级和最近上下文。还没形成问题时，先浏览比直接问“大而全”的问题更稳。",
      prompt: "我在异步执行中丢失了上下文，应该先核对哪些机制和边界？",
      preview: [["TOPIC", "上下文与链路传播"], ["DOC", "异步边界中的传播机制"], ["DOC", "诊断顺序与常见误区"]],
      boundary: "目录命中只能证明材料存在，不能证明它适用于你的版本和现场。"
    },
    "nest-open": {
      title: "打开多文档标签",
      copy: "把核心说明、能力卡和边界材料保留在多个标签中，避免来回跳转丢失比较上下文。关闭标签不会删除知识文档。",
      prompt: "打开“上下文传播机制”和“异步执行诊断”两份文档，我要对照适用边界。",
      preview: [["TAB 01", "上下文传播机制 · ACTIVE"], ["TAB 02", "异步执行诊断"], ["COMPARE", "共同术语与不同适用条件"]],
      boundary: "多标签是阅读状态，不代表系统自动合并了多个来源的结论。"
    },
    "nest-ask": {
      title: "提出具体问题",
      copy: "给出场景、观察到的现象、已核对内容和期望结果。问题越接近真实现场，知识库越能返回可执行的检查顺序。",
      prompt: "消息消费切到线程池后 Trace 断了；入口正常、子线程无上下文。应该先检查传播还是存储？",
      preview: [["SCENE", "消息消费 → 自定义线程池"], ["OBSERVE", "主线程有上下文，子线程丢失"], ["EXPECT", "最小核对顺序与不适用边界"]],
      boundary: "不要在问题里放密码、Token、客户原文或其他秘密。"
    },
    "nest-source": {
      title: "核对答案来源",
      copy: "展开来源，检查文档标题、命中片段、版本与适用范围。答案中的每个关键判断都应能回到来源，或明确标为推断。",
      prompt: "展开这段答案的来源，并逐条说明哪些是文档事实、哪些是条件化建议。",
      preview: [["SOURCE 1", "异步传播机制 · 支持“需要显式传播”"], ["SOURCE 2", "诊断清单 · 支持“先核对执行边界”"], ["GAP", "当前项目实际封装方式仍需查看代码"]],
      boundary: "相似词命中不是可靠引用；来源片段必须真正支持答案。"
    },
    "nest-followup": {
      title: "沿当前上下文继续追问",
      copy: "补充新条件或指出冲突，让追问消费已有问题和来源。需要切换主题时再开启新会话，避免上下文污染。",
      prompt: "补充：我们使用的是自定义 Executor 包装，不是框架默认线程池。上一条建议哪些仍适用？",
      preview: [["KEEP", "异步边界需要显式传播"], ["REVISE", "默认线程池配置不再适用"], ["NEXT", "查看自定义包装的 capture / restore 位置"]],
      boundary: "新条件改变结论时应显式修正，不用后来的答案无痕覆盖旧回答。"
    },
    "nest-boundary": {
      title: "无可靠答案时停下",
      copy: "当来源不足、版本冲突或必须查看运行现场时，知识库应明确证据缺口并建议下一步，而不是补全一段看似确定的文字。",
      prompt: "如果现有知识不能回答，请直接列出缺少的证据和下一步核对对象，不要猜测实现。",
      preview: [["INSUFFICIENT", "缺少当前项目 Executor 包装代码"], ["CONFLICT", "两份文档覆盖不同版本"], ["NEXT", "查看代码、配置与一次真实 Trace"]],
      boundary: "“不知道”加上明确的证据缺口，比没有来源的确定答案更可靠。"
    },
    "workbench-directory": {
      title: "输入绝对工作目录",
      copy: "工作目录决定 Agent 能看到哪个项目现场。使用操作系统绝对路径，并在启动前确认它就是本轮要处理的仓库。",
      prompt: "先读取项目入口并查看当前工作树，只报告与当前目标相关的事实，不修改文件。",
      preview: [["WORKDIR", "已选择一个本机项目目录（演示）"], ["POLICY", "read-only"], ["APPROVAL", "never"]],
      boundary: "帮助页不会读取本机目录，也不会真实启动 Session。"
    },
    "workbench-session": {
      title: "启动 Session",
      copy: "Session 建立 Workbench 与一个本地子进程的连接。启动成功只证明连接存在，不代表 Thread 已创建或任务已经执行。",
      prompt: "启动 Session 后先报告连接状态和当前运行策略，不创建 Thread。",
      preview: [["SESSION", "starting"], ["PROCESS", "one child process"], ["READY", "connected · no thread selected"]],
      boundary: "当前模型是一 Session 对应一个子进程；自动重连尚未支持或未验证。"
    },
    "workbench-thread": {
      title: "创建或继续 Thread",
      copy: "新目标创建 Thread；已有上下文选择本机历史继续。Thread 是多轮任务上下文，不等于工作项，也不替代项目事实。",
      prompt: "创建新 Thread 处理当前目标；如果已有同一目标的历史 Thread，先列出候选，不要重复创建。",
      preview: [["THREAD", "new / resume"], ["HISTORY", "本机候选 3 条（演示）"], ["SELECT", "等待人选择"]],
      boundary: "Thread fork、archive、delete 尚未支持或未验证。"
    },
    "workbench-turn": {
      title: "发送 Turn",
      copy: "一次 Turn 应说明目标、范围、不做项和期望结果。当前策略是只读，因此涉及文件写入的请求不能被帮助页或界面状态升级为可执行。",
      prompt: "诊断当前页面的移动端溢出原因；只分析并给出证据，不修改文件。",
      preview: [["TURN", "accepted"], ["SCOPE", "analysis only"], ["STREAM", "等待事件"]],
      boundary: "文件写入和受控审批尚未支持或未验证；read-only 是当前真实边界。"
    },
    "workbench-events": {
      title: "查看流式事件",
      copy: "事件流让人看到 Session 状态、Thread/Turn 生命周期、文本增量与工具动作。它帮助判断是否需要停止，不等于显示隐藏推理。",
      prompt: "继续运行；如果需要写文件或缺少权限，停止并清楚报告阻塞。",
      preview: [["event", "turn.started"], ["delta", "正在读取项目入口…"], ["tool", "只读文件检查"], ["event", "turn.completed"]],
      boundary: "事件成功只证明这次事件链完成，不能替代对最终结果的核对。"
    },
    "workbench-stop": {
      title: "停止 Turn 或关闭 Session",
      copy: "停止用于中断当前 Turn；关闭用于结束整个 Session 和子进程。先保存需要的结果，再选择动作；关闭后不要假设能自动恢复。",
      prompt: "停止当前 Turn，保留已经返回的事件；不要关闭整个 Session。",
      preview: [["STOP TURN", "中断当前执行，Session 保持连接"], ["CLOSE", "结束 Session 与子进程"], ["NOTICE", "自动恢复未验证"]],
      boundary: "停止、关闭和删除历史是不同动作；当前不支持从关闭状态自动重连。"
    },
    "workbench-history": {
      title: "查看本机历史",
      copy: "本机历史用于发现已有 Thread 并继续上下文。选择前核对工作目录、标题和最近时间，避免把另一个项目的历史带进当前任务。",
      prompt: "列出当前工作目录相关的本机历史 Thread，只展示标题、时间和标识，不自动继续。",
      preview: [["HISTORY", "移动端布局诊断 · 2h"], ["HISTORY", "知识来源交互分析 · 1d"], ["ACTION", "等待人选择继续"]],
      boundary: "本机历史是运行上下文，不是工作项、Git 或项目事实的替代品。"
    }
  };

  const topics = [...document.querySelectorAll("[data-topic]")];
  const topicLinks = [...document.querySelectorAll("[data-topic-link]")];
  const validTopics = new Set(topics.map(topic => topic.dataset.topic));
  const getRequestedTopic = () => {
    const value = new URLSearchParams(window.location.search).get("topic");
    return validTopics.has(value) ? value : "collaboration";
  };

  function selectTopic(topicName, updateHistory = false) {
    topics.forEach(topic => { topic.hidden = topic.dataset.topic !== topicName; });
    topicLinks.forEach(link => link.setAttribute("aria-current", link.dataset.topicLink === topicName ? "page" : "false"));
    if (updateHistory) {
      const url = new URL(window.location.href);
      url.searchParams.set("topic", topicName);
      window.history.pushState({ topic: topicName }, "", url);
    }
  }

  topicLinks.forEach(link => link.addEventListener("click", event => {
    const topicName = link.dataset.topicLink;
    if (!validTopics.has(topicName)) return;
    event.preventDefault();
    selectTopic(topicName, true);
    const target = document.querySelector(`[data-topic="${topicName}"]`);
    target?.scrollIntoView({ block: "start" });
  }));
  window.addEventListener("popstate", () => selectTopic(getRequestedTopic()));

  function renderPreview(node, lines) {
    node.innerHTML = lines.map(([label, value]) => `<div class="preview-line"><b>${label}</b><span>${value}</span></div>`).join("");
  }

  document.querySelectorAll("[data-topic-step]").forEach(button => button.addEventListener("click", () => {
    const demo = demos[button.dataset.demo];
    const topicName = button.dataset.topicStep;
    const panel = document.querySelector(`[data-demo-panel="${topicName}"]`);
    if (!demo || !panel) return;
    const siblings = [...document.querySelectorAll(`[data-topic-step="${topicName}"]`)];
    siblings.forEach(candidate => candidate.classList.toggle("is-active", candidate === button));
    panel.querySelector("[data-demo-counter]").textContent = `STEP ${String(siblings.indexOf(button) + 1).padStart(2, "0")} / ${String(siblings.length).padStart(2, "0")}`;
    panel.querySelector("[data-demo-title]").textContent = demo.title;
    panel.querySelector("[data-demo-copy]").textContent = demo.copy;
    panel.querySelector("[data-demo-prompt]").textContent = demo.prompt;
    panel.querySelector("[data-demo-boundary]").textContent = demo.boundary;
    renderPreview(panel.querySelector("[data-demo-preview]"), demo.preview);
  }));

  const toast = document.querySelector("[data-toast]");
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
  }
  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
  document.querySelectorAll("[data-copy-prompt]").forEach(button => button.addEventListener("click", async () => {
    const text = button.closest(".prompt-box").querySelector("[data-demo-prompt]").textContent;
    try { await copyText(text); showToast("已复制示例入口"); }
    catch { showToast("复制失败，请手动选择文本"); }
  }));

  document.querySelectorAll("[data-topic-step].is-active").forEach(button => button.click());
  selectTopic(getRequestedTopic());
})();
