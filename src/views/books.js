/* Tab Iqro = peta belajar (dunia). Tiap jilid = satu "dunia", tiap halaman = satu level. Materi dasar ada di layar "materi". */
V.books=()=>{if(!JL[jl]||!JL[jl].ok||!jOpen(jl)){jl=1;pn=iqLast[1]||1}
 const o=JL[jl],h=CVH[jl-1],pct=jp(jl);
 return `<section class="cv rounded-[32px] p-4" style="background:linear-gradient(145deg,hsl(${h} 62% 58%),hsl(${h} 62% 34%))">
<div class="flex items-start justify-between gap-2"><div><p class="text-xs font-black opacity-85 tracking-wider">DUNIA ${jl}</p><h1 class="text-3xl font-black leading-tight">Iqro ${jl}</h1><p class="text-xs font-bold opacity-90 mt-0.5">${pct}% · ${o.n} level</p></div>
<div class="flex gap-2"><button data-go="materi" class="px-3 py-2 rounded-full bg-white/25 text-xs font-black">Materi</button><button data-act="pmread" class="ib !w-10 !h-10 !border-0 !shadow-none bg-white/25 text-white" aria-label="Baca halaman">${ic("book")}</button></div></div>
<div class="flex gap-2 mt-4 overflow-x-auto pb-1">${[1,2,3,4,5,6].map(j=>{const lk=!JL[j].ok||!jOpen(j),on=j===jl;return `<button data-act="wd" data-w="${j}" class="w-11 h-11 shrink-0 rounded-full font-black text-base grid place-items-center ${on?"bg-white":"bg-white/25 text-white"}" style="${on?`color:hsl(${CVH[j-1]} 62% 36%);box-shadow:0 4px 0 rgba(0,0,0,.2)`:""}" aria-label="Dunia ${j}">${lk&&!on?ic("lock","w-4 h-4"):j}</button>`}).join("")}</div></section>
<p class="text-mute text-xs font-bold text-center mt-4 mb-2">Selesaikan tiap level (minimal ★${LOCK_MIN}) untuk membuka level berikutnya</p>
${jqCard()}${pathMap(jl)}`};
