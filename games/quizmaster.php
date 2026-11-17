<?php
$base = '../';
$pageTitle = 'QuizMaster';
$pageId = 'quiz';
$bodyClass = 'game-quiz';
require __DIR__ . '/../includes/header.php';
?>
<main class="container game-wrap py-4">
    <div class="game-head">
        <a href="../dashboard.php" class="btn btn-soft btn-sm"><i class="fa-solid fa-arrow-left me-1"></i>Dashboard</a>
        <div class="game-title">
            <span class="game-ico"><i class="fa-solid fa-brain"></i></span>
            <div><h1>QuizMaster</h1><p>Kuis pengetahuan dengan timer dan pembahasan</p></div>
        </div>
    </div>

    <section id="intro" class="panel">
        <div class="intro-grid">
            <div>
                <h4 class="mb-3"><i class="fa-solid fa-circle-info me-2" style="color:var(--accent)"></i>Cara bermain</h4>
                <ul class="how-list">
                    <li><i class="fa-solid fa-check"></i><span>Pilih kategori dan level, lalu jawab 5 soal pilihan ganda.</span></li>
                    <li><i class="fa-solid fa-stopwatch"></i><span>Setiap soal punya batas waktu. Makin cepat menjawab, makin besar bonus poin.</span></li>
                    <li><i class="fa-solid fa-lightbulb"></i><span>Setelah menjawab, baca pembahasan untuk memahami jawabannya.</span></li>
                    <li><i class="fa-solid fa-keyboard"></i><span>Tips: tekan tombol <b>1–4</b> atau <b>A–D</b> di keyboard untuk menjawab cepat.</span></li>
                </ul>
            </div>
            <div>
                <div class="opt-label">Kategori</div>
                <div class="chip-group" id="catGroup"><span class="text-muted">Memuat…</span></div>
                <div class="opt-label">Level</div>
                <div class="chip-group">
                    <input type="radio" class="chip-radio" name="level" id="lv-easy" value="easy" checked><label for="lv-easy"><i class="fa-solid fa-seedling"></i>Easy</label>
                    <input type="radio" class="chip-radio" name="level" id="lv-medium" value="medium"><label for="lv-medium"><i class="fa-solid fa-fire"></i>Medium</label>
                    <input type="radio" class="chip-radio" name="level" id="lv-hard" value="hard"><label for="lv-hard"><i class="fa-solid fa-skull"></i>Hard</label>
                </div>
                <button id="btnStart" class="btn btn-game btn-lg w-100 mt-4" type="button" disabled><i class="fa-solid fa-play me-2"></i>Mulai Kuis</button>
            </div>
        </div>
    </section>

    <section id="stage" class="d-none">
        <div class="hud">
            <div class="hud-item" id="hudTimeBox"><i class="fa-regular fa-clock"></i><span id="hudTime">0</span> dtk</div>
            <div class="hud-item"><i class="fa-solid fa-star"></i><span id="hudScore">0</span> poin</div>
            <div class="hud-item ms-auto"><i class="fa-solid fa-list-ol"></i>Soal <span id="hudQ">1/5</span></div>
        </div>
        <div class="progress game-progress" role="progressbar" aria-label="Progres kuis"><div class="progress-bar" id="progressBar" style="width:0%"></div></div>
        <div id="qArea"></div>
    </section>

    <section id="result" class="d-none"></section>
</main>
<?php
$extraScripts = ['assets/js/quizmaster.js'];
require __DIR__ . '/../includes/footer.php';
