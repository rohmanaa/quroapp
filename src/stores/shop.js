/* Toko Maskot: beli maskot dengan koin, pakai di Home, dan pakai sebagai reaksi di Komunitas dan Leaderboard.
   Toko: localStorage "iqro_shop" = {own:[id...], use:id, spent:total koin terpakai}.
   "spent" ikut disinkronkan (nilai terbesar menang) supaya belanja tidak "dikembalikan" saat sinkron antar HP, lihat merge() di cloud.js.
   Reaksi: localStorage "iqro_react" = {"p:<id kabar>":idMaskot, "u:<nama>":idMaskot}. Hanya maskot yang dimiliki yang bisa dipilih. */
const shopLoad=()=>{const d={own:["utama"],use:"utama",spent:0};try{const v=JSON.parse(localStorage.getItem("iqro_shop"));if(v&&typeof v==="object"){const ids=SHOP.map(x=>x.id);if(Array.isArray(v.own))v.own.forEach(i=>{if(ids.includes(i)&&!d.own.includes(i))d.own.push(i)});if(Number.isInteger(v.spent)&&v.spent>=0&&v.spent<=1e7)d.spent=v.spent;if(d.own.includes(v.use))d.use=v.use}}catch(e){}return d};
let SH=shopLoad();
const shopSave=()=>{try{localStorage.setItem("iqro_shop",JSON.stringify(SH));localStorage.setItem("iqro_coins",String(Math.max(0,Math.floor(coins)||0)))}catch(e){}};
const shopHas=id=>SH.own.includes(id);
function shopBuy(id){const it=SHOP.find(x=>x.id===id);if(!it||shopHas(id))return;if(coins<it.p)return toast("Koinmu belum cukup. Yuk selesaikan misi dan kuis!");
 coins-=it.p;SH.spent+=it.p;SH.own.push(id);shopSave();render();toast(it.n+" jadi milikmu. Yey Alhamdulillah!")}
function shopUse(id){if(!shopHas(id))return;SH.use=id;shopSave();render();toast("Maskot Home diganti. Bismillah!")}

/* ---- reaksi maskot ---- */
const rxLoad=()=>{const d={};try{const v=JSON.parse(localStorage.getItem("iqro_react")),ids=SHOP.map(x=>x.id);if(v&&typeof v==="object"&&!Array.isArray(v))Object.keys(v).slice(0,400).forEach(k=>{if(/^[pu]:.{1,30}$/.test(k)&&ids.includes(v[k]))d[k]=v[k]})}catch(e){}return d};
let RX=rxLoad();
function rxSet(k,id){if(!/^[pu]:.{1,30}$/.test(k)||!shopHas(id))return false;RX[k]=id;try{localStorage.setItem("iqro_react",JSON.stringify(RX))}catch(e){}return true}
document.addEventListener("click",e=>{const t=e.target.closest("[data-act]");if(!t)return;const a=t.dataset.act,id=t.dataset.id;
 if(a==="shopbuy"){const it=SHOP.find(x=>x.id===id);if(!it)return;if(coins<it.p)return toast("Koinmu belum cukup. Yuk selesaikan misi dan kuis!");modal({center:1,t:"Beli "+it.n+"?",p:"Harga "+it.p+" koin. Koinmu sekarang "+coins+".",ok:1,b:"Batal",y:"Beli"});mok=()=>shopBuy(id)}
 if(a==="shopuse")shopUse(id);
 if(a==="rx")rxOpen(t.dataset.k);
 if(a==="rxset"){if(rxSet(t.dataset.k,id)){$("#m").classList.add("hidden");render();toast("Reaksi "+rxName(id)+" terkirim!")}}
 if(a==="rxshop"){$("#m").classList.add("hidden");go("shop")}});
