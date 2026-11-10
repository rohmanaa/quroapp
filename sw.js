/* Service worker QURO: simpan semua file aplikasi agar bisa dibuka tanpa internet.
   File ini dibuat otomatis oleh tools/make-sw.js. Jangan diedit langsung. */
const VERSION="quro-75be5f1dd8";
const SHELL=["./","assets/emoji.js","assets/fonts/LICENSE-Amiri.txt","assets/fonts/LICENSE-Nunito.txt","assets/fonts/amiri-arabic-700-normal.woff2","assets/fonts/amiri-latin-700-normal.woff2","assets/fonts/nunito-latin-ext-wght-normal.woff2","assets/fonts/nunito-latin-wght-normal.woff2","assets/lib/qrcode.min.js","assets/mascot.js","css/animations.css","css/base.css","css/components.css","css/fonts.css","css/games.css","css/reader.css","css/share.css","css/tailwind.css","data/community.js","data/games.js","data/harakat.js","data/iqro.js","data/iqro1-buku.js","data/iqro2-6-buku.js","data/latihan.js","data/letters.js","data/pola.js","data/tajwid.js","icons/apple-touch-icon.png","icons/favicon-48.png","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png","index.html","js/core.js","js/events.js","js/games.js","js/helpers.js","js/icons.js","js/main.js","js/nav-fix.js","js/offline.js","js/progress.js","js/quiz.js","js/reader.js","js/settings.js","js/share-profile.js","js/state.js","js/tailwind-config.js","js/tajwid.js","js/views/auth.js","js/views/learn.js","js/views/practice.js","js/views/preferences.js","js/views/profile.js","js/views/social.js","manifest.webmanifest"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION&&k.indexOf("quro-")===0).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=="GET"||u.origin!==location.origin)return; /* data dari luar (CDN) tidak disentuh */
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(VERSION).then(c=>c.put(r,cp))}return res}).catch(()=>r.mode==="navigate"?caches.match("index.html"):Response.error())));
});
