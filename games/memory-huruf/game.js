/* Memory Huruf: balik dua kartu, cocokkan dua huruf Arab yang sama. 4 level x 8 huruf (daftar huruf bersama L). */
const MPL=8,MEMN=MPL,MLV=Math.ceil(L.length/MPL);let ML=0;
GK.run({
 slug:"memory-huruf",title:"Memory Huruf",hint:"Balik dua kartu, cocokkan dua huruf Arab yang sama. Tiap level 8 huruf.",
 init:()=>({ok:0,cards:GK.shf(L.slice(ML*MPL,ML*MPL+MPL).flatMap((l,j)=>{const p=ML*MPL+j;return [{p,t:0},{p,t:0}]})),open:[],done:{},n:0,mv:0,lock:0}),
 view:s=>`<div class="flex gap-2 mb-2 overflow-x-auto">${Array.from({length:MLV},(_,v)=>`<button data-act="g_lv" data-i="${v}" class="${GK.chip} !text-xs !px-3 !py-1.5 shrink-0 ${v===ML?"bg-brand text-on":"bg-soft text-brand"}">Level ${v+1}</button>`).join("")}</div><p class="text-xs font-bold text-mute mb-3">${L[ML*MPL][1]} – ${L[Math.min(L.length,ML*MPL+MPL)-1][1]}</p><div class="flex items-center justify-between mb-3"><span class="${GK.chip} bg-soft text-brand">Pasangan <b id="mp">${s.n}</b>/${MEMN}</span><span class="${GK.chip} bg-soft text-brand">Langkah <b id="mm">${s.mv}</b></span></div><div dir="ltr" class="grid grid-cols-4 gap-2.5">${s.cards.map((c,i)=>`<button data-act="g_mf" data-i="${i}" class="mc ${s.done[i]?"ok":""}" style="--h:${c.p*12}" aria-label="Kartu ${i+1}"><i><s>${ic("moon","w-5 h-5")}</s><b>${c.t?`<span class="font-black text-[13px] leading-tight text-center px-0.5">${L[c.p][1]}</span>`:`<span class="ar text-[46px] leading-[1.5]">${L[c.p][0]}</span>`}</b></i></button>`).join("")}</div>`,
 next:c=>{ML++;c.reset()},
 act(a,i,s,c){
  if(a==="g_lv"){ML=i;c.reset();return false}
  if(a!=="g_mf")return;
  if(s.lock||s.done[i]||s.open.includes(i))return false;
  c.t.classList.add("on");s.open.push(i);
  if(s.open.length===2){const[x,y]=s.open,bx=document.querySelectorAll(".mc");s.mv++;const m=document.getElementById("mm");if(m)m.textContent=s.mv;s.lock=1;
   if(s.cards[x].p===s.cards[y].p)setTimeout(()=>{s.done[x]=s.done[y]=1;bx[x]?.classList.add("ok");bx[y]?.classList.add("ok");s.n++;s.open=[];s.lock=0;const e=document.getElementById("mp");if(e)e.textContent=s.n;
    if(s.n===MEMN){const nx=ML<MLV-1;c.win({t:"Yey Alhamdulillah, benar!",p:nx?"Level "+(ML+1)+" selesai dalam "+s.mv+" langkah.":"Semua 30 huruf sudah kamu kuasai!",b:nx?"Level berikutnya":"Lanjut",again:nx})}},450);
   else setTimeout(()=>{bx[x]?.classList.remove("on");bx[y]?.classList.remove("on");s.open=[];s.lock=0},850)}
  return false}
});
