/* SmartMoney - simulasi pengelolaan keuangan 6 bulan */
(function () {
  'use strict';
  var E = EGZ, G = Game, $ = EGZUI.$;
  var D = null, st = null;
  var STEP = 50000;

  function rp(n) { return (n < 0 ? '-' : '') + 'Rp ' + Math.abs(Math.round(n)).toLocaleString('id-ID'); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  G.loadJSON('smartmoney.json').then(function (d) {
    D = d;
    $('#introTips').innerHTML = d.tips.map(function (t) { return '<li>' + E.esc(t) + '</li>'; }).join('');
    $('#btnStart').disabled = false;
  });
  $('#btnStart').addEventListener('click', start);

  function start() {
    st = { month: 1, saldo: D.startBalance, savings: 0, debt: 0, income: 0, needs: 0, wants: 0, deposits: 0, interest: 0,
      happy: [], events: G.shuffle(D.events).slice(0, D.months), mHappy: 0, plan: null, runId: E.newRunId('money') };
    G.show('stage');
    beginMonth(true);
  }

  function hud() {
    var avg = st.happy.length ? Math.round(st.happy.reduce(function (a, b) { return a + b; }, 0) / st.happy.length) : 50;
    $('#mMonth').textContent = st.month + '/' + D.months;
    $('#mSaldo').textContent = rp(st.saldo);
    $('#mSave').textContent = rp(st.savings);
    $('#mDebt').textContent = rp(st.debt);
    $('#mDebtBox').classList.toggle('neg', st.debt > 0);
    $('#mHappy').textContent = avg;
    G.setProgress((st.month - 1) / D.months * 100);
  }

  /* ---------- fase 1: anggaran ---------- */
  function beginMonth(first) {
    if (!first) st.month++;
    st.saldo += D.income; st.income += D.income;
    st.mHappy = 40;
    hud();
    renderBudget();
  }

  function renderBudget() {
    var h = '<div class="panel">';
    h += '<div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2"><h4 class="mb-0"><i class="fa-solid fa-sack-dollar me-2" style="color:var(--accent)"></i>Bulan ' + st.month + ': Susun Anggaran</h4>';
    h += '<span class="pill acc">Gaji masuk +' + rp(D.income) + '</span></div>';
    h += '<p class="text-muted">Saldo tersedia bulan ini: <b>' + rp(st.saldo) + '</b>. Pilih pengeluaran dan tabunganmu.</p>';

    h += '<div class="opt-label">1. Kebutuhan (wajib)</div>';
    D.needs.forEach(function (n) {
      h += '<div class="budget-row"><div class="b-emo">' + n.icon + '</div><div class="grow"><b>' + E.esc(n.name) + '</b></div><div class="seg" role="radiogroup">';
      n.options.forEach(function (o, i) {
        h += '<input type="radio" name="need-' + n.id + '" id="need-' + n.id + '-' + i + '" value="' + i + '"' + (i === n.options.length - 1 ? ' checked' : '') + '><label for="need-' + n.id + '-' + i + '">' + o.label + ' · ' + rp(o.cost) + '</label>';
      });
      h += '</div></div>';
    });

    h += '<div class="opt-label">2. Keinginan (opsional)</div>';
    D.wants.forEach(function (w) {
      h += '<label class="budget-row want-item" for="want-' + w.id + '"><div class="b-emo">' + w.icon + '</div><div class="grow"><b>' + E.esc(w.name) + '</b><div class="small text-muted">Kebahagiaan +' + w.happy + '</div></div><b>' + rp(w.cost) + '</b><input type="checkbox" id="want-' + w.id + '" data-id="' + w.id + '"></label>';
    });

    h += '<div class="opt-label">3. Tabungan darurat</div>';
    var maxSave = Math.max(0, Math.floor(st.saldo / STEP) * STEP);
    h += '<div class="budget-row"><div class="b-emo">🐖</div><div class="range-wrap"><input type="range" id="saveRange" min="0" max="' + maxSave + '" step="' + STEP + '" value="0" aria-label="Jumlah tabungan"><span class="range-val" id="saveVal">Rp 0</span></div>';
    h += '<button class="btn btn-soft btn-sm" type="button" id="btnSave20">Isi 20% gaji</button></div>';

    if (st.debt > 0) {
      var maxDebt = Math.min(st.debt, Math.floor(st.saldo / 10000) * 10000);
      h += '<div class="opt-label">4. Bayar utang (' + rp(st.debt) + ', bunga ' + Math.round(D.debtInterest * 100) + '%/bulan)</div>';
      h += '<div class="budget-row"><div class="b-emo">💳</div><div class="range-wrap"><input type="range" id="debtRange" min="0" max="' + maxDebt + '" step="10000" value="0" aria-label="Bayar utang"><span class="range-val" id="debtVal">Rp 0</span></div>';
      h += '<button class="btn btn-soft btn-sm" type="button" id="btnDebtAll">Lunasi</button></div>';
    }

    h += '<hr><div class="d-flex flex-wrap justify-content-between align-items-center gap-3">';
    h += '<div><div class="small text-muted">Total rencana pengeluaran</div><b class="fs-5" id="planTotal">Rp 0</b> <span class="small text-muted" id="planPct"></span></div>';
    h += '<div><div class="small text-muted">Sisa saldo setelah anggaran</div><b class="fs-5" id="planLeft">Rp 0</b><div class="warn-line small" id="planWarn"></div></div>';
    h += '<button class="btn btn-game btn-lg" id="btnConfirm" type="button"><i class="fa-solid fa-check me-1"></i>Konfirmasi Anggaran</button></div>';
    h += '</div>';
    $('#phase').innerHTML = h;

    Array.prototype.forEach.call(document.querySelectorAll('#phase input'), function (i) { i.addEventListener('input', recalc); i.addEventListener('change', recalc); });
    $('#btnSave20').addEventListener('click', function () {
      var r = $('#saveRange'); r.value = clamp(Math.round(D.income * 0.2 / STEP) * STEP, 0, parseInt(r.max, 10)); recalc();
    });
    var da = $('#btnDebtAll'); if (da) da.addEventListener('click', function () { var r = $('#debtRange'); r.value = r.max; recalc(); });
    $('#btnConfirm').addEventListener('click', confirmBudget);
    recalc();
  }

  function readPlan() {
    var needs = 0, needHappy = 0, wants = 0, wantHappy = 0;
    D.needs.forEach(function (n) {
      var sel = document.querySelector('input[name="need-' + n.id + '"]:checked');
      var o = n.options[sel ? parseInt(sel.value, 10) : n.options.length - 1];
      needs += o.cost; needHappy += o.happy;
    });
    D.wants.forEach(function (w) {
      var cb = document.getElementById('want-' + w.id);
      if (cb && cb.checked) { wants += w.cost; wantHappy += w.happy; }
    });
    var save = parseInt($('#saveRange').value, 10) || 0;
    var dr = $('#debtRange'), pay = dr ? parseInt(dr.value, 10) || 0 : 0;
    return { needs: needs, needHappy: needHappy, wants: wants, wantHappy: wantHappy, save: save, pay: pay,
      total: needs + wants + save + pay };
  }

  function recalc() {
    var p = readPlan(), left = st.saldo - p.total;
    $('#saveVal').textContent = rp(p.save);
    var dv = $('#debtVal'); if (dv) dv.textContent = rp(p.pay);
    $('#planTotal').textContent = rp(p.total);
    $('#planPct').textContent = '(' + Math.round(p.total / D.income * 100) + '% dari gaji)';
    var el = $('#planLeft'); el.textContent = rp(left); el.style.color = left < 0 ? 'var(--bad)' : '';
    $('#planWarn').textContent = left < 0 ? 'Saldo tidak cukup. Kurangi keinginan atau tabungan.' : '';
    $('#btnConfirm').disabled = left < 0;
  }

  function confirmBudget() {
    var p = readPlan();
    if (st.saldo - p.total < 0) return;
    st.saldo -= p.total; st.savings += p.save; st.debt -= p.pay;
    st.needs += p.needs; st.wants += p.wants; st.deposits += p.save;
    st.mHappy += p.needHappy + p.wantHappy;
    st.plan = p;
    E.sound('coin');
    hud();
    renderEvent();
  }

  /* ---------- fase 2: peristiwa tak terduga ---------- */
  function available(o) {
    return (st.saldo + (o.saldo && o.saldo < 0 ? o.saldo : 0) >= 0) && (st.savings + (o.savings && o.savings < 0 ? o.savings : 0) >= 0);
  }

  function renderEvent() {
    var ev = st.events[st.month - 1];
    var h = '<div class="panel event-card"><div class="event-ico">' + ev.icon + '</div>';
    h += '<span class="pill acc mb-2">Kejadian tak terduga</span><h3>' + E.esc(ev.title) + '</h3><p class="text-muted mb-3">' + E.esc(ev.desc) + '</p>';
    h += '<div class="mx-auto" style="max-width:560px">';
    ev.options.forEach(function (o, i) {
      var ok = available(o);
      h += '<button class="opt-btn event-opt" type="button" data-i="' + i + '"' + (ok ? '' : ' disabled') + '><span class="k">' + 'ABC'.charAt(i) + '</span><span><b>' + E.esc(o.label) + '</b>' + (ok ? '' : ' <small class="text-muted">(dana tidak cukup)</small>') + '</span></button>';
    });
    h += '</div><div id="evFeedback"></div></div>';
    $('#phase').innerHTML = h;
    Array.prototype.forEach.call(document.querySelectorAll('.event-opt'), function (b) {
      b.addEventListener('click', function () { chooseEvent(ev, parseInt(b.getAttribute('data-i'), 10)); });
    });
  }

  function chooseEvent(ev, i) {
    var o = ev.options[i];
    if (!available(o)) return;
    Array.prototype.forEach.call(document.querySelectorAll('.event-opt'), function (b) { b.disabled = true; });
    st.saldo += o.saldo || 0;
    st.savings += o.savings || 0;
    st.debt += o.debt || 0;
    if (o.payDebt) {
      var pay = Math.min(st.debt, o.payDebt);
      st.debt -= pay; st.saldo += o.payDebt - pay;
    }
    st.mHappy += o.happy || 0;
    E.sound(o.happy < 0 || o.debt ? 'bad' : 'ok');
    hud();
    $('#evFeedback').innerHTML = '<div class="explain mt-3 text-start"><b>Keputusanmu: ' + E.esc(o.label) + '</b>' + (o.note ? '<div class="mt-1">' + E.esc(o.note) + '</div>' : '') + '</div>' +
      '<div class="mt-3"><button class="btn btn-game" id="btnEndMonth" type="button">Akhiri Bulan ' + st.month + ' <i class="fa-solid fa-arrow-right ms-1"></i></button></div>';
    $('#btnEndMonth').addEventListener('click', endMonth);
  }

  /* ---------- fase 3: ringkasan bulan ---------- */
  function endMonth() {
    var hm = clamp(Math.round(st.mHappy), 0, 100);
    st.happy.push(hm);
    var interest = st.debt > 0 ? Math.round(st.debt * D.debtInterest) : 0;
    st.debt += interest; st.interest += interest;
    hud();
    var last = st.month >= D.months, p = st.plan;
    var h = '<div class="panel text-center"><h4><i class="fa-solid fa-calendar-check me-2" style="color:var(--accent)"></i>Ringkasan Bulan ' + st.month + '</h4>';
    h += '<div class="money-hud mt-3 text-start">';
    h += '<div class="m-box"><small>Kebutuhan</small><b>' + rp(p.needs) + '</b></div>';
    h += '<div class="m-box"><small>Keinginan</small><b>' + rp(p.wants) + '</b></div>';
    h += '<div class="m-box pos"><small>Ditabung</small><b>' + rp(p.save) + '</b></div>';
    h += '<div class="m-box"><small>Kebahagiaan bulan ini</small><b>' + hm + '/100</b></div></div>';
    h += '<p class="mb-1">Saldo akhir: <b>' + rp(st.saldo) + '</b> · Tabungan: <b>' + rp(st.savings) + '</b></p>';
    if (st.debt > 0) h += '<p class="warn-line mb-1"><i class="fa-solid fa-triangle-exclamation me-1"></i>Utang kini ' + rp(st.debt) + (interest ? ' (termasuk bunga ' + rp(interest) + ')' : '') + '.</p>';
    h += '<button class="btn btn-game btn-lg mt-3" id="btnNextMonth" type="button">' + (last ? 'Lihat Evaluasi Akhir <i class="fa-solid fa-flag-checkered ms-1"></i>' : 'Lanjut ke Bulan ' + (st.month + 1) + ' <i class="fa-solid fa-arrow-right ms-1"></i>') + '</button></div>';
    $('#phase').innerHTML = h;
    $('#btnNextMonth').addEventListener('click', function () { if (last) finish(); else beginMonth(false); });
  }

  /* ---------- evaluasi akhir ---------- */
  function finish() {
    G.setProgress(100);
    var avgHappy = st.happy.reduce(function (a, b) { return a + b; }, 0) / st.happy.length;
    var wealth = st.savings + Math.max(0, st.saldo) - D.startBalance;
    var saveRate = Math.max(0, wealth) / st.income;
    var wantShare = st.wants / st.income;
    var pSave = Math.round(Math.min(40, saveRate / 0.2 * 40));
    var pDebt = st.debt <= 0 ? 20 : Math.round(Math.max(0, 20 - st.debt / (D.income * 0.5) * 20));
    var pWant = wantShare <= 0.3 ? 20 : Math.round(Math.max(0, 20 - (wantShare - 0.3) / 0.3 * 20));
    var pHappy = Math.round(avgHappy / 100 * 20);
    var score = clamp(pSave + pDebt + pWant + pHappy, 0, 100);
    var net = st.savings + st.saldo - st.debt;
    var advice = [];
    if (pSave < 28) advice.push('Tingkatkan tabungan hingga sekitar 20% dari penghasilan.');
    if (pDebt < 20) advice.push('Hindari utang berbunga dan lunasi secepatnya.');
    if (pWant < 20) advice.push('Batasi keinginan maksimal sekitar 30% dari penghasilan.');
    if (pHappy < 11) advice.push('Sisihkan sedikit anggaran untuk kebutuhan dan hiburan agar tetap sejahtera.');
    if (!advice.length) advice.push('Pengelolaan keuanganmu sudah sangat baik. Pertahankan kebiasaan ini!');
    var grade = score >= 85 ? 'Perencana Handal' : score >= 70 ? 'Pengelola Baik' : score >= 50 ? 'Perlu Disiplin' : 'Waspada Keuangan';
    G.finish({
      game: 'money', runId: st.runId, score: score, max: 100, mult: 1.4,
      stars: score >= 90 ? 3 : score >= 75 ? 2 : score >= 60 ? 1 : 0,
      label: D.months + ' bulan · ' + grade,
      title: grade,
      subtitle: 'Evaluasi ' + D.months + ' bulan pengelolaan keuangan',
      details: [
        { icon: 'fa-scale-balanced', value: rp(net), label: 'Kekayaan bersih' },
        { icon: 'fa-piggy-bank', value: rp(st.savings), label: 'Tabungan akhir' },
        { icon: 'fa-hand-holding-dollar', value: rp(st.debt), label: 'Utang akhir' },
        { icon: 'fa-face-smile', value: Math.round(avgHappy) + '/100', label: 'Rata-rata kebahagiaan' }
      ],
      tips: 'Nilai: tabungan ' + pSave + '/40 · utang ' + pDebt + '/20 · keinginan ' + pWant + '/20 · kebahagiaan ' + pHappy + '/20. ' + advice.join(' '),
      replay: function () { G.show('intro'); }
    });
  }
})();
