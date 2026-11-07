const abortReason = signal => signal.reason || new DOMException('Cancelled', 'AbortError');

export function createImageLoader({ onChange = () => {} } = {}) {
  const entries = new Map();

  function create(path, priority) {
    const image = new Image();
    image.decoding = 'async';
    image.fetchPriority = priority;
    const entry = { image, status: 'pending', promise: null, cancel: null };
    entry.promise = new Promise((resolve, reject) => {
      const finish = (status, error) => {
        if (entry.status !== 'pending') return;
        entry.status = status;
        image.removeEventListener('load', loaded);
        image.removeEventListener('error', unavailable);
        if (status === 'ready') resolve(image); else reject(error);
        onChange();
      };
      const loaded = () => Promise.resolve().then(() => {
        if (entry.status === 'pending') return image.decode();
      }).then(() => finish('ready'), error => finish('failed', error));
      const unavailable = () => {
        if (entry.status !== 'pending') return;
        if (/\.webp(?:\?|$)/.test(image.src)) {
          image.src = path.replace(/\.webp(?:\?.*)?$/, '.png?v=20261030-model-static1');
        } else finish('failed', new Error('Image unavailable'));
      };
      entry.cancel = reason => {
        if (entry.status !== 'pending') return;
        if (entries.get(path) === entry) entries.delete(path);
        finish('aborted', reason);
        image.removeAttribute('src');
      };
      image.addEventListener('load', loaded);
      image.addEventListener('error', unavailable);
    });
    entry.promise.catch(() => {});
    entries.set(path, entry);
    image.src = path;
    return entry;
  }

  function entryFor(path, priority, retry = false) {
    let entry = entries.get(path);
    if (!entry || (retry && entry.status === 'failed')) entry = create(path, priority);
    if (priority === 'high') entry.image.fetchPriority = priority;
    return entry;
  }

  function get(path, priority = 'low') {
    return path ? entryFor(path, priority).image : null;
  }

  function load(path, { signal, priority = 'high' } = {}) {
    if (signal?.aborted) return Promise.reject(abortReason(signal));
    if (!path) return Promise.reject(new Error('Image path is required'));
    const entry = entryFor(path, priority, true);
    if (!signal || entry.status === 'ready') return entry.promise;
    const cancel = () => entry.cancel(abortReason(signal));
    signal.addEventListener('abort', cancel, { once: true });
    return entry.promise.finally(() => signal.removeEventListener('abort', cancel));
  }

  return { get, load, isReady: path => entries.get(path)?.status === 'ready' };
}

export function createResourcePack(tasks) {
  const pending = new Map(tasks.map((task, index) => [index, task]));
  let inFlight = null;

  function prepare({ signal, onComplete = () => {} } = {}) {
    if (signal?.aborted) return Promise.reject(abortReason(signal));
    if (!pending.size) return Promise.resolve();
    if (inFlight) return inFlight;
    const controller = new AbortController();
    const stop = reason => {
      if (!controller.signal.aborted) controller.abort(reason);
    };
    const aborted = () => stop(abortReason(signal));
    const check = () => {
      if (controller.signal.aborted) throw abortReason(controller.signal);
    };
    const jobs = [...pending];
    let next = 0;
    let interrupt;
    const interrupted = new Promise((_, reject) => {
      interrupt = () => reject(abortReason(controller.signal));
      controller.signal.addEventListener('abort', interrupt, { once: true });
    });
    signal?.addEventListener('abort', aborted, { once: true });
    const worker = async () => {
      try {
        while (next < jobs.length) {
          check();
          const [index, task] = jobs[next++];
          await task(controller.signal);
          check();
          pending.delete(index);
          onComplete();
        }
      } catch (error) {
        stop(error);
        throw error;
      }
    };
    const promise = Promise.race([
      Promise.all(Array.from({ length: Math.min(4, jobs.length) }, worker)), interrupted
    ]).finally(() => {
      signal?.removeEventListener('abort', aborted);
      controller.signal.removeEventListener('abort', interrupt);
      if (inFlight === promise) inFlight = null;
    });
    inFlight = promise;
    return promise;
  }

  return { get ready() { return pending.size === 0; }, get remaining() { return pending.size; }, prepare };
}
