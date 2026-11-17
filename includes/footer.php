<footer class="site-footer">
    <div class="container-xl d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
        <div><img src="<?= $base ?>assets/icons/logo.svg" width="22" height="22" alt="" class="me-1"> <b>EduGameZone</b> · Platform Mini Game Edukasi Interaktif</div>
        <div class="small text-muted">Progres tersimpan di browser (LocalStorage) · Tanpa database · &copy; <?= date('Y') ?></div>
    </div>
</footer>

<script src="<?= $base ?>assets/vendor/bootstrap/bootstrap.bundle.min.js"></script>
<script src="<?= $base ?>assets/js/main.js"></script>
<?php
if (isset($extraScripts) && is_array($extraScripts)) {
    foreach ($extraScripts as $src) {
        echo '<script src="' . $base . htmlspecialchars($src) . '"></script>' . "\n";
    }
}
?>
</body>
</html>
