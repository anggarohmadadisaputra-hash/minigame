/* EduGameZone - main.js : UI umum, helper game, dan modul tiap halaman */
(function (w, d) {
  'use strict';
  var E = w.EGZ, esc = E.esc;

  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }
  function stars(n, total) {
    total = total || 3; var h = '';
    for (var i = 1; i <= total; i++) h += '<i class="fa-' + (i <= n ? 'solid' : 'regular') + ' fa-star star' + (i <= n ? ' on' : '') + '"></i>';
    return h;
  }
  function sum(a, f) { return a.reduce(function (t, x) { return t + f(x); }, 0); }

  /* ---------- elemen yang selalu ada (navbar, sidebar) ---------- */
  function chrome() {
    var s = E.state(), li = E.levelInfo(s.xp);
    var map = { name: s.name, level: li.level, xp: s.xp, title: li.title, initial: (s.name || 'P').charAt(0).toUpperCase() };
    Object.keys(map).forEach(function (k) {
      $$('[data-bind="' + k + '"]').forEach(function (e) { e.textContent = map[k]; });
    });
    $$('[data-bind="levelbar"]').forEach(function (e) { e.style.width = li.pct + '%'; });
    var chip = $('#navChip'); if (chip) chip.textContent = 'Lv ' + li.level + ' · ' + s.xp + ' XP';
    var tt = $('#themeToggle');
    if (tt) tt.innerHTML = s.settings.theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  }

  /* ---------- helper umum untuk semua game ---------- */
  var Game = {
    shuffle: function (a) {
      var r = a.slice(), i, j, t;
      for (i = r.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = r[i]; r[i] = r[j]; r[j] = t; }
      return r;
    },
    fmt: function (sec) { sec = Math.max(0, Math.round(sec)); return ('0' + Math.floor(sec / 60)).slice(-2) + ':' + ('0' + (sec % 60)).slice(-2); },
    xp: function (pct, mult) { return 5 + Math.round(pct * 0.3 * (mult || 1)); },
    loadJSON: function (file) {
      return fetch(E.base + 'data/' + file).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      }).catch(function (err) {
        var intro = $('#intro');
        if (intro) intro.innerHTML = '<div class="alert alert-danger m-0"><b>Data game tidak dapat dimuat.</b><br>Pastikan aplikasi dibuka lewat <code>http://localhost/edugamezone</code> (Apache XAMPP aktif), bukan membuka file langsung.<br><small>' + esc(err.message) + '</small></div>';
        throw err;
      });
    },
    show: function (id) {
      ['intro', 'stage', 'result'].forEach(function (x) { var e = $('#' + x); if (e) e.classList.toggle('d-none', x !== id); });
      w.scrollTo({ top: 0, behavior: 'smooth' });
    },
    setProgress: function (p) { var b = $('#progressBar'); if (b) b.style.width = Math.max(0, Math.min(100, p)) + '%'; },
    countdown: function (sec, onTick, onEnd) {
      var left = sec, done = false;
      var id = setInterval(function () {
        left--; onTick(left);
        if (left <= 0) { clearInterval(id); if (!done) { done = true; onEnd(); } }
      }, 1000);
      onTick(left);
      return { stop: function () { done = true; clearInterval(id); }, left: function () { return left; } };
    },
    confetti: function () {
      var colors = ['#4f46e5', '#a855f7', '#06b6d4', '#f59e0b', '#22c55e', '#ec4899'];
      for (var i = 0; i < 46; i++) {
        var p = d.createElement('i');
        p.className = 'confetti';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.background = colors[i % colors.length];
        p.style.animationDelay = (Math.random() * 0.8) + 's';
        p.style.animationDuration = (2 + Math.random() * 1.6) + 's';
        d.body.appendChild(p);
        (function (el) { setTimeout(function () { el.remove(); }, 4200); })(p);
      }
    },
    /* Menyimpan hasil (sekali) & menampilkan layar hasil */
    finish: function (o) {
      var pct = o.max > 0 ? Math.max(0, Math.min(100, Math.round(o.score / o.max * 100))) : 0;
      var res = E.finishGame({ game: o.game, runId: o.runId, score: o.score, max: o.max, xp: Game.xp(pct, o.mult), stars: o.stars || 0, label: o.label || '' });
      var win = res.win, h = '';
      h += '<div class="result-card panel text-center">';
      h += '<div class="result-ico ' + (win ? 'win' : 'lose') + '"><i class="fa-solid ' + (win ? 'fa-trophy' : 'fa-face-smile-wink') + '"></i></div>';
      h += '<h2 class="mb-1">' + esc(o.title || (win ? 'Kerja Bagus!' : 'Ayo Coba Lagi!')) + '</h2>';
      h += '<p class="text-muted mb-3">' + esc(o.subtitle || '') + '</p>';
      h += '<div class="result-score"><span>' + o.score + '</span><small>/ ' + o.max + ' poin · ' + pct + '%</small></div>';
      if (o.stars !== undefined && o.stars !== null) h += '<div class="result-stars">' + stars(o.stars) + '</div>';
      if (o.details && o.details.length) {
        h += '<div class="result-grid">';
        o.details.forEach(function (x) { h += '<div><i class="fa-solid ' + x.icon + '"></i><b>' + esc(x.value) + '</b><small>' + esc(x.label) + '</small></div>'; });
        h += '</div>';
      }
      if (res.duplicate) h += '<div class="alert alert-info py-2">Hasil ini sudah tercatat sebelumnya, XP tidak ditambahkan lagi.</div>';
      else h += '<div class="xp-gain"><i class="fa-solid fa-bolt"></i> +' + res.xpGained + ' XP</div>';
      if (res.leveledUp) h += '<div class="levelup"><i class="fa-solid fa-arrow-up-right-dots"></i> Naik ke Level ' + res.level + '!</div>';
      if (res.newBadges && res.newBadges.length) {
        h += '<div class="new-badges">';
        res.newBadges.forEach(function (b) { h += '<div class="new-badge"><i class="fa-solid ' + b.icon + '"></i><div><b>Badge baru: ' + esc(b.name) + '</b><small>' + esc(b.desc) + '</small></div></div>'; });
        h += '</div>';
      }
      if (o.tips) h += '<div class="result-tip"><i class="fa-solid fa-circle-info me-1"></i>' + esc(o.tips) + '</div>';
      h += '<div class="d-flex flex-wrap gap-2 justify-content-center mt-3">';
      h += '<button class="btn btn-game" id="btnReplay"><i class="fa-solid fa-rotate-right me-1"></i>Main Lagi</button>';
      h += '<a class="btn btn-outline-secondary" href="' + E.base + 'dashboard.php"><i class="fa-solid fa-gauge-high me-1"></i>Dashboard</a>';
      h += '<a class="btn btn-outline-secondary" href="' + E.base + 'achievements.php"><i class="fa-solid fa-trophy me-1"></i>Prestasi</a>';
      h += '</div></div>';
      $('#result').innerHTML = h;
      var rb = $('#btnReplay'); if (rb) rb.addEventListener('click', function () { (o.replay || function () { location.reload(); })(); });
      Game.show('result');
      chrome();
      if (win) { Game.confetti(); E.sound('win'); } else { E.sound('lose'); }
      return res;
    }
  };
  w.Game = Game;
  w.EGZUI = { stars: stars, chrome: chrome, $: $, $$: $$ };

  /* ---------- modul halaman ---------- */
  var pages = {};

  pages.landing = function () {
    var s = E.state();
    var chip = $('#heroChip');
    if (chip && (s.history.length || s.nameSet)) {
      var li = E.levelInfo(s.xp);
      chip.innerHTML = '<i class="fa-solid fa-hand-wave me-1"></i> Selamat datang kembali, <b>' + esc(s.name) + '</b> · Level ' + li.level + ' · ' + s.xp + ' XP';
      chip.classList.remove('d-none');
      var cta = $('#heroCta'); if (cta) cta.innerHTML = '<i class="fa-solid fa-play me-2"></i>Lanjutkan Bermain';
    }
  };

  function gameCard(g, st) {
    var h = '<div class="col-md-6 col-xl-4"><a class="game-card gc-' + g.id + '" href="' + E.base + g.page + '">';
    h += '<div class="gc-top"><div class="gc-ico"><i class="fa-solid ' + g.icon + '"></i></div><div class="gc-stars">' + stars(st.bestStars) + '</div></div>';
    h += '<h3>' + g.name + '</h3><p class="gc-tag">' + g.tag + '</p>';
    h += '<div class="gc-meta"><span><i class="fa-solid fa-gamepad"></i> ' + st.plays + 'x main</span><span><i class="fa-solid fa-trophy"></i> ' + st.wins + ' menang</span><span><i class="fa-solid fa-medal"></i> Skor ' + st.best + '</span></div>';
    h += '<div class="progress gc-bar"><div class="progress-bar" style="width:' + st.progress + '%"></div></div>';
    h += '<div class="gc-foot"><small>Progres ' + st.progress + '%</small><span class="gc-play">Main <i class="fa-solid fa-arrow-right"></i></span></div>';
    return h + '</a></div>';
  }

  function badgeGrid(el, s) {
    var h = '';
    E.BADGES.forEach(function (b) {
      var got = s.badges[b.id];
      h += '<div class="badge-card ' + (got ? 'earned' : 'locked') + '"><div class="b-ico"><i class="fa-solid ' + (got ? b.icon : 'fa-lock') + '"></i></div>';
      h += '<b>' + esc(b.name) + '</b><small>' + esc(b.desc) + '</small>';
      h += '<span class="b-date">' + (got ? '<i class="fa-solid fa-check"></i> ' + E.fmtDate(got) : 'Terkunci') + '</span></div>';
    });
    el.innerHTML = h;
  }

  function historyRows(list) {
    return list.map(function (x) {
      var g = E.GAMES[x.game] || { name: x.game, icon: 'fa-gamepad' };
      return '<tr><td class="text-nowrap small">' + E.fmtDate(x.date) + '</td>' +
        '<td><span class="h-game gc-' + x.game + '"><i class="fa-solid ' + g.icon + '"></i> ' + esc(g.name) + '</span></td>' +
        '<td class="small text-muted">' + esc(x.label || '-') + '</td>' +
        '<td class="text-nowrap"><b>' + x.score + '</b>/' + x.max + ' <span class="badge ' + (x.win ? 'text-bg-success' : 'text-bg-secondary') + '">' + x.pct + '%</span></td>' +
        '<td class="text-nowrap">' + (x.stars ? stars(x.stars) : '<span class="text-muted">–</span>') + '</td>' +
        '<td class="text-nowrap text-end"><b class="text-xp">+' + x.xp + '</b></td></tr>';
    }).join('');
  }

  pages.dashboard = function () {
    var s = E.state(), li = E.levelInfo(s.xp);
    var hr = new Date().getHours();
    $('#dashGreeting').textContent = (hr < 11 ? 'Selamat pagi' : hr < 15 ? 'Selamat siang' : hr < 18 ? 'Selamat sore' : 'Selamat malam') + ',';
    $('#dashName').textContent = s.name + '!';
    $('#statXP').textContent = s.xp;
    $('#statLevel').textContent = li.level;
    $('#statTitle').textContent = li.title;
    $('#statLevelHint').textContent = li.into + ' / ' + li.need + ' XP menuju Level ' + (li.level + 1);
    var keys = Object.keys(E.GAMES);
    var plays = sum(keys, function (k) { return s.games[k].plays; });
    var wins = sum(keys, function (k) { return s.games[k].wins; });
    $('#statPlays').textContent = plays;
    $('#statWins').textContent = wins;
    var overall = Math.round(sum(keys, function (k) { return s.games[k].progress; }) / keys.length);
    $('#overallPct').textContent = overall + '%';
    $('#overallBar').style.width = overall + '%';
    var bcount = Object.keys(s.badges).length;
    $('#overallHint').textContent = bcount + ' dari ' + E.BADGES.length + ' badge diperoleh';
    $('#gameGrid').innerHTML = keys.map(function (k) { return gameCard(E.GAMES[k], s.games[k]); }).join('');
    badgeGrid($('#badgeGrid'), s);
    var recent = s.history.slice(0, 5), box = $('#recentBody');
    if (!recent.length) { $('#recentWrap').classList.add('d-none'); $('#recentEmpty').classList.remove('d-none'); }
    else box.innerHTML = historyRows(recent);

    var modalEl = $('#nameModal');
    if (modalEl && !s.nameSet && w.bootstrap) {
      var modal = new w.bootstrap.Modal(modalEl, { backdrop: 'static', keyboard: false });
      modal.show();
      $('#nameForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var v = $('#nameInput').value.trim().slice(0, 24) || 'Pemain';
        E.update(function (st) { st.name = v; st.nameSet = true; });
        modal.hide(); E.sound('coin'); E.toast('Halo, ' + v + '! Selamat bermain.', 'fa-hand-sparkles'); chrome(); pages.dashboard();
      });
      $('#nameSkip').addEventListener('click', function () {
        E.update(function (st) { st.nameSet = true; }); modal.hide();
      });
    }
  };

  pages.achievements = function () {
    var s = E.state(), li = E.levelInfo(s.xp);
    $('#achXP').textContent = s.xp;
    $('#achLevel').textContent = li.level;
    $('#achTitle').textContent = li.title;
    $('#achBar').style.width = li.pct + '%';
    $('#achHint').textContent = li.into + ' / ' + li.need + ' XP menuju Level ' + (li.level + 1);
    $('#achBadgeCount').textContent = Object.keys(s.badges).length + ' / ' + E.BADGES.length;
    badgeGrid($('#badgeGrid'), s);
    $('#bestList').innerHTML = Object.keys(E.GAMES).map(function (k) {
      var g = E.GAMES[k], st = s.games[k];
      return '<div class="col-md-6 col-xl-4"><div class="best-card gc-' + k + '"><div class="gc-ico sm"><i class="fa-solid ' + g.icon + '"></i></div>' +
        '<div class="flex-grow-1"><b>' + g.name + '</b><div class="small text-muted">' + st.plays + 'x main · ' + st.wins + ' menang</div></div>' +
        '<div class="text-end"><div class="best-score">' + st.best + '</div><small class="text-muted">skor tertinggi</small></div></div></div>';
    }).join('');
    var sel = $('#historyFilter');
    sel.innerHTML = '<option value="">Semua game</option>' + Object.keys(E.GAMES).map(function (k) { return '<option value="' + k + '">' + E.GAMES[k].name + '</option>'; }).join('');
    function draw() {
      var f = sel.value, list = s.history.filter(function (x) { return !f || x.game === f; });
      $('#historyBody').innerHTML = historyRows(list);
      $('#historyWrap').classList.toggle('d-none', !list.length);
      $('#historyEmpty').classList.toggle('d-none', !!list.length);
    }
    sel.addEventListener('change', draw); draw();
  };

  pages.profile = function () {
    var s = E.state(), li = E.levelInfo(s.xp), keys = Object.keys(E.GAMES);
    $('#pfInput').value = s.name;
    $('#pfSince').textContent = new Date(s.created).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    $('#pfBar').style.width = li.pct + '%';
    $('#pfHint').textContent = li.into + ' / ' + li.need + ' XP menuju Level ' + (li.level + 1);
    $('#pfPlays').textContent = sum(keys, function (k) { return s.games[k].plays; });
    $('#pfWins').textContent = sum(keys, function (k) { return s.games[k].wins; });
    $('#pfBadges').textContent = Object.keys(s.badges).length;
    $('#pfStarsTotal').textContent = sum(keys, function (k) { return s.games[k].bestStars; });
    $('#pfGames').innerHTML = keys.map(function (k) {
      var g = E.GAMES[k], st = s.games[k];
      return '<div class="pf-row"><span class="gc-ico sm gc-' + k + '"><i class="fa-solid ' + g.icon + '"></i></span><div class="flex-grow-1"><div class="d-flex justify-content-between"><b>' + g.name + '</b><small class="text-muted">' + st.progress + '%</small></div><div class="progress gc-bar gc-' + k + '"><div class="progress-bar" style="width:' + st.progress + '%"></div></div></div></div>';
    }).join('');
    $('#pfForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var v = $('#pfInput').value.trim().slice(0, 24);
      if (!v) { E.toast('Nama tidak boleh kosong.', 'fa-triangle-exclamation', 'warn'); return; }
      E.update(function (st) { st.name = v; st.nameSet = true; });
      chrome(); E.sound('ok'); E.toast('Nama diperbarui.', 'fa-check');
    });
    $('#pfExport').addEventListener('click', doExport);
  };

  function doExport() {
    var blob = new Blob([E.exportJSON()], { type: 'application/json' });
    var a = d.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'edugamezone-progres-' + new Date().toISOString().slice(0, 10) + '.json';
    d.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    E.toast('Cadangan progres diunduh.', 'fa-download');
  }

  pages.settings = function () {
    var s = E.state();
    $('#setName').value = s.name;
    $('#setSound').checked = !!s.settings.sound;
    $$('input[name="theme"]').forEach(function (r) { r.checked = r.value === s.settings.theme; });

    $('#setNameForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var v = $('#setName').value.trim().slice(0, 24);
      if (!v) { E.toast('Nama tidak boleh kosong.', 'fa-triangle-exclamation', 'warn'); return; }
      E.update(function (st) { st.name = v; st.nameSet = true; });
      chrome(); E.sound('ok'); E.toast('Nama tampilan disimpan.', 'fa-check');
    });
    $('#setSound').addEventListener('change', function () {
      var on = this.checked;
      E.update(function (st) { st.settings.sound = on; });
      if (on) E.sound('coin');
      E.toast('Suara ' + (on ? 'diaktifkan' : 'dimatikan') + '.', on ? 'fa-volume-high' : 'fa-volume-xmark');
    });
    $$('input[name="theme"]').forEach(function (r) {
      r.addEventListener('change', function () { E.setTheme(r.value); chrome(); E.toast('Tema ' + (r.value === 'dark' ? 'gelap' : 'terang') + ' aktif.', 'fa-palette'); });
    });
    $('#btnExport').addEventListener('click', doExport);
    $('#fileImport').addEventListener('change', function () {
      var f = this.files && this.files[0]; if (!f) return;
      var fr = new FileReader();
      fr.onload = function () {
        var r = E.importJSON(String(fr.result));
        E.toast(r.msg, r.ok ? 'fa-circle-check' : 'fa-triangle-exclamation', r.ok ? '' : 'warn');
        if (r.ok) { E.applyTheme(); chrome(); setTimeout(function () { location.reload(); }, 900); }
      };
      fr.readAsText(f);
      this.value = '';
    });

    var modalEl = $('#resetModal'), modal = w.bootstrap ? new w.bootstrap.Modal(modalEl) : null;
    var confirmInput = $('#resetConfirmInput'), confirmBtn = $('#confirmReset');
    $('#btnReset').addEventListener('click', function () { confirmInput.value = ''; confirmBtn.disabled = true; if (modal) modal.show(); });
    confirmInput.addEventListener('input', function () { confirmBtn.disabled = confirmInput.value.trim().toUpperCase() !== 'RESET'; });
    confirmBtn.addEventListener('click', function () {
      E.reset(); if (modal) modal.hide();
      E.applyTheme(); chrome();
      E.toast('Seluruh progres telah direset.', 'fa-trash-can');
      setTimeout(function () { location.href = E.base + 'dashboard.php'; }, 900);
    });
  };

  /* ---------- init ---------- */
  function init() {
    E.applyTheme();
    chrome();
    var tt = $('#themeToggle');
    if (tt) tt.addEventListener('click', function () {
      E.setTheme(E.state().settings.theme === 'dark' ? 'light' : 'dark'); chrome(); E.sound('click');
    });
    var page = d.body.getAttribute('data-page');
    if (pages[page]) pages[page]();
    w.addEventListener('storage', function (e) { if (e.key === E.KEY) { E.applyTheme(); chrome(); } });
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init); else init();
})(window, document);
