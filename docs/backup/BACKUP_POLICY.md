# BACKUP POLICY — ChatGPT Queue Runner

Status: `RECONSTRUCTED_FROM_DOCS`

Tujuan kebijakan ini adalah membuat proyek dapat dipulihkan walaupun akun/repository GitHub tidak dapat diakses. GitHub adalah remote kerja, bukan satu-satunya backup.

## 1. Prinsip 3-2-1

Untuk setiap checkpoint penting, simpan minimal:

1. **Copy A — working clone lokal** pada SSD utama.
2. **Copy B — backup lokal sekunder** pada media fisik berbeda, idealnya HDD/SSD eksternal.
3. **Copy C — offsite** di lokasi/provider berbeda dari GitHub dan berbeda dari media lokal.

GitHub account kedua **bukan backup independen penuh** karena masih bergantung pada vendor yang sama, aturan platform yang sama, konektivitas, serta risiko suspend/lockout yang berkorelasi. Mirror GitHub boleh menjadi copy tambahan, tetapi tidak menggantikan Copy B atau Copy C.

## 2. Isi backup canonical

Satu set backup canonical berisi:

- `repo.bundle` — hasil `git bundle create --all`, mencakup refs/history Git yang tersedia pada clone lokal.
- `source.zip` — hasil `git archive HEAD`; hanya source **tracked + committed** pada HEAD.
- `SHA256SUMS.txt` — checksum SHA-256 untuk artifact.
- `BACKUP_MANIFEST.json` — commit, branch, waktu, status verifikasi, status secret preflight, dan lokasi copy.
- log verifikasi/restore drill bila dilakukan.

`source.zip` sengaja dibuat dengan `git archive`, bukan ZIP seluruh working directory. Dengan demikian file untracked seperti `.env`, cookie export, token dump, cache, atau file lokal lain tidak ikut secara otomatis.

## 3. Syarat sebelum backup canonical

Backup canonical hanya boleh dibuat dari **clone Git lokal yang benar** dan working tree harus bersih.

Preflight wajib:

- `git rev-parse --is-inside-work-tree` = true;
- `git status --porcelain` kosong;
- HEAD dapat dibaca;
- tidak ada file tracked berisiko tinggi seperti `.env`, private key, cookie jar, credential dump, atau secret file;
- lakukan secret scan sebelum backup;
- jika secret pernah ter-commit ke history, **jangan menganggap penghapusan file pada HEAD cukup**. Rotasi/revoke secret, bersihkan history melalui prosedur terpisah, lalu buat baseline backup baru.

## 4. Secret exclusion

Dilarang memasukkan:

- API key;
- access/refresh token;
- password;
- cookie/session storage;
- private key/certificate private material;
- browser profile;
- credential export;
- `.env` nyata.

File contoh seperti `.env.example` boleh ada hanya jika nilainya dummy dan tidak valid.

Script backup melakukan preflight nama file dan pola secret umum. Ini **bukan pengganti** scanner khusus seperti Gitleaks/TruffleHog. Jika `gitleaks` tersedia, jalankan juga terhadap seluruh history sebelum menyatakan repository secret-clean.

## 5. Jadwal backup

Buat backup pada kondisi berikut:

- setelah checkpoint recovery yang sudah diverifikasi;
- sebelum dan sesudah perubahan besar;
- sebelum release/tag;
- sebelum migrasi akun/repository;
- minimal mingguan selama proyek aktif;
- setiap kali ada source baru yang belum memiliki dua copy independen.

## 6. Retention

Jangan menghapus rescue/raw artifact asli hanya karena backup baru sudah ada.

Retention minimum yang disarankan:

- 7 backup harian terbaru;
- 8 backup mingguan terbaru;
- 12 backup bulanan terbaru;
- checkpoint recovery/release penting: simpan tanpa batas sampai ada keputusan eksplisit menggantinya.

Penghapusan retention harus dilakukan hanya setelah hash dan restore dari backup yang lebih baru lolos verifikasi. Tidak ada script auto-delete pada fase R0 untuk menghindari kehilangan data akibat salah klasifikasi.

## 7. Penamaan

Format folder:

`CHATGPT-QUEUE-RUNNER_backup_YYYYMMDD_HHMMSSZ_<shortsha>`

Contoh isi:

```text
CHATGPT-QUEUE-RUNNER_backup_20261001_063000Z_083ed50/
  repo.bundle
  source.zip
  SHA256SUMS.txt
  BACKUP_MANIFEST.json
```

## 8. Verifikasi

Setiap backup dianggap `VERIFIED` hanya jika:

1. SHA-256 cocok;
2. `git bundle verify repo.bundle` berhasil;
3. restore drill berhasil pada direktori kosong;
4. `git fsck --full` pada hasil restore berhasil;
5. restored HEAD sesuai commit yang dicatat di manifest.

Jika hanya artifact dibuat tetapi belum restore drill, status adalah `CREATED_NOT_RESTORED`.

## 9. Restore drill

Restore drill tidak boleh dilakukan di working clone utama. Gunakan folder kosong/baru.

Urutan:

```powershell
pwsh tools/backup/Verify-Backup.ps1 -BackupDir "D:\Backup\..."
pwsh tools/backup/Restore-Backup.ps1 -BackupDir "D:\Backup\..." -RestorePath "D:\Restore-Test\CHATGPT-QUEUE-RUNNER"
```

Setelah restore, cek branch/ref penting dan file source. Untuk recovery produksi, jangan langsung overwrite working copy lama; bandingkan dahulu.

## 10. Offsite copy

Setelah local backup lolos verifikasi:

- copy folder backup utuh ke media kedua;
- copy folder yang sama ke offsite storage terenkripsi atau folder cloud yang benar-benar tersinkron;
- jangan mengandalkan status ikon sync saja; verifikasi ukuran/file dan hash setelah copy bila memungkinkan;
- simpan sekurangnya satu copy yang tetap dapat diakses walaupun akun GitHub terkena suspend.

`tools/backup/Copy-BackupCopies.ps1` disediakan untuk menyalin set backup ke dua destination yang dipilih user. Destination harus berada di media/provider yang berbeda untuk memenuhi 3-2-1.

## 11. Status fase Recovery R0

Pada Chat 4 cloud environment tidak tersedia clone lokal milik pengguna yang dapat diperlakukan sebagai sumber authoritative. Karena itu status bundle proyek nyata adalah:

`BACKUP_LOCAL_PENDING`

Script, policy, manifest template, dan prosedur restore dapat disiapkan serta diuji secara terbatas, tetapi bundle final proyek harus dijalankan pada clone lokal user/agent Windows setelah R0 integrated.