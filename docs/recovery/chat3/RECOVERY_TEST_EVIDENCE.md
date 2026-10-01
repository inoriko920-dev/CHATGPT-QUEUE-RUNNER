# RECOVERY_TEST_EVIDENCE — Chat 3 / SOL-C — Recovery R0

Tanggal audit: 2026-10-01
Branch worker: `recovery/chat3-test-build-r0`
Coordinator baseline: `083ed5030d6a6304e9f720ce6edcec5b4ce83288`

## 1. Scope dan provenance

Dokumen ini mencatat evidence test/build yang benar-benar tersedia saat Chat 3 berjalan.

Label provenance yang digunakan:

- `VERIFIED_SOURCE` — diamati langsung pada repo recovery saat ini;
- `VERIFIED_FROM_BUILD` — hanya jika artifact build benar-benar tersedia dan diperiksa;
- `RECONSTRUCTED_FROM_DOCS` — berasal dari dokumen/audit lama;
- `RECONSTRUCTED_FROM_BEHAVIOR` — berasal dari observasi behavior yang dapat diverifikasi;
- `UNKNOWN` — belum dapat dibuktikan.

Tidak ada claim `VERIFIED_FROM_BUILD` pada run ini karena tidak ada artifact build/source recovered yang tersedia untuk Chat 3.

## 2. Current repository evidence

### 2.1 Main/coordinator

`VERIFIED_SOURCE`

- Repo: `inoriko920-dev/CHATGPT-QUEUE-RUNNER`.
- Commit baseline: `083ed5030d6a6304e9f720ce6edcec5b4ce83288`.
- File yang terlihat pada root baseline: hanya tree `docs/`; di dalamnya terdapat `docs/recovery/RECOVERY_ASSIGNMENT.md`.
- Tidak ada current `extensions/**` pada baseline coordinator yang diaudit Chat 3.

### 2.2 Chat 1 source branch gate

`VERIFIED_SOURCE`

- Branch `recovery/chat1-source-r0` ada.
- Branch tersebut diperiksa dua kali selama pekerjaan Chat 3.
- Pada kedua pemeriksaan root hanya menampilkan `docs/`; `extensions/**` belum tersedia.
- Akibatnya source recovered tidak dapat dijadikan target current syntax/behavior test pada run ini.

## 3. Dependency / build / CI inventory

| Item | Current recovery evidence | Historical evidence | Current status |
|---|---|---|---|
| `package.json` | tidak terlihat pada current recovery baseline/source branch yang tersedia | audit lama menyatakan tidak ada | `SKIP — source recovery belum tersedia` |
| lockfile npm/yarn/pnpm | belum dapat diaudit pada source recovered | tidak dilaporkan pada audit lama | `UNKNOWN` |
| Python requirements | belum dapat diaudit pada source recovered | tidak dilaporkan | `UNKNOWN` |
| build script | belum dapat diaudit pada source recovered | audit lama menyatakan tidak ada | `SKIP` |
| workflow CI | belum dapat diaudit pada source recovered | audit lama menyatakan tidak ada | `SKIP` |
| legacy test suite | belum dapat diaudit pada source recovered | audit lama menyatakan tidak ada | `SKIP` |
| recovery harness | belum dibuat karena source target belum tersedia | N/A | `NOT RUN` |
| manifest Runner 01–10 | belum tersedia di Chat 1 branch saat audit | versi lama dilaporkan 0.1.8 | `SKIP` |
| generator/package script | belum dapat diverifikasi | audit lama menyatakan build generator tidak ada | `UNKNOWN / NOT RUN` |
| Chrome MV3 load-unpacked | source belum tersedia | belum diuji live pada audit lama | `NOT RUN` |
| ChatGPT live | tidak dijalankan | tidak dijalankan pada audit lama | `NOT RUN` |

Catatan penting: `ABSENT` untuk snapshot lama tidak otomatis berarti `ABSENT` pada rescued snapshot. Current rescued source harus diperiksa setelah Chat 1 commit tersedia.

## 4. Historical test evidence — bukan current PASS

`RECONSTRUCTED_FROM_DOCS`

Master ASTRA 28 September 2026 terhadap repo lama `tonitarung099-creator/ChatGPT-Queue-Runner`, commit `7bcfbf7cdfa87303f21d5f979796200880e355ae`, mendokumentasikan:

- tree 81 file;
- manifest 0.1.8 untuk Runner 01–10;
- 40 file JavaScript lulus `node --check`;
- harness Node VM lama mereproduksi 13 kasus state-machine + 12 kasus DOM sintetis = 25 reproduksi;
- reproduksi itu mengonfirmasi behavior salah pada baseline lama dan bukan regression test yang menyatakan bug sudah diperbaiki;
- tidak ada Chrome extension integration nyata;
- tidak ada ChatGPT live test.

Karena current rescued source belum hadir, hasil historis di atas tidak dipromosikan menjadi current recovery result.

## 5. Historical behavior evidence yang perlu dipertahankan sebagai target verifikasi

`RECONSTRUCTED_FROM_DOCS`

Audit lama mencatat reproduksi behavior berikut pada baseline lama:

- B01 launcher continue memanggil `queuesMatch` yang tidak tersedia di content-script scope;
- B02 pause saat wait masih dapat diikuti send;
- B02 reset saat wait masih dapat diikuti send/state mutation;
- B03 late replacement response dapat menghidupkan kembali reset session;
- B04 navigasi ke percakapan berbeda masih dapat mengirim queue;
- B05 user prompt accepted tanpa assistant dapat hang tanpa timeout;
- B06 old assistant response dapat dianggap completion untuk item baru yang gagal;
- B07 detached composer dapat dianggap accepted tanpa turn;
- B08 send dapat menimpa manual draft;
- B09 pending replacement dapat memulai paused queue sebelum block check;
- B10 resume setelah uncertain send dapat mengirim ulang prompt yang sudah accepted;
- B11 `sawGenerating` tidak persisted sebelum reload;
- B12 dua runner independen dapat sama-sama send pada tab yang sama;
- B13 hidden regenerate dari old turn dapat menandai latest turn complete, direproduksi pada Runner 01–10;
- B14 approval offscreen/text-only tidak terdeteksi.

Status current: seluruh item `NOT RUN` terhadap rescued source.

## 6. Commands dan execution record

### 6.1 Command yang dijalankan / evidence retrieval

Pada sesi Chat 3, evidence current diperoleh melalui GitHub repository/branch inspection, bukan local clone/build execution.

Branch/source check yang ekuivalen dengan target verifikasi lokal:

```powershell
git fetch origin main recovery/chat1-source-r0 recovery/chat3-test-build-r0
git ls-tree -r --name-only origin/main
git ls-tree -r --name-only origin/recovery/chat1-source-r0
```

Current observed result: source `extensions/**` belum hadir pada branch Chat 1.

### 6.2 Commands yang belum dijalankan karena dependency source tidak tersedia

```powershell
node --version
Get-ChildItem -Recurse -Filter *.js extensions | ForEach-Object { node --check $_.FullName }
```

Result: `SKIP — no recovered JS source available to Chat 3 at audit time`.

Tidak ada perintah test/harness yang dijalankan, sehingga tidak ada `PASS` mock/regression.

## 7. PASS / FAIL / SKIP / NOT RUN matrix

| Layer | Result | Alasan |
|---|---|---|
| Recovery assignment readable | `PASS` | coordinator file tersedia dan dibaca |
| Chat 3 worker branch writable | `PASS` | recovery docs berhasil ditulis pada branch worker |
| Chat 1 source dependency present | `FAIL` sebagai gate / bukan source failure | branch ada tetapi source belum hadir saat audit |
| Current dependency inventory | `SKIP` | source rescued belum tersedia |
| Current manifest/version verification | `SKIP` | `manifest.json` belum tersedia |
| Current `node --check` | `SKIP` | tidak ada recovered JS yang dapat diuji |
| Legacy/current automated test suite | `SKIP` | legacy test suite historically absent; current source belum tersedia |
| Reconstructed recovery harness | `NOT RUN` | sengaja belum dibuat agar tidak menguji behavior tebakan |
| Chrome load-unpacked | `NOT RUN` | source package tidak tersedia |
| Chrome MV3 service worker/reload | `NOT RUN` | Chrome integration tidak dijalankan |
| ChatGPT live normal queue | `NOT RUN` | live test tidak dijalankan |
| ChatGPT live interruption/approval | `NOT RUN` | live test tidak dijalankan |
| Packaging 10 runner | `NOT RUN` | rescued source/layout belum tersedia |

Keterangan: baris `Chat 1 source dependency present` adalah kegagalan gate ketersediaan dependency pada saat audit, bukan klaim bahwa source rescue rusak atau gagal dipulihkan.

## 8. Portable / package behavior evidence

### Current

`UNKNOWN / NOT RUN`

Chat 3 tidak memiliki `extensions.zip` sebagai input langsung pada sesi ini dan source Chat 1 belum di-import. Karena itu Chat 3 tidak mengklaim membuka, mengekstrak, atau menjalankan portable/package rescue.

### Historical/documented

`RECONSTRUCTED_FROM_DOCS`

Coordinator assignment mendokumentasikan rescue `extensions.zip` sebagai:

- 80 file + 11 direktori;
- Runner 01–10;
- tanpa `.git`;
- SHA-256 terdokumentasi `f46767d61dff61c2b0ce7dc413fc7dbe29f78d0029c17a2259d54bd96c5ddd56`;
- status `RESCUED PARTIAL SNAPSHOT` sampai gap 81 vs 80 direkonsiliasi.

Historical target packaging adalah Chrome extension folder/ZIP siap `Load unpacked`, bukan executable Windows.

Tidak ada current behavior PASS yang diturunkan dari rescue ZIP pada run Chat 3 ini.

## 9. Missing test/build files / unresolved evidence

Sampai source Chat 1 tersedia, item berikut belum dapat diverifikasi pada rescued snapshot:

1. apakah `package.json` benar-benar tidak ada;
2. apakah ada lockfile atau dependency metadata lain;
3. apakah ada `.github/workflows/**`;
4. apakah ada build/package/generator script;
5. apakah ada legacy test file tersembunyi di rescue;
6. jumlah dan path tepat semua JS recovered;
7. manifest/version setiap Runner 01–10;
8. apakah tree rescue 80 file memiliki file build/test yang berbeda dari tree lama 81 file;
9. launcher/server component dan requirement aktualnya;
10. browser/Chrome minimum version;
11. status MV3 service worker setelah sleep/restart;
12. compatibility selector ChatGPT current;
13. locale Bahasa Indonesia/Inggris;
14. behavior file/tool output dan long conversation;
15. package ZIP final dan checksum current.

## 10. Known platform limitations dari evidence lama

`RECONSTRUCTED_FROM_DOCS`

Belum pernah dibuktikan pada current recovery:

- React/ProseMirror behavior nyata;
- Chrome MV3 isolated world sebenarnya;
- service worker restart;
- tab throttling/background sleep/wake;
- virtualized long conversations;
- selector pada ChatGPT terkini;
- file/tool/image output;
- launcher localhost endpoint contract end-to-end;
- dua runner nyata pada tab yang sama;
- UI locale variants.

## 11. Next gate untuk Chat 5

Setelah Chat 1 mengirim commit source:

1. rekam SHA Chat 1;
2. audit tree/dependency/build/test/CI aktual;
3. jalankan `node --check` pada seluruh recovered JS;
4. bandingkan jumlah JS/current manifest dengan historical evidence;
5. hanya bila source mendukung, buat reconstructed harness di `recovery-tests/**`;
6. jalankan mock regression dan simpan logs;
7. lakukan Chrome integration secara terpisah;
8. lakukan ChatGPT live smoke secara terpisah;
9. jangan merge worker branch otomatis; handoff ke Chat 5 terlebih dahulu.
