# KNOWN_OLD_COMMITS — ChatGPT Queue Runner

Tanggal recovery: 2026-10-01

Dokumen ini hanya mencatat commit/branch/PR yang dapat diverifikasi. Ini bukan klaim bahwa daftar history lama sudah lengkap.

## 1. Old repository

Repository:
`tonitarung099-creator/ChatGPT-Queue-Runner`

### Old branches yang terverifikasi

| Branch | Head | Status recovery |
|---|---|---|
| `main` | `7bcfbf7cdfa87303f21d5f979796200880e355ae` | `VERIFIED_OLD_SOURCE` |
| `fix/astra-b01-b19-runner-reliability` | `a36e4b74645d8c98a1ed9c7a5db4dbd3d3586d98` | `VERIFIED_OLD_SOURCE (UNMERGED)` |

## 2. Old main commit chain yang terverifikasi

| Urutan | Commit | Message | Catatan |
|---:|---|---|---|
| 1 | `3b9f5e58b2c7559a8bfa14dae641a63a35e9d099` | `Initialize ChatGPT Queue Runner repository` | initial repo |
| 2 | `a516aab54a6e2cb90909cc28f74213b2ef61cdaa` | `Add Chat Queue Runner v0.1.6 extensions 01-10` | v0.1.6 |
| 3 | `bf7825f529366a64788896442f01164cac6b95eb` | `Fix ChatGPT web runner reliability in v0.1.7` | v0.1.7 |
| 4 | `7bcfbf7cdfa87303f21d5f979796200880e355ae` | `Auto-continue queue after interrupted ChatGPT responses v0.1.8` | old `main` / ASTRA audit baseline |

`7bcfbf7...` mempunyai parent `bf7825f...`, sehingga urutan v0.1.7 → v0.1.8 terverifikasi langsung.

## 3. Old v0.2.0 fix branch — commit yang berhasil diverifikasi

Branch dimulai dari old main `7bcfbf7...` dan mempunyai rangkaian commit implementasi/test/tooling. Commit berikut berhasil diverifikasi pada recovery Chat 2:

| Commit | Message | Evidence type |
|---|---|---|
| `f0c60a6714a3db471e19550b5955b959872a8f58` | `Add shared v0.2.0 queue runner core` | `VERIFIED_OLD_SOURCE` |
| `4796a7b662b257313c975b99f8df213199bb6721` | `Add owner recovery and launcher background hardening` | `VERIFIED_OLD_SOURCE` |
| `4c60a335c97f6ff1fcd4b1ee55959125d2da0595` | `Persist popup drafts and add revision-safe controls` | `VERIFIED_OLD_SOURCE` |
| `8995b846d264ed1cff95f03bc4d273e13c9a5154` | `Rewrite queue controller with cancellation and recovery` | `VERIFIED_OLD_SOURCE` |
| `4ccba3b3c0713ca58ec62b37d595cff9d5868e44` | `Add shared core regression tests` | `VERIFIED_OLD_TEST` |
| `45e6391ab7f34783da1fcc1b2bd3ec8086ea0304` | `Add send transaction simulator tests` | `VERIFIED_OLD_TEST` |
| `8dc2da2c99ec9a2d9e0277e4b5e488f1e3fdbb2d` | `Add source contract regression tests` | `VERIFIED_OLD_TEST` |
| `52d7fbf5cffb01dc72235957a3ff6a294fcd6abc` | `Cover remaining Astra bug contracts` | `VERIFIED_OLD_TEST` |
| `bc7df64faea43ad6ab3af8c13d7652e2fb6a1ff5` | `Add regression test scripts` | `VERIFIED_OLD_SOURCE` |
| `8fd12b16cb1e432851bcf802ac8a23e67955a1b6` | `Document v0.2.0 validation results` | `VERIFIED_OLD_TEST` report |
| `f677b20c4e540751549d0b9bdc4ef6402a903443` | `Add regression CI workflow` | `VERIFIED_OLD_SOURCE` + later CI success |
| `1ce337d9ec39738344caaf4fd708563cf691cefc` | `Update root documentation for v0.2.0` | `VERIFIED_OLD_SOURCE` |
| `a36e4b74645d8c98a1ed9c7a5db4dbd3d3586d98` | `Generate Runner 01-10 v0.2.0 packages` | branch head / `VERIFIED_OLD_SOURCE` |

Catatan: branch mempunyai commit lain yang mungkin berada di antara commit yang tercantum. Dokumen ini sengaja tidak mengarang message/SHA yang belum dicatat secara langsung selama recovery.

## 4. Old PR yang terverifikasi

### PR #1

Title:
`Fix queue runner reliability and recovery (B01–B19)`

Metadata recovery:

- state: `open`
- draft: false
- base branch: `main`
- base SHA: `7bcfbf7cdfa87303f21d5f979796200880e355ae`
- head branch: `fix/astra-b01-b19-runner-reliability`
- head SHA: `a36e4b74645d8c98a1ed9c7a5db4dbd3d3586d98`
- created: 2026-09-28
- `merged_at`: null

Interpretasi:

- v0.2.0 pernah benar-benar diimplementasikan dalam branch;
- perubahan **tidak masuk old main**;
- jangan menyebut v0.2.0 sebagai old main/release yang sudah di-merge.

## 5. Test/CI commit evidence

### Regression files yang dapat ditelusuri dari commit history

- `tests/core.test.js`
- `tests/session-simulator.test.js`
- `tests/source-contract.test.js`
- `tests/additional-contracts.test.js`

`TEST_REPORT.md` menyatakan 29 test lulus dan 0 gagal pada v0.2.0.

GitHub Actions pada head `a36e4b7...`:

- workflow `CI`
- run #4
- status `completed`
- conclusion `success`

Ini diklasifikasikan `VERIFIED_OLD_TEST` untuk automated/source-contract scope, bukan live ChatGPT scope.

## 6. Release/tag status

### GitHub Releases

Endpoint releases old repo mengembalikan daftar kosong saat diperiksa.

Status: **VERIFIED — tidak ada GitHub Release yang tercantum saat recovery**.

### Tags

Daftar tag tidak berhasil dipulihkan dari endpoint yang dicoba.

Status: `UNKNOWN`.

Jangan mengarang tag `v0.1.8` atau `v0.2.0` hanya berdasarkan version manifest.

## 7. New recovery repository coordinator commit

Ini bukan old application history, tetapi dicatat agar handoff recovery jelas.

Repo baru:
`inoriko920-dev/CHATGPT-QUEUE-RUNNER`

Coordinator commit:
`083ed5030d6a6304e9f720ce6edcec5b4ce83288`

Message:
`recovery: add R0 worker assignment`

Branch Chat 2:
`recovery/chat2-history-docs-r0`

Chat 2 tidak merge ke `main`.

## 8. High-value recovery note

Karena old fix branch masih dapat dibaca, Integrator sebaiknya mengamankan refs/source itu sebelum mengandalkan rekonstruksi manual. Commit history di atas jauh lebih kuat sebagai provenance daripada menulis ulang fitur berdasarkan chat atau ASTRA plan.
