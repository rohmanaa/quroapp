/* Buat lembar tinjauan materi untuk guru ngaji: node tools/tinjau.js [berkas-keluaran.html]
   Hasilnya satu berkas HTML mandiri (font ikut tertanam), nyaman dibuka di HP atau dicetak. */
const fs=require("fs"),path=require("path");
const root=path.join(__dirname,"..");
const src=["data/iqro.js","data/pola.js","data/latihan.js","js/tajwid.js"].map(f=>fs.readFileSync(path.join(root,f),"utf8")).join("\n");
const {IQ,JL,POLA,tjh}=new Function("console",src+";return{IQ,JL,POLA,tjh}")({warn(){}});
const b64=f=>fs.readFileSync(path.join(root,"assets/fonts",f)).toString("base64");
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;");
const INFO={
 1:["Jilid 1 · Huruf berfathah","Huruf hijaiyah diperkenalkan bertahap, semuanya berfathah. Baris pertama tiap halaman memperlihatkan huruf baru, baris berikutnya latihan acak. Dua halaman terakhir adalah ulangan."],
 2:["Jilid 2 · Kasrah dan dhammah","Huruf berkasrah (halaman 1–4), berdhammah (5–8), lalu campuran fathah, kasrah, dhammah (9–10)."],
 3:["Jilid 3 · Mad (bacaan panjang)","Fathah + alif (hal 1–3), kasrah + ya mati (4–6), dhammah + waw mati (7–9), lalu campuran (10–12). Pola: "+POLA.j3.satu.join(", ")+" lalu campuran "+POLA.j3.campur.join(", ")+"."],
 4:["Jilid 4 · Sukun dan tanwin","Sukun (hal 1–2), fathatain (3–4), kasratain (5–6), dhammatain (7–8), campuran (9–10). Pola sukun: "+POLA.j4.sukun.join(", ")+"; tanwin: "+POLA.j4.tanwin.join(", ")+"."],
 5:["Jilid 5 · Tasydid","Tasydid berfathah (hal 1–2), berkasrah (3–4), berdhammah (5–6), lalu campuran dengan sukun dan tanwin (7–10). Pola: "+POLA.j5.dasar.join(", ")+"."],
 6:["Jilid 6 · Gabungan dan ujian","Semua tanda bercampur; dua halaman terakhir adalah ujian. Pola: "+POLA.j6.join(", ")+"."]
};
let body="";
for(const j of Object.keys(JL)){
  body+=`<section class="jl"><h2>${esc(INFO[j][0])}</h2><p class="ket">${esc(INFO[j][1])}</p>`;
  for(let p=1;p<=JL[j].n;p++){const pg=IQ[j+"-"+p],rows={};
    pg.content.forEach(c=>(rows[c.position.row]=rows[c.position.row]||[]).push(c));
    body+=`<article class="pg"><header><b>Halaman ${p}</b><span>${esc(pg.topic.latin||"")}</span></header><p class="ins">${esc(pg.instruction_id)}</p>`;
    body+=Object.keys(rows).sort((a,b)=>a-b).map(r=>`<div class="row" dir="rtl">${rows[r].sort((a,b)=>a.position.col-b.position.col).map(c=>`<div class="cell"><span class="ar" dir="rtl">${c.arabic.split(" ").map(w=>tjh(w)).join(" ")}</span><small>${esc(c.latin)}</small></div>`).join("")}</div>`).join("");
    body+=`<footer>☐ benar &nbsp;&nbsp; ☐ perlu diubah: ______________________</footer></article>`}
  body+="</section>"}
const html=`<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lembar tinjauan materi QURO</title>
<style>
@font-face{font-family:Amiri;font-weight:700;src:url(data:font/woff2;base64,${b64("amiri-arabic-700-normal.woff2")}) format("woff2");unicode-range:U+0600-06FF,U+0750-077F,U+08A0-08FF,U+200C-200E,U+FB50-FDFF,U+FE70-FEFC}
:root{--tj-tanwin:#D9480F;--tj-tasydid:#8B3FC4;--tj-mad:#0B7BC4}
*{box-sizing:border-box}body{margin:0;background:#F3FBEF;color:#1E3A2B;font:15px/1.5 system-ui,sans-serif}
main{max-width:760px;margin:auto;padding:16px}h1{font-size:24px;margin:8px 0}h2{font-size:20px;margin:28px 0 4px;color:#2B8F39}
.box{background:#fff;border:2px solid #DDEFD5;border-radius:16px;padding:12px 16px;margin:12px 0}.box li{margin:4px 0}
.ket{margin:0 0 12px;color:#4d6a5a}.pg{background:#fff;border:2px solid #DDEFD5;border-radius:16px;padding:12px;margin:12px 0;break-inside:avoid}
.pg header{display:flex;justify-content:space-between;font-weight:800}.pg header span{color:#6F8A7A;font-size:13px}
.ins{margin:4px 0 8px;color:#6F8A7A;font-size:13px}.row{display:flex;gap:6px;margin-bottom:6px}
.cell{flex:1;background:#F3FBEF;border-radius:12px;text-align:center;padding:2px 4px;min-width:0}
.ar{display:block;font-family:Amiri,serif;font-weight:700;font-size:34px;line-height:1.9;overflow-wrap:anywhere}
.cell small{display:block;font-size:11px;color:#6F8A7A;padding-bottom:4px;direction:ltr}
footer{margin-top:8px;font-size:12px;color:#4d6a5a;border-top:1px dashed #DDEFD5;padding-top:6px}
.tj[data-tj=tanwin]{color:var(--tj-tanwin)}.tj[data-tj=tasydid]{color:var(--tj-tasydid)}.tj[data-tj=mad]{color:var(--tj-mad)}
.lg i{display:inline-block;width:10px;height:10px;border-radius:50%;margin:0 4px 0 12px}
@media print{body{background:#fff}.jl{break-before:page}.pg{border-color:#ccc}}
</style></head><body><main>
<h1>Lembar tinjauan materi QURO</h1>
<p>Materi latihan membaca di QURO (Jilid 1–6, ${Object.values(JL).reduce((a,x)=>a+x.n,0)} halaman) dibuat oleh program, bukan disalin dari buku mana pun. Mohon ditinjau sebelum dipakai anak-anak.</p>
<div class="box"><b>Yang mohon dicek</b><ol><li>Tulisan Arab dan harakatnya benar.</li><li>Urutan belajar dari jilid ke jilid sudah wajar.</li><li>Pola kata tidak menyesatkan pemula. Kata buatan boleh tidak bermakna, yang penting bacaannya benar.</li></ol></div>
<div class="box"><b>Arti warna</b><p class="lg"><i style="background:var(--tj-tanwin)"></i>tanwin<i style="background:var(--tj-tasydid)"></i>tasydid<i style="background:var(--tj-mad)"></i>mad (panjang)</p>
<b>Kode pola kata</b><p>S = suku kata biasa (BA) · M = mad panjang (BAA) · T = tanwin di akhir kata (BAN) · D = tasydid (BBA) · K = sukun (huruf mati). Contoh: SMS = QAALA, ST = QALAMUN, SD = RABBI.</p></div>
${body}</main></body></html>`;
const out=process.argv[2]||path.join(__dirname,"tinjau-materi.html");
fs.writeFileSync(out,html);console.log("lembar tinjauan dibuat:",out,Math.round(html.length/1024)+" KB")
