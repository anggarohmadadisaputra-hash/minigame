<?php
$base = '';
$pageTitle = 'Platform Mini Game Edukasi Interaktif';
$pageId = 'landing';
require __DIR__ . '/includes/header.php';
?>
<div class="landing">
<section class="hero">
    <div class="container-xl">
        <div class="row align-items-center g-4">
            <div class="col-lg-6">
                <span class="hero-chip mb-3" id="heroChip"><i class="fa-solid fa-sparkles text-warning"></i> 6 mini game · XP · Badge · 100% offline</span>
                <h1 class="mt-3">Belajar jadi <span class="grad">seru</span>, main sambil naik level.</h1>
                <p class="lead text-muted mt-3">EduGameZone menggabungkan enam mini game edukasi dalam satu platform: kuis, tebak kata, mencocokkan pasangan, pemrograman, simulasi keuangan, dan edukasi lingkungan.</p>
                <div class="d-flex flex-wrap gap-2 mt-4">
                    <a href="dashboard.php" id="heroCta" class="btn btn-primary-grad btn-lg"><i class="fa-solid fa-play me-2"></i>Mulai Bermain</a>
                    <a href="#games" class="btn btn-soft btn-lg"><i class="fa-solid fa-gamepad me-2"></i>Lihat Game</a>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="hero-visual" aria-hidden="true">
                    <div class="float-card"><i class="fa-solid fa-brain"></i><b>QuizMaster</b><small>Uji pengetahuan</small></div>
                    <div class="float-card"><i class="fa-solid fa-spell-check"></i><b>WordQuest</b><small>Tebak kata</small></div>
                    <div class="float-card"><i class="fa-solid fa-puzzle-piece"></i><b>MatchIt</b><small>Cocokkan pasangan</small></div>
                    <div class="float-card"><i class="fa-solid fa-code"></i><b>CodeAdventure</b><small>Belajar PHP</small></div>
                    <div class="float-card"><i class="fa-solid fa-wallet"></i><b>SmartMoney</b><small>Atur keuangan</small></div>
                    <div class="float-card"><i class="fa-solid fa-leaf"></i><b>EcoHero</b><small>Pilah sampah</small></div>
                </div>
            </div>
        </div>
        <div class="stat-strip mt-4">
            <div><b>6</b><small class="text-muted">Mini game</small></div>
            <div><b>0</b><small class="text-muted">Database</small></div>
            <div><b>10</b><small class="text-muted">Badge pencapaian</small></div>
            <div><b>100%</b><small class="text-muted">Berjalan lokal</small></div>
        </div>
    </div>
</section>

<section class="py-5" id="games">
    <div class="container-xl">
        <div class="text-center mb-4">
            <p class="eyebrow text-primary">Pilih petualanganmu</p>
            <h2>Enam Mini Game, Satu Platform</h2>
            <p class="text-muted">Setiap game punya mekanisme dan identitas visualnya sendiri.</p>
        </div>
        <div class="row g-4">
            <?php foreach ($GAMES as $key => $g): ?>
                <div class="col-md-6 col-xl-4">
                    <a class="game-card gc-<?= $key ?>" href="<?= $g['file'] ?>">
                        <div class="gc-top">
                            <div class="gc-ico"><i class="fa-solid <?= $g['icon'] ?>"></i></div>
                        </div>
                        <h3><?= $g['name'] ?></h3>
                        <p class="gc-tag"><?= $g['tag'] ?></p>
                        <p class="gc-desc"><?= $g['desc'] ?></p>
                        <div class="gc-foot"><small>Gratis · tanpa login</small><span class="gc-play">Main sekarang <i class="fa-solid fa-arrow-right"></i></span></div>
                    </a>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<section class="py-5">
    <div class="container-xl">
        <div class="text-center mb-4">
            <p class="eyebrow text-primary">Kenapa EduGameZone?</p>
            <h2>Dirancang untuk belajar yang menyenangkan</h2>
        </div>
        <div class="row g-4">
            <?php
            $features = [
                ['fa-bolt', 'XP & Level', 'Setiap permainan menambah XP. Naik level otomatis dan raih gelar baru.'],
                ['fa-medal', 'Badge Pencapaian', '10 badge menanti: First Play, Master Quiz, Eco Warrior, dan lainnya.'],
                ['fa-floppy-disk', 'Progres Tersimpan', 'Data disimpan di LocalStorage browser. Tidak hilang saat pindah halaman atau browser ditutup.'],
                ['fa-file-export', 'Backup JSON', 'Ekspor dan impor progres ke file JSON kapan saja sebagai cadangan.'],
                ['fa-mobile-screen', 'Responsif', 'Nyaman dimainkan di laptop, tablet, maupun ponsel.'],
                ['fa-wifi', 'Bisa Offline', 'Seluruh aset (Bootstrap, ikon) tersedia lokal. Cukup jalankan Apache XAMPP.'],
            ];
            foreach ($features as $f): ?>
                <div class="col-md-6 col-lg-4">
                    <div class="feature">
                        <div class="f-ico"><i class="fa-solid <?= $f[0] ?>"></i></div>
                        <h5><?= $f[1] ?></h5>
                        <p class="text-muted mb-0"><?= $f[2] ?></p>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<section class="py-5">
    <div class="container-xl">
        <div class="row g-4 text-center">
            <div class="col-md-4"><div class="step-num mx-auto">1</div><h5>Pilih game</h5><p class="text-muted">Buka dashboard dan pilih mini game favoritmu.</p></div>
            <div class="col-md-4"><div class="step-num mx-auto">2</div><h5>Mainkan &amp; belajar</h5><p class="text-muted">Jawab, seret, susun, dan kelola sesuai tantangan.</p></div>
            <div class="col-md-4"><div class="step-num mx-auto">3</div><h5>Kumpulkan XP</h5><p class="text-muted">Naik level, buka badge, dan pecahkan skor tertinggi.</p></div>
        </div>
        <div class="cta-band mt-5">
            <h2 class="mb-2">Siap naik level?</h2>
            <p class="mb-3 opacity-75">Tidak perlu daftar. Langsung main dan progresmu tersimpan otomatis.</p>
            <a href="dashboard.php" class="btn btn-light btn-lg text-primary"><i class="fa-solid fa-rocket me-2"></i>Buka Dashboard</a>
        </div>
    </div>
</section>
</div>
<?php require __DIR__ . '/includes/footer.php'; ?>
