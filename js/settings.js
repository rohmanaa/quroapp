/* Sheet pengaturan baca dan animasi */
function stHTML(){const m=useColor&&showLat?0:(!useColor&&!showLat?1:-1);
return `<div id="stw" class="fixed inset-0 z-[9000] flex items-end justify-center"><div data-st="x" class="absolute inset-0 bg-black/50"></div><div class="up relative bg-card border-2 border-b-0 border-line rounded-t-[32px] w-full max-w-md p-5" style="padding-bottom:calc(1.25rem + env(safe-area-inset-bottom,0px))" role="dialog" aria-modal="true" aria-label="Pengaturan baca">
<div class="flex items-center justify-between mb-3"><h3 class="font-black text-lg">Pengaturan baca</h3><button data-st="x" class="ib" aria-label="Tutup">${ic("x")}</button></div>
<p class="text-xs font-black text-mute uppercase mb-2">Mode baca</p>
<div class="grid grid-cols-2 gap-2 mb-2">${[["Pemula","Pita warna + Latin"],["Mahir","Polos, tanpa Latin"]].map(([t,d],i)=>`<button data-st="m${i}" class="rounded-2xl p-3 text-left border-2 ${m===i?"border-brand bg-soft":"border-line"}"><b class="block text-sm">${t}</b><small class="text-mute text-[11px] font-semibold">${d}</small></button>`).join("")}</div>
${sw(useColor,"setc","Pita warna","Blok biru dan kuning di halaman")}<div class="h-px bg-line"></div>${sw(showLat,"setl","Teks Latin","Cara baca di bawah tiap bacaan")}<div class="h-px bg-line"></div>${sw(useTj,"settj","Warna tajwid","Tanwin, tasydid, dan mad berwarna")}<div class="h-px bg-line"></div>
<p class="text-xs font-black text-mute uppercase mt-3 mb-2">Ukuran huruf</p><div class="grid grid-cols-3 gap-2">${["Kecil","Sedang","Besar"].map((t,i)=>`<button data-st="z${i}" class="rounded-2xl py-2.5 font-black text-sm border-2 ${fz===i?"border-brand bg-soft text-brand":"border-line"}">${t}</button>`).join("")}</div></div></div>`}
function showSt(){closeSt();document.body.insertAdjacentHTML("beforeend",stHTML())}
function closeSt(){const e=document.getElementById("stw");if(e)e.remove()}
const TR=[["slide","Geser","Halaman bergeser dari samping"],["fade","Pudar","Muncul perlahan"],["zoom","Zoom","Membesar halus"],["up","Naik","Muncul dari bawah"],["off","Mati","Tanpa animasi"]];
const applyMb=()=>document.body.classList.toggle("nomb",!mblink);applyMb();
function anim(dir){const a=document.getElementById("app");a.classList.remove("tr-slide","tr-slideb","tr-fade","tr-zoom","tr-up");if(trans==="off")return;void a.offsetWidth;a.classList.add("tr-"+(trans==="slide"&&dir<0?"slideb":trans))}
function anHTML(){return `<div id="anw" class="fixed inset-0 z-[9000] flex items-end justify-center"><div data-an="x" class="absolute inset-0 bg-black/50"></div><div class="up relative bg-card border-2 border-b-0 border-line rounded-t-[32px] w-full max-w-md p-5" style="padding-bottom:calc(1.25rem + env(safe-area-inset-bottom,0px))" role="dialog" aria-modal="true" aria-label="Animasi">
<div class="flex items-center justify-between mb-3"><h3 class="font-black text-lg">Animasi</h3><button data-an="x" class="ib" aria-label="Tutup">${ic("x")}</button></div>
<p class="text-xs font-black text-mute uppercase mb-2">Transisi halaman</p>
<div class="grid grid-cols-2 gap-2 mb-2">${TR.map(([k,t,d])=>`<button data-an="${k}" class="rounded-2xl p-3 text-left border-2 ${trans===k?"border-brand bg-soft":"border-line"}"><b class="block text-sm">${t}</b><small class="text-mute text-[11px] font-semibold">${d}</small></button>`).join("")}</div>
<div class="h-px bg-line my-1"></div>${sw(mblink,"mb","Maskot berkedip","Mata maskot berkedip pelan")}</div></div>`}
function showAn(){closeAn();document.body.insertAdjacentHTML("beforeend",anHTML())}
function closeAn(){const e=document.getElementById("anw");if(e)e.remove()}
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeAn()});
document.addEventListener("click",e=>{const t=e.target.closest("[data-an]");if(!t)return;const v=t.dataset.an;if(v==="x")return closeAn();trans=v;saveSet();showAn();anim(1)});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeSt()});
document.addEventListener("click",e=>{const t=e.target.closest("[data-st]");if(!t)return;const v=t.dataset.st;
 if(v==="x")return closeSt();
 if(v==="m0"){useColor=true;showLat=true}else if(v==="m1"){useColor=false;showLat=false}else if(v[0]==="z")fz=+v[1];
 saveSet();render();showSt()});
