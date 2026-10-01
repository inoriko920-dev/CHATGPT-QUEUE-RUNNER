# SOURCE_PROVENANCE — Recovery R0

Tanggal: 2026-10-01

## Labels

- `VERIFIED_SOURCE` — file/source current recovery yang dibuktikan langsung.
- `VERIFIED_OLD_SOURCE` — source lama dapat dibaca langsung dari old repository/commit.
- `VERIFIED_OLD_TEST` — test/CI lama memiliki evidence langsung.
- `RECONSTRUCTED_FROM_DOCS` — dokumen/prosedur dibangun kembali dari evidence lama, bukan source asli.
- `UNKNOWN` — belum dapat dibuktikan.

## VERIFIED_SOURCE — current R0

### `extensions/**`

Source current R0 berasal dari rescue user `extensions.zip`.

Evidence:

- rescue SHA-256 `f46767d61dff61c2b0ce7dc413fc7dbe29f78d0029c17a2259d54bd96c5ddd56`;
- 80 file / 10 Runner × 8 file;
- Git tree SHA current recovery `extensions/` = `7472f665bb302b673f2c35dd958ca8f040270fa5`;
- Git tree SHA old main v0.1.8 `extensions/` = nilai yang sama.

Kesimpulan: seluruh 80 file `extensions/**` current R0 adalah exact old-main v0.1.8 source, bukan reconstruction.

### Root `README.md`

Source dipulihkan langsung dari old main commit `7bcfbf7cdfa87303f21d5f979796200880e355ae`.

Blob SHA: `1e232dd8b29704fc18a37ac156ebd32a4a0b8e94`.

Old main root terbukti hanya mempunyai `README.md` dan directory `extensions/`. Ini menyelesaikan mismatch lama 81 vs 80: 80 extension files + 1 root README.

## VERIFIED_OLD_SOURCE — tidak dicampur ke R0

Old unmerged branch:

- `fix/astra-b01-b19-runner-reliability`
- head `a36e4b74645d8c98a1ed9c7a5db4dbd3d3586d98`
- old PR #1, status unmerged pada saat recovery.

Branch ini berisi hardening v0.2.0, `src/`, generator, tests, CI, dan perubahan B01–B19. Karena tidak pernah masuk old main, ia dipertahankan sebagai `VERIFIED_OLD_SOURCE (UNMERGED)` dan **tidak** dicampur ke snapshot R0 v0.1.8.

## VERIFIED_OLD_TEST

Evidence old v0.2.0 mencatat:

- 29/29 Node regression tests lulus;
- package validation Runner 01–10 lulus;
- JavaScript syntax check lulus;
- GitHub Actions CI pada old head selesai dengan conclusion success.

Batas: ini adalah historical evidence. Chrome extension activation penuh dan ChatGPT live tidak pernah dibuktikan sebagai PASS.

## RECONSTRUCTED_FROM_DOCS

Area berikut bukan source aplikasi asli dan diberi label reconstruction/documentation:

- `docs/recovery/chat2/**` — recovered history/architecture/requirements classification;
- `docs/recovery/chat3/**` — test recovery plan/evidence matrix;
- `docs/backup/**` — backup policy/manifest template;
- `tools/backup/**` — backup/verify/restore/copy procedures yang dibangun untuk Recovery R0;
- `docs/recovery/final/**` — final integrator state.

Tidak satu pun area ini diklaim sebagai source aplikasi lama.

## UNKNOWN / belum diverifikasi

- current Chrome MV3 Load unpacked behavior terhadap browser user;
- current ChatGPT Web selector/runtime compatibility;
- live interruption/approval/navigation/draft behavior;
- launcher localhost end-to-end current environment;
- dedicated full-history secret scan untuk seluruh history repo baru/lama;
- old tag/release artifact yang tidak mempunyai evidence yang cukup.

## Provenance rule setelah R0

Jangan mengganti R0 v0.1.8 dengan old v0.2.0 tanpa checkpoint/branch baru dan provenance eksplisit. Import source lanjutan harus menyebut source commit asal dan tidak boleh dilabel `VERIFIED_SOURCE` hanya karena sesuai rencana tertulis.
