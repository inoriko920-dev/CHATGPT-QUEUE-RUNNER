# FEATURE_STATUS_RECOVERED — ChatGPT Queue Runner

Tanggal recovery: 2026-10-01

## 1. Klasifikasi wajib

- `VERIFIED_OLD_SOURCE` — source/commit lama dapat diverifikasi.
- `VERIFIED_OLD_TEST` — ada test/CI lama yang dapat diverifikasi.
- `REPORTED_IN_CHAT` — hanya ada laporan chat.
- `PLANNED_ONLY` — hanya rencana/desain.
- `UNKNOWN` — bukti belum cukup.

Tambahan qualifier yang dipakai tanpa mengganti klasifikasi utama:

- `UNMERGED` — source ada di branch/PR lama tetapi tidak masuk old main.
- `NOT_LIVE_VERIFIED` — belum diuji terhadap ChatGPT Web nyata.

---

## 2. Snapshot status produk

| Area | Old main v0.1.8 | Old fix branch v0.2.0 | Recovery interpretation |
|---|---|---|---|
| 10 Runner Chrome MV3 | `VERIFIED_OLD_SOURCE` | `VERIFIED_OLD_SOURCE` | requirement tetap |
| UI Bahasa Indonesia | source lama mendukung UI popup | `VERIFIED_OLD_SOURCE` | code-level reference ada |
| Load unpacked packaging | `VERIFIED_OLD_SOURCE`/docs | `VERIFIED_OLD_SOURCE` + package validator | bukan EXE |
| Auto-next setelah interruption | ada di v0.1.8 tetapi mekanisme bermasalah | `VERIFIED_OLD_TEST (UNMERGED)` | behavior requirement tetap |
| Approval/permission pause | ada intent di v0.1.8 tetapi guard memiliki gap | `VERIFIED_OLD_TEST (UNMERGED)` | wajib tidak auto-click |
| Anti wrong-conversation | bug B04 di v0.1.8 | `VERIFIED_OLD_TEST (UNMERGED)` | wajib pause saat pindah chat |
| Anti overwrite manual draft | bug B08 di v0.1.8 | `VERIFIED_OLD_TEST (UNMERGED)` | wajib pertahankan draf |
| Anti duplicate ambiguous send | bug B10 di v0.1.8 | `VERIFIED_OLD_TEST (UNMERGED)` | jangan retry buta |
| Owner tab recovery | bug B16 di v0.1.8 | `VERIFIED_OLD_TEST (UNMERGED)` | recovery eksplisit |
| Popup draft persistence | bug B17 di v0.1.8 | `VERIFIED_OLD_TEST (UNMERGED)` | draft terpisah dari active queue |
| Cross-runner same-tab lock | bug B12 di v0.1.8 | contract `VERIFIED_OLD_TEST (UNMERGED)` | live Chrome tetap perlu test |
| Source generator | tidak ada v0.1.8 | `VERIFIED_OLD_SOURCE (UNMERGED)` | `src/` + generator |
| Automated regression suite | tidak ada v0.1.8 | `VERIFIED_OLD_TEST (UNMERGED)` | 29/29 reported in old test report + CI success |
| Chrome Load unpacked integration penuh | tidak diuji | belum positif diverifikasi | `UNKNOWN` |
| ChatGPT live smoke test | tidak diuji | tidak diuji | `UNKNOWN` |
| Real launcher end-to-end | server tidak ada pada baseline audit | manual real server masih perlu test | `UNKNOWN` |

---

## 3. B01–B19 recovered status

### B01 — Launcher tidak bisa melanjutkan antrean paused

Baseline v0.1.8:
`VERIFIED_OLD_TEST` — harness audit mereproduksi `queuesMatch` tidak tersedia di content-script scope dan error tertelan.

Old v0.2.0 fix:
`VERIFIED_OLD_TEST (UNMERGED)` — shared core menyediakan queue comparison; regression test B01 ada.

Acceptance recovered:
- queue sama dapat resume indeks;
- queue berbeda mengikuti kebijakan replacement;
- tidak ada ReferenceError/error senyap.

### B02 — Jeda/Reset tidak membatalkan pengiriman yang sedang menunggu

Baseline:
`VERIFIED_OLD_TEST` — pause/reset selama await masih dapat berujung send/corrupt state.

v0.2.0:
`VERIFIED_OLD_TEST (UNMERGED)` — token/runId/revision guard diperiksa setelah await dan sebelum click.

Acceptance:
- Jeda/Reset sebelum click → nol click;
- callback async lama tidak mengubah state baru;
- click yang sudah terjadi tidak diperlakukan seolah dapat dibatalkan.

### B03 — Launcher response terlambat menghidupkan sesi yang sudah Reset

Baseline:
`VERIFIED_OLD_TEST`.

v0.2.0:
`VERIFIED_OLD_TEST (UNMERGED)` — stale response ditolak menggunakan snapshot token/revision.

Acceptance:
- response lama setelah reset/start/owner change/navigation tidak mengubah sesi baru.

### B04 — Antrean terkirim ke percakapan lain di tab yang sama

Baseline:
`VERIFIED_OLD_TEST` — A→B masih send.

v0.2.0:
`VERIFIED_OLD_TEST (UNMERGED)` — conversation identity dan reconciliation diuji.

Acceptance:
- A→B/New chat/Back/Forward menghentikan sesi A;
- transisi New Chat→ID sesudah prompt pertama dapat dibind secara sah.

### B05 — inFlight dapat menunggu selamanya

Baseline:
`VERIFIED_OLD_TEST`.

v0.2.0:
`VERIFIED_OLD_TEST (UNMERGED)` — no-response watchdog / response-unknown path ada.

Acceptance:
- error sebelum assistant turn, empty assistant, network loss, composer loss tidak hang tanpa batas;
- generasi panjang yang masih aktif tidak dipotong dengan timeout sewenang-wenang.

### B06 — Jawaban lama dianggap hasil item baru

Baseline:
`VERIFIED_OLD_TEST`.

v0.2.0:
`VERIFIED_OLD_TEST (UNMERGED)` — response ditautkan ke user turn dan baseline assistant IDs.

Acceptance:
- copy/regenerate/teks jawaban lama tidak menyelesaikan active item baru.

### B07 — Composer kosong/detached dianggap prompt accepted

Baseline:
`VERIFIED_OLD_TEST`.

v0.2.0:
`VERIFIED_OLD_TEST (UNMERGED)` — acceptance memerlukan matched user turn; detached composer bukan evidence.

Acceptance:
- remount/editor clear/layout change tidak menghasilkan false acceptance.

### B08 — Draf manual pengguna ditimpa

Baseline:
`VERIFIED_OLD_TEST`.

v0.2.0:
`VERIFIED_OLD_TEST (UNMERGED)` — manual draft pause guard sebelum `setComposerText`.

Acceptance:
- draf tetap utuh;
- runner tidak mengirim isi yang berubah dari prompt intended.

### B09 — Pending replacement menghapus status Jeda

Baseline:
`VERIFIED_OLD_TEST`.

v0.2.0:
`VERIFIED_OLD_TEST (UNMERGED)` — replacement hanya diterapkan ketika running dan aman.

Acceptance:
- replacement tidak otomatis menghidupkan manual/approval pause.

### B10 — Resume setelah send timeout dapat menggandakan prompt

Baseline:
`VERIFIED_OLD_TEST`.

v0.2.0:
`VERIFIED_OLD_TEST (UNMERGED)` — sending journal dipersist sebelum click dan ambiguous send tidak blind retry.

Acceptance:
- timeout/reload/crash-window tidak menyebabkan prompt dikirim ulang otomatis tanpa reconciliation.

### B11 — `sawGenerating` hilang setelah reload

Baseline:
`VERIFIED_OLD_TEST`.

v0.2.0:
`VERIFIED_OLD_TEST (UNMERGED)` — generating checkpoint dipersist.

Acceptance:
- reload pada accepted/generating/waiting-delay memulihkan progres secara konsisten.

### B12 — Dua runner dapat mengirim ke tab/composer yang sama

Baseline:
`VERIFIED_OLD_TEST` melalui simulasi dua instance; Chrome nyata saat audit belum diuji.

v0.2.0:
`VERIFIED_OLD_TEST (UNMERGED)` untuk source contract lease/Web Locks.

Acceptance:
- same tab/conversation → maksimal satu send;
- different tabs → runner tetap independen;
- crash/reset lock release harus tervalidasi pada integration test.

Live Chrome portion: `UNKNOWN`.

### B13 — interruption-bypass membuat completion palsu

Baseline:
`VERIFIED_OLD_TEST` pada seluruh Runner 01–10.

v0.2.0:
`VERIFIED_OLD_TEST (UNMERGED)` — test memastikan monkey patch dan fake `copy-turn-action-button` marker dihapus.

Acceptance:
- hidden/old Regenerate/Try again/Continue tidak menyelesaikan active item;
- interruption yang benar tetap dapat lanjut.

### B14 — Approval guard terlewat

Baseline:
`VERIFIED_OLD_TEST` — offscreen approval dan text-only confirm tidak terdeteksi.

v0.2.0:
`VERIFIED_OLD_TEST (UNMERGED)` untuk klasifikasi label Indonesia/Inggris dan priority contract.

Acceptance:
- approval aktif terdeteksi tanpa bergantung viewport;
- historical/hidden/nonactive approval tidak pause palsu;
- approval tidak auto-click.

Live selector coverage: `UNKNOWN`.

### B15 — Queue/config tidak sinkron ke content script/popup lain

Baseline:
`VERIFIED_OLD_SOURCE` dari penelusuran code/audit; bukan controlled reproduction B01–B14 set.

v0.2.0:
`VERIFIED_OLD_TEST (UNMERGED)` — queue/config/state storage sync dan revision-safe resume diperiksa.

Acceptance:
- launcher replacement + popup terbuka tidak menghasilkan queue usang;
- stale revision command ditolak.

### B16 — Owner tab ditutup meninggalkan running palsu

Baseline:
`VERIFIED_OLD_SOURCE`.

v0.2.0:
`VERIFIED_OLD_TEST (UNMERGED)` — background `tabs.onRemoved/onUpdated`, owner-missing state, explicit recovery contract.

Acceptance:
- tab close/restart/restore tidak menyisakan running palsu atau mengirim ke tab ID yang kebetulan dipakai ulang.

Full browser-restart integration: `UNKNOWN`.

### B17 — Draf prompt popup hilang saat popup ditutup

Baseline:
`VERIFIED_OLD_SOURCE`.

v0.2.0:
`VERIFIED_OLD_TEST (UNMERGED)` — `cqr_draft` terpisah dan debounce save diuji.

Acceptance:
- close/reopen popup tidak kehilangan draft;
- draft storage tidak mengubah active queue.

### B18 — Jawaban gagal/terpotong dihitung sebagai sukses

Baseline:
`VERIFIED_OLD_SOURCE`.

v0.2.0:
`VERIFIED_OLD_TEST (UNMERGED)` — outcome counts + interrupted/failed waiting-delay contract diuji.

Acceptance:
- progress memisahkan processed/completed/interrupted/failed/unknown;
- interrupted/failed boleh auto-next setelah delay;
- approval tetap menang prioritas dan pause.

### B19 — README bertentangan dengan perilaku v0.1.8

Baseline:
`VERIFIED_OLD_SOURCE` — root README v0.1.8 dan per-runner README tidak konsisten menurut audit.

v0.2.0:
`VERIFIED_OLD_TEST (UNMERGED)` pada test report: B19 diperiksa melalui dokumentasi/generator distribusi.

Acceptance:
- install/use/version/folder/behavior konsisten;
- pengguna dapat memilih folder Runner yang benar tanpa menebak;
- batas live/launcher/background dijelaskan jujur.

---

## 4. Acceptance matrix T01–T30 yang berhasil dipulihkan

Matriks ini berasal dari audit ASTRA. Pada audit awal ini adalah acceptance requirements, bukan pass report.

- **T01** Normal 3 prompt: tepat 3 send, urutan benar, tidak mendahului respons.
- **T02** Respons selesai sangat cepat tetap dikenali tanpa duplikat.
- **T03** Respons panjang/tool/thinking yang diam sementara tidak auto-next sebelum terminal.
- **T04** Interruption sesudah teks parsial: next prompt satu kali sesudah delay.
- **T05** Error sebelum assistant turn: tidak hang; status jelas.
- **T06** Old/hidden Regenerate/Continue tidak menyelesaikan item aktif.
- **T07** Old assistant copy tidak membuat item baru salah sukses.
- **T08** Approval in-view/offscreen/dialog/text-only → pause konsisten.
- **T09** Approval historical/hidden → tidak pause palsu.
- **T10** Pause pada await sebelum click → nol click.
- **T11** Reset pada await sebelum click → nol click/state revival.
- **T12** Reset setelah click sebelum acceptance → tidak mutasi sesi baru/retry buta.
- **T13** Late launcher response setelah reset/start/owner change → diabaikan.
- **T14** Send timeout + delayed user turn → reconcile, tidak duplicate.
- **T15** Reload sebelum/after click/generating/waiting-delay → tidak loncat/duplicate.
- **T16** A→B/New chat/Back/Forward → pause sesi lama; New-chat→ID yang sah tetap didukung.
- **T17** Owner tab close/restart/restore → recovery jelas.
- **T18** Composer remount/kosong tanpa user turn → tidak false accepted.
- **T19** Manual draft/teks berubah saat wait → dipertahankan dan tidak salah kirim.
- **T20** Popup draft close sebelum Start → muncul kembali tanpa mengubah active queue.
- **T21** Popup terbuka saat launcher mengganti queue → view/resume revision-correct.
- **T22** Manual pause + pending replacement → pause dipertahankan.
- **T23** Continue launcher paused same/different queue → tidak ReferenceError.
- **T24** Dua runner same tab → maksimal satu send; different tabs independen.
- **T25** Mixed success/interrupted/failed → final status akurat dan traceable.
- **T26** 0/1/100/101 items, invalid payload, delay boundaries → konsisten popup/launcher.
- **T27** 10 generated packages konsisten dan masing-masing Load unpacked.
- **T28** Upgrade state 0.1.8/storage write failure/stale event → tidak merusak queue.
- **T29** Background tab/sleep/wake/service-worker restart → ukur dan dokumentasikan batas nyata.
- **T30** ChatGPT Indonesia/Inggris, long chat, file/tool output → live test terpisah.

### Apa yang benar-benar terverifikasi untuk v0.2.0

Old `TEST_REPORT.md` menyatakan 29/29 regression tests lulus dan suite mencakup kontrak B01–B18 yang dapat diuji deterministik/simulasi; B19 diperiksa via docs/generator. GitHub CI pada head lama juga sukses.

Namun tidak ada mapping bukti yang sah untuk mengatakan **setiap T01–T30** sudah PASS end-to-end. Khususnya T29/T30/live Chrome tetap belum terbukti.

---

## 5. Requirements produk yang harus dibawa ke recovery berikutnya

1. Saat jawaban benar-benar terhenti/terpotong/gagal, queue lanjut ke prompt berikut setelah delay.
2. Outcome harus jujur (`interrupted`/`failed`), bukan disamakan dengan success.
3. Permintaan izin/konfirmasi harus pause sampai tindakan pengguna.
4. Jangan klik approval otomatis.
5. Jangan meneruskan queue ke percakapan lain.
6. Jangan menimpa draf composer pengguna.
7. Jangan duplicate prompt saat acceptance ambiguous.
8. Jangan menganggap response lama sebagai response item aktif.
9. Support 10 runner tetap dipertahankan.
10. Same-tab multi-runner tidak boleh race mengirim.
11. UI Bahasa Indonesia.
12. Chrome extension / ZIP Load unpacked; **bukan EXE**.
13. Test report harus memisahkan simulation, Chrome integration, dan ChatGPT live.
14. Launcher localhost harus diperlakukan sebagai dependency eksternal dan tidak diklaim end-to-end aman tanpa server test.

---

## 6. Uncertainty / belum boleh diklaim

- `UNKNOWN`: kompatibilitas selector dengan ChatGPT Web per 2026-10-01.
- `UNKNOWN`: full manual Load unpacked Runner 01–10 pada browser nyata dari v0.2.0.
- `UNKNOWN`: behavior dua extension pada browser nyata sesudah crash/sleep/restart.
- `UNKNOWN`: real launcher server 47651/47652 dan acknowledgement/replay contract end-to-end.
- `UNKNOWN`: release ZIP lama yang dapat diverifikasi checksum-nya.
- `UNKNOWN`: screenshot UI khusus Queue Runner.

## 7. Kesimpulan status recovery

Fitur hardening B01–B19 **bukan lagi sekadar PLANNED_ONLY secara historis**: ada branch source v0.2.0 yang masih dapat diverifikasi dan test lama untuk B01–B18/B19-docs. Tetapi branch tersebut **UNMERGED**, old main tetap v0.1.8, dan live ChatGPT/Chrome integration tetap belum terbukti.
