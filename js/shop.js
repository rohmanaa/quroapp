/* Toko Maskot: beli maskot dengan koin, pakai di Home, bagikan sebagai stiker WhatsApp.
   Data tersimpan di localStorage "iqro_shop" = {own:[id...], use:id, spent:total koin terpakai}.
   "spent" ikut disinkronkan (nilai terbesar menang) supaya belanja tidak "dikembalikan" saat sinkron antar HP, lihat merge() di cloud.js. */
const shopLoad=()=>{const d={own:["utama"],use:"utama",spent:0};try{const v=JSON.parse(localStorage.getItem("iqro_shop"));if(v&&typeof v==="object"){const ids=SHOP.map(x=>x.id);if(Array.isArray(v.own))v.own.forEach(i=>{if(ids.includes(i)&&!d.own.includes(i))d.own.push(i)});if(Number.isInteger(v.spent)&&v.spent>=0&&v.spent<=1e7)d.spent=v.spent;if(d.own.includes(v.use))d.use=v.use}}catch(e){}return d};
let SH=shopLoad();
const shopSave=()=>{try{localStorage.setItem("iqro_shop",JSON.stringify(SH));localStorage.setItem("iqro_coins",String(Math.max(0,Math.floor(coins)||0)))}catch(e){}};
const shopHas=id=>SH.own.includes(id);
const shopMascot=()=>SH.use;
function shopBuy(id){const it=SHOP.find(x=>x.id===id);if(!it||shopHas(id))return;if(coins<it.p)return toast("Koinmu belum cukup. Yuk selesaikan misi dan kuis!");
 coins-=it.p;SH.spent+=it.p;SH.own.push(id);shopSave();render();toast(it.n+" jadi milikmu. Yey Alhamdulillah!")}
function shopUse(id){if(!shopHas(id))return;SH.use=id;shopSave();render();toast("Maskot Home diganti. Bismillah!")}
/* stiker WhatsApp: kanvas 512x512 transparan, WebP < 100 KB (PNG bila browser tak bisa menulis WebP) */
async function stickerBlob(id){const img=new Image();img.src="assets/mascot/"+id+".webp";await img.decode();
 const c=document.createElement("canvas");c.width=c.height=512;const x=c.getContext("2d"),m=24,s=Math.min((512-2*m)/img.naturalWidth,(512-2*m)/img.naturalHeight),w=img.naturalWidth*s,h=img.naturalHeight*s;
 x.drawImage(img,(512-w)/2,(512-h)/2,w,h);let last=null;
 for(const q of [.9,.8,.7,.55,.4]){const b=await new Promise(r=>c.toBlob(r,"image/webp",q));if(!b)continue;last=b;if(b.type!=="image/webp"||b.size<=100*1024)return b}
 return last}
async function shopSticker(id){if(!shopHas(id))return toast("Beli dulu ya untuk jadi stiker");
 let b;try{b=await stickerBlob(id)}catch(e){b=null}if(!b)return toast("Stiker belum bisa dibuat di HP ini");
 const it=SHOP.find(x=>x.id===id),f=new File([b],"quro-"+id+(b.type==="image/webp"?".webp":".png"),{type:b.type});
 if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],title:"Stiker "+it.n});return}catch(e){if(e&&e.name==="AbortError")return}}
 const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=f.name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},4000);
 toast("Stiker disimpan. Buka WhatsApp atau aplikasi pembuat stiker untuk memakainya")}
V.shop=()=>{const own=shopHas;return `<h1 class="text-3xl font-black">Toko Maskot</h1>
<p class="text-mute text-sm mb-3">Beli maskot Quro dengan koin. Yang sudah dimiliki bisa dipakai di Home dan dijadikan stiker WhatsApp.</p>
<div class="flex justify-end mb-3"><span class="px-3 py-1.5 rounded-full font-black text-sm flex items-center gap-1.5" style="background:#FFC933;color:#7A4500">${coin()}${coins}</span></div>
<div class="grid grid-cols-2 gap-3">${SHOP.map(it=>{const h=own(it.id),u=SH.use===it.id;return `<div class="${card} !p-3 text-center flex flex-col items-center">
<img src="assets/mascot/${it.id}.webp" alt="" class="w-24 h-24" draggable="false" style="height:6rem;object-fit:contain">
<b class="block text-sm mt-2">${it.n}</b>
${h?`<div class="flex gap-1.5 mt-2 w-full"><button data-act="shopuse" data-id="${it.id}" class="flex-1 rounded-full py-2 text-xs font-black ${u?"bg-brand text-on":"bg-soft text-brand"}" ${u?"disabled":""}>${u?"Dipakai":"Pakai"}</button><button data-act="shopstk" data-id="${it.id}" class="flex-1 rounded-full py-2 text-xs font-black bg-soft text-brand" aria-label="Jadikan stiker WhatsApp">Stiker</button></div>`:`<button data-act="shopbuy" data-id="${it.id}" class="btn w-full mt-2 !py-2 text-sm inline-flex items-center justify-center gap-1.5">${coin("w-4 h-4")}${it.p}</button>`}
</div>`}).join("")}</div>
<section class="${card} mt-4 text-sm text-mute font-semibold leading-relaxed"><b class="text-ink block mb-1">Cara pakai stiker WhatsApp</b>Ketuk <b>Stiker</b> pada maskot yang sudah kamu miliki, lalu pilih WhatsApp dan chat tujuan. Kalau terkirim sebagai gambar biasa atau hanya tersimpan, tambahkan lewat aplikasi pembuat stiker seperti Sticker Maker (gambar 512×512, transparan).</section>`};
document.addEventListener("click",e=>{const t=e.target.closest("[data-act]");if(!t)return;const a=t.dataset.act,id=t.dataset.id;
 if(a==="shopbuy"){const it=SHOP.find(x=>x.id===id);if(!it)return;if(coins<it.p)return toast("Koinmu belum cukup. Yuk selesaikan misi dan kuis!");modal({center:1,t:"Beli "+it.n+"?",p:"Harga "+it.p+" koin. Koinmu sekarang "+coins+".",ok:1,b:"Batal",y:"Beli"});mok=()=>shopBuy(id)}
 if(a==="shopuse")shopUse(id);if(a==="shopstk")shopSticker(id)});
