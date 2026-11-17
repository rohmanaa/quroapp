/* Daftarkan service worker (hanya jalan lewat http/https; saat dibuka dobel-klik dari file, aplikasi tetap offline karena semua file lokal) */
if("serviceWorker" in navigator&&/^https?:$/.test(location.protocol))addEventListener("load",()=>{
  navigator.serviceWorker.register("sw.js").then(()=>navigator.serviceWorker.ready).then(()=>{
    try{if(!localStorage.getItem("iqro_offline")){localStorage.setItem("iqro_offline","1");toast("Siap dipakai offline")}}catch(e){}
  }).catch(()=>{});
});
