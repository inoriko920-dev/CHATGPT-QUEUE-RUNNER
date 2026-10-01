# RECOVERY_NOTES — ChatGPT Queue Runner — Recovery R0

Tanggal: 2026-10-01
Status keputusan Chat 5: **R0 COMPLETE WITH LOCAL BACKUP PENDING**

## Integrasi yang dilakukan

Recovery diintegrasikan sesuai urutan assignment dan berdasarkan evidence, bukan tebakan:

1. Chat 1 / source — PR #5 — rescue `extensions.zip` diimpor apa adanya ke `extensions/**`.
2. Chat 2 / history-docs — PR #4 — sejarah, arsitektur, commit lama, status fitur, dan bukti branch lama dipulihkan sebagai dokumentasi.
3. Chat 3 / test-build — PR #1 — rencana/evidence test dipulihkan tanpa mengubah core source.
4. Chat 4 / backup-resilience — PR #3 — policy dan tooling backup ditambahkan; backup proyek nyata tetap `BACKUP_LOCAL_PENDING`.

Tidak ada speculative rewrite yang dimasukkan sebagai source asli.

## Source R0

Core R0 adalah baseline lama **v0.1.8**, bukan hardening v0.2.0.

Evidence source:

- rescue SHA-256: `f46767d61dff61c2b0ce7dc413fc7dbe29f78d0029c17a2259d54bd96c5ddd56`;
- rescue: 80 file, 10 runner × 8 file;
- Git tree `extensions/` hasil import: `7472f665bb302b673f2c35dd958ca8f040270fa5`;
- Git tree `extensions/` old main commit `7bcfbf7cdfa87303f21d5f979796200880e355ae`: SHA yang sama, sehingga 80 file rescue terbukti identik dengan old main `extensions/`;
- file ke-81 pada tree audit lama adalah root `README.md`, blob `1e232dd8b29704fc18a37ac156ebd32a4a0b8e94`, dan dipulihkan langsung dari old main — bukan direkonstruksi.

Dengan itu mismatch historis 81 vs 80 sudah direkonsiliasi: **80 file `extensions/` + 1 root README = 81 file**.

## Old v0.2.0

Repo lama masih dapat dibaca dan mempunyai branch unmerged:

- `fix/astra-b01-b19-runner-reliability`
- head `a36e4b74645d8c98a1ed9c7a5db4dbd3d3586d98`
- PR lama #1 masih open dan tidak merged ke old main.

Source/test v0.2.0 ini bernilai tinggi dan telah didokumentasikan sebagai `VERIFIED_OLD_SOURCE / VERIFIED_OLD_TEST (UNMERGED)`, tetapi **tidak dicampur ke R0 v0.1.8**.

## Validation R0

Validasi yang benar-benar dijalankan terhadap rescue authoritative yang tree-nya identik dengan `extensions/` R0:

- SHA-256 rescue: PASS;
- jumlah file source: 80 PASS;
- JavaScript: 40 file;
- `node --check`: 40 PASS, 0 FAIL dengan Node v22.16.0;
- manifest: 10/10 parse, Manifest V3, versi `0.1.8`;
- scan pola secret umum pada rescue source: 0 hit.

Tidak dijalankan dan tidak diklaim PASS:

- Chrome manual `Load unpacked` integration;
- ChatGPT live smoke test;
- launcher nyata end-to-end;
- full-history dedicated secret scanner;
- backup/restore drill proyek nyata pada clone Windows pengguna.

## Build dan packaging

Baseline v0.1.8 tidak memiliki `package.json`, build script, test suite repo, atau workflow CI. Karena itu status build R0 adalah **N/A — no build step**. Distribusi adalah folder Chrome extension Runner 01–10 yang dapat dipasang dengan `Load unpacked`.

## Backup gate

Policy/tooling backup sudah tersedia di `docs/backup/**` dan `tools/backup/**`. Environment Chat 5 tidak dapat melakukan clone GitHub proyek saat ini, sehingga bundle canonical terhadap final R0 belum dapat dibuat di sini.

Status final backup: **BACKUP_LOCAL_PENDING**.

R0 tetap dapat dinyatakan sebagai checkpoint recovery yang dapat dipercaya karena source/provenance/missing/test/build/backup status sudah eksplisit. Backup lokal final adalah tindakan pasca-checkpoint yang wajib dilakukan sebelum mengandalkan repo ini sebagai satu-satunya salinan.

## Batas fase

Recovery R0 berhenti pada pemulihan keadaan yang dapat dipercaya. Tidak ada fitur baru yang dikerjakan pada fase ini.
