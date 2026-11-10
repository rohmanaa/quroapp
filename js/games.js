/* Mini game: daftar game + pembungkus. Tiap game berdiri sendiri di games/<folder>/ dan ditanam lewat iframe. */
const GC={build:"Susun",match:"Memori",pick:"Tebak",trace:"Menulis",listen:"Suara",find:"Tebak",next:"Urutan"};
V.games=()=>{const cats=["Semua",...new Set(MG.map(g=>GC[g[0]]||"Lainnya"))],list=MG.map((g,i)=>[g,i]).filter(([g])=>gcat==="Semua"||(GC[g[0]]||"Lainnya")===gcat);
return `<h1 class="text-3xl font-black">Semua Game</h1><p class="text-mute text-sm mb-4">${MG.length} game seru untuk belajar huruf.</p>
<div class="flex gap-2 overflow-x-auto pb-3">${cats.map(c=>`<button data-act="gc" data-c="${c}" class="${chip} shrink-0 !text-xs !px-3 !py-1.5 ${gcat===c?"bg-brand text-on":"bg-soft text-brand"}">${c}</button>`).join("")}</div>
<div class="flex flex-col gap-3">${list.map(([[k,t,d,e,h],i])=>`<button data-go="game" data-gm="${i}" class="tile rounded-[24px] p-3 flex items-center gap-3 text-left" style="--h:${h}"><span class="shrink-0 w-14 h-14 rounded-2xl bg-white/60 grid place-items-center">${fe(e,"w-10 h-10")}</span><span class="flex-1 min-w-0"><b class="block text-base" style="color:var(--ink)">${t}</b><small class="font-bold opacity-80 text-xs block">${d}</small></span><span class="${chip} bg-white/60" style="color:var(--ink)">${GC[k]||"Lainnya"}</span><span style="color:var(--ink)">${ic("cr","w-4 h-4")}</span></button>`).join("")}</div>
<p class="text-center text-mute text-xs font-bold mt-5">Game baru akan ditambahkan di sini.</p>`};
let GM=0;const GD={};
V.game=()=>{const [k,t]=MG[GM];return `<div class="flex items-center justify-between mb-3"><h1 class="text-3xl font-black">${t}</h1><span id="gcoin" class="${chip} bg-soft text-brand inline-flex items-center gap-1">${coin()}${coins}</span></div><iframe id="gf" title="${t}" src="games/${GP[k]}/index.html" class="w-full block" style="border:0;height:70vh;background:transparent"></iframe>`};
/* Pesan dari halaman game (hanya dari iframe #gf): tinggi, toast, suara, menang, keluar */
addEventListener("message",e=>{const f=document.getElementById("gf"),m=e.data;if(!f||e.source!==f.contentWindow||!m||m.quro!==1)return;
 if(m.type==="height"){const h=+m.h;if(h>0)f.style.height=Math.min(h,4000)+"px"}
 else if(m.type==="toast")toast(String(m.t));
 else if(m.type==="say")say(String(m.t));
 else if(m.type==="exit")go("home");
 else if(m.type==="win"){const k=MG[GM][0];let got=0;if(!GD[k]){GD[k]=1;coins+=10;got=1;const c=document.getElementById("gcoin");if(c)c.innerHTML=coin()+coins}
  modal({center:1,t:esc(m.t),p:(got?"+10 koin masuk! ":"")+esc(m.p),stars:3,b:esc(m.b||"Lanjut"),cb:m.again?()=>{try{f.contentWindow.postMessage({quro:1,type:"next"},"*")}catch(x){}}:null})}});
