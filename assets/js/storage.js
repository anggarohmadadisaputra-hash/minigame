/* EduGameZone - storage.js
 * Seluruh progres disimpan di LocalStorage (tanpa database).
 * Menyediakan: state, XP/level, badge, riwayat, export/import JSON, tema, suara, toast.
 */
(function (w) {
  'use strict';

  var KEY = 'edugamezone_v1';
  var TITLES = ['Pemula', 'Penjelajah', 'Pelajar Cerdas', 'Petualang Ilmu', 'Ahli Muda', 'Master', 'Grandmaster', 'Legenda'];

  var GAMES = {
    quiz:  { id: 'quiz',  name: 'QuizMaster',    tag: 'Kuis Pengetahuan',     icon: 'fa-brain',        page: 'games/quizmaster.php' },
    word:  { id: 'word',  name: 'WordQuest',     tag: 'Tebak Kata',           icon: 'fa-spell-check',  page: 'games/wordquest.php' },
    match: { id: 'match', name: 'MatchIt',       tag: 'Mencocokkan Pasangan', icon: 'fa-puzzle-piece', page: 'games/matchit.php' },
    code:  { id: 'code',  name: 'CodeAdventure', tag: 'Belajar Pemrograman',  icon: 'fa-code',         page: 'games/codeadventure.php' },
    money: { id: 'money', name: 'SmartMoney',    tag: 'Simulasi Keuangan',    icon: 'fa-wallet',       page: 'games/smartmoney.php' },
    eco:   { id: 'eco',   name: 'EcoHero',       tag: 'Edukasi Lingkungan',   icon: 'fa-leaf',         page: 'games/ecohero.php' }
  };

  var BADGES = [
    { id: 'first_play',    name: 'First Play',     icon: 'fa-flag-checkered', desc: 'Menyelesaikan permainan pertama',
      test: function (s) { return s.history.length >= 1; } },
    { id: 'smart_player',  name: 'Smart Player',   icon: 'fa-lightbulb',      desc: 'Mengumpulkan 200 XP',
      test: function (s) { return s.xp >= 200; } },
    { id: 'master_quiz',   name: 'Master Quiz',    icon: 'fa-crown',          desc: 'Menang 3x di QuizMaster',
      test: function (s) { return s.games.quiz.wins >= 3; } },
    { id: 'code_beginner', name: 'Code Beginner',  icon: 'fa-laptop-code',    desc: 'Menang di CodeAdventure',
      test: function (s) { return s.games.code.wins >= 1; } },
    { id: 'word_expert',   name: 'Word Expert',    icon: 'fa-book-open',      desc: 'Menang 3x di WordQuest',
      test: function (s) { return s.games.word.wins >= 3; } },
    { id: 'eco_warrior',   name: 'Eco Warrior',    icon: 'fa-seedling',       desc: 'Menang 3x di EcoHero',
      test: function (s) { return s.games.eco.wins >= 3; } },
    { id: 'match_star',    name: 'Match Star',     icon: 'fa-star',           desc: 'Raih 3 bintang di MatchIt',
      test: function (s) { return s.games.match.bestStars >= 3; } },
    { id: 'money_wise',    name: 'Money Wise',     icon: 'fa-piggy-bank',     desc: 'Menang di SmartMoney',
      test: function (s) { return s.games.money.wins >= 1; } },
    { id: 'all_rounder',   name: 'All Rounder',    icon: 'fa-medal',          desc: 'Memainkan keenam game',
      test: function (s) { return Object.keys(GAMES).every(function (k) { return s.games[k].plays >= 1; }); } },
    { id: 'rising_star',   name: 'Rising Star',    icon: 'fa-rocket',         desc: 'Mencapai Level 5',
      test: function (s) { return levelInfo(s.xp).level >= 5; } }
  ];

  /* ---------- penyimpanan (fallback ke memori jika LocalStorage diblokir) ---------- */
  var mem = {};
  var store = {
    get: function (k) { try { return w.localStorage.getItem(k); } catch (e) { return mem[k] || null; } },
    set: function (k, v) { try { w.localStorage.setItem(k, v); } catch (e) { mem[k] = v; } },
    del: function (k) { try { w.localStorage.removeItem(k); } catch (e) { delete mem[k]; } }
  };

  function defaults() {
    var g = {};
    Object.keys(GAMES).forEach(function (k) {
      g[k] = { plays: 0, wins: 0, best: 0, bestStars: 0, progress: 0, lastPlayed: null };
    });
    return {
      v: 1, name: 'Pemain', nameSet: false, created: Date.now(), xp: 0,
      games: g, history: [], badges: {}, runs: [],
      settings: { sound: true, theme: 'light' }
    };
  }

  function merge(raw) {
    var base = defaults();
    if (!raw || typeof raw !== 'object') return base;
    if (typeof raw.name === 'string' && raw.name.trim()) base.name = raw.name.trim().slice(0, 24);
    base.nameSet = !!raw.nameSet;
    base.created = Number(raw.created) || base.created;
    base.xp = Math.max(0, Number(raw.xp) || 0);
    if (raw.games && typeof raw.games === 'object') {
      Object.keys(base.games).forEach(function (k) {
        var r = raw.games[k] || {};
        Object.keys(base.games[k]).forEach(function (f) {
          if (r[f] !== undefined && r[f] !== null) base.games[k][f] = r[f];
        });
      });
    }
    if (Array.isArray(raw.history)) base.history = raw.history.slice(0, 100);
    if (raw.badges && typeof raw.badges === 'object') base.badges = raw.badges;
    if (Array.isArray(raw.runs)) base.runs = raw.runs.slice(-200);
    if (raw.settings && typeof raw.settings === 'object') {
      base.settings.sound = raw.settings.sound !== false;
      base.settings.theme = raw.settings.theme === 'dark' ? 'dark' : 'light';
    }
    return base;
  }

  function state() {
    try {
      var raw = store.get(KEY);
      return merge(raw ? JSON.parse(raw) : null);
    } catch (e) { return defaults(); }
  }
  function save(s) { store.set(KEY, JSON.stringify(s)); return s; }
  function update(fn) { var s = state(); fn(s); save(s); return s; }

  /* ---------- level & XP ---------- */
  function levelInfo(xp) {
    var lv = Math.floor(Math.sqrt(xp / 50)) + 1;
    var cur = 50 * Math.pow(lv - 1, 2), next = 50 * Math.pow(lv, 2);
    return {
      level: lv, cur: cur, next: next, into: xp - cur, need: next - cur,
      pct: Math.max(0, Math.min(100, Math.round((xp - cur) / (next - cur) * 100))),
      title: TITLES[Math.min(lv - 1, TITLES.length - 1)]
    };
  }

  function newRunId(game) { return game + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8); }

  /* Dipanggil SEKALI saat game selesai. runId mencegah XP ganda (refresh / klik ganda). */
  function finishGame(r) {
    var s = state();
    if (!s.games[r.game]) return { ok: false, duplicate: false, xpGained: 0, win: false, pct: 0, newBadges: [] };
    var pct = r.max > 0 ? Math.max(0, Math.min(100, Math.round(r.score / r.max * 100))) : 0;
    var win = pct >= 60;
    if (r.runId && s.runs.indexOf(r.runId) !== -1) {
      return { ok: true, duplicate: true, xpGained: 0, win: win, pct: pct, newBadges: [], leveledUp: false, level: levelInfo(s.xp).level };
    }
    var before = levelInfo(s.xp).level;
    var xp = Math.max(0, Math.round(r.xp || 0));
    var g = s.games[r.game];
    g.plays += 1;
    if (win) g.wins += 1;
    g.best = Math.max(g.best, r.score);
    g.bestStars = Math.max(g.bestStars, r.stars || 0);
    g.progress = Math.max(g.progress, pct);
    g.lastPlayed = Date.now();
    s.xp += xp;
    s.history.unshift({
      id: r.runId || newRunId(r.game), game: r.game, label: r.label || '',
      score: r.score, max: r.max, pct: pct, stars: r.stars || 0, xp: xp, win: win, date: Date.now()
    });
    s.history = s.history.slice(0, 100);
    if (r.runId) { s.runs.push(r.runId); s.runs = s.runs.slice(-200); }

    var gained = [];
    BADGES.forEach(function (b) {
      if (!s.badges[b.id] && b.test(s)) { s.badges[b.id] = Date.now(); gained.push(b); }
    });
    save(s);
    var after = levelInfo(s.xp).level;
    return { ok: true, duplicate: false, xpGained: xp, win: win, pct: pct, newBadges: gained, leveledUp: after > before, level: after };
  }

  /* ---------- export / import / reset ---------- */
  function exportJSON() {
    return JSON.stringify({ app: 'EduGameZone', version: 1, exportedAt: new Date().toISOString(), data: state() }, null, 2);
  }
  function importJSON(text) {
    try {
      var p = JSON.parse(text);
      if (!p || p.app !== 'EduGameZone' || !p.data || typeof p.data !== 'object') {
        return { ok: false, msg: 'File bukan cadangan EduGameZone yang valid.' };
      }
      var s = merge(p.data);
      s.nameSet = true;
      save(s);
      return { ok: true, msg: 'Progres berhasil dipulihkan (' + s.xp + ' XP).' };
    } catch (e) { return { ok: false, msg: 'File JSON tidak dapat dibaca.' }; }
  }
  function reset() { store.del(KEY); try { w.sessionStorage.clear(); } catch (e) {} }

  /* ---------- tema ---------- */
  function applyTheme(t) {
    var theme = t || state().settings.theme;
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
  }
  function setTheme(t) { update(function (s) { s.settings.theme = t === 'dark' ? 'dark' : 'light'; }); applyTheme(t); }

  /* ---------- suara (WebAudio, tanpa file) ---------- */
  var ac = null;
  function sound(type) {
    if (!state().settings.sound) return;
    try {
      ac = ac || new (w.AudioContext || w.webkitAudioContext)();
      var seqs = {
        ok: [[660, 0.08], [880, 0.12]], bad: [[220, 0.18]], click: [[520, 0.04]],
        win: [[523, 0.1], [659, 0.1], [784, 0.1], [1047, 0.24]], lose: [[330, 0.16], [262, 0.28]],
        coin: [[988, 0.06], [1319, 0.12]]
      };
      var seq = seqs[type] || [], t = ac.currentTime;
      seq.forEach(function (n) {
        var o = ac.createOscillator(), g = ac.createGain();
        o.type = 'sine'; o.frequency.value = n[0];
        g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.001, t + n[1]);
        o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + n[1]); t += n[1];
      });
    } catch (e) { /* abaikan */ }
  }

  /* ---------- util UI ---------- */
  function esc(v) {
    return String(v === undefined || v === null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fmtDate(ts) {
    try { return new Date(ts).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }); }
    catch (e) { return ''; }
  }
  function toast(msg, icon, kind) {
    var box = document.getElementById('egzToasts');
    if (!box) { box = document.createElement('div'); box.id = 'egzToasts'; box.className = 'egz-toasts'; document.body.appendChild(box); }
    var t = document.createElement('div');
    t.className = 'egz-toast ' + (kind || '');
    t.innerHTML = '<i class="fa-solid ' + (icon || 'fa-circle-info') + '"></i><span>' + esc(msg) + '</span>';
    box.appendChild(t);
    setTimeout(function () { t.classList.add('out'); setTimeout(function () { t.remove(); }, 400); }, 3200);
  }

  w.EGZ = {
    KEY: KEY, GAMES: GAMES, BADGES: BADGES, TITLES: TITLES, base: w.EGZ_BASE || '',
    state: state, save: save, update: update, levelInfo: levelInfo, newRunId: newRunId,
    finishGame: finishGame, exportJSON: exportJSON, importJSON: importJSON, reset: reset,
    applyTheme: applyTheme, setTheme: setTheme, sound: sound, esc: esc, fmtDate: fmtDate, toast: toast
  };
})(window);
