# Final Update Notes

Perubahan utama yang sudah dirapikan:

- Admin form sekarang bisa edit project yang sudah ada.
- Form project ditambah label gambar `Image 1` dan `Image 2`.
- Hero, subtitle, about, contact, project summary, dan project description bisa pakai AI assist.
- Section `Creative Focus` diganti menjadi `Software I Use` dengan input icon / foto manual.
- `About Me` sekarang punya highlights/tag manual.
- Halaman project punya protected preview browser, watermark besar, QR support ke `https://saweria.co/Fizzx`, dan download image ber-watermark.
- Ditambahkan log basic security events ke tabel `security_events` untuk preview protection best-effort.
- Homepage dan detail project dirapikan supaya lebih premium dan lebih dekat ke brief Arkana Kafi.
- Route tambahan admin tersembunyi tersedia di `/the-vault-access`.
- Schema Supabase diperbarui agar cocok dengan UI terbaru.

## Catatan penting

Browser tidak bisa menjamin anti-screenshot 100%. Karena itu sistem dibuat dengan pendekatan **best effort**:

- protected preview overlay
- right click block
- shortcut detect + log
- watermark besar
- QR support
- metadata author pada file hasil proses

## Setup

Jalankan ulang SQL schema terbaru di folder `sql/supabase-schema.sql`, lalu pastikan bucket berikut ada:

- `project-images`
- `project-assets`

Setelah itu isi env Supabase dan jalankan install dependencies seperti biasa.
