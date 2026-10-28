/* Layar target, notifikasi, audio, privasi, tampilan */
V.target=()=>`
<div class="flex items-center gap-3 mb-4"><div><h1 class="text-3xl font-black">Target belajar</h1><p class="text-mute text-xs font-bold">Atur ritme belajar yang nyaman.</p></div></div>
<section class="${card} !p-5"><div class="flex items-center justify-between"><div><p class="text-mute text-sm font-bold">Target hari ini</p><b class="text-4xl font-black">${goal} menit</b></div><div class="w-16 h-16 rounded-3xl bg-soft text-brand grid place-items-center">${ic("target","w-8 h-8")}</div></div><div class="mt-4">${pb(goalPct())}</div><p class="text-xs text-mute font-bold mt-2">${todayMin()>=goal?"Target hari ini tercapai. Alhamdulillah!":`Sudah ${todayMin()} menit · tinggal ${goal-todayMin()} menit lagi.`}</p></section>
<h2 class="font-black text-lg mt-5 mb-3">Pilih target</h2>
<div class="grid grid-cols-3 gap-3">${[["5","Santai"],["10","Fokus"],["15","Rajin"]].map(([v,l])=>`<button data-act="settarget" data-v="${v}" class="${card} !p-4 text-center ${+v===goal?"ring-2 ring-brand":""}"><b class="text-2xl font-black text-brand">${v}</b><small class="block text-mute text-xs font-bold">${l}</small></button>`).join("")}</div>
<section class="${card} mt-4"><div class="flex items-center gap-3"><span class="w-11 h-11 rounded-2xl bg-soft text-brand grid place-items-center">${ic("flame")}</span><div><b class="block">Streak ${streakN()} hari</b><small class="text-mute text-xs font-semibold">Belajar sedikit setiap hari lebih baik daripada sekaligus banyak.</small></div></div></section>`,
V.notifications=()=>`
<div class="flex items-center gap-3 mb-4"><div><h1 class="text-3xl font-black">Notifikasi</h1><p class="text-mute text-xs font-bold">Kabar terbaru untukmu.</p></div></div>
<div class="flex flex-col gap-3">${[
["gift","Hadiah harian tersedia","Ambil hadiah +5 koin hari ini.","Sekarang"],
["flame","Streak masih aman 🔥","Kamu sudah belajar ${ci} hari berturut-turut.","1 jam lalu"],
["star","Capaian baru","Kamu semakin dekat menyelesaikan Iqro 2.","Kemarin"],
["bulb","Pengingat belajar","Yuk lanjutkan 3 menit lagi untuk mencapai target.","Kemarin"]
].map(([i,t,d,tm])=>`<article class="${card} !p-4 flex items-start gap-3"><span class="w-11 h-11 rounded-2xl bg-soft text-brand grid place-items-center shrink-0">${ic(i)}</span><div class="flex-1"><b class="block">${t}</b><p class="text-mute text-xs font-semibold mt-1">${d}</p><small class="text-brand font-black text-[10px]">${tm}</small></div></article>`).join("")}</div>`,
V.audio=()=>`
<div class="flex items-center gap-3 mb-4"><div><h1 class="text-3xl font-black">Pengaturan audio</h1><p class="text-mute text-xs font-bold">Atur pengalaman mendengarkan.</p></div></div>
<section class="${card} !p-4"><div class="flex items-center gap-3 mb-4"><span class="w-12 h-12 rounded-2xl bg-soft text-brand grid place-items-center">${ic("vol","w-6 h-6")}</span><div><b class="block">Kecepatan bacaan</b><small class="text-mute text-xs font-semibold">Atur sesuai kenyamanan belajar.</small></div></div><div class="flex gap-2">${["0.75×","1×","1.25×"].map((v,i)=>`<button data-act="speed" data-v="${v}" class="${i===1?"btn":"btn btn-w"} flex-1 !px-2 !py-2.5">${v}</button>`).join("")}</div></section>
<section class="${card} mt-3 !p-4"><div class="flex items-center justify-between"><div><b class="block">Putar otomatis</b><small class="text-mute text-xs">Lanjut ke contoh berikutnya.</small></div><button data-act="toggleauto" class="w-14 h-8 rounded-full bg-brand p-1"><span class="block w-6 h-6 rounded-full bg-white ml-6 shadow"></span></button></div></section>`,
V.privacy=()=>`
<div class="flex items-center gap-3 mb-4"><div><h1 class="text-3xl font-black">Privasi</h1><p class="text-mute text-xs font-bold">Atur siapa yang dapat melihat aktivitasmu.</p></div></div>
<section class="${card} !p-4">${[
["user","Profil publik","Teman dapat melihat nama dan avatar."],
["chart","Progress belajar","Tampilkan capaian belajar kepada teman."],
["mic","Rekaman latihan","Jangan tampilkan rekaman ke publik."]
].map(([i,t,d],n)=>`<div class="flex items-center gap-3 ${n?"border-t border-line pt-4 mt-4":""}"><span class="w-11 h-11 rounded-2xl bg-soft text-brand grid place-items-center">${ic(i)}</span><div class="flex-1"><b class="block text-sm">${t}</b><small class="text-mute text-[11px] font-semibold">${d}</small></div><button data-act="privacy" class="w-14 h-8 rounded-full ${n===2?"bg-brand":"bg-soft"} p-1"><span class="block w-6 h-6 rounded-full bg-white shadow ${n===2?"ml-6":""}"></span></button></div>`).join("")}</section>`,
V.theme=()=>`<h1 class="text-3xl font-black">Tampilan</h1><p class="text-mute text-sm mb-4">Pilih tampilan yang nyaman untuk matamu.</p><div class="flex flex-col gap-3">${[["light","sun","Terang","Latar cerah, nyaman di siang hari"],["dark","moon","Gelap","Latar gelap, nyaman di malam hari"],["system","phone","Sistem","Ikut pengaturan HP kamu"]].map(([m,i,t,d])=>`<button data-act="th" data-m="${m}" class="${card} !p-4 flex items-center gap-4 text-left w-full ${TH===m?"!border-brand":""}"><span class="w-12 h-12 rounded-2xl grid place-items-center bg-soft text-brand shrink-0">${ic(i,"w-6 h-6")}</span><span class="flex-1"><b class="block">${t}</b><small class="text-mute text-xs font-semibold">${d}</small></span><span class="text-brand ${TH===m?"":"opacity-0"}">${ic("check","w-6 h-6")}</span></button>`).join("")}</div>`;
