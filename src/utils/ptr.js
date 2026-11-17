/* Tarik ke bawah untuk menyegarkan halaman yang sedang dibuka (tetap di halaman itu, tidak balik ke Home).
   - Refresh bawaan Chrome dimatikan lewat css (overscroll-behavior-y), diganti gerakan ini.
   - Segarkan = gambar ulang halaman ini + cek versi baru aplikasi. Kalau ada versi baru, aplikasi dimuat ulang
     dan layar yang sama dipulihkan (lihat main.js). Tidak aktif di login, game layar penuh, dan saat ada jendela terbuka. */
(function(){
const SVG='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.6-5.9"/><path d="M20 4v5h-5"/></svg>';
const el=document.createElement("div");el.id="ptr";el.className="ptr";el.setAttribute("aria-hidden","true");el.innerHTML=SVG;document.body.appendChild(el);
const TH=60,MAXP=100;let sx=0,sy=0,pull=0,on=false,busy=false;
const blocked=t=>busy||S==="login"||S==="reg"||S==="games"||S==="game"||fsOn||document.getElementById("sp")||!$("#m").classList.contains("hidden")||document.body.classList.contains("modal-open")||document.getElementById("pkw")||document.getElementById("anw")||(t&&t.closest&&t.closest("[role=dialog],#shareProfileModal"));
const atTop=()=>(window.scrollY||document.documentElement.scrollTop||0)<=0;
const put=(p,snap)=>{el.classList.toggle("snap",!!snap);el.style.opacity=Math.min(1,p/46);el.style.transform="translateY("+(p-46)+"px) rotate("+(p*3.6)+"deg)"};
const hide=()=>{el.classList.remove("spin");put(0,1);el.style.opacity=0};
addEventListener("touchstart",e=>{on=false;pull=0;if(e.touches.length!==1||blocked(e.target)||!atTop())return;sx=e.touches[0].clientX;sy=e.touches[0].clientY;on=null},{passive:true});
addEventListener("touchmove",e=>{if(on===false||e.touches.length!==1)return;const dx=e.touches[0].clientX-sx,dy=e.touches[0].clientY-sy;
 if(on===null){if(Math.abs(dy)<8&&Math.abs(dx)<8)return;if(dy<=0||Math.abs(dx)>dy*.8||!atTop()){on=false;return}on=true}
 if(!atTop()){on=false;hide();return}
 pull=Math.min(MAXP,dy*.55);put(pull,0);el.classList.toggle("ready",pull>=TH)},{passive:true});
function end(){if(!on){return}on=false;el.classList.remove("ready");if(pull>=TH)refresh();else hide()}
addEventListener("touchend",end,{passive:true});addEventListener("touchcancel",()=>{if(on){on=false;hide()}},{passive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function refresh(){busy=true;el.classList.add("spin");put(TH,1);let newVer=false;
 try{const reg=navigator.serviceWorker&&await navigator.serviceWorker.getRegistration();
  if(reg){const wait=new Promise(res=>{navigator.serviceWorker.addEventListener("controllerchange",()=>{newVer=true;res()},{once:true});setTimeout(res,1800)});await reg.update();await Promise.all([wait,sleep(500)])}else await sleep(600)}
 catch(x){await sleep(400)}
 if(newVer){toast("Versi baru dipasang, memuat ulang…");await sleep(500);location.reload();return}
 const y=window.scrollY||0;render();scrollTo(0,y);hide();toast("Halaman diperbarui");busy=false}
})();
