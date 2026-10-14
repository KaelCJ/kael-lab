// Private controller for the studio iframe; the game owns every scenario and renderer.
export function createStudioRuntime(api) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let selection = null, time = 0, elapsedSinceState = 0;
  let playing = !reducedMotion.matches && !document.hidden;
  let initialized = false, failed = false;

  function send(type, data = {}) {
    if (parent !== window) parent.postMessage({ source: 'dotarogue-runtime', type, ...data }, location.origin);
  }

  function setPlaying(value) {
    playing = value && !document.hidden;
    if (selection) selection = Object.freeze({ ...selection, playing });
  }

  function state() {
    elapsedSinceState = 0;
    const description = selection && !failed ? api.describe(selection, time) : {};
    send('state', { playing, time, summary: description?.summary || '',
      detail: description?.detail || '', selection });
  }

  function fail(error) {
    failed = true;
    setPlaying(false);
    send('error', { message: error instanceof Error ? error.message : '演示暂不可用，请重新选择或重播。' });
    state();
  }

  function viewOptions(input, previous = selection) {
    return {
      direction: input.direction === Math.PI ? Math.PI : input.direction === 0 ? 0 : previous?.direction ?? 0,
      skin: ['pixel', 'draft'].includes(input.skin) ? input.skin : previous?.skin || 'pixel',
      zoom: [.75, 1, 1.5].includes(input.zoom) ? input.zoom : previous?.zoom || 1
    };
  }

  function normalize(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('请选择一个有效的演示对象。');
    const category = api.catalog.find(entry => entry.id === input.category);
    const item = category?.items.find(entry => entry.id === input.id);
    if (!item) throw new Error('当前目录中没有这个演示对象。');
    const variant = item.variants?.find(entry => entry.id === input.variant) || item.variants?.[0];
    const level = Number.isInteger(input.level) ? input.level : 1;
    const stacks = Number.isInteger(input.stacks) ? input.stacks : 1;
    return Object.freeze({ category: category.id, id: item.id, variant: variant?.id || '', duration: item.duration || 8,
      level: item.levels === 3 ? Math.max(1, Math.min(3, level)) : 1,
      stacks: item.stacks ? Math.max(1, Math.min(99, stacks)) : 1,
      ...viewOptions(input), playing });
  }

  function reset() {
    time = 0;
    elapsedSinceState = 0;
    failed = false;
    api.reset(selection);
    state();
  }

  function advance(dt) {
    time += dt;
    api.trigger(selection, time, dt);
    api.tick(dt);
    if (time >= selection.duration && ['heroes', 'equipment', 'buffs'].includes(selection.category)) reset();
  }

  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== parent || parent === window) return;
    const data = event.data;
    if (!data || typeof data !== 'object' || Array.isArray(data) || data.source !== 'dotarogue-studio') return;
    try {
      if (data.type === 'init') {
        if (!initialized) {
          initialized = true;
          send('catalog', { categories: api.catalog });
        } else state();
        return;
      }
      if (!initialized) return;
      if (data.type === 'select') {
        if (!selection) setPlaying(typeof data.selection?.playing === 'boolean'
          ? data.selection.playing && !reducedMotion.matches : playing);
        selection = normalize(data.selection);
        reset();
        return;
      }
      if (!selection) return;
      switch (data.type) {
        case 'play':
          if (typeof data.playing !== 'boolean') return;
          setPlaying(data.playing && !failed);
          state();
          break;
        case 'replay':
          reset();
          break;
        case 'step':
          setPlaying(false);
          if (!failed) advance(1 / 30);
          state();
          break;
        case 'view':
          selection = Object.freeze({ ...selection, ...viewOptions(data) });
          api.view(selection);
          state();
          break;
      }
    } catch (error) { fail(error); }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      setPlaying(false);
      try { state(); } catch (error) { fail(error); }
    }
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      setPlaying(false);
      try { state(); } catch (error) { fail(error); }
    }
  });

  return {
    update(dt) {
      if (!selection || failed || !Number.isFinite(dt) || dt <= 0) return;
      try {
        if (playing) advance(dt);
        elapsedSinceState += dt;
        if (elapsedSinceState >= .2) state();
      } catch (error) { fail(error); }
    },
    draw(ctx, width, height) {
      if (!selection || failed) return;
      try { api.drawEffect(ctx, width, height, selection, time); }
      catch (error) { fail(error); }
    },
    get playing() { return playing; },
    get zoom() { return selection?.zoom || 1; },
    get isMap() { return selection?.category === 'maps'; },
    get selection() { return selection; }
  };
}
