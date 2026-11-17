<?php
/**
 * EduGameZone - header.php
 * Variabel yang bisa di-set sebelum include: $base, $pageTitle, $pageId, $bodyClass
 */
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if (!isset($_SESSION['started_at'])) {
    $_SESSION['started_at'] = time();
}
$_SESSION['page_views'] = isset($_SESSION['page_views']) ? $_SESSION['page_views'] + 1 : 1;

$base      = isset($base) ? $base : '';
$pageTitle = isset($pageTitle) ? $pageTitle : 'EduGameZone';
$pageId    = isset($pageId) ? $pageId : '';
$bodyClass = isset($bodyClass) ? $bodyClass : '';

/* Daftar mini game (dipakai landing page & navbar). Kunci harus sama dengan storage.js */
$GAMES = [
    'quiz'  => ['name' => 'QuizMaster',    'tag' => 'Kuis Pengetahuan',      'icon' => 'fa-brain',       'file' => 'games/quizmaster.php',
                'desc' => 'Kuis pilihan ganda dengan timer, level Easy–Hard, dan pembahasan di setiap jawaban.'],
    'word'  => ['name' => 'WordQuest',     'tag' => 'Tebak Kata',            'icon' => 'fa-spell-check', 'file' => 'games/wordquest.php',
                'desc' => 'Tebak kata dari petunjuk. Gunakan hint dengan bijak dan jaga kesempatanmu.'],
    'match' => ['name' => 'MatchIt',       'tag' => 'Mencocokkan Pasangan',  'icon' => 'fa-puzzle-piece','file' => 'games/matchit.php',
                'desc' => 'Seret definisi ke gambar yang tepat. Cepat dan teliti untuk meraih 3 bintang.'],
    'code'  => ['name' => 'CodeAdventure', 'tag' => 'Belajar Pemrograman',   'icon' => 'fa-code',        'file' => 'games/codeadventure.php',
                'desc' => 'Susun kode, tebak output PHP, selesaikan logika, dan perbaiki bug sederhana.'],
    'money' => ['name' => 'SmartMoney',    'tag' => 'Simulasi Keuangan',     'icon' => 'fa-wallet',      'file' => 'games/smartmoney.php',
                'desc' => 'Kelola uang virtual selama 6 bulan: anggaran, kebutuhan vs keinginan, dan kejutan.'],
    'eco'   => ['name' => 'EcoHero',       'tag' => 'Edukasi Lingkungan',    'icon' => 'fa-leaf',        'file' => 'games/ecohero.php',
                'desc' => 'Pilah sampah organik, anorganik, dan B3 dalam misi menjaga lingkungan.'],
];
?>
<!DOCTYPE html>
<html lang="id" data-theme="light" data-bs-theme="light">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= htmlspecialchars($pageTitle) ?> · EduGameZone</title>
    <link rel="icon" type="image/svg+xml" href="<?= $base ?>assets/icons/logo.svg">
    <link rel="stylesheet" href="<?= $base ?>assets/vendor/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="<?= $base ?>assets/vendor/fontawesome/css/all.min.css">
    <link rel="stylesheet" href="<?= $base ?>assets/css/style.css">
    <link rel="stylesheet" href="<?= $base ?>assets/css/games.css">
    <script>window.EGZ_BASE = <?= json_encode($base) ?>;</script>
    <script src="<?= $base ?>assets/js/storage.js"></script>
    <script>EGZ.applyTheme();</script>
</head>
<body class="<?= htmlspecialchars($bodyClass) ?>" data-page="<?= htmlspecialchars($pageId) ?>">
<?php require __DIR__ . '/navbar.php'; ?>
