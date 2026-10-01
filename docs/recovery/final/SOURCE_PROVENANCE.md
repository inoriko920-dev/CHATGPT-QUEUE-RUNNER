# SOURCE_PROVENANCE — Recovery R0

Tanggal: 2026-10-01

## Label

- `VERIFIED_SOURCE` — source dapat dicocokkan langsung dengan artifact/commit lama.
- `VERIFIED_OLD_SOURCE` — source lama dapat dibaca langsung tetapi tidak menjadi source R0 current.
- `VERIFIED_OLD_TEST` — test/CI lama dapat diverifikasi.
- `RECONSTRUCTED_FROM_DOCS` — dibuat kembali berdasarkan dokumen/requirements recovery dan diberi label jelas.
- `UNKNOWN` — belum dapat dibuktikan.

## Current R0 source

### `extensions/**`

Provenance: **VERIFIED_SOURCE**.

Evidence:

- user rescue `extensions.zip` SHA-256 `f46767d61dff61c2b0ce7dc413fc7dbe29f78d0029c17a2259d54bd96c5ddd56`;
- 80 file fisik, 10 Runner × 8 file;
- imported `extensions/` Git tree `7472f665bb302b673f2c35dd958ca8f040270fa5`;
- old main commit `7bcfbf7cdfa87303f21d5f979796200880e355ae` mempunyai `extensions/` tree SHA yang sama.

Kesimpulan: source `extensions/**` R0 bukan hasil reconstruction dan cocok dengan old main v0.1.8.

### Root `README.md`

Provenance: **VERIFIED_SOURCE**.

Recovered langsung dari old main commit `7bcfbf7cdfa87303f21d5f979796200880e355ae`.

- blob SHA: `1e232dd8b29704fc18a37ac156ebd32a4a0b8e94`.

Ini menjelaskan file ke-81 pada audit lama: 80 file extension + 1 root README.

## Recovery documentation

`docs/recovery/chat1/**`, `chat2/**`, `chat3/**`, dan `chat4/**` adalah recovery evidence/handoff yang dibuat selama operasi Recovery R0. Dokumen tersebut bukan legacy application source.

- Chat 1 inventory/handoff: current recovery evidence.
- Chat 2 history/architecture/status: gabungan direct old-repo evidence dan dokumen recovery dengan klasifikasi eksplisit.
- Chat 3 test plan/evidence: `RECONSTRUCTED_FROM_DOCS` untuk acceptance matrix; current run status dipisahkan dari historical evidence.
- Chat 4 handoff: current recovery documentation.

## Backup tooling

`docs/backup/**` dan `tools/backup/**` bukan tooling legacy v0.1.8.

Provenance: **RECONSTRUCTED_FROM_DOCS / NEW RECOVERY TOOLING**.

Tooling ini sengaja ditambahkan untuk membuat recovery dapat dibackup secara independen dari GitHub. Ia tidak diklaim sebagai source asli aplikasi lama.

## Old v0.2.0 branch — tidak masuk R0

Repo lama masih mempunyai:

- branch `fix/astra-b01-b19-runner-reliability`;
- head `a36e4b74645d8c98a1ed9c7a5db4dbd3d3586d98`;
- PR lama #1, unmerged.

Klasifikasi: **VERIFIED_OLD_SOURCE (UNMERGED)**.

Old test report dan GitHub Actions CI pada head tersebut memberi **VERIFIED_OLD_TEST**, termasuk 29/29 Node tests dan workflow CI success. Evidence ini tidak dipromosikan menjadi current R0 v0.1.8 test result.

## Unknown / not claimed

- Tag legacy lama: `UNKNOWN`.
- Release artifact/ZIP legacy yang checksum-nya dapat diverifikasi: `UNKNOWN`.
- ChatGPT live compatibility current: `UNKNOWN / NOT RUN`.
- Chrome MV3 full integration current: `UNKNOWN / NOT RUN`.

Tidak ada source yang diciptakan untuk menutup unknown tersebut.
