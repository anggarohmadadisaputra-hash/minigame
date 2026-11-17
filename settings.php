<?php
$base = '';
$pageTitle = 'Pengaturan';
$pageId = 'settings';
require __DIR__ . '/includes/header.php';
?>
<div class="app-layout">
    <?php require __DIR__ . '/includes/sidebar.php'; ?>
    <main class="app-main">
        <h1 class="mb-1">Pengaturan</h1>
        <p class="text-muted mb-4">Atur tampilan, suara, dan data progresmu.</p>

        <div class="row g-4">
            <div class="col-lg-6">
                <div class="panel h-100">
                    <h5 class="mb-3"><i class="fa-solid fa-user-pen me-2 text-primary"></i>Nama Tampilan</h5>
                    <form id="setNameForm" class="input-group">
                        <input type="text" class="form-control" id="setName" maxlength="24" required aria-label="Nama tampilan">
                        <button class="btn btn-primary-grad" type="submit">Simpan</button>
                    </form>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="panel h-100">
                    <h5 class="mb-3"><i class="fa-solid fa-volume-high me-2 text-primary"></i>Suara Permainan</h5>
                    <div class="form-check form-switch fs-5">
                        <input class="form-check-input" type="checkbox" role="switch" id="setSound">
                        <label class="form-check-label" for="setSound">Efek suara</label>
                    </div>
                    <small class="text-muted">Efek dibuat langsung oleh browser, tanpa file audio.</small>
                </div>
            </div>
            <div class="col-12">
                <div class="panel">
                    <h5 class="mb-3"><i class="fa-solid fa-palette me-2 text-primary"></i>Tema Tampilan</h5>
                    <div class="row g-3">
                        <div class="col-sm-6">
                            <input type="radio" class="d-none" name="theme" id="themeLight" value="light">
                            <label class="theme-opt w-100" for="themeLight"><i class="fa-solid fa-sun text-warning fs-4"></i> Terang</label>
                        </div>
                        <div class="col-sm-6">
                            <input type="radio" class="d-none" name="theme" id="themeDark" value="dark">
                            <label class="theme-opt w-100" for="themeDark"><i class="fa-solid fa-moon text-primary fs-4"></i> Gelap</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <div class="panel">
                    <h5 class="mb-1"><i class="fa-solid fa-floppy-disk me-2 text-primary"></i>Cadangan Progres</h5>
                    <p class="text-muted">Simpan progres ke file JSON, atau pulihkan dari cadangan sebelumnya (misalnya saat pindah browser).</p>
                    <div class="d-flex flex-wrap gap-2">
                        <button class="btn btn-primary-grad" type="button" id="btnExport"><i class="fa-solid fa-download me-1"></i>Ekspor Progres (.json)</button>
                        <label class="btn btn-soft mb-0" for="fileImport"><i class="fa-solid fa-upload me-1"></i>Impor Progres</label>
                        <input type="file" id="fileImport" accept=".json,application/json" class="d-none">
                    </div>
                </div>
            </div>
            <div class="col-12">
                <div class="danger-zone">
                    <h5 class="text-danger"><i class="fa-solid fa-triangle-exclamation me-2"></i>Zona Berbahaya</h5>
                    <p class="mb-3">Reset akan menghapus seluruh XP, level, badge, skor, dan riwayat. Tindakan ini tidak dapat dibatalkan. Ekspor cadangan terlebih dahulu bila perlu.</p>
                    <button class="btn btn-danger" type="button" id="btnReset"><i class="fa-solid fa-trash-can me-1"></i>Reset Seluruh Progres</button>
                </div>
            </div>
        </div>
    </main>
</div>

<div class="modal fade" id="resetModal" tabindex="-1" aria-labelledby="resetLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title text-danger" id="resetLabel"><i class="fa-solid fa-triangle-exclamation me-2"></i>Reset progres?</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup"></button>
            </div>
            <div class="modal-body">
                <p>Seluruh data permainan akan dihapus permanen. Ketik <b>RESET</b> untuk melanjutkan.</p>
                <input type="text" class="form-control" id="resetConfirmInput" placeholder="Ketik RESET" autocomplete="off">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-soft" data-bs-dismiss="modal">Batal</button>
                <button type="button" class="btn btn-danger" id="confirmReset" disabled>Ya, hapus semua</button>
            </div>
        </div>
    </div>
</div>
<?php require __DIR__ . '/includes/footer.php'; ?>
