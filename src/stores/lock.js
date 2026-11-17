/* Kunci level berurutan.
   - Halaman berikutnya terbuka setelah lulus kuis halaman sebelumnya.
   - Iqro (jilid) berikutnya terbuka setelah lulus Kuis Jilid sebelumnya; Kuis Jilid sendiri terbuka setelah semua halaman jilid itu dibuka.
   - Lulus = minimal LOCK_MIN bintang. Halaman/jilid yang SUDAH pernah dibuka (pengguna lama) tetap terbuka.
   - Bisa dimatikan di Pengaturan (iqro_lock = "0"). Semua turunan dari iqDN dan iqQZ, jadi ikut tersinkron antar HP. */
const LOCK_MIN=3;
let lockOn=true;try{lockOn=localStorage.getItem("iqro_lock")!=="0"}catch(e){}
const saveLock=()=>{try{localStorage.setItem("iqro_lock",lockOn?"1":"0")}catch(e){}};
const qOk=k=>((iqQZ[k]||{}).s||0)>=LOCK_MIN;
const maxOpen=j=>{let m=0;const n=JL[j]&&JL[j].n||0;for(let p=1;p<=n;p++)if(iqDN[j+"-"+p])m=p;return m};
const pgOpen=(j,p)=>!lockOn||p<=1||p<=maxOpen(j)||qOk("p"+j+"-"+(p-1));
const jOpen=j=>!lockOn||j<=1||!JL[j]||!JL[j].ok||maxOpen(j)>0||qOk("j"+(j-1));
const jqOpen=j=>!lockOn||jp(j)>=100;
const openMax=j=>{const m=maxOpen(j),n=JL[j]&&JL[j].n||1;return Math.max(1,Math.min(n,qOk("p"+j+"-"+m)?m+1:m))};
/* lencana kecil / petunjuk di kartu kuis */
const lockHintP=()=>lockOn&&JL[jl]&&pn<JL[jl].n?" · Lulus ★"+LOCK_MIN+" membuka Hal "+(pn+1):"";
const lockHintJ=()=>!lockOn?"":!jqOpen(jl)?"Buka semua halaman dulu untuk kuis ini":JL[jl+1]&&JL[jl+1].ok?"Lulus ★"+LOCK_MIN+" membuka Iqro "+(jl+1):"";
/* dialog terkunci */
function lockPg(j,p){const b=Math.max(1,maxOpen(j));
 modal({t:"Halaman "+p+" masih terkunci",p:"Lulus kuis Hal "+b+" (minimal "+LOCK_MIN+" bintang) untuk membuka halaman berikutnya.",b:"Nanti",y:"Mulai kuis Hal "+b,ok:()=>{jl=j;pn=b;qzStart("p")}})}
function lockJ(j){const pv=j-1,full=jp(pv)>=100;
 modal({t:"Iqro "+j+" masih terkunci",p:full?"Lulus Kuis Jilid Iqro "+pv+" (minimal "+LOCK_MIN+" bintang) untuk membuka Iqro "+j+".":"Selesaikan semua halaman Iqro "+pv+" lalu lulus Kuis Jilid-nya (minimal "+LOCK_MIN+" bintang).",b:"Nanti",y:"Ke Iqro "+pv,ok:()=>{jl=pv;go("bookdetail")}})}
/* jaring pengaman: apa pun jalur masuknya (penanda, tautan lama), jangan tampilkan halaman yang masih terkunci */
function lockFix(){if(!lockOn)return;let m=0;if(!jOpen(jl)){jl=1;m=1}if(!pgOpen(jl,pn)){pn=openMax(jl);m=1}if(m)setTimeout(()=>toast("Halaman itu masih terkunci, kita lanjut dari sini ya"),50)}
/* saklar di Pengaturan */
document.addEventListener("click",e=>{const t=e.target.closest("[data-act=togglelock]");if(!t)return;lockOn=!lockOn;saveLock();toast(lockOn?"Kunci level dinyalakan":"Kunci level dimatikan: semua halaman terbuka");render()});
