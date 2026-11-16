V.result=()=>`
<section class="hero rounded-[32px] p-4 pb-5 text-center"><div class="flex justify-center items-end gap-2 mb-2">${[1,2,3,4].map(i=>`<span class="st ${i%2?"":"-mt-4"}">${ic("star","w-11 h-11")}</span>`).join("")}</div>
<div class="bg-card text-ink rounded-[28px] p-5 pt-3 border-4 border-[#FFE27A] relative"><div class="flex justify-center -mt-14">${mas("w-20","rayakan")}</div>
<h2 class="text-xl font-black mt-1">Yay MasyaAllah! Kamu dapat 4 bintang</h2><div class="text-7xl font-black text-brand leading-tight mt-2">81,9</div><p class="font-extrabold text-brand text-sm">Skor keseluruhan</p>
<div class="grid grid-cols-3 gap-2 mt-4">${[["85,6","Kelancaran"],["75","Kelengkapan"],["83","Ketepatan"]].map(([v,l])=>`<div><b class="text-xl font-black" style="color:#E59A00">${v}</b><small class="block text-mute text-xs font-bold">${l}</small></div>`).join("")}</div>
<div class="text-left bg-soft rounded-2xl p-3 mt-4"><b class="text-sm">Saran</b><p class="text-xs text-mute font-semibold mt-1">Keren! Perjelas bunyi huruf tebal dan baca perlahan. Ulangi sekali lagi untuk 5 bintang.</p></div>
<p class="flex items-center justify-center gap-1.5 text-sm font-black mt-3">${coin()}+10 koin masuk</p></div></section>`;
