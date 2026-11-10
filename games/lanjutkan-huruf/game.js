/* Lanjutkan Huruf: pilih huruf yang datang setelah huruf ini (urutan hijaiyah). Memakai daftar huruf bersama (L). */
GK.run({
 slug:"lanjutkan-huruf",title:"Lanjutkan Huruf",hint:"Pilih huruf yang datang setelah huruf ini, sesuai urutan hijaiyah.",
 init:()=>{const i=Math.floor(Math.random()*27),c=i+1,o=[c];while(o.length<3){const r=Math.floor(Math.random()*29);if(r!==c&&r!==i&&!o.includes(r))o.push(r)}return {ok:0,bad:{},q:i,o:GK.shf(o)}},
 view:s=>`<div class="text-center mb-4"><div dir="rtl" class="flex justify-center items-center gap-3"><span class="tile ar rounded-2xl w-20 h-24 text-[56px] grid place-items-center" style="--h:${s.q*12}">${L[s.q][0]}</span><span class="tile rounded-2xl w-20 h-24 grid place-items-center text-4xl font-black" style="--h:0">?</span></div><b class="block mt-2">${L[s.q][1]} → ?</b></div><div class="grid grid-cols-3 gap-3">${s.o.map((c,i)=>GK.arb(L[c][0],i,"g_nx",s.bad[c]?"opacity-40":"")).join("")}</div>`,
 act(a,i,s,c){if(a!=="g_nx")return;const h=s.o[i];if(h===s.q+1)c.win();else{s.bad[h]=1;c.toast("Belum tepat, coba lagi ya")}}
});
