/* Cari Huruf: temukan semua huruf Alif yang bersembunyi (ada 3). */
GK.run({
 slug:"cari-huruf",title:"Cari Huruf",hint:"Ketuk semua huruf Alif yang bersembunyi (ada 3).",
 init:()=>({ok:0,cells:["ب","ا","ت","ث","ن","ا","ل","ب","ي","ا","ت","ث"],f:{}}),
 view:s=>`<div class="grid grid-cols-3 gap-3">${s.cells.map((c,i)=>GK.arb(c,i,"g_fd",s.f[i]?"ring-4 ring-brand":"")).join("")}</div><p class="text-center font-black text-brand mt-3">Ditemukan ${Object.keys(s.f).length}/3</p>`,
 act(a,i,s,c){if(a!=="g_fd")return;if(s.cells[i]==="ا"){s.f[i]=1;if(Object.keys(s.f).length===3)c.win()}else c.toast("Itu bukan Alif, coba lagi ya")}
});
