/* Tes asap QURO: memuat aplikasi sungguhan di jsdom lewat server statis kecil.
   Jalankan: cd tests && npm install && node smoke.js   (juga dijalankan otomatis oleh GitHub Actions)
   Keterbatasan: jsdom tidak punya layout (ukuran/posisi) dan canvas, jadi tampilan tetap perlu dicek di HP. */
const http=require("http"),fs=require("fs"),path=require("path");
const {JSDOM,VirtualConsole}=require("jsdom");
const ROOT=path.join(__dirname,"..");
const MIME={".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",".webmanifest":"application/manifest+json",".svg":"image/svg+xml",".png":"image/png",".woff2":"font/woff2"};
const srv=http.createServer((q,r)=>{let u=decodeURIComponent(q.url.split("?")[0]);if(u.endsWith("/"))u+="index.html";const f=path.join(ROOT,u);if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);return r.end()}r.writeHead(200,{"content-type":MIME[path.extname(f)]||"application/octet-stream"});fs.createReadStream(f).pipe(r)});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let fail=0,pass=0;const ok=(n,c,extra)=>{if(c)pass++;else{fail++;console.log("  GAGAL  "+n+(extra?" -> "+extra:""))}};
const today=(d=new Date())=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const daysAgo=n=>{const d=new Date();d.setDate(d.getDate()-n);return today(d)};

async function boot(base,store={},opt={}){
 const errs=[],vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/Not implemented|Could not parse CSS/.test(e.message))errs.push(e.message)});
 const d=await JSDOM.fromURL(base+"/index.html",{runScripts:"dangerously",resources:"usable",pretendToBeVisual:true,virtualConsole:vc,
  beforeParse(w){w.matchMedia=w.matchMedia||(()=>({matches:false,addEventListener(){},addListener(){}}));w.scrollTo=()=>{};
   w.speechSynthesis={cancel(){},speak(){},getVoices(){return[]}};w.SpeechSynthesisUtterance=function(){};
   if(opt.login!==false){w.localStorage.setItem("iqro_acc",JSON.stringify({name:opt.name||"Uji",g:"L",phone:"081234567"}));w.localStorage.setItem("iqro_ses","1")}
   for(const k in store)w.localStorage.setItem(k,store[k]);
   w.addEventListener("error",e=>errs.push(e.message))}});
 await sleep(1400);return {w:d.window,errs}}

(async()=>{
 await new Promise(r=>srv.listen(0,r));const base="http://localhost:"+srv.address().port;

 console.log("1. Home");
 let {w,errs}=await boot(base);const app=()=>w.document.getElementById("app");
 ok("masuk ke home",w.eval("S")==="home");
 ok("Absen 7 hari ada di home",/Absen 7 hari/.test(app().innerHTML));
 ok("Lihat semua + 3 kartu game",/Lihat semua/.test(app().innerHTML)&&app().querySelectorAll('[data-go="game"]').length===3);
 ok("tanpa galat saat memuat",errs.length===0,errs.slice(0,2).join(" | "));

 console.log("2. Absen 7 hari (tersimpan)");
 ok("pengguna baru mulai dari 0",w.eval("ci")===0&&w.eval("claimed")===false);
 w.eval('go("daily")');await sleep(80);
 w.document.querySelector('[data-act="claim"]').click();await sleep(80);
 ok("klaim -> 1 hari, sudah diambil",w.eval("ci")===1&&w.eval("claimed")===true);
 ok("tersimpan di localStorage",w.localStorage.getItem("iqro_absen")===JSON.stringify({c:1,d:today()}));
 const c0=w.eval("coins");w.document.querySelector('[data-act="claim"]')&&w.document.querySelector('[data-act="claim"]').click();await sleep(50);
 ok("klaim ganda hari yang sama ditolak",w.eval("coins")===c0&&w.eval("ci")===1);
 for(const [nama,seed,wantC,wantCl] of [
   ["klaim kemarin (3) -> lanjut 3, belum diambil",{c:3,d:daysAgo(1)},3,false],
   ["klaim hari ini (4) -> sudah diambil",{c:4,d:today()},4,true],
   ["bolong 2 hari -> ulang dari 0",{c:5,d:daysAgo(2)},0,false],
   ["siklus 7 selesai kemarin -> mulai lagi 0",{c:7,d:daysAgo(1)},0,false]]){
  const t=await boot(base,{iqro_absen:JSON.stringify(seed)});
  ok(nama,t.w.eval("ci")===wantC&&t.w.eval("claimed")===wantCl,"ci="+t.w.eval("ci")+" claimed="+t.w.eval("claimed"));t.w.close()}
 const bad=await boot(base,{iqro_absen:"{rusak"});ok("data absen rusak diabaikan",bad.w.eval("ci")===0);bad.w.close();

 console.log("3. Koin tersimpan & hadiah game harian");
 w.eval("coins=777");w.dispatchEvent(new w.Event("pagehide"));
 ok("koin disimpan saat pagehide",w.localStorage.getItem("iqro_coins")==="777");
 const cn=await boot(base,{iqro_coins:"555"});ok("koin dipulihkan saat dibuka lagi",cn.w.eval("coins")===555);cn.w.close();
 const gd=await boot(base,{iqro_gd:JSON.stringify({d:today(),k:{"susun-huruf":1}})});ok("gerbang game hari ini dipulihkan",gd.w.eval("GD['susun-huruf']")===1);gd.w.close();
 const gy=await boot(base,{iqro_gd:JSON.stringify({d:daysAgo(1),k:{"susun-huruf":1}})});ok("gerbang game kemarin dibuang",gy.w.eval("GD['susun-huruf']")===undefined);gy.w.close();

 console.log("4. Game: tiap folder memuat dan menggambar");
 const GP=w.eval("GP"),MGk=w.eval("MG.map(g=>g[0])");
 for(let i=0;i<MGk.length;i++){const slug=GP[MGk[i]];
  w.eval(`go("games");GM=${i};go("game")`);await sleep(900);
  const f=w.document.getElementById("gf"),doc=f&&f.contentWindow&&f.contentWindow.document;
  ok("game "+slug+": iframe memuat folder games/"+slug+"/",!!f&&f.getAttribute("src").includes("games/"+slug+"/"));
  ok("game "+slug+": halaman game menggambar isi",!!doc&&doc.getElementById("app")&&doc.getElementById("app").innerHTML.length>80)}

 console.log("5. Tanda baca: contoh tidak menumpuk (regresi grid)");
 for(const t of [0,1,2]){w.eval(`tjTab=${t};go("tajwid")`);await sleep(80);
  const ex=[...w.document.querySelectorAll('[data-act="tjhear"] > .ar')];
  ok("tab "+t+": 6 contoh, satu anak langsung per sel",ex.length===6&&ex.every(e=>e.children.length===1))}

 console.log("6. Semua halaman Iqro dirender tanpa galat");
 const jl=w.eval("JSON.stringify(Object.keys(JL).filter(j=>JL[j].ok).map(j=>[+j,JL[j].n]))");let pages=0,e0=errs.length;
 for(const [j,n] of JSON.parse(jl)){for(let p=1;p<=n;p++){w.eval(`jl=${j};pn=${p};go("reader")`);pages++;
   if(!w.document.querySelector(".pp [data-rf]")&&!w.document.querySelector(".pp"))ok("Iqro "+j+" hal "+p+" tergambar",false)}}
 ok(pages+" halaman Iqro dirender tanpa galat JS",errs.length===e0,errs.slice(e0,e0+2).join(" | "));

 console.log("7. Keamanan: nama pengguna tidak menjalankan HTML");
 const xs=await boot(base,{},{name:"<svg onload=a()>"});
 for(const s of ["home","profile","community","friends","backup"]){try{xs.w.eval(`go("${s}")`)}catch(e){}}
 ok("tidak ada elemen <svg onload> dari nama",!xs.w.document.querySelector("svg[onload]")&&!/<svg onload/i.test(xs.w.document.getElementById("app").innerHTML));
 xs.w.close();

 w.close();srv.close();
 console.log("\n"+(fail?"GAGAL: ":"LOLOS: ")+pass+" lulus, "+fail+" gagal");process.exit(fail?1:0)
})().catch(e=>{console.error(e);process.exit(1)});
