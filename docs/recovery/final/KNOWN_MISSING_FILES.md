# KNOWN_MISSING_FILES — Recovery R0

Tanggal: 2026-10-01

## Baseline old main v0.1.8

Setelah verifikasi langsung terhadap old repo, **tidak ada lagi known missing application file pada baseline 81-file old main v0.1.8**.

Rekonsiliasi final:

- verified rescue `extensions.zip`: 80 file;
- old main `extensions/` tree: 80 file dan identik dengan rescue;
- old main root `README.md`: 1 file;
- total old main baseline: 81 file.

Root README telah dipulihkan langsung dari old main commit `7bcfbf7cdfa87303f21d5f979796200880e355ae`, blob `1e232dd8b29704fc18a37ac156ebd32a4a0b8e94`.

Status: **KNOWN_MISSING_SOURCE_FILES = 0 untuk baseline v0.1.8**.

## Yang sengaja tidak dimasukkan ke current R0 source

Old hardening branch v0.2.0 mempunyai file tambahan seperti canonical `src/`, generator, tests, package metadata, CI workflow, dan dokumentasi versi baru. File tersebut **bukan missing file dari v0.1.8**; mereka berasal dari branch unmerged `fix/astra-b01-b19-runner-reliability` dan sengaja tidak dicampur ke R0.

Status: `VERIFIED_OLD_SOURCE (UNMERGED)`, bukan `MISSING_KNOWN_FILE`.

## Historical artifacts yang belum tersedia / UNKNOWN

Item berikut belum dipulihkan sebagai artifact lokal yang dapat diverifikasi dan tidak diperlukan untuk menyatakan source v0.1.8 lengkap:

- `.git`/full legacy history di dalam rescue ZIP — rescue memang bukan clone Git;
- tag legacy lama — `UNKNOWN`;
- release artifact/ZIP legacy beserta checksum — `UNKNOWN`;
- browser profile/session/cookie/API secrets — sengaja tidak boleh masuk recovery;
- live Chrome/ChatGPT run evidence untuk current R0 — belum dijalankan.

## Aturan

Tidak ada file speculative yang dibuat untuk mengisi unknown. Jika evidence baru ditemukan, tambahkan dengan provenance eksplisit pada siklus berikutnya.
