/* Susun Huruf: eja nama huruf Arab dengan huruf Latin. Data soal ada di sini. */
const A={ar:"ا",n:"Alif",lat:"ALIF",w:"Apel",e:"🍎",h:130};
GK.run({
 slug:"susun-huruf",title:"Susun Huruf",hint:"Susun nama huruf Arab ini dengan huruf Latin.",
 init:()=>({ok:0,tiles:GK.shf(["A","L","I","F","K","M","E"]),put:[null,null,null,null]}),
 view:s=>`<div class="tile rounded-[28px] p-4 text-center" style="--h:${A.h}"><div class="flex items-center justify-center gap-4"><span class="ar text-[96px] leading-[1.4]">${A.ar}</span><span class="mas">${fe("red-apple","w-20 h-20")}</span></div></div><div dir="ltr" class="flex justify-center gap-2 my-4">${s.put.map((t,i)=>`<button data-act="g_bx" data-i="${i}" class="w-12 h-14 rounded-2xl grid place-items-center text-2xl font-black border-2 ${t!=null?"bg-soft text-brand border-brand":"border-dashed border-line"}">${t!=null?s.tiles[t]:""}</button>`).join("")}</div><div dir="ltr" class="flex justify-center flex-wrap gap-2">${s.tiles.map((c,i)=>`<button data-act="g_bt" data-i="${i}" class="w-12 h-12 rounded-2xl bg-card border-2 border-line text-xl font-black shadow-[0_3px_0_var(--line)] ${s.put.includes(i)?"opacity-30 pointer-events-none":""}">${c}</button>`).join("")}</div><button data-act="g_bc" class="btn w-full mt-4">Cek jawaban</button>`,
 act(a,i,s,c){
  if(a==="g_bt"){const f=s.put.indexOf(null);if(f<0)return false;s.put[f]=i}
  if(a==="g_bx")s.put[i]=null;
  if(a==="g_bc"){if(s.put.includes(null))return c.toast("Isi semua kotak dulu ya");
   if(s.put.map(n=>s.tiles[n]).join("")===A.lat)c.win();else{c.toast("Belum tepat, coba lagi ya");s.put=[null,null,null,null]}}}
});
