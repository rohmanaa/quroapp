/* Tes cepat tanpa dependensi: node tools/test-data.js
   Memeriksa (1) sintaks semua file JS, (2) data Iqro Jilid 1-6, (3) semua file yang dipanggil index.html ada & masuk cache offline (sw.js). */
const fs=require("fs"),path=require("path"),cp=require("child_process");
const R=path.join(__dirname,"..");let err=0,warn=0;
const bad=m=>{err++;console.log("  GAGAL  "+m)},wn=m=>{warn++;console.log("  catatan "+m)};

/* 1. sintaks */
console.log("1. Sintaks JS");
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.name.startsWith(".")||e.name==="node_modules"?[]:e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const js=walk(R).filter(f=>f.endsWith(".js")&&!f.endsWith(".min.js"));
js.forEach(f=>{try{cp.execFileSync(process.execPath,["--check",f],{stdio:"pipe"})}catch(e){bad("sintaks "+path.relative(R,f)+": "+String(e.stderr).split("\n").slice(0,3).join(" "))}});
console.log("   "+js.length+" file diperiksa");

/* 2. data Iqro (dimuat seperti browser: iqro.js, pola.js, latihan.js, lalu data buku) */
console.log("2. Data Iqro");
try{
 const files=["data/iqro.js","data/pola.js","data/latihan.js","data/iqro1-buku.js","data/iqro2-6-buku.js"].filter(f=>fs.existsSync(path.join(R,f)));
 const {JL,IQ}=new Function(files.map(f=>fs.readFileSync(path.join(R,f),"utf8")).join("\n")+";return {JL,IQ}")();
 let pages=0,cells=0;
 for(let j=1;j<=6;j++){
  if(!JL[j]||!JL[j].ok){bad("Jilid "+j+" tidak aktif");continue}
  const n=JL[j].n;if(!(n>=1))bad("Jilid "+j+" n tidak valid");
  if(IQ[j+"-"+(n+1)])bad("Jilid "+j+": ada halaman lebih dari n="+n);
  for(let p=1;p<=n;p++){const pg=IQ[j+"-"+p],id="Iqro "+j+" hal "+p;
   if(!pg||!Array.isArray(pg.content)||!pg.content.length){bad(id+": halaman kosong/hilang");continue}
   pages++;const seen=new Set(),ids=new Set();
   for(const c of pg.content){cells++;
    if(!c||typeof c.arabic!=="string"||!c.arabic.trim()){bad(id+": sel Arab kosong");continue}
    if(typeof c.latin!=="string"||!c.latin.trim())bad(id+": sel Latin kosong ("+c.arabic+")");
    if(/[A-Za-z0-9]/.test(c.arabic))bad(id+": huruf Latin/angka di sisi Arab: "+c.arabic);
    const r=c.position&&c.position.row,k=c.position&&c.position.col;
    if(!Number.isInteger(r)||!Number.isInteger(k)||r<1||k<1)bad(id+": posisi tidak valid");
    else{const key=r+","+k;if(seen.has(key))wn(id+": posisi ganda baris "+r+" kolom "+k);seen.add(key)}
    if(ids.has(c.order_id))wn(id+": order_id ganda "+c.order_id);ids.add(c.order_id)}}}
 console.log("   "+pages+" halaman, "+cells+" sel");
}catch(e){bad("data gagal dimuat: "+e.message)}

/* 3. file yang dipakai index.html ada dan masuk cache offline */
console.log("3. index.html dan cache offline (sw.js)");
const html=fs.readFileSync(path.join(R,"index.html"),"utf8"),sw=fs.readFileSync(path.join(R,"sw.js"),"utf8");
const refs=[...html.matchAll(/<(?:script[^>]*\ssrc|link[^>]*\shref)="([^"#?]+)"/g)].map(m=>m[1]).filter(u=>!/^(https?:)?\/\//.test(u));
refs.forEach(u=>{if(!fs.existsSync(path.join(R,u)))bad("index.html memanggil "+u+" tetapi file tidak ada");else if(!sw.includes(u)&&u!=="sw.js")bad(u+" belum ada di cache offline: jalankan node tools/make-sw.js")});
["games/index.html","games/lobby.js","js/backup.js","js/update.js","js/ptr.js"].forEach(u=>{if(fs.existsSync(path.join(R,u))&&!sw.includes(u))bad(u+" belum ada di cache offline: jalankan node tools/make-sw.js")});
console.log("   "+refs.length+" file dirujuk");

/* 4. nomor versi konsisten */
console.log("4. Nomor versi");
try{const vj=JSON.parse(fs.readFileSync(path.join(R,"version.json"),"utf8")),vs=fs.readFileSync(path.join(R,"js/version.js"),"utf8"),m=vs.match(/APP_VERSION="([\d.]+)"/);
 if(!m||m[1]!==vj.major+"."+vj.build)bad("js/version.js tidak sama dengan version.json: jalankan node tools/make-sw.js");else console.log("   v"+m[1])}catch(e){bad("version.json / js/version.js tidak terbaca: jalankan node tools/make-sw.js")}

console.log(err?"\nGAGAL: "+err+" masalah"+(warn?", "+warn+" catatan":""):"\nLOLOS"+(warn?" ("+warn+" catatan)":""));
process.exit(err?1:0);
