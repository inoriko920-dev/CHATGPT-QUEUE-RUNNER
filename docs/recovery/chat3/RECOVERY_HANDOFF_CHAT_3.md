# RECOVERY_HANDOFF_CHAT_3 — SOL-C — TEST / BUILD / BEHAVIOR RECOVERY

Tanggal: 2026-10-01
Repo: `inoriko920-dev/CHATGPT-QUEUE-RUNNER`
Worker branch: `recovery/chat3-test-build-r0`
Coordinator baseline: `083ed5030d6a6304e9f720ce6edcec5b4ce83288`

## Ringkasan

Chat 3 memulihkan **cara membuktikan aplikasi bekerja** tanpa mengubah core source dan tanpa mengubah evidence historis menjadi klaim current PASS.

Output yang dibuat:

- `docs/recovery/chat3/TEST_RECOVERY_PLAN.md`
- `docs/recovery/chat3/RECOVERY_TEST_EVIDENCE.md`
- `docs/recovery/chat3/RECOVERY_HANDOFF_CHAT_3.md`

Tidak ada perubahan pada:

- `extensions/**`
- `docs/recovery/chat1/**`
- `docs/recovery/chat2/**`
- `docs/recovery/chat4/**`
- `docs/recovery/RECOVERY_ASSIGNMENT.md`
- `docs/recovery/final/**`
- `tools/backup/**`

Tidak ada merge ke `main`.

## Dependency/build evidence

### Current recovery

`VERIFIED_SOURCE`

- Repo coordinator sudah memiliki baseline assignment pada commit `083ed5030d6a6304e9f720ce6edcec5b4ce83288`.
- Branch `recovery/chat1-source-r0` ada, tetapi saat Chat 3 mengecek dua kali root branch tersebut hanya berisi `docs/`; `extensions/**` belum tersedia.
- Karena source recovered belum ada, current dependency/build inventory tidak boleh dinyatakan final.

### Historical

`RECONSTRUCTED_FROM_DOCS`

Master ASTRA 28 September 2026 terhadap commit lama `7bcfbf7cdfa87303f21d5f979796200880e355ae` mencatat:

- manifest version `0.1.8`;
- Runner 01–10;
- tree 81 file;
- tidak ada `AGENTS.md`, test suite, `package.json`, build script, atau workflow CI;
- 40 JavaScript pernah lulus `node --check`;
- 25 reproduksi mock/DOM dibuat untuk baseline lama;
- Chrome extension integration nyata dan ChatGPT live tidak dijalankan.

Historical evidence ini **bukan current recovery PASS**.

## Test evidence saat handoff

| Layer | Status | Catatan |
|---|---|---|
| Assignment/coordinator evidence | `PASS` | file dibaca dan aturan ownership dipatuhi |
| Worker branch write | `PASS` | tiga recovery docs dibuat pada area Chat 3 |
| Chat 1 source dependency | `FAIL` sebagai availability gate | source belum hadir; bukan claim source rusak |
| Current dependency/build inventory | `SKIP` | menunggu commit source Chat 1 |
| Current manifest/version | `SKIP` | manifest belum tersedia |
| Current JS `node --check` | `SKIP` | recovered JS belum tersedia |
| Mock/regression harness | `NOT RUN` | sengaja tidak dibuat sebelum source nyata tersedia |
| Chrome load-unpacked | `NOT RUN` | source/package belum tersedia |
| Chrome MV3 runtime | `NOT RUN` | tidak dijalankan |
| ChatGPT live | `NOT RUN` | tidak dijalankan |
| Packaging Runner 01–10 | `NOT RUN` | source/layout belum tersedia |

Tidak ada test yang gagal secara behavior karena tidak ada behavior test current yang dijalankan. Yang gagal hanya **dependency availability gate** pada waktu audit Chat 3.

## Commands

Plan mencatat command yang harus dijalankan setelah source tersedia, termasuk:

```powershell
git fetch origin recovery/chat1-source-r0
git ls-tree -r --name-only origin/recovery/chat1-source-r0
```

Lalu syntax/static:

```powershell
Get-ChildItem -Recurse -Filter *.js extensions | ForEach-Object {
  node --check $_.FullName
  if ($LASTEXITCODE -ne 0) { throw "node --check failed: $($_.FullName)" }
}
```

Wajib merekam source SHA, OS, Node version, jumlah file, command, result, artifact/log, dan limitations.

## Acceptance matrix yang dipulihkan

`RECONSTRUCTED_FROM_DOCS`

`TEST_RECOVERY_PLAN.md` membawa kembali acceptance matrix T01–T30 dari master ASTRA sebagai **target validasi**, bukan legacy recovered tests.

Kelompok utamanya mencakup:

- normal send ordering dan fast/long response;
- interruption/error/approval;
- pause/reset cancellation;
- late launcher response dan uncertain send;
- reload/recovery/navigation/owner tab;
- composer remount dan manual draft preservation;
- launcher/popup revision consistency;
- duplicate runner prevention;
- outcome accounting;
- boundary payload/item count;
- 10 package consistency;
- state upgrade/storage failure;
- background/sleep/service-worker restart;
- ChatGPT live selector matrix Bahasa Indonesia/Inggris, long chat, file/tool output.

## Portable behavior

### Current

`UNKNOWN / NOT RUN`

Chat 3 tidak menerima rescue `extensions.zip` sebagai file langsung dan tidak mengklaim mengekstrak atau menjalankannya.

### Documented historical recovery evidence

`RECONSTRUCTED_FROM_DOCS`

Coordinator assignment mencatat rescue:

- 80 file + 11 direktori;
- Runner 01–10;
- tanpa `.git`;
- SHA-256 `f46767d61dff61c2b0ce7dc413fc7dbe29f78d0029c17a2259d54bd96c5ddd56`;
- tetap berstatus `RESCUED PARTIAL SNAPSHOT` sampai gap 81 vs 80 selesai direkonsiliasi.

Target distribusi historis adalah Chrome extension folder/ZIP siap `Load unpacked`, bukan EXE.

## Missing / unresolved test-build evidence

Belum dapat diverifikasi pada rescued snapshot saat handoff:

- dependency files/lockfile aktual;
- build/package/generator script aktual;
- workflow CI aktual;
- legacy test files aktual;
- jumlah/path JS recovered;
- manifest/version Runner 01–10;
- perbedaan tree 80 rescue vs 81 audit lama;
- launcher/server dependency aktual;
- current Chrome compatibility;
- MV3 service-worker restart behavior;
- current ChatGPT selector compatibility;
- live interruption/approval/navigation/draft behavior;
- final package ZIP/checksum.

## Commits Chat 3

- `a79693878e0e1f43f56702d59864d701a5467158` — `recovery(chat3): add test recovery plan`
- `8f6563aa7d61fb8b0067a5d8578413f8bf114b81` — `recovery(chat3): record current test and build evidence`
- commit handoff ini menjadi commit terakhir branch sebelum PR dibuat.

## Instruksi untuk Chat 5

1. Jangan merge Chat 3 sebelum source Chat 1 direview sesuai integration order.
2. Setelah Chat 1 punya commit source, gunakan `TEST_RECOVERY_PLAN.md` sebagai gate.
3. Rekam exact Chat 1 SHA lalu jalankan inventory dan `node --check`.
4. Bila perlu harness baru, buat hanya di `recovery-tests/**` dan label reconstructed; jangan klaim legacy.
5. Pisahkan laporan mock/regression, Chrome integration, dan ChatGPT live.
6. Jangan mengubah `SKIP/NOT RUN` di handoff ini menjadi `PASS` tanpa run evidence baru.
7. Final `docs/recovery/final/**`, R0 tag, dan merge tetap hak Chat 5.

## Handoff status

`READY FOR CHAT 5 REVIEW — DOCUMENTATION COMPLETE, SOURCE-DEPENDENT TEST EXECUTION PENDING CHAT 1`
