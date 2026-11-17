/* WordQuest - tebak kata dengan petunjuk, hint, dan nyawa */
(function () {
  'use strict';
  var E = EGZ, G = Game, $ = EGZUI.$;
  var MAX_WRONG = 6, HINT_COST = 3, BASE = { 1: 10, 2: 15, 3: 20 };
  var DATA = null, st = null, clock = null;
  var LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  G.loadJSON('words.json').then(function (d) {
    DATA = d;
    $('#catGroup').innerHTML = d.categories.map(function (c, i) {
      return '<input type="radio" class="chip-radio" name="cat" id="cat-' + c.id + '" value="' + c.id + '"' + (i === 0 ? ' checked' : '') + '>' +
        '<label for="cat-' + c.id + '"><i class="fa-solid ' + c.icon + '"></i>' + E.esc(c.name) + '</label>';
    }).join('');
    $('#btnStart').disabled = false;
  });
  $('#btnStart').addEventListener('click', start);

  function start() {
    var catId = document.querySelector('input[name=cat]:checked').value;
    var cat = DATA.categories.filter(function (c) { return c.id === catId; })[0];
    var words = DATA.words.filter(function (w) { return w.cat === catId; }).sort(function (a, b) { return a.level - b.level; });
    st = { cat: cat, words: words, i: 0, score: 0, solved: 0, totalWrong: 0, totalHints: 0, secs: 0,
      runId: E.newRunId('word'), max: words.reduce(function (t, w) { return t + BASE[w.level]; }, 0), cur: null };
    if (clock) clearInterval(clock);
    clock = setInterval(function () { st.secs++; $('#hudTime').textContent = G.fmt(st.secs); }, 1000);
    $('#hudTime').textContent = '00:00';
    $('#hudScore').textContent = '0';
    G.show('stage');
    loadWord();
  }

  function loadWord() {
    var w = st.words[st.i];
    st.cur = { w: w, guessed: {}, revealed: {}, wrong: 0, hints: 0, done: false, shownHints: [] };
    $('#hudQ').textContent = (st.i + 1) + '/' + st.words.length;
    $('#hudLevel').textContent = w.level;
    G.setProgress(st.i / st.words.length * 100);
    render();
  }

  function render() {
    var c = st.cur, w = c.w, h = '';
    h += '<div class="q-meta"><span class="pill acc">' + E.esc(st.cat.name) + '</span><span class="pill">Level ' + w.level + '</span><span class="pill">' + w.word.length + ' huruf</span></div>';
    h += '<div class="clue-box"><i class="fa-solid fa-magnifying-glass me-2"></i>' + E.esc(w.clue) + '</div>';
    h += '<div class="hint-list" id="hintList">' + c.shownHints.map(function (t) { return '<div class="hint-item"><i class="fa-solid fa-lightbulb me-1"></i>' + E.esc(t) + '</div>'; }).join('') + '</div>';
    h += '<div class="word-slots" id="slots"></div>';
    h += '<div class="d-flex flex-wrap justify-content-between align-items-center gap-2">';
    h += '<div class="lives" id="lives" aria-label="Sisa kesempatan"></div>';
    h += '<button class="btn btn-soft btn-sm" id="btnHint" type="button"><i class="fa-solid fa-lightbulb me-1"></i>Hint (−' + HINT_COST + ')</button></div>';
    h += '<div class="kbd" id="kbd">' + LETTERS.map(function (l) { return '<button class="key" type="button" data-l="' + l + '">' + l + '</button>'; }).join('') + '</div>';
    h += '<div id="wFeedback"></div>';
    $('#wArea').innerHTML = h;
    Array.prototype.forEach.call(document.querySelectorAll('.key'), function (k) {
      k.addEventListener('click', function () { guess(k.getAttribute('data-l')); });
    });
    $('#btnHint').addEventListener('click', hint);
    update();
  }

  function isFilled(c, ch) { return c.guessed[ch] || c.revealed[ch]; }

  function update() {
    var c = st.cur, w = c.w;
    $('#slots').innerHTML = w.word.split('').map(function (ch) {
      var cls = 'slot', t = '';
      if (c.guessed[ch]) { cls += ' filled'; t = ch; }
      else if (c.revealed[ch]) { cls += ' revealed'; t = ch; }
      else if (c.done && !c.won) { cls += ' missed'; t = ch; }
      return '<div class="' + cls + '">' + t + '</div>';
    }).join('');
    var lives = '';
    for (var i = 0; i < MAX_WRONG; i++) lives += '<i class="fa-solid fa-heart' + (i < MAX_WRONG - c.wrong ? '' : ' gone') + '"></i>';
    $('#lives').innerHTML = lives;
    Array.prototype.forEach.call(document.querySelectorAll('.key'), function (k) {
      var l = k.getAttribute('data-l');
      k.disabled = c.done || !!c.guessed[l] || !!c.revealed[l] || !!c.missed && c.missed[l];
      k.classList.toggle('hit', !!c.guessed[l] && w.word.indexOf(l) !== -1);
      k.classList.toggle('miss', !!c.missed && !!c.missed[l]);
    });
    var hb = $('#btnHint'); if (hb) hb.disabled = c.done || c.hints >= 3;
  }

  function guess(l) {
    var c = st.cur;
    if (!c || c.done || c.guessed[l] || (c.missed && c.missed[l]) || c.revealed[l]) return;
    if (c.w.word.indexOf(l) !== -1) { c.guessed[l] = true; E.sound('ok'); }
    else { c.missed = c.missed || {}; c.missed[l] = true; c.wrong++; st.totalWrong++; E.sound('bad'); }
    check();
  }

  function hint() {
    var c = st.cur;
    if (c.done || c.hints >= 3) return;
    var w = c.w;
    if (c.hints < w.hints.length) {
      c.shownHints.push(w.hints[c.hints]);
    } else {
      var left = w.word.split('').filter(function (ch) { return !isFilled(c, ch); });
      if (left.length > 1) {
        var ch = left[Math.floor(Math.random() * left.length)];
        c.revealed[ch] = true;
        c.shownHints.push('Satu huruf dibuka: ' + ch);
      } else { c.shownHints.push('Tinggal satu huruf lagi, kamu pasti bisa!'); }
    }
    c.hints++; st.totalHints++;
    E.sound('click');
    var hl = $('#hintList');
    hl.innerHTML = c.shownHints.map(function (t) { return '<div class="hint-item"><i class="fa-solid fa-lightbulb me-1"></i>' + E.esc(t) + '</div>'; }).join('');
    check();
  }

  function check() {
    var c = st.cur, w = c.w;
    var complete = w.word.split('').every(function (ch) { return isFilled(c, ch); });
    if (complete) {
      c.done = true; c.won = true;
      var pts = Math.max(3, BASE[w.level] - c.hints * HINT_COST - c.wrong);
      st.score += pts; st.solved++;
      $('#hudScore').textContent = st.score;
      update(); E.sound('coin');
      end('ok', '<i class="fa-solid fa-circle-check me-1"></i>Benar! Kata: <b>' + w.word + '</b> (+' + pts + ' poin)');
    } else if (c.wrong >= MAX_WRONG) {
      c.done = true; c.won = false;
      update();
      end('no', '<i class="fa-solid fa-circle-xmark me-1"></i>Kesempatan habis. Jawabannya: <b>' + w.word + '</b>');
    } else update();
  }

  function end(kind, msg) {
    var last = st.i === st.words.length - 1;
    $('#wFeedback').innerHTML = '<div class="explain ' + kind + ' mt-3">' + msg + '</div>' +
      '<div class="text-end mt-3"><button class="btn btn-game" id="btnNext" type="button">' + (last ? 'Lihat Hasil <i class="fa-solid fa-flag-checkered ms-1"></i>' : 'Kata Berikutnya <i class="fa-solid fa-arrow-right ms-1"></i>') + '</button></div>';
    $('#btnNext').addEventListener('click', next);
    $('#btnNext').focus();
  }

  function next() {
    st.i++;
    if (st.i >= st.words.length) return finish();
    loadWord();
  }

  function finish() {
    clearInterval(clock); clock = null;
    G.setProgress(100);
    var pct = Math.round(st.score / st.max * 100);
    G.finish({
      game: 'word', runId: st.runId, score: st.score, max: st.max, mult: 1.1,
      stars: pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 40 ? 1 : 0,
      label: st.cat.name,
      title: pct >= 90 ? 'Ahli Kata!' : pct >= 60 ? 'Kerja Bagus!' : 'Ayo Coba Lagi!',
      subtitle: 'Kategori ' + st.cat.name,
      details: [
        { icon: 'fa-spell-check', value: st.solved + '/' + st.words.length, label: 'Kata terjawab' },
        { icon: 'fa-lightbulb', value: st.totalHints, label: 'Hint dipakai' },
        { icon: 'fa-circle-xmark', value: st.totalWrong, label: 'Tebakan salah' },
        { icon: 'fa-clock', value: G.fmt(st.secs), label: 'Waktu' }
      ],
      replay: function () { G.show('intro'); }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!st || !st.cur || $('#stage').classList.contains('d-none') || e.ctrlKey || e.metaKey || e.altKey) return;
    if (/^[a-zA-Z]$/.test(e.key)) guess(e.key.toUpperCase());
    else if (e.key === 'Enter') { var b = $('#btnNext'); if (b && document.activeElement !== b) b.click(); }
  });
})();
