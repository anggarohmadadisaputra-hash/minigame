<nav class="navbar navbar-expand-lg egz-nav sticky-top">
    <div class="container-xl">
        <a class="navbar-brand d-flex align-items-center gap-2" href="<?= $base ?>index.php">
            <img src="<?= $base ?>assets/icons/logo.svg" width="34" height="34" alt="">
            <span class="brand-text">Edu<b>GameZone</b></span>
        </a>
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Menu">
            <i class="fa-solid fa-bars"></i>
        </button>
        <div class="collapse navbar-collapse" id="mainNav">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
                <li class="nav-item"><a class="nav-link <?= $pageId === 'landing' ? 'active' : '' ?>" href="<?= $base ?>index.php"><i class="fa-solid fa-house me-1"></i>Beranda</a></li>
                <li class="nav-item"><a class="nav-link <?= $pageId === 'dashboard' ? 'active' : '' ?>" href="<?= $base ?>dashboard.php"><i class="fa-solid fa-gauge-high me-1"></i>Dashboard</a></li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle <?= isset($GAMES[$pageId]) ? 'active' : '' ?>" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa-solid fa-gamepad me-1"></i>Game</a>
                    <ul class="dropdown-menu egz-dropdown">
                        <?php foreach ($GAMES as $key => $g): ?>
                            <li><a class="dropdown-item" href="<?= $base . $g['file'] ?>"><i class="fa-solid <?= $g['icon'] ?> me-2"></i><?= $g['name'] ?> <small class="text-muted">· <?= $g['tag'] ?></small></a></li>
                        <?php endforeach; ?>
                    </ul>
                </li>
                <li class="nav-item"><a class="nav-link <?= $pageId === 'achievements' ? 'active' : '' ?>" href="<?= $base ?>achievements.php"><i class="fa-solid fa-trophy me-1"></i>Prestasi</a></li>
                <li class="nav-item"><a class="nav-link <?= $pageId === 'settings' ? 'active' : '' ?>" href="<?= $base ?>settings.php"><i class="fa-solid fa-gear me-1"></i>Pengaturan</a></li>
            </ul>
            <div class="d-flex align-items-center gap-2">
                <a href="<?= $base ?>profile.php" class="nav-chip text-decoration-none" title="Profil">
                    <i class="fa-solid fa-user-astronaut"></i>
                    <span data-bind="name">Pemain</span>
                    <span class="chip-xp" id="navChip">Lv 1 · 0 XP</span>
                </a>
                <button class="btn btn-icon" id="themeToggle" type="button" aria-label="Ganti tema"><i class="fa-solid fa-moon"></i></button>
            </div>
        </div>
    </div>
</nav>
