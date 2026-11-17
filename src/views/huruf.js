V.huruf=()=>`
<h1 class="text-3xl font-black">Huruf hijaiyah</h1><p class="text-mute text-sm mb-4">Setiap huruf punya warna sendiri. Ketuk untuk mendengar.</p>
<div class="tile rounded-[32px] p-4 text-center mb-4" style="--h:${sel*12}"><div class="ar text-[104px] leading-[2] pt-3 pb-1">${L[sel][0]}</div><div class="text-xl font-extrabold mt-2 mb-1">${L[sel][1]}</div></div>
<div dir="rtl" class="grid grid-cols-5 gap-2">${L.map((_,i)=>tileH(i)).join("")}</div>`;
