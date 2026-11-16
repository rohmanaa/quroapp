V.notifications=()=>`
<div class="flex items-center gap-3 mb-4"><div><h1 class="text-3xl font-black">Notifikasi</h1><p class="text-mute text-xs font-bold">Kabar terbaru untukmu.</p></div></div>
<div class="flex flex-col gap-3">${[
["gift","Hadiah harian tersedia","Ambil hadiah +5 koin hari ini.","Sekarang"],
["flame","Streak masih aman 🔥","Kamu sudah belajar ${ci} hari berturut-turut.","1 jam lalu"],
["star","Capaian baru","Kamu semakin dekat menyelesaikan Iqro 2.","Kemarin"],
["bulb","Pengingat belajar","Yuk lanjutkan 3 menit lagi untuk mencapai target.","Kemarin"]
].map(([i,t,d,tm])=>`<article class="${card} !p-4 flex items-start gap-3"><span class="w-11 h-11 rounded-2xl bg-soft text-brand grid place-items-center shrink-0">${ic(i)}</span><div class="flex-1"><b class="block">${t}</b><p class="text-mute text-xs font-semibold mt-1">${d}</p><small class="text-brand font-black text-[10px]">${tm}</small></div></article>`).join("")}</div>`;
