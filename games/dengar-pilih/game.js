/* Dengar & Pilih: dengarkan bunyinya, lalu pilih hurufnya. */
GK.run({
 slug:"dengar-pilih",title:"Dengar & Pilih",hint:"Ketuk speaker, dengarkan, lalu pilih hurufnya.",
 init:()=>({ok:0,bad:{},o:GK.shf(["ا","ث","ن"])}),
 view:s=>`<div class="text-center mb-4"><button data-act="g_say" class="w-28 h-28 rounded-full bg-brand text-on grid place-items-center mx-auto shadow-[0_6px_0_var(--bd)] mas" aria-label="Dengar">${ic("vol","w-14 h-14")}</button><p class="text-mute font-bold text-sm mt-3">Ketuk untuk mendengar</p></div><div class="grid grid-cols-3 gap-3">${s.o.map((c,i)=>GK.arb(c,i,"g_ln",s.bad[c]?"opacity-40":"")).join("")}</div>`,
 act(a,i,s,c){
  if(a==="g_say"){c.say("ألف");return false}
  if(a==="g_ln"){const h=s.o[i];if(h==="ا")c.win();else{s.bad[h]=1;c.toast("Belum tepat, coba lagi ya")}}}
});
