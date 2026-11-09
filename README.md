# QURO – Belajar Al-Qur'an

Dibuka langsung dengan klik dua kali `index.html` (tanpa server, tanpa build). Semua JS memakai skrip biasa, bukan modul ES, jadi urutan `<script>` di `index.html` penting.

## Struktur

```
index.html            kerangka halaman + urutan muat file
css/
  base.css            token warna, tema terang/gelap, reset, latar
  components.css      .ar, tombol, hero, tile, modal umum
  games.css           kartu memori (.mc)
  share.css           modal bagikan profil
  reader.css          halaman Iqro (.pp), header .tbar, pita warna, mode polos .nc
  animations.css      transisi halaman, kedip maskot
data/                 isi konten (ubah di sini untuk menambah materi)
  letters.js          30 huruf (L), PG
  harakat.js          harakat (HK, HKC)
  iqro.js             warna jilid (CVH), wadah JL dan IQ
  pola.js             pola kata Jilid 3-6 yang bisa diubah (S M T D K) + jumlah halaman Jilid 6
  latihan.js          pembuat materi latihan Jilid 1-6 (dibuat program)
  iqro1-buku.js       Iqro Jilid 1 (32 halaman) dari proyek dyazincahya/iqro-json; menggantikan Jilid 1 buatan program
  iqro2-6-buku.js     Iqro Jilid 2-6 (30 halaman tiap jilid) dari proyek yang sama; menggantikan Jilid 2-6 buatan program
  games.js            huruf game (GL), daftar game (MG), petunjuk (GI)
  community.js        data contoh teman, kabar, papan peringkat
  tajwid.js           materi tanwin, tasydid, mad (TJ) + kata tanpa tanda (TJN)
assets/
  mascot.js           SVG maskot
  emoji.js            kumpulan emoji SVG (IE), fe(), fl()
js/
  icons.js            ikon garis
  helpers.js          fungsi kecil untuk tampilan (lt, card, tileH, cover, pet, ...)
  state.js            state + localStorage
  tajwid.js           pewarnaan tajwid (tjh); warna di css/reader.css (.tj[data-tj])
  quiz.js             kuis halaman/jilid/tajwid, bintang, lembar bagikan, posting ke Komunitas, layar tajwid
  progress.js         streak, target harian, waktu belajar, unduh offline, badge
  reader.js           pembaca Iqro, pilih jilid/halaman, layar penuh, geser, muat halaman
  settings.js         sheet pengaturan baca dan animasi
  core.js             render(), go(), modal(), toast(), suara
  views/              satu file per kelompok layar; semuanya mengisi objek V
    learn.js          home, books, huruf, harakat, bookdetail, reader (membuat const V)
    profile.js        progress, profile, daily, share, result, badges, about
    auth.js           login, reg
    social.js         friends, leaderboard, reels, community
    preferences.js    target, notifications, audio, privacy, theme
    practice.js       record
  games.js            mini game
  events.js           penangan klik utama
  main.js             render pertama
  share-profile.js    modal bagikan profil
  nav-fix.js          perbaikan menu bawah di HP
```

## Kuis, bintang, dan komunitas

- Bintang kuis: semua benar = 4, ≥66% = 3, ≥40% = 2, ada yang benar = 1. Hanya skor terbaik yang disimpan (`localStorage` `iqro_quiz`, kunci `p1-3` halaman, `j1` jilid, `tj` tajwid).
- Postingan dari tombol bagikan disimpan di `iqro_posts` dan tampil paling atas di Komunitas. Sampai ada server, postingan hanya terlihat di perangkat ini.
- Warna tajwid bisa dimatikan di Pengaturan baca. Ganti warna lewat variabel `--tj-tanwin`, `--tj-tasydid`, `--tj-mad`.

## Catatan penting

- Urutan muat: `data` → `assets` → `js/*` → `js/views/*` → `games.js` → `events.js` → `main.js`. `views/learn.js` harus pertama di antara views karena membuat `V`.
- Huruf Arab ditulis RTL dan harus berada di dalam elemen `.ar`. Jangan membalik urutan array huruf.
- Materi latihan dibuat oleh `data/latihan.js` saat aplikasi dibuka (pengacak bersemi, jadi selalu sama). Jilid: 1 fathah (14 hal), 2 kasrah dan dhammah (10), 3 mad (12), 4 sukun dan tanwin (10), 5 tasydid (10), 6 gabungan dan ujian (10). Ubah jumlah halaman atau pola kata di `SPEC` dan fungsi `j1`–`j6`. Itu hanya dipakai bila file data buku (`data/iqro1-buku.js`, `data/iqro2-6-buku.js`) tidak dimuat; secara bawaan Jilid 1–6 memakai data buku (lihat bagian Lisensi di bawah).
- Aturan tulisan kata (data/latihan.js): pada mad, waw mati dan ya mati selalu diberi sukun, alif tidak (alif bersukun berarti berhenti mendadak, bukan panjang). Huruf ج ح خ ه tidak boleh menerima sambungan dari huruf sebelumnya di dalam satu kata (bentuk tengah/akhirnya mirip dan mudah terbaca terbalik, mis. قخص terbaca "khoqash"); mereka hanya muncul di awal kata atau setelah huruf pemutus (ا د ذ ر ز و). Ubah di konstanta `NJ` dan `RS`.
- Tailwind, font Amiri/Nunito, dan qrcodejs lokal (`css/tailwind.css`, `css/fonts.css`, `assets/fonts/`, `assets/lib/`). Tidak ada lagi ketergantungan ke CDN atau GitHub pihak lain.

## Offline

- Semua file aplikasi lokal, jadi membuka `index.html` langsung dari file sudah tidak butuh internet.
- Lewat http/https, `sw.js` menyimpan seluruh aplikasi sehingga bisa dibuka offline setelah kunjungan pertama. Jalankan `node tools/make-sw.js` setiap kali ada file berubah agar pengguna mendapat versi baru.
- Bisa dipasang di layar utama HP (PWA): `manifest.webmanifest` dan `icons/`. Di Android Chrome pilih menu ⋮ lalu “Instal aplikasi”; di iPhone Safari pilih Bagikan lalu “Tambah ke Layar Utama”. Syaratnya dibuka lewat https (atau localhost). Ikon dibuat ulang dengan `python3 tools/make-icons.py` (huruf ق, font Amiri).
- Mengubah pola kata latihan: edit `data/pola.js` (kode S, M, T, D, K; pola yang melanggar aturan otomatis dilewati dan diberi peringatan di konsol). Lembar tinjauan untuk guru dibuat dengan `node tools/tinjau.js` (satu berkas HTML mandiri, bisa dicetak).
- Mengubah tampilan (kelas Tailwind baru)? Bangun ulang CSS: `npm i tailwindcss@3.4.17` lalu `npx tailwindcss -c tools/tailwind.config.js -i tools/tailwind.in.css -o css/tailwind.css --minify`. Kelas yang disusun dari potongan teks saat runtime tidak terdeteksi; tulis nama kelas utuh.

## Lisensi materi Iqro Jilid 1–6

`data/iqro1-buku.js` dan `data/iqro2-6-buku.js` adalah transkripsi buku Iqro karya KH. As'ad Humam dari https://github.com/dyazincahya/iqro-json (hasil OCR, bisa ada salah ketik). Boleh dipakai gratis untuk belajar, **tidak boleh diperjualbelikan** (hak cipta ada pada pemegang hak buku). Kalau QURO suatu saat dimonetisasi, hapus kedua file ini dan baris `<script>`-nya di `index.html`; Jilid 1–6 buatan program di `data/latihan.js` otomatis dipakai lagi. Jalankan `node tools/make-sw.js` setelah mengubah file.
