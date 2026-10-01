# TEST_RECOVERY_PLAN — Chat 3 / SOL-C — Recovery R0

Tanggal: 2026-10-01
Branch: `recovery/chat3-test-build-r0`
Status dokumen: `RECONSTRUCTED_FROM_DOCS`

## 1. Tujuan

Dokumen ini mendefinisikan cara membuktikan snapshot recovery ChatGPT Queue Runner bekerja tanpa mengubah core source dan tanpa menganggap evidence audit lama sebagai test suite recovered.

Aturan utama:

- `PASS` hanya boleh dipakai untuk test yang benar-benar dijalankan pada source recovery yang dapat diidentifikasi.
- `FAIL` hanya dipakai bila command/test benar-benar dijalankan dan gagal.
- `SKIP` dipakai bila test sengaja tidak dijalankan karena dependency belum tersedia.
- `NOT RUN` dipakai bila belum ada eksekusi pada sesi/commit yang dilaporkan.
- Harness baru di masa recovery harus berada di `recovery-tests/**` dan dilabeli `RECONSTRUCTED_FROM_DOCS` atau `RECONSTRUCTED_FROM_BEHAVIOR`.
- Chrome integration dan ChatGPT live tidak boleh dianggap lulus hanya karena static/mock test lulus.

## 2. Baseline evidence

### 2.1 Current recovery repository

`VERIFIED_SOURCE` untuk state repo recovery saat audit Chat 3:

- coordinator commit: `083ed5030d6a6304e9f720ce6edcec5b4ce83288` (`recovery: add R0 worker assignment`);
- current `main` hanya memiliki `docs/recovery/RECOVERY_ASSIGNMENT.md` di bawah tree yang terlihat;
- branch `recovery/chat1-source-r0` sudah ada, tetapi pada audit Chat 3 belum memiliki `extensions/**`;
- karena source belum masuk ke branch Chat 1, syntax/static test terhadap recovered JS belum dapat dijalankan secara jujur.

### 2.2 Historical ASTRA audit

`RECONSTRUCTED_FROM_DOCS` dari master audit 28 September 2026, repo lama `tonitarung099-creator/ChatGPT-Queue-Runner`, commit `7bcfbf7cdfa87303f21d5f979796200880e355ae`:

- manifest version dilaporkan `0.1.8`;
- 10 runner extension;
- tree lama dilaporkan 81 file;
- tidak ada `AGENTS.md`, test suite, `package.json`, build script, atau workflow CI;
- 40 file JavaScript dilaporkan lulus `node --check`;
- harness Node VM lama mereproduksi 13 state-machine case + 12 synthetic DOM case = 25 skenario reproduksi;
- audit lama tidak melakukan Chrome extension integration nyata atau pengiriman prompt ke akun ChatGPT nyata.

Evidence ini **bukan** current recovery PASS.

## 3. Model build/release yang harus diverifikasi

Status awal: `UNKNOWN` sampai Chat 1 source tersedia.

Historical docs menunjukkan target paket adalah Chrome extension Runner 01–10 yang siap `Load unpacked`, bukan EXE. Tidak ada bukti adanya compile step atau dependency install step pada baseline lama.

Setelah source Chat 1 tersedia, Chat 3 harus menginventarisasi:

1. `manifest.json` semua Runner 01–10;
2. versi manifest aktual;
3. semua `.js`, `.html`, `.css`, README/config yang masuk paket;
4. `package.json`, lockfile, requirements, vendor dependency, bila ternyata ada;
5. `.github/workflows/**`, bila ada;
6. generator/build/packaging script, bila ada;
7. launcher/local endpoint dependency bila ada di source/docs;
8. executable/binary, bila ada;
9. perbedaan file antar-runner yang berdampak pada test matrix.

## 4. Tahapan validasi recovery

### Phase A — Source gate / inventory

Prasyarat: branch Chat 1 sudah memiliki commit source recovered.

Commands contoh:

```powershell
git fetch origin recovery/chat1-source-r0
git ls-tree -r --name-only origin/recovery/chat1-source-r0
```

Catat commit SHA yang diuji. Jangan menguji branch floating tanpa merekam SHA.

Acceptance:

- tree source dapat diidentifikasi;
- manifest Runner 01–10 dapat ditemukan bila memang tersedia;
- file build/test/CI diklasifikasikan `PRESENT`, `ABSENT`, atau `UNKNOWN` berdasarkan tree nyata.

### Phase B — Syntax/static validation

Prasyarat: recovered JS tersedia.

PowerShell:

```powershell
$files = git ls-tree -r --name-only <CHAT1_SHA> | Where-Object { $_ -match '\.js$' }
foreach ($f in $files) {
  git show "<CHAT1_SHA>:$f" | node --check -
  if ($LASTEXITCODE -ne 0) { throw "node --check failed: $f" }
}
```

Alternatif bila source sudah di-checkout lokal:

```powershell
Get-ChildItem -Recurse -Filter *.js extensions | ForEach-Object {
  node --check $_.FullName
  if ($LASTEXITCODE -ne 0) { throw "node --check failed: $($_.FullName)" }
}
```

Wajib catat:

- `node --version`;
- OS;
- source commit SHA;
- jumlah JS yang diperiksa;
- file yang gagal, bila ada.

`node --check` hanya memberi status syntax/static, bukan behavior PASS.

### Phase C — Reconstructed deterministic regression harness

Hanya dibuat setelah source nyata tersedia dan fungsi/kontrak yang diuji dapat ditautkan ke source tersebut.

Lokasi yang diizinkan: `recovery-tests/**`.

Setiap file harness wajib menyatakan:

```text
PROVENANCE: RECONSTRUCTED_FROM_DOCS
LEGACY_TEST: false
SOURCE_UNDER_TEST: <commit SHA + path>
```

Harness boleh mock boundary seperti DOM, `chrome.storage`, `chrome.runtime`, timer, dan send button, tetapi hasilnya harus dilaporkan sebagai **mock/regression**, bukan Chrome/live.

Dilarang menulis harness yang hanya memvalidasi asumsi tentang behavior yang tidak dapat diturunkan dari source/evidence.

### Phase D — Chrome extension integration

Prasyarat:

- source/package sudah teridentifikasi;
- manifest valid;
- folder Runner yang diuji jelas;
- Chrome tersedia di environment yang menjalankan test.

Minimum manual/integration checklist:

1. setiap Runner 01–10 dapat dipilih lewat `Load unpacked`;
2. tidak ada manifest/service-worker error saat load;
3. popup dapat dibuka;
4. content script benar-benar terinjeksi pada target yang diizinkan;
5. state/storage messaging bekerja pada skenario fixture atau halaman aman;
6. dua runner pada tab sama tidak menghasilkan double-send bila behavior itu sudah menjadi acceptance target;
7. background tab / reload / service worker restart dicatat sebagai hasil nyata, bukan asumsi.

Status harus `NOT RUN` bila Chrome environment tidak benar-benar dipakai.

### Phase E — ChatGPT live smoke

Ini kategori terpisah dari Chrome integration.

Gunakan prompt uji sederhana; jangan gunakan antrean pengguna asli sebagai test data tanpa kebutuhan/otorisasi.

Minimum smoke:

- normal multi-prompt;
- pause/reset saat menunggu;
- interruption/failed behavior;
- approval/confirmation pause;
- navigation ke percakapan lain;
- draft manual tidak tertimpa;
- tidak ada duplicate send.

Catat locale, browser version, tanggal, dan keterbatasan selector. Bila tidak dijalankan, status `NOT RUN`.

## 5. Acceptance matrix recovered dari dokumen lama

Status seluruh item di bawah pada awal Recovery R0: `RECONSTRUCTED_FROM_DOCS / NOT RUN` sampai diuji pada source recovery.

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
- T30 Selector pada ChatGPT Bahasa Indonesia/Inggris, chat panjang, file/tool output: uji live terpisah.

Catatan: 25 skenario reproduksi audit lama bukan test suite recovered. T01–T30 adalah acceptance matrix untuk pekerjaan validasi/perbaikan berikutnya.

## 6. Result taxonomy

Setiap laporan wajib memisahkan baris berikut:

| Layer | Contoh | Status yang valid |
|---|---|---|
| Source/inventory | manifest/tree/dependency | PASS/FAIL/SKIP/NOT RUN |
| Syntax/static | `node --check` | PASS/FAIL/SKIP/NOT RUN |
| Mock/regression | Node VM / fixture | PASS/FAIL/SKIP/NOT RUN |
| Chrome integration | MV3/load-unpacked/storage/service worker | PASS/FAIL/SKIP/NOT RUN |
| ChatGPT live | selector + real page + real responses | PASS/FAIL/SKIP/NOT RUN |
| Packaging | 10 runner ZIP/layout | PASS/FAIL/SKIP/NOT RUN |

## 7. Evidence record template

Untuk setiap run:

```text
DATE:
WORKER: Chat 3 / SOL-C
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

## 8. Current gate

Pada audit Chat 3 2026-10-01, branch Chat 1 belum memiliki source recovered. Karena itu:

- syntax/static: `SKIP — source dependency unavailable`;
- mock/regression: `NOT RUN`;
- Chrome integration: `NOT RUN`;
- ChatGPT live: `NOT RUN`;
- packaging: `NOT RUN`.

Langkah berikutnya setelah Chat 1 commit source adalah menjalankan Phase A lalu Phase B sebelum membuat harness baru apa pun.
