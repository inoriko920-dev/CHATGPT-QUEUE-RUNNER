# STATUS_GLOBAL — CHATGPT-QUEUE-RUNNER

Tanggal: 2026-10-01

## Status utama

**`R0_READY / BACKUP_PENDING`**

## R0 application checkpoint

`1d1cd6df547673869e1a374fc5320861924689e4`

Checkpoint tersebut adalah titik integrasi Recovery R0 untuk baseline aplikasi v0.1.8 beserta snapshot verifier yang telah direview.

## Yang sudah verified

- old main v0.1.8 baseline: 81/81 file teridentifikasi;
- `extensions/**`: 80 verified source files;
- root `README.md`: verified old-main source;
- rescue SHA-256: `f46767d61dff61c2b0ce7dc413fc7dbe29f78d0029c17a2259d54bd96c5ddd56`;
- manifests: 10/10 parse, Manifest V3, version 0.1.8;
- JavaScript syntax: 40/40 PASS;
- reconstructed snapshot verifier: 182 checks, 0 failures, 40 JS checked;
- common secret-pattern scan pada rescue source: 0 hit;
- build status: N/A — no build step pada baseline v0.1.8;
- provenance legacy source vs reconstruction terdokumentasi.

## Yang belum verified

- full-history dedicated secret scan;
- Chrome `Load unpacked` integration;
- MV3 runtime/service-worker restart behavior;
- ChatGPT Web live behavior;
- real launcher E2E;
- canonical `repo.bundle`;
- canonical `source.zip` dari final committed HEAD;
- `git bundle verify`;
- restore drill + `git fsck --full`;
- verified secondary + offsite copy untuk canonical backup set.

## Rescue preservation

Raw rescue `extensions.zip` telah dipertahankan di luar GitHub sebagai copy independen, dengan SHA-256 yang dicatat di atas. Ini meningkatkan ketahanan recovery tetapi **bukan pengganti canonical Git backup** karena rescue ZIP tidak membawa seluruh Git refs/history.

## Aturan kenaikan status

Status baru boleh menjadi **`R0_READY / BACKUP_VERIFIED`** setelah canonical backup dari clone Git lokal authoritative memenuhi seluruh policy verifikasi dan restore drill.

Sampai itu terjadi, jangan mengubah `BACKUP_PENDING` menjadi `BACKUP_VERIFIED`.
