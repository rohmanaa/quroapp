/* Toko Maskot: beli maskot dengan koin, pakai di Home, dan pakai sebagai reaksi di Komunitas dan Leaderboard.
   Toko: localStorage "iqro_shop" = {own:[id...], use:id, spent:total koin terpakai}.
   "spent" ikut disinkronkan (nilai terbesar menang) supaya belanja tidak "dikembalikan" saat sinkron antar HP, lihat merge() di cloud.js.
   Reaksi: localStorage "iqro_react" = {"p:<id kabar>":idMaskot, "u:<nama>":idMaskot}. Hanya maskot yang dimiliki yang bisa dipilih. */
const shopLoad=()=>{const d={own:["utama"],use:"utama",spent:0};try{const v=JSON.parse(localStorage.getItem("iqro_shop"));if(v&&typeof v==="object"){const ids=SHOP.map(x=>x.id);if(Array.isArray(v.own))v.own.forEach(i=>{if(ids.includes(i)&&!d.own.includes(i))d.own.push(i)});if(Number.isInteger(v.spent)&&v.spent>=0&&v.spent<=1e7)d.spent=v.spent;if(d.own.includes(v.use))d.use=v.use}}catch(e){}return d};
let SH=shopLoad();
const shopSave=()=>{try{localStorage.setItem("iqro_shop",JSON.stringify(SH));localStorage.setItem("iqro_coins",String(Math.max(0,Math.floor(coins)||0)))}catch(e){}};
const shopHas=id=>SH.own.includes(id);
const shopMascot=()=>SH.use;
function shopBuy(id){const it=SHOP.find(x=>x.id===id);if(!it||shopHas(id))return;if(coins<it.p)return toast("Koinmu belum cukup. Yuk selesaikan misi dan kuis!");
 coins-=it.p;SH.spent+=it.p;SH.own.push(id);shopSave();render();toast(it.n+" jadi milikmu. Yey Alhamdulillah!")}
function shopUse(id){if(!shopHas(id))return;SH.use=id;shopSave();render();toast("Maskot Home diganti. Bismillah!")}

/* ---- reaksi maskot ---- */
const rxLoad=()=>{const d={};try{const v=JSON.parse(localStorage.getItem("iqro_react")),ids=SHOP.map(x=>x.id);if(v&&typeof v==="object"&&!Array.isArray(v))Object.keys(v).slice(0,400).forEach(k=>{if(/^[pu]:.{1,30}$/.test(k)&&ids.includes(v[k]))d[k]=v[k]})}catch(e){}return d};
let RX=rxLoad();
const rxImg=(id,c="w-8 h-8")=>`<img src="assets/mascot/${id}.webp" alt="" class="${c}" draggable="false" style="object-fit:contain">`;
const rxFace='<svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8.5 14a4 4 0 0 0 7 0M9 9.5h.01M15 9.5h.01"/></svg>';
const rxName=id=>(SHOP.find(x=>x.id===id)||{}).n||"";
function rxSet(k,id){if(!/^[pu]:.{1,30}$/.test(k)||!shopHas(id))return false;RX[k]=id;try{localStorage.setItem("iqro_react",JSON.stringify(RX))}catch(e){}return true}
function rxOpen(k){const cur=RX[k],tg=k[0]==="u"?" untuk "+k.slice(2):"";
 $("#m").innerHTML=`<div data-act="none" class="up rounded-t-[36px] border-2 border-b-0 max-w-md shadow-[0_-8px_0_var(--line)] relative bg-card border-line w-full text-center px-5" style="padding-top:24px;padding-bottom:calc(env(safe-area-inset-bottom,0px) + 24px)"><div class="absolute left-1/2 -translate-x-1/2 top-2 w-12 h-1.5 rounded-full bg-line"></div>
<h3 class="text-xl font-black">Pilih reaksi${esc(tg)}</h3><p class="text-mute text-xs font-semibold mt-1 mb-3">Maskot yang kamu miliki bisa jadi reaksi.</p>
<div class="grid grid-cols-4 gap-2">${SH.own.map(id=>`<button data-act="rxset" data-k="${esc(k)}" data-id="${id}" class="rounded-2xl p-1.5 ${cur===id?"bg-soft":""}" style="border:2px solid ${cur===id?"var(--brand)":"var(--line)"}" aria-label="${esc(rxName(id))}">${rxImg(id,"w-full")}</button>`).join("")}</div>
<button data-act="rxshop" class="text-brand font-black text-sm mt-4">Beli maskot lain di Toko</button></div>`;
 const M=$("#m");M.classList.add("items-end");M.classList.remove("items-center","p-6","hidden")}
/* tombol reaksi: k = "p:<id kabar>" atau "u:<nama>"; cls = kelas tombol; lbl = teks kecil di bawah ikon; lt = tampilan terang (leaderboard) */
const rxBtn=(k,cls,lbl,lt)=>{const r=RX[k];return `<button data-act="rx" data-k="${esc(k)}" class="${cls}" aria-label="${r?"Ganti reaksi ("+esc(rxName(r))+")":"Beri reaksi"}">${r?rxImg(r,lt?"w-8 h-8":"w-10 h-10"):lt?rxFace:`<span class="w-10 h-10 rounded-full grid place-items-center" style="background:rgba(255,255,255,.2)">${rxFace}</span>`}${lbl||""}</button>`};

V.shop=()=>`<h1 class="text-3xl font-black">Toko Maskot</h1>
<p class="text-mute text-sm mb-3">Beli maskot Quro dengan koin. Yang sudah dimiliki bisa dipakai di Home dan jadi reaksi di Komunitas dan Leaderboard.</p>
<div class="flex justify-end mb-3"><span class="px-3 py-1.5 rounded-full font-black text-sm flex items-center gap-1.5" style="background:#FFC933;color:#7A4500">${coin()}${coins}</span></div>
<div class="grid grid-cols-2 gap-3">${SHOP.map(it=>{const h=shopHas(it.id),u=SH.use===it.id;return `<div class="${card} !p-3 text-center flex flex-col items-center">
<img src="assets/mascot/${it.id}.webp" alt="" class="w-24 h-24" draggable="false" style="height:6rem;object-fit:contain">
<b class="block text-sm mt-2">${it.n}</b>
${h?`<button data-act="shopuse" data-id="${it.id}" class="w-full rounded-full py-2 mt-2 text-xs font-black ${u?"bg-brand text-on":"bg-soft text-brand"}" ${u?"disabled":""}>${u?"Dipakai di Home":"Pakai di Home"}</button><small class="text-mute text-[11px] font-bold mt-1">Jadi reaksi ✓</small>`:`<button data-act="shopbuy" data-id="${it.id}" class="btn w-full mt-2 !py-2 text-sm inline-flex items-center justify-center gap-1.5">${coin("w-4 h-4")}${it.p}</button>`}
</div>`}).join("")}</div>`;
document.addEventListener("click",e=>{const t=e.target.closest("[data-act]");if(!t)return;const a=t.dataset.act,id=t.dataset.id;
 if(a==="shopbuy"){const it=SHOP.find(x=>x.id===id);if(!it)return;if(coins<it.p)return toast("Koinmu belum cukup. Yuk selesaikan misi dan kuis!");modal({center:1,t:"Beli "+it.n+"?",p:"Harga "+it.p+" koin. Koinmu sekarang "+coins+".",ok:1,b:"Batal",y:"Beli"});mok=()=>shopBuy(id)}
 if(a==="shopuse")shopUse(id);
 if(a==="rx")rxOpen(t.dataset.k);
 if(a==="rxset"){if(rxSet(t.dataset.k,id)){$("#m").classList.add("hidden");render();toast("Reaksi "+rxName(id)+" terkirim!")}}
 if(a==="rxshop"){$("#m").classList.add("hidden");go("shop")}});
