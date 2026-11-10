/* Membuat ikon aplikasi & favicon dari wajah maskot (buku hijau). Jalankan: npm i sharp (sekali, di luar repo) lalu node tools/make-icons.js
   Keluaran: icons/icon-192.png, icon-512.png, icon-maskable-512.png, apple-touch-icon.png, favicon-48.png, favicon.svg */
const fs=require("fs"),path=require("path");let sharp;try{sharp=require("sharp")}catch(e){sharp=require(path.join(process.env.SHARP_DIR||"/tmp/t","node_modules/sharp"))}
const out=p=>path.join(__dirname,"..","icons",p);
/* wajah maskot: sama dengan assets/mascot.js (badan buku saja, tanpa tangan & kaki), koordinat 24..96 x 8..96 */
const FACE=`<rect x="26" y="12" width="72" height="90" rx="13" fill="#2B8F39" opacity=".22"/>
<rect x="26" y="10" width="72" height="88" rx="13" fill="#E8F5E0"/>
<rect x="24" y="8" width="72" height="88" rx="13" fill="#43B649"/>
<rect x="24" y="8" width="14" height="88" rx="7" fill="#2B8F39"/>
<path d="M62 8h12v22l-6-5-6 5z" fill="#FF6B6B"/>
<path d="M50 26a8 8 0 1 0 5 14 6.5 6.5 0 1 1-5-14z" fill="#FFD54A" transform="translate(26 -2) scale(.8)"/>
<circle cx="58" cy="56" r="10" fill="#fff"/><circle cx="60" cy="58" r="5.5" fill="#1E3A2B"/><circle cx="62" cy="55.5" r="2" fill="#fff"/>
<circle cx="82" cy="56" r="10" fill="#fff"/><circle cx="80" cy="58" r="5.5" fill="#1E3A2B"/><circle cx="82" cy="55.5" r="2" fill="#fff"/>
<circle cx="48" cy="72" r="5" fill="#FF9FB0" opacity=".75"/><circle cx="92" cy="72" r="5" fill="#FF9FB0" opacity=".75"/>
<path d="M60 74q10 10 20 0" fill="none" stroke="#1E3A2B" stroke-width="3.5" stroke-linecap="round"/>`;
const BG=`<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6FDF2"/><stop offset="1" stop-color="#C9EDBF"/></linearGradient></defs>`;
/* ikon persegi 120x120: latar mint + wajah di tengah (skala s). rx: sudut membulat (0 = penuh, untuk maskable/iOS) */
const icon=(s,rx)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">${BG}<rect width="120" height="120" rx="${rx}" fill="url(#g)"/><g transform="translate(60 60) scale(${s}) translate(-60 -53)">${FACE}</g></svg>`;
/* favicon: hanya wajah, latar transparan */
const fav=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="21 5 80 100">${FACE}</svg>`;
(async()=>{
 const png=async(svg,size,file)=>sharp(Buffer.from(svg),{density:Math.ceil(72*size/120*4)}).resize(size,size,{fit:"contain",background:{r:0,g:0,b:0,alpha:0}}).png({compressionLevel:9}).toFile(out(file));
 await png(icon(1.12,26),192,"icon-192.png");
 await png(icon(1.12,26),512,"icon-512.png");
 await png(icon(.8,0),512,"icon-maskable-512.png");   /* zona aman maskable: lingkaran 80% */
 await png(icon(.98,0),180,"apple-touch-icon.png");   /* iOS membulatkan sendiri */
 await sharp(Buffer.from(fav),{density:400}).resize(48,48,{fit:"contain",background:{r:0,g:0,b:0,alpha:0}}).png({compressionLevel:9}).toFile(out("favicon-48.png"));
 fs.writeFileSync(out("favicon.svg"),fav+"\n");
 console.log("ikon dibuat: 192, 512, maskable 512, apple-touch 180, favicon 48 + svg")})();
