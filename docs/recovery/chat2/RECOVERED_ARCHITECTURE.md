# RECOVERED_ARCHITECTURE — ChatGPT Queue Runner

Tanggal recovery: 2026-10-01
Scope: pengetahuan arsitektur lama; tidak mengubah core source.

## 1. Dua arsitektur lama yang harus dibedakan

Recovery menemukan dua keadaan source yang berbeda:

1. **Old main v0.1.8** — commit `7bcfbf7cdfa87303f21d5f979796200880e355ae`.
2. **Old unmerged v0.2.0 branch** — branch `fix/astra-b01-b19-runner-reliability`, head `a36e4b74645d8c98a1ed9c7a5db4dbd3d3586d98`.

Jangan menggabungkan fakta dari keduanya tanpa menyebut versi/branch.

---

## 2. Old main v0.1.8 — VERIFIED_OLD_SOURCE

### 2.1 Bentuk distribusi

Produk adalah **10 Chrome extension terpisah**, Runner 01–10, berbasis Manifest V3.

Struktur `extensions.zip` yang berhasil diselamatkan:

```text
extensions/
  chat-queue-runner-01/
    background.js
    content.js
    interruption-bypass.js
    manifest.json
    popup.css
    popup.html
    popup.js
    README.md
  ...
  chat-queue-runner-10/
    (8 file yang sama jenisnya)
```

Total rescue: 80 file di `extensions/`.

Old main juga memiliki root `README.md`, sehingga tree 81 file yang disebut audit dapat direkonsiliasi sebagai 80 extension files + root README.

### 2.2 Kesamaan dan drift antar-runner

Audit v0.1.8 menemukan:

- `content.js`, `background.js`, `popup.js`, `popup.html`, `popup.css`, dan README per-runner identik di seluruh 10 folder;
- `interruption-bypass.js` mempunyai 6 varian byte; varian Runner 06–10 identik;
- manifest berbeda pada nama runner/judul aksi;
- seluruh varian bypass tetap mempunyai masalah marker completion yang sama.

### 2.3 Komponen

**`manifest.json`**

- Manifest V3;
- permissions lama mencakup `storage`, `activeTab`, `tabs`;
- host ChatGPT: `chatgpt.com` dan alamat lama `chat.openai.com`;
- localhost diizinkan untuk integrasi launcher.

**`background.js`**

- service worker extension;
- memberi/menangani identitas tab dan jalur launcher;
- pada v0.1.8 belum memiliki recovery owner yang cukup ketika tab ditutup/restart.

**`content.js`**

- controller runtime utama di halaman ChatGPT;
- mengisi composer, mengklik send, mengamati user/assistant turn, progres antrean, delay, pause/reset, dan launcher polling;
- state lama berpusat pada owner tab dan storage lokal;
- audit menemukan state-machine/race/recovery bugs B01–B18.

**`interruption-bypass.js`**

- ditambahkan pada v0.1.8 agar antrean dapat melewati jawaban ChatGPT yang dianggap terhenti;
- implementasi lama monkey-patch `Document.prototype.querySelectorAll` dan menyisipkan completion marker sintetis;
- audit menemukan mekanisme ini dapat membuat completion evidence palsu (B13).

**`popup.html` / `popup.css` / `popup.js`**

- UI antrean dan kontrol Mulai/Jeda/Reset;
- input prompt, delay, progress, status;
- audit menemukan masalah sync/draft pada B15/B17.

### 2.4 Storage/runtime

State dan antrean disimpan lokal melalui Chrome storage. Ini bukan layanan cloud proyek.

Audit v0.1.8 menunjukkan masalah penting:

- storage/revision belum cukup untuk menolak callback lama;
- acceptance dapat salah karena composer kosong/remount;
- inFlight tidak mempunyai lifecycle/watchdog yang cukup;
- evidence generating tidak selalu dipersist;
- multi-runner terpisah tidak mempunyai shared lock yang kuat.

### 2.5 Fondasi engineering pada v0.1.8

Pada baseline audit lama **tidak ada**:

- `AGENTS.md`;
- test suite repo;
- `package.json`;
- build script;
- GitHub Actions workflow.

40 JavaScript pernah lulus `node --check`, tetapi itu hanya syntax evidence.

---

## 3. Arah arsitektur ASTRA — PLANNED_ONLY pada saat audit

ASTRA menyarankan session controller eksplisit dengan phase seperti:

- `idle`
- `preparing`
- `sending`
- `awaiting-acceptance`
- `awaiting-response`
- `generating`
- `waiting-delay`
- `paused`
- `completed`

Field yang direncanakan:

- `schemaVersion`
- `revision`
- `sessionId/runId`
- `ownerTabId`
- `conversationIdentity`
- queue dengan `itemId` stabil
- config
- active attempt / `attemptId`
- baseline user/assistant turn identity
- outcome per item
- coded pause reason
- processed launcher command IDs
- popup draft terpisah

Invarian yang direncanakan ASTRA:

1. Maksimal satu operasi send per composer/conversation.
2. Jeda/Reset membatalkan aksi yang belum diklik.
3. Callback async lama tidak boleh menulis state sesi baru.
4. Empty/remounted composer bukan acceptance evidence.
5. Outcome harus terikat ke item dan turn yang benar.
6. Interruption terkonfirmasi boleh auto-next setelah delay.
7. Approval/izin tidak boleh auto-click/auto-skip.
8. Unknown/ambiguous tidak boleh dianggap completed atau retry buta.
9. Pindah percakapan harus pause, bukan meneruskan ke chat lain.
10. Draf pengguna tidak boleh ditimpa.
11. Semua Runner 01–10 harus menerima patch konsisten.

Pada dokumen ASTRA ini adalah `PLANNED_ONLY`, bukan bukti source sudah berubah.

---

## 4. Old branch v0.2.0 — VERIFIED_OLD_SOURCE (UNMERGED)

Branch lama ternyata mengimplementasikan banyak arah di atas.

Root branch berisi:

```text
.github/workflows/ci.yml
README.md
TEST_REPORT.md
extensions/
package.json
scripts/
src/
tests/
```

### 4.1 Sumber kanonik

`src/` menjadi sumber kanonik dan terverifikasi berisi:

- `README.md`
- `background.js`
- `content.js`
- `core.js`
- `interruption-bypass.js`
- `popup.css`
- `popup.html`
- `popup.js`

Generator digunakan untuk membuat paket Runner 01–10 agar patch tidak drift.

### 4.2 Tooling

`package.json` v0.2.0 mempunyai scripts:

```text
generate -> node scripts/generate-runners.mjs
test     -> node --test tests/*.test.js
validate -> node scripts/validate-packages.mjs
check    -> generate + test + validate
```

CI memakai Node 22 dan menjalankan `npm run check`.

### 4.3 Session/recovery hardening

PR lama dan source/test evidence menunjukkan implementasi untuk:

- runId/revision/epoch cancellation;
- sending journal sebelum side effect click;
- stronger acceptance berdasarkan user turn;
- conversation identity;
- stale launcher response rejection;
- manual-draft protection;
- per-item outcomes;
- owner-tab recovery;
- queue/config/state revision sync;
- popup draft terpisah;
- cross-runner coordination menggunakan lease/Web Locks contract;
- direct terminal/interruption classification tanpa fake copy-marker completion.

Status: `VERIFIED_OLD_SOURCE`; kontrak yang dites: `VERIFIED_OLD_TEST`. Branch ini **belum di-merge ke old main**.

---

## 5. UI reference yang berhasil dipulihkan

### 5.1 Code-level UI reference — VERIFIED_OLD_SOURCE

`src/popup.html` v0.2.0 memakai `<html lang="id">` dan label Indonesia:

- `CHATGPT AUTOMATION`
- `Queue Runner`
- `Status`
- `Siap`
- `Daftar pekerjaan`
- `Jeda setelah jawaban selesai`
- `Batas pekerjaan per sesi`
- `100 prompt`
- `Mulai`
- `Jeda`
- `Reset`
- `Semua prompt dan status disimpan lokal di browser ini.`

Popup juga menjelaskan satu baris = satu prompt dan draf disimpan otomatis.

### 5.2 Screenshot/reference image — UNKNOWN

Pencarian Library Chat 2 tidak menemukan screenshot UI khusus ChatGPT Queue Runner yang dapat diverifikasi. Karena itu jangan mengklaim ada gambar referensi 1:1.

Jika desain visual harus direkonstruksi, source `popup.html` + `popup.css` branch v0.2.0 adalah evidence yang lebih kuat daripada menebak tampilan.

---

## 6. Dependency contracts

### 6.1 Chrome extension runtime — VERIFIED_OLD_SOURCE

Target runtime adalah Chrome extension Manifest V3, bukan executable Windows.

Dependensi platform meliputi Chrome APIs seperti storage/tabs/runtime/action/service worker dan DOM ChatGPT Web.

### 6.2 ChatGPT Web DOM — contract rapuh / live status UNKNOWN

Extension bergantung pada UI/DOM ChatGPT. Audit mengingatkan selector dapat berubah untuk:

- composer/ProseMirror;
- send/stop buttons;
- user/assistant turns;
- virtualized conversations;
- tool output;
- file/image output;
- locale Indonesia/Inggris;
- project/custom GPT.

v0.2.0 belum mempunyai live ChatGPT smoke-test evidence. Jadi kompatibilitas UI saat ini tetap `UNKNOWN` sampai diuji ulang.

### 6.3 Launcher localhost — source contract VERIFIED, end-to-end UNKNOWN

Audit lama mencatat integrasi localhost pada port `47651/47652` dan menyebut server launcher tidak tersedia di repo baseline untuk diaudit.

Pada v0.2.0, dokumentasi/source menyatakan launcher localhost dipertahankan dan payload dapat membawa `commandId` untuk replay protection. Server lama tanpa `commandId` masih dapat diterima, tetapi tidak memperoleh jaminan de-duplication end-to-end.

Test report v0.2.0 secara eksplisit masih meminta test launcher lokal nyata.

Kesimpulan:

- client-side launcher contract: `VERIFIED_OLD_SOURCE`;
- real server compatibility/acknowledgement/replay behavior: `UNKNOWN`.

### 6.4 Persistence

Prompt/state disimpan lokal di browser untuk fungsi extension. Audit menyarankan agar prompt penuh tidak masuk diagnostic log secara default.

---

## 7. Packaging target

Target yang berhasil dipulihkan dan konsisten di audit + old source:

- **10 paket Chrome extension** Runner 01–10;
- folder extension dapat dipakai dengan **Load unpacked**;
- UI Bahasa Indonesia;
- distribusi dapat dibungkus ZIP;
- bukan EXE/installer Windows;
- satu sumber kanonik + generator adalah arsitektur v0.2.0 yang sudah pernah dibuat di branch lama.

Status packaging v0.2.0:

- generated packages: `VERIFIED_OLD_SOURCE`;
- validator 10 package/manifest v0.2.0: `VERIFIED_OLD_TEST`;
- published GitHub Release artifact: tidak ditemukan;
- ZIP artifact lama dengan checksum terverifikasi: `UNKNOWN`.

---

## 8. Acceptance architecture yang wajib dipertahankan pada recovery berikutnya

Recovery/implementasi berikutnya tidak boleh merusak kontrak produk berikut:

- interrupted/failed yang terkonfirmasi → catat jujur, tunggu delay, lanjut satu kali;
- approval/permission → pause dan tunggu pengguna;
- long-running active generation → jangan dipotong hanya karena beberapa polling diam;
- ambiguous send/acceptance → reconcile/pause, jangan blind retry;
- wrong conversation/navigation → pause;
- manual composer draft → jangan overwrite;
- owner tab loss → recovery eksplisit;
- two runners same tab → maksimal satu pengirim;
- two runners different tabs → dapat tetap independen;
- state setelah reload/restart → tidak duplikat/loncat;
- final progress membedakan success/interrupted/failed/unknown.

## 9. Recovery recommendation untuk Integrator

Source branch v0.2.0 lama harus diperlakukan sebagai **high-value recoverable source**, bukan sebagai dokumentasi saja. Namun import-nya harus dilakukan oleh owner source/integrator dengan provenance jelas; Chat 2 tidak mengubah `extensions/**` atau core source.
