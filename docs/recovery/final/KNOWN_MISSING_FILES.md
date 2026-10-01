# KNOWN_MISSING_FILES — Recovery R0

Tanggal gate: 2026-10-01

Dokumen ini mencatat yang belum tersedia; daftar ini **bukan** klaim bahwa file tersebut pasti hilang dari rescue asli.

## Missing / unavailable pada repo recovery saat gate

1. `extensions/**`
   - Status: `UNKNOWN / NOT PRESENT IN CURRENT RECOVERY REPO`
   - Dampak: source Runner 01–10 belum dapat diverifikasi, dihitung, di-hash, atau diuji sintaks.

2. `docs/recovery/chat1/**`
   - Status: belum ada output/handoff Chat 1.

3. `docs/recovery/chat2/**`
   - Status: belum ada output/handoff Chat 2.

4. `docs/recovery/chat3/**` dan `recovery-tests/**`
   - Status: belum ada output/harness Chat 3.

5. `docs/recovery/chat4/**` dan `tools/backup/**`
   - Status: belum ada output/artefak backup Chat 4.

6. PR/commit worker berbeda dari baseline
   - Status: belum ada; seluruh branch worker masih identical dengan `main`.

## Historical uncertainty yang wajib dipertahankan

Assignment coordinator mencatat audit lama dengan tree 81 file, sementara rescue `extensions.zip` terdokumentasi berisi 80 file. File ke-81 **belum boleh ditebak atau direkonstruksi** sampai Chat 1 memberikan inventory rescue nyata dan evidence pembanding.

## Bukan missing yang boleh direka ulang

Jangan membuat file aplikasi baru hanya untuk mengisi jumlah 81. Jika file lama tidak dapat dibuktikan, status akhirnya harus tetap `UNKNOWN` atau `MISSING`, bukan `VERIFIED_SOURCE`.
