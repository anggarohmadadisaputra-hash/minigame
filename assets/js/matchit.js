/* MatchIt - seret definisi ke gambar (drag & drop + ketuk untuk layar sentuh) */
(function () {
  'use strict';
  var E = EGZ, G = Game, $ = EGZUI.$;
  var LV = { easy: { n: 4, label: 'Mudah' }, medium: { n: 6, label: 'Sedang' }, hard: { n: 8, label: 'Sulit' } };
  var DATA = null, st = null, clock = null;

  G.loadJSON('matching.json').then(function (d) {
    DATA = d;
    $('#setGroup').innerHTML = d.sets.map(function (s, i) {
      return '<input type="radio" class="chip-radio" name="set" id="set-' + s.id + '" value="' + s.id + '"' + (i === 0 ? ' checked' : '') + '>' +
        '<label for="set-' + s.id + '"><i class="fa-solid ' + s.icon + '"></i>' + E.esc(s.name) + '</label>';
    }).join('');
    $('#btnStart').disabled = false;
  });
  $('#btnStart').addEventListener('click', start);

  function start() {
    var setId = document.querySelector('input[name=set]:checked').value;
    var lv = document.querySelector('input[name=level]:checked').value;
    var set = DATA.sets.filter(function (s) { return s.id === setId; })[0];
    var n = LV[lv].n;
    var pairs = G.shuffle(set.pairs).slice(0, n);
    st = { set: set, lv: lv, pairs: pairs, n: n, matched: 0, errors: 0, secs: 0, picked: null, done: {},
      runId: E.newRunId('match') };
    if (clock) clearInterval(clock);
    clock = setInterval(function () { st.secs++; $('#hudTime').textContent = G.fmt(st.secs); }, 1000);
    render();
    hud();
    G.show('stage');
  }

  function render() {
    var zOrder = G.shuffle(st.pairs.map(function (p, i) { return i; }));
    var dOrder = G.shuffle(st.pairs.map(function (p, i) { return i; }));
    $('#zones').innerHTML = zOrder.map(function (i) {
      var p = st.pairs[i];
      return '<div class="drop-zone" data-i="' + i + '" tabindex="0" role="button" aria-label="Gambar ' + E.esc(p.name) + '">' +
        '<span class="emo">' + p.icon + '</span><div class="flex-grow-1"><div class="nm">' + E.esc(p.name) + '</div>' +
        '<div class="slot-text">Seret definisi ke sini</div></div></div>';
    }).join('');
    $('#defs').innerHTML = dOrder.map(function (i) {
      return '<div class="def-card" draggable="true" data-i="' + i + '" tabindex="0" role="button"><i class="fa-solid fa-grip-vertical"></i><span>' + E.esc(st.pairs[i].def) + '</span></div>';
    }).join('');
    bind();
  }

  function bind() {
    Array.prototype.forEach.call(document.querySelectorAll('.def-card'), function (c) {
      c.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', c.getAttribute('data-i'));
        e.dataTransfer.effectAllowed = 'move';
        c.classList.add('dragging');
        pick(parseInt(c.getAttribute('data-i'), 10), true);
      });
      c.addEventListener('dragend', function () { c.classList.remove('dragging'); });
      c.addEventListener('click', function () { pick(parseInt(c.getAttribute('data-i'), 10)); });
      c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(parseInt(c.getAttribute('data-i'), 10)); } });
    });
    Array.prototype.forEach.call(document.querySelectorAll('.drop-zone'), function (z) {
      var zi = parseInt(z.getAttribute('data-i'), 10);
      z.addEventListener('dragover', function (e) { e.preventDefault(); z.classList.add('over'); });
      z.addEventListener('dragleave', function () { z.classList.remove('over'); });
      z.addEventListener('drop', function (e) {
        e.preventDefault(); z.classList.remove('over');
        var di = parseInt(e.dataTransfer.getData('text/plain'), 10);
        if (!isNaN(di)) tryMatch(zi, di);
      });
      z.addEventListener('click', function () { if (st.picked !== null) tryMatch(zi, st.picked); });
      z.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && st.picked !== null) { e.preventDefault(); tryMatch(zi, st.picked); } });
    });
  }

  function pick(di, silent) {
    if (st.done[di]) return;
    st.picked = (!silent && st.picked === di) ? null : di;
    Array.prototype.forEach.call(document.querySelectorAll('.def-card'), function (c) {
      c.classList.toggle('picked', parseInt(c.getAttribute('data-i'), 10) === st.picked);
    });
    Array.prototype.forEach.call(document.querySelectorAll('.drop-zone:not(.done)'), function (z) {
      z.classList.toggle('target', st.picked !== null);
    });
    if (!silent) E.sound('click');
  }

  function tryMatch(zi, di) {
    if (st.done[zi]) return;
    var zone = document.querySelector('.drop-zone[data-i="' + zi + '"]');
    var card = document.querySelector('.def-card[data-i="' + di + '"]');
    if (!zone || !card || st.done[di]) return;
    if (zi === di) {
      st.done[zi] = true; st.matched++;
      zone.classList.remove('target', 'over', 'bad');
      zone.classList.add('done');
      zone.querySelector('.slot-text').textContent = st.pairs[zi].def;
      zone.insertAdjacentHTML('beforeend', '<i class="fa-solid fa-circle-check sparkle"></i>');
      card.classList.add('gone');
      E.sound('ok');
      st.picked = null;
      Array.prototype.forEach.call(document.querySelectorAll('.drop-zone:not(.done)'), function (z) { z.classList.remove('target'); });
      hud();
      if (st.matched === st.n) setTimeout(finish, 650);
    } else {
      st.errors++;
      zone.classList.add('bad');
      setTimeout(function () { zone.classList.remove('bad'); }, 450);
      E.sound('bad');
      hud();
    }
  }

  function calc() { return Math.max(st.n * 3, st.n * 10 - st.errors * 2 - Math.floor(st.secs / 15)); }

  function hud() {
    $('#hudErr').textContent = st.errors;
    $('#hudQ').textContent = st.matched + '/' + st.n;
    $('#hudScore').textContent = st.matched ? calc() : 0;
    G.setProgress(st.matched / st.n * 100);
  }

  function finish() {
    clearInterval(clock); clock = null;
    var max = st.n * 10, score = Math.min(max, calc());
    var stars = st.errors <= 1 ? 3 : st.errors <= Math.ceil(st.n / 2) ? 2 : 1;
    G.finish({
      game: 'match', runId: st.runId, score: score, max: max, mult: 1 + (st.n - 4) * 0.1, stars: stars,
      label: st.set.name + ' · ' + LV[st.lv].label + ' (' + st.n + ' pasang)',
      title: stars === 3 ? 'Sempurna!' : 'Semua Cocok!',
      subtitle: 'Tema ' + st.set.name + ' · ' + st.n + ' pasang',
      details: [
        { icon: 'fa-clock', value: G.fmt(st.secs), label: 'Waktu' },
        { icon: 'fa-circle-xmark', value: st.errors, label: 'Kesalahan' },
        { icon: 'fa-link', value: st.n + '/' + st.n, label: 'Pasangan' }
      ],
      tips: stars < 3 ? 'Raih 3 bintang dengan maksimal 1 kesalahan.' : '',
      replay: function () { G.show('intro'); }
    });
  }
})();
