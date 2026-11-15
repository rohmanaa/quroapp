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


/* ---- Supabase tiruan: /auth/v1 (signup, token, logout) dan /rest/v1 (profiles, progress) ---- */
function startMock(){const st={users:{},byId:{},profiles:{},progress:{},ver:{},interfere:0,writes:0,confirm:false,n:0,log:[]};
 const send=(r,c,b)=>{r.writeHead(c,{"content-type":"application/json","access-control-allow-origin":"*"});r.end(b===undefined?"":JSON.stringify(b))};
 const tok=u=>"tok-"+u.id+"-"+(++st.n),uid=h=>{const m=/^Bearer tok-(.+)-\d+$/.exec(h||"");return m?m[1]:null};
 const resp=u=>({access_token:tok(u),refresh_token:"rt-"+u.id,expires_in:3600,expires_at:Math.floor(Date.now()/1000)+3600,user:{id:u.id,email:u.email,user_metadata:u.meta}});
 const srv=http.createServer((q,r)=>{let b="";q.on("data",d=>b+=d);q.on("end",()=>{
  if(q.method==="OPTIONS"){r.writeHead(204,{"access-control-allow-origin":"*","access-control-allow-headers":"*","access-control-allow-methods":"*"});return r.end()}
  const u=new URL(q.url,"http://x"),p=u.pathname,j=b?JSON.parse(b):{};st.log.push(q.method+" "+p);
  if(!q.headers.apikey)return send(r,401,{message:"No API key"});
  if(p==="/auth/v1/signup"){if(st.users[j.email])return send(r,422,{error_code:"user_already_exists",msg:"User already registered"});
   const x={id:"u"+(Object.keys(st.users).length+1),email:j.email,password:j.password,meta:j.data||{}};st.users[j.email]=x;st.byId[x.id]=x;
   st.profiles[x.id]={name:(x.meta.name||"Pengguna").slice(0,20),gender:x.meta.g||null};
   return st.confirm?send(r,200,{id:x.id,email:x.email}):send(r,200,resp(x))}
  if(p==="/auth/v1/token"){const g=u.searchParams.get("grant_type");
   if(g==="password"){const x=st.users[j.email];return x&&x.password===j.password?send(r,200,resp(x)):send(r,400,{error_code:"invalid_credentials",msg:"Invalid login credentials"})}
   if(g==="refresh_token"){const x=st.byId[String(j.refresh_token).replace("rt-","")];return x?send(r,200,resp(x)):send(r,400,{error_code:"refresh_token_not_found"})}}
  if(p==="/auth/v1/logout")return send(r,204);
  const me=uid(q.headers.authorization);
  if(p.startsWith("/rest/v1/")){if(!me)return send(r,401,{message:"JWT required"});
   if(p==="/rest/v1/profiles"){const id=(u.searchParams.get("id")||"").replace("eq.","");return send(r,200,id===me&&st.profiles[id]?[st.profiles[id]]:[])}
   if(p==="/rest/v1/progress"){const id=(u.searchParams.get("user_id")||"").replace("eq.","");
    if(q.method==="GET")return send(r,200,id===me&&st.progress[id]?[{data:st.progress[id],updated_at:st.ver[id]}]:[]);
    if(q.method==="POST"){if(j.user_id!==me)return send(r,403,{message:"RLS"});if(st.progress[me])return send(r,409,{code:"23505"});st.progress[me]=j.data;st.ver[me]=j.updated_at;st.writes++;return send(r,201)}
    if(q.method==="PATCH"){if(id!==me)return send(r,200,[]);const want=(u.searchParams.get("updated_at")||"").replace("eq.","");
     if(st.interfere>0){st.interfere--;st.progress[me]=Object.assign({},st.progress[me],{iqro_done:JSON.stringify(Object.assign(JSON.parse(st.progress[me].iqro_done||"{}"),{"9-9":1}))});st.ver[me]="2099-01-01T00:00:00.000+00:00"}
     if(want!==st.ver[me])return send(r,200,[]);st.progress[me]=j.data;st.ver[me]=j.updated_at;st.writes++;return send(r,200,[{updated_at:j.updated_at}])}}}
  send(r,404,{message:"tidak ada"})})});
 return new Promise(res=>srv.listen(0,()=>res({st,base:"http://localhost:"+srv.address().port,close:()=>srv.close()})))}

async function boot(base,store={},opt={}){
 const errs=[],vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/Not implemented|Could not parse CSS/.test(e.message))errs.push(e.message)});
 const d=await JSDOM.fromURL(base+"/index.html",{runScripts:"dangerously",resources:"usable",pretendToBeVisual:true,virtualConsole:vc,
  beforeParse(w){w.matchMedia=w.matchMedia||(()=>({matches:false,addEventListener(){},addListener(){}}));w.scrollTo=()=>{};
   w.speechSynthesis={cancel(){},speak(){},getVoices(){return[]}};w.SpeechSynthesisUtterance=function(){};
   if(opt.login!==false){w.localStorage.setItem("iqro_acc",JSON.stringify({name:opt.name||"Uji",g:"L",phone:"081234567"}));w.localStorage.setItem("iqro_ses","1")}
   for(const k in store)w.localStorage.setItem(k,store[k]);
   if(opt.cloud){w.__QURO_CLOUD=opt.cloud;w.fetch=(u,o)=>{o=o||{};const {signal,...r}=o;return opt.offline?Promise.reject(new Error('offline')):fetch(u,r)}}
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

 console.log("3b. Toko maskot: beli, pakai, simpan, tidak 'dikembalikan' saat sinkron");
 {const sp=await boot(base),A=()=>sp.w.document.getElementById("app").innerHTML;
  sp.w.eval("go('shop')");
  ok("toko: layar tampil dengan 14 maskot",/Toko Maskot/.test(A())&&sp.w.eval("SHOP.length")===14&&sp.w.document.querySelectorAll("#app img[src^='assets/mascot/']").length===14);
  ok("toko: awalnya hanya Quro Baca yang dimiliki",sp.w.eval("SH.own.join()")==="utama"&&sp.w.eval("SH.use")==="utama");
  sp.w.eval("coins=100;shopBuy('melambai')");
  ok("toko: beli memotong koin dan memberi barang",sp.w.eval("coins")===80&&sp.w.eval("shopHas('melambai')"));
  ok("toko: pembelian tersimpan (iqro_shop dan koin)",sp.w.localStorage.getItem("iqro_coins")==="80"&&JSON.parse(sp.w.localStorage.getItem("iqro_shop")).spent===20&&JSON.parse(sp.w.localStorage.getItem("iqro_shop")).own.includes("melambai"));
  sp.w.eval("coins=5;shopBuy('iqro6')");
  ok("toko: koin kurang = tidak jadi beli",sp.w.eval("coins")===5&&!sp.w.eval("shopHas('iqro6')"));
  sp.w.eval("coins=80;shopBuy('melambai')");
  ok("toko: tidak bisa beli dua kali",sp.w.eval("coins")===80);
  sp.w.eval("shopUse('iqro6')");ok("toko: tidak bisa memakai yang belum dimiliki",sp.w.eval("SH.use")==="utama");
  sp.w.eval("shopUse('melambai');go('home')");
  ok("toko: maskot pilihan tampil di Home",/assets\/mascot\/melambai\.webp/.test(A()));
  ok("toko: ada kartu Toko di Home",!!sp.w.document.querySelector('#app [data-go="shop"]'));
  ok("toko: tanpa galat",sp.errs.length===0,sp.errs.slice(0,2).join(" | "));sp.w.close();
  const rl=await boot(base,{iqro_coins:"80",iqro_shop:JSON.stringify({own:["utama","melambai","hacker"],use:"melambai",spent:20})});
  ok("toko: dipulihkan saat dibuka lagi (id tak dikenal dibuang)",rl.w.eval("SH.own.join()")==="utama,melambai"&&rl.w.eval("SH.use")==="melambai"&&rl.w.eval("SH.spent")===20);rl.w.close();
  const bd=await boot(base,{iqro_shop:"{rusak"});ok("toko: data rusak diabaikan",bd.w.eval("SH.own.join()")==="utama"&&bd.w.eval("SH.spent")===0);bd.w.close();
  const mw=await boot(base),mg2=(a,b)=>mw.w.eval("CL.merge("+JSON.stringify(a)+","+JSON.stringify(b)+")");
  const own=n=>JSON.stringify({own:["utama","melambai"],use:"utama",spent:n});
  let r1=mg2({iqro_coins:"80",iqro_shop:own(20)},{iqro_coins:"100"});
  ok("sinkron: belanja di HP ini tidak dikembalikan oleh data awan lama",r1.iqro_coins==="80"&&JSON.parse(r1.iqro_shop).spent===20,JSON.stringify(r1));
  let r2=mg2({iqro_coins:"100"},{iqro_coins:"70",iqro_shop:own(30)});
  ok("sinkron: belanja di HP lain memotong koin di sini",r2.iqro_coins==="70"&&JSON.parse(r2.iqro_shop).own.includes("melambai"),JSON.stringify(r2));
  let r3=mg2({iqro_coins:"5"},{iqro_coins:"9"});ok("sinkron: tanpa data toko, aturan lama (koin terbesar)",r3.iqro_coins==="9"&&r3.iqro_shop===undefined);
  let r4=mg2({iqro_coins:"60",iqro_shop:JSON.stringify({own:["utama","senang"],use:"senang",spent:20})},{iqro_coins:"50",iqro_shop:JSON.stringify({own:["utama","iqro2"],use:"iqro2",spent:60})});
  const o4=JSON.parse(r4.iqro_shop);ok("sinkron: dua HP sama-sama belanja = barang digabung, koin tidak negatif",o4.own.join()==="utama,senang,iqro2"&&o4.spent===60&&+r4.iqro_coins===Math.max(60+20,50+60)-60,JSON.stringify(r4));
  mw.w.close();
  {const vm=require("vm"),fs2=require("fs"),pa=require("path"),ctx={TextEncoder,Blob};vm.createContext(ctx);vm.runInContext(fs2.readFileSync(pa.join(__dirname,"..","js","zipstore.js"),"utf8"),ctx);
   const A=[104,105],B=[1,2,3,4,5],buf=Buffer.from(await ctx.zipStore([{n:"a.txt",d:new Uint8Array(A)},{n:"b.webp",d:new Uint8Array(B)}]).arrayBuffer());
   const e=buf.length-22,cnt=buf.readUInt16LE(e+10),cdOff=buf.readUInt32LE(e+16);let p2=cdOff,got=[];
   for(let i=0;i<cnt;i++){const sz=buf.readUInt32LE(p2+24),nl=buf.readUInt16LE(p2+28),lo=buf.readUInt32LE(p2+42),nm=buf.slice(p2+46,p2+46+nl).toString(),dat=buf.slice(lo+30+nl,lo+30+nl+sz);got.push(nm+":"+[...dat].join());p2+=46+nl}
   ok("paket stiker: ZIP valid (isi dan nama berkas utuh)",buf.readUInt32LE(0)===0x04034b50&&buf.readUInt32LE(e)===0x06054b50&&cnt===2&&got.join("|")==="a.txt:104,105|b.webp:1,2,3,4,5",got.join("|"))}
  const pk=await boot(base);let tmsg="";pk.w.eval("shopPack()");await sleep(50);
  ok("paket stiker: kurang dari 3 stiker = ditolak dengan pesan",/minimal 3/.test(pk.w.document.body.textContent)&&!pk.errs.length);pk.w.close();}
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


 console.log("8. Akun email + sinkronisasi (Supabase tiruan)");
 const mk=await startMock(),CFG={url:mk.base,key:"sb_publishable_tes"};
 const spy=async x=>{await x.w.eval("window.__t=[];(function(){const o=toast;toast=function(t){window.__t.push(String(t));return o(t)}})()");return x};
 const toasts=x=>x.w.eval("window.__t.slice()");
 // 8a. layar login memakai email + kata sandi
 let a=await boot(base,{},{login:false,cloud:CFG});
 ok("layar login: kolom email & kata sandi (bukan nomor HP)",a.w.eval("S")==="login"&&!!a.w.document.getElementById("fe")&&!!a.w.document.getElementById("fw")&&!a.w.document.getElementById("fp"));
 a.w.close();
 const off=await boot(base,{},{login:false,cloud:{url:"",key:""}});
 ok("tanpa konfigurasi: kembali ke mode lama (nomor HP)",!!off.w.document.getElementById("fp")&&!off.w.document.getElementById("fe"));off.w.close();
 // 8b. fungsi gabung
 const M=a=>JSON.parse(JSON.stringify(a));const W=await boot(base,{},{cloud:CFG});
 const mg=(l,c)=>M(W.w.eval(`CL.merge(${JSON.stringify(l)},${JSON.stringify(c)})`));
 let m=mg({iqro_done:'{"1-1":1}',iqro_coins:"50"},{iqro_done:'{"1-2":1}',iqro_coins:"130"});
 ok("gabung: halaman selesai = gabungan, koin = terbesar",m.iqro_done==='{"1-1":1,"1-2":1}'&&m.iqro_coins==="130");
 m=mg({iqro_quiz:'{"p1-1":{"s":1}}',iqro_time:'{"2026-11-01":30}'},{iqro_quiz:'{"p1-1":{"s":3}}',iqro_time:'{"2026-11-01":90}'});
 ok("gabung: bintang & waktu belajar ambil yang terbesar",JSON.parse(m.iqro_quiz)["p1-1"].s===3&&JSON.parse(m.iqro_time)["2026-11-01"]===90);
 m=mg({iqro_absen:'{"c":2,"d":"2026-11-09"}'},{iqro_absen:'{"c":3,"d":"2026-11-10"}'});
 ok("gabung: absen ambil tanggal terbaru",JSON.parse(m.iqro_absen).d==="2026-11-10");
 m=mg({iqro_last:'{"j":1,"p":5}',iqro_set:'{"z":2}'},{iqro_last:'{"j":1,"p":9}',iqro_set:'{"z":0}'});
 ok("gabung: posisi baca & pengaturan milik perangkat ini",JSON.parse(m.iqro_last).p===5&&JSON.parse(m.iqro_set).z===2);
 m=mg({},{iqro_done:'{"1-3":1}'});ok("gabung: data awan masuk ke perangkat kosong",m.iqro_done==='{"1-3":1}');
 W.w.close();
 // 8c. daftar (tamu punya progres -> naik ke awan)
 let u1=await spy(await boot(base,{iqro_done:'{"1-1":1,"1-2":1}',iqro_coins:"200"},{cloud:CFG}));
 u1.w.eval('go("reg");G="P"');
 await u1.w.eval('CL.doRegister("Siti","Siti@Mail.id","katasandi1")');await sleep(600);
 const A=JSON.parse(u1.w.localStorage.getItem("iqro_acc")||"null")||{};
 ok("daftar: masuk ke home sebagai Siti",u1.w.eval("S")==="home"&&u1.w.eval("U&&U.name")==="Siti");
 ok("daftar: akun tersimpan dengan email, tanpa nomor HP",A.email==="siti@mail.id"&&A.cloud===1&&!("phone" in A));
 ok("daftar: sesi tersimpan",!!u1.w.localStorage.getItem("quro_sb")&&!!u1.w.localStorage.getItem("quro_owner"));
 ok("daftar: profil dibuat di server (nama, jenis kelamin)",JSON.stringify(mk.st.profiles.u1)===JSON.stringify({name:"Siti",gender:"P"}));
 const up=mk.st.progress.u1||{};
 ok("daftar: progres tamu naik ke awan",up.iqro_done==='{"1-1":1,"1-2":1}'&&up.iqro_coins==="200");
 // 8d. ubah koin lalu kirim cepat (flush)
 u1.w.eval("coins=345");u1.w.eval("CL.flush()");await sleep(300);
 ok("flush: koin terbaru terkirim",(mk.st.progress.u1||{}).iqro_coins==="345");
 // 8e. masuk di HP lain: data awan turun
 let u2=await spy(await boot(base,{},{login:false,cloud:CFG}));
 await u2.w.eval('CL.doLogin("siti@mail.id","katasandi1")');await sleep(800);
 ok("masuk di HP baru: nama dari profil server",u2.w.eval("U&&U.name")==="Siti");
 ok("masuk di HP baru: progres dari awan turun",u2.w.localStorage.getItem("iqro_done")==='{"1-1":1,"1-2":1}'&&u2.w.localStorage.getItem("iqro_coins")==="345");
 // 8f. salah kata sandi / email terdaftar / offline
 await u2.w.eval('CL.doLogin("siti@mail.id","salah-banget")');
 ok("kata sandi salah: pesan jelas",(await toasts(u2)).some(t=>/belum tepat/.test(t)));
 u2.w.eval('G="L"');await u2.w.eval('CL.doRegister("Dobel","siti@mail.id","katasandi1")');
 ok("daftar email yang sudah ada: ditolak dengan pesan",(await toasts(u2)).some(t=>/sudah terdaftar/.test(t)));
 await u2.w.eval('CL.doRegister("X","bukan-email","katasandi1")');await u2.w.eval('CL.doRegister("X","a@b.id","pendek")');
 const tt=await toasts(u2);ok("validasi: email salah & kata sandi pendek ditolak sebelum kirim",tt.some(t=>/Email belum benar/.test(t))&&tt.some(t=>/minimal 8/.test(t)));
 const nb=mk.st.log.length;u2.w.eval("window.__t=[]");
 const ofl=await spy(await boot(base,{},{login:false,cloud:CFG,offline:true}));
 await ofl.w.eval('CL.doLogin("siti@mail.id","katasandi1")');
 ok("offline: pesan 'tidak bisa terhubung', tidak masuk",(await toasts(ofl)).some(t=>/Tidak bisa terhubung/.test(t))&&ofl.w.eval("U")===null);ofl.w.close();
 // 8g. akun lain di HP yang sama: progres tidak tercampur
 const sh=await spy(await boot(base,{quro_owner:"u1",iqro_done:'{"1-9":1}',iqro_coins:"999"},{login:false,cloud:CFG}));
 sh.w.eval('G="L"');await sh.w.eval('CL.doRegister("Budi","budi@mail.id","katasandi2")');await sleep(700);
 ok("akun beda di HP yang sama: progres akun lama dibuang",sh.w.localStorage.getItem("iqro_done")!=='{"1-9":1}'&&!(mk.st.progress.u2&&mk.st.progress.u2.iqro_done==='{"1-9":1}'),sh.w.localStorage.getItem("iqro_done"));sh.w.close();
 // 8h. keluar: progres terkirim, data HP dibersihkan
 u2.w.eval("coins=400");await u2.w.eval("CL.doLogout()");await sleep(300);
 ok("keluar: progres terakhir terkirim ke awan",(mk.st.progress.u1||{}).iqro_coins==="400");
 ok("keluar: data akun & progres di HP dibersihkan",["iqro_acc","iqro_ses","quro_sb","quro_owner","iqro_done","iqro_coins"].every(k=>u2.w.localStorage.getItem(k)===null));

 // 8h2. tabrakan penulisan: HP lain menyimpan di tengah jalan -> baca ulang, gabung, tidak ada yang hilang
 let cx=await boot(base,{},{login:false,cloud:CFG});cx.w.eval('G="L"');await cx.w.eval('CL.doLogin("siti@mail.id","katasandi1")');await sleep(700);
 mk.st.interfere=1;cx.w.localStorage.setItem("iqro_done",'{"1-1":1,"1-2":1,"1-7":1}');const w0=mk.st.writes;
 const sy=await cx.w.eval("CL.sync({})");const dn=JSON.parse((mk.st.progress.u1||{}).iqro_done||"{}");
 ok("tabrakan: hasil akhir berisi data kedua HP (halaman 9-9 dari HP lain dan 1-7 dari sini)",!!sy.ok&&dn["9-9"]===1&&dn["1-7"]===1&&dn["1-1"]===1,JSON.stringify(dn)+" "+JSON.stringify(sy));
 // flush dari HP yang data awannya sudah usang tidak boleh menimpa
 mk.st.progress.u1=Object.assign({},mk.st.progress.u1,{iqro_done:'{"1-1":1,"1-2":1,"1-7":1,"9-9":1,"3-3":1}'});mk.st.ver.u1="2099-02-02T00:00:00.000+00:00";
 cx.w.localStorage.setItem("iqro_done",'{"1-1":1,"1-2":1,"1-7":1,"9-9":1,"4-4":1}');cx.w.eval("CL.flush()");await sleep(300);
 ok("flush usang: tidak menimpa data HP lain",JSON.parse(mk.st.progress.u1.iqro_done)["3-3"]===1);
 cx.w.close();
 // 8i. konfirmasi email aktif: tidak langsung masuk
 mk.st.confirm=true;const cf=await spy(await boot(base,{},{login:false,cloud:CFG}));cf.w.eval('G="L"');
 await cf.w.eval('CL.doRegister("Ani","ani@mail.id","katasandi3")');await sleep(150);
 ok("konfirmasi email: muncul 'Cek emailmu', belum ada sesi",/Cek emailmu/.test(cf.w.document.getElementById("m").innerHTML)&&!cf.w.localStorage.getItem("quro_sb")&&cf.w.eval("U")===null);cf.w.close();
 // 8j. kunci rahasia tidak ada di kode
 const cfg=fs.readFileSync(path.join(ROOT,"js/cloud-config.js"),"utf8").replace(/\/\*[\s\S]*?\*\//g,"");
 ok("konfigurasi hanya berisi kunci publishable (bukan secret/service_role)",/sb_publishable_/.test(cfg)&&!/sb_secret_|service_role|eyJ[A-Za-z0-9_-]{20,}/.test(cfg));
 [u1,u2].forEach(x=>x.w.close());mk.close();
 w.close();srv.close();
 console.log("\n"+(fail?"GAGAL: ":"LOLOS: ")+pass+" lulus, "+fail+" gagal");process.exit(fail?1:0)
})().catch(e=>{console.error(e);process.exit(1)});
