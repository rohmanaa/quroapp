/* Cadangkan & pulihkan progres (file JSON), laporan salah tulis materi, dan penyimpanan koin.
   Semua data ada di perangkat (localStorage); file cadangan membuatnya aman dari hapus data situs / ganti HP. */
(function(){
const KEYS=["iqro_acc","iqro_th","iqro_set","iqro_last","iqro_lastj","iqro_done","iqro_quiz","iqro_posts","iqro_time","iqro_goal","iqro_gmsg","iqro_bm","iqro_coins","iqro_reports"];
const lsGet=k=>{try{return localStorage.getItem(k)}catch(e){return null}},lsSet=(k,v)=>{try{localStorage.setItem(k,v);return true}catch(e){return false}};
/* ---- koin: sebelumnya hilang tiap app ditutup, sekarang disimpan ---- */
try{const c=lsGet("iqro_coins");if(c!==null&&/^\d{1,7}$/.test(c))coins=+c}catch(e){}
const saveCoins=()=>lsSet("iqro_coins",String(Math.max(0,Math.floor(coins)||0)));
addEventListener("pagehide",saveCoins);document.addEventListener("visibilitychange",()=>{if(document.hidden)saveCoins()});setInterval(saveCoins,15000);
/* ---- laporan salah tulis ---- */
const reports=()=>{try{const a=JSON.parse(lsGet("iqro_reports"));return Array.isArray(a)?a.filter(x=>isO(x)&&typeof x.t==="string"):[]}catch(e){return[]}};
const repText=()=>reports().map(r=>"Iqro "+r.j+" hal "+r.p+": "+r.t).join("\n");
/* ---- layar Cadangkan & pulihkan ---- */
V.backup=()=>{const n=reports().length;return `
<div class="flex items-center gap-3 mb-4"><div><h1 class="text-3xl font-black">Cadangkan & pulihkan</h1><p class="text-mute text-xs font-bold">Simpan progresmu ke file supaya tidak hilang.</p></div></div>
<section class="${card} !p-4"><div class="flex items-center gap-3 mb-3"><span class="w-12 h-12 rounded-2xl bg-soft text-brand grid place-items-center shrink-0">${ic("bm","w-6 h-6")}</span><div><b class="block">Simpan cadangan</b><small class="text-mute text-xs font-semibold">Progres Iqro, bintang kuis, streak, bookmark, koin, dan pengaturan.</small></div></div><button data-act="bk_exp" class="btn w-full">Simpan ke file</button></section>
<section class="${card} mt-3 !p-4"><div class="flex items-center gap-3 mb-3"><span class="w-12 h-12 rounded-2xl bg-soft text-brand grid place-items-center shrink-0">${ic("ar","w-6 h-6")}</span><div><b class="block">Pulihkan dari file</b><small class="text-mute text-xs font-semibold">Untuk HP baru atau setelah data situs terhapus.</small></div></div><button data-act="bk_imp" class="btn btn-w w-full" style="border:2px solid var(--line)">Pilih file cadangan</button><input id="bkf" type="file" accept=".json,application/json" class="hidden"></section>
<section class="${card} mt-3 !p-4"><div class="flex items-center gap-3 mb-3"><span class="w-12 h-12 rounded-2xl bg-soft text-brand grid place-items-center shrink-0">${ic("info","w-6 h-6")}</span><div><b class="block">Laporan salah tulis (${n})</b><small class="text-mute text-xs font-semibold">Dari tombol "Lapor" di halaman Iqro. Salin lalu kirim ke pengelola materi.</small></div></div><div class="flex gap-3"><button data-act="bk_rcopy" class="btn flex-1 ${n?"":"opacity-50"}">Salin</button><button data-act="bk_rclear" class="btn btn-w flex-1 ${n?"":"opacity-50"}" style="border:2px solid var(--line)">Hapus</button></div></section>
<p class="text-[11px] text-mute font-semibold mt-3 leading-relaxed">Data hanya tersimpan di perangkat ini. Menghapus data situs atau berganti HP akan menghilangkan progres, jadi simpan cadangan sesekali. File berisi nama dan nomor HP yang kamu daftarkan, simpan baik-baik.</p>`};
B.backup="profile";
/* ---- ekspor ---- */
function exportBackup(){saveCoins();const data={};KEYS.forEach(k=>{const v=lsGet(k);if(v!==null)data[k]=v});
 const j=JSON.stringify({app:"quro",v:1,at:new Date().toISOString(),data},null,1),u=URL.createObjectURL(new Blob([j],{type:"application/json"})),a=document.createElement("a");
 a.href=u;a.download="quro-cadangan-"+dk()+".json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);toast("Cadangan disimpan")}
/* ---- impor: cek bentuk tiap kunci sebelum menulis apa pun ---- */
const J=s=>{try{return JSON.parse(s)}catch(e){return undefined}};
const CHK={iqro_acc:s=>{const v=J(s);return isO(v)&&typeof v.name==="string"&&v.name.length>0&&v.name.length<=20},
 iqro_th:s=>["light","dark","system"].includes(s),iqro_set:s=>isO(J(s)),iqro_last:s=>{const v=J(s);return isO(v)&&Number.isInteger(v.j)&&v.j>=1&&v.j<=6},
 iqro_lastj:s=>isO(J(s)),iqro_done:s=>isO(J(s)),iqro_quiz:s=>isO(J(s)),iqro_time:s=>isO(J(s)),iqro_bm:s=>isO(J(s)),
 iqro_posts:s=>{const v=J(s);return Array.isArray(v)&&v.length<=500&&v.every(x=>isO(x)&&typeof x.n==="string")},
 iqro_goal:s=>/^\d{1,3}$/.test(s),iqro_gmsg:s=>typeof s==="string"&&s.length<=200,iqro_coins:s=>/^\d{1,7}$/.test(s),
 iqro_reports:s=>{const v=J(s);return Array.isArray(v)&&v.length<=300&&v.every(x=>isO(x)&&typeof x.t==="string")}};
function importFile(f){if(!f)return;if(f.size>2e6)return toast("File terlalu besar");const r=new FileReader();
 r.onerror=()=>toast("File tidak bisa dibaca");
 r.onload=()=>{const o=J(String(r.result));if(!isO(o)||o.app!=="quro"||!isO(o.data))return toast("Ini bukan file cadangan QURO");
  const d={};for(const k of KEYS){const v=o.data[k];if(typeof v!=="string"||v.length>5e5)continue;if(!CHK[k](v))return toast("Isi cadangan tidak valid ("+k.replace("iqro_","")+")");d[k]=v}
  if(!Object.keys(d).length)return toast("Tidak ada data yang bisa dipulihkan");
  const tgl=typeof o.at==="string"?o.at.slice(0,10):"";
  modal({center:1,t:"Pulihkan progres?",p:"Progres dan pengaturan di perangkat ini akan diganti dengan isi cadangan"+(tgl?" tanggal "+esc(tgl):"")+".",b:"Batal",y:"Ya, pulihkan",ok:()=>{
   for(const k in d)lsSet(k,d[k]);try{sessionStorage.removeItem("quro_scr");sessionStorage.removeItem("quro_y")}catch(e){}location.reload()}})};
 r.readAsText(f)}
/* ---- laporan: dialog kecil dengan kolom teks ---- */
function openReport(){if(document.getElementById("rpt"))return;const w=document.createElement("div");w.id="rpt";w.className="rpt";w.setAttribute("role","dialog");w.setAttribute("aria-modal","true");
 w.innerHTML=`<div class="rpt-b"><b class="text-lg font-black block">Lapor salah tulis</b><p class="text-mute text-xs font-bold mt-1">Iqro ${jl} · halaman ${pn}. Tulis bagian yang salah, mis. "baris 3, kotak 2 seharusnya …".</p><textarea id="rptx" maxlength="200" rows="4" class="rpt-t" placeholder="Apa yang salah?"></textarea><div class="flex gap-3 mt-3"><button data-act="rp_x" class="btn btn-w flex-1" style="border:2px solid var(--line)">Batal</button><button data-act="rp_ok" class="btn flex-1">Simpan</button></div></div>`;
 document.body.appendChild(w);setTimeout(()=>{const t=document.getElementById("rptx");if(t)t.focus()},60)}
const closeReport=()=>{const w=document.getElementById("rpt");if(w)w.remove()};
function saveReport(){const t=document.getElementById("rptx"),s=(t&&t.value||"").replace(/\s+/g," ").trim().slice(0,200);if(s.length<3)return toast("Tulis dulu bagian yang salah");
 const a=reports();a.push({j:jl,p:pn,t:s,at:Date.now()});while(a.length>300)a.shift();lsSet("iqro_reports",JSON.stringify(a));closeReport();toast("Laporan disimpan di HP-mu")}
function copyText(s){if(navigator.clipboard&&navigator.clipboard.writeText)return navigator.clipboard.writeText(s);return Promise.reject()}
document.addEventListener("click",e=>{const t=e.target.closest("[data-act^=bk_],[data-act^=rp_]");if(!t)return;const a=t.dataset.act;
 if(a==="bk_exp")exportBackup();
 else if(a==="bk_imp"){const i=document.getElementById("bkf");if(i)i.click()}
 else if(a==="bk_rcopy"){const s=repText();if(!s)return toast("Belum ada laporan");copyText(s).then(()=>toast("Laporan disalin"),()=>toast("Tidak bisa menyalin di perangkat ini"))}
 else if(a==="bk_rclear"){if(!reports().length)return toast("Belum ada laporan");modal({center:1,t:"Hapus semua laporan?",p:"Laporan yang tersimpan di HP ini akan dihapus.",b:"Batal",y:"Ya, hapus",ok:()=>{lsSet("iqro_reports","[]");if(S==="backup")render()}})}
 else if(a==="rp_open")openReport();else if(a==="rp_x")closeReport();else if(a==="rp_ok")saveReport()});
document.addEventListener("change",e=>{if(e.target&&e.target.id==="bkf"){importFile(e.target.files&&e.target.files[0]);e.target.value=""}});
})();
