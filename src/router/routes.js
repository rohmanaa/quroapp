/* Fitur yang dimuat belakangan (lazy). Tabel rute: nama fitur -> berkas (urut) + layar yang dilayaninya.
   - Layar fitur ini tidak ada di index.html; go("<layar>") memuatnya saat pertama dibuka, lalu melanjutkan. Sisa fitur dimuat saat browser menganggur
     (kecuali mode hemat data), jadi membuka layar pertama kali tetap terasa instan.
   - Kode inti yang ikut mengubah layar lazy (mis. menambah kartu di layar Tampilan) mendaftar lewat onFeature("<fitur>",()=>{...}).
   - Syarat fitur lazy: tidak ada kode yang dimuat di awal memanggil fungsi/variabel miliknya (dijaga tools/test-data.js).
   Menambah layar lazy: berkas src/views/<nama>.js (plus komponen/store-nya), daftarkan di LAZY, JANGAN tulis <script>-nya di index.html. */
const LAZY={
 pengaturan:{js:["target","notifications","audio","privacy","theme"].map(n=>"src/views/"+n+".js"),screens:["audio","notifications","privacy","target","theme"]},
 profil:{js:["progress","profile","daily","share","result","badges","about","_versi"].map(n=>"src/views/"+n+".js").concat("src/components/share-profile.js"),css:["src/assets/css/share.css"],screens:["about","badges","daily","profile","progress","result","share"]},
 latihan:{js:["src/views/record.js"],screens:["record"]}};
const featDone={},featP={},featHooks={};
const featOf=s=>{for(const k in LAZY)if(LAZY[k].screens.includes(s))return k;return null};
function onFeature(k,fn){if(featDone[k])fn();else(featHooks[k]=featHooks[k]||[]).push(fn)}
const loadTag=(tag,url)=>new Promise((ok,no)=>{const e=document.createElement(tag);if(tag==="script"){e.src=url;e.async=false}else{e.rel="stylesheet";e.href=url}e.onload=ok;e.onerror=()=>{e.remove();no(new Error("gagal: "+url))};document.head.appendChild(e)});
function loadFeature(k){const f=LAZY[k];if(!f||featDone[k])return Promise.resolve();
 if(!featP[k])featP[k]=(async()=>{await Promise.all((f.css||[]).map(u=>loadTag("link",u)));await Promise.all(f.js.map(u=>loadTag("script",u)));featDone[k]=true;(featHooks[k]||[]).splice(0).forEach(fn=>{try{fn()}catch(e){}})})().catch(e=>{featP[k]=null;throw e});
 return featP[k]}
/* jalankan fn setelah fitur siap; pesan bila lambat atau gagal */
function featGate(k,fn,fail){const t=setTimeout(()=>{if(typeof toast==="function")toast("Memuat…")},400);
 return loadFeature(k).then(()=>{clearTimeout(t);fn()},()=>{clearTimeout(t);if(typeof toast==="function")toast("Belum bisa dimuat. Periksa internet ya");if(fail)fail()})}
function preloadFeatures(){try{const c=navigator.connection;if(c&&c.saveData)return}catch(e){}Object.keys(LAZY).reduce((p,k)=>p.then(()=>loadFeature(k)).catch(()=>{}),Promise.resolve())}
addEventListener("load",()=>{(window.requestIdleCallback||(f=>setTimeout(f,2500)))(preloadFeatures,{timeout:6000})});
