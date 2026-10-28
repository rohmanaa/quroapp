/* Service worker QURO: simpan semua file aplikasi agar bisa dibuka tanpa internet.
   File ini dibuat otomatis oleh tools/make-sw.js. Jangan diedit langsung. */
const VERSION="__VERSION__";
const SHELL=__SHELL__;
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION&&k.indexOf("quro-")===0).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=="GET"||u.origin!==location.origin)return; /* data dari luar (CDN) tidak disentuh */
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(VERSION).then(c=>c.put(r,cp))}return res}).catch(()=>r.mode==="navigate"?caches.match("index.html"):Response.error())));
});
