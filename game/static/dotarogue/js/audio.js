import { HERO_VOICE_LINES as VOICE_LINES, HERO_VOICE_PROFILES as VOICE_PROFILE } from './heroes.js?v=20261027-unified1';

const VOICE_CLIPS = {
  "rover": {
    "select": "rifleman-aye.m4a",
    "active": "rifleman-fire.m4a"
  },
  "conductor": {
    "select": "mountain-king-aye.m4a",
    "active": "mountain-king-to-arms.m4a"
  },
  "scavenger": {
    "select": "alchemist-ready-to-brew.m4a",
    "active": "alchemist-you-got-it.m4a"
  },
  "jugg": {
    "select": "blademaster-yes-lord.m4a",
    "active": "blademaster-hwah.m4a"
  },
  "sf": {
    "select": "firelord-im-lit.m4a",
    "active": "firelord-consume.m4a"
  },
  "kael": {
    "select": "blood-mage-ish-shera-do.m4a",
    "active": "blood-mage-for-quelthalas.m4a"
  },
  "luna": {
    "select": "huntress-seek.m4a",
    "active": "huntress-catch.m4a"
  },
  "tb": {
    "select": "demon-hunter-quickly.m4a",
    "active": "demon-hunter-revenge.m4a"
  }
};
const SFX_CLIPS = {
  pulse: 'rifleman-shot.mp3',
  'skill-rover': 'rifleman-shot.mp3',
  'skill-bulwark': 'bristleback-impact.mp3',
  'passive-bulwark': 'bristleback-impact.mp3',
  'skill-conductor': 'avatar-cast.mp3',
  'skill-tb': 'druid-bear-morph.mp3',
  'orbit-burst': 'avatar-cast.mp3',
  'guard-shot': 'rifleman-shot.mp3',
  'elite-frost': 'avatar-cast.mp3',
  'elite-lightning': 'avatar-cast.mp3'
};

const VOICE_LANG = { 'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW', en: 'en-US' };

export function createAudioSystem({ enabled = () => true, locale = () => 'zh-CN', heroId = () => null } = {}) {
  let audio = null;
  let audioNoise = null;
  let lastCombatSound = -Infinity;
  let lastVoiceAt = -Infinity;
  let paused = false;
  let generation = 0;
  const sources = new Set();
  const buffers = new Map();
  let voiceSource = null;
  let voiceTicket = 0;
  const lastSfxAt = Object.create(null);
  const voiceAt = Object.create(null);

  function ensureAudio() {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return null;
    if (!audio || audio.state === 'closed') audio = new AudioCtor();
    if (audio.state === 'suspended') audio.resume().catch(() => {});
    return audio;
  }

  function loadClip(file, context) {
    if (!buffers.has(file)) {
      const url = new URL(`../assets/audio/dota1/${file}`, import.meta.url);
      const pending = fetch(url).then(response => {
        if (!response.ok) throw new Error('Audio resource unavailable');
        return response.arrayBuffer();
      }).then(bytes => context.decodeAudioData(bytes)).catch(() => {
        buffers.delete(file);
        return null;
      });
      buffers.set(file, pending);
    }
    return buffers.get(file);
  }

  function playClip(file, context, volume, voice, fallback) {
    const epoch = generation, ticket = voiceTicket, requestedAt = performance.now();
    const current = () => enabled() && !paused && epoch === generation
      && (!voice || ticket === voiceTicket)
      && performance.now() - requestedAt < (voice ? 1800 : 450);
    loadClip(file, context).then(buffer => {
      if (!current()) return;
      if (!buffer) { fallback(); return; }
      try {
        if (!voice && sources.size >= 24) return;
        const source = context.createBufferSource(), gain = context.createGain();
        source.buffer = buffer;
        gain.gain.value = volume;
        source.connect(gain); gain.connect(context.destination);
        sources.add(source);
        if (voice) voiceSource = source;
        source.onended = () => {
          sources.delete(source);
          if (voiceSource === source) voiceSource = null;
          source.disconnect(); gain.disconnect();
        };
        source.start();
      } catch (_) { if (current()) fallback(); }
    });
  }

  function playSfx(kind, fallback = false) {
    if (!enabled() || paused) return;
    const now = performance.now();
    const combat = ['pulse', 'scatter', 'blade', 'arc', 'equipment-crit', 'shooter-fire', 'boss-attack', 'hurt', 'passive-bulwark', 'passive-conductor', 'passive-jugg', 'passive-sf', 'guard-shot', 'elite-frost', 'elite-lightning'].includes(kind);
    if (!fallback && combat && now - lastCombatSound < 90) return;
    if (!fallback && now - (lastSfxAt[kind] ?? -Infinity) < 60) return;
    try {
      const context = ensureAudio();
      if (!context) return;
      lastSfxAt[kind] = now;
      if (combat) lastCombatSound = now;
      if (!fallback && SFX_CLIPS[kind]) {
        playClip(SFX_CLIPS[kind], context, .35, false, () => playSfx(kind, true));
        return;
      }
      const wave = (type, from, to, duration, volume, delay = 0) => {
        const start = context.currentTime + delay;
        const osc = context.createOscillator(), gain = context.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(from, start);
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), start + duration);
        gain.gain.setValueAtTime(.0001, start);
        gain.gain.linearRampToValueAtTime(volume, start + .004);
        gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
        osc.connect(gain); gain.connect(context.destination);
        sources.add(osc);
        osc.onended = () => { sources.delete(osc); osc.disconnect(); gain.disconnect(); };
        osc.start(start); osc.stop(start + duration);
      };
      const noise = (duration, volume, frequency, filterType = 'bandpass', delay = 0) => {
        if (!audioNoise) {
          audioNoise = context.createBuffer(1, Math.ceil(context.sampleRate * .35), context.sampleRate);
          const samples = audioNoise.getChannelData(0);
          for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
        }
        const start = context.currentTime + delay;
        const source = context.createBufferSource(), filter = context.createBiquadFilter(), gain = context.createGain();
        source.buffer = audioNoise;
        filter.type = filterType; filter.frequency.value = frequency;
        gain.gain.setValueAtTime(volume, start);
        gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
        source.connect(filter); filter.connect(gain); gain.connect(context.destination);
        sources.add(source);
        source.onended = () => { sources.delete(source); source.disconnect(); filter.disconnect(); gain.disconnect(); };
        source.start(start); source.stop(start + duration);
      };
      switch (kind) {
        case 'pulse': wave('triangle', 780, 340, .08, .027); noise(.035, .009, 2600, 'highpass'); break;
        case 'scatter': wave('sawtooth', 190, 75, .13, .029); noise(.1, .026, 950, 'lowpass'); break;
        case 'blade': wave('sine', 1000, 230, .13, .018); noise(.12, .016, 1350); break;
        case 'arc': wave('square', 1050, 270, .08, .014); noise(.075, .022, 2200, 'highpass'); break;
        case 'equipment-crit': wave('triangle', 1120, 570, .09, .014); break;
        case 'shooter-fire': wave('triangle', 460, 190, .09, .012); break;
        case 'boss-attack': wave('sawtooth', 180, 55, .25, .032); noise(.16, .018, 680, 'lowpass'); break;
        case 'skill-rover': wave('square', 180, 90, .1, .018); noise(.07, .018, 2800, 'highpass'); wave('triangle', 560, 290, .12, .02, .07); break;
        case 'skill-bulwark': wave('sawtooth', 210, 90, .2, .028); noise(.16, .02, 1100); wave('triangle', 460, 170, .12, .012, .05); break;
        case 'skill-conductor': wave('square', 520, 135, .2, .02); noise(.13, .023, 2600, 'highpass'); wave('sine', 1400, 220, .16, .02, .11); break;
        case 'skill-scavenger': wave('sine', 310, 940, .2, .027); wave('triangle', 620, 1240, .15, .013, .06); noise(.08, .012, 1800, 'bandpass', .12); break;
        case 'skill-jugg': wave('sawtooth', 380, 110, .3, .022); noise(.25, .018, 1200); wave('triangle', 710, 160, .16, .016, .18); break;
        case 'soul': wave('sine', 280, 140, .12, .018); break;
        case 'skill-sf': wave('sawtooth', 190, 70, .5, .024); wave('sine', 440, 100, .4, .02, .1); noise(.2, .014, 540, 'lowpass', .16); break;
        case 'skill-luna': wave('sine', 780, 165, .34, .03); wave('triangle', 1180, 420, .28, .018, .08); break;
        case 'luna-bounce': wave('triangle', 960, 360, .11, .014); break;
        case 'skill-tb': wave('sawtooth', 85, 210, .36, .026); wave('triangle', 420, 95, .42, .02); noise(.14, .012, 720, 'lowpass', .08); break;
        case 'tb-image': wave('sine', 380, 710, .16, .014); break;
        case 'kael-spell': wave('sine', 620, 1240, .24, .024); wave('triangle', 1040, 420, .18, .018, .08); break;
        case 'dash': wave('triangle', 410, 140, .11, .024); noise(.08, .012, 1300); break;
        case 'hurt': wave('sawtooth', 165, 70, .15, .038); break;
        case 'shield': wave('sine', 340, 880, .2, .028); wave('triangle', 760, 1180, .16, .017, .08); break;
        case 'passive-rover': wave('triangle', 680, 1040, .08, .012); break;
        case 'passive-bulwark': wave('triangle', 230, 110, .16, .018); noise(.08, .013, 1500); break;
        case 'passive-conductor': wave('square', 1450, 580, .08, .012); noise(.05, .012, 3200, 'highpass'); break;
        case 'passive-scavenger': wave('sine', 780, 1200, .1, .014); wave('triangle', 1100, 1500, .11, .01, .08); break;
        case 'passive-jugg': wave('sine', 620, 980, .12, .018); noise(.06, .01, 1800, 'highpass'); break;
        case 'passive-sf': wave('sine', 220, 80, .2, .017); noise(.14, .012, 480, 'lowpass'); break;
        case 'passive-kael': wave('triangle', 440, 760, .12, .014); break;
        case 'passive-luna': wave('sine', 1040, 620, .12, .013); break;
        case 'passive-tb': wave('sawtooth', 120, 260, .16, .014); break;
        case 'orbit-burst': wave('triangle', 280, 920, .16, .018); wave('sine', 1180, 520, .2, .012, .04); noise(.08, .008, 2100, 'highpass'); break;
        case 'guard-shot': wave('triangle', 520, 180, .08, .014); noise(.04, .008, 1900, 'highpass'); break;
        case 'elite-frost': wave('sine', 920, 240, .28, .024); wave('triangle', 1280, 520, .2, .012, .08); noise(.1, .008, 2500, 'highpass'); break;
        case 'elite-lightning': wave('square', 1480, 260, .18, .018); noise(.1, .015, 3000, 'highpass'); break;
        case 'chest-pickup': wave('sine', 580, 860, .11, .034); wave('sine', 800, 1100, .12, .017, .07); break;
        case 'chest-open': wave('triangle', 510, 830, .2, .025); wave('sine', 930, 1370, .25, .021, .1); break;
        case 'chest-take': wave('sine', 760, 1060, .16, .033); break;
        case 'chest-scrap': wave('triangle', 550, 250, .14, .025); noise(.075, .01, 1200); break;
        case 'warning-boss': wave('sawtooth', 170, 125, .31, .045); wave('sawtooth', 160, 95, .32, .036, .18); break;
        case 'warning-elite': wave('sawtooth', 260, 145, .25, .037); break;
        case 'victory': wave('triangle', 500, 670, .28, .035); wave('triangle', 750, 1030, .32, .034, .18); break;
        case 'defeat': wave('triangle', 310, 115, .4, .042); break;
        case 'merge': wave('triangle', 590, 980, .18, .033); wave('sine', 900, 1260, .2, .022, .09); break;
        case 'merge-max': wave('triangle', 590, 980, .18, .033); wave('sine', 900, 1260, .2, .022, .09); wave('sine', 180, 90, .17, .024, .22); break;
        case 'level': wave('sine', 690, 980, .13, .026); break;
        case 'wave-end': wave('triangle', 610, 820, .2, .029); break;
        case 'wave-start': wave('triangle', 480, 720, .16, .028); break;
        case 'buy': wave('triangle', 640, 860, .1, .028); break;
        case 'reroll': wave('square', 450, 310, .09, .016); break;
        case 'select': wave('sine', 610, 790, .12, .023); break;
        default: return;
      }
    } catch (_) { /* Sound is optional. */ }
  }

  function playVoice(event, id = heroId(), fallback = false) {
    if (!enabled() || paused) return false;
    const hero = VOICE_LINES[id];
    const voiceEvent = event === 'low' ? 'lowhp' : event;
    const line = hero?.[locale()]?.[voiceEvent] || hero?.['zh-CN']?.[voiceEvent];
    if (!line) return false;
    const now = performance.now();
    if (!fallback && !['select', 'start', 'low', 'win', 'defeat'].includes(event) && now - lastVoiceAt < (event === 'active' ? 1500 : 2200)) return false;
    if (!fallback && now - (voiceAt[`${id}:${event}`] ?? -Infinity) < 2500) return false;
    try {
      if (!fallback && VOICE_CLIPS[id]) {
        const clips = VOICE_CLIPS[id];
        const file = event === 'select' ? clips.select : ['start', 'active', 'elite', 'win'].includes(event) ? clips.active : null;
        if (file) {
          const context = ensureAudio();
          if (context) {
            stopVoice();
            lastVoiceAt = now; voiceAt[`${id}:${event}`] = now;
            for (const clip of Object.values(clips)) loadClip(clip, context);
            playClip(file, context, .72, true, () => playVoice(event, id, true));
            return true;
          }
        }
      }
      if (typeof window.speechSynthesis === 'undefined' || typeof window.SpeechSynthesisUtterance === 'undefined') return false;
      const utterance = new SpeechSynthesisUtterance(line);
      const language = VOICE_LANG[locale()] || 'zh-CN';
      utterance.lang = language;
      utterance.volume = .56;
      utterance.rate = VOICE_PROFILE[id]?.rate || 1;
      utterance.pitch = VOICE_PROFILE[id]?.pitch || 1;
      const voices = window.speechSynthesis.getVoices?.() || [];
      const matching = voices.find(voice => voice.lang?.toLowerCase().startsWith(language.toLowerCase().slice(0, 2)));
      if (matching) utterance.voice = matching;
      stopVoice();
      window.speechSynthesis.speak(utterance);
      lastVoiceAt = now;
      voiceAt[`${id}:${event}`] = now;
      return true;
    } catch (_) { return false; }
  }

  function stopVoice() {
    voiceTicket++;
    if (voiceSource) {
      try { voiceSource.stop(); } catch (_) { /* Already ended. */ }
      voiceSource = null;
    }
    try { window.speechSynthesis?.cancel(); } catch (_) { /* Speech is optional. */ }
  }

  function stopAll() {
    generation++;
    for (const source of sources) {
      try { source.stop(); } catch (_) { /* A source may already have ended. */ }
    }
    sources.clear();
    stopVoice();
  }

  function setPaused(value) {
    paused = value;
    if (value) {
      stopAll();
      audio?.suspend().catch(() => {});
    } else if (enabled()) audio?.resume().catch(() => {});
  }

  function reset() {
    stopAll();
    paused = false;
    lastVoiceAt = -Infinity;
    for (const key of Object.keys(voiceAt)) delete voiceAt[key];
  }

  return { playSfx, playVoice, stopVoice, stopAll, setPaused, reset };
}
