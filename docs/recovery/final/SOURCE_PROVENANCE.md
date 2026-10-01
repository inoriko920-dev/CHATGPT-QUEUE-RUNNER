# SOURCE_PROVENANCE — Recovery R0

Tanggal gate: 2026-10-01

## Label provenance

Gunakan hanya label berikut:

- `VERIFIED_SOURCE`
- `VERIFIED_FROM_BUILD`
- `RECONSTRUCTED_FROM_DOCS`
- `RECONSTRUCTED_FROM_BEHAVIOR`
- `UNKNOWN`

## Provenance yang saat ini dapat dibuktikan

| Item | Status | Evidence / catatan |
|---|---|---|
| `docs/recovery/RECOVERY_ASSIGNMENT.md` | `VERIFIED_SOURCE` | File coordinator ada pada `main`, commit `083ed5030d6a6304e9f720ce6edcec5b4ce83288`. |
| Branch `recovery/chat1-source-r0` | `UNKNOWN` untuk source recovery | Branch ada tetapi belum memiliki perubahan terhadap baseline. |
| Branch `recovery/chat2-history-docs-r0` | `UNKNOWN` untuk output worker | Branch ada tetapi belum memiliki perubahan terhadap baseline. |
| Branch `recovery/chat3-test-build-r0` | `UNKNOWN` untuk output worker | Branch ada tetapi belum memiliki perubahan terhadap baseline. |
| Branch `recovery/chat4-backup-resilience-r0` | `UNKNOWN` untuk output worker | Branch ada tetapi belum memiliki perubahan terhadap baseline. |
| Source extension Runner 01–10 pada repo recovery | `UNKNOWN` | Belum ada `extensions/**` di repository pada saat gate. |
| Rescue `extensions.zip` yang disebut assignment | `UNKNOWN` pada repo saat ini | Hash dan jumlah file terdokumentasi, tetapi artefak rescue belum tersedia di branch integrasi untuk verifikasi langsung. |
| Audit baseline lama `7bcfbf7cdfa87303f21d5f979796200880e355ae` | `RECONSTRUCTED_FROM_DOCS` sebagai knowledge recovery | Nilai berasal dari assignment coordinator, bukan dari history Git repo recovery baru. |
| Tree lama 81 file / manifest 0.1.8 | `RECONSTRUCTED_FROM_DOCS` | Evidence dokumentasi coordinator; belum direkonsiliasi terhadap rescue nyata. |

## Aturan merge Chat 5

Perubahan hanya boleh diintegrasikan bila:

1. branch mempunyai commit berbeda dari baseline;
2. file berada di area ownership worker yang ditetapkan;
3. handoff menjelaskan asal file dan metode verifikasi;
4. tidak ada overlap versi yang belum diselesaikan;
5. source hasil reconstruction diberi label reconstruction dan tidak disamarkan sebagai source asli;
6. secret/API key/token tidak ikut masuk.

Sampai syarat tersebut terpenuhi, provenance source aplikasi tetap `UNKNOWN` dan R0 tidak boleh diberi status selesai.
