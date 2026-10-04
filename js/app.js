(function () {
  'use strict';

  const { LESSONS, SIGHT_SETS } = window.DATA;
  const Letters = window.Letters;
  const NS = 'http://www.w3.org/2000/svg';
  const $ = (s, r) => (r || document).querySelector(s);
  const app = $('#app');

  const PALETTE = ['#ff8a3d', '#17b3a3', '#ff6b9a', '#4d8dff', '#9b6bff', '#e6a700', '#2fbf71', '#ff6b6b', '#00a6d6', '#c06c84', '#6c8e23', '#e8590c'];

  /* ---------- preferences ---------- */
  function readPrefs() {
    try { return JSON.parse(localStorage.getItem('writealong') || '{}'); } catch (e) { return {}; }
  }
  const prefs = Object.assign({ auto: true, nums: true, slow: false }, readPrefs());
  function savePrefs() {
    try { localStorage.setItem('writealong', JSON.stringify(prefs)); } catch (e) { /* ignore */ }
  }

  /* ---------- speech ---------- */
  const Speech = {
    voice: null,
    ok: 'speechSynthesis' in window,
    init() {
      if (!this.ok) return;
      const pick = () => {
        const vs = speechSynthesis.getVoices().filter((v) => /^en[-_](US|GB|AU|CA)/i.test(v.lang));
        const prefer = [/Google US English/i, /Samantha/i, /Aria|Jenny|Ava|Allison/i, /Microsoft.*(Zira|David)/i];
        for (const re of prefer) {
          const hit = vs.find((v) => re.test(v.name));
          if (hit) { this.voice = hit; return; }
        }
        this.voice = vs.find((v) => /en[-_]US/i.test(v.lang)) || vs[0] || null;
      };
      pick();
      speechSynthesis.onvoiceschanged = pick;
    },
    make(text, rate) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = rate;
      u.pitch = 1.05;
      if (this.voice) u.voice = this.voice;
      return u;
    },
    say(text, rate) {
      if (!this.ok) return;
      speechSynthesis.cancel();
      speechSynthesis.speak(this.make(text, rate || 0.85));
    },
    spell(text) {
      if (!this.ok) return;
      speechSynthesis.cancel();
      const letters = text.replace(/[^a-zA-Z]/g, '').toUpperCase().split('');
      letters.forEach((ch) => speechSynthesis.speak(this.make(ch, 0.7)));
      speechSynthesis.speak(this.make(text, 0.8));
    },
    stop() { if (this.ok) speechSynthesis.cancel(); },
  };
  Speech.init();

  /* ---------- pages ---------- */
  let current = { items: [], color: PALETTE[0] };

  // Real picture first; falls back to emoji/artwork if the file is missing.
  function imgHTML(it, cls) {
    return '<img class="' + cls + '" src="' + it.img + '" alt="" loading="lazy" draggable="false">';
  }

  function picHTML(it) {
    if (it.img) return '<span class="pic photo">' + imgHTML(it, 'cardimg') + '</span>';
    if (it.swatch) return '<span class="swatch" style="background:' + it.swatch + '"></span>';
    if (it.emoji.indexOf('<svg') === 0) return '<span class="pic art">' + it.emoji + '</span>';
    if (/^\d+$/.test(it.emoji)) return '<span class="pic digit">' + it.emoji + '</span>';
    return '<span class="pic">' + (it.emoji || '') + '</span>';
  }

  function cardHTML(it, i, color) {
    return (
      '<div class="word-card" style="--c:' + color + '">' +
      '<button class="open" data-open="' + i + '">' + picHTML(it) +
      '<span class="w">' + it.text + '</span><span class="zh">' + it.zh + '</span></button>' +
      '<button class="spk" data-say="' + i + '" aria-label="Listen to ' + it.text + '">🔊</button>' +
      '</div>'
    );
  }

  function renderHome() {
    const lessons = LESSONS.map((l, i) => {
      const color = PALETTE[i % PALETTE.length];
      const n = l.words.length + (l.plurals ? l.plurals.length : 0);
      return (
        '<a class="lesson-card" href="#/lesson/' + l.id + '" style="--c:' + color + '">' +
        '<span class="num">Lesson ' + l.id + '</span><span class="ico">' + l.icon + '</span>' +
        '<span class="ttl">' + l.title + '</span><span class="cnt">' + n + ' words</span></a>'
      );
    }).join('');
    const sights = SIGHT_SETS.map((s) =>
      '<a class="lesson-card" href="#/sight/' + s.id + '" style="--c:' + s.color + '">' +
      '<span class="num">Set ' + s.id + '</span><span class="ico">👀</span>' +
      '<span class="ttl">Sight Words</span><span class="cnt">' + s.words.length + ' words</span></a>'
    ).join('');
    app.innerHTML =
      '<section class="hero"><h1>Let\'s write!</h1>' +
      '<p>Pick a lesson, watch the pencil, then trace it with your finger.</p></section>' +
      '<h2 class="section-title">Lessons</h2><div class="grid">' + lessons + '</div>' +
      '<h2 class="section-title">Sight Words</h2><div class="grid">' + sights + '</div>';
  }

  function renderWordPage(title, subtitle, color, words, plurals) {
    const items = words.concat(plurals || []);
    current = { items, color };
    let html =
      '<a class="back" href="#/">◀ All lessons</a>' +
      '<h1 class="page-title" style="color:' + color + '">' + title + '</h1>' +
      '<p>' + subtitle + '</p><div class="grid">' +
      words.map((it, i) => cardHTML(it, i, color)).join('') + '</div>';
    if (plurals && plurals.length) {
      html += '<h2 class="section-title">Plurals</h2><div class="grid">' +
        plurals.map((it, i) => cardHTML(it, words.length + i, color)).join('') + '</div>';
    }
    app.innerHTML = html;
  }

  function route() {
    const parts = location.hash.replace(/^#\/?/, '').split('/');
    const n = parseInt(parts[1], 10);
    closeModal();
    window.scrollTo(0, 0);
    if (parts[0] === 'lesson' && LESSONS[n - 1]) {
      const l = LESSONS[n - 1];
      renderWordPage('Lesson ' + l.id + ': ' + l.title, 'Tap a card to watch and practice. Tap 🔊 to listen.', PALETTE[(n - 1) % PALETTE.length], l.words, l.plurals);
    } else if (parts[0] === 'sight' && SIGHT_SETS[n - 1]) {
      const s = SIGHT_SETS[n - 1];
      renderWordPage('Sight Words ' + s.id, 'These words show up everywhere. Learn to write them by heart!', s.color, s.words);
    } else {
      renderHome();
    }
  }

  /* ---------- writing board ---------- */
  const modal = $('#modal');
  const board = $('#board');
  const boardWrap = $('#boardWrap');
  const state = { idx: 0, tracing: false };

  function el(name, attrs, parent) {
    const e = document.createElementNS(NS, name);
    Object.keys(attrs || {}).forEach((k) => e.setAttribute(k, attrs[k]));
    if (parent) parent.appendChild(e);
    return e;
  }

  const Player = (function () {
    let strokes = [];
    let pen = null;
    let token = 0;
    let idx = 0;

    const sleep = (ms, tk) => new Promise((r) => setTimeout(() => r(tk === token), ms));

    function load(layout, layers) {
      token++;
      idx = 0;
      strokes = [];
      pen = layers.pen;
      layout.glyphs.forEach((g, gi) => {
        g.strokes.forEach((s, si) => {
          el('path', { d: s.d, class: 'ghost' }, layers.ghost);
          const path = el('path', { d: s.d, class: 'ink' }, layers.ink);
          const len = path.getTotalLength();
          const badge = el('g', { class: 'badge', transform: 'translate(' + (s.start[0] - 12) + ' ' + (s.start[1] - 12) + ')' }, layers.badges);
          el('circle', { r: 9 }, badge);
          const t = el('text', {}, badge);
          t.textContent = si + 1;
          strokes.push({ path, len, badge, g: gi });
        });
      });
      reset();
    }

    function reset() {
      token++;
      idx = 0;
      strokes.forEach((s) => {
        s.path.style.opacity = 0;
        s.path.style.strokeDasharray = s.len + ' ' + (s.len + 4);
        s.path.style.strokeDashoffset = s.len;
        s.badge.style.opacity = 0;
      });
      if (pen) pen.style.opacity = 0;
    }

    function draw(i, tk) {
      const s = strokes[i];
      const speed = prefs.slow ? 110 : 210;
      const dur = Math.max(380, (s.len / speed) * 1000);
      s.path.style.opacity = 1;
      s.path.style.strokeDashoffset = s.len;
      s.badge.style.opacity = 1;
      pen.style.opacity = 1;
      return new Promise((resolve) => {
        const t0 = performance.now();
        const tick = (now) => {
          if (tk !== token) return resolve(false);
          const t = Math.min(1, (now - t0) / dur);
          const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          s.path.style.strokeDashoffset = s.len * (1 - e);
          const p = s.path.getPointAtLength(s.len * e);
          pen.setAttribute('cx', p.x);
          pen.setAttribute('cy', p.y);
          if (t < 1) requestAnimationFrame(tick); else resolve(true);
        };
        requestAnimationFrame(tick);
      });
    }

    async function play() {
      reset();
      const tk = token;
      for (let i = 0; i < strokes.length; i++) {
        if (!(await draw(i, tk))) return;
        idx = i + 1;
        if (i < strokes.length - 1) {
          const newLetter = strokes[i + 1].g !== strokes[i].g;
          if (!(await sleep(newLetter ? 450 : 260, tk))) return;
        }
      }
      pen.style.opacity = 0;
    }

    async function step() {
      if (idx >= strokes.length) reset();
      const tk = ++token;
      const i = idx;
      if (await draw(i, tk)) {
        idx = i + 1;
        if (idx >= strokes.length) pen.style.opacity = 0;
      }
    }

    function stop() { token++; }

    return { load, reset, play, step, stop };
  })();

  let layers = null;

  function loadBoard(text) {
    const lay = Letters.layout(text);
    const W = Math.max(480, lay.width);
    const H = lay.height;
    const M = Letters.metrics;
    board.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    board.innerHTML = '';

    const guides = el('g', {}, board);
    for (let l = 0; l < lay.lineCount; l++) {
      const y0 = l * M.LINE_H;
      [[M.AT, '#8bbcff', ''], [M.XT, '#ffa0a8', '8 8'], [M.BL, '#8bbcff', ''], [M.DT, '#cfe0fb', '']].forEach((r) => {
        el('line', { x1: 0, x2: W, y1: y0 + r[0], y2: y0 + r[0], stroke: r[1], 'stroke-width': 2, 'stroke-dasharray': r[2] }, guides);
      });
    }
    layers = {
      ghost: el('g', {}, board),
      ink: el('g', {}, board),
      badges: el('g', {}, board),
      pen: el('circle', { r: 8, class: 'pen', cx: -20, cy: -20 }, board),
      mine: el('g', {}, board),
    };
    layers.pen.style.opacity = 0;
    const hit = el('rect', { x: 0, y: 0, width: W, height: H, fill: 'transparent' }, board);
    hit.style.pointerEvents = state.tracing ? 'all' : 'none';
    layers.hit = hit;
    attachDrawing(hit);
    Player.load(lay, layers);
    if (state.tracing) Player.reset();
  }

  /* finger / mouse tracing */
  function attachDrawing(hit) {
    let path = null;
    let d = '';
    const pt = board.createSVGPoint();
    const toSvg = (e) => {
      pt.x = e.clientX;
      pt.y = e.clientY;
      const p = pt.matrixTransform(board.getScreenCTM().inverse());
      return Math.round(p.x * 10) / 10 + ' ' + Math.round(p.y * 10) / 10;
    };
    hit.addEventListener('pointerdown', (e) => {
      if (!state.tracing) return;
      e.preventDefault();
      hit.setPointerCapture(e.pointerId);
      const p = toSvg(e);
      d = 'M' + p + ' L' + p;
      path = el('path', { d, class: 'mine' }, layers.mine);
    });
    hit.addEventListener('pointermove', (e) => {
      if (!path) return;
      d += ' L' + toSvg(e);
      path.setAttribute('d', d);
    });
    const end = () => { path = null; };
    hit.addEventListener('pointerup', end);
    hit.addEventListener('pointercancel', end);
  }

  function setTrace(on) {
    state.tracing = on;
    boardWrap.classList.toggle('tracing', on);
    $('#traceBtn').setAttribute('aria-pressed', on ? 'true' : 'false');
    if (layers) layers.hit.style.pointerEvents = on ? 'all' : 'none';
    if (on) Player.reset();
  }

  /* ---------- modal ---------- */
  function showWord(autoplay) {
    const it = current.items[state.idx];
    $('#mTitle').textContent = it.text;
    $('#mZh').textContent = it.zh;
    $('#mPic').innerHTML = it.img ? imgHTML(it, 'mimg') : it.swatch ? '<span class="swatch" style="background:' + it.swatch + '"></span>' : it.emoji;
    $('#mCount').textContent = state.idx + 1 + ' / ' + current.items.length;
    boardWrap.classList.toggle('hide-nums', !prefs.nums);
    loadBoard(it.text);
    if (autoplay && prefs.auto && !state.tracing) {
      Speech.say(it.text);
      setTimeout(() => Player.play(), 500);
    }
  }

  function openModal(i) {
    state.idx = i;
    modal.hidden = false;
    document.body.classList.add('lock');
    modal.querySelectorAll('[data-pref]').forEach((c) => { c.checked = !!prefs[c.dataset.pref]; });
    showWord(true);
    $('#mClose').focus();
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('lock');
    Player.stop();
    Speech.stop();
  }

  function move(delta) {
    const n = current.items.length;
    state.idx = (state.idx + delta + n) % n;
    Speech.stop();
    showWord(true);
  }

  const actions = {
    close: closeModal,
    listen: () => Speech.say(current.items[state.idx].text, 0.85),
    slow: () => Speech.say(current.items[state.idx].text, 0.45),
    spell: () => Speech.spell(current.items[state.idx].text),
    watch: () => { if (state.tracing) setTrace(false); Player.play(); },
    step: () => { if (state.tracing) setTrace(false); Player.step(); },
    reset: () => Player.reset(),
    trace: () => setTrace(!state.tracing),
    clear: () => { if (layers) layers.mine.innerHTML = ''; },
    prev: () => move(-1),
    next: () => move(1),
  };

  /* ---------- events ---------- */
  app.addEventListener('click', (e) => {
    const say = e.target.closest('[data-say]');
    if (say) { Speech.say(current.items[+say.dataset.say].text); return; }
    const open = e.target.closest('[data-open]');
    if (open) openModal(+open.dataset.open);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) { closeModal(); return; }
    const b = e.target.closest('[data-act]');
    if (b && actions[b.dataset.act]) actions[b.dataset.act]();
  });

  modal.addEventListener('change', (e) => {
    const k = e.target.dataset.pref;
    if (!k) return;
    prefs[k] = e.target.checked;
    savePrefs();
    if (k === 'nums') boardWrap.classList.toggle('hide-nums', !prefs.nums);
  });

  document.addEventListener('keydown', (e) => {
    if (modal.hidden) return;
    if (e.key === 'Escape') closeModal();
    else if (e.key === 'ArrowRight') move(1);
    else if (e.key === 'ArrowLeft') move(-1);
    else if (e.key === ' ' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
      e.preventDefault();
      actions.watch();
    }
  });

  window.addEventListener('hashchange', route);
  route();
})();
