<aside class="sidebar">
    <div class="sb-profile">
        <div class="avatar" data-bind="initial">P</div>
        <div class="flex-grow-1">
            <div class="fw-bold" data-bind="name">Pemain</div>
            <div class="small text-muted">Lv <span data-bind="level">1</span> · <span data-bind="title">Pemula</span></div>
        </div>
    </div>
    <div class="progress sb-bar" role="progressbar" aria-label="Progres level"><div class="progress-bar" data-bind="levelbar" style="width:0%"></div></div>
    <div class="small text-muted mb-3"><span data-bind="xp">0</span> XP total</div>

    <div class="sb-title">Menu</div>
    <a class="sb-link <?= $pageId === 'dashboard' ? 'active' : '' ?>" href="<?= $base ?>dashboard.php"><i class="fa-solid fa-gauge-high"></i> Dashboard</a>
    <a class="sb-link <?= $pageId === 'achievements' ? 'active' : '' ?>" href="<?= $base ?>achievements.php"><i class="fa-solid fa-trophy"></i> Prestasi</a>
    <a class="sb-link <?= $pageId === 'profile' ? 'active' : '' ?>" href="<?= $base ?>profile.php"><i class="fa-solid fa-user"></i> Profil</a>
    <a class="sb-link <?= $pageId === 'settings' ? 'active' : '' ?>" href="<?= $base ?>settings.php"><i class="fa-solid fa-gear"></i> Pengaturan</a>

    <div class="sb-title mt-3">Mini Game</div>
    <?php foreach ($GAMES as $key => $g): ?>
        <a class="sb-link sb-<?= $key ?>" href="<?= $base . $g['file'] ?>"><i class="fa-solid <?= $g['icon'] ?>"></i> <?= $g['name'] ?></a>
    <?php endforeach; ?>
</aside>
