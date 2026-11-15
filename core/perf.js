/* Kelancaran scroll:
   1) animasi dekoratif (huruf melayang, maskot, kedip) dijeda selama jari menggulir, lalu jalan lagi saat berhenti;
   2) "Mode hemat" (Profil > Tampilan): matikan animasi dekoratif, transisi halaman, dan latar gradasi. Otomatis menyala di HP spesifikasi rendah;
   3) "Uji kelancaran": gulir otomatis Home, Komunitas, dan Reader lalu laporkan FPS dan frame terlama, supaya penyebab jank bisa dicari dengan data. */
(function(){
const root=document.documentElement,lsGet=k=>{try{return localStorage.getItem(k)}catch(e){return null}},lsSet=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const lowEnd=()=>{const m=navigator.deviceMemory,c=navigator.hardwareConcurrency;return (m&&m<=3)||(c&&c<=4)};
let lite=lsGet("iqro_lite");lite=lite===null?lowEnd():lite==="1";
const apply=()=>root.classList.toggle("lite",lite);apply();
/* 1) jeda animasi saat scroll */
let scr=0,tm=0;addEventListener("scroll",()=>{if(!scr){scr=1;root.classList.add("scr")}clearTimeout(tm);tm=setTimeout(()=>{scr=0;root.classList.remove("scr")},160)},{passive:true});
/* 2) tombol di layar Tampilan */
const baseTheme=V.theme;
V.theme=()=>baseTheme()+`
<section class="${card} mt-4 !p-4"><div class="flex items-center justify-between gap-3"><div><b class="block">Mode hemat</b><small class="text-mute text-xs font-semibold">Kurangi animasi dan efek latar supaya scroll lebih ringan.</small></div><button data-act="lite" role="switch" aria-checked="${lite}" aria-label="Mode hemat" class="w-14 h-8 rounded-full ${lite?"bg-brand":"bg-soft"} p-1 shrink-0"><span class="block w-6 h-6 rounded-full bg-white shadow ${lite?"ml-6":""}"></span></button></div></section>
<section class="${card} mt-3 !p-4"><b class="block">Uji kelancaran</b><small class="text-mute text-xs font-semibold block mb-3">Menggulir Home, Komunitas, dan Reader otomatis sekitar 15 detik lalu menampilkan FPS. Jangan sentuh layar selama uji.</small><button data-act="fps" class="btn btn-w w-full" style="border:2px solid var(--line)">Mulai uji</button></section>`;
/* 3) uji kelancaran: gulir otomatis (naik-turun) sambil mencatat waktu tiap frame */
let running=0;const wait=ms=>new Promise(r=>setTimeout(r,ms));
function measure(ms){return new Promise(res=>{const el=document.scrollingElement||document.documentElement;let last=0,t0=0,n=0,worst=0,jank=0,total=0;
 const max=Math.max(0,el.scrollHeight-innerHeight);
 function tick(t){if(!t0){t0=t;last=t;requestAnimationFrame(tick);return}const dt=t-last;last=t;n++;total+=dt;if(dt>worst)worst=dt;if(dt>50)jank++;
  const e=t-t0,pos=max?Math.abs(((e*0.9)%(2*max))-max):0;scrollTo(0,max-pos);
  if(e<ms)requestAnimationFrame(tick);else res({fps:Math.round(n/((t-t0)/1000)),worst:Math.round(worst),jank,max:Math.round(max),avg:+(total/Math.max(n,1)).toFixed(1)})}
 requestAnimationFrame(tick)})}
async function fpsTest(){if(running)return;running=1;const bar=document.createElement("div");bar.className="fpsb";bar.setAttribute("role","status");bar.textContent="Uji kelancaran berjalan… jangan sentuh layar";document.body.appendChild(bar);
 const dur=window.PERF_MS||4000,out=[],keep={jl,pn};
 for(const [s,pre,name] of [["home",null,"Home"],["community",null,"Komunitas"],["reader",()=>{jl=1;pn=12},"Reader (Iqro 1)"]]){
  if(pre)pre();navDir=1;go(s);await wait(700);const r=await measure(dur);out.push([name,r])}
 jl=keep.jl;pn=keep.pn;bar.remove();navDir=-1;go("theme");running=0;
 const ok=out.every(([,r])=>r.max>0);
 const lines=out.map(([n,r])=>esc(n)+": <b>"+(r.max>0?r.fps+" fps":"tidak bisa digulir")+"</b>"+(r.max>0?" · frame terlama "+r.worst+" ms · "+r.jank+" frame tersendat":"")).join("<br>");
 modal({center:1,t:"Hasil uji kelancaran",p:lines+"<br><br><span class=\"text-xs\">Mode hemat: "+(lite?"aktif":"mati")+". 55–60 fps = lancar. Kirim hasil ini kalau scroll masih berat.</span>",b:"Tutup"})}
document.addEventListener("click",e=>{const t=e.target.closest("[data-act=lite],[data-act=fps]");if(!t)return;
 if(t.dataset.act==="lite"){lite=!lite;lsSet("iqro_lite",lite?"1":"0");apply();if(S==="theme")render();toast(lite?"Mode hemat aktif":"Mode hemat mati")}else fpsTest()});
})();
