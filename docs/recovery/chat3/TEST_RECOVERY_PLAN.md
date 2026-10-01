# TEST_RECOVERY_PLAN — Chat 3 / SOL-C — Recovery R0

Tanggal: 2026-10-01
Branch: `recovery/chat3-test-build-r0`
Status: `RECONSTRUCTED_FROM_DOCS`, diperbarui setelah source Chat 1 tersedia.

## 1. Tujuan dan aturan hasil

Dokumen ini mendefinisikan cara membuktikan snapshot recovery ChatGPT Queue Runner bekerja tanpa mengubah core source dan tanpa mengubah evidence historis menjadi klaim current PASS.

- `PASS`: test/check benar-benar dijalankan terhadap source yang dapat diidentifikasi, atau evidence source worker yang eksplisit disebut sebagai evidence worker tersebut.
- `FAIL`: command/check benar-benar dijalankan dan gagal.
- `SKIP`: sengaja tidak dijalankan karena dependency/environment tidak tersedia.
- `NOT RUN`: belum ada eksekusi untuk layer tersebut.
- Harness recovery baru hanya di `recovery-tests/**` dan wajib dilabeli reconstructed.
- Syntax/static, mock/regression, Chrome integration, dan ChatGPT live selalu dilaporkan terpisah.

## 2. Exact recovered source gate

Source recovery Chat 1 sekarang tersedia.

- Branch: `recovery/chat1-source-r0`
- Exact source commit: `4719c0e17e83bf03afd141b96156614f83b9631a`
- Commit message: `recovery(chat1): import verified extensions rescue`
- Rescue provenance: `VERIFIED_SOURCE`
- Rescue SHA-256: `f46767d61dff61c2b0ce7dc413fc7dbe29f78d0029c17a2259d54bd96c5ddd56`
- Hash terhadap expected rescue: `MATCH`
- Layout: 10 runner × 8 files = 80 files
- APP SOURCE: 60; CONFIG: 10; DOCS: 10
- TEST: 0; BUILD SCRIPT: 0; BUNDLED DEPENDENCY: 0; GENERATED: 0; BINARY/PORTABLE: 0
- Historical 81-file tree masih berbeda satu file; path/content file ke-81 tetap `UNKNOWN` dan tidak boleh direkonstruksi dari tebakan.

Chat 1 juga mencatat seluruh 10 manifest parse sebagai MV3 version `0.1.8`, menggunakan `background.js`, `popup.html`, serta content scripts `interruption-bypass.js` + `content.js`.

## 3. Dependency/build/CI model recovered

Berdasarkan exact rescue 80-file source:

- `package.json`: absent dari rescue.
- npm/yarn/pnpm lockfile: absent dari rescue.
- Python requirements: absent dari rescue.
- legacy test suite: absent dari rescue.
- build script/generator: absent dari rescue.
- bundled dependency/vendor package: absent dari rescue.
- workflow CI: tidak termasuk rescue source; coordinator repo juga tidak menyediakan workflow untuk aplikasi pada baseline R0.
- compile/build step: tidak terbukti diperlukan; bentuk source adalah Chrome MV3 extension folders.
- target historical packaging: Runner 01–10 siap `Load unpacked`, bukan EXE.

Absence di atas adalah fakta snapshot rescue, bukan klaim mengenai seluruh sejarah repo lama.

## 4. Syntax/static gate

### Evidence dari Chat 1

Chat 1 menjalankan `node --check` terhadap seluruh 40 recovered JavaScript files:

- Node: `v22.16.0`
- JS checked: 40
- PASS: 40
- FAIL: 0

Ini adalah current recovered-source syntax evidence, tetapi eksekusinya berasal dari worker Chat 1. Chat 3 tidak mengubahnya menjadi behavior PASS.

### Harness Chat 3

Chat 3 menambahkan:

`recovery-tests/verify-recovered-snapshot.mjs`

Provenance di file:

```text
PROVENANCE: RECONSTRUCTED_FROM_DOCS
LEGACY_TEST: false
SOURCE_UNDER_TEST: Chat 1 commit 4719c0e17e83bf03afd141b96156614f83b9631a
```

Harness memverifikasi:

1. directory Runner 01–10 tepat;
2. tiap runner berisi tepat 8 expected files;
3. SHA-256 shared files sesuai verified rescue;
4. enam variant `interruption-bypass.js` sesuai rescue;
5. 10 manifest runner-specific sesuai rescue;
6. manifest MV3 version `0.1.8`, service worker, popup, dan content script order;
7. `node --check` pada 40 JS.

Run lokal setelah Chat 1 source dan Chat 3 harness berada pada working tree yang sama:

```powershell
node .\recovery-tests\verify-recovered-snapshot.mjs .\extensions
```

atau Bash:

```bash
node recovery-tests/verify-recovered-snapshot.mjs extensions
```

Chat 3 tidak mengklaim harness PASS sampai command tersebut benar-benar berjalan terhadap exact source tree.

## 5. Current environment limitation

Pada sesi Chat 3, exact source dapat dibaca melalui GitHub connector, tetapi environment eksekusi lokal tidak dapat melakukan `git clone` dari `github.com` karena DNS/network egress diblok. Karena itu independent local rerun Chat 3 terhadap seluruh source tree belum dilakukan.

Status jujur:

- source/inventory: `PASS` berdasarkan exact Chat 1 source evidence;
- Chat 1 syntax run: `PASS 40/40`;
- independent Chat 3 harness run terhadap source: `SKIP — source checkout unavailable in execution environment`;
- Chrome integration: `NOT RUN`;
- ChatGPT live: `NOT RUN`.

## 6. Reconstructed deterministic behavior harness policy

Snapshot verifier di atas hanya static/integrity harness. Behavior regression harness baru boleh ditambah jika ia mengeksekusi fungsi/kontrak yang benar-benar diturunkan dari source exact commit.

Bila dibuat, mock boundary dapat mencakup DOM, `chrome.storage`, `chrome.runtime`, timer, dan send button. Hasil wajib dilabeli **mock/regression**, bukan Chrome/live.

Jangan membuat regression test yang sekadar mengabadikan bug lama sebagai desired behavior.

## 7. Chrome extension integration

Prasyarat:

- source Chat 1 dan harness Chat 3 telah terintegrasi dalam review tree;
- Chrome tersedia;
- folder runner yang diuji jelas.

Minimum checklist:

1. Runner 01–10 dapat `Load unpacked`;
2. tidak ada manifest/service-worker error saat load;
3. popup terbuka;
4. content scripts terinjeksi pada host yang diizinkan;
5. storage/runtime messaging bekerja;
6. reload/background/service-worker restart dicatat;
7. dua runner pada tab sama diuji bila behavior coordination sudah diimplementasikan.

Status saat ini: `NOT RUN`.

## 8. ChatGPT live smoke

Harus terpisah dari Chrome integration. Gunakan prompt uji sederhana, bukan antrean pengguna asli.

Minimum smoke:

- normal multi-prompt;
- pause/reset saat menunggu;
- interruption/failed;
- approval/confirmation pause;
- navigation ke percakapan lain;
- manual draft preservation;
- duplicate-send prevention.

Catat browser version, locale, tanggal, target commit, dan keterbatasan selector.

Status saat ini: `NOT RUN`.

## 9. Acceptance matrix T01–T30

Semua item berikut berasal dari master ASTRA dan tetap `RECONSTRUCTED_FROM_DOCS / NOT RUN` sampai behavior diuji pada implementation yang relevan:

- T01 Normal: 3 prompt berurutan; tepat 3 send, urutan benar, tidak mendahului respons.
- T02 Respons selesai sangat cepat di antara polling; tetap dikenali tanpa duplikat.
- T03 Respons panjang/tool/thinking diam >3 polling; tidak auto-next sebelum terminal.
- T04 Interruption sesudah teks parsial; next prompt satu kali sesudah delay.
- T05 Error sebelum assistant turn pertama; tidak hang selamanya, status jelas.
- T06 Regenerate/Continue lama atau hidden; tidak menyelesaikan item aktif.
- T07 Jawaban sebelumnya memiliki copy; item berikut gagal tanpa turn baru; tidak salah sukses.
- T08 Approval aktif in-view, di luar viewport, dialog, dan label teks-only; pause konsisten.
- T09 Approval historis/hidden; tidak pause palsu.
- T10 Pause pada setiap await sebelum klik; tidak ada klik sesudah pause.
- T11 Reset pada setiap await sebelum klik; tidak ada klik/state revival.
- T12 Reset sesudah klik sebelum acceptance; tidak ada mutasi sesi baru atau retry buta.
- T13 Launcher response terlambat setelah reset/start/owner change; diabaikan.
- T14 Timeout send dengan user turn terlambat; resume rekonsiliasi, tidak duplikat.
- T15 Reload sebelum klik, setelah klik, generating, waiting-delay; tidak loncat/duplikat.
- T16 A→B/New chat/Back/Forward; pause sesi lama. New-chat→ID setelah kirim pertama sah.
- T17 Owner tab close/restart/restore; recovery jelas tanpa reset progres sembarang.
- T18 Composer remount/kosong tanpa user turn; tidak false accepted.
- T19 Draf manual/teks berubah saat wait; draf dipertahankan, tidak salah kirim.
- T20 Draf popup ditutup sebelum Mulai; muncul lagi tanpa mengubah active queue.
- T21 Popup terbuka saat launcher mengganti queue; tampilan dan resume sesuai revision.
- T22 Manual pause + pending replacement; status pause dipertahankan.
- T23 Continue launcher saat paused dengan queue sama/berbeda; tidak ReferenceError.
- T24 Dua runner pada tab sama: maksimal satu send; tab berbeda tetap independen.
- T25 Status akhir campuran sukses/interrupted/failed akurat dan item dapat ditelusuri.
- T26 0, 1, 100, 101 item; payload invalid; delay di batas; jalur popup dan launcher konsisten.
- T27 10 paket hasil generator konsisten dan masing-masing dapat Load unpacked.
- T28 Upgrade state 0.1.8, storage write failure, stale state event: tidak merusak antrean.
- T29 Background tab/sleep/wake/Chrome service worker restart: ukur dan dokumentasikan batas nyata.
- T30 Selector ChatGPT Bahasa Indonesia/Inggris, chat panjang, file/tool output: uji live terpisah.

25 reproduksi audit lama tetap historical reproduction evidence, bukan current recovered test suite.

## 10. Result taxonomy

| Layer | Current status |
|---|---|
| Exact rescue/source inventory | `PASS` |
| Manifest structure/version | `PASS` — source evidence Chat 1 |
| JS syntax | `PASS 40/40` — executed by Chat 1 |
| Chat 3 reconstructed snapshot harness | `SKIP / NOT RUN against source` |
| Behavior mock/regression | `NOT RUN` |
| Chrome MV3 integration | `NOT RUN` |
| ChatGPT live | `NOT RUN` |
| Load-unpacked Runner 01–10 | `NOT RUN` |

## 11. Evidence record template

```text
DATE:
WORKER:
SOURCE_BRANCH:
SOURCE_COMMIT:
OS:
NODE_VERSION:
CHROME_VERSION:
COMMAND:
TEST_LAYER:
PROVENANCE:
RESULT: PASS | FAIL | SKIP | NOT RUN
ARTIFACTS/LOGS:
LIMITATIONS:
```

## 12. Gate berikutnya untuk Chat 5

1. Integrasikan/review Chat 1 source commit lebih dulu.
2. Integrasikan Chat 3 harness/docs tanpa mengubah source.
3. Pada combined working tree jalankan `node recovery-tests/verify-recovered-snapshot.mjs extensions`.
4. Simpan stdout/stderr dan exact integrated commit SHA.
5. Baru lanjut ke deterministic behavior regression, Chrome integration, lalu ChatGPT live sebagai layer terpisah.
6. Jangan menutup gap 81-vs-80 dengan file tebakan.
