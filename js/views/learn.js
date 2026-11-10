/* Layar belajar: home, books, huruf, harakat, bookdetail, reader */
const V={};
const absen=()=>`<section class="${card} mt-4"><div class="flex justify-between items-center mb-3"><h3 class="font-black">Absen 7 hari</h3><span class="text-xs font-extrabold text-brand">${ci} hari beruntun 🔥</span></div>
<div class="grid grid-cols-7 gap-1.5 text-center">${[1,2,3,4,5,6,7].map(n=>{const dn=n<=ci,nx=n===ci+1&&!claimed;return `<div><div class="aspect-square rounded-2xl grid place-items-center text-xs font-black ${dn?"bg-brand text-on":"bg-soft text-mute"} ${nx?"ring-4 ring-gold":""}" style="${dn?"box-shadow:0 3px 0 var(--bd)":""}">${dn?ic("check","w-4 h-4"):n===7?ic("star","w-4 h-4"):"+"+n}</div><small class="text-[9px] font-extrabold text-mute">${n===7?"Bonus":"H"+n}</small></div>`}).join("")}</div></section>`;
const gamesHome=()=>`<div class="flex items-center justify-between mt-5 mb-3"><h2 class="font-bold text-lg">Game</h2><button data-go="games" class="text-brand font-black text-sm">Lihat semua</button></div>
<section class="grid grid-cols-3 gap-3">${MG.slice(0,3).map(([k,tt,d,e,h],i)=>`<button data-go="game" data-gm="${i}" class="tile rounded-[24px] p-3 text-center" style="--h:${h}"><span class="block w-12 h-12 mx-auto rounded-2xl bg-white/60 grid place-items-center">${fe(e,"w-9 h-9")}</span><b class="block text-xs mt-2 leading-tight" style="color:var(--ink)">${tt}</b></button>`).join("")}</section>`;
V.home=()=>`
<div class="flex justify-end mb-3"><button data-go="daily" class="px-3 py-1.5 rounded-full font-black text-sm flex items-center gap-1.5" style="background:#FFC933;color:#7A4500" aria-label="Misi dan koin">${coin("w-5 h-5")}${coins}</button></div>
<section class="hero rounded-[32px] p-5 pr-36">
  <p class="text-sm font-bold opacity-90">Assalamu’alaikum,</p>
  <h1 class="text-3xl font-black leading-tight">Ahlan, ${esc(U.name)}!</h1>
  <p class="text-sm font-bold mt-2 opacity-90">Iqro ${jl} · Halaman ${pn}</p>
  <div class="h-2 w-full bg-white/25 rounded-full overflow-hidden mt-1.5"><span class="block h-full bg-white rounded-full" style="width:${Math.round(pn/JL[jl].n*100)}%"></span></div>
  <button data-go="reader" class="btn btn-w mt-4 !py-2.5">Lanjutkan ${ic("ar","w-4 h-4")}</button>
  <div class="absolute right-2 bottom-1">${mas("w-32")}</div>
</section>
<section class="${card} mt-4 !p-3 grid grid-cols-2 gap-3 items-center"><div><div class="flex items-center gap-1.5 text-brand mb-1">${ic("target","w-4 h-4")}<b class="text-sm">Target hari ini</b></div><p class="font-black text-xl">${todayMin()} <small class="text-mute text-xs">/ ${goal} menit</small></p>${pb(goalPct())}</div><div class="flex items-center gap-3 border-l border-line pl-3"><span class="w-11 h-11 rounded-2xl grid place-items-center bg-soft" style="color:#FFB72B">${ic("flame","w-6 h-6")}</span><div><b class="block text-xl font-black leading-tight">${streakN()} hari</b><small class="text-mute text-xs font-bold">Streak</small></div></div></section>
${absen()}
<section class="grid grid-cols-2 gap-3 mt-4">
<button data-go="huruf" class="${card} !p-3 text-center"><span class="w-12 h-12 mx-auto rounded-2xl grid place-items-center bg-soft text-brand"><span class="ar text-[32px] leading-none pt-1">ق</span></span><b class="block text-sm mt-2">Huruf</b></button>
<button data-go="daily" class="${card} !p-3 text-center"><span class="block w-12 mx-auto">${fe("wrapped-gift","w-12 h-12")}</span><b class="block text-sm mt-1">Misi</b>${claimed?"":`<small class="text-brand text-[11px] font-black">+5 hari ini</small>`}</button>
</section>
${gamesHome()}`;
V.books=()=>`
<h1 class="text-3xl font-black">Iqro</h1><p class="text-mute text-sm mb-4">Sedikit demi sedikit, menjadi kebiasaan.</p>
<div dir="ltr" class="hs mb-4">
<button data-go="huruf" class="${card} !w-[88%] shrink-0 flex items-center gap-4 text-left">
  <div dir="rtl" class="grid grid-cols-3 gap-1 shrink-0">${[0,1,2,3,4,5].map(i=>`<span class="tile ar rounded-lg w-9 h-9 grid place-items-center text-2xl" style="--h:${i*60}">${L[[1,2,3,4,5,6][i]][0]}</span>`).join("")}</div>
  <div class="flex-1"><b>30 huruf hijaiyah</b><p class="text-mute text-xs">Kenali tiap huruf dan dengarkan bunyinya.</p></div><span class="text-brand">${ic("cr")}</span></button>
<button data-go="harakat" class="${card} !w-[88%] shrink-0 flex items-center gap-4 text-left">
  <div dir="ltr" class="grid grid-cols-3 gap-1 shrink-0">${[0,1,2,3,6,7].map(k=>`<span class="tile ar rounded-lg w-9 h-9 grid place-items-center text-2xl" style="--h:${k*45+20}">${"\u0628"+HK[k][1]}</span>`).join("")}</div>
  <div class="flex-1"><b>Harakat</b><p class="text-mute text-xs">Fathah, kasrah, dhammah, tanwin, sukun, dan tasydid.</p></div><span class="text-brand">${ic("cr")}</span></button>
${tjCard()}</div>
${bmList()}<h2 class="font-bold text-lg mb-3">Pilih jilid</h2><div class="grid grid-cols-2 gap-3">${[1,2,3,4,5,6].map(cover).join("")}</div>`;
V.huruf=()=>`
<h1 class="text-3xl font-black">Huruf hijaiyah</h1><p class="text-mute text-sm mb-4">Setiap huruf punya warna sendiri. Ketuk untuk mendengar.</p>
<div class="tile rounded-[32px] p-4 text-center mb-4" style="--h:${sel*12}"><div class="ar text-[104px] leading-[2] pt-3 pb-1">${L[sel][0]}</div><div class="text-xl font-extrabold mt-2 mb-1">${L[sel][1]}</div></div>
<div dir="rtl" class="grid grid-cols-5 gap-2">${L.map((_,i)=>tileH(i)).join("")}</div>`;
V.harakat=()=>{const h=HK[hk];return `
<h1 class="text-3xl font-black">Harakat</h1><p class="text-mute text-sm mb-4">Tanda yang mengubah bunyi huruf. Ketuk untuk mendengar.</p>
<div id="hktab" dir="ltr" class="hs !mt-0 mb-2" role="tablist">${HK.map((h,k)=>`<button role="tab" aria-selected="${k===hk}" data-hk="${k}" class="${k===hk?"on bg-brand text-on shadow-[0_3px_0_var(--bd)]":"bg-soft text-brand"} shrink-0 h-10 px-4 rounded-full font-black text-sm">${h[0]}</button>`).join("")}</div>
<div class="tile rounded-[32px] p-4 text-center mb-4" style="--h:${hkH(hk)}"><div class="ar text-[104px] leading-[2] pt-3 pb-1" dir="ltr">${"\u0628"+h[1]}</div><div class="text-xl font-extrabold mt-2">${h[0]} · “${h[2]}”</div><p class="text-sm font-bold opacity-90 mt-1">${h[3]}</p></div>
<h2 class="font-bold text-lg mb-3">Contoh bacaan</h2>
<div dir="rtl" class="grid grid-cols-3 gap-2">${[0,1,2,3,4,5].map(i=>{const e=hkEx(hk,i);return `<button data-hx="${i}" dir="ltr" class="tile rounded-[20px] h-[104px] w-full flex flex-col items-center justify-center gap-1" style="--h:${i*60}"><span class="ar text-[38px] leading-[1.9] h-[3.6rem] w-full grid place-items-center overflow-visible">${e[0]}</span><span class="text-xs font-extrabold opacity-80 leading-none">${e[1]}</span></button>`}).join("")}</div>`};
V.bookdetail=()=>{const o=JL[jl],h=CVH[jl-1],vis=o.ok?Array.from({length:o.n},(_,i)=>iqDN[jl+"-"+(i+1)]).filter(Boolean).length:0;return `
<section class="cv rounded-3xl p-5" style="background:linear-gradient(145deg,hsl(${h} 62% 58%),hsl(${h} 62% 36%))"><p class="text-sm opacity-80">Jilid ${jl}</p><h1 class="text-3xl font-extrabold">Iqro ${jl}</h1><p class="text-sm opacity-80 mb-3">${o.ok?`${vis} dari ${o.n} halaman sudah dibuka`:"Segera hadir"}</p>
<div class="h-2 bg-white/25 rounded-full overflow-hidden"><span class="block h-full bg-white rounded-full" style="width:${o.ok?Math.round(vis/o.n*100):0}%"></span></div></section>
${o.ok?`${jqCard()}<h2 class="font-bold text-lg mt-6 mb-3">Pilih halaman</h2><div class="grid grid-cols-6 gap-2">${Array.from({length:o.n},(_,i)=>`<button data-pg="${i+1}" class="h-11 rounded-xl font-black text-sm ${iqDN[jl+"-"+(i+1)]?"bg-brand text-on":"bg-soft text-brand"}">${i+1}${iqQZ["p"+jl+"-"+(i+1)]?`<small class="block text-[9px] leading-none" style="color:#FFC933">★${iqQZ["p"+jl+"-"+(i+1)].s}</small>`:""}</button>`).join("")}</div>`:`<section class="${card} mt-6 text-center"><b>Data belum tersedia</b><p class="text-mute text-sm mt-1">Iqro ${jl} belum tersedia.</p><button data-go="tajwid" class="btn mt-3 !py-2">Pelajari tanda baca dulu</button></section>`}`};
V.reader=()=>{loadPg(jl,pn);const p=curPg(),st=IQ[jl+"-"+pn],n=JL[jl].n;
if(p){iqDN[jl+"-"+pn]=1;persist();loadPg(jl,pn+1,1)}
const head=`<div class="flex items-center justify-between gap-2 mb-2"><button data-act="pick" class="${chip} bg-soft text-brand inline-flex items-center gap-1">Iqro ${jl} · Hal ${pn}/${n}${ic("cd","w-3.5 h-3.5")}</button><div class="flex items-center gap-2"><button class="ib" data-act="st" aria-label="Pengaturan baca">${ic("sl")}</button><button class="ib" data-act="fs" aria-label="${fsOn?"Keluar layar penuh":"Layar penuh"}">${ic(fsOn?"fx":"fs")}</button><button class="ib" data-act="bm" aria-label="Bookmark"${iqBM[jl+"-"+pn]?' style="color:var(--brand);background:var(--soft)"':""}>${ic("bm")}</button></div></div><div dir="rtl" class="mb-3">${pb(pn/n*100)}</div>`;
let body;
if(p){const SZ=[["text-[26px]","text-[32px]","text-[40px]"],["text-[30px]","text-[38px]","text-[46px]"],["text-[34px]","text-[42px]","text-[50px]"]],sz=k=>SZ[fsOn?Math.min(fz+1,2):fz][k>=3?0:k===2?1:2];
body=`<section class="pp ${useColor?"":"nc"}" style="--jh:${CVH[jl-1]}">${fsOn?'<div class="tbar"><button data-act="pick" class="pkb" aria-label="Pilih jilid dan halaman">':'<button data-act="pick" class="tbar" aria-label="Pilih jilid dan halaman">'}<span class="a">IQRO' ${jl}</span><span class="b"><b>${pn}</b><span class="ar text-xl leading-none">${toAr(pn)}</span>${ic("cd","w-4 h-4")}</span>${fsOn?`</button><button data-act="fs" class="fsx2" aria-label="Tutup layar penuh">${ic("xc")}</button></div>`:"</button>"}
<div class="p-2.5 flex flex-col gap-2">
${(()=>{const nz=x=>String(x||"").replace(/\s+/g,""),r0=rowsOf(p)[0]||[],t=nz(p.topic&&p.topic.arab);return t&&!(r0.length&&(nz(r0.map(c=>c.arabic).join(""))===t||r0.some(c=>nz(c.arabic)===t)))})()?`<div dir="rtl" class="band bdt py-0 text-center"><span class="ar inline-flex gap-3 text-[42px] leading-[1.2] pt-4">${p.topic.arab.split(/\s+/).map(lt).join("")}</span></div>`:""}
${rowsOf(p).map(r=>`<div dir="rtl" class="grid gap-2" style="grid-template-columns:repeat(${r.length},1fr)">${r.map(c=>cellH(c,sz(r.length))).join("")}</div>`).join("")}
</div><div class="foot"><span>${p.level_title}</span><b>${pn}</b><span class="ar text-base">${toAr(pn)}</span></div></section>
${fsOn?"":`<section class="hero rounded-[28px] p-4 mt-4 flex items-center gap-3"><button data-act="play" class="w-14 h-14 rounded-full bg-white text-brand grid place-items-center shrink-0 shadow-[0_5px_0_#BFE6B5]" aria-label="${play?"Berhenti":"Baca otomatis"}">${ic(play?"pause":"play")}</button><div class="flex-1"><b class="text-sm">${play?"Sedang membaca…":"Baca otomatis"}</b><p class="text-xs font-bold opacity-90">Tiap bacaan disorot satu per satu</p></div><button data-act="spd" class="px-3 py-2 rounded-full bg-white/25 text-xs font-black shrink-0">${rs<.5?"Lambat":rs>.7?"Cepat":"Normal"}</button></section>`}
${fsOn?"":qzCard()}
${fsOn?"":`<p class="text-center text-mute text-xs font-bold mt-4">Ketuk bacaan untuk mendengar · Geser ke kanan untuk halaman berikutnya</p><p class="text-center text-xs mt-2 text-mute font-semibold">Latihan ini pendamping. Belajar langsung dari guru ngaji tetap yang utama.</p>`}`}
else if(st&&st.s===404)body=`<section class="${card} text-center py-8"><b>Halaman ${pn} belum tersedia</b><p class="text-mute text-sm mt-1 mb-4">Halaman ini tidak ada di jilid ini.</p><button data-act="prev" class="btn !py-2">Ke halaman sebelumnya</button></section>`;
else if(st&&st.s==="net")body=`<section class="${card} text-center py-8"><b>Tidak bisa memuat halaman</b><p class="text-mute text-sm mt-1 mb-4">Periksa koneksi internet, lalu coba lagi.</p><button data-act="retry" class="btn !py-2">Coba lagi</button></section>`;
else body=`<section class="${card} text-center py-10 font-bold text-mute">Memuat halaman…</section>`;
return fsOn?body:head+(p?pet(p):"")+body};
