/* Tebak Huruf: apel diawali huruf hijaiyah yang mana? */
GK.run({
 slug:"tebak-huruf",title:"Tebak Huruf",hint:"Apel diawali huruf hijaiyah yang mana?",
 init:()=>({ok:0,bad:{},o:GK.shf(["ا","ب","ت"])}),
 view:s=>`<div class="text-center mb-4"><span class="flex justify-center mas">${fe("red-apple","w-28 h-28")}</span><b class="text-2xl">Apel</b></div><div class="grid grid-cols-3 gap-3">${s.o.map((c,i)=>GK.arb(c,i,"g_pk",s.bad[c]?"opacity-40":"")).join("")}</div>`,
 act(a,i,s,c){if(a!=="g_pk")return;const h=s.o[i];if(h==="ا")c.win();else{s.bad[h]=1;c.toast("Belum tepat, coba lagi ya")}}
});
