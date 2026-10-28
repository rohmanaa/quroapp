/* Pembaca Iqro: halaman, pilih jilid/halaman, layar penuh, putar suara, geser, muat data */
const curPg=()=>{const p=IQ[jl+"-"+pn];return p&&p.content?p:null};
const cl=t=>t.replace(/\s*=\s*/g," ");
const pgTxt=p=>p.content.map(c=>cl(c.arabic)).join(" ");
const sampleTxt=()=>cl(IQ["1-1"].content[1].arabic);
const rowsOf=p=>{const m={};p.content.forEach(c=>(m[c.position.row]=m[c.position.row]||[]).push(c));return Object.keys(m).sort((a,b)=>a-b).map(r=>m[r].sort((a,b)=>a.position.col-b.position.col))};
const toAr=n=>String(n).replace(/\d/g,d=>"٠١٢٣٤٥٦٧٨٩"[d]);
let hi=0,seq=0,tx0=null;
const cellH=(c,z)=>`<button data-cell="${c.order_id}" class="band bd${Math.min(c.position.col,3)} w-full px-1 ${showLat?"py-2":"py-1"} text-center transition ${hi===c.order_id?"ring-2 ring-brand scale-[1.03]":""}"><span class="ar flex justify-center gap-1.5 ${z} leading-[1.2] overflow-visible" style="padding-top:.38em;padding-bottom:${showLat?".3em":".1em"}">${c.arabic.split(/\s+/).map(t=>t==="="?'<span class="text-mute">=</span>':lt(t)).join("")}</span>${showLat?`<small dir="ltr" class="block text-[11px] font-bold opacity-70 mt-1" style="color:var(--blk)">${c.latin}</small>`:""}</button>`;
function pickHTML(){const o=JL[pj];return `<div id="pkw" class="fixed inset-0 z-[9000] flex items-end justify-center"><div data-pk="x" class="absolute inset-0 bg-black/50"></div><div class="up relative bg-card border-2 border-b-0 border-line rounded-t-[32px] w-full max-w-md p-5 max-h-[85dvh] overflow-auto" style="padding-bottom:calc(1.25rem + env(safe-area-inset-bottom,0px))" role="dialog" aria-modal="true" aria-label="Pilih jilid dan halaman">
<div class="flex items-center justify-between mb-3"><h3 class="font-black text-lg">Pilih jilid & halaman</h3><button data-pk="x" class="ib" aria-label="Tutup">${ic("x")}</button></div>
<div class="relative mb-3"><div id="jtab" class="jt flex gap-2 overflow-x-auto pb-1.5">${[1,2,3,4,5,6].map(j=>`<button data-pk="j${j}" class="tile shrink-0 min-w-[76px] h-11 px-3 rounded-xl font-black text-sm grid place-items-center ${JL[j].ok?"":"opacity-50"}" style="--h:${CVH[j-1]};${j===pj?`background:hsl(${CVH[j-1]} 65% 40%);color:#fff;box-shadow:0 3px 0 hsl(${CVH[j-1]} 65% 26%);margin-bottom:3px`:""}">Iqro ${j}${JL[j].ok?"":`<small class="block text-[10px] opacity-80 -mt-1">segera</small>`}</button>`).join("")}</div></div>
${o.ok?`<div class="grid grid-cols-6 gap-2">${Array.from({length:o.n},(_,i)=>{const k=i+1,cur=pj===jl&&k===pn;return `<button data-pk="p${k}" class="h-11 rounded-xl font-black text-sm ${cur?"ring-2 ring-gold":iqDN[pj+"-"+k]?"tile":"bg-card border border-line"}" style="--h:${CVH[pj-1]};${cur?`background:hsl(${CVH[pj-1]} 65% 40%);color:#fff`:""}">${k}</button>`}).join("")}</div>`:`<p class="text-center text-mute font-bold py-6">Iqro ${pj} belum tersedia di sumber data.</p>`}</div></div>`}
function updJT(){}
function showPick(){const o=document.getElementById("jtab"),x=o?o.scrollLeft:0;closePick();document.body.insertAdjacentHTML("beforeend",pickHTML());const e=document.getElementById("jtab");e.style.scrollBehavior="auto";e.scrollLeft=x;if(!o){const c=e.children[pj-1];if(c)e.scrollLeft=c.offsetLeft-e.clientWidth/2+c.offsetWidth/2}e.style.scrollBehavior="";e.addEventListener("scroll",updJT,{passive:true});updJT();setTimeout(updJT,60)}
function closePick(){const e=document.getElementById("pkw");if(e)e.remove()}
function toggleFs(){fsOn=!fsOn;document.body.classList.toggle("fs",fsOn);try{if(fsOn){const r=document.documentElement,f=r.requestFullscreen||r.webkitRequestFullscreen;if(f){const x=f.call(r);if(x&&x.catch)x.catch(()=>{})}}else if(document.fullscreenElement)document.exitFullscreen()}catch(e){}render()}
document.addEventListener("fullscreenchange",()=>{if(!document.fullscreenElement&&fsOn){fsOn=false;document.body.classList.remove("fs");if(S==="reader")render()}});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closePick()});
document.addEventListener("click",e=>{const t=e.target.closest("[data-pk]");if(!t)return;const v=t.dataset.pk;
 if(v==="sl"||v==="sr"){const e=document.getElementById("jtab");if(e)e.scrollBy({left:v==="sl"?-180:180});return}
 if(v==="x")return closePick();
 if(v[0]==="j"){const j=+v.slice(1);if(!JL[j].ok)return toast("Iqro "+j+" segera hadir");pj=j;return showPick()}
 if(v[0]==="p"){jl=pj;pn=+v.slice(1);closePick();go("reader")}});
function stopSeq(){seq++;play=false;hi=0;try{speechSynthesis.cancel()}catch(e){}}
function sayCb(t,cb){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang="ar-SA";u.rate=rs;u.onend=cb;u.onerror=cb;speechSynthesis.speak(u)}catch(e){cb()}}
function playSeq(p){const cs=p.content.slice().sort((a,b)=>a.position.row-b.position.row||a.position.col-b.position.col),tk=++seq;let i=0;play=true;
 const nx=()=>{if(tk!==seq)return;if(i>=cs.length){play=false;hi=0;render();return}const c=cs[i++];hi=c.order_id;render();sayCb(cl(c.arabic),nx)};nx()}
function turn(d){stopSeq();if(d<0){if(pn>1)pn--;else return toast("Ini halaman pertama")}else{const nk=IQ[jl+"-"+(pn+1)];if((nk&&nk.s===404)||pn>=JL[jl].n)return toast("Ini halaman terakhir yang tersedia");pn++}scrollTo(0,0);render();anim(d>0?-1:1)}
let swAt=0;document.addEventListener("click",e=>{if(Date.now()-swAt<600&&e.target.closest(".fsx2")){e.stopPropagation();e.preventDefault()}},true);
document.addEventListener("touchstart",e=>{tx0=(S==="reader"&&e.touches.length===1)?e.touches[0].clientX:null},{passive:true});
document.addEventListener("touchend",e=>{if(tx0===null)return;const dx=e.changedTouches[0].clientX-tx0;tx0=null;if(Math.abs(dx)>70){swAt=Date.now();turn(dx>0?1:-1)}},{passive:true});
/* Semua halaman sudah ada di IQ (dibuat oleh data/latihan.js). Tidak ada unduhan dari luar. */
function loadPg(l,q){const k=l+"-"+q;if(!IQ[k])IQ[k]={s:404}}
