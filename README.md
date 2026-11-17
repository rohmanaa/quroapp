# QURO – Belajar Al-Qur'an

Dibuka langsung dengan klik dua kali `index.html` (tanpa server, tanpa build). Semua JS memakai skrip biasa, bukan modul ES, jadi urutan `<script>` di `index.html` penting.

## Struktur

Satu aplikasi (SPA) tanpa build, ditata seperti proyek Vue (`create-vue`): kode dipisah menurut jenisnya di `src/`. Game punya halaman sendiri (iframe); layar biasa tetap satu aplikasi karena berbagi state, bilah bawah, dan transisi.

```
index.html  manifest.webmanifest  sw.js (dibuat tools/make-sw.js)  version.json  icons/
src/
  main.js           mulai aplikasi, pulihkan layar setelah muat ulang
  events.js         penangan klik utama (delegasi data-act / data-go)
  version.js        nomor versi (dibuat tools/make-sw.js, jangan diedit)
  router/           index.js  registri layar V, go(), render(), tombol kembali
                    routes.js tabel layar yang dimuat belakangan (lazy) + pemuatnya
  views/            satu berkas = satu layar: views/<nama>.js mendefinisikan V.<nama> (32 layar)
  components/       potongan UI bersama: bottom-bar modal toast absen-card games-home leaderboard-card reel-card
                    quiz-cards share-sheet share-profile reactions reader-settings auth-fields
  stores/           state dan logika domain: state progress lock reader quiz shop community
  services/         urusan di luar UI: cloud + cloud-config (Supabase), backup, game-host, offline, perf, speech, update
  utils/            helpers icons tajwid nav-fix ptr
  data/             data statis: letters harakat iqro pola latihan iqro1-buku iqro2-6-buku tajwid community shop games
                    + iqro-lazy.js (Iqro 2-6 dimuat belakangan)
  assets/           css/ (base components animations fonts tailwind reader share), fonts/, lib/, mascot/, mascot.js, emoji.js
games/              lobby + tiap game berdiri sendiri (satu folder = satu game; memakai src/assets/css agar gayanya sama)
  index.html lobby.js  _shared/ (kit.js kit.css theme.js)  susun-huruf/ memory-huruf/ tebak-huruf/ telusuri/ dengar-pilih/ cari-huruf/ lanjutkan-huruf/
supabase/  tests/  tools/    skema server, tes asap (jsdom), alat build (make-sw, test-data, make-icons)
```

Aturan:
- `src/views/<nama>.js` hanya mendefinisikan `V.<nama>`. Pembungkus layar lain berawalan `_` (mis. `_versi.js`). Satu pengecualian: layar Cadangkan ada di `services/backup.js` karena berbagi variabel privat dengan logika cadangan. `tools/test-data.js` menjaga ini.
- Urutan `<script>` di `index.html` tetap penting (variabel global saling dibaca): utils, stores, components, router, views, lalu services; ikuti yang sudah ada.
- Memuat belakangan (lazy): `src/data/iqro2-6-buku.js` (±300 KB) baru diambil saat Iqro 2-6 pertama kali dibuka, lewat `loadBook26()`/`bookGate()` di `data/iqro-lazy.js` (jumlah halaman dicatat di situ agar sampul, progres, dan kunci tidak berubah; dijaga `tools/test-data.js`).
- Layar lazy (`router/routes.js`): `pengaturan` (target, notifications, audio, privacy, theme), `profil` (profile, progress, daily, share, result, badges, about, _versi, share-profile.js, share.css), `latihan` (record). Dimuat saat pertama dibuka, sisanya saat browser menganggur (kecuali mode hemat data). Kode inti yang ikut mengubah layar lazy memakai `onFeature("<fitur>",()=>{...})` (contoh: kartu Mode hemat di `services/perf.js`).

Menambah layar baru: buat `src/views/<nama>.js` (`V.<nama>=()=>...`), pasang `<script>`-nya di `index.html` (setelah komponen/store yang dipakainya), lalu `node tools/make-sw.js`. Komponen UI bersama taruh di `components/`, state dan logika di `stores/`, hal di luar UI (jaringan, penyimpanan, SW) di `services/`. Layar ringan yang jarang dibuka boleh lazy: daftarkan di `LAZY` pada `router/routes.js` dan jangan tulis `<script>`-nya di `index.html`.

## Kuis, bintang, dan komunitas

- Bintang kuis: semua benar = 4, ≥66% = 3, ≥40% = 2, ada yang benar = 1. Hanya skor terbaik yang disimpan (`localStorage` `iqro_quiz`, kunci `p1-3` halaman, `j1` jilid, `tj` tajwid).
- Postingan dari tombol bagikan disimpan di `iqro_posts` dan tampil paling atas di Komunitas. Sampai ada server, postingan hanya terlihat di perangkat ini.
- Warna tajwid bisa dimatikan di Pengaturan baca. Ganti warna lewat variabel `--tj-tanwin`, `--tj-tasydid`, `--tj-mad`.

## Catatan penting

- Urutan muat: `data` → `assets` → `js/*` → `js/views/*` → `games.js` → `events.js` → `main.js`. `views/learn.js` harus pertama di antara views karena membuat `V`.
- Huruf Arab ditulis RTL dan harus berada di dalam elemen `.ar`. Jangan membalik urutan array huruf.
- Materi latihan dibuat oleh `src/data/latihan.js` saat aplikasi dibuka (pengacak bersemi, jadi selalu sama). Jilid: 1 fathah (14 hal), 2 kasrah dan dhammah (10), 3 mad (12), 4 sukun dan tanwin (10), 5 tasydid (10), 6 gabungan dan ujian (10). Ubah jumlah halaman atau pola kata di `SPEC` dan fungsi `j1`–`j6`. Itu hanya dipakai bila file data buku (`src/data/iqro1-buku.js`, `src/data/iqro2-6-buku.js`) tidak dimuat; secara bawaan Jilid 1–6 memakai data buku (lihat bagian Lisensi di bawah).
- Aturan tulisan kata (src/data/latihan.js): pada mad, waw mati dan ya mati selalu diberi sukun, alif tidak (alif bersukun berarti berhenti mendadak, bukan panjang). Huruf ج ح خ ه tidak boleh menerima sambungan dari huruf sebelumnya di dalam satu kata (bentuk tengah/akhirnya mirip dan mudah terbaca terbalik, mis. قخص terbaca "khoqash"); mereka hanya muncul di awal kata atau setelah huruf pemutus (ا د ذ ر ز و). Ubah di konstanta `NJ` dan `RS`.
- Tailwind, font Amiri/Nunito, dan qrcodejs lokal (`src/assets/css/tailwind.css`, `src/assets/css/fonts.css`, `src/assets/fonts/`, `src/assets/lib/`). Tidak ada lagi ketergantungan ke CDN atau GitHub pihak lain.

## Offline

- Semua file aplikasi lokal, jadi membuka `index.html` langsung dari file sudah tidak butuh internet.
- Lewat http/https, `sw.js` menyimpan seluruh aplikasi sehingga bisa dibuka offline setelah kunjungan pertama. Jalankan `node tools/make-sw.js` setiap kali ada file berubah agar pengguna mendapat versi baru.
- Bisa dipasang di layar utama HP (PWA): `manifest.webmanifest` dan `icons/`. Di Android Chrome pilih menu ⋮ lalu “Instal aplikasi”; di iPhone Safari pilih Bagikan lalu “Tambah ke Layar Utama”. Syaratnya dibuka lewat https (atau localhost). Ikon dibuat ulang dengan `python3 tools/make-icons.py` (huruf ق, font Amiri).
- Ikon aplikasi dan favicon (wajah burung hud-hud, gaya penuh-kotak) dibuat dari gambar di `tools/ikon-sumber/` lewat `python3 tools/make-icons-maskot.py`, lalu jalankan `node tools/make-sw.js`. `tools/make-icons.js` dan `tools/make-icons.py` adalah skrip ikon lama (buku dan huruf ق) dan tidak dipakai lagi.
- Mengubah pola kata latihan: edit `src/data/pola.js` (kode S, M, T, D, K; pola yang melanggar aturan otomatis dilewati dan diberi peringatan di konsol). Lembar tinjauan untuk guru dibuat dengan `node tools/tinjau.js` (satu berkas HTML mandiri, bisa dicetak).
- Mengubah tampilan (kelas Tailwind baru)? Bangun ulang CSS: `npm i tailwindcss@3.4.17` lalu `npx tailwindcss -c tools/tailwind.config.js -i tools/tailwind.in.css -o src/assets/css/tailwind.css --minify`. Kelas yang disusun dari potongan teks saat runtime tidak terdeteksi; tulis nama kelas utuh.

## Lisensi materi Iqro Jilid 1–6

`src/data/iqro1-buku.js` dan `src/data/iqro2-6-buku.js` adalah transkripsi buku Iqro karya KH. As'ad Humam dari https://github.com/dyazincahya/iqro-json (hasil OCR, bisa ada salah ketik). Boleh dipakai gratis untuk belajar, **tidak boleh diperjualbelikan** (hak cipta ada pada pemegang hak buku). Kalau QURO suatu saat dimonetisasi, hapus kedua file ini dan baris `<script>`-nya di `index.html`; Jilid 1–6 buatan program di `src/data/latihan.js` otomatis dipakai lagi. Jalankan `node tools/make-sw.js` setelah mengubah file.

## Menambah game baru

1. Buat folder `games/<nama-game>/` berisi `index.html` (salin dari game lain: memuat `../_shared/theme.js` di `<head>`, `../../css/*` agar gayanya sama dengan aplikasi, penanda loading `#gld` di awal `<body>`, lalu `../_shared/kit.js` dan `game.js`).
2. Semua yang khusus game itu (soal, gambar, suara, css, model 3D) taruh di folder itu juga. Pakai kelas Tailwind yang sudah ada, atau tulis css sendiri di `style.css` milik game.
3. Di `game.js` panggil `GK.run({slug,title,hint,init,view,act})` (lihat `games/susun-huruf/game.js`). Selesai? panggil `c.win()` di dalam `act`.
4. Daftarkan di `src/data/games.js`: satu baris di `MG`, satu pasangan di `GP` (kunci → nama folder), dan kategori di `GC` (juga di `src/data/games.js`, dipakai lobby).
5. Jalankan `node tools/make-sw.js`.

Alur: Home → (grid 3 game atau "Lihat semua") → lobby `games/index.html` → game. Aplikasi membuka lobby/game dalam iframe layar penuh (tanpa header dan menu bawah), jadi koin, tema, dan suara tetap ikut aplikasi, tetapi semuanya juga bisa dibuka sendiri (`games/index.html`, `games/<nama>/index.html`). Tombol keluar (X) di kanan atas game kembali ke lobby; game yang dibuka dari grid Home (`?from=home`) kembali ke Home. Tombol kembali HP mengikuti aturan yang sama. Loading tampil saat lobby/game dibuka (minimal 350 ms supaya tidak berkedip).

## Cadangan, laporan, banner versi, dan tes

- `src/services/backup.js`: layar **Profil → Cadangkan & pulihkan** (ekspor/impor file JSON; tiap kunci dicek bentuknya sebelum ditulis, sesi login tidak ikut), penyimpanan koin (`iqro_coins`), dan tombol **Lapor** di Reader (disimpan di `iqro_reports`, bisa disalin dari layar cadangan).
- `src/services/update.js`: banner "Versi baru QURO tersedia" saat service worker baru aktif; app juga mengecek versi baru saat dibuka kembali (maks. 1x per 30 menit).
- `src/utils/ptr.js`: tarik ke bawah untuk menyegarkan halaman yang sedang dibuka.
- `tools/test-data.js`: tes cepat tanpa dependensi, jalankan `node tools/test-data.js` sebelum push. Memeriksa sintaks semua file JS, data Iqro Jilid 1–6 (sel kosong, huruf Latin di sisi Arab, posisi ganda), dan bahwa semua file yang dipanggil `index.html` ada dan masuk cache offline.
- **Nomor versi** (tampil di Profil paling bawah dan di Tentang & kredit, mis. `v1.27`): `node tools/make-sw.js` menaikkan build 1 setiap isi file berubah dan menulisnya ke `version.json` serta `src/version.js` (jangan diedit tangan). Menjalankannya berulang tanpa perubahan tidak menaikkan nomor. Ubah angka depan lewat `major` di `version.json`.


## Tes otomatis

- `node tools/test-data.js`: sintaks semua JS, data Iqro 1-6, file yang dirujuk `index.html` ada di cache offline, nomor versi.
- `cd tests && npm install && node smoke.js`: memuat aplikasi sungguhan di jsdom. Menguji home, absen 7 hari (tersimpan, lanjut, putus), koin, ketujuh game, halaman Tanda baca, semua halaman Iqro, dan keamanan nama pengguna. jsdom tidak punya layout, jadi tampilan (tinggi iframe, kanvas, pas lebar) tetap dicek di HP.
- GitHub Actions: salin `cek.yml` ke `.github/workflows/cek.yml` (lewat web GitHub atau token dengan izin Workflows). Ia menjalankan keduanya tiap push dan gagal bila `sw.js`/nomor versi belum diperbarui (`node tools/make-sw.js`).

## Akun & sinkronisasi (Supabase)

Login memakai email + kata sandi, progres disinkronkan ke Supabase. Offline-first: tanpa internet atau tanpa akun (mode tamu) aplikasi tetap jalan dari data di HP.

- `src/services/cloud-config.js`: URL project + kunci **publishable** (publik). Jangan pernah menaruh kunci secret/service_role di repo. Kosongkan untuk mematikan fitur akun.
- `src/services/cloud.js`: daftar, masuk, keluar, dan sinkronisasi lewat fetch (tanpa SDK). Data digabung (union / ambil terbesar), penulisan ke server memakai pembanding `updated_at` sehingga tidak menimpa data dari HP lain.
- `supabase/schema.sql`: tabel `profiles` dan `progress` + RLS (tiap pengguna hanya bisa akses barisnya sendiri) + pembuat profil otomatis. Tempel di Supabase -> SQL Editor -> Run.
- Yang disinkronkan: halaman Iqro selesai, bintang kuis, waktu belajar, bookmark, koin (dihitung total diperoleh dikurangi total dibelanjakan, jadi belanja di Toko tidak "dikembalikan" saat sinkron), barang Toko, reaksi, absen, posisi baca, pengaturan. Tema, laporan, dan postingan komunitas belum.
- Satu HP dipakai akun lain: progres akun sebelumnya dibuang dari HP (tetap aman di server), tidak dicampur.

Pengaturan Supabase yang perlu dilakukan sekali (Dashboard):
1. SQL Editor: jalankan `supabase/schema.sql`.
2. Authentication -> Sign In / Providers -> Email: untuk tahap awal matikan **Confirm email** (tanpa SMTP sendiri, email bawaan Supabase hanya terkirim ke anggota tim dan dibatasi 2/jam). Nyalakan lagi setelah SMTP (Brevo/Resend) dipasang.
3. Authentication -> URL Configuration: Site URL `https://quroapp.vercel.app`.

## Kunci level berurutan

`src/stores/lock.js`. Halaman berikutnya terbuka setelah lulus kuis halaman sebelumnya, dan Iqro berikutnya setelah lulus Kuis Jilid sebelumnya (Kuis Jilid sendiri terbuka setelah semua halaman jilid itu dibuka). Lulus = minimal `LOCK_MIN` (3) bintang.

- Pengguna lama tidak terkunci dari yang sudah mereka buka: halaman dan Iqro yang pernah dibuka tetap terbuka, hanya yang berikutnya yang butuh lulus kuis.
- Bisa dimatikan di Profil -> Target belajar -> "Kunci level berurutan" (`iqro_lock` = `0`).
- Dasarnya `iqDN` (halaman dibuka) dan `iqQZ` (bintang kuis), jadi ikut tersinkron antar HP.
- Jaring pengaman `lockFix()` di `V.reader` mengembalikan ke halaman terbuka bila ada jalur lain (penanda, tautan lama) yang menuju halaman terkunci.
