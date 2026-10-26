const $ = id => document.getElementById(id);
const frame = $('studio-frame');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const allowedCategories = new Set(['heroes', 'equipment', 'buffs', 'effects', 'maps']);
let categories = [], selected = null, ready = false, loadingTimer = 0;
let selection = readLink();

function send(type, data = {}) {
  frame.contentWindow?.postMessage({ source: 'dotarogue-studio', type, ...data }, location.origin);
}

function readLink() {
  const params = new URLSearchParams(location.hash.slice(1));
  return {
    category: params.get('category') || 'heroes', id: params.get('id') || 'kael',
    variant: params.get('variant') || 'chaos-meteor',
    level: Math.max(1, Math.min(3, Math.floor(Number(params.get('level')) || 1))),
    stacks: Math.max(1, Math.min(99, Math.floor(Number(params.get('stacks')) || 1))),
    direction: params.get('direction') === 'left' || Number(params.get('direction')) === Math.PI ? Math.PI : 0,
    skin: params.get('skin') === 'draft' ? 'draft' : 'pixel',
    zoom: [.75, 1, 1.5].includes(Number(params.get('zoom'))) ? Number(params.get('zoom')) : 1,
    playing: !reducedMotion.matches && !document.hidden
  };
}

function saveLink() {
  const params = new URLSearchParams();
  for (const key of ['category', 'id', 'variant', 'level', 'stacks', 'skin', 'zoom']) {
    if (selection[key] !== undefined && selection[key] !== '') params.set(key, selection[key]);
  }
  params.set('direction', selection.direction === Math.PI ? 'left' : 'right');
  history.replaceState(null, '', `${location.pathname}${location.search}#${params}`);
  $('copy-status').textContent = '';
  $('copy-fallback').hidden = true;
  $('copy-fallback-label').hidden = true;
}

function safePath(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value, location.href);
    return url.origin === location.origin && ['http:', 'https:'].includes(url.protocol) ? url : null;
  } catch { return null; }
}

function setControls(enabled) {
  $('studio-controls').disabled = !enabled;
  for (const id of ['studio-play', 'studio-replay', 'studio-step', 'copy-view']) $(id).disabled = !enabled;
}

function showStage(message, retry = false) {
  $('stage-message').hidden = false;
  $('stage-message-text').textContent = message;
  $('frame-retry').hidden = !retry;
}

function fail(message) {
  clearTimeout(loadingTimer);
  ready = false;
  setControls(false);
  $('studio-categories').disabled = true;
  $('object-search').disabled = true;
  $('object-list').replaceChildren();
  $('list-empty').hidden = false;
  $('list-empty').textContent = '预览尚未就绪。';
  $('playback-status').textContent = '加载未完成';
  showStage(message, true);
}

function renderCategories() {
  const fragment = document.createDocumentFragment();
  for (const category of categories) {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'radio'; input.name = 'studio-category'; input.value = category.id;
    input.checked = category.id === selection.category;
    const text = document.createElement('span'); text.textContent = category.label;
    label.append(input, text); fragment.append(label);
  }
  $('category-options').replaceChildren(fragment);
}

function currentCategory() { return categories.find(category => category.id === selection.category); }

function renderObjects() {
  const category = currentCategory();
  const query = $('object-search').value.trim().toLocaleLowerCase();
  const items = (category?.items || []).filter(item =>
    `${item.name} ${item.id}`.toLocaleLowerCase().includes(query));
  $('category-name').textContent = category?.label || '预览对象';
  $('item-count').textContent = `${items.length} 个`;
  const fragment = document.createDocumentFragment();
  for (const item of items) {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'object-button'; button.dataset.itemId = item.id;
    button.setAttribute('aria-pressed', String(item.id === selection.id));
    const iconPath = safePath(item.icon);
    if (iconPath && /\.(svg|png|webp|jpg|jpeg)(?:$|\?)/i.test(iconPath.pathname + iconPath.search)) {
      const icon = document.createElement('img'); icon.className = 'object-icon'; icon.alt = '';
      icon.src = iconPath.href; icon.loading = 'lazy'; icon.addEventListener('error', () => icon.hidden = true, { once: true });
      button.append(icon);
    } else if (typeof item.icon === 'string' && item.icon.length < 12) {
      const icon = document.createElement('span'); icon.className = 'object-icon object-symbol';
      icon.textContent = item.icon; icon.setAttribute('aria-hidden', 'true'); button.append(icon);
    }
    const name = document.createElement('span'); name.className = 'object-label'; name.textContent = item.name;
    button.append(name); fragment.append(button);
  }
  $('object-list').replaceChildren(fragment);
  $('list-empty').hidden = items.length > 0;
  $('list-empty').textContent = query ? '没有匹配的对象，试试其他名称。' : '当前分类没有可预览的对象。';
}

function syncViewControls() {
  $('studio-skin').value = selection.skin;
  $('studio-zoom').value = String(selection.zoom);
  $('studio-level').value = String(selection.level);
  $('studio-stacks').value = selection.stacks;
  for (const input of document.querySelectorAll('[name="studio-direction"]')) {
    input.checked = (input.value === 'left' ? Math.PI : 0) === selection.direction;
  }
  $('studio-play').textContent = selection.playing ? '暂停' : '播放';
}

function renderDetails() {
  const variants = selected.variants || [];
  $('preview-name').textContent = selected.name;
  $('detail-name').textContent = selected.name;
  $('detail-category').textContent = currentCategory().label;
  $('object-description').textContent = selected.description || '当前对象没有额外说明。';
  $('studio-variant').replaceChildren(...variants.map(variant => {
    const option = document.createElement('option'); option.value = variant.id; option.textContent = variant.name;
    return option;
  }));
  $('variant-control').hidden = variants.length === 0;
  $('studio-variant').value = selection.variant;
  $('variant-description').textContent = variants.find(variant => variant.id === selection.variant)?.description || '';
  $('level-control').hidden = selected.levels !== 3;
  const heroGrowth = selection.category === 'heroes';
  document.querySelector('#level-control label').textContent = heroGrowth ? '英雄成长表现' : '强化等级';
  [...$('studio-level').options].forEach((option, index) => {
    option.textContent = heroGrowth ? `英雄 Lv.${[1, 5, 10][index]} · ${['初始', '成长', '成熟'][index]}` : `Lv.${index + 1}`;
  });
  $('stacks-control').hidden = !selected.stacks;
  const source = safePath(selected.source);
  if (source) {
    const link = document.createElement('a'); link.href = source.href; link.textContent = selected.source;
    link.target = '_blank'; link.rel = 'noopener'; $('source-info').replaceChildren(link);
  } else $('source-info').textContent = '当前对象未提供可打开的来源路径。';
  syncViewControls();
}

function selectObject(categoryId, itemId, variantId, preserveParameters = false) {
  const category = categories.find(value => value.id === categoryId) || categories[0];
  if (!category) return;
  selection.category = category.id;
  selected = category.items.find(item => item.id === itemId) || category.items[0];
  renderCategories();
  if (!selected) {
    send('play', { playing: false });
    selection.playing = false; setControls(false); renderObjects();
    $('preview-name').textContent = '暂无可预览对象'; $('detail-name').textContent = category.label;
    $('object-description').textContent = '当前分类还没有提供预览。';
    $('runtime-summary').textContent = ''; $('runtime-detail').textContent = '';
    $('source-info').textContent = '当前分类没有可查看的对象来源。';
    $('detail-category').textContent = category.label;
    showStage('当前分类没有可预览的对象。');
    return;
  }
  const variants = selected.variants || [];
  selection.id = selected.id;
  selection.variant = (variants.find(variant => variant.id === variantId)
    || variants.find(variant => selected.id === 'kael' && variant.id === 'chaos-meteor')
    || variants.find(variant => variant.id === 'active') || variants[0])?.id || '';
  selection.level = selected.levels === 3 && preserveParameters ? selection.level : 1;
  selection.stacks = selected.stacks && preserveParameters ? selection.stacks : 1;
  renderObjects(); renderDetails(); saveLink();
  setControls(true);
  $('runtime-summary').textContent = '正在准备当前对象…'; $('runtime-detail').textContent = '';
  $('playback-status').textContent = '正在准备场景';
  showStage('正在准备当前对象…');
  send('select', { selection: { ...selection } });
}

function sendSelection() {
  renderDetails(); saveLink();
  send('select', { selection: { ...selection } });
}

window.addEventListener('message', event => {
  if (event.origin !== location.origin || event.source !== frame.contentWindow) return;
  const data = event.data;
  if (!data || data.source !== 'dotarogue-runtime') return;
  if (data.type === 'catalog') {
    clearTimeout(loadingTimer);
    categories = Array.isArray(data.categories) ? data.categories.filter(category =>
      allowedCategories.has(category?.id) && typeof category.label === 'string' && Array.isArray(category.items))
      .map(category => ({ ...category, items: category.items.filter(item => typeof item?.id === 'string' && typeof item.name === 'string') })) : [];
    if (!categories.length) { fail('游戏没有提供可用的预览目录，可重试加载。'); return; }
    ready = true;
    $('studio-categories').disabled = false; $('object-search').disabled = false;
    selectObject(selection.category, selection.id, selection.variant, true);
  } else if (data.type === 'state' && ready && selected) {
    if (data.selection && (data.selection.category !== selection.category || data.selection.id !== selection.id
      || (data.selection.variant !== undefined && data.selection.variant !== selection.variant))) return;
    $('stage-message').hidden = true;
    if (typeof data.playing === 'boolean') selection.playing = data.playing;
    $('studio-play').textContent = selection.playing ? '暂停' : '播放';
    $('playback-status').textContent = selection.playing ? '演示中' : '已暂停';
    if (Number.isFinite(data.time)) $('preview-time').textContent = `${Math.max(0, data.time).toFixed(2)} 秒`;
    if (typeof data.summary === 'string') $('runtime-summary').textContent = data.summary;
    if (typeof data.detail === 'string') $('runtime-detail').textContent = data.detail;
    if (data.selection) {
      const previousLevel = selection.level, previousStacks = selection.stacks;
      if ([1, 2, 3].includes(data.selection.level)) selection.level = data.selection.level;
      if (Number.isInteger(data.selection.stacks) && data.selection.stacks > 0) selection.stacks = data.selection.stacks;
      $('studio-level').value = selection.level; $('studio-stacks').value = selection.stacks;
      if (previousLevel !== selection.level || previousStacks !== selection.stacks) saveLink();
    }
  } else if (data.type === 'error') {
    fail(typeof data.message === 'string' ? data.message : '游戏预览未能完成加载，请重试。');
  }
});

$('studio-categories').addEventListener('change', event => {
  const categoryId = event.target.value;
  $('object-search').value = '';
  selectObject(categoryId, '', '');
  Array.from(document.querySelectorAll('[name="studio-category"]'))
    .find(input => input.value === categoryId)?.focus({ preventScroll: true });
});
$('object-search').addEventListener('input', renderObjects);
$('object-list').addEventListener('click', event => {
  const button = event.target.closest('[data-item-id]');
  if (!button) return;
  const id = button.dataset.itemId;
  selectObject(selection.category, id, '');
  Array.from($('object-list').children).find(item => item.dataset.itemId === id)?.focus({ preventScroll: true });
});
$('studio-variant').addEventListener('change', event => { selection.variant = event.target.value; sendSelection(); });
$('studio-level').addEventListener('change', event => { selection.level = Number(event.target.value); sendSelection(); });
$('studio-stacks').addEventListener('change', event => {
  selection.stacks = Math.max(1, Math.min(99, Math.floor(Number(event.target.value) || 1))); sendSelection();
});
$('studio-controls').addEventListener('change', event => {
  const input = event.target;
  if (input.name === 'studio-direction') selection.direction = input.value === 'left' ? Math.PI : 0;
  else if (input.id === 'studio-skin') selection.skin = input.value;
  else if (input.id === 'studio-zoom') selection.zoom = Number(input.value);
  else return;
  saveLink(); send('view', { direction: selection.direction, skin: selection.skin, zoom: selection.zoom });
});
$('studio-play').addEventListener('click', () => {
  selection.playing = !selection.playing; syncViewControls(); send('play', { playing: selection.playing });
});
$('studio-replay').addEventListener('click', () => send('replay'));
$('studio-step').addEventListener('click', () => { selection.playing = false; syncViewControls(); send('step'); });
$('copy-view').addEventListener('click', async () => {
  saveLink();
  try {
    await navigator.clipboard.writeText(location.href);
    $('copy-status').textContent = '观察链接已复制。';
  } catch {
    $('copy-status').textContent = '请手动复制链接。';
    $('copy-fallback-label').hidden = false;
    $('copy-fallback').hidden = false; $('copy-fallback').value = location.href;
    $('copy-fallback').focus(); $('copy-fallback').select();
  }
});
window.addEventListener('hashchange', () => {
  selection = readLink();
  if (ready) { $('object-search').value = ''; selectObject(selection.category, selection.id, selection.variant, true); }
});
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) return;
  selection.playing = false; syncViewControls(); send('play', { playing: false });
});
reducedMotion.addEventListener('change', () => {
  if (!reducedMotion.matches) return;
  selection.playing = false; syncViewControls(); send('play', { playing: false });
});

function loadFrame() {
  ready = false; setControls(false);
  $('studio-categories').disabled = true; $('object-search').disabled = true;
  showStage('正在连接游戏预览…');
  clearTimeout(loadingTimer);
  loadingTimer = setTimeout(() => fail('尚未收到游戏预览响应。请检查连接后重新加载。'), 15000);
  const url = new URL(frame.dataset.src, location.href);
  url.searchParams.set('preview', Date.now()); frame.src = url.href;
}
frame.addEventListener('load', () => send('init'));
frame.addEventListener('error', () => fail('游戏预览页面未能加载，请重试。'));
$('frame-retry').addEventListener('click', loadFrame);
loadFrame();
