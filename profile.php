<?php
$base = '';
$pageTitle = 'Profil';
$pageId = 'profile';
require __DIR__ . '/includes/header.php';
?>
<div class="app-layout">
    <?php require __DIR__ . '/includes/sidebar.php'; ?>
    <main class="app-main">
        <section class="panel-grad mb-4">
            <div class="d-flex flex-wrap align-items-center gap-4 position-relative" style="z-index:1">
                <div class="avatar xl" data-bind="initial" style="background:rgba(255,255,255,.25)">P</div>
                <div class="flex-grow-1">
                    <p class="eyebrow">Profil pemain</p>
                    <h1 class="mb-1" data-bind="name">Pemain</h1>
                    <p class="mb-2 opacity-75">Level <b data-bind="level">1</b> · <span data-bind="title">Pemula</span> · <span data-bind="xp">0</span> XP</p>
                    <div class="progress" style="max-width:420px"><div class="progress-bar" id="pfBar" style="width:0%"></div></div>
                    <small class="opacity-75" id="pfHint"></small>
                </div>
            </div>
        </section>

        <div class="row g-3 mb-4">
            <div class="col-6 col-xl-3"><div class="stat-card"><div class="s-ico s-pl"><i class="fa-solid fa-gamepad"></i></div><div><b id="pfPlays">0</b><small>Permainan</small></div></div></div>
            <div class="col-6 col-xl-3"><div class="stat-card"><div class="s-ico s-wn"><i class="fa-solid fa-trophy"></i></div><div><b id="pfWins">0</b><small>Kemenangan</small></div></div></div>
            <div class="col-6 col-xl-3"><div class="stat-card"><div class="s-ico s-xp"><i class="fa-solid fa-medal"></i></div><div><b id="pfBadges">0</b><small>Badge</small></div></div></div>
            <div class="col-6 col-xl-3"><div class="stat-card"><div class="s-ico s-lv"><i class="fa-solid fa-star"></i></div><div><b id="pfStarsTotal">0</b><small>Bintang terbaik</small></div></div></div>
        </div>

        <div class="row g-4">
            <div class="col-lg-6">
                <div class="panel h-100">
                    <h5 class="mb-3"><i class="fa-solid fa-id-card me-2 text-primary"></i>Data Pemain</h5>
                    <form id="pfForm">
                        <label class="form-label fw-bold" for="pfInput">Nama tampilan</label>
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" id="pfInput" maxlength="24" required>
                            <button class="btn btn-primary-grad" type="submit">Simpan</button>
                        </div>
                    </form>
                    <p class="text-muted mb-1"><i class="fa-solid fa-calendar me-2"></i>Bergabung sejak <b id="pfSince">-</b></p>
                    <p class="text-muted"><i class="fa-solid fa-hard-drive me-2"></i>Data tersimpan di browser ini (LocalStorage).</p>
                    <div class="d-flex flex-wrap gap-2">
                        <button class="btn btn-soft" id="pfExport" type="button"><i class="fa-solid fa-download me-1"></i>Ekspor Cadangan</button>
                        <a class="btn btn-soft" href="settings.php"><i class="fa-solid fa-gear me-1"></i>Pengaturan</a>
                        <a class="btn btn-soft" href="achievements.php"><i class="fa-solid fa-trophy me-1"></i>Prestasi</a>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="panel h-100">
                    <h5 class="mb-3"><i class="fa-solid fa-chart-simple me-2 text-primary"></i>Progres per Game</h5>
                    <div id="pfGames"></div>
                </div>
            </div>
        </div>
    </main>
</div>
<?php require __DIR__ . '/includes/footer.php'; ?>
