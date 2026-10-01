# CURRENT_STATE — Recovery R0

Tanggal: 2026-10-01

## Recovery R0 status

**R0 COMPLETE WITH LOCAL BACKUP PENDING**

Repository sekarang mempunyai keadaan recovery yang dapat dipercaya dengan provenance terpisah antara source asli, historical evidence, dan tooling recovery baru.

## Current application baseline

- Product: ChatGPT Queue Runner.
- Baseline source current R0: **v0.1.8**.
- Distribution: 10 Chrome Manifest V3 extensions, Runner 01–10.
- `extensions/**`: 80 file verified source.
- root `README.md`: verified source dari old main.
- Rekonsiliasi historical tree: **81/81 file baseline lama teridentifikasi** sebagai 80 file `extensions/` + 1 root README.

Recovery R0 **tidak** meng-upgrade aplikasi ke v0.2.0 dan tidak menambahkan feature fix B01–B19 ke core source.

## Current repository tambahan

Di luar source lama v0.1.8, repo baru juga memuat:

- `docs/recovery/**` — assignment, handoff, history, architecture, provenance, state, dan test evidence;
- `docs/backup/**` — backup policy + manifest template;
- `tools/backup/**` — tooling PowerShell backup/verify/restore/copy.

Area recovery/backup ini bukan bagian dari source legacy v0.1.8 dan diberi provenance terpisah.

## Old v0.2.0 preservation

Old repo masih dapat dibaca dan branch hardening unmerged masih tersedia:

- `fix/astra-b01-b19-runner-reliability`
- head `a36e4b74645d8c98a1ed9c7a5db4dbd3d3586d98`

Ia didokumentasikan sebagai high-value recovery evidence tetapi tidak dicampur ke R0. Siklus berikutnya boleh mengevaluasi v0.2.0 secara terpisah.

## Test status current R0

- rescue SHA-256: PASS;
- source count: 80 PASS;
- manifest: 10/10 parse PASS, MV3, version 0.1.8;
- JavaScript syntax: 40/40 PASS (`node --check`, Node v22.16.0);
- common secret-pattern scan pada rescue source: 0 hit;
- Chrome Load unpacked integration: NOT RUN;
- ChatGPT live: NOT RUN;
- real launcher E2E: NOT RUN.

## Build

**N/A — no build step on v0.1.8 baseline.**

Old main v0.1.8 tidak memiliki package/build/test/CI framework. Extension dipasang dari folder source melalui Chrome `Load unpacked`.

## Backup

- Backup policy/tooling: PRESENT.
- Final canonical Git bundle dari final R0: NOT RUN pada environment Chat 5.
- Restore drill final R0: NOT RUN.
- Secondary/offsite verified copy: PENDING.
- Status: **BACKUP_LOCAL_PENDING**.

## Local action required

Pada clone Windows authoritative dari final R0:

1. jalankan dedicated secret/history scan bila tersedia;
2. jalankan `tools/backup/Backup-Repository.ps1`;
3. jalankan `Verify-Backup.ps1`;
4. jalankan `Restore-Backup.ps1` ke folder baru;
5. setelah VERIFIED, buat secondary + offsite copy dengan media/provider independen.

## Next phase

Recovery R0 berhenti di sini. Fase berikutnya, bila diminta user, adalah evaluasi terpisah terhadap old v0.2.0 hardening branch dan live Chrome/ChatGPT validation — bukan bagian R0.
