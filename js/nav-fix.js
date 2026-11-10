/* Menu bawah selalu menempel di dasar area yang benar-benar terlihat.
   Di Chrome HP, saat toolbar (kolom alamat) muncul/hilang, elemen position:fixed bisa menempel ke batas bawah lama
   sehingga menu turun. Solusi: ukur selisih dasar menu dan dasar visual viewport, lalu geser menu ke atas sebesar selisih itu.
   Dibuat hemat: hanya mengukur saat viewport benar-benar berubah atau sesaat setelah pindah halaman
   (tanpa polling terus-menerus dan tanpa MutationObserver, karena itu membuat perpindahan halaman patah-patah). */
(function(){const nv=document.getElementById('nv');if(!nv)return;
const vv=window.visualViewport;let raf=0,cur=0;const timers=[];
nv.style.transition='transform .12s ease-out';
function place(){raf=0;let off=0;
  if(vv&&vv.scale<=1.01){
    const edge=nv.offsetTop+nv.offsetHeight,   /* dasar menu pada layout viewport (tidak terpengaruh transform) */
          seen=vv.offsetTop+vv.height,          /* dasar area yang terlihat */
          d=Math.round(edge-seen);
    if(d>1&&d<=120)off=d;                       /* lebih dari 120px = keyboard layar, biarkan menutupi menu */
  }
  if(off!==cur){cur=off;nv.style.transform=off?'translate3d(0,'+(-off)+'px,0)':'translate3d(0,0,0)'}}
const sched=()=>{if(!raf)raf=requestAnimationFrame(place)};
/* pindah halaman: toolbar bergerak ~300ms, cukup cek 3 kali (bukan tiap 60ms) */
function settle(){timers.forEach(clearTimeout);timers.length=0;[0,350,900].forEach(ms=>timers.push(setTimeout(sched,ms)))}
if(vv){vv.addEventListener('resize',sched);vv.addEventListener('scroll',sched)}
addEventListener('resize',sched);
['load','pageshow','orientationchange'].forEach(e=>addEventListener(e,settle));
addEventListener('click',e=>{if(e.target.closest&&e.target.closest('[data-go],[data-back]'))settle()},{passive:true,capture:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)settle()});
settle()})();
