<?php
$base = '';
$pageTitle = 'Prestasi';
$pageId = 'achievements';
require __DIR__ . '/includes/header.php';
?>
<div class="app-layout">
    <?php require __DIR__ . '/includes/sidebar.php'; ?>
    <main class="app-main">
        <section class="panel-grad mb-4">
            <div class="row g-3 align-items-center position-relative" style="z-index:1">
                <div class="col-md-8">
                    <p class="eyebrow">Halaman prestasi</p>
                    <h1 class="mb-1"><span id="achXP">0</span> XP</h1>
                    <p class="mb-2 opacity-75">Level <b id="achLevel">1</b> · <span id="achTitle">Pemula</span></p>
                    <div class="progress"><div class="progress-bar" id="achBar" style="width:0%"></div></div>
                    <small class="opacity-75" id="achHint"></small>
                </div>
                <div class="col-md-4">
                    <div class="level-ring ms-md-auto" style="max-width:200px">
                        <small class="opacity-75">BADGE</small>
                        <b id="achBadgeCount" style="font-size:1.9rem">0 / 0</b>
                        <span class="fw-bold">diperoleh</span>
                    </div>
                </div>
            </div>
        </section>

        <h2 class="section-title mt-0"><i class="fa-solid fa-medal"></i> Badge</h2>
        <div class="badge-grid" id="badgeGrid"></div>

        <h2 class="section-title"><i class="fa-solid fa-ranking-star"></i> Skor Tertinggi</h2>
        <div class="row g-3" id="bestList"></div>

        <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 section-title">
            <span><i class="fa-solid fa-clock-rotate-left me-2"></i>Riwayat Permainan</span>
            <select class="form-select form-select-sm w-auto" id="historyFilter" aria-label="Filter game"></select>
        </div>
        <div class="table-wrap table-responsive" id="historyWrap">
            <table class="table align-middle">
                <thead><tr><th>Waktu</th><th>Game</th><th>Detail</th><th>Skor</th><th>Bintang</th><th class="text-end">XP</th></tr></thead>
                <tbody id="historyBody"></tbody>
            </table>
        </div>
        <div class="empty-state d-none" id="historyEmpty"><i class="fa-solid fa-ghost"></i>Belum ada riwayat permainan. <a href="dashboard.php">Mulai bermain</a> untuk mengisinya.</div>
    </main>
</div>
<?php require __DIR__ . '/includes/footer.php'; ?>
