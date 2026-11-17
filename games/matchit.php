<?php
$base = '../';
$pageTitle = 'MatchIt';
$pageId = 'match';
$bodyClass = 'game-match';
require __DIR__ . '/../includes/header.php';
?>
<main class="container game-wrap py-4">
    <div class="game-head">
        <a href="../dashboard.php" class="btn btn-soft btn-sm"><i class="fa-solid fa-arrow-left me-1"></i>Dashboard</a>
        <div class="game-title">
            <span class="game-ico"><i class="fa-solid fa-puzzle-piece"></i></span>
            <div><h1>MatchIt</h1><p>Seret definisi ke gambar yang tepat</p></div>
        </div>
    </div>

    <section id="intro" class="panel">
        <div class="intro-grid">
            <div>
                <h4 class="mb-3"><i class="fa-solid fa-circle-info me-2" style="color:var(--accent)"></i>Cara bermain</h4>
                <ul class="how-list">
                    <li><i class="fa-solid fa-hand"></i><span><b>Seret</b> kartu definisi ke gambar yang cocok. Di layar sentuh, <b>ketuk</b> kartu lalu ketuk gambarnya.</span></li>
                    <li><i class="fa-solid fa-stopwatch"></i><span>Waktu dan jumlah kesalahan dihitung.</span></li>
                    <li><i class="fa-solid fa-star"></i><span>Sedikit salah = lebih banyak bintang. Raih <b>3 bintang</b> dengan maksimal 1 kesalahan.</span></li>
                </ul>
            </div>
            <div>
                <div class="opt-label">Tema</div>
                <div class="chip-group" id="setGroup"><span class="text-muted">Memuat…</span></div>
                <div class="opt-label">Tingkat kesulitan</div>
                <div class="chip-group">
                    <input type="radio" class="chip-radio" name="level" id="lv-easy" value="easy" checked><label for="lv-easy">Mudah · 4 pasang</label>
                    <input type="radio" class="chip-radio" name="level" id="lv-medium" value="medium"><label for="lv-medium">Sedang · 6 pasang</label>
                    <input type="radio" class="chip-radio" name="level" id="lv-hard" value="hard"><label for="lv-hard">Sulit · 8 pasang</label>
                </div>
                <button id="btnStart" class="btn btn-game btn-lg w-100 mt-4" type="button" disabled><i class="fa-solid fa-play me-2"></i>Mulai Mencocokkan</button>
            </div>
        </div>
    </section>

    <section id="stage" class="d-none">
        <div class="hud">
            <div class="hud-item"><i class="fa-regular fa-clock"></i><span id="hudTime">00:00</span></div>
            <div class="hud-item"><i class="fa-solid fa-circle-xmark"></i><span id="hudErr">0</span> salah</div>
            <div class="hud-item"><i class="fa-solid fa-star"></i><span id="hudScore">0</span> poin</div>
            <div class="hud-item ms-auto"><i class="fa-solid fa-link"></i>Cocok <span id="hudQ">0/4</span></div>
        </div>
        <div class="progress game-progress" role="progressbar" aria-label="Progres pasangan"><div class="progress-bar" id="progressBar" style="width:0%"></div></div>
        <div class="match-grid">
            <div class="match-col"><h3><i class="fa-solid fa-image me-1"></i>Gambar</h3><div id="zones"></div></div>
            <div class="match-col"><h3><i class="fa-solid fa-align-left me-1"></i>Definisi</h3><div id="defs"></div></div>
        </div>
    </section>

    <section id="result" class="d-none"></section>
</main>
<?php
$extraScripts = ['assets/js/matchit.js'];
require __DIR__ . '/../includes/footer.php';
