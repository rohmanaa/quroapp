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
 const files=["fitur/belajar/data/iqro.js","fitur/belajar/data/pola.js","fitur/belajar/data/latihan.js","fitur/belajar/data/iqro1-buku.js","fitur/belajar/data/iqro-lazy.js","fitur/belajar/data/iqro2-6-buku.js"].filter(f=>fs.existsSync(path.join(R,f)));
 const {JL,IQ,BOOK26_N}=new Function(files.map(f=>fs.readFileSync(path.join(R,f),"utf8")).join("\n")+";return {JL,IQ,BOOK26_N}")();
 for(const j in BOOK26_N)if(JL[j].n!==BOOK26_N[j])bad("iqro-lazy.js: jumlah halaman Iqro "+j+" ("+BOOK26_N[j]+") tidak sama dengan isi buku ("+JL[j].n+")");
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
if(/<script[^>]+iqro2-6-buku\.js/.test(html))bad("index.html memuat iqro2-6-buku.js di awal; harusnya lewat iqro-lazy.js (dimuat belakangan)");
if(!sw.includes("iqro2-6-buku.js"))bad("iqro2-6-buku.js tidak ada di cache offline (butuh untuk mode offline)");
const refs=[...html.matchAll(/<(?:script[^>]*\ssrc|link[^>]*\shref)="([^"#?]+)"/g)].map(m=>m[1]).filter(u=>!/^(https?:)?\/\//.test(u));
refs.forEach(u=>{if(!fs.existsSync(path.join(R,u)))bad("index.html memanggil "+u+" tetapi file tidak ada");else if(!sw.includes(u)&&u!=="sw.js")bad(u+" belum ada di cache offline: jalankan node tools/make-sw.js")});
["games/index.html","games/lobby.js","fitur/pengaturan/backup.js","core/update.js","core/ptr.js"].forEach(u=>{if(fs.existsSync(path.join(R,u))&&!sw.includes(u))bad(u+" belum ada di cache offline: jalankan node tools/make-sw.js")});
console.log("   "+refs.length+" file dirujuk");

/* 3b. fitur yang dimuat belakangan (core/routes.js) */
console.log("3b. Fitur lazy (core/routes.js)");
{const rs=fs.readFileSync(path.join(R,"core/routes.js"),"utf8"),m=rs.match(/const LAZY=(\{[\s\S]*?\});\nconst featDone/);
 if(!m)bad("core/routes.js: tabel LAZY tidak terbaca");else{
 const LAZY=new Function("return "+m[1])(),ALLOW=new Set(["openShareProfileModal","closeShareProfileModal"]);
 const lazyFiles=new Set(Object.values(LAZY).flatMap(f=>[].concat(f.js||[],f.css||[])));
 const walk=d=>fs.readdirSync(path.join(R,d),{withFileTypes:true}).flatMap(e=>e.isDirectory()?(e.name==="node_modules"?[]:walk(d+"/"+e.name)):e.name.endsWith(".js")?[d+"/"+e.name]:[]);
 const eager=[...walk("core"),...walk("fitur")].filter(f=>!lazyFiles.has(f)&&!/\/data\//.test(f)||/iqro-lazy|data\/(letters|harakat|iqro|pola|latihan)\.js/.test(f));
 for(const k in LAZY){const f=LAZY[k],files=[].concat(f.js||[],f.css||[]);
  files.forEach(u=>{if(!fs.existsSync(path.join(R,u)))bad("LAZY."+k+": "+u+" tidak ada");else{if(!sw.includes(u))bad(u+" (lazy) belum ada di cache offline: jalankan node tools/make-sw.js");if(html.includes('"'+u+'"'))bad(u+" ada di LAZY tetapi juga dimuat di index.html")}});
  const src=(f.js||[]).map(u=>fs.existsSync(path.join(R,u))?fs.readFileSync(path.join(R,u),"utf8"):"").join("\n");
  const defined=[...new Set([...src.matchAll(/\bV\.([A-Za-z0-9_]+)\s*=/g)].map(x=>x[1]))].sort(),declared=[...f.screens].sort();
  if(defined.join()!==declared.join())bad("LAZY."+k+": daftar layar ("+declared.join(",")+") tidak sama dengan V.* yang didefinisikan berkasnya ("+defined.join(",")+")");
  const names=new Set([...src.matchAll(/^(?:const|let|var)\s+([A-Za-z_$][\w$]*)/gm),...src.matchAll(/^function\s+([A-Za-z_$][\w$]*)/gm)].map(x=>x[1]));
  for(const e of eager){const t=fs.readFileSync(path.join(R,e),"utf8");for(const n of names){if(ALLOW.has(n))continue;if(new RegExp("(?<![\\w$.])"+n.replace(/\$/g,"\\$")+"(?![\\w$])").test(t))bad("fitur lazy '"+k+"' tidak boleh dipakai kode awal: "+e+" memakai "+n+" (pindahkan ke fitur itu, atau jadikan fitur ini eager)")}}}
 console.log("   "+Object.keys(LAZY).length+" fitur lazy: "+Object.keys(LAZY).join(", "))}}

/* 4. nomor versi konsisten */
console.log("4. Nomor versi");
try{const vj=JSON.parse(fs.readFileSync(path.join(R,"version.json"),"utf8")),vs=fs.readFileSync(path.join(R,"core/version.js"),"utf8"),m=vs.match(/APP_VERSION="([\d.]+)"/);
 if(!m||m[1]!==vj.major+"."+vj.build)bad("core/version.js tidak sama dengan version.json: jalankan node tools/make-sw.js");else console.log("   v"+m[1])}catch(e){bad("version.json / core/version.js tidak terbaca: jalankan node tools/make-sw.js")}

console.log(err?"\nGAGAL: "+err+" masalah"+(warn?", "+warn+" catatan":""):"\nLOLOS"+(warn?" ("+warn+" catatan)":""));
process.exit(err?1:0);
