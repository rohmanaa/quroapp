/* Buat sw.js: daftar semua file aplikasi + versi dari isi file. Jalankan: node tools/make-sw.js
   Jalankan lagi setiap kali ada file yang berubah, supaya pengguna otomatis mendapat versi baru.
   Nomor versi yang tampil di app (Profil, paling bawah) = 1.<build>. Build naik 1 setiap isi file berubah
   (disimpan di version.json, ditulis ke js/version.js); menjalankan skrip ini berulang tanpa perubahan tidak menaikkannya. */
const fs=require("fs"),path=require("path"),crypto=require("crypto");
const root=path.join(__dirname,"..");
const skip=new Set(["tools","node_modules","sw.js","README.md",".git","backup","version.json"]);
const files=[];
(function walk(d){for(const n of fs.readdirSync(d).sort()){if(d===root&&skip.has(n))continue;const p=path.join(d,n);fs.statSync(p).isDirectory()?walk(p):files.push(path.relative(root,p).split(path.sep).join("/"))}})(root);
/* 1) nomor versi: hash isi file (tanpa js/version.js sendiri) dibanding hash terakhir */
const MON=["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
const vf=path.join(root,"version.json");let vj={major:1,build:0,hash:"",date:""};try{vj=Object.assign(vj,JSON.parse(fs.readFileSync(vf,"utf8")))}catch(e){}
const ch=crypto.createHash("sha1");files.filter(f=>f!=="js/version.js").forEach(f=>{ch.update(f);ch.update(fs.readFileSync(path.join(root,f)))});
const content=ch.digest("hex");
if(content!==vj.hash){const d=new Date(Date.now()+7*36e5);vj.build+=1;vj.hash=content;vj.date=d.getUTCDate()+" "+MON[d.getUTCMonth()]+" "+d.getUTCFullYear()}
fs.writeFileSync(vf,JSON.stringify(vj,null,1)+"\n");
fs.writeFileSync(path.join(root,"js/version.js"),"/* Dibuat otomatis oleh tools/make-sw.js, jangan diedit. */\nconst APP_VERSION=\""+vj.major+"."+vj.build+"\",APP_DATE=\""+vj.date+"\";\n");
if(!files.includes("js/version.js"))files.push("js/version.js"),files.sort();
/* 2) versi cache service worker: hash seluruh file (termasuk js/version.js yang baru) */
const h=crypto.createHash("sha1");files.forEach(f=>{h.update(f);h.update(fs.readFileSync(path.join(root,f)))});
const version="quro-"+h.digest("hex").slice(0,10);
const shell=["./"].concat(files);
fs.writeFileSync(path.join(root,"sw.js"),fs.readFileSync(path.join(__dirname,"sw.template.js"),"utf8").replace("__VERSION__",version).replace("__SHELL__",JSON.stringify(shell)));
console.log("sw.js dibuat:",version,"-",shell.length,"file | versi app v"+vj.major+"."+vj.build+" ("+vj.date+")");
