<?php
$base = '';
$pageTitle = 'Dashboard';
$pageId = 'dashboard';
require __DIR__ . '/includes/header.php';
?>
<div class="app-layout">
    <?php require __DIR__ . '/includes/sidebar.php'; ?>
    <main class="app-main">
        <section class="panel-grad mb-4">
            <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 position-relative" style="z-index:1">
                <div>
                    <p class="eyebrow" id="dashGreeting">Halo,</p>
                    <h1 class="mb-1" id="dashName">Pemain!</h1>
                    <p class="mb-0 opacity-75">Pilih mini game dan lanjutkan petualangan belajarmu.</p>
                </div>
                <div class="level-ring">
                    <small class="opacity-75">LEVEL</small>
                    <b id="statLevel">1</b>
                    <span id="statTitle" class="fw-bold">Pemula</span>
                </div>
            </div>
            <div class="mt-4 position-relative" style="z-index:1">
                <div class="progress" role="progressbar" aria-label="Progres level"><div class="progress-bar" data-bind="levelbar" style="width:0%"></div></div>
                <small class="opacity-75" id="statLevelHint"></small>
            </div>
        </section>

        <div class="row g-3">
            <div class="col-6 col-xl-3"><div class="stat-card"><div class="s-ico s-xp"><i class="fa-solid fa-bolt"></i></div><div><b id="statXP">0</b><small>Total XP</small></div></div></div>
            <div class="col-6 col-xl-3"><div class="stat-card"><div class="s-ico s-lv"><i class="fa-solid fa-layer-group"></i></div><div><b data-bind="level">1</b><small>Level</small></div></div></div>
            <div class="col-6 col-xl-3"><div class="stat-card"><div class="s-ico s-pl"><i class="fa-solid fa-gamepad"></i></div><div><b id="statPlays">0</b><small>Total permainan</small></div></div></div>
            <div class="col-6 col-xl-3"><div class="stat-card"><div class="s-ico s-wn"><i class="fa-solid fa-trophy"></i></div><div><b id="statWins">0</b><small>Total kemenangan</small></div></div></div>
        </div>

        <div class="panel mt-3">
            <div class="d-flex justify-content-between align-items-end mb-2">
                <div><b>Progress Permainan</b><div class="small text-muted" id="overallHint"></div></div>
                <b class="fs-4" id="overallPct">0%</b>
            </div>
            <div class="progress" style="height:14px"><div class="progress-bar" id="overallBar" style="width:0%"></div></div>
        </div>

        <h2 class="section-title"><i class="fa-solid fa-gamepad"></i> Pilih Mini Game</h2>
        <div class="row g-3" id="gameGrid"></div>

        <h2 class="section-title"><i class="fa-solid fa-medal"></i> Badge Pencapaian</h2>
        <div class="badge-grid" id="badgeGrid"></div>

        <h2 class="section-title"><i class="fa-solid fa-clock-rotate-left"></i> Permainan Terakhir</h2>
        <div class="table-wrap table-responsive" id="recentWrap">
            <table class="table align-middle">
                <thead><tr><th>Waktu</th><th>Game</th><th>Detail</th><th>Skor</th><th>Bintang</th><th class="text-end">XP</th></tr></thead>
                <tbody id="recentBody"></tbody>
            </table>
        </div>
        <div class="empty-state d-none" id="recentEmpty"><i class="fa-solid fa-ghost"></i>Belum ada riwayat. Mainkan game pertamamu!</div>
    </main>
</div>

<div class="modal fade" id="nameModal" tabindex="-1" aria-labelledby="nameModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <form class="modal-content" id="nameForm">
            <div class="modal-body p-4 text-center">
                <div class="avatar xl mx-auto mb-3"><i class="fa-solid fa-user-astronaut"></i></div>
                <h4 id="nameModalLabel">Selamat datang di EduGameZone!</h4>
                <p class="text-muted">Siapa namamu? Nama ini tampil di dashboard dan disimpan di browser.</p>
                <input type="text" class="form-control form-control-lg text-center" id="nameInput" maxlength="24" placeholder="Nama tampilan" autocomplete="nickname">
                <div class="d-grid gap-2 mt-3">
                    <button class="btn btn-primary-grad btn-lg" type="submit">Mulai Petualangan</button>
                    <button class="btn btn-link text-muted" type="button" id="nameSkip">Lewati dulu</button>
                </div>
            </div>
        </form>
    </div>
</div>
<?php require __DIR__ . '/includes/footer.php'; ?>
