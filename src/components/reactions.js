const shopMascot=()=>SH.use;
const rxImg=(id,c="w-8 h-8")=>`<img src="src/assets/mascot/${id}.webp" alt="" class="${c}" draggable="false" style="object-fit:contain">`;
const rxFace='<svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8.5 14a4 4 0 0 0 7 0M9 9.5h.01M15 9.5h.01"/></svg>';
const rxName=id=>(SHOP.find(x=>x.id===id)||{}).n||"";
function rxOpen(k){const cur=RX[k],tg=k[0]==="u"?" untuk "+k.slice(2):"";
 $("#m").innerHTML=`<div data-act="none" class="up rounded-t-[36px] border-2 border-b-0 max-w-md shadow-[0_-8px_0_var(--line)] relative bg-card border-line w-full text-center px-5" style="padding-top:24px;padding-bottom:calc(env(safe-area-inset-bottom,0px) + 24px)"><div class="absolute left-1/2 -translate-x-1/2 top-2 w-12 h-1.5 rounded-full bg-line"></div>
<h3 class="text-xl font-black">Pilih reaksi${esc(tg)}</h3><p class="text-mute text-xs font-semibold mt-1 mb-3">Maskot yang kamu miliki bisa jadi reaksi.</p>
<div class="grid grid-cols-4 gap-2">${SH.own.map(id=>`<button data-act="rxset" data-k="${esc(k)}" data-id="${id}" class="rounded-2xl p-1.5 ${cur===id?"bg-soft":""}" style="border:2px solid ${cur===id?"var(--brand)":"var(--line)"}" aria-label="${esc(rxName(id))}">${rxImg(id,"w-full")}</button>`).join("")}</div>
<button data-act="rxshop" class="text-brand font-black text-sm mt-4">Beli maskot lain di Toko</button></div>`;
 const M=$("#m");M.classList.add("items-end");M.classList.remove("items-center","p-6","hidden")}
/* tombol reaksi: k = "p:<id kabar>" atau "u:<nama>"; cls = kelas tombol; lbl = teks kecil di bawah ikon; lt = tampilan terang (leaderboard) */
const rxBtn=(k,cls,lbl,lt)=>{const r=RX[k];return `<button data-act="rx" data-k="${esc(k)}" class="${cls}" aria-label="${r?"Ganti reaksi ("+esc(rxName(r))+")":"Beri reaksi"}">${r?rxImg(r,lt?"w-8 h-8":"w-10 h-10"):lt?rxFace:`<span class="w-10 h-10 rounded-full grid place-items-center" style="background:rgba(255,255,255,.2)">${rxFace}</span>`}${lbl||""}</button>`};
