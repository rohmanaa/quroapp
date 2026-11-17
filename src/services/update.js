/* Banner "Versi baru tersedia": service worker baru langsung aktif, tapi halaman yang terbuka masih memakai kode lama
   sampai dimuat ulang. Banner memberi tahu pengguna dan memuat ulang (layar yang sama dipulihkan, lihat main.js). */
(function(){if(!("serviceWorker" in navigator)||!/^https?:$/.test(location.protocol))return;
const had=!!navigator.serviceWorker.controller;let shown=false;
function show(){if(shown||document.getElementById("upd"))return;const p=document.getElementById("ptr");if(p&&p.classList.contains("spin"))return;shown=true;
 const b=document.createElement("div");b.id="upd";b.className="upd";b.setAttribute("role","status");
 b.innerHTML='<span class="flex-1">Versi baru QURO tersedia.</span><button class="go" data-upd="1">Muat ulang</button><button class="cl" data-upd="0" aria-label="Tutup">'+ic("x","w-4 h-4")+'</button>';
 b.addEventListener("click",e=>{const t=e.target.closest("[data-upd]");if(!t)return;if(t.dataset.upd==="1")location.reload();else{b.remove();shown=false}});document.body.appendChild(b)}
navigator.serviceWorker.addEventListener("controllerchange",()=>{if(had)show()});
/* cek versi baru saat app dibuka kembali (paling sering 1x per 30 menit) */
let last=Date.now();document.addEventListener("visibilitychange",()=>{if(document.hidden||Date.now()-last<18e5)return;last=Date.now();navigator.serviceWorker.getRegistration().then(r=>r&&r.update()).catch(()=>{})});
})();
