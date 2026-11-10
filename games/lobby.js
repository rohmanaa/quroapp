/* Lobby "Semua Game": daftar game + filter kategori. Tombol Home di kanan atas (tanpa tombol kembali). */
(function(){
const app=document.getElementById("app"),chip=GK.chip;let cat="Semua",rest=null;
/* Kembali dari game (keluar/back) -> lobby kembali ke posisi dan kategori terakhir; dibuka dari Home -> mulai dari atas */
try{if(sessionStorage.getItem("gl_back")==="1")rest={y:+sessionStorage.getItem("gl_y")||0,c:sessionStorage.getItem("gl_c")||"Semua"};sessionStorage.removeItem("gl_back")}catch(e){}
if(rest&&(rest.c==="Semua"||MG.some(g=>(GC[g[0]]||"Lainnya")===rest.c)))cat=rest.c;
const view=()=>{const cats=["Semua",...new Set(MG.map(g=>GC[g[0]]||"Lainnya"))],list=MG.filter(g=>cat==="Semua"||(GC[g[0]]||"Lainnya")===cat);
return `<div class="gbar"><div class="gtt"><h1>Semua Game</h1><p>${MG.length} game seru untuk belajar huruf.</p></div><button data-act="l_home" class="ib" aria-label="Ke Home">${ic("home")}</button></div>
<div class="flex gap-2 overflow-x-auto pb-3">${cats.map(c=>`<button data-act="l_cat" data-c="${c}" class="${chip} shrink-0 !text-xs !px-3 !py-1.5 ${cat===c?"bg-brand text-on":"bg-soft text-brand"}">${c}</button>`).join("")}</div>
<div class="flex flex-col gap-3">${list.map(([k,t,d,e,h])=>`<button data-act="l_play" data-k="${k}" class="tile rounded-[24px] p-3 flex items-center gap-3 text-left" style="--h:${h}"><span class="shrink-0 w-14 h-14 rounded-2xl bg-white/60 grid place-items-center">${fe(e,"w-10 h-10")}</span><span class="flex-1 min-w-0"><b class="block text-base" style="color:var(--ink)">${t}</b><small class="font-bold opacity-80 text-xs block">${d}</small></span><span class="${chip} bg-white/60" style="color:var(--ink)">${GC[k]||"Lainnya"}</span><span style="color:var(--ink)">${ic("cr","w-4 h-4")}</span></button>`).join("")}</div>
<p class="text-center text-mute text-xs font-bold mt-5">Game baru akan ditambahkan di sini.</p>`};
const draw=()=>{app.innerHTML=view()};
document.addEventListener("click",e=>{const t=e.target.closest("[data-act^=l_]");if(!t)return;const a=t.dataset.act;
 if(a==="l_home")return GK.home();
 if(a==="l_cat"){cat=t.dataset.c;return draw()}
 if(a==="l_play"){const f=GP[t.dataset.k];if(!f)return;try{sessionStorage.setItem("gl_y",String(window.scrollY||0));sessionStorage.setItem("gl_c",cat)}catch(x){}GK.loading();location.href=f+"/index.html"}});
GK.setBack(GK.home);
draw();if(rest)scrollTo(0,rest.y);GK.ready("lobby");
})();
