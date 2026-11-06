import { MODES, DIFFICULTIES, PACES, BIOMES, SUPPORTED_LOCALES, DEFAULT_LOCALE, loadSave, saveGame } from './game-settings.js?v=20261106-title1';
import { LOCALES, translate, modeName } from './game-i18n.js?v=20261106-title1';
import { CHARACTERS, HERO_TEXT } from './heroes.js?v=20261031-sf-requiem5';
import { attributeSummary, attributeDerivedSummary, attributeLabel } from './hero-attributes.js?v=20261030-attribute-contract1';

const $ = id => document.getElementById(id);
const LOADING_COPY = {
  'zh-CN': {
    title: '正在准备对局', resume: '正在准备继续', modules: '正在下载游戏程序…',
    assets: '正在加载角色与战场资源…', world: '正在准备战场…', ready: '准备完成',
    downloading: '下载完成后会继续准备角色与战场。', count: '已就绪 {completed} / {total}',
    failed: '加载未完成', failedDetail: '请检查网络后重试，或返回选择其他皮肤。',
    timeout: '45 秒没有新的加载进度，请检查网络后重试。', retry: '重试', cancel: '返回选择', cancelResume: '返回暂停'
  },
  'zh-TW': {
    title: '正在準備對局', resume: '正在準備繼續', modules: '正在下載遊戲程式…',
    assets: '正在載入英雄與戰場資源…', world: '正在準備戰場…', ready: '準備完成',
    downloading: '下載完成後會繼續準備英雄與戰場。', count: '已就緒 {completed} / {total}',
    failed: '載入未完成', failedDetail: '請檢查網路後重試，或返回選擇其他外觀。',
    timeout: '45 秒沒有新的載入進度，請檢查網路後重試。', retry: '重試', cancel: '返回選擇', cancelResume: '返回暫停'
  },
  en: {
    title: 'Preparing your run', resume: 'Preparing to resume', modules: 'Downloading the game…',
    assets: 'Loading hero and battlefield assets…', world: 'Preparing the battlefield…', ready: 'Ready',
    downloading: 'Hero and battlefield preparation follows the download.', count: '{completed} / {total} ready',
    failed: 'Loading did not finish', failedDetail: 'Check your connection and retry, or go back to choose another skin.',
    timeout: 'No new loading progress for 45 seconds. Check your connection and retry.', retry: 'Retry', cancel: 'Back to selection', cancelResume: 'Back to pause'
  }
};

let save = loadSave();
let selection = normalizeSelection(save.settings);
let runtime = null, modulePromise = null, attempt = null;
let audioContext = null;
const t = (key, vars) => translate(selection.locale, key, vars);

function normalizeSelection(value = {}) {
  const member = (items, id, fallback = items[0].id) => items.some(item => item.id === id) ? id : fallback;
  return {
    character: member(CHARACTERS, value.character), biome: member(BIOMES, value.biome),
    difficulty: member(DIFFICULTIES, value.difficulty), pace: member(PACES, value.pace), mode: member(MODES, value.mode),
    skin: value.skin === 'dota1' ? 'dota1' : 'pixel', sound: value.sound !== false,
    locale: SUPPORTED_LOCALES.includes(value.locale) ? value.locale : DEFAULT_LOCALE
  };
}

function persist() {
  const { sound, pace, difficulty, mode, skin, locale } = selection;
  save.settings = { sound, pace, difficulty, mode, skin, locale };
  saveGame(save);
}

function unlockAudio(enabled) {
  if (!enabled) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioContext && AudioContext) audioContext = new AudioContext();
    if (audioContext?.state === 'suspended') audioContext.resume().catch(() => {});
  } catch (_) { /* Audio may be unavailable on this device. */ }
}

function applyLocale() {
  document.documentElement.lang = selection.locale;
  document.title = t('documentTitle');
  document.querySelector('meta[name="description"]')?.setAttribute('content', t('metaDescription'));
  $('game-title').firstChild.textContent = t('titlePrefix');
  $('game-title').querySelector('span').textContent = t('titleSuffix');
  document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = t(element.dataset.i18n); });
  document.querySelectorAll('[data-i18n-attr]').forEach(element => {
    for (const pair of element.dataset.i18nAttr.split(';')) {
      const [attribute, key] = pair.split(':');
      if (attribute && key) element.setAttribute(attribute, t(key));
    }
  });
  for (const [locale, key] of [['zh-CN', 'languageZhCN'], ['zh-TW', 'languageZhTW'], ['en', 'languageEn']]) {
    const button = $(`locale-${locale}`);
    button.textContent = t(key);
    button.setAttribute('aria-pressed', String(locale === selection.locale));
  }
}

function portrait(id) {
  return `<img class="art-icon" src="assets/art/dota1/heroes/${id}.png" alt="" width="64" height="64" loading="eager" decoding="async" fetchpriority="high">`;
}

function renderTitle() {
  applyLocale();
  $('game').dataset.skin = selection.skin;
  const list = $('character-list'), tiles = [...list.querySelectorAll('[data-character]')];
  if (tiles.length !== CHARACTERS.length || tiles.some((tile, index) => tile.dataset.character !== CHARACTERS[index].id)) {
    list.innerHTML = CHARACTERS.map(hero => `<button class="hero-tile" type="button" data-character="${hero.id}" aria-controls="hero-details"><span class="hero-avatar">${portrait(hero.id)}</span><span class="hero-tile-name"></span></button>`).join('');
  }
  for (const hero of CHARACTERS) {
    const button = list.querySelector(`[data-character="${hero.id}"]`);
    button.disabled = false;
    button.setAttribute('aria-pressed', String(hero.id === selection.character));
    button.querySelector('.hero-tile-name').innerHTML = hero.id === 'tb' && selection.locale === 'en' ? 'Terror<wbr>blade' : HERO_TEXT[selection.locale][hero.id][0];
  }
  const hero = CHARACTERS.find(item => item.id === selection.character);
  const [name, profession, description, active, , passive] = HERO_TEXT[selection.locale][hero.id];
  const attributes = attributeSummary(hero.attributes, selection.locale);
  const derived = attributeDerivedSummary(hero.attributes, selection.locale, hero.attributes.primary);
  $('hero-details').innerHTML = `<div class="hero-details-art">${portrait(hero.id)}</div><div class="hero-details-copy"><h3>${name}</h3><p class="hero-profession">${profession}</p><p>${description}</p>${attributes ? `<p class="hero-attributes"><span>${selection.locale === 'en' ? 'Attributes' : selection.locale === 'zh-TW' ? '屬性' : '属性'}</span> ${attributes} · ${t('statPrimaryAttribute')} ${attributeLabel(hero.attributes.primary, selection.locale)}${derived ? ` · ${derived}` : ''}</p>` : ''}<p class="hero-skill"><span>${t('passive')}</span> ${passive}</p><p class="hero-skill"><span>${t('active')}</span> ${active}</p></div>`;
  const locale = LOCALES[selection.locale];
  $('biome-list').innerHTML = BIOMES.map(biome => {
    const [name, description] = locale.biomes[biome.id];
    const extension = biome.id === 'dota' ? 'jpg' : 'svg';
    return `<button class="selection-card" type="button" data-biome="${biome.id}" aria-pressed="${selection.biome === biome.id}"><span class="selection-icon"><img class="art-icon" src="assets/art/pixel/map-${biome.id}-preview.${extension}" alt="" width="80" height="80" loading="lazy" decoding="async" fetchpriority="low"></span><span><strong>${name}</strong><small>${description}</small></span></button>`;
  }).join('');
  $('difficulty-list').innerHTML = DIFFICULTIES.map(item => `<button type="button" data-difficulty="${item.id}" aria-pressed="${selection.difficulty === item.id}">${locale.difficulty[item.id]}</button>`).join('');
  $('pace-list').innerHTML = PACES.map(item => `<button type="button" data-pace="${item.id}" aria-pressed="${selection.pace === item.id}">${locale.pace[item.id]}</button>`).join('');
  $('mode-list').innerHTML = MODES.map(item => `<button type="button" data-mode="${item.id}" aria-pressed="${selection.mode === item.id}">${modeName(selection.locale, item.id)}</button>`).join('');
  $('skin-list').innerHTML = [['pixel', t('skinPixel')], ['dota1', t('skinDota1')]].map(([id, name]) => `<button type="button" data-skin="${id}" aria-pressed="${selection.skin === id}">${name}</button>`).join('');
  $('sound-button').textContent = t(selection.sound ? 'soundOn' : 'soundOff');
  const best = save.records[`${selection.character}:${selection.biome}:${selection.difficulty}:${selection.mode}`] || 0;
  $('record-label').textContent = `${t('record', { best: best ? t('bestWave', { wave: best }) : t('noRecord'), wins: save.wins })} · ${t(selection.mode === 'endless' ? 'modeEndless' : 'modeExpedition')}`;
  $('start-button').disabled = false;
}

function showTitle(next = selection) {
  save = loadSave();
  selection = normalizeSelection({ ...selection, ...next });
  renderTitle();
  if (attempt) return;
  $('loading-screen').classList.add('hidden');
  $('title-screen').classList.remove('hidden');
  $('start-button').focus({ preventScroll: true });
}

function showLoading(current) {
  for (const screen of document.querySelectorAll('.screen')) screen.classList.add('hidden');
  $('hud').classList.add('hidden');
  $('touch-controls').classList.add('hidden');
  $('loading-screen').classList.remove('hidden');
  $('loading-screen').setAttribute('aria-busy', String(!current.failed));
  const copy = LOADING_COPY[current.selection.locale];
  $('loading-title').textContent = current.failed ? copy.failed : current.resume ? copy.resume : copy.title;
  $('loading-retry').textContent = copy.retry;
  $('loading-retry').hidden = !current.failed;
  $('loading-retry').classList.toggle('hidden', !current.failed);
  $('loading-progress').classList.toggle('hidden', current.failed);
  $('loading-cancel').textContent = current.resume ? copy.cancelResume : copy.cancel;
}

function cancelLoading() {
  const current = attempt;
  if (!current) return;
  attempt = null;
  clearTimeout(current.timer);
  current.controller.abort();
  $('loading-screen').classList.add('hidden');
  if (runtime) runtime.cancel(current.resume);
  else showTitle(current.selection);
}

function resetTimeout(current) {
  clearTimeout(current.timer);
  current.timer = setTimeout(() => {
    if (attempt !== current) return;
    current.timedOut = true;
    current.controller.abort(new Error('Loading progress timed out'));
  }, 45000);
}

function progress(current, value) {
  if (attempt !== current || current.controller.signal.aborted) return;
  const key = `${value.stage}:${value.completed}:${value.total}`;
  if (key !== current.progressKey) { current.progressKey = key; resetTimeout(current); }
  const copy = LOADING_COPY[current.selection.locale];
  $('loading-status').textContent = copy[value.stage] || copy.assets;
  const total = Number(value.total), completed = Number(value.completed), bar = $('loading-progress');
  if (Number.isFinite(total) && total > 0 && Number.isFinite(completed)) {
    bar.max = total; bar.value = Math.max(0, Math.min(total, completed));
    $('loading-detail').textContent = copy.count.replace('{completed}', String(Math.max(0, Math.min(total, completed)))).replace('{total}', String(total));
  } else {
    bar.removeAttribute('value');
    $('loading-detail').textContent = '';
  }
}

async function ensureRuntime(current) {
  if (runtime) return runtime;
  if (!modulePromise) modulePromise = import('./game.js?v=20261106-title1').catch(error => { modulePromise = null; throw error; });
  const module = await modulePromise;
  if (current.controller.signal.aborted || attempt !== current) throw new DOMException('Loading cancelled', 'AbortError');
  runtime = module.createGame({
    audioContext: () => audioContext,
    onTitle: showTitle,
    onRestart: () => loading(runtime.selection()),
    onResume: () => loading(runtime.selection(), true)
  });
  return runtime;
}

async function loading(next, resume = false) {
  if (attempt && !attempt.failed) return;
  if (attempt) { clearTimeout(attempt.timer); attempt.controller.abort(); }
  const current = { selection: normalizeSelection(next), resume, controller: new AbortController(), timer: null, failed: false };
  unlockAudio(current.selection.sound);
  attempt = current;
  showLoading(current);
  const copy = LOADING_COPY[current.selection.locale];
  $('loading-status').textContent = runtime ? copy.assets : copy.modules;
  $('loading-detail').textContent = runtime ? '' : copy.downloading;
  $('loading-progress').removeAttribute('value');
  $('loading-title').focus({ preventScroll: true });
  resetTimeout(current);
  const interrupted = new Promise((_, reject) => current.controller.signal.addEventListener('abort', () => reject(current.controller.signal.reason), { once: true }));
  try {
    const game = await Promise.race([ensureRuntime(current), interrupted]);
    if (attempt !== current || current.controller.signal.aborted) return;
    progress(current, { stage: 'assets', completed: 0, total: 0 });
    await Promise.race([game.prepare(current.selection, { signal: current.controller.signal, onProgress: value => progress(current, value), resume }), interrupted]);
    if (attempt !== current || current.controller.signal.aborted) return;
    if (document.hidden) { cancelLoading(); return; }
    clearTimeout(current.timer);
    game.start(resume);
    if (attempt === current) { attempt = null; $('loading-screen').classList.add('hidden'); }
  } catch (error) {
    if (attempt !== current) return;
    if (document.hidden) { cancelLoading(); return; }
    clearTimeout(current.timer);
    current.controller.abort(error);
    current.failed = true;
    showLoading(current);
    $('loading-status').textContent = copy.failed;
    $('loading-detail').textContent = current.timedOut ? copy.timeout : copy.failedDetail;
    $('loading-progress').removeAttribute('value');
    $('loading-title').focus({ preventScroll: true });
  }
}

function bindTitle() {
  $('title-screen').addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || button.disabled || attempt) return;
    if (button.id === 'start-button') { persist(); loading(selection); return; }
    let changed = false;
    for (const key of ['character', 'biome', 'difficulty', 'pace', 'mode', 'skin', 'locale']) {
      if (button.dataset[key] != null) { selection[key] = button.dataset[key]; changed = true; }
    }
    if (button.id === 'sound-button') { selection.sound = !selection.sound; changed = true; }
    if (!changed) return;
    persist(); renderTitle();
    const selector = button.id ? `#${button.id}` : ['character', 'biome', 'difficulty', 'pace', 'mode', 'skin', 'locale'].filter(key => button.dataset[key] != null).map(key => `[data-${key}="${button.dataset[key]}"]`).join('');
    $('title-screen').querySelector(selector)?.focus({ preventScroll: true });
  });
  $('loading-retry').addEventListener('click', () => { if (attempt?.failed) loading(attempt.selection, attempt.resume); });
  $('loading-cancel').addEventListener('click', cancelLoading);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && attempt) { event.preventDefault(); event.stopImmediatePropagation(); cancelLoading(); }
  }, true);
  document.addEventListener('visibilitychange', () => { if (document.hidden && attempt) cancelLoading(); });
}

if (new URLSearchParams(location.search).get('studio') === '1') {
  import('./game.js?v=20261106-title1').then(module => module.createGame({ onTitle: showTitle, onRestart: () => {}, onResume: () => {} })).catch(error => {
    parent.postMessage({ source: 'dotarogue-runtime', type: 'error', message: error.message }, location.origin);
  });
} else {
  bindTitle();
  renderTitle();
}
