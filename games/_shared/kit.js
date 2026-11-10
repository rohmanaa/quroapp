/* Kit bersama untuk halaman game (games/<nama>/index.html).
   - Gaya memakai css bawaan aplikasi (../../css/*), bukan gaya sendiri.
   - Saat ditanam di aplikasi (iframe), kit berkirim pesan ke induk: toast, suara, tinggi halaman, menang, keluar.
   - Saat dibuka sendiri (tanpa induk), kit memakai cadangan sederhana. */
const GK=(function(){
const emb=window.parent!==window,OR=location.origin==="null"?"*":location.origin;
const card="bg-card border-2 border-line rounded-[28px] p-4 shadow-[0_4px_0_var(--line)]",chip="text-[10px] font-black px-2 py-0.5 rounded-full";
try{const t=localStorage.getItem("iqro_th");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}
if(emb)document.documentElement.classList.add("emb");
const send=m=>{if(emb)try{parent.postMessage(Object.assign({quro:1},m),"*")}catch(e){}};
const shf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
let tt=0;
function toast(t){if(emb)return send({type:"toast",t:String(t)});let e=document.getElementById("t");if(!e){e=document.createElement("div");e.id="t";e.className="fixed left-1/2 -translate-x-1/2 bottom-28 bg-brand text-on text-sm font-extrabold px-5 py-3 rounded-full shadow-[0_5px_0_var(--bd)] z-50";document.body.appendChild(e)}e.textContent=t;e.classList.remove("hidden");clearTimeout(tt);tt=setTimeout(()=>e.classList.add("hidden"),2200)}
function say(t){if(emb)return send({type:"say",t:String(t)});try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang="ar-SA";u.rate=.6;speechSynthesis.speak(u)}catch(e){toast("Suara belum didukung di perangkat ini")}}
function exit(){if(emb)send({type:"exit"});else location.href="../../index.html"}
function win(o){if(emb)send({type:"win",slug:o.slug,t:o.t,p:o.p,b:o.b||"Lanjut",again:!!o.again});else toast(o.t)}
function height(){const a=document.getElementById("app");if(a)send({type:"height",h:Math.ceil(a.getBoundingClientRect().height)})}
/* tombol huruf Arab berwarna (dipakai beberapa game) */
const arb=(c,i,act,x="")=>`<button data-act="${act}" data-i="${i}" class="tile ar rounded-[22px] h-24 w-full text-[60px] leading-[1.5] grid place-items-center ${x}" style="--h:${typeof CM!=="undefined"&&CM[c]!=null?CM[c]:0}">${c}</button>`;
/* jalankan game: g={slug,title,hint,init(),view(s),act(a,i,s,ctx),after?(s,ctx),next?(ctx)} */
function run(g){
 const app=document.getElementById("app");let s={};
 const draw=()=>{app.innerHTML=(emb?"":`<h1 class="text-3xl font-black mb-1">${g.title}</h1>`)+`<p class="text-mute text-sm font-bold mb-4">${g.hint}</p><section class="${card}">${g.view(s)}</section>`+(s.ok?`<div class="flex gap-3 mt-3"><button data-act="g_re" class="btn btn-w flex-1">Ulangi</button><button data-act="g_x" class="btn flex-1">Selesai</button></div>`:"");if(g.after)g.after(s,ctx);height()};
 const reset=()=>{s=g.init();draw()};
 const fin=o=>{if(s.ok)return;s.ok=1;draw();o=o||{};GK.win({slug:g.slug,t:o.t||"Yey Alhamdulillah, benar!",p:o.p||"Barakallah, kamu hebat!",b:o.b,again:o.again})};
 const ctx={win:fin,toast,say,draw,reset,chip,card,arb,shf};
 document.addEventListener("click",e=>{const t=e.target.closest("[data-act^=g_]");if(!t)return;const a=t.dataset.act,i=+t.dataset.i;
  if(a==="g_re")return reset();if(a==="g_x")return exit();
  if(s.ok&&a!=="g_lv")return;
  if(g.act(a,i,s,Object.assign({t},ctx))!==false)draw()});
 addEventListener("message",e=>{if(e.source===parent&&e.data&&e.data.quro===1&&e.data.type==="next"&&g.next)g.next(ctx)});
 if(window.ResizeObserver)new ResizeObserver(height).observe(app);
 reset();send({type:"ready",slug:g.slug})}
return {emb,card,chip,shf,toast,say,exit,win,arb,run,height}})();
