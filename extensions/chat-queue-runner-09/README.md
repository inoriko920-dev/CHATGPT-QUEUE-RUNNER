# Chat Queue Runner

Ekstensi Chrome sederhana untuk menjalankan daftar prompt di ChatGPT satu per satu. Prompt berikutnya baru dikirim setelah jawaban sempat mulai, berhenti, dan halaman stabil selama jeda yang ditentukan.

## Instalasi

1. Ekstrak ZIP jika Anda memakai paket ZIP.
2. Buka `chrome://extensions` di Chrome.
3. Aktifkan **Developer mode** di kanan atas.
4. Klik **Load unpacked / Muat yang belum dipaketkan**.
5. Pilih folder runner yang berisi `manifest.json`.
6. Buka atau muat ulang `https://chatgpt.com/`.

## Pemakaian

1. Buka percakapan ChatGPT yang akan digunakan.
2. Klik ikon ekstensi **Chat Queue Runner**.
3. Tempel beberapa pekerjaan. Setiap baris dianggap sebagai satu prompt; tekan Enter untuk membuat pekerjaan berikutnya.
4. Atur jeda. Batas pekerjaan per sesi ditetapkan 100 prompt.
5. Klik **Mulai**.

Contoh:

```text
Buat alur film untuk judul: Film A. Gunakan format proyek saya.
Buat alur film untuk judul: Film B. Gunakan format proyek saya.
Buat alur film untuk judul: Film C. Gunakan format proyek saya.
```

Baris kosong akan diabaikan. Karena Enter menjadi pemisah pekerjaan, satu prompt tidak dapat memakai beberapa baris pada versi ini.

Jika jawaban sedang berjalan saat **Mulai** ditekan, ekstensi akan menunggunya selesai sebelum mengirim item pertama.

## Pengaman

- Tombol **Jeda** tersedia di popup dan indikator kecil di halaman.
- Satu sesi hanya terikat ke satu tab ChatGPT, sehingga beberapa tab terbuka tidak menyebabkan prompt terkirim ganda.
- Maksimal pekerjaan per sesi adalah 100 prompt.
- Permintaan konfirmasi/izin pengguna tetap menjeda antrean.
- Pemulihan tampilan DOCX/artifact hanya aktif untuk prompt yang dikirim runner sendiri, bukan generasi manual/eksternal.
- Daftar prompt dan progres hanya disimpan melalui penyimpanan lokal Chrome.

## Pemulihan DOCX / artifact — v0.1.9

Jika prompt antrean menghasilkan DOCX atau artifact dan ChatGPT otomatis membuka viewer sehingga kotak prompt menghilang, `artifact-recovery.js` akan:

1. mengingat URL percakapan sebelum viewer mengambil alih;
2. menunggu sampai generasi tidak lagi aktif;
3. mencoba menutup modal/viewer dengan Escape atau tombol Close/Tutup di dalam dialog;
4. bila ChatGPT berpindah route, kembali ke URL percakapan yang sama;
5. mempertahankan `cqr_state`, sehingga prompt yang sudah selesai tidak dikirim ulang dan antrean dapat maju ke prompt berikutnya.

## Batasan versi 0.1

- Hanya ditujukan untuk ChatGPT Web (`chatgpt.com` dan alamat lama `chat.openai.com`).
- Deteksi bergantung pada struktur antarmuka ChatGPT. Jika OpenAI mengubah elemen halaman, selector mungkin perlu diperbarui.
- Tab ChatGPT harus tetap terbuka. Chrome dapat memperlambat tab yang lama berada di latar belakang.
- Tinjau hasil secara berkala. Jangan memakai antrean tanpa pengawasan untuk tindakan sensitif, pembayaran, penghapusan data, atau pengiriman ke pihak lain.

## Struktur

- `manifest.json` — konfigurasi Manifest V3.
- `background.js` — mengikat satu sesi antrean ke satu tab agar tidak terkirim ganda.
- `popup.html`, `popup.css`, `popup.js` — antarmuka antrean.
- `interruption-bypass.js` — membantu runner melewati kondisi respons terhenti yang recoverable.
- `artifact-recovery.js` — memulihkan percakapan bila DOCX/artifact membuka viewer dan menyembunyikan composer.
- `content.js` — pengisian prompt, deteksi jawaban selesai, progres, dan pengaman.

## Kompatibilitas UI terbaru

Versi **0.1.9** mempertahankan fallback selector untuk UI ChatGPT Web terbaru dan menambahkan pemulihan khusus DOCX/artifact. Perubahan ini sengaja dipisahkan dari mesin antrean utama agar risiko regresi lebih kecil.
