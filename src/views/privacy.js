V.privacy=()=>`
<div class="flex items-center gap-3 mb-4"><div><h1 class="text-3xl font-black">Privasi</h1><p class="text-mute text-xs font-bold">Atur siapa yang dapat melihat aktivitasmu.</p></div></div>
<section class="${card} !p-4">${[
["user","Profil publik","Teman dapat melihat nama dan avatar."],
["chart","Progress belajar","Tampilkan capaian belajar kepada teman."],
["mic","Rekaman latihan","Jangan tampilkan rekaman ke publik."]
].map(([i,t,d],n)=>`<div class="flex items-center gap-3 ${n?"border-t border-line pt-4 mt-4":""}"><span class="w-11 h-11 rounded-2xl bg-soft text-brand grid place-items-center">${ic(i)}</span><div class="flex-1"><b class="block text-sm">${t}</b><small class="text-mute text-[11px] font-semibold">${d}</small></div><button data-act="privacy" class="w-14 h-8 rounded-full ${n===2?"bg-brand":"bg-soft"} p-1"><span class="block w-6 h-6 rounded-full bg-white shadow ${n===2?"ml-6":""}"></span></button></div>`).join("")}</section>`;
