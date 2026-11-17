<?php
$base = '../';
$pageTitle = 'CodeAdventure';
$pageId = 'code';
$bodyClass = 'game-code';
require __DIR__ . '/../includes/header.php';
?>
<main class="container game-wrap py-4">
    <div class="game-head">
        <a href="../dashboard.php" class="btn btn-soft btn-sm"><i class="fa-solid fa-arrow-left me-1"></i>Dashboard</a>
        <div class="game-title">
            <span class="game-ico"><i class="fa-solid fa-code"></i></span>
            <div><h1>CodeAdventure</h1><p>Belajar dasar pemrograman PHP lewat tantangan</p></div>
        </div>
    </div>

    <section id="intro" class="panel">
        <div class="intro-grid">
            <div>
                <h4 class="mb-3"><i class="fa-solid fa-circle-info me-2" style="color:var(--accent)"></i>Cara bermain</h4>
                <ul class="how-list">
                    <li><i class="fa-solid fa-arrow-down-1-9"></i><span><b>Susun kode</b>: klik baris kode sesuai urutan yang benar.</span></li>
                    <li><i class="fa-solid fa-terminal"></i><span><b>Tebak output</b> potongan kode PHP.</span></li>
                    <li><i class="fa-solid fa-bug"></i><span><b>Perbaiki bug</b> sederhana dan selesaikan soal <b>logika</b>.</span></li>
                    <li><i class="fa-solid fa-book"></i><span>Materi: variabel, tipe data, percabangan, dan perulangan.</span></li>
                </ul>
            </div>
            <div>
                <div class="opt-label">Level</div>
                <div class="chip-group">
                    <input type="radio" class="chip-radio" name="level" id="lv-pemula" value="pemula" checked><label for="lv-pemula"><i class="fa-solid fa-seedling"></i>Pemula</label>
                    <input type="radio" class="chip-radio" name="level" id="lv-menengah" value="menengah"><label for="lv-menengah"><i class="fa-solid fa-fire"></i>Menengah</label>
                </div>
                <button id="btnStart" class="btn btn-game btn-lg w-100 mt-4" type="button" disabled><i class="fa-solid fa-play me-2"></i>Mulai Petualangan</button>
            </div>
        </div>
    </section>

    <section id="stage" class="d-none">
        <div class="hud">
            <div class="hud-item"><i class="fa-solid fa-star"></i><span id="hudScore">0</span> poin</div>
            <div class="hud-item"><i class="fa-solid fa-circle-check"></i><span id="hudOk">0</span> benar</div>
            <div class="hud-item ms-auto"><i class="fa-solid fa-list-ol"></i>Tantangan <span id="hudQ">1/6</span></div>
        </div>
        <div class="progress game-progress" role="progressbar" aria-label="Progres tantangan"><div class="progress-bar" id="progressBar" style="width:0%"></div></div>
        <div class="panel q-card" id="cArea"></div>
    </section>

    <section id="result" class="d-none"></section>
</main>
<?php
$extraScripts = ['assets/js/codeadventure.js'];
require __DIR__ . '/../includes/footer.php';
