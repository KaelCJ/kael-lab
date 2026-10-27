(() => {
  const storageKey = 'kael-lab-life-checklist-v1';
  const tasks = [...document.querySelectorAll('[data-task]')];
  const notes = [...document.querySelectorAll('.note')];
  const progress = document.querySelector('[data-progress]');
  const progressBar = document.querySelector('[data-progress-bar]');
  const storageNote = document.querySelector('[data-storage-note]');

  const showProgress = () => {
    const count = tasks.filter(task => task.checked).length;
    progress.textContent = count === tasks.length ? `${tasks.length} 件小事，都准备好了。` : `已准备好 ${count} / ${tasks.length} 件小事`;
    progressBar.style.width = `${count / tasks.length * 100}%`;
  };

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(saved)) tasks.forEach(task => { task.checked = saved.includes(task.dataset.task); });
  } catch {
    storageNote.textContent = '浏览器暂时无法读取记录，仍可在本页勾选。';
  }

  const saveProgress = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(tasks.filter(task => task.checked).map(task => task.dataset.task)));
      storageNote.textContent = '勾选仅保存在当前浏览器。';
    } catch {
      storageNote.textContent = '本次更改未保存，刷新可能恢复原进度。';
    }
    showProgress();
  };

  const openLinkedNote = () => {
    const linkedNote = notes.find(note => `#${note.id}` === location.hash);
    if (linkedNote) linkedNote.open = true;
  };

  notes.forEach(note => { note.open = note.id === 'food' || `#${note.id}` === location.hash; });
  // Opening before the native anchor jump keeps the destination's contents in view.
  document.querySelectorAll('.topic-card').forEach(link => {
    link.addEventListener('click', () => {
      const note = notes.find(item => `#${item.id}` === link.hash);
      if (note) note.open = true;
    });
  });
  window.addEventListener('hashchange', openLinkedNote);
  tasks.forEach(task => task.addEventListener('change', saveProgress));
  document.querySelector('[data-reset]').addEventListener('click', () => {
    tasks.forEach(task => { task.checked = false; });
    saveProgress();
  });
  showProgress();
  document.querySelector('[data-progress-note]').hidden = false;
})();
