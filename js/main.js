/* Mulai aplikasi: logo, splash, render pertama */
$("#logo").innerHTML='<span class="ar text-[30px] leading-none pt-1">ق</span>';$("#bell").innerHTML=ic("bell");
setInterval(()=>{li=(li+1)%LV.length;const e=$("#lv");if(e)e.textContent=LV[li]},3500);
$("#spm").innerHTML=mas("w-44");setTimeout(()=>{const e=$("#sp");if(e)$("#sp [data-act=sp]").click()},3000);
/* Muat ulang (refresh/Chrome/versi baru): kembali ke halaman yang sama, bukan ke Home */
let restoreY=0;
try{const nv=performance.getEntriesByType&&performance.getEntriesByType("navigation")[0],isReload=nv?nv.type==="reload":(performance.navigation&&performance.navigation.type===1),z=JSON.parse(sessionStorage.getItem("quro_scr")||"null");
 const OK=["home","books","record","community","profile","progress","badges","target","about","theme","notifications","audio","privacy","daily","leaderboard","friends","bookdetail","reader","huruf","harakat","games","game","share","backup"];
 if(isReload&&U&&z&&OK.includes(z.s)&&typeof V[z.s]==="function"){
  if(JL[z.j]&&JL[z.j].ok)jl=z.j;if(z.p>0&&z.p<=JL[jl].n)pn=z.p;if(MG[z.g])GM=z.g;tabF=+z.t||0;S=z.s;restoreY=+sessionStorage.getItem("quro_y")||0;
  const sp=$("#sp");if(sp)sp.remove()}}catch(e){}
addEventListener("pagehide",()=>{try{sessionStorage.setItem("quro_y",String(window.scrollY||0))}catch(e){}});
render();if(restoreY)scrollTo(0,restoreY);
