V.shop=()=>`<h1 class="text-3xl font-black">Toko Maskot</h1>
<p class="text-mute text-sm mb-3">Beli maskot Quro dengan koin. Yang sudah dimiliki bisa dipakai di Home dan jadi reaksi di Komunitas dan Leaderboard.</p>
<div class="flex justify-end mb-3"><span class="px-3 py-1.5 rounded-full font-black text-sm flex items-center gap-1.5" style="background:#FFC933;color:#7A4500">${coin()}${coins}</span></div>
<div class="grid grid-cols-2 gap-3">${SHOP.map(it=>{const h=shopHas(it.id),u=SH.use===it.id;return `<div class="${card} !p-3 text-center flex flex-col items-center">
<img src="src/assets/mascot/${it.id}.webp" alt="" class="w-24 h-24" draggable="false" style="height:6rem;object-fit:contain">
<b class="block text-sm mt-2">${it.n}</b>
${h?`<button data-act="shopuse" data-id="${it.id}" class="w-full rounded-full py-2 mt-2 text-xs font-black ${u?"bg-brand text-on":"bg-soft text-brand"}" ${u?"disabled":""}>${u?"Dipakai di Home":"Pakai di Home"}</button><small class="text-mute text-[11px] font-bold mt-1">Jadi reaksi ✓</small>`:`<button data-act="shopbuy" data-id="${it.id}" class="btn w-full mt-2 !py-2 text-sm inline-flex items-center justify-center gap-1.5">${coin("w-4 h-4")}${it.p}</button>`}
</div>`}).join("")}</div>`;
