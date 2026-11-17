<?php
$base = '../';
$pageTitle = 'SmartMoney';
$pageId = 'money';
$bodyClass = 'game-money';
require __DIR__ . '/../includes/header.php';
?>
<main class="container game-wrap py-4">
    <div class="game-head">
        <a href="../dashboard.php" class="btn btn-soft btn-sm"><i class="fa-solid fa-arrow-left me-1"></i>Dashboard</a>
        <div class="game-title">
            <span class="game-ico"><i class="fa-solid fa-wallet"></i></span>
            <div><h1>SmartMoney</h1><p>Simulasi mengelola uang selama 6 bulan</p></div>
        </div>
    </div>

    <section id="intro" class="panel">
        <div class="intro-grid">
            <div>
                <h4 class="mb-3"><i class="fa-solid fa-circle-info me-2" style="color:var(--accent)"></i>Cara bermain</h4>
                <ul class="how-list">
                    <li><i class="fa-solid fa-coins"></i><span>Setiap bulan kamu menerima gaji virtual dan harus menyusun anggaran.</span></li>
                    <li><i class="fa-solid fa-cart-shopping"></i><span>Pilih <b>kebutuhan</b> (hemat atau standar), <b>keinginan</b> yang mau dibeli, dan jumlah <b>tabungan</b>.</span></li>
                    <li><i class="fa-solid fa-bolt"></i><span>Peristiwa tak terduga akan muncul. Tabungan darurat sangat membantu!</span></li>
                    <li><i class="fa-solid fa-chart-pie"></i><span>Di akhir bulan ke-6 kamu mendapat <b>evaluasi</b> pengelolaan keuangan (tabungan, utang, keinginan, kebahagiaan).</span></li>
                </ul>
            </div>
            <div>
                <div class="eco-tips" style="background:rgba(234,179,8,.1);border-color:rgba(234,179,8,.45)">
                    <b><i class="fa-solid fa-lightbulb me-1" style="color:var(--accent)"></i>Tips keuangan</b>
                    <ul class="mb-0 mt-2 ps-3" id="introTips"><li>Memuat…</li></ul>
                </div>
                <button id="btnStart" class="btn btn-game btn-lg w-100 mt-4" type="button" disabled><i class="fa-solid fa-play me-2"></i>Mulai Simulasi</button>
            </div>
        </div>
    </section>

    <section id="stage" class="d-none">
        <div class="money-hud">
            <div class="m-box"><small><i class="fa-regular fa-calendar"></i>Bulan</small><b id="mMonth">1/6</b></div>
            <div class="m-box"><small><i class="fa-solid fa-wallet"></i>Saldo</small><b id="mSaldo">Rp 0</b></div>
            <div class="m-box pos"><small><i class="fa-solid fa-piggy-bank"></i>Tabungan</small><b id="mSave">Rp 0</b></div>
            <div class="m-box" id="mDebtBox"><small><i class="fa-solid fa-hand-holding-dollar"></i>Utang</small><b id="mDebt">Rp 0</b></div>
            <div class="m-box"><small><i class="fa-solid fa-face-smile"></i>Kebahagiaan</small><b id="mHappy">50</b></div>
        </div>
        <div class="progress game-progress" role="progressbar" aria-label="Progres bulan"><div class="progress-bar" id="progressBar" style="width:0%"></div></div>
        <div id="phase"></div>
    </section>

    <section id="result" class="d-none"></section>
</main>
<?php
$extraScripts = ['assets/js/smartmoney.js'];
require __DIR__ . '/../includes/footer.php';
