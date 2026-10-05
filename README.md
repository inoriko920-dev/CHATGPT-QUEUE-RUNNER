# ChatGPT Queue Runner

Versi **v0.1.9**. Paket berisi Runner 01–10.

Perbaikan utama v0.1.9: antrean tidak lagi macet ketika prompt menghasilkan DOCX/artifact yang otomatis membuka viewer ChatGPT dan membuat kotak prompt menghilang.

## Otomatis lanjut saat ChatGPT berhenti

Runner tetap memverifikasi prompt diterima, menunggu jawaban berhenti dan stabil, lalu bergerak ke prompt berikutnya sesuai jeda yang diatur. Konfirmasi/izin pengguna tetap menjeda antrean.

## Pemulihan DOCX / artifact

Setiap Runner sekarang memuat `artifact-recovery.js`. Saat prompt yang dikirim runner sendiri membuka viewer DOCX/artifact:

- URL percakapan terakhir yang memiliki composer disimpan;
- recovery hanya berjalan pada tab pemilik antrean dan hanya untuk prompt queue, bukan generasi manual;
- recovery menunggu generasi berhenti, lalu mencoba menutup viewer/modal;
- bila ChatGPT berpindah route, runner kembali ke URL percakapan semula;
- state antrean tetap dipertahankan sehingga prompt yang sudah selesai tidak dikirim ulang.

Setelah memperbarui source extension, buka `chrome://extensions` lalu klik **Reload** pada Runner 01–10 yang sedang dipakai.
