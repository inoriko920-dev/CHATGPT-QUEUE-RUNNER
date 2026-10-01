# RECOVERED_HISTORY — ChatGPT Queue Runner

Tanggal recovery: 2026-10-01
Worker: Chat 2 / SOL-B — History, Docs, Requirements Recovery
Target repo baru: `inoriko920-dev/CHATGPT-QUEUE-RUNNER`
Branch kerja: `recovery/chat2-history-docs-r0`

## 1. Aturan pembacaan status

Dokumen ini memulihkan pengetahuan proyek. Dokumen ini **tidak** mengubah atau mengimpor core source.

Label yang dipakai:

- `VERIFIED_OLD_SOURCE` — bukti langsung masih dapat dibaca dari source/commit/branch lama.
- `VERIFIED_OLD_TEST` — ada bukti test lama yang benar-benar dijalankan atau CI lama yang berhasil.
- `REPORTED_IN_CHAT` — hanya ditemukan sebagai laporan percakapan, tanpa bukti source/test yang cukup.
- `PLANNED_ONLY` — rencana/desain, bukan bukti implementasi.
- `UNKNOWN` — bukti belum cukup.

## 2. Repo lama yang berhasil ditemukan kembali

Repo lama: `tonitarung099-creator/ChatGPT-Queue-Runner`

Pada saat recovery ini, repo lama masih dapat dibaca melalui GitHub. Karena itu beberapa fakta yang sebelumnya hanya diketahui dari Library sekarang dapat diverifikasi langsung.

Branch yang terverifikasi pada repo lama:

- `main` → `7bcfbf7cdfa87303f21d5f979796200880e355ae`
- `fix/astra-b01-b19-runner-reliability` → `a36e4b74645d8c98a1ed9c7a5db4dbd3d3586d98`

GitHub Releases pada repo lama: **tidak ada** (`[]`) saat diperiksa.

Tag lama: `UNKNOWN`. Endpoint refs/tags yang dicoba tidak menghasilkan daftar tag yang dapat dipakai sebagai bukti. Jangan menyimpulkan tag pernah/tidak pernah ada hanya dari ini.

## 3. Timeline main lama — VERIFIED_OLD_SOURCE

### 2026-09-28 — inisialisasi repo

Commit:
`3b9f5e58b2c7559a8bfa14dae641a63a35e9d099`

Message:
`Initialize ChatGPT Queue Runner repository`

### 2026-09-28 — v0.1.6

Commit:
`a516aab54a6e2cb90909cc28f74213b2ef61cdaa`

Message:
`Add Chat Queue Runner v0.1.6 extensions 01-10`

### 2026-09-28 — v0.1.7

Commit:
`bf7825f529366a64788896442f01164cac6b95eb`

Message:
`Fix ChatGPT web runner reliability in v0.1.7`

### 2026-09-28 — v0.1.8 / old main

Commit:
`7bcfbf7cdfa87303f21d5f979796200880e355ae`

Message:
`Auto-continue queue after interrupted ChatGPT responses v0.1.8`

Fakta terverifikasi pada commit ini:

- manifest dinaikkan ke `0.1.8`;
- paket berisi Runner 01–10;
- root `README.md` menjelaskan auto-next ketika respons ChatGPT terhenti;
- `interruption-bypass.js` ditambahkan pada paket runner;
- old `main` berhenti pada commit ini dan tidak berisi hardening v0.2.0.

## 4. Audit ASTRA terhadap v0.1.8 — PLANNED_ONLY sebagai fix, VERIFIED sebagai audit

Audit ASTRA bertanggal 28 September 2026 memakai baseline:

- repo: `tonitarung099-creator/ChatGPT-Queue-Runner`
- branch: `main`
- commit: `7bcfbf7cdfa87303f21d5f979796200880e355ae`
- manifest: `0.1.8`
- tree: 81 file

Audit menyatakan dirinya sebagai audit/rencana dan tidak melakukan perubahan aplikasi, commit, atau PR. Jadi proposal perbaikan dalam dokumen ASTRA pada tahap ini harus dibaca sebagai `PLANNED_ONLY`.

Audit lama mencatat:

- 40 file JavaScript lulus `node --check`;
- 25 skenario reproduksi terkontrol;
- B01–B14 direproduksi melalui harness/mock;
- B15–B19 ditemukan lewat penelusuran source/dokumentasi;
- tidak ada live test ChatGPT dan tidak ada bukti integrasi Chrome MV3 penuh.

## 5. Rekonsiliasi tree 81 file vs rescue 80 file

Dokumen master recovery 2026-10-01 mencatat `extensions.zip` berisi:

- 10 folder `chat-queue-runner-01` sampai `chat-queue-runner-10`;
- masing-masing 8 file;
- total 80 file;
- tidak ada `.git`;
- manifest v0.1.8;
- SHA-256 rescue terdokumentasi: `f46767d61dff61c2b0ce7dc413fc7dbe29f78d0029c17a2259d54bd96c5ddd56`.

Audit lama menyebut tree 81 file. Saat recovery Chat 2, old main berhasil dibaca langsung dan root `README.md` pada commit `7bcfbf7...` terverifikasi ada di luar `extensions/`.

**Kesimpulan evidence saat ini:** mismatch 81 vs 80 dapat dijelaskan sebagai 80 file di `extensions/` + 1 root `README.md` = 81 file baseline.

Namun rescue `extensions.zip` tetap bukan salinan Git lengkap karena tidak memuat `.git`/history/branch/tag dan tidak memuat root README. Jadi rescue tetap harus diperlakukan sebagai snapshot source parsial, bukan clone repo lama.

## 6. Implementasi SOL v0.2.0 ternyata masih ada di branch lama

Ini adalah penemuan penting recovery.

PR lama:

- PR: `#1`
- title: `Fix queue runner reliability and recovery (B01–B19)`
- state saat diperiksa: `open`
- base: `main` @ `7bcfbf7cdfa87303f21d5f979796200880e355ae`
- head branch: `fix/astra-b01-b19-runner-reliability`
- head: `a36e4b74645d8c98a1ed9c7a5db4dbd3d3586d98`
- dibuat: 2026-09-28
- merged: **tidak**

PR menjelaskan implementasi v0.2.0 yang mencakup cancellation berbasis runId/revision, journal pengiriman, ikatan identitas percakapan, proteksi draf, outcome `completed/interrupted/failed/unknown`, approval guard, owner recovery, sinkronisasi popup/launcher, koordinasi lintas runner, sumber kanonik `src/`, generator Runner 01–10, regression tests, dan CI.

Karena branch dan source-nya masih dapat dibaca, keberadaan implementasi tersebut diklasifikasikan `VERIFIED_OLD_SOURCE (UNMERGED)` — **bukan** sekadar laporan chat.

## 7. Bukti test v0.2.0 — VERIFIED_OLD_TEST

`TEST_REPORT.md` pada branch lama mencatat:

- `node --test tests/*.test.js` → 29 lulus, 0 gagal;
- `node scripts/validate-packages.mjs` → 10 paket konsisten, manifest v0.2.0 valid;
- `node --check` seluruh JS di `src/` dan `extensions/` → lulus;
- regression suite mencakup kontrak B01–B18; B19 diverifikasi lewat dokumentasi/generator.

GitHub Actions untuk head `a36e4b7...` juga terverifikasi:

- workflow: `CI`
- run number: 4
- status: completed
- conclusion: success

Batas penting:

- Chromium headless pernah dimulai dengan `--load-extension`, tetapi aktivasi/service worker extension tidak dapat diverifikasi positif;
- **ChatGPT live belum diuji**;
- launcher localhost nyata belum teruji end-to-end.

Jadi v0.2.0 memiliki bukti source + test lama yang kuat, tetapi tidak boleh ditulis sebagai release produksi/live-verified.

## 8. Status pada awal recovery repo baru

Repo baru:
`inoriko920-dev/CHATGPT-QUEUE-RUNNER`

Coordinator recovery membuat commit awal:
`083ed5030d6a6304e9f720ce6edcec5b4ce83288`

Message:
`recovery: add R0 worker assignment`

Branch recovery yang terverifikasi dibuat dari coordinator commit yang sama:

- `recovery/chat1-source-r0`
- `recovery/chat2-history-docs-r0`
- `recovery/chat3-test-build-r0`
- `recovery/chat4-backup-resilience-r0`

Chat 2 hanya menulis di `docs/recovery/chat2/**` dan tidak mengubah core source.

## 9. Implikasi recovery

Penemuan branch v0.2.0 mengubah strategi recovery:

1. Jangan merekonstruksi hardening B01–B19 dari nol sebelum old PR branch diamankan.
2. Old `main` v0.1.8 tetap baseline resmi yang pernah menjadi main.
3. Old v0.2.0 branch adalah sumber nyata yang sangat bernilai, tetapi unmerged.
4. Integrator/Chat 5 harus menentukan apakah source v0.2.0 akan diimpor sebagai jalur recovery terpisah setelah provenance dibekukan.
5. Jangan mencampur source v0.1.8 rescue dengan source v0.2.0 tanpa commit/checkpoint dan provenance yang jelas.

## 10. Evidence yang digunakan

- `ChatGPT-Queue-Runner_MASTER_PLAN_ASTRA.txt` / `MASTER_PLAN_ASTRA_CHATGPT_QUEUE_RUNNER_UNTUK_SOL.txt` dari ChatGPT Library.
- `MASTER_RENCANA_RECOVERY_DAN_BACKUP_SEMUA_REPO_AI.docx` dari ChatGPT Library.
- old GitHub repo `tonitarung099-creator/ChatGPT-Queue-Runner` (commit, branches, PR #1, source, test report, workflow evidence).
- coordinator assignment repo baru `docs/recovery/RECOVERY_ASSIGNMENT.md`.

### Evidence yang tidak ditemukan

- file literal `00_RINGKASAN_RECOVERY_REPO.txt` tidak ditemukan melalui pencarian Library pada sesi Chat 2;
- screenshot/UI reference khusus ChatGPT Queue Runner tidak ditemukan sebagai file Library pada pencarian Chat 2;
- release artifact/ZIP lama yang dapat diverifikasi checksum-nya tidak ditemukan pada sesi ini.
