# KNOWN_MISSING_FILES — Recovery R0

Tanggal: 2026-10-01

## Old main v0.1.8 source

**Tidak ada file source old main v0.1.8 yang masih missing berdasarkan evidence yang sekarang tersedia.**

Rekonsiliasi final:

- rescue `extensions.zip` = 80 file;
- old-main `extensions/` tree SHA = `7472f665bb302b673f2c35dd958ca8f040270fa5`;
- recovery `extensions/` tree SHA = nilai yang sama;
- old-main root mempunyai satu file tambahan: `README.md`, blob `1e232dd8b29704fc18a37ac156ebd32a4a0b8e94`;
- root README tersebut telah dipulihkan oleh Chat 5.

Maka audit lama 81 file direkonsiliasi sebagai 80 extension files + 1 root README. Tidak ada speculative file dibuat.

## Bukan missing, tetapi sengaja tidak masuk R0

Old v0.2.0 branch `fix/astra-b01-b19-runner-reliability` @ `a36e4b74645d8c98a1ed9c7a5db4dbd3d3586d98` masih tersedia sebagai verified old source namun **unmerged** terhadap old main. Source itu tidak hilang; ia sengaja tidak dicampur dengan R0 v0.1.8.

## Evidence/artifact yang masih unavailable atau pending

1. **Current Chrome Load unpacked runtime evidence**
   - Status: `NOT RUN`.
   - Bukan source file missing; yang missing adalah bukti integrasi browser current.

2. **Current ChatGPT live smoke-test evidence**
   - Status: `NOT RUN`.

3. **Current launcher localhost end-to-end evidence**
   - Status: `NOT RUN`.

4. **Dedicated full-history secret scan report**
   - Status: `NOT RUN`.
   - Common source-pattern preflight sudah PASS, tetapi itu tidak menggantikan scanner history dedicated.

5. **Canonical local backup artifacts untuk final R0**
   - `repo.bundle`: `BACKUP_LOCAL_PENDING`.
   - `source.zip`: `BACKUP_LOCAL_PENDING`.
   - actual `BACKUP_MANIFEST.json`: pending.
   - restore drill evidence: pending.
   - secondary/offsite copies: pending.

6. **Old release/tag artifact**
   - GitHub Releases old repo terverifikasi tidak menyediakan release artifact pada recovery session.
   - Keberadaan old tag yang dapat dipertanggungjawabkan tetap `UNKNOWN` jika tidak didukung evidence langsung.

## Rule

Jangan mengubah evidence/runtime/backup yang pending menjadi source reconstruction. Missing evidence harus tetap ditulis `NOT RUN`, `PENDING`, atau `UNKNOWN` sampai pemeriksaan nyata dilakukan.
