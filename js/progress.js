/* Progres: streak, target harian, waktu belajar, unduh offline, badge */
function bestStreak(){const ks=Object.keys(iqT).filter(k=>iqT[k]>=60).sort();let b=0,c=0,pv=null;ks.forEach(k=>{const d=new Date(k+"T00:00:00");c=pv&&Math.round((d-pv)/864e5)===1?c+1:1;pv=d;if(c>b)b=c});return b}
function offDl(){toast("Semua latihan sudah ada di aplikasi")}
const offList=()=>`<section class="${card} !p-3.5 flex items-center gap-3"><span class="w-11 h-11 rounded-2xl bg-soft text-brand grid place-items-center shrink-0">${ic("vol")}</span><div class="flex-1 min-w-0"><b class="block text-sm">Siap offline</b><small class="text-mute text-[11px] font-semibold">Semua latihan Jilid 1–6 sudah tersimpan di aplikasi</small></div></section>`;
const bmList=()=>{const ks=Object.keys(iqBM);return (ks.length?`<h2 class="font-bold text-lg mb-3">Penanda halaman</h2><div class="flex gap-2 overflow-x-auto pb-3 mb-2">${ks.map(k=>{const[j,q]=k.split("-");return `<button data-act="bmgo" data-k="${k}" class="${chip} bg-soft text-brand shrink-0 inline-flex items-center gap-1">${ic("bm","w-3.5 h-3.5")}Iqro ${j} · Hal ${q}</button>`}).join("")}</div>`:"")};
const BDG=()=>[["Langkah Pertama","Buka 1 halaman Iqro",Object.keys(iqDN).length>=1],["Rajin Baca","Buka 10 halaman",Object.keys(iqDN).length>=10],["Hampir Tamat","Selesaikan Iqro 1 (100%)",jp(1)>=100],["Streak 3 Hari","Belajar 3 hari berturut",bestStreak()>=3],["Streak 7 Hari","Belajar 7 hari berturut",bestStreak()>=7],["Setengah Jam","Total belajar 30 menit",totalSec()>=1800],["Kolektor Koin","Kumpulkan 200 koin",coins>=200],["Penanda","Tandai 3 halaman",Object.keys(iqBM).length>=3],["Bintang Pertama","Selesaikan 1 kuis",Object.keys(iqQZ).length>=1],["Kuis Sempurna","Dapat 4 bintang di satu kuis",Object.values(iqQZ).some(x=>x.s>=4)],["Kolektor Bintang","Kumpulkan 20 bintang kuis",qzStars()>=20],["Jagoan Jilid","Kuis jilid minimal 3 bintang",Object.keys(iqQZ).some(k=>k[0]==="j"&&iqQZ[k].s>=3)],["Ahli Tajwid","Kuis tanda baca minimal 3 bintang",((iqQZ.tj||{}).s||0)>=3],["Suara Komunitas","Posting 1 capaian ke Komunitas",iqPosts.length>=1]];
const saveGoal=()=>{try{localStorage.setItem("iqro_goal",String(goal))}catch(e){}};
const secOf=d=>iqT[dk(d)]||0;
const todayMin=()=>Math.floor(secOf()/60);
const goalPct=()=>Math.min(100,Math.round(secOf()/(goal*60)*100));
const totalSec=()=>Object.values(iqT).reduce((a,b)=>a+b,0);
const fmtT=sc=>{const h=Math.floor(sc/3600),m=Math.floor(sc%3600/60);return h?h+"j "+m+"m":m+" menit"};
function streakN(){let n=0;const d=new Date();if(secOf(d)<60)d.setDate(d.getDate()-1);while(secOf(d)>=60){n++;d.setDate(d.getDate()-1)}return n}
const weekSecs=()=>{const d=new Date(),w=(d.getDay()+6)%7;d.setDate(d.getDate()-w);return Array.from({length:7},(_,i)=>{const x=new Date(d);x.setDate(d.getDate()+i);return secOf(x)})};
const jp=j=>JL[j]&&JL[j].ok?Math.min(100,Math.round(Object.keys(iqDN).filter(k=>k.indexOf(j+"-")===0&&+k.split("-")[1]<=JL[j].n).length/JL[j].n*100)):0;
const LRN=["reader","huruf","record","game","result"];
["touchstart","pointerdown","click","scroll","keydown"].forEach(ev=>document.addEventListener(ev,()=>{lastAct=Date.now()},{passive:true,capture:true}));
setInterval(()=>{if(document.visibilityState!=="visible"||!LRN.includes(S))return;if(Date.now()-lastAct>120000&&!play)return;const k=dk();iqT[k]=(iqT[k]||0)+5;saveT();
 if(iqT[k]>=goal*60&&goalMsg!==k){goalMsg=k;try{localStorage.setItem("iqro_gmsg",k)}catch(e){}toast("Target hari ini tercapai. Alhamdulillah!")}},5000);
