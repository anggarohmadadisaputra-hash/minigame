<?php
$base = '../';
$pageTitle = 'WordQuest';
$pageId = 'word';
$bodyClass = 'game-word';
require __DIR__ . '/../includes/header.php';
?>
<main class="container game-wrap py-4">
    <div class="game-head">
        <a href="../dashboard.php" class="btn btn-soft btn-sm"><i class="fa-solid fa-arrow-left me-1"></i>Dashboard</a>
        <div class="game-title">
            <span class="game-ico"><i class="fa-solid fa-spell-check"></i></span>
            <div><h1>WordQuest</h1><p>Tebak kata dari petunjuk, level bertahap</p></div>
        </div>
    </div>

    <section id="intro" class="panel">
        <div class="intro-grid">
            <div>
                <h4 class="mb-3"><i class="fa-solid fa-circle-info me-2" style="color:var(--accent)"></i>Cara bermain</h4>
                <ul class="how-list">
                    <li><i class="fa-solid fa-magnifying-glass"></i><span>Baca petunjuk, lalu tebak huruf satu per satu untuk menyusun kata.</span></li>
                    <li><i class="fa-solid fa-heart"></i><span>Kamu punya <b>6 kesempatan</b> salah di setiap kata.</span></li>
                    <li><i class="fa-solid fa-lightbulb"></i><span>Butuh bantuan? Tombol <b>Hint</b> memberi petunjuk tambahan (−3 poin). Hint ke-3 membuka satu huruf.</span></li>
                    <li><i class="fa-solid fa-stairs"></i><span>Ada 6 kata dalam 3 level yang makin sulit. Keyboard fisik juga bisa dipakai.</span></li>
                </ul>
            </div>
            <div>
                <div class="opt-label">Kategori</div>
                <div class="chip-group" id="catGroup"><span class="text-muted">Memuat…</span></div>
                <button id="btnStart" class="btn btn-game btn-lg w-100 mt-4" type="button" disabled><i class="fa-solid fa-play me-2"></i>Mulai Menebak</button>
            </div>
        </div>
    </section>

    <section id="stage" class="d-none">
        <div class="hud">
            <div class="hud-item"><i class="fa-regular fa-clock"></i><span id="hudTime">00:00</span></div>
            <div class="hud-item"><i class="fa-solid fa-star"></i><span id="hudScore">0</span> poin</div>
            <div class="hud-item"><i class="fa-solid fa-stairs"></i>Level <span id="hudLevel">1</span>/3</div>
            <div class="hud-item ms-auto"><i class="fa-solid fa-font"></i>Kata <span id="hudQ">1/6</span></div>
        </div>
        <div class="progress game-progress" role="progressbar" aria-label="Progres kata"><div class="progress-bar" id="progressBar" style="width:0%"></div></div>
        <div class="panel q-card" id="wArea"></div>
    </section>

    <section id="result" class="d-none"></section>
</main>
<?php
$extraScripts = ['assets/js/wordquest.js'];
require __DIR__ . '/../includes/footer.php';
