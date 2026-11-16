V.home=()=>`
<div class="flex justify-end mb-3"><button data-go="daily" class="px-3 py-1.5 rounded-full font-black text-sm flex items-center gap-1.5" style="background:#FFC933;color:#7A4500" aria-label="Misi dan koin">${coin("w-5 h-5")}${coins}</button></div>
<section class="hero rounded-[32px] p-5 pr-36">
  <p class="text-sm font-bold opacity-90">Assalamu’alaikum,</p>
  <h1 class="text-3xl font-black leading-tight">Ahlan, ${esc(U.name)}!</h1>
  <p class="text-sm font-bold mt-2 opacity-90">Iqro ${jl} · Halaman ${pn}</p>
  <div class="h-2 w-full bg-white/25 rounded-full overflow-hidden mt-1.5"><span class="block h-full bg-white rounded-full" style="width:${Math.round(pn/JL[jl].n*100)}%"></span></div>
  <button data-go="reader" class="btn btn-w mt-4 !py-2.5">Lanjutkan ${ic("ar","w-4 h-4")}</button>
  <div class="absolute right-2 bottom-1">${mas("w-32",shopMascot())}</div>
</section>
<section class="${card} mt-4 !p-3 grid grid-cols-2 gap-3 items-center"><div><div class="flex items-center gap-1.5 text-brand mb-1">${ic("target","w-4 h-4")}<b class="text-sm">Target hari ini</b></div><p class="font-black text-xl">${todayMin()} <small class="text-mute text-xs">/ ${goal} menit</small></p>${pb(goalPct())}</div><div class="flex items-center gap-3 border-l border-line pl-3"><span class="w-11 h-11 rounded-2xl grid place-items-center bg-soft" style="color:#FFB72B">${ic("flame","w-6 h-6")}</span><div><b class="block text-xl font-black leading-tight">${streakN()} hari</b><small class="text-mute text-xs font-bold">Streak</small></div></div></section>
${absen()}
<section class="grid grid-cols-3 gap-3 mt-4">
<button data-go="huruf" class="${card} !p-3 text-center"><span class="w-12 h-12 mx-auto rounded-2xl grid place-items-center bg-soft text-brand"><span class="ar text-[32px] leading-none pt-1">ق</span></span><b class="block text-sm mt-2">Huruf</b></button>
<button data-go="daily" class="${card} !p-3 text-center"><span class="block w-12 mx-auto">${fe("wrapped-gift","w-12 h-12")}</span><b class="block text-sm mt-1">Misi</b>${claimed?"":`<small class="text-brand text-[11px] font-black">+5 hari ini</small>`}</button>
<button data-go="shop" class="${card} !p-3 text-center"><img src="assets/mascot/senang.webp" alt="" class="w-12 h-12 mx-auto" draggable="false" style="height:3rem;object-fit:contain"><b class="block text-sm mt-1">Toko</b></button>
</section>
${gamesHome()}`;
