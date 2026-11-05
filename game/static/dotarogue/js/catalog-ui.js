const SAVE_KEY = 'kael-lab-starcore-survivor-v1';
const LOCALES = ['zh-CN', 'zh-TW', 'en'];

export function readCatalogLocale() {
  try {
    const locale = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}')?.settings?.locale;
    return LOCALES.includes(locale) ? locale : 'zh-CN';
  } catch { return 'zh-CN'; }
}

export function writeCatalogLocale(locale) {
  if (!LOCALES.includes(locale)) return;
  try {
    const value = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    const save = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    const settings = save.settings && typeof save.settings === 'object' && !Array.isArray(save.settings) ? save.settings : {};
    save.settings = { ...settings, locale };
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch { /* The archive remains usable without persistent storage. */ }
}

const TEXT = {
  'zh-CN': { hub: '图鉴', heroes: '角色', equipment: '武器', enemies: '怪物', buffs: 'Buff', studio: '设计工作台', game: '返回游戏', search: '搜索名称或说明', empty: '没有找到匹配的条目，试试其他关键词。', count: '{count} 个条目' },
  'zh-TW': { hub: '圖鑑', heroes: '角色', equipment: '武器', enemies: '怪物', buffs: 'Buff', studio: '設計工作台', game: '返回遊戲', search: '搜尋名稱或說明', empty: '沒有找到符合的條目，試試其他關鍵字。', count: '{count} 個條目' },
  en: { hub: 'Archive', heroes: 'Heroes', equipment: 'Weapons', enemies: 'Enemies', buffs: 'Buffs', studio: 'Design studio', game: 'Back to game', search: 'Search names or descriptions', empty: 'No matching entries. Try another keyword.', count: '{count} entries' }
};
const PAGES = { 'catalog.html': 'hub', 'heroes.html': 'heroes', 'equipment.html': 'equipment', 'enemies.html': 'enemies', 'buffs.html': 'buffs', 'studio.html': 'studio', 'index.html': 'game' };

export function initCatalogPage({ copy, render = () => {} }) {
  let locale = readCatalogLocale();
  const search = document.querySelector('[data-catalog-search]');
  function update() {
    document.documentElement.lang = locale;
    const text = copy[locale];
    document.title = `${text.title} · DotaRogue`;
    document.querySelectorAll('[data-catalog-copy]').forEach(node => {
      const value = text[node.dataset.catalogCopy];
      if (typeof value === 'string') node.textContent = value;
    });
    document.querySelectorAll('.catalog-header nav a').forEach(link => {
      const key = PAGES[link.getAttribute('href')];
      if (key) link.textContent = TEXT[locale][key];
    });
    document.querySelectorAll('[data-locale]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.locale === locale)));
    if (search) {
      search.placeholder = TEXT[locale].search;
      search.setAttribute('aria-label', TEXT[locale].search);
    }
    render(locale, search?.value.trim().toLocaleLowerCase() || '');
    const list = document.getElementById('catalog-list');
    const empty = document.getElementById('catalog-empty');
    if (empty && list) {
      empty.hidden = list.children.length > 0;
      empty.textContent = TEXT[locale].empty;
    }
    const count = document.getElementById('catalog-count');
    if (count && list) count.textContent = TEXT[locale].count.replace('{count}', list.children.length);
  }
  search?.addEventListener('input', update);
  document.querySelectorAll('[data-locale]').forEach(button => button.addEventListener('click', () => {
    locale = button.dataset.locale;
    writeCatalogLocale(locale);
    update();
  }));
  update();
}
