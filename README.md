# QURO – Belajar Al-Qur'an

Dibuka langsung dengan klik dua kali `index.html` (tanpa server, tanpa build). Semua JS memakai skrip biasa, bukan modul ES, jadi urutan `<script>` di `index.html` penting.

## Struktur

Satu aplikasi (SPA) tanpa build, dibagi per fitur. Game punya halaman sendiri (iframe); layar biasa tetap satu aplikasi karena berbagi state, bilah bawah, dan transisi.

```
index.html            kerangka halaman + urutan muat file (urutan penting: variabel global saling dibaca)
core/                 kerangka bersama
  state.js            state + localStorage          core.js     go(), render, bilah bawah, modal, toast
  helpers.js          fungsi tampilan kecil         events.js   penangan klik utama
  icons.js            ikon garis                    main.js     mulai aplikasi, pulihkan layar
  routes.js           tabel fitur lazy + pemuat      nav-fix.js ptr.js perf.js offline.js update.js
  version.js          (dibuat tools/make-sw.js, jangan diedit)
fitur/                satu folder = satu fitur: layar + data + gayanya sendiri
  belajar/            home, books, bookdetail, reader, huruf, harakat, record
    views.js practice.js reader.js settings.js progress.js tajwid.js lock.js  reader.css
    data/             letters harakat iqro pola latihan iqro1-buku  iqro-lazy.js  iqro2-6-buku.js (dimuat belakangan)
  kuis/               quiz.js (kuis halaman/jilid/tajwid, bintang, tajwid)      data/tajwid.js
  profil/             profile.js (progres, profil, misi, badge, tentang), share-profile.js, share.css
  pengaturan/         preferences.js (target, notifikasi, audio, privasi, tema), backup.js
  komunitas/          social.js (teman, papan peringkat, kabar, komunitas)      data/community.js
  akun/               auth.js, cloud.js, cloud-config.js (Supabase)
  toko/               shop.js (Toko Maskot)                                     data/shop.js
  game/               games.js (daftar game + pembungkus iframe)                data/games.js
css/                  gaya bersama: base, components, animations, fonts, tailwind
games/                lobby + tiap game berdiri sendiri (satu folder = satu game)
  index.html, lobby.js  lobby "Semua Game"
  _shared/              kit.js kit.css theme.js (jembatan ke aplikasi, loading, bilah atas)
  susun-huruf/ memory-huruf/ tebak-huruf/ telusuri/ dengar-pilih/ cari-huruf/ lanjutkan-huruf/
assets/               mascot.js, mascot/ (14 WebP), emoji.js, fonts, lib
icons/                ikon aplikasi dan favicon
supabase/  tests/  tools/   skema server, tes asap (jsdom), alat build (make-sw, test-data, make-icons)
```

Memuat belakangan (lazy): `fitur/belajar/data/iqro2-6-buku.js` (±300 KB) baru diambil saat Iqro 2-6 pertama kali dibuka (pembaca atau kuis), lewat `loadBook26()`/`bookGate()` di `iqro-lazy.js`. Jumlah halaman tiap jilid dicatat di `iqro-lazy.js` (`BOOK26_N`) supaya sampul, progres, dan kunci level tidak berubah; `tools/test-data.js` menjaga angkanya sama dengan isi buku. Berkas tetap masuk cache offline.

Fitur lazy (`core/routes.js`): `pengaturan` (preferences.js), `profil` (profile.js, share-profile.js, share.css), dan `latihan` (practice.js) tidak ada di `index.html`. `go("<layar>")` memuatnya saat pertama dibuka, dan sisanya dimuat saat browser menganggur (kecuali mode hemat data). Kode inti yang ikut mengubah layar lazy memakai `onFeature("<fitur>",()=>{...})` (contoh: kartu Mode hemat di `perf.js`). `tools/test-data.js` menjaga: berkasnya ada dan masuk cache offline, daftar layar cocok dengan `V.*` di berkas, dan tidak ada kode awal yang memanggil isi fitur lazy.

Menambah fitur baru:
- Biasa (dimuat di awal): buat `fitur/<nama>/` berisi layar (`V.nama=...`), data, dan CSS-nya; daftarkan `<script>` di `index.html` (setelah file yang dibutuhkan).
- Lazy (ringan, layar saja): daftarkan di `LAZY` pada `core/routes.js` dan jangan tulis `<script>`-nya di `index.html`. Fitur yang fungsinya dipanggil kode lain (kuis, toko, komunitas, akun) sengaja tidak lazy.
- Lalu `node tools/make-sw.js`.

## Kuis, bintang, dan komunitas

- Bintang kuis: semua benar = 4, ≥66% = 3, ≥40% = 2, ada yang benar = 1. Hanya skor terbaik yang disimpan (`localStorage` `iqro_quiz`, kunci `p1-3` halaman, `j1` jilid, `tj` tajwid).
- Postingan dari tombol bagikan disimpan di `iqro_posts` dan tampil paling atas di Komunitas. Sampai ada server, postingan hanya terlihat di perangkat ini.
- Warna tajwid bisa dimatikan di Pengaturan baca. Ganti warna lewat variabel `--tj-tanwin`, `--tj-tasydid`, `--tj-mad`.

## Catatan penting

- Urutan muat: `data` → `assets` → `js/*` → `js/views/*` → `games.js` → `events.js` → `main.js`. `views/learn.js` harus pertama di antara views karena membuat `V`.
- Huruf Arab ditulis RTL dan harus berada di dalam elemen `.ar`. Jangan membalik urutan array huruf.
- Materi latihan dibuat oleh `fitur/belajar/data/latihan.js` saat aplikasi dibuka (pengacak bersemi, jadi selalu sama). Jilid: 1 fathah (14 hal), 2 kasrah dan dhammah (10), 3 mad (12), 4 sukun dan tanwin (10), 5 tasydid (10), 6 gabungan dan ujian (10). Ubah jumlah halaman atau pola kata di `SPEC` dan fungsi `j1`–`j6`. Itu hanya dipakai bila file data buku (`fitur/belajar/data/iqro1-buku.js`, `fitur/belajar/data/iqro2-6-buku.js`) tidak dimuat; secara bawaan Jilid 1–6 memakai data buku (lihat bagian Lisensi di bawah).
- Aturan tulisan kata (fitur/belajar/data/latihan.js): pada mad, waw mati dan ya mati selalu diberi sukun, alif tidak (alif bersukun berarti berhenti mendadak, bukan panjang). Huruf ج ح خ ه tidak boleh menerima sambungan dari huruf sebelumnya di dalam satu kata (bentuk tengah/akhirnya mirip dan mudah terbaca terbalik, mis. قخص terbaca "khoqash"); mereka hanya muncul di awal kata atau setelah huruf pemutus (ا د ذ ر ز و). Ubah di konstanta `NJ` dan `RS`.
- Tailwind, font Amiri/Nunito, dan qrcodejs lokal (`css/tailwind.css`, `css/fonts.css`, `assets/fonts/`, `assets/lib/`). Tidak ada lagi ketergantungan ke CDN atau GitHub pihak lain.

## Offline

- Semua file aplikasi lokal, jadi membuka `index.html` langsung dari file sudah tidak butuh internet.
- Lewat http/https, `sw.js` menyimpan seluruh aplikasi sehingga bisa dibuka offline setelah kunjungan pertama. Jalankan `node tools/make-sw.js` setiap kali ada file berubah agar pengguna mendapat versi baru.
- Bisa dipasang di layar utama HP (PWA): `manifest.webmanifest` dan `icons/`. Di Android Chrome pilih menu ⋮ lalu “Instal aplikasi”; di iPhone Safari pilih Bagikan lalu “Tambah ke Layar Utama”. Syaratnya dibuka lewat https (atau localhost). Ikon dibuat ulang dengan `python3 tools/make-icons.py` (huruf ق, font Amiri).
- Ikon aplikasi dan favicon (wajah burung hud-hud, gaya penuh-kotak) dibuat dari gambar di `tools/ikon-sumber/` lewat `python3 tools/make-icons-maskot.py`, lalu jalankan `node tools/make-sw.js`. `tools/make-icons.js` dan `tools/make-icons.py` adalah skrip ikon lama (buku dan huruf ق) dan tidak dipakai lagi.
- Mengubah pola kata latihan: edit `fitur/belajar/data/pola.js` (kode S, M, T, D, K; pola yang melanggar aturan otomatis dilewati dan diberi peringatan di konsol). Lembar tinjauan untuk guru dibuat dengan `node tools/tinjau.js` (satu berkas HTML mandiri, bisa dicetak).
- Mengubah tampilan (kelas Tailwind baru)? Bangun ulang CSS: `npm i tailwindcss@3.4.17` lalu `npx tailwindcss -c tools/tailwind.config.js -i tools/tailwind.in.css -o css/tailwind.css --minify`. Kelas yang disusun dari potongan teks saat runtime tidak terdeteksi; tulis nama kelas utuh.

## Lisensi materi Iqro Jilid 1–6

`fitur/belajar/data/iqro1-buku.js` dan `fitur/belajar/data/iqro2-6-buku.js` adalah transkripsi buku Iqro karya KH. As'ad Humam dari https://github.com/dyazincahya/iqro-json (hasil OCR, bisa ada salah ketik). Boleh dipakai gratis untuk belajar, **tidak boleh diperjualbelikan** (hak cipta ada pada pemegang hak buku). Kalau QURO suatu saat dimonetisasi, hapus kedua file ini dan baris `<script>`-nya di `index.html`; Jilid 1–6 buatan program di `fitur/belajar/data/latihan.js` otomatis dipakai lagi. Jalankan `node tools/make-sw.js` setelah mengubah file.

## Menambah game baru

1. Buat folder `games/<nama-game>/` berisi `index.html` (salin dari game lain: memuat `../_shared/theme.js` di `<head>`, `../../css/*` agar gayanya sama dengan aplikasi, penanda loading `#gld` di awal `<body>`, lalu `../_shared/kit.js` dan `game.js`).
2. Semua yang khusus game itu (soal, gambar, suara, css, model 3D) taruh di folder itu juga. Pakai kelas Tailwind yang sudah ada, atau tulis css sendiri di `style.css` milik game.
3. Di `game.js` panggil `GK.run({slug,title,hint,init,view,act})` (lihat `games/susun-huruf/game.js`). Selesai? panggil `c.win()` di dalam `act`.
4. Daftarkan di `fitur/game/data/games.js`: satu baris di `MG`, satu pasangan di `GP` (kunci → nama folder), dan kategori di `GC` (juga di `fitur/game/data/games.js`, dipakai lobby).
5. Jalankan `node tools/make-sw.js`.

Alur: Home → (grid 3 game atau "Lihat semua") → lobby `games/index.html` → game. Aplikasi membuka lobby/game dalam iframe layar penuh (tanpa header dan menu bawah), jadi koin, tema, dan suara tetap ikut aplikasi, tetapi semuanya juga bisa dibuka sendiri (`games/index.html`, `games/<nama>/index.html`). Tombol keluar (X) di kanan atas game kembali ke lobby; game yang dibuka dari grid Home (`?from=home`) kembali ke Home. Tombol kembali HP mengikuti aturan yang sama. Loading tampil saat lobby/game dibuka (minimal 350 ms supaya tidak berkedip).

## Cadangan, laporan, banner versi, dan tes

- `fitur/pengaturan/backup.js`: layar **Profil → Cadangkan & pulihkan** (ekspor/impor file JSON; tiap kunci dicek bentuknya sebelum ditulis, sesi login tidak ikut), penyimpanan koin (`iqro_coins`), dan tombol **Lapor** di Reader (disimpan di `iqro_reports`, bisa disalin dari layar cadangan).
- `core/update.js`: banner "Versi baru QURO tersedia" saat service worker baru aktif; app juga mengecek versi baru saat dibuka kembali (maks. 1x per 30 menit).
- `core/ptr.js`: tarik ke bawah untuk menyegarkan halaman yang sedang dibuka.
- `tools/test-data.js`: tes cepat tanpa dependensi, jalankan `node tools/test-data.js` sebelum push. Memeriksa sintaks semua file JS, data Iqro Jilid 1–6 (sel kosong, huruf Latin di sisi Arab, posisi ganda), dan bahwa semua file yang dipanggil `index.html` ada dan masuk cache offline.
- **Nomor versi** (tampil di Profil paling bawah dan di Tentang & kredit, mis. `v1.27`): `node tools/make-sw.js` menaikkan build 1 setiap isi file berubah dan menulisnya ke `version.json` serta `core/version.js` (jangan diedit tangan). Menjalankannya berulang tanpa perubahan tidak menaikkan nomor. Ubah angka depan lewat `major` di `version.json`.


## Tes otomatis

- `node tools/test-data.js`: sintaks semua JS, data Iqro 1-6, file yang dirujuk `index.html` ada di cache offline, nomor versi.
- `cd tests && npm install && node smoke.js`: memuat aplikasi sungguhan di jsdom. Menguji home, absen 7 hari (tersimpan, lanjut, putus), koin, ketujuh game, halaman Tanda baca, semua halaman Iqro, dan keamanan nama pengguna. jsdom tidak punya layout, jadi tampilan (tinggi iframe, kanvas, pas lebar) tetap dicek di HP.
- GitHub Actions: salin `cek.yml` ke `.github/workflows/cek.yml` (lewat web GitHub atau token dengan izin Workflows). Ia menjalankan keduanya tiap push dan gagal bila `sw.js`/nomor versi belum diperbarui (`node tools/make-sw.js`).

## Akun & sinkronisasi (Supabase)

Login memakai email + kata sandi, progres disinkronkan ke Supabase. Offline-first: tanpa internet atau tanpa akun (mode tamu) aplikasi tetap jalan dari data di HP.

- `fitur/akun/cloud-config.js`: URL project + kunci **publishable** (publik). Jangan pernah menaruh kunci secret/service_role di repo. Kosongkan untuk mematikan fitur akun.
- `fitur/akun/cloud.js`: daftar, masuk, keluar, dan sinkronisasi lewat fetch (tanpa SDK). Data digabung (union / ambil terbesar), penulisan ke server memakai pembanding `updated_at` sehingga tidak menimpa data dari HP lain.
- `supabase/schema.sql`: tabel `profiles` dan `progress` + RLS (tiap pengguna hanya bisa akses barisnya sendiri) + pembuat profil otomatis. Tempel di Supabase -> SQL Editor -> Run.
- Yang disinkronkan: halaman Iqro selesai, bintang kuis, waktu belajar, bookmark, koin (dihitung total diperoleh dikurangi total dibelanjakan, jadi belanja di Toko tidak "dikembalikan" saat sinkron), barang Toko, reaksi, absen, posisi baca, pengaturan. Tema, laporan, dan postingan komunitas belum.
- Satu HP dipakai akun lain: progres akun sebelumnya dibuang dari HP (tetap aman di server), tidak dicampur.

Pengaturan Supabase yang perlu dilakukan sekali (Dashboard):
1. SQL Editor: jalankan `supabase/schema.sql`.
2. Authentication -> Sign In / Providers -> Email: untuk tahap awal matikan **Confirm email** (tanpa SMTP sendiri, email bawaan Supabase hanya terkirim ke anggota tim dan dibatasi 2/jam). Nyalakan lagi setelah SMTP (Brevo/Resend) dipasang.
3. Authentication -> URL Configuration: Site URL `https://quroapp.vercel.app`.

## Kunci level berurutan

`fitur/belajar/lock.js`. Halaman berikutnya terbuka setelah lulus kuis halaman sebelumnya, dan Iqro berikutnya setelah lulus Kuis Jilid sebelumnya (Kuis Jilid sendiri terbuka setelah semua halaman jilid itu dibuka). Lulus = minimal `LOCK_MIN` (3) bintang.

- Pengguna lama tidak terkunci dari yang sudah mereka buka: halaman dan Iqro yang pernah dibuka tetap terbuka, hanya yang berikutnya yang butuh lulus kuis.
- Bisa dimatikan di Profil -> Target belajar -> "Kunci level berurutan" (`iqro_lock` = `0`).
- Dasarnya `iqDN` (halaman dibuka) dan `iqQZ` (bintang kuis), jadi ikut tersinkron antar HP.
- Jaring pengaman `lockFix()` di `V.reader` mengembalikan ke halaman terbuka bila ada jalur lain (penanda, tautan lama) yang menuju halaman terkunci.
