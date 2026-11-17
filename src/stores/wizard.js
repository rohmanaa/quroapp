/* Wizard belajar per halaman (gaya Duolingo): tiap BARIS halaman = satu langkah (pelajari lalu jawab).
   Memakai ulang mesin kuis (QZ, qzFinish, kunci level): hasilnya disimpan sebagai bintang kuis halaman ("p<jilid>-<hal>"),
   jadi halaman berikutnya terbuka bila lulus (>= LOCK_MIN bintang). Tiap jawaban benar +1 koin (lihat qzopt di quiz.js).
   NOTE FOR AI: huruf Arab = RTL, jangan membalik urutan sel; baris dirender lewat rowsOf()/cellH() yang sudah RTL. */
LRN.push("wizard");
const WZ_MAX=8;
function wzStart(j,p){
  jl=j;pn=p;
  if(needBook(jl))return bookGate(()=>wzStart(j,p));
  loadPg(jl,pn);const pg=curPg();if(!pg)return toast("Halaman belum dimuat, coba lagi");
  const pool=cellsOf(pg).map(c=>String(c.latin).trim());
  let st=[];rowsOf(pg).forEach(r=>{const v=r.filter(c=>c.arabic&&String(c.latin||"").trim());if(v.length)st.push({r,c:v[Math.floor(Math.random()*v.length)]})});
  if(!st.length||pool.length<1)return toast("Halaman ini belum bisa dilatih");
  if(st.length>WZ_MAX)st=Array.from({length:WZ_MAX},(_,i)=>st[Math.floor(i*st.length/WZ_MAX)]);
  iqDN[jl+"-"+pn]=1;persist();stopSeq();
  QZ={kind:"p",jl,pn,w:1,ph:0,got:0,qs:st.map(s=>mkQ(s.c,pool)),rows:st.map(s=>s.r),i:0,pick:-1,right:0,stars:0,fresh:[]};
  go("wizard");
}
document.addEventListener("click",e=>{const t=e.target.closest("[data-act]");if(!t)return;const d=t.dataset,a=d.act;
 if(a==="pmnode"){const p=+d.p;if(!pgOpen(jl,p))return lockPg(jl,p);
  modal({t:"Halaman "+p,p:"Pelajari tiap baris, jawab, dan kumpulkan koin. Tiap jawaban benar +1 koin.",b:"Nanti",y:"Mulai belajar",ok:()=>wzStart(jl,p)})}
 if(a==="wzcont")wzStart(jl,pmCur(jl));
 if(a==="wznext"&&QZ)wzStart(QZ.jl,QZ.pn+1);
 if(a==="wzgo"&&QZ&&QZ.w){QZ.ph=1;render();say(QZ.qs[QZ.i].hear)}
 if(a==="wzx")modal({t:"Keluar dari latihan?",p:"Koin yang sudah didapat tetap tersimpan, tapi bintang halaman ini belum dihitung.",b:"Lanjut belajar",y:"Keluar",ok:()=>{QZ=null;go("bookdetail")}});
});
