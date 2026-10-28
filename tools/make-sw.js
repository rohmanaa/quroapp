/* Buat sw.js: daftar semua file aplikasi + versi dari isi file. Jalankan: node tools/make-sw.js
   Jalankan lagi setiap kali ada file yang berubah, supaya pengguna otomatis mendapat versi baru. */
const fs=require("fs"),path=require("path"),crypto=require("crypto");
const root=path.join(__dirname,"..");
const skip=new Set(["tools","node_modules","sw.js","README.md",".git","backup"]);
const files=[];
(function walk(d){for(const n of fs.readdirSync(d).sort()){if(d===root&&skip.has(n))continue;const p=path.join(d,n);fs.statSync(p).isDirectory()?walk(p):files.push(path.relative(root,p).split(path.sep).join("/"))}})(root);
const h=crypto.createHash("sha1");files.forEach(f=>{h.update(f);h.update(fs.readFileSync(path.join(root,f)))});
const version="quro-"+h.digest("hex").slice(0,10);
const shell=["./"].concat(files);
fs.writeFileSync(path.join(root,"sw.js"),fs.readFileSync(path.join(__dirname,"sw.template.js"),"utf8").replace("__VERSION__",version).replace("__SHELL__",JSON.stringify(shell)));
console.log("sw.js dibuat:",version,"-",shell.length,"file");
