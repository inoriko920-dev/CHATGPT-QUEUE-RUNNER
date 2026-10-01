# RECOVERY_ASSIGNMENT — ChatGPT Queue Runner — Recovery R0

Tanggal koordinasi: 2026-10-01

## BASELINE

- repo: `inoriko920-dev/CHATGPT-QUEUE-RUNNER`
- default branch yang dikonfigurasi GitHub: `main`
- HEAD saat audit awal Chat 5: **BELUM ADA** (repo kosong; belum ada branch/commit)
- status repo saat audit awal: **EMPTY REPOSITORY / RECOVERY NOT STARTED**
- target fase: **RECOVERY R0 yang dapat dipercaya**
- larangan fase: **jangan menambah fitur baru, jangan speculative rewrite, jangan mengklaim planned = implemented**

### Evidence yang sudah ditemukan

1. `MASTER_PLAN_ASTRA_CHATGPT_QUEUE_RUNNER_UNTUK_SOL.txt` / salinan `ChatGPT-Queue-Runner_MASTER_PLAN_ASTRA.txt` tersedia di ChatGPT Library.
   - audit: 28 September 2026
   - repo lama: `tonitarung099-creator/ChatGPT-Queue-Runner`
   - baseline audit lama: `7bcfbf7cdfa87303f21d5f979796200880e355ae`
   - versi manifest: `0.1.8`
   - tree audit: `81 file`
   - 10 runner extension
   - audit mencatat 40 file JavaScript lulus `node --check` dan 25 skenario reproduksi; itu bukan bukti live ChatGPT/Chrome integration.
   - baseline lama tidak memiliki `AGENTS.md`, test suite, `package.json`, build script, atau workflow CI.
2. Dokumen master recovery mencatat rescue `extensions.zip`:
   - 80 file + 11 direktori; Runner 01–10
   - tidak mempunyai `.git`
   - SHA-256 yang terdokumentasi: `f46767d61dff61c2b0ce7dc413fc7dbe29f78d0029c17a2259d54bd96c5ddd56`
   - status harus tetap **RESCUED PARTIAL SNAPSHOT** sampai selisih tree `81 vs 80` direkonsiliasi.
3. Paket koordinasi yang diterima Chat 5 pada 2026-10-01 (`01_CHATGPT-QUEUE-RUNNER.zip`) berisi 8 file instruksi TXT, bukan source extension. SHA-256 paket koordinasi yang dihitung di sesi ini: `fa46394a394f116474b2c08e4db68c1ae5badc14effe20df2272bc6df320938d`.

## Aturan provenance wajib

Setiap hasil recovery diberi salah satu label:

- `VERIFIED_SOURCE`
- `VERIFIED_FROM_BUILD`
- `RECONSTRUCTED_FROM_DOCS`
- `RECONSTRUCTED_FROM_BEHAVIOR`
- `UNKNOWN`

Jangan menyebut `source asli pulih` jika bukti hanya berasal dari dokumen, build, atau chat.

---

# CHAT 1 — SOL-A — SOURCE RECOVERY

- task: Pulihkan **source nyata** dari rescue `extensions.zip`; inventarisasi dan import tanpa menebak file yang hilang.
- inputs:
  - rescue `extensions.zip` asli/read-only bila tersedia pada chat worker;
  - baseline assignment ini;
  - master recovery/audit hanya sebagai pembanding, bukan sumber untuk mengarang source.
- branch: `recovery/chat1-source-r0`
- dependency: mulai dari commit coordinator yang berisi assignment ini.
- owned files/areas:
  - `extensions/**`
  - `docs/recovery/chat1/**`
- do not touch:
  - `docs/recovery/RECOVERY_ASSIGNMENT.md`
  - `docs/recovery/final/**`
  - `docs/recovery/chat2/**`
  - `docs/recovery/chat3/**`
  - `docs/recovery/chat4/**`
  - `tests/**`, `.github/**`, `tools/backup/**` kecuali Chat 5 memberi izin eksplisit.
- required work:
  1. Bekukan rescue asli; jangan ubah/hapus ZIP.
  2. Hitung ulang SHA-256 dan bandingkan dengan hash terdokumentasi.
  3. Inventarisasi seluruh isi rescue dan klasifikasikan APP SOURCE / DOCS / CONFIG / GENERATED / DEPENDENCY / BINARY bila ada.
  4. Import hanya source yang benar-benar ada.
  5. Verifikasi `manifest.json` Runner 01–10 dan versi aktual.
  6. Buat hash inventory antar-runner untuk menemukan identik/drift.
  7. Rekonsiliasi tree rescue 80 file terhadap evidence audit 81 file tanpa mengarang file ke-81.
  8. Lakukan `node --check` untuk seluruh JS recovered sebagai validasi sintaks dasar.
- acceptance criteria:
  - tidak ada file speculative;
  - seluruh imported source punya provenance;
  - jumlah file rescue dan hash dicatat;
  - missing/unknown dicatat eksplisit;
  - `node --check` dilaporkan PASS/FAIL jujur;
  - core source tidak dimodifikasi untuk memperbaiki B01–B19 pada fase R0.
- output:
  - `RECOVERY_HANDOFF_CHAT_1`
  - branch + commit + PR bila dibuat
  - daftar recovered/missing/unknown
  - inventory hash
  - status sintaks
  - item yang harus diverifikasi Chat 5.

---

# CHAT 2 — SOL-B — HISTORY / DOCS / REQUIREMENTS RECOVERY

- task: Pulihkan pengetahuan proyek dan status fitur lama tanpa menulis core source.
- inputs:
  - `MASTER_PLAN_ASTRA_CHATGPT_QUEUE_RUNNER_UNTUK_SOL.txt`
  - dokumen master recovery
  - chat/evidence lama yang dapat diverifikasi
  - baseline assignment ini.
- branch: `recovery/chat2-history-docs-r0`
- dependency: independen dari Chat 1; mulai dari commit coordinator yang sama.
- owned files/areas:
  - `docs/recovery/chat2/**`
- do not touch:
  - `extensions/**`
  - `tests/**`
  - `.github/**`
  - `tools/backup/**`
  - `docs/recovery/RECOVERY_ASSIGNMENT.md`
  - `docs/recovery/final/**`.
- required work:
  1. Catat baseline audit lama, SHA, versi, struktur 10 runner dan tree 81 file.
  2. Pulihkan daftar B01–B19 dan acceptance criteria sebagai requirements/evidence, bukan sebagai klaim sudah diperbaiki.
  3. Bedakan fitur dengan label: `VERIFIED_OLD_SOURCE`, `VERIFIED_OLD_TEST`, `REPORTED_IN_CHAT`, `PLANNED_ONLY`, `UNKNOWN`.
  4. Catat bahwa audit ASTRA planning-only dan tidak membuktikan implementasi fix akhir.
  5. Catat packaging target Chrome extension Runner 01–10, UI Bahasa Indonesia, ZIP siap `Load unpacked`; bukan EXE.
  6. Catat kebutuhan perilaku penting: interrupted/failed harus dapat lanjut setelah jeda; permintaan izin/konfirmasi harus pause; jangan salah percakapan, overwrite draft, atau duplikasi prompt.
- acceptance criteria:
  - planned tidak pernah ditulis sebagai implemented;
  - semua SHA/versi/status yang ditulis punya evidence;
  - ketidakpastian diberi `UNKNOWN`;
  - tidak menyentuh source.
- output:
  - `RECOVERY_HANDOFF_CHAT_2`
  - `RECOVERED_HISTORY.md`
  - `RECOVERED_ARCHITECTURE.md`
  - `KNOWN_OLD_COMMITS.md`
  - `FEATURE_STATUS_RECOVERED.md`
  - branch + commit + PR bila dibuat.

---

# CHAT 3 — SOL-C — TEST / BUILD / BEHAVIOR RECOVERY

- task: Pulihkan cara membuktikan snapshot recovery bekerja tanpa mengubah core source.
- inputs:
  - assignment ini;
  - hasil source Chat 1 bila sudah tersedia, atau baca branch Chat 1 sebagai evidence tanpa menulis ke sana;
  - master ASTRA untuk daftar skenario lama.
- branch: `recovery/chat3-test-build-r0`
- dependency: dokumentasi test dapat dimulai segera; pengujian recovered source dilakukan setelah branch Chat 1 punya commit sumber.
- owned files/areas:
  - `docs/recovery/chat3/**`
  - `recovery-tests/**` (harness/fixture recovery baru, wajib diberi label reconstructed)
- do not touch:
  - `extensions/**`
  - `docs/recovery/chat1/**`
  - `docs/recovery/chat2/**`
  - `docs/recovery/chat4/**`
  - `tools/backup/**`
  - `docs/recovery/RECOVERY_ASSIGNMENT.md`
  - `docs/recovery/final/**`.
- required work:
  1. Inventarisasi test/build/CI yang benar-benar ada pada recovered snapshot.
  2. Jika test legacy tidak ada, buat `TEST_RECOVERY_PLAN` lebih dulu.
  3. Boleh membuat harness baru hanya di `recovery-tests/**`; label `RECONSTRUCTED_FROM_DOCS` atau `RECONSTRUCTED_FROM_BEHAVIOR`.
  4. Jalankan `node --check` terhadap recovered JS bila source tersedia.
  5. Pisahkan status: syntax/static, mock/regression harness, Chrome extension integration, ChatGPT live.
  6. Jangan menulis PASS untuk Chrome/live bila tidak benar-benar dijalankan.
  7. Jangan menganggap 25 skenario audit lama sebagai test suite recovered; itu evidence audit lama.
- acceptance criteria:
  - PASS/FAIL/SKIP/NOT RUN jujur;
  - tidak ada perubahan core source;
  - harness baru tidak diklaim legacy;
  - command dan environment dicatat.
- output:
  - `RECOVERY_HANDOFF_CHAT_3`
  - `TEST_RECOVERY_PLAN.md`
  - `RECOVERY_TEST_EVIDENCE.md`
  - branch + commit + PR bila dibuat.

---

# CHAT 4 — SOL-D — BACKUP / RESILIENCE

- task: Bangun prosedur backup yang tidak bergantung pada GitHub saja; jangan menyentuh core source.
- inputs:
  - assignment ini;
  - dokumen master recovery;
  - repo baru setelah commit coordinator tersedia.
- branch: `recovery/chat4-backup-resilience-r0`
- dependency: independen dari Chat 1–3 untuk docs/script; bundle final menunggu R0 integrated.
- owned files/areas:
  - `docs/recovery/chat4/**`
  - `docs/backup/**`
  - `tools/backup/**`
- do not touch:
  - `extensions/**`
  - `recovery-tests/**`
  - `docs/recovery/chat1/**`
  - `docs/recovery/chat2/**`
  - `docs/recovery/chat3/**`
  - `docs/recovery/RECOVERY_ASSIGNMENT.md`
  - `docs/recovery/final/**`.
- required work:
  1. Tulis `BACKUP_POLICY` dan template `BACKUP_MANIFEST`.
  2. Buat PowerShell/script untuk local clone: `git bundle create --all`, `git bundle verify`, source ZIP, SHA-256, secret exclusion, restore drill.
  3. Terapkan prinsip minimal 3-2-1 dan jelaskan GitHub account kedua bukan backup independen.
  4. Jangan memasukkan API key/token/cookie.
  5. Bila environment tidak punya clone lokal yang tepat, tulis `BACKUP_LOCAL_PENDING`; jangan mengklaim bundle sudah dibuat.
- acceptance criteria:
  - script/docs tidak menyentuh source aplikasi;
  - tidak ada secret;
  - backup verification dan restore steps dapat diaudit;
  - status yang belum dijalankan ditandai pending/not run.
- output:
  - `RECOVERY_HANDOFF_CHAT_4`
  - `BACKUP_POLICY.md`
  - `BACKUP_MANIFEST.template.json`
  - script backup/verify/restore
  - branch + commit + PR bila dibuat.

---

# SHARED FILES RESERVED FOR CHAT 5

Chat 1–4 **tidak boleh** menulis final shared state berikut kecuali Chat 5 mendelegasikan secara eksplisit:

- `docs/recovery/RECOVERY_ASSIGNMENT.md`
- `docs/recovery/final/RECOVERY_NOTES.md`
- `docs/recovery/final/SOURCE_PROVENANCE.md`
- `docs/recovery/final/CURRENT_STATE.md`
- `docs/recovery/final/KNOWN_MISSING_FILES.md`
- `docs/recovery/final/RECOVERY_TEST_STATUS.md`
- final R0 commit/tag
- final backup manifest/checksum/bundle status.

# INTEGRATION ORDER FOR CHAT 5 LATER

1. Chat 1 — source/provenance first.
2. Chat 2 — history/docs, resolve contradictions against Chat 1 evidence.
3. Chat 3 — test/build evidence against recovered source.
4. Chat 4 — backup docs/tools.
5. Chat 5 — final provenance/state, tests, recovery R0 commit/tag, backup gate.

Do not merge worker branches automatically. Every worker returns a handoff to Chat 5 first.
