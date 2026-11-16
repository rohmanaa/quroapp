V.books=()=>`
<h1 class="text-3xl font-black">Iqro</h1><p class="text-mute text-sm mb-4">Sedikit demi sedikit, menjadi kebiasaan.</p>
<div dir="ltr" class="hs mb-4">
<button data-go="huruf" class="${card} !w-[88%] shrink-0 flex items-center gap-4 text-left">
  <div dir="rtl" class="grid grid-cols-3 gap-1 shrink-0">${[0,1,2,3,4,5].map(i=>`<span class="tile ar rounded-lg w-9 h-9 grid place-items-center text-2xl" style="--h:${i*60}">${L[[1,2,3,4,5,6][i]][0]}</span>`).join("")}</div>
  <div class="flex-1"><b>30 huruf hijaiyah</b><p class="text-mute text-xs">Kenali tiap huruf dan dengarkan bunyinya.</p></div><span class="text-brand">${ic("cr")}</span></button>
<button data-go="harakat" class="${card} !w-[88%] shrink-0 flex items-center gap-4 text-left">
  <div dir="ltr" class="grid grid-cols-3 gap-1 shrink-0">${[0,1,2,3,6,7].map(k=>`<span class="tile ar rounded-lg w-9 h-9 grid place-items-center text-2xl" style="--h:${k*45+20}">${"\u0628"+HK[k][1]}</span>`).join("")}</div>
  <div class="flex-1"><b>Harakat</b><p class="text-mute text-xs">Fathah, kasrah, dhammah, tanwin, sukun, dan tasydid.</p></div><span class="text-brand">${ic("cr")}</span></button>
${tjCard()}</div>
${bmList()}<h2 class="font-bold text-lg mb-3">Pilih jilid</h2><div class="grid grid-cols-2 gap-3">${[1,2,3,4,5,6].map(cover).join("")}</div>`;
