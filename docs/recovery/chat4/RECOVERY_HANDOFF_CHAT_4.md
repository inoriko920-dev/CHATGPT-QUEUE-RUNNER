# RECOVERY_HANDOFF_CHAT_4

Worker: `SOL-D — BACKUP / RESILIENCE`

Tanggal: 2026-10-01

Branch: `recovery/chat4-backup-resilience-r0`

Base/coordinator commit saat worker dimulai: `083ed5030d6a6304e9f720ce6edcec5b4ce83288`

PR: `#3 — Recovery R0 Chat 4: backup and resilience toolkit`

Status utama: **BACKUP_LOCAL_PENDING**

## 1. Scope yang dikerjakan

Sesuai assignment, worker hanya menyentuh:

- `docs/backup/**`
- `tools/backup/**`
- `docs/recovery/chat4/**`

Worker tidak mengubah `extensions/**`, `recovery-tests/**`, worker chat lain, assignment coordinator, atau final shared recovery state.

PR #3 telah diperiksa melalui daftar changed files dan hanya berisi 7 file pada tiga area milik Chat 4 di atas.

## 2. File yang ditambahkan

### Policy / template

- `docs/backup/BACKUP_POLICY.md`
- `docs/backup/BACKUP_MANIFEST.template.json`

### PowerShell tools

- `tools/backup/Backup-Repository.ps1`
  - harus dijalankan dari clone Git lokal;
  - menolak working tree kotor;
  - menolak output backup yang sama dengan/berada di dalam repository;
  - menolak beberapa nama file tracked berisiko secret;
  - melakukan lightweight scan pola secret umum pada tracked HEAD;
  - membuat `repo.bundle` dengan `git bundle create --all`;
  - menjalankan `git bundle verify`;
  - membuat `source.zip` dari `git archive HEAD`;
  - membuat SHA-256 dan manifest aktual;
  - status awal hasil adalah `CREATED_NOT_RESTORED`.

- `tools/backup/Verify-Backup.ps1`
  - memverifikasi hash bundle/ZIP terhadap manifest;
  - memeriksa `SHA256SUMS.txt`;
  - menjalankan `git bundle verify` melalui temporary Git repo;
  - status menjadi `VERIFIED_ARTIFACTS_NOT_RESTORED` bila lolos.

- `tools/backup/Restore-Backup.ps1`
  - selalu memanggil verify lebih dulu;
  - hanya menerima restore path baru;
  - clone dari bundle;
  - menjalankan `git fsck --full`;
  - membandingkan restored HEAD dengan manifest;
  - baru menandai `backup_status=VERIFIED` bila seluruh drill lolos.

- `tools/backup/Copy-BackupCopies.ps1`
  - hanya menerima backup dengan status `VERIFIED`;
  - menolak destination yang sama dengan/berada di dalam folder backup sumber agar tidak terjadi recursive copy;
  - membuat secondary + offsite copy;
  - membandingkan SHA-256 `repo.bundle` dan `source.zip` setelah copy;
  - menandai copy status di manifest;
  - tidak dapat membuktikan dari path saja bahwa dua destination benar-benar beda media/provider, sehingga verifikasi independensi tetap tanggung jawab operator.

## 3. Commit worker

- `e0b617b92be76fa2ac6abb0cea69eaaf71f8d9a0` — backup policy
- `8d001864934cecba5e9f4b985c90df87a6e177ff` — manifest template
- `82bc2419908f8a037b4699ee2fbd457941229396` — backup script
- `2406cee2e0ea309fe72e057eea13e9c621e37f16` — verify script
- `911d5dfa426645baf7962b879f8b558d67c924dd` — restore script
- `cc8363e530afae8c15245bafd1d24015b5bfdb3c` — secondary/offsite copy script
- `a46ad1527c927c31de69191de66ea37a4d39dcfc` — initial handoff
- `0ed398380ce6f98cb9a51e091e334be107e08e28` — harden backup output path
- `f7fd4a649a0d7023daaf7bb64b8b2c3bc2500388` — prevent recursive copy destinations

Commit final untuk dokumen handoff ini adalah branch HEAD setelah file ini diperbarui.

## 4. Backup procedure Windows

Dari PowerShell pada PC user setelah source R0 terintegrasi:

```powershell
cd C:\PATH\TO\CHATGPT-QUEUE-RUNNER

pwsh .\tools\backup\Backup-Repository.ps1 `
  -RepoPath . `
  -OutputRoot "D:\CHATGPT_QUEUE_RUNNER_BACKUPS"
```

Catat folder hasil yang ditampilkan, lalu:

```powershell
pwsh .\tools\backup\Verify-Backup.ps1 `
  -BackupDir "D:\CHATGPT_QUEUE_RUNNER_BACKUPS\CHATGPT-QUEUE-RUNNER_backup_..."
```

Restore drill ke folder baru:

```powershell
pwsh .\tools\backup\Restore-Backup.ps1 `
  -BackupDir "D:\CHATGPT_QUEUE_RUNNER_BACKUPS\CHATGPT-QUEUE-RUNNER_backup_..." `
  -RestorePath "D:\RESTORE_TEST\CHATGPT-QUEUE-RUNNER"
```

Setelah status menjadi `VERIFIED`, buat copy kedua dan offsite:

```powershell
pwsh .\tools\backup\Copy-BackupCopies.ps1 `
  -BackupDir "D:\CHATGPT_QUEUE_RUNNER_BACKUPS\CHATGPT-QUEUE-RUNNER_backup_..." `
  -SecondaryDestination "E:\PROJECT_BACKUPS" `
  -OffsiteDestination "C:\Users\USER\CloudSync\PROJECT_BACKUPS"
```

Operator harus memastikan `E:` memang media kedua dan `CloudSync` benar-benar tersinkron ke provider/offsite yang berbeda dari GitHub.

## 5. Secret risk

### Proteksi yang diterapkan

- source ZIP hanya tracked + committed HEAD (`git archive`), bukan seluruh working directory;
- script menolak beberapa filename berisiko tinggi;
- script memindai pola token/private-key umum pada tracked HEAD;
- policy melarang API key, token, cookie, password, private key, browser profile, credential dump dan `.env` nyata.

### Risiko yang masih ada

Lightweight scan tidak membuktikan seluruh history bebas secret. `git bundle --all` menyalin history/refs yang tersedia pada clone. Jika secret pernah ter-commit di masa lalu, bundle dapat ikut membawanya walaupun secret sudah dihapus pada HEAD.

Karena itu sebelum final backup R0 sebaiknya Chat 5/operator menjalankan scanner history khusus (misalnya Gitleaks) bila tersedia. Jika ditemukan secret: revoke/rotate dahulu, lalu lakukan history-cleaning melalui prosedur terpisah dan audit ulang.

## 6. Yang benar-benar diuji pada Chat 4

Environment worker tidak memiliki PowerShell (`pwsh`/Windows PowerShell tidak tersedia), sehingga file `.ps1` **TIDAK DIJALANKAN** di environment Chat 4.

Yang benar-benar diuji adalah primitive Git yang menjadi dasar script, pada synthetic temporary Git repository menggunakan Git 2.47.3:

1. membuat repository sementara dan commit;
2. `git bundle create <file> --all` — PASS;
3. `git bundle verify <file>` — PASS;
4. `git archive --format=zip` — PASS;
5. SHA-256 untuk bundle + ZIP — PASS;
6. `git clone <bundle> <restore>` — PASS;
7. `git fsck --full` pada hasil restore — PASS;
8. restored HEAD dapat dibaca dan file tracked tersedia — PASS;
9. `git bundle verify` terhadap complete bundle dari temporary empty Git repository — PASS.

Ini membuktikan alur Git dasar, **bukan** membuktikan script PowerShell sudah live-tested pada Windows.

## 7. Yang belum dijalankan

Status berikut tetap pending/not run:

- bundle proyek asli dari clone lokal user — `BACKUP_LOCAL_PENDING`;
- PowerShell scripts pada Windows — `NOT_RUN`;
- dedicated history secret scan — `NOT_RUN`;
- restore drill terhadap source R0 proyek asli — `NOT_RUN`;
- secondary media copy proyek asli — `NOT_RUN`;
- offsite copy proyek asli — `NOT_RUN`.

Tidak ada klaim bahwa bundle proyek asli sudah dibuat.

## 8. Retention / 3-2-1

Policy menetapkan minimum:

- 7 daily;
- 8 weekly;
- 12 monthly;
- checkpoint recovery/release penting dipertahankan sampai ada keputusan eksplisit menggantinya.

Raw rescue artifact tidak boleh dihapus oleh proses retention R0.

## 9. Instruksi untuk Chat 5

1. Review PR #3; jangan merge otomatis tanpa review.
2. Integrasikan source/provenance/test worker lain lebih dulu sesuai urutan coordinator.
3. Setelah R0 integrated pada clone lokal Windows, jalankan `Backup-Repository.ps1`.
4. Jalankan verify + restore drill sampai manifest benar-benar `VERIFIED`.
5. Jalankan dedicated history secret scan bila tersedia.
6. Buat secondary + offsite copy dan verifikasi hash.
7. Catat final artifact hash/bundle status hanya pada final shared recovery state milik Chat 5.
