/* EcoHero - memilah sampah organik, anorganik, dan B3 (drag & drop + ketuk) */
(function () {
  'use strict';
  var E = EGZ, G = Game, $ = EGZUI.$;
  var DATA = null, st = null;

  G.loadJSON('ecohero.json').then(function (d) {
    DATA = d;
    $('#missionGroup').innerHTML = d.missions.map(function (m, i) {
      return '<input type="radio" class="chip-radio" name="mission" id="m-' + m.id + '" value="' + m.id + '"' + (i === 0 ? ' checked' : '') + '>' +
        '<label for="m-' + m.id + '">' + m.icon + ' Misi ' + m.id + ': ' + E.esc(m.name) + '</label>';
    }).join('');
    $('#introTip').textContent = d.tips[Math.floor(Math.random() * d.tips.length)];
    $('#btnStart').disabled = false;
  });
  $('#btnStart').addEventListener('click', start);

  function start() {
    var mid = parseInt(document.querySelector('input[name=mission]:checked').value, 10);
    var m = DATA.missions.filter(function (x) { return x.id === mid; })[0];
    // campuran seimbang: ambil dari tiap jenis lalu diacak
    var per = Math.ceil(m.count / DATA.bins.length), pool = [];
    DATA.bins.forEach(function (b) {
      pool = pool.concat(G.shuffle(DATA.items.filter(function (it) { return it.type === b.id; })).slice(0, per));
    });
    var items = G.shuffle(pool).slice(0, m.count);
    st = { m: m, items: items, i: 0, score: 0, correct: 0, wrong: 0, combo: 0, bestCombo: 0, locked: false, timer: null,
      runId: E.newRunId('eco'), max: items.length * 10, timeUp: false, fixTimeout: null };
    drawBins();
    $('#hudScore').textContent = '0'; $('#hudCombo').textContent = '0';
    G.show('stage');
    showItem();
    st.timer = G.countdown(m.time, function (left) {
      $('#hudTime').textContent = left;
      $('#hudTimeBox').classList.toggle('danger', left <= 10 && left > 0);
    }, function () { st.timeUp = true; clearTimeout(st.fixTimeout); finish(); });
  }

  function drawBins() {
    $('#bins').innerHTML = DATA.bins.map(function (b) {
      return '<div class="bin ' + b.id + '" data-b="' + b.id + '" role="button" tabindex="0" aria-label="Tempat sampah ' + E.esc(b.name) + '"><i class="fa-solid ' + b.icon + '"></i>' + E.esc(b.name) + '<small>' + E.esc(b.desc) + '</small></div>';
    }).join('');
    Array.prototype.forEach.call(document.querySelectorAll('.bin'), function (bin) {
      var id = bin.getAttribute('data-b');
      bin.addEventListener('click', function () { classify(id); });
      bin.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); classify(id); } });
      bin.addEventListener('dragover', function (e) { e.preventDefault(); bin.classList.add('over'); });
      bin.addEventListener('dragleave', function () { bin.classList.remove('over'); });
      bin.addEventListener('drop', function (e) { e.preventDefault(); bin.classList.remove('over'); classify(id); });
    });
  }

  function showItem() {
    var it = st.items[st.i];
    st.locked = false;
    $('#hudQ').textContent = (st.i + 1) + '/' + st.items.length;
    G.setProgress(st.i / st.items.length * 100);
    var next = st.items.slice(st.i + 1, st.i + 4).map(function (x) { return x.icon; }).join(' ');
    $('#trashArea').innerHTML = '<div class="trash-item" id="trashItem" draggable="true"><span class="emo">' + it.icon + '</span><span class="nm">' + E.esc(it.name) + '</span></div>' +
      '<div class="small text-muted mt-2">Seret ke tempat sampah yang benar, atau ketuk tempatnya</div>' +
      (next ? '<div class="queue" aria-hidden="true">Berikutnya: ' + next + '</div>' : '');
    var el = $('#trashItem');
    el.addEventListener('dragstart', function (e) { e.dataTransfer.setData('text/plain', 'trash'); e.dataTransfer.effectAllowed = 'move'; el.classList.add('dragging'); });
    el.addEventListener('dragend', function () { el.classList.remove('dragging'); });
  }

  function classify(binId) {
    if (!st || st.locked || st.timeUp) return;
    st.locked = true;
    var it = st.items[st.i], ok = it.type === binId;
    var binEl = document.querySelector('.bin[data-b="' + binId + '"]');
    var rightEl = document.querySelector('.bin[data-b="' + it.type + '"]');
    if (ok) {
      st.score += 10; st.correct++; st.combo++; st.bestCombo = Math.max(st.bestCombo, st.combo);
      binEl.classList.add('good'); E.sound('ok');
    } else {
      st.score = Math.max(0, st.score - 5); st.wrong++; st.combo = 0;
      binEl.classList.add('bad'); rightEl.classList.add('good'); E.sound('bad');
    }
    $('#hudScore').textContent = st.score; $('#hudCombo').textContent = st.combo;
    var binName = DATA.bins.filter(function (b) { return b.id === it.type; })[0].name;
    var fact = $('#ecoFact');
    fact.className = 'eco-fact ' + (ok ? 'ok' : 'no');
    fact.innerHTML = (ok ? '<i class="fa-solid fa-circle-check me-1"></i><b>Tepat! +10.</b> ' : '<i class="fa-solid fa-circle-xmark me-1"></i><b>' + E.esc(it.name) + ' termasuk ' + E.esc(binName) + ' (−5).</b> ') + E.esc(it.fact);
    $('#trashItem').style.opacity = '.35';
    st.fixTimeout = setTimeout(function () {
      binEl.classList.remove('good', 'bad'); rightEl.classList.remove('good');
      st.i++;
      if (st.i >= st.items.length) finish(); else showItem();
    }, ok ? 1100 : 1900);
  }

  function finish() {
    if (st.finished) return;
    st.finished = true;
    if (st.timer) st.timer.stop();
    $('#hudTimeBox').classList.remove('danger');
    G.setProgress(100);
    var max = st.max, score = Math.min(max, st.score), pct = Math.round(score / max * 100);
    var left = st.items.length - st.correct - st.wrong;
    G.finish({
      game: 'eco', runId: st.runId, score: score, max: max, mult: 1 + (st.m.id - 1) * 0.15,
      stars: pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 40 ? 1 : 0,
      label: 'Misi ' + st.m.id + ': ' + st.m.name,
      title: st.timeUp ? 'Waktu Habis!' : pct >= 90 ? 'Pahlawan Lingkungan!' : pct >= 60 ? 'Misi Berhasil!' : 'Ayo Coba Lagi!',
      subtitle: 'Misi ' + st.m.id + ' · ' + st.m.name,
      details: [
        { icon: 'fa-recycle', value: st.correct + '/' + st.items.length, label: 'Terpilah benar' },
        { icon: 'fa-circle-xmark', value: st.wrong, label: 'Salah pilah' },
        { icon: 'fa-fire', value: st.bestCombo, label: 'Combo terbaik' }
      ].concat(left > 0 ? [{ icon: 'fa-hourglass-end', value: left, label: 'Belum sempat' }] : []),
      tips: DATA.tips[Math.floor(Math.random() * DATA.tips.length)],
      replay: function () { G.show('intro'); }
    });
  }
})();
