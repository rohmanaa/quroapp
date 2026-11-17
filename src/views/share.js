V.share=()=>`
<section class="${card} text-center"><h2 class="text-2xl font-black">${esc(U.name)}</h2><p class="text-mute text-sm font-semibold mb-3">Ajak temanmu belajar Iqro bareng!</p>
<div class="rounded-3xl border-2 border-brand/50 overflow-hidden mx-auto w-52"><div class="p-3 bg-white">${qr()}</div><div class="bg-brand text-on text-xs font-black py-2">Teman bergabung +20 ★</div></div>
<div class="flex justify-center mt-3">${mas("w-32")}</div></section>
<div class="grid grid-cols-4 gap-2 mt-5 text-center">${[["#25D366","WhatsApp","wa"],["#3DB54A","Salin link","copy"],["#2AABEE","Telegram","tg"],["#FFC933","Lainnya","more"]].map(([c,l,k])=>`<button data-act="sh" data-k="${k}"><span class="w-14 h-14 rounded-full grid place-items-center mx-auto text-white" style="background:${c};box-shadow:0 4px 0 rgba(0,0,0,.15)">${ic("ar","w-6 h-6")}</span><small class="font-extrabold text-xs mt-2 block">${l}</small></button>`).join("")}</div>`;
