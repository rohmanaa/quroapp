/* Kuis (halaman, jilid, tanda baca), bintang, lembar bagikan, posting ke komunitas, layar tajwid */
LRN.push("quiz","quizres","tajwid");
const saveQZ=()=>{try{localStorage.setItem("iqro_quiz",JSON.stringify(iqQZ))}catch(e){}};
const savePosts=()=>{try{localStorage.setItem("iqro_posts",JSON.stringify(iqPosts))}catch(e){}};
const qzStars=()=>Object.values(iqQZ).reduce((a,x)=>a+(x.s||0),0);
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const ago=ts=>{const d=Math.floor((Date.now()-ts)/6e4);return d<1?"Baru saja":d<60?d+" menit lalu":d<1440?Math.floor(d/60)+" jam lalu":Math.floor(d/1440)+" hari lalu"};
const feed=()=>iqPosts.map(p=>({...p,t:ago(p.ts)})).concat(PO);
let QZ=null,SHO=null,tjTab=0;

/* ===== Bahan soal ===== */
const pageOf=k=>{let p=IQ[k];if(p&&p.content)return p;try{const x=localStorage.getItem("iqro_pg_"+k);if(x){p=JSON.parse(x);if(p&&p.content)return p}}catch(e){}return null};
const cellsOf=p=>{const seen={};return p.content.filter(c=>{const l=String(c.latin||"").trim();if(!c.arabic||!l||seen[l])return false;return seen[l]=1})};
const SYL=["BA","TA","TSA","JA","HA","KHA","DA","RA"];
function distract(ans,pool){
  const out=[];shuf(pool.filter(x=>x!==ans)).forEach(x=>{if(out.length<3&&!out.includes(x))out.push(x)});
  const toks=[...new Set(pool.concat(ans).join(" ").split(/\s+/).filter(t=>t&&t!=="="))].concat(SYL);
  let g=0;while(out.length<3&&g++<60){const t=ans.split(/\s+/),i=Math.floor(Math.random()*t.length),r=toks[Math.floor(Math.random()*toks.length)];if(t[i]==="=")continue;t[i]=r;const v=t.join(" ");if(v!==ans&&!out.includes(v))out.push(v)}
  return out;
}
const mkQ=(c,pool)=>{const ans=String(c.latin).trim();return{ar:c.arabic,ans,hear:cl(c.arabic),opts:shuf([ans].concat(distract(ans,pool)))}};
function qzBuild(kind){
  if(kind==="p"){const p=curPg();if(!p)return null;const cs=cellsOf(p),pool=cs.map(c=>String(c.latin).trim());if(!cs.length)return null;return shuf(cs).slice(0,3).map(c=>mkQ(c,pool))}
  if(kind==="j"){const ps=Object.keys(iqDN).filter(k=>k.indexOf(jl+"-")===0).map(pageOf).filter(Boolean);if(ps.length<2)return null;const cs=[].concat(...ps.map(cellsOf)),pool=[...new Set(cs.map(c=>String(c.latin).trim()))];if(pool.length<2)return null;const seen={};return shuf(cs).filter(c=>{const l=String(c.latin).trim();return seen[l]?0:seen[l]=1}).slice(0,5).map(c=>mkQ(c,pool))}
  const all=[];TJ.forEach(t=>t.ex.forEach(([w,l])=>all.push({w,l,a:t.t})));TJN.forEach(([w,l])=>all.push({w,l,a:"Tidak ada"}));
  return shuf(all).slice(0,5).map(x=>({ar:x.w,ans:x.a,hear:x.w,tj:1,opts:["Tanwin","Tasydid","Mad","Tidak ada"]}));
}
const qzKey=()=>QZ.kind==="p"?"p"+QZ.jl+"-"+QZ.pn:QZ.kind==="j"?"j"+QZ.jl:"tj";
const qzTitle=()=>QZ.kind==="p"?"Kuis Iqro "+QZ.jl+" · Hal "+QZ.pn:QZ.kind==="j"?"Kuis Jilid Iqro "+QZ.jl:"Kuis tanda baca";
function qzStart(kind){
  if((kind==="p"||kind==="j")&&needBook(jl))return bookGate(()=>qzStart(kind));
  if(kind==="j"&&!jqOpen(jl))return toast("Buka semua halaman Iqro "+jl+" dulu untuk Kuis Jilid");
  const qs=qzBuild(kind);
  if(!qs||!qs.length)return toast(kind==="j"?"Buka dulu beberapa halaman Iqro "+jl+" ya":"Halaman belum dimuat");
  stopSeq();QZ={kind,jl,pn,qs,i:0,pick:-1,right:0,stars:0,fresh:[]};go("quiz");
}
function qzFinish(){
  const n=QZ.qs.length,r=QZ.right,f=r/n,s=r===n?4:f>=.66?3:f>=.4?2:r>0?1:0,k=qzKey(),old=(iqQZ[k]||{}).s||0,before=BDG().filter(x=>x[2]).map(x=>x[0]);
  const was=qOk(k);QZ.stars=s;if(s>old){coins+=(s-old)*2;iqQZ[k]={s,r,n}}else if(!iqQZ[k])iqQZ[k]={s:0,r,n};
  QZ.unlock="";QZ.need="";if(lockOn){const now=qOk(k),nx=QZ.kind==="p"?(QZ.pn<JL[QZ.jl].n?"Halaman "+(QZ.pn+1):""):QZ.kind==="j"?(JL[QZ.jl+1]&&JL[QZ.jl+1].ok?"Iqro "+(QZ.jl+1):""):"";if(nx){if(now&&!was)QZ.unlock=nx+" terbuka! Alhamdulillah";else if(!now)QZ.need="Butuh minimal "+LOCK_MIN+" bintang untuk membuka "+nx}}
  saveQZ();QZ.fresh=BDG().filter(x=>x[2]&&!before.includes(x[0])).map(x=>x[0]);QZ.gain=Math.max(0,s-old);go("quizres");
}

/* ===== Kartu pemicu di layar lain ===== */
const qzCard=()=>{const q=iqQZ["p"+jl+"-"+pn];return `<section class="${card} mt-4 !p-3.5 flex items-center gap-3"><span class="w-11 h-11 rounded-2xl bg-soft grid place-items-center shrink-0" style="color:#FFB72B">${ic("star","w-6 h-6")}</span><div class="flex-1 min-w-0"><b class="block text-sm">Kuis halaman ${pn}</b><small class="text-mute text-[11px] font-semibold">${q?"Bintangmu: "+"★".repeat(q.s)+(q.s?"":"belum ada")+" · coba lagi?":"3 soal singkat, dapat bintang!"}${lockHintP()}</small></div><button data-act="qzpage" class="btn !py-2 !px-4 text-sm">${q?"Ulangi":"Mulai"}</button></section>`};
const jqCard=()=>{const q=iqQZ["j"+jl];return `<section class="${card} mt-4 !p-3.5 flex items-center gap-3"><span class="w-11 h-11 rounded-2xl bg-soft grid place-items-center shrink-0" style="color:#FFB72B">${ic("trophy","w-6 h-6")}</span><div class="flex-1 min-w-0"><b class="block text-sm">Kuis Jilid ${jl}</b><small class="text-mute text-[11px] font-semibold">${q?"Bintangmu: "+"★".repeat(q.s)+(q.s?"":"belum ada"):"5 soal dari halaman yang sudah kamu buka"}${lockHintJ()?" · "+lockHintJ():""}</small></div><button data-act="qzjilid" class="btn !py-2 !px-4 text-sm">${q?"Ulangi":"Mulai"}</button></section>`};
const tjCard=()=>`<button data-go="tajwid" class="${card} !w-[88%] shrink-0 flex items-center gap-4 text-left"><div dir="ltr" class="grid grid-cols-3 gap-1 shrink-0">${["بٌ","بٍ","بَّ","بِّ","بَا","بِي"].map(w=>`<span class="ar rounded-lg w-9 h-9 grid place-items-center text-2xl bg-soft" style="padding-top:.2em"><span>${tjh(w)}</span></span>`).join("")}</div><div class="flex-1"><b>Tanda baca lanjutan</b><p class="text-mute text-xs">Tanwin, tasydid, dan mad dengan warna tajwid.</p></div><span class="text-brand">${ic("cr")}</span></button>`;

/* ===== Lembar bagikan + posting ke komunitas ===== */
const shI=p=>`<svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const SHI={wa:shI('<path d="M4 20l1.4-4.2A8.5 8.5 0 1 1 8.2 18.7z"/><path d="M9 9c0 3 3 6 6 6l1.2-1.6-2-1-1 .8c-1-.5-1.8-1.3-2.3-2.3l.8-1-1-2z" fill="currentColor"/>'),tg:shI('<path d="M21 4 3 11l6 2.2L11 20l3-4 5 4z"/><path d="M9 13.2 21 4"/>'),copy:shI('<rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>'),more:shI('<circle cx="6" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="18" cy="12" r="1.6" fill="currentColor"/>')};
function shareText(n){return n>0?"Yey Alhamdulillah, aku dapat "+n+" bintang di QURO! Yuk belajar Iqro bareng!":"Yey Alhamdulillah, aku belajar Iqro di QURO! Yuk belajar Iqro bareng!"}
function shareSheet(o){SHO=o;closeShare();document.body.insertAdjacentHTML("beforeend",`<div id="shw" class="fixed inset-0 z-[9000] flex items-end justify-center"><div data-s2="x" class="absolute inset-0 bg-black/50"></div><div class="up relative bg-card border-2 border-b-0 border-line rounded-t-[32px] w-full max-w-md p-5" style="padding-bottom:calc(1.25rem + env(safe-area-inset-bottom,0px))" role="dialog" aria-modal="true" aria-label="Bagikan capaian">
<div class="flex items-center justify-between mb-3"><h3 class="font-black text-lg">Bagikan capaianmu</h3><button data-s2="x" class="ib" aria-label="Tutup">${ic("x")}</button></div>
<div class="rounded-3xl p-4 text-center text-white mb-4" style="background:linear-gradient(160deg,hsl(${o.h} 65% 52%),hsl(${o.h+25} 70% 34%))"><div class="mas flex justify-center">${fe(o.i,"w-16 h-16")}</div><p class="font-black text-lg leading-snug mt-2">${o.text}</p></div>
<button data-s2="post" class="btn w-full">Posting ke Komunitas +2 ${coin("w-5 h-5")}</button>
<div class="grid grid-cols-4 gap-2 mt-4 text-center">${[["#25D366","WhatsApp","wa","#fff"],["#2AABEE","Telegram","tg","#fff"],["#3DB54A","Salin link","copy","#fff"],["#FFC933","Lainnya","more","#5a3a00"]].map(([c,l,k,fg])=>`<button data-s2="${k}"><span class="w-12 h-12 rounded-full grid place-items-center mx-auto" style="background:${c};color:${fg};box-shadow:0 4px 0 rgba(0,0,0,.15)">${SHI[k]}</span><small class="font-extrabold text-xs mt-1.5 block">${l}</small></button>`).join("")}</div></div></div>`)}
function closeShare(){const e=document.getElementById("shw");if(e)e.remove()}
function postAch(o){if(!U)return;const t=o.text,i=t.indexOf("! ")+1;iqPosts.unshift({id:"u"+Date.now(),n:U.name,g:U.g||"L",ts:Date.now(),k:t.slice(0,i),s:t.slice(i).trim(),i:o.i,h:o.h,l:0,w:""});iqPosts=iqPosts.slice(0,30);savePosts();coins+=2;closeShare();toast("Terposting ke Komunitas. +2 koin");tabL=0;go("community")}
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeShare()});
document.addEventListener("click",e=>{const t=e.target.closest("[data-s2]");if(!t||!SHO)return;const v=t.dataset.s2,x=encodeURIComponent(SHO.text+" "+location.href);
 if(v==="x")return closeShare();if(v==="post")return postAch(SHO);
 if(v==="wa")window.open("https://wa.me/?text="+x,"_blank","noopener,noreferrer");else if(v==="tg")window.open("https://t.me/share/url?url="+encodeURIComponent(location.href)+"&text="+encodeURIComponent(SHO.text),"_blank","noopener,noreferrer");
 else if(v==="copy"){try{navigator.clipboard.writeText(SHO.text+" "+location.href);toast("Yey Alhamdulillah, tautan disalin!")}catch(e){toast("Salin: "+location.href)}}else shr(SHO.text)});

/* ===== Penangan klik ===== */
document.addEventListener("click",e=>{const t=e.target.closest("[data-act]");if(!t)return;const d=t.dataset,a=d.act;
 if(a==="qzpage")qzStart("p");
 if(a==="qzjilid")qzStart("j");
 if(a==="qztj")qzStart("t");
 if(a==="qzhear"&&QZ)say(QZ.qs[QZ.i].hear);
 if(a==="qzopt"&&QZ&&QZ.pick<0){const q=QZ.qs[QZ.i];QZ.pick=+d.i;if(q.opts[QZ.pick]===q.ans)QZ.right++;render()}
 if(a==="qznext"&&QZ&&QZ.pick>=0){if(QZ.i+1>=QZ.qs.length)qzFinish();else{QZ.i++;QZ.pick=-1;scrollTo(0,0);render()}}
 if(a==="qzagain"&&QZ)qzStart(QZ.kind)
 if(a==="qzdone"&&QZ)go(QZ.kind==="p"?"reader":QZ.kind==="j"?"bookdetail":"tajwid");
 if(a==="tjtab"){tjTab=+d.i;render()}
 if(a==="tjhear")say(TJ[tjTab].ex[+d.w][0]);
 if(a==="settj"){useTj=!useTj;saveSet();render();if(document.getElementById("stw"))showSt()}
 if(a==="shareres"){const k=d.k;let n,i,h;
  if(k==="rec"){n=4;i="microphone";h=200}else if(k==="quiz"){n=QZ?QZ.stars:0;i=QZ&&QZ.kind==="j"?"trophy":"glowing-star";h=QZ&&QZ.kind==="j"?40:140}else{n=qzStars();i="glowing-star";h=140}
  shareSheet({text:shareText(n),i,h})}
});
