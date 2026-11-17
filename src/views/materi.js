/* Materi dasar (dipindah dari tab Iqro): huruf hijaiyah, harakat, tanda baca/tajwid, penanda halaman */
V.materi=()=>`
<h1 class="text-3xl font-black">Materi dasar</h1><p class="text-mute text-sm mb-4">Kenali huruf, harakat, dan tanda baca. Cocok dipelajari sebelum atau sambil menjelajah peta Iqro.</p>
<div class="flex flex-col gap-3 mb-5">
<button data-go="huruf" class="${card} w-full flex items-center gap-4 text-left">
  <div dir="rtl" class="grid grid-cols-3 gap-1 shrink-0">${[0,1,2,3,4,5].map(i=>`<span class="tile ar rounded-lg w-9 h-9 grid place-items-center text-2xl" style="--h:${i*60}">${L[[1,2,3,4,5,6][i]][0]}</span>`).join("")}</div>
  <div class="flex-1"><b>30 huruf hijaiyah</b><p class="text-mute text-xs">Kenali tiap huruf dan dengarkan bunyinya.</p></div><span class="text-brand">${ic("cr")}</span></button>
<button data-go="harakat" class="${card} w-full flex items-center gap-4 text-left">
  <div dir="ltr" class="grid grid-cols-3 gap-1 shrink-0">${[0,1,2,3,6,7].map(k=>`<span class="tile ar rounded-lg w-9 h-9 grid place-items-center text-2xl" style="--h:${k*45+20}">${"\u0628"+HK[k][1]}</span>`).join("")}</div>
  <div class="flex-1"><b>Harakat</b><p class="text-mute text-xs">Fathah, kasrah, dhammah, tanwin, sukun, dan tasydid.</p></div><span class="text-brand">${ic("cr")}</span></button>
${tjCard().replace("!w-[88%] shrink-0","w-full")}</div>
${bmList()}`;
