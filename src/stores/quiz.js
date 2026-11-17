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
function postAch(o){if(!U)return;const t=o.text,i=t.indexOf("! ")+1;iqPosts.unshift({id:"u"+Date.now(),n:U.name,g:U.g||"L",ts:Date.now(),k:t.slice(0,i),s:t.slice(i).trim(),i:o.i,h:o.h,l:0,w:""});iqPosts=iqPosts.slice(0,30);savePosts();coins+=2;closeShare();toast("Terposting ke Komunitas. +2 koin");tabL=0;go("community")}

/* ===== Penangan klik ===== */
document.addEventListener("click",e=>{const t=e.target.closest("[data-act]");if(!t)return;const d=t.dataset,a=d.act;
 if(a==="qzpage")qzStart("p");
 if(a==="qzjilid")qzStart("j");
 if(a==="qztj")qzStart("t");
 if(a==="qzhear"&&QZ)say(QZ.qs[QZ.i].hear);
 if(a==="qzopt"&&QZ&&QZ.pick<0){const q=QZ.qs[QZ.i];QZ.pick=+d.i;if(q.opts[QZ.pick]===q.ans){QZ.right++;if(QZ.w){coins+=1;QZ.got=(QZ.got||0)+1}}render()}
 if(a==="qznext"&&QZ&&QZ.pick>=0){if(QZ.i+1>=QZ.qs.length)qzFinish();else{QZ.i++;QZ.pick=-1;if(QZ.w)QZ.ph=0;scrollTo(0,0);render()}}
 if(a==="qzagain"&&QZ)QZ.w?wzStart(QZ.jl,QZ.pn):qzStart(QZ.kind)
 if(a==="qzdone"&&QZ)go(QZ.w?"bookdetail":QZ.kind==="p"?"reader":QZ.kind==="j"?"bookdetail":"tajwid");
 if(a==="tjtab"){tjTab=+d.i;render()}
 if(a==="tjhear")say(TJ[tjTab].ex[+d.w][0]);
 if(a==="settj"){useTj=!useTj;saveSet();render();if(document.getElementById("stw"))showSt()}
 if(a==="shareres"){const k=d.k;let n,i,h;
  if(k==="rec"){n=4;i="microphone";h=200}else if(k==="quiz"){n=QZ?QZ.stars:0;i=QZ&&QZ.kind==="j"?"trophy":"glowing-star";h=QZ&&QZ.kind==="j"?40:140}else{n=qzStars();i="glowing-star";h=140}
  shareSheet({text:shareText(n),i,h})}
});
