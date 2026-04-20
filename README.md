# The Arkana Vault v2

Versi kedua ini diarahkan menjadi **personal portfolio** yang lebih terasa seperti website portfolio sungguhan, bukan showcase template biasa.

## Yang diubah
- Struktur landing dirombak jadi: **Hero → About → Focus → Selected Projects → Contact**
- Semua copy penting dibuat **editable manual oleh admin** melalui dashboard
- **Project Notes dihapus** dari detail project
- Ditambahkan **RBAC admin** via tabel `admin_users` + RLS ketat
- Ditambahkan **download popup dock** dengan mode minimize ke kanan bawah
- Ditambahkan **server download route** untuk watermark otomatis pada gambar saat diunduh
- Metadata author terbaik yang bisa disematkan dari server ditambahkan sebagai **best effort**

## Penting
- Metadata author pada file gambar **bisa disematkan**, tetapi **tidak bisa dijamin permanen / tidak bisa diubah** setelah file sudah diunduh oleh user. Itu batasan browser, OS, dan editor file.
- Website bisa memicu **download otomatis**, tetapi **tidak bisa memaksa file langsung terinstall**. Instalasi tetap dikontrol browser dan sistem operasi.

## Setup
```bash
npm install
cp .env.example .env.local
npm run dev
```

## Admin
1. Jalankan SQL di `sql/supabase-schema.sql`
2. Buat user auth di Supabase
3. Masukkan `user_id` ke tabel `admin_users`
4. Login dari route rahasia `/admin`

## Storage
- Bucket: `project-images`
- Bucket: `project-assets`

## Flow Download Watermark
- Jika asset project berupa gambar (`jpg`, `jpeg`, `png`, `webp`), route download akan:
  - fetch file
  - generate watermark `Arkana Kafi`
  - kirim file download hasil watermark
- Jika asset bukan gambar, route akan fallback ke download biasa
