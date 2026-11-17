/* CodeAdventure - susun kode, tebak output, perbaiki bug, dan soal logika PHP */
(function () {
  'use strict';
  var E = EGZ, G = Game, $ = EGZUI.$;
  var PTS = 10, N = 6, DATA = null, st = null;
  var TYPE = {
    order:  { label: 'Susun Kode',   icon: 'fa-arrow-down-1-9' },
    output: { label: 'Tebak Output', icon: 'fa-terminal' },
    logic:  { label: 'Logika',       icon: 'fa-brain' },
    fix:    { label: 'Perbaiki Bug', icon: 'fa-bug' }
  };

  G.loadJSON('coding.json').then(function (d) { DATA = d; $('#btnStart').disabled = false; });
  $('#btnStart').addEventListener('click', start);

  function start() {
    var lv = document.querySelector('input[name=level]:checked').value;
    var pool = G.shuffle(DATA.challenges.filter(function (c) { return c.level === lv; })).slice(0, N);
    st = { lv: lv, list: pool, i: 0, score: 0, ok: 0, locked: false, runId: E.newRunId('code'), max: pool.length * PTS, topics: {} };
    $('#hudScore').textContent = '0'; $('#hudOk').textContent = '0';
    G.show('stage');
    render();
  }

  function codeHtml(code) {
    return '<pre class="code-block"><code>' + E.esc(code) + '</code></pre>';
  }

  function render() {
    var c = st.list[st.i], t = TYPE[c.type];
    st.locked = false;
    $('#hudQ').textContent = (st.i + 1) + '/' + st.list.length;
    G.setProgress(st.i / st.list.length * 100);
    var h = '<div class="q-meta"><span class="pill acc"><i class="fa-solid ' + t.icon + ' me-1"></i>' + t.label + '</span><span class="pill topic-tag">' + E.esc(c.topic) + '</span><span class="pill">' + E.esc(c.level) + '</span></div>';
    h += '<div class="q-text">' + E.esc(c.title) + '</div>';
    if (c.type === 'order') {
      h += '<div class="opt-label mt-0">Urutan jawabanmu (klik baris untuk melepas)</div><div class="order-answer" id="ansBox"></div>';
      h += '<div class="opt-label">Baris kode tersedia (klik untuk memasang)</div><div class="order-pool" id="poolBox"></div>';
      h += '<div class="d-flex gap-2 mt-3"><button class="btn btn-game" id="btnCheck" type="button"><i class="fa-solid fa-check me-1"></i>Periksa</button><button class="btn btn-soft" id="btnReset" type="button"><i class="fa-solid fa-rotate-left me-1"></i>Ulangi</button></div>';
    } else {
      if (c.code) h += codeHtml(c.code);
      c.options.forEach(function (o, i) {
        h += '<button class="opt-btn" type="button" data-i="' + i + '"><span class="k">' + 'ABCD'.charAt(i) + '</span><span>' + E.esc(o) + '</span></button>';
      });
    }
    h += '<div id="feedback"></div>';
    $('#cArea').innerHTML = h;

    if (c.type === 'order') setupOrder(c);
    else Array.prototype.forEach.call(document.querySelectorAll('.opt-btn'), function (b) {
      b.addEventListener('click', function () { chooseOption(c, parseInt(b.getAttribute('data-i'), 10)); });
    });
  }

  /* ---- tipe: susun kode ---- */
  function setupOrder(c) {
    var items = G.shuffle(c.lines.map(function (l, i) { return { id: i, text: l }; }));
    // hindari urutan acak yang kebetulan sudah benar
    if (items.every(function (x, i) { return x.text === c.lines[i]; }) && items.length > 1) items.reverse();
    st.pool = items; st.ans = [];
    drawOrder();
    $('#btnCheck').addEventListener('click', function () { checkOrder(c); });
    $('#btnReset').addEventListener('click', function () {
      if (st.locked) return;
      st.pool = st.pool.concat(st.ans); st.ans = []; drawOrder();
    });
  }

  function chip(it, where) {
    return '<button type="button" class="code-chip" data-w="' + where + '" data-id="' + it.id + '">' + E.esc(it.text) + '</button>';
  }

  function drawOrder() {
    $('#poolBox').innerHTML = st.pool.length ? st.pool.map(function (x) { return chip(x, 'pool'); }).join('') : '<div class="order-hint">Semua baris sudah dipasang.</div>';
    $('#ansBox').innerHTML = st.ans.length ? st.ans.map(function (x) { return chip(x, 'ans'); }).join('') : '<div class="order-hint">Klik baris kode di bawah untuk menyusunnya di sini.</div>';
    Array.prototype.forEach.call(document.querySelectorAll('.code-chip'), function (b) {
      b.addEventListener('click', function () {
        if (st.locked) return;
        var id = parseInt(b.getAttribute('data-id'), 10), from = b.getAttribute('data-w');
        var src = from === 'pool' ? st.pool : st.ans, dst = from === 'pool' ? st.ans : st.pool;
        var idx = src.findIndex(function (x) { return x.id === id; });
        if (idx > -1) { dst.push(src.splice(idx, 1)[0]); E.sound('click'); drawOrder(); }
      });
    });
  }

  function checkOrder(c) {
    if (st.locked) return;
    if (st.ans.length !== c.lines.length) { E.toast('Pasang semua baris kode terlebih dahulu.', 'fa-triangle-exclamation', 'warn'); return; }
    var ok = st.ans.every(function (x, i) { return x.text === c.lines[i]; });
    var chips = document.querySelectorAll('#ansBox .code-chip');
    Array.prototype.forEach.call(chips, function (b, i) { b.classList.add(st.ans[i].text === c.lines[i] ? 'ok' : 'no'); });
    var extra = ok ? '' : '<div class="mt-2"><b>Urutan yang benar:</b></div>' + codeHtml(c.lines.join('\n'));
    resolve(c, ok, extra);
  }

  /* ---- tipe: pilihan ---- */
  function chooseOption(c, i) {
    if (st.locked) return;
    var btns = document.querySelectorAll('.opt-btn');
    Array.prototype.forEach.call(btns, function (b, idx) {
      b.disabled = true;
      if (idx === c.answer) b.classList.add('correct');
      else if (idx === i) b.classList.add('wrong');
    });
    resolve(c, i === c.answer, '');
  }

  function resolve(c, ok, extra) {
    st.locked = true;
    if (ok) { st.score += PTS; st.ok++; E.sound('ok'); } else E.sound('bad');
    var t = st.topics[c.topic] = st.topics[c.topic] || { ok: 0, n: 0 };
    t.n++; if (ok) t.ok++;
    $('#hudScore').textContent = st.score; $('#hudOk').textContent = st.ok;
    var last = st.i === st.list.length - 1;
    $('#feedback').innerHTML = '<div class="explain ' + (ok ? 'ok' : 'no') + '"><b>' +
      (ok ? '<i class="fa-solid fa-circle-check me-1"></i>Benar! +' + PTS + ' poin' : '<i class="fa-solid fa-circle-xmark me-1"></i>Belum tepat.') +
      '</b><div class="mt-1">' + E.esc(c.explain) + '</div>' + extra + '</div>' +
      '<div class="text-end mt-3"><button class="btn btn-game" id="btnNext" type="button">' + (last ? 'Lihat Hasil <i class="fa-solid fa-flag-checkered ms-1"></i>' : 'Tantangan Berikutnya <i class="fa-solid fa-arrow-right ms-1"></i>') + '</button></div>';
    $('#btnNext').addEventListener('click', next);
    $('#btnNext').focus();
  }

  function next() {
    st.i++;
    if (st.i >= st.list.length) return finish();
    render();
  }

  function finish() {
    G.setProgress(100);
    var pct = Math.round(st.score / st.max * 100);
    var weak = Object.keys(st.topics).filter(function (k) { return st.topics[k].ok < st.topics[k].n; });
    G.finish({
      game: 'code', runId: st.runId, score: st.score, max: st.max, mult: st.lv === 'menengah' ? 1.3 : 1,
      stars: pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 40 ? 1 : 0,
      label: 'Level ' + (st.lv === 'menengah' ? 'Menengah' : 'Pemula'),
      title: pct >= 90 ? 'Coder Hebat!' : pct >= 60 ? 'Kerja Bagus!' : 'Terus Berlatih!',
      subtitle: 'Level ' + (st.lv === 'menengah' ? 'Menengah' : 'Pemula'),
      details: [
        { icon: 'fa-circle-check', value: st.ok + '/' + st.list.length, label: 'Tantangan benar' },
        { icon: 'fa-gauge-high', value: pct + '%', label: 'Akurasi' }
      ],
      tips: weak.length ? 'Materi yang perlu diulang: ' + weak.join(', ') + '.' : 'Semua materi dikuasai. Coba level berikutnya!',
      replay: function () { G.show('intro'); }
    });
  }
})();
