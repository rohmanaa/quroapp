/* Menu bawah selalu menempel di dasar area yang benar-benar terlihat.
   Masalah: di Chrome HP, saat toolbar (kolom alamat) muncul/hilang (mis. setelah pindah halaman), elemen position:fixed
   sempat menempel ke batas bawah lama sehingga menu turun dan label terpotong. Solusi: ukur selisih antara dasar menu
   dan dasar visual viewport, lalu geser menu ke atas sebesar selisih itu (translate, jadi ringan). */
(function(){const nv=document.getElementById('nv');if(!nv)return;
const vv=window.visualViewport;let raf=0,tm=0,cur=0;
function place(){raf=0;let off=0;
  if(vv&&vv.scale<=1.01){
    const edge=nv.offsetTop+nv.offsetHeight,   /* dasar menu pada layout viewport (tidak terpengaruh transform) */
          seen=vv.offsetTop+vv.height,          /* dasar area yang terlihat */
          d=Math.round(edge-seen);
    if(d>1&&d<=120)off=d;                       /* lebih dari 120px = keyboard layar, biarkan menutupi menu */
  }
  if(off!==cur){cur=off;nv.style.transform=off?'translate3d(0,'+(-off)+'px,0)':'translate3d(0,0,0)'}}
const sched=()=>{if(!raf)raf=requestAnimationFrame(place)};
function burst(ms){const end=Date.now()+ms;clearInterval(tm);tm=setInterval(()=>{place();if(Date.now()>end)clearInterval(tm)},60)}
if(vv){vv.addEventListener('resize',sched);vv.addEventListener('scroll',sched)}
addEventListener('resize',sched);addEventListener('scroll',sched,{passive:true});
['load','pageshow','orientationchange'].forEach(e=>addEventListener(e,()=>burst(1500)));
/* pindah halaman = toolbar browser bergerak ~300ms, jadi pantau rapat selama sekitar 1,5 detik */
['click','touchend'].forEach(e=>addEventListener(e,()=>burst(1500),{passive:true,capture:true}));
if(window.MutationObserver)new MutationObserver(()=>burst(1200)).observe(document.body,{childList:true,subtree:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)burst(1500)});
burst(2500)})();
