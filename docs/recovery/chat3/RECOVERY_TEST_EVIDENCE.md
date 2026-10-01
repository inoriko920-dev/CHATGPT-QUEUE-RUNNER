# RECOVERY_TEST_EVIDENCE — Chat 3 / SOL-C — Recovery R0

Tanggal: 2026-10-01
Worker branch: `recovery/chat3-test-build-r0`
Coordinator baseline: `083ed5030d6a6304e9f720ce6edcec5b4ce83288`
Exact source under evidence: `recovery/chat1-source-r0@4719c0e17e83bf03afd141b96156614f83b9631a`

## 1. Scope / provenance

Chat 3 memisahkan empat lapisan evidence:

1. exact rescue/source inventory;
2. syntax/static;
3. reconstructed mock/regression;
4. Chrome integration / ChatGPT live.

Tidak ada layer yang dipromosikan ke layer lebih tinggi. Syntax PASS bukan behavior PASS.

## 2. Exact current source evidence

`VERIFIED_SOURCE`

Chat 1 sekarang telah mengimpor rescue exact pada commit:

`4719c0e17e83bf03afd141b96156614f83b9631a` — `recovery(chat1): import verified extensions rescue`

Evidence source:

- rescue SHA-256: `f46767d61dff61c2b0ce7dc413fc7dbe29f78d0029c17a2259d54bd96c5ddd56`;
- documented expected SHA-256: sama;
- hash result: `MATCH`;
- 80 files under `extensions/**`;
- 10 runner directories `chat-queue-runner-01` s.d. `chat-queue-runner-10`;
- 8 files per runner: `background.js`, `content.js`, `interruption-bypass.js`, `manifest.json`, `popup.css`, `popup.html`, `popup.js`, `README.md`;
- APP SOURCE 60, CONFIG 10, DOCS 10;
- TEST 0, BUILD SCRIPT 0, BUNDLED DEPENDENCY 0, GENERATED 0, BINARY/PORTABLE 0.

Historical audit menyebut 81 files. Rescue exact hanya 80. Identitas/path/content file ke-81 tetap `UNKNOWN`; tidak ada file yang direkonstruksi untuk menutup selisih.

## 3. Dependency / build / CI inventory

| Item | Exact rescue result | Status |
|---|---|---|
| `package.json` | tidak ada di rescue | `ABSENT` |
| npm/yarn/pnpm lockfile | tidak ada di rescue | `ABSENT` |
| Python requirements | tidak ada di rescue | `ABSENT` |
| legacy test files | count 0 | `ABSENT` |
| build script / generator | count 0 | `ABSENT` |
| bundled dependency/vendor | count 0 | `ABSENT` |
| binary / executable portable | count 0 | `ABSENT` |
| extension manifests | 10 | `PRESENT` |
| app source `.js/.css/.html` | 60 | `PRESENT` |
| docs README | 10 | `PRESENT` |
| GitHub Actions workflow in rescue | bukan bagian rescue | `ABSENT FROM RESCUE` |

Catatan: `ABSENT` berarti tidak ada pada verified 80-file rescue snapshot, bukan klaim bahwa file tersebut tidak pernah ada dalam seluruh sejarah proyek.

## 4. Manifest verification

`VERIFIED_SOURCE`

Chat 1 memverifikasi 10/10 manifest parse dan memiliki:

- `manifest_version: 3`;
- version `0.1.8`;
- service worker `background.js`;
- popup `popup.html`;
- content scripts dalam urutan `interruption-bypass.js`, `content.js`.

Chat 3 juga membuka langsung manifest Runner 01 pada exact commit source dan mengonfirmasi struktur tersebut.

Result: `PASS — source structure/version evidence`.

## 5. JavaScript syntax evidence

### 5.1 Current source worker execution

`VERIFIED_SOURCE / STATIC`

Chat 1 benar-benar menjalankan `node --check` terhadap seluruh recovered JavaScript files:

- Node: `v22.16.0`
- JavaScript checked: 40
- PASS: 40
- FAIL: 0

Result: `PASS 40/40`, dengan scope **syntax/static only**.

### 5.2 Independent Chat 3 execution attempt

Chat 3 mencoba memperoleh checkout lokal exact branch untuk rerun independen. Command ekuivalen:

```bash
git clone --branch recovery/chat1-source-r0 --single-branch \
  https://github.com/inoriko920-dev/CHATGPT-QUEUE-RUNNER.git
```

Environment eksekusi menolak network/DNS ke `github.com` (`Could not resolve host: github.com`). Source tetap dapat dibaca melalui GitHub connector, tetapi connector tidak menyediakan checkout filesystem langsung untuk proses `node` lokal.

Karena itu Chat 3 **tidak** menulis independent `PASS` kedua.

Result independent Chat 3: `SKIP — exact source checkout unavailable in execution environment`.

## 6. Reconstructed snapshot verifier

Chat 3 menambahkan:

`recovery-tests/verify-recovered-snapshot.mjs`

Label:

- `PROVENANCE: RECONSTRUCTED_FROM_DOCS`
- `LEGACY_TEST: false`
- target source commit `4719c0e17e83bf03afd141b96156614f83b9631a`

Harness memeriksa:

- exact Runner 01–10 layout;
- exact expected files per runner;
- SHA-256 file shared, interruption variants, dan runner-specific manifests;
- manifest MV3/version/service worker/popup/content scripts;
- `node --check` terhadap 40 JS;
- exact count 40 JS.

Command setelah source dan harness berada di working tree yang sama:

```powershell
node .\recovery-tests\verify-recovered-snapshot.mjs .\extensions
```

Status run terhadap exact source saat Chat 3 handoff ini: `NOT RUN / SKIP`, karena source commit dan harness berada pada worker branches terpisah dan local checkout GitHub tidak tersedia di execution environment.

Harness ini **bukan** behavior regression test dan tidak membuktikan Chrome/ChatGPT runtime.

## 7. Historical behavior evidence — tetap bukan current PASS

`RECONSTRUCTED_FROM_DOCS`

Master ASTRA lama terhadap repo lama/commit `7bcfbf7cdfa87303f21d5f979796200880e355ae` mencatat 25 reproduksi controlled/mock yang antara lain mencakup B01–B14: missing `queuesMatch` scope, pause/reset race, late replacement, cross-conversation send, timeout/old response confusion, detached composer, manual draft overwrite, uncertain resend, reload persistence, multi-runner collision, hidden regenerate, dan approval detection.

Reproduksi lama sengaja membuktikan baseline behavior bermasalah. Ia bukan recovered legacy test suite dan bukan bukti B01–B19 sudah diperbaiki.

Current rescued source behavior status: `NOT RUN`.

## 8. PASS / FAIL / SKIP / NOT RUN matrix

| Layer | Result | Evidence |
|---|---|---|
| Coordinator assignment readable | `PASS` | baseline coordinator dibaca |
| Exact Chat 1 source dependency | `PASS` | commit `4719c0e...` tersedia |
| Rescue SHA identity | `PASS` | documented hash `MATCH` |
| 10 runner / 80 file inventory | `PASS` | verified source inventory |
| Dependency/build/test inventory | `PASS` | 0 test/build/dependency/binary dalam rescue |
| 10 manifests parse | `PASS` | Chat 1 source verification |
| Manifest MV3/version 0.1.8 | `PASS` | 10/10 source evidence |
| Current JS syntax | `PASS 40/40` | executed by Chat 1, Node v22.16.0 |
| Independent Chat 3 syntax rerun | `SKIP` | local source checkout blocked by environment network |
| Chat 3 snapshot harness | `NOT RUN` against source | branch separation + no local checkout |
| Behavior mock/regression | `NOT RUN` | no new behavior harness executed |
| Chrome `Load unpacked` | `NOT RUN` | browser integration not executed |
| MV3 service worker/reload | `NOT RUN` | browser integration not executed |
| ChatGPT live normal queue | `NOT RUN` | live page not exercised |
| ChatGPT interruption/approval | `NOT RUN` | live page not exercised |
| Final package ZIP | `NOT RUN` | Chat 3 tidak membangun final package |

Tidak ada behavior test current yang berstatus FAIL. Historical bug reproductions tetap historical evidence.

## 9. Portable/package evidence

Rescue source adalah Chrome extension source tree, bukan Windows executable.

- verified rescue: 80 files / 10 runners;
- binary/portable executable: 0;
- target historical distribution: extension folder/ZIP siap `Load unpacked`;
- actual Chrome load-unpacked pada current recovered source: `NOT RUN`.

Jangan menyebut source berasal dari artifact build; provenance adalah rescue source ZIP yang diverifikasi Chat 1.

## 10. Cross-runner drift relevant to test

Verified rescue menunjukkan:

- byte-identical Runner 01–10: `background.js`, `content.js`, `popup.css`, `popup.html`, `popup.js`, `README.md`;
- `interruption-bypass.js`: 6 unique payloads; Runner 01–05 masing-masing berbeda, Runner 06–10 identik;
- `manifest.json`: runner-specific, seluruhnya version `0.1.8`.

Karena itu behavior testing tidak boleh hanya menganggap semua file byte-identical. Minimal interruption variants dan manifest identities harus tetap tercakup.

## 11. Known platform limitations — current status

Masih `NOT RUN / UNKNOWN` terhadap runtime current:

- React/ProseMirror behavior nyata;
- Chrome MV3 isolated world;
- service worker restart;
- tab throttling/background sleep/wake;
- virtualized long conversation;
- current ChatGPT selectors;
- file/tool/image output;
- locale Bahasa Indonesia/Inggris;
- launcher localhost endpoint end-to-end;
- dua runner nyata pada tab sama.

## 12. Next integration gate

Chat 5 harus:

1. review/integrasikan Chat 1 source commit first;
2. integrasikan Chat 3 docs + reconstructed snapshot verifier;
3. jalankan `node recovery-tests/verify-recovered-snapshot.mjs extensions` pada combined exact tree;
4. simpan logs dan integrated SHA;
5. setelah static gate PASS, lanjutkan mock/regression behavior;
6. Chrome integration dan ChatGPT live tetap layer tersendiri;
7. jangan mengarang historical file ke-81.
