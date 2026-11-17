<?php
$base = '../';
$pageTitle = 'EcoHero';
$pageId = 'eco';
$bodyClass = 'game-eco';
require __DIR__ . '/../includes/header.php';
?>
<main class="container game-wrap py-4">
    <div class="game-head">
        <a href="../dashboard.php" class="btn btn-soft btn-sm"><i class="fa-solid fa-arrow-left me-1"></i>Dashboard</a>
        <div class="game-title">
            <span class="game-ico"><i class="fa-solid fa-leaf"></i></span>
            <div><h1>EcoHero</h1><p>Pilah sampah, jadilah pahlawan lingkungan</p></div>
        </div>
    </div>

    <section id="intro" class="panel">
        <div class="intro-grid">
            <div>
                <h4 class="mb-3"><i class="fa-solid fa-circle-info me-2" style="color:var(--accent)"></i>Cara bermain</h4>
                <ul class="how-list">
                    <li><i class="fa-solid fa-hand"></i><span><b>Seret</b> sampah ke tempat sampah yang benar, atau cukup <b>ketuk</b> tempat sampahnya.</span></li>
                    <li><i class="fa-solid fa-leaf"></i><span><b>Organik</b>: sisa makhluk hidup. <b>Anorganik</b>: plastik, kaca, logam, kertas. <b>B3</b>: bahan berbahaya &amp; beracun.</span></li>
                    <li><i class="fa-solid fa-stopwatch"></i><span>Selesaikan misi sebelum waktu habis. Benar +10, salah −5.</span></li>
                    <li><i class="fa-solid fa-book-open"></i><span>Setiap sampah punya fakta edukasi singkat.</span></li>
                </ul>
            </div>
            <div>
                <div class="opt-label">Pilih misi</div>
                <div class="chip-group" id="missionGroup"><span class="text-muted">Memuat…</span></div>
                <div class="eco-tips mt-3"><b><i class="fa-solid fa-recycle me-1"></i>Tahukah kamu?</b>
                    <div class="small mt-1" id="introTip">Memuat…</div></div>
                <button id="btnStart" class="btn btn-game btn-lg w-100 mt-3" type="button" disabled><i class="fa-solid fa-play me-2"></i>Mulai Misi</button>
            </div>
        </div>
    </section>

    <section id="stage" class="d-none">
        <div class="hud">
            <div class="hud-item" id="hudTimeBox"><i class="fa-regular fa-clock"></i><span id="hudTime">0</span> dtk</div>
            <div class="hud-item"><i class="fa-solid fa-star"></i><span id="hudScore">0</span> poin</div>
            <div class="hud-item"><i class="fa-solid fa-fire"></i>Combo <span id="hudCombo">0</span></div>
            <div class="hud-item ms-auto"><i class="fa-solid fa-trash-can"></i>Sampah <span id="hudQ">1/8</span></div>
        </div>
        <div class="progress game-progress" role="progressbar" aria-label="Progres misi"><div class="progress-bar" id="progressBar" style="width:0%"></div></div>
        <div class="eco-stage">
            <div class="trash-area" id="trashArea"></div>
            <div class="bins" id="bins"></div>
            <div class="eco-fact" id="ecoFact">Seret sampah ke tempat yang tepat.</div>
        </div>
    </section>

    <section id="result" class="d-none"></section>
</main>
<?php
$extraScripts = ['assets/js/ecohero.js'];
require __DIR__ . '/../includes/footer.php';
