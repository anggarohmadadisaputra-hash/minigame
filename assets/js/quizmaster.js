/* QuizMaster - kuis pilihan ganda dengan timer, level, dan pembahasan */
(function () {
  'use strict';
  var E = EGZ, G = Game, $ = EGZUI.$;
  var CONF = {
    easy:   { label: 'Easy',   time: 20, pts: 10, mult: 1.0 },
    medium: { label: 'Medium', time: 15, pts: 15, mult: 1.2 },
    hard:   { label: 'Hard',   time: 12, pts: 20, mult: 1.5 }
  };
  var RANK = { easy: 0, medium: 1, hard: 2 };
  var BONUS = 5, N = 5;
  var DATA = null, st = null;

  G.loadJSON('questions.json').then(function (d) {
    DATA = d;
    $('#catGroup').innerHTML = d.categories.map(function (c, i) {
      return '<input type="radio" class="chip-radio" name="cat" id="cat-' + c.id + '" value="' + c.id + '"' + (i === 0 ? ' checked' : '') + '>' +
        '<label for="cat-' + c.id + '"><i class="fa-solid ' + c.icon + '"></i>' + E.esc(c.name) + '</label>';
    }).join('');
    $('#btnStart').disabled = false;
  });

  $('#btnStart').addEventListener('click', start);

  function start() {
    if (!DATA) return;
    var catId = document.querySelector('input[name=cat]:checked').value;
    var lv = document.querySelector('input[name=level]:checked').value;
    var cat = DATA.categories.filter(function (c) { return c.id === catId; })[0];
    var pool = DATA.questions.filter(function (q) { return q.cat === catId; });
    var same = G.shuffle(pool.filter(function (q) { return q.level === lv; }));
    var others = G.shuffle(pool.filter(function (q) { return q.level !== lv; })).sort(function (a, b) {
      return Math.abs(RANK[a.level] - RANK[lv]) - Math.abs(RANK[b.level] - RANK[lv]);
    });
    var picked = G.shuffle(same.concat(others).slice(0, N));
    var qs = picked.map(function (q) {
      var order = G.shuffle(q.options.map(function (o, i) { return i; }));
      return { q: q.q, level: q.level, explain: q.explain,
        options: order.map(function (i) { return q.options[i]; }), answer: order.indexOf(q.answer) };
    });
    var cfg = CONF[lv];
    st = { cfg: cfg, lv: lv, cat: cat, qs: qs, i: 0, score: 0, correct: 0, locked: false, timer: null,
      runId: E.newRunId('quiz'), max: qs.length * (cfg.pts + BONUS), streak: 0, bestStreak: 0 };
    $('#hudScore').textContent = '0';
    G.show('stage');
    renderQ();
  }

  function renderQ() {
    var q = st.qs[st.i], keys = ['A', 'B', 'C', 'D'];
    st.locked = false;
    $('#hudQ').textContent = (st.i + 1) + '/' + st.qs.length;
    G.setProgress(st.i / st.qs.length * 100);
    var h = '<div class="panel q-card">';
    h += '<div class="timer-bar"><i id="timerFill" style="width:100%"></i></div>';
    h += '<div class="q-meta"><span class="pill acc">' + E.esc(st.cat.name) + '</span><span class="pill">' + E.esc(q.level) + '</span><span class="pill">+' + st.cfg.pts + ' poin</span></div>';
    h += '<div class="q-text">' + E.esc(q.q) + '</div>';
    q.options.forEach(function (o, i) {
      h += '<button class="opt-btn" type="button" data-i="' + i + '"><span class="k">' + keys[i] + '</span><span>' + E.esc(o) + '</span></button>';
    });
    h += '<div id="feedback"></div></div>';
    $('#qArea').innerHTML = h;
    Array.prototype.forEach.call(document.querySelectorAll('.opt-btn'), function (b) {
      b.addEventListener('click', function () { answer(parseInt(b.getAttribute('data-i'), 10)); });
    });
    if (st.timer) st.timer.stop();
    st.timer = G.countdown(st.cfg.time, function (left) {
      $('#hudTime').textContent = left;
      var f = $('#timerFill'); if (f) f.style.width = Math.max(0, left / st.cfg.time * 100) + '%';
      $('#hudTimeBox').classList.toggle('danger', left <= 5 && left > 0);
    }, function () { answer(-1); });
  }

  function answer(i) {
    if (st.locked) return;
    st.locked = true;
    var left = st.timer ? st.timer.left() : 0;
    if (st.timer) st.timer.stop();
    $('#hudTimeBox').classList.remove('danger');
    var q = st.qs[st.i], btns = document.querySelectorAll('.opt-btn');
    var ok = i === q.answer, gain = 0;
    Array.prototype.forEach.call(btns, function (b, idx) {
      b.disabled = true;
      if (idx === q.answer) b.classList.add('correct');
      else if (idx === i) b.classList.add('wrong');
    });
    if (ok) {
      gain = st.cfg.pts + Math.round(BONUS * Math.max(0, left) / st.cfg.time);
      st.score += gain; st.correct++; st.streak++; st.bestStreak = Math.max(st.bestStreak, st.streak);
      E.sound('ok');
    } else { st.streak = 0; E.sound('bad'); }
    $('#hudScore').textContent = st.score;
    var last = st.i === st.qs.length - 1;
    var fb = '<div class="explain ' + (ok ? 'ok' : 'no') + '"><b>' +
      (ok ? '<i class="fa-solid fa-circle-check me-1"></i>Benar! +' + gain + ' poin' : (i === -1 ? '<i class="fa-solid fa-hourglass-end me-1"></i>Waktu habis!' : '<i class="fa-solid fa-circle-xmark me-1"></i>Kurang tepat.')) +
      '</b><div class="mt-1">' + E.esc(q.explain) + '</div></div>' +
      '<div class="text-end mt-3"><button class="btn btn-game" id="btnNext" type="button">' + (last ? 'Lihat Hasil <i class="fa-solid fa-flag-checkered ms-1"></i>' : 'Soal Berikutnya <i class="fa-solid fa-arrow-right ms-1"></i>') + '</button></div>';
    $('#feedback').innerHTML = fb;
    $('#btnNext').addEventListener('click', next);
    $('#btnNext').focus();
  }

  function next() {
    st.i++;
    if (st.i >= st.qs.length) return finish();
    renderQ();
  }

  function finish() {
    if (st.timer) st.timer.stop();
    G.setProgress(100);
    var pct = Math.round(st.score / st.max * 100);
    G.finish({
      game: 'quiz', runId: st.runId, score: st.score, max: st.max, mult: st.cfg.mult,
      stars: pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 40 ? 1 : 0,
      label: st.cat.name + ' · ' + st.cfg.label,
      title: pct >= 90 ? 'Luar Biasa!' : pct >= 60 ? 'Kerja Bagus!' : 'Ayo Coba Lagi!',
      subtitle: 'Kategori ' + st.cat.name + ' · Level ' + st.cfg.label,
      details: [
        { icon: 'fa-circle-check', value: st.correct + '/' + st.qs.length, label: 'Jawaban benar' },
        { icon: 'fa-fire', value: st.bestStreak, label: 'Streak terbaik' },
        { icon: 'fa-gauge-high', value: st.cfg.label, label: 'Level' }
      ],
      replay: function () { G.show('intro'); }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!st || st.locked || $('#stage').classList.contains('d-none')) return;
    var map = { '1': 0, '2': 1, '3': 2, '4': 3, a: 0, b: 1, c: 2, d: 3 };
    var k = e.key.toLowerCase();
    if (map[k] !== undefined && map[k] < st.qs[st.i].options.length) answer(map[k]);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && st && st.locked) { var b = $('#btnNext'); if (b && document.activeElement !== b) b.click(); }
  });
})();
