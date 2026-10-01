# CURRENT_STATE — Recovery R0

Tanggal: 2026-10-01

## Recovery R0 status

**R0 COMPLETE / BACKUP VERIFIED**

Repository sekarang mempunyai keadaan recovery yang dapat dipercaya dengan provenance terpisah antara source asli, historical evidence, dan tooling recovery baru. Canonical backup juga telah dibuat, diverifikasi, direstore, dan disalin ke penyimpanan di luar GitHub.

## Current application baseline

- Product: ChatGPT Queue Runner.
- Baseline source current R0: **v0.1.8**.
- Distribution: 10 Chrome Manifest V3 extensions, Runner 01–10.
- `extensions/**`: 80 file verified source.
- root `README.md`: verified source dari old main.
- Rekonsiliasi historical tree: **81/81 file baseline lama teridentifikasi** sebagai 80 file `extensions/` + 1 root README.

Recovery R0 **tidak** meng-upgrade aplikasi ke v0.2.0 dan tidak menambahkan feature fix B01–B19 ke core source.

## Current repository tambahan

Di luar source lama v0.1.8, repo baru juga memuat:

- `docs/recovery/**` — assignment, handoff, history, architecture, provenance, state, dan test evidence;
- `recovery-tests/verify-recovered-snapshot.mjs` — verifier snapshot/static baru, provenance `RECONSTRUCTED_FROM_DOCS`, bukan legacy test;
- `docs/backup/**` — backup policy + manifest template;
- `tools/backup/**` — tooling PowerShell backup/verify/restore/copy.

Area recovery/backup ini bukan bagian dari source legacy v0.1.8 dan diberi provenance terpisah.

## Old v0.2.0 preservation

Old repo masih dapat dibaca dan branch hardening unmerged masih tersedia:

- `fix/astra-b01-b19-runner-reliability`
- head `a36e4b74645d8c98a1ed9c7a5db4dbd3d3586d98`

Ia didokumentasikan sebagai high-value recovery evidence tetapi tidak dicampur ke R0. Siklus berikutnya boleh mengevaluasi v0.2.0 secara terpisah.

## Test status current R0

- rescue SHA-256: PASS;
- source count: 80 PASS;
- manifest: 10/10 parse PASS, MV3, version 0.1.8;
- JavaScript syntax: 40/40 PASS (`node --check`, Node v22.16.0);
- reconstructed snapshot verifier: PASS — 182 checks, 0 failures, 40 JS checked;
- full Git-object common-secret scan: PASS for selected patterns/risky filenames — 285 objects, 68 blobs, 295132 bytes, 0 hits;
- Chrome Load unpacked integration: NOT RUN;
- ChatGPT live: NOT RUN;
- real launcher E2E: NOT RUN.

Specialized provider-aware/entropy secret scanner seperti Gitleaks/TruffleHog belum dijalankan, jadi status secret di atas harus dibaca sesuai scope scan yang dicatat.

## Build

**N/A — no build step on v0.1.8 baseline.**

Old main v0.1.8 tidak memiliki package/build/test/CI framework. Extension dipasang dari folder source melalui Chrome `Load unpacked`.

## Canonical backup

Checkpoint repository yang diverifikasi: `3328164272e2eda47fdcf15ee13123e525e945f1`.

GitHub Actions run `36833765406` menjalankan workflow canonical backup dan seluruh tahap selesai SUCCESS:

- reconstructed snapshot verifier: PASS;
- canonical `repo.bundle`: CREATED;
- canonical `source.zip` (`git archive HEAD`): CREATED;
- SHA-256 verification: PASS;
- `git bundle verify`: PASS;
- restore drill dari bundle: PASS;
- `git fsck --full`: PASS;
- restored HEAD matches manifest: PASS;
- final manifest status: `VERIFIED`;
- workflow artifact upload: PASS.

Hashes:

- `repo.bundle`: `c291eaada0b620408e810f4a43da5a5460cb79a3034a6028b56d5e9084abd057`;
- `source.zip`: `04f629506e2d68ca011264d1b6d38e5f555982b620f268d811bc0c87ca8c258e`;
- outer canonical artifact ZIP: `eb6ef37eb3b3f6821a06c15c42acd6a18f325e24990eb6dda9da2c8023cbe8c6`.

Setelah artifact diunduh dari GitHub Actions, verifikasi independen dijalankan lagi: hash internal cocok, `git bundle verify` PASS, clone bundle PASS, `git fsck --full` PASS, dan restored HEAD tetap `3328164272e2eda47fdcf15ee13123e525e945f1`.

Canonical backup ZIP kemudian disalin ke Library:

`/Backups/CHATGPT-QUEUE-RUNNER/R0/CHATGPT-QUEUE-RUNNER-R0-canonical-backup-3328164.zip`

Raw rescue ZIP, hash rescue, rescue manifest, dan laporan full Git-object common-secret scan juga dipertahankan pada folder Library R0.

Status backup canonical: **BACKUP_VERIFIED**.

## Resilience tambahan yang disarankan

Untuk ketahanan 3-2-1 yang lebih kuat, user tetap disarankan mengunduh canonical backup ZIP ke PC dan menyalinnya ke HDD/SSD eksternal. Ini menambah media fisik kedua di luar SSD kerja dan di luar cloud.

## Next phase

Recovery R0 + canonical backup selesai. Fase berikutnya, bila diminta user, adalah evaluasi terpisah terhadap old v0.2.0 hardening branch dan live Chrome/ChatGPT validation — bukan bagian R0.
