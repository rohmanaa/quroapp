/* Iqro Jilid 2-6 dimuat belakangan (data/iqro2-6-buku.js, ±300 KB): baru diambil saat pertama kali dibutuhkan (buka pembaca atau kuis Iqro 2-6).
   Jumlah halaman tiap jilid sudah dicatat di sini agar sampul, progres, dan kunci level sama sebelum dan sesudah data dimuat.
   Jilid 1 tetap dimuat di awal (data/iqro1-buku.js) karena itu yang pertama dibuka.
   PENTING: jumlah halaman di bawah harus sama dengan isi iqro2-6-buku.js (dijaga oleh tools/test-data.js). */
const BOOK26_N={2:30,3:30,4:30,5:30,6:30},BOOK26_SRC="fitur/belajar/data/iqro2-6-buku.js";
Object.keys(BOOK26_N).forEach(j=>{JL[j]={ok:1,n:BOOK26_N[j]};
 /* buang halaman latihan buatan program untuk Iqro 2-6: yang tampil nanti hanya isi buku, tidak pernah campuran */
 for(let p=1;p<=60;p++)delete IQ[j+"-"+p]});
let BOOK26=false,book26P=null;
const needBook=j=>j>=2&&!BOOK26;
function loadBook26(){if(BOOK26)return Promise.resolve();
 if(!book26P)book26P=new Promise((ok,no)=>{const s=document.createElement("script");s.src=BOOK26_SRC;s.onload=()=>{BOOK26=true;ok()};s.onerror=()=>{book26P=null;s.remove();no(new Error("gagal memuat"))};document.head.appendChild(s)});
 return book26P}
/* jalankan fn setelah data siap; tampilkan pesan bila lambat atau gagal */
function bookGate(fn,fail){const t=setTimeout(()=>{if(typeof toast==="function")toast("Memuat Iqro 2–6…")},400);
 return loadBook26().then(()=>{clearTimeout(t);fn()},()=>{clearTimeout(t);if(typeof toast==="function")toast("Materi Iqro 2–6 belum bisa dimuat. Periksa internet ya");if(fail)fail()})}
