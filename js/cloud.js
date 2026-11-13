/* Akun email + sinkronisasi progres (Supabase), tanpa SDK: hanya fetch ke /auth/v1 dan /rest/v1.
   Offline-first: tanpa konfigurasi / tanpa internet, aplikasi tetap jalan dari data di perangkat (mode tamu).
   Penggabungan data tidak pernah menghapus kemajuan: gabung (union) / ambil yang terbesar, jadi aman dari dua perangkat. */
const CL=(function(){
const C=(typeof QURO_CLOUD!=="undefined"&&QURO_CLOUD)||{},on=!!(C.url&&C.key);
const SK="quro_sb",OWN="quro_owner",LAST="quro_sync_at";
/* kunci yang ikut disinkronkan (bukan tema, laporan, atau postingan komunitas) */
const KEYS=["iqro_done","iqro_quiz","iqro_time","iqro_bm","iqro_coins","iqro_absen","iqro_last","iqro_lastj","iqro_set","iqro_goal","iqro_gmsg"];
const ls=k=>{try{return localStorage.getItem(k)}catch(e){return null}},lss=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}},lsd=k=>{try{localStorage.removeItem(k)}catch(e){}};
const J=s=>{try{return JSON.parse(s)}catch(e){return undefined}};
const O=v=>!!v&&typeof v==="object"&&!Array.isArray(v);
const EM=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
let expired=false;

/* ---------- sesi ---------- */
const sess=()=>{const s=J(ls(SK));return O(s)&&s.access_token&&s.refresh_token&&O(s.user)&&s.user.id?s:null};
const saveSess=r=>{const s={access_token:r.access_token,refresh_token:r.refresh_token,expires_at:r.expires_at||Math.floor(Date.now()/1000)+(r.expires_in||3600),user:{id:r.user.id,email:r.user.email}};lss(SK,JSON.stringify(s));return s};

/* ---------- HTTP ---------- */
async function req(path,o){o=o||{};const ac=new AbortController(),tm=setTimeout(()=>ac.abort(),12000);
 try{const h={apikey:C.key,"content-type":"application/json"};if(o.token)h.authorization="Bearer "+o.token;if(o.prefer)h.prefer=o.prefer;
  const r=await fetch(C.url+path,{method:o.method||"GET",headers:h,body:o.body?JSON.stringify(o.body):undefined,signal:ac.signal,keepalive:!!o.keepalive});
  const t=await r.text();let j=null;if(t){try{j=JSON.parse(t)}catch(e){}}
  return{ok:r.ok,status:r.status,j}}
 catch(e){return{ok:false,status:0,j:null,net:true}}finally{clearTimeout(tm)}}
const msg=r=>{if(r.net)return"Tidak bisa terhubung. Periksa internetmu ya";
 const m=((r.j&&(r.j.msg||r.j.error_description||r.j.message))||"")+" "+((r.j&&(r.j.error_code||r.j.code))||"");
 if(/invalid login|invalid_credentials/i.test(m))return"Email atau kata sandi belum tepat";
 if(/already registered|user_already_exists|email_exists/i.test(m))return"Email ini sudah terdaftar, silakan masuk";
 if(/rate limit|over_email_send_rate_limit|over_request_rate_limit/i.test(m))return"Terlalu sering mencoba. Tunggu sebentar lalu coba lagi";
 if(/weak_password|at least \d+ char/i.test(m))return"Kata sandi terlalu lemah (minimal 8 karakter)";
 if(/not confirmed|email_not_confirmed/i.test(m))return"Email belum dikonfirmasi. Cek kotak masukmu";
 if(/signups? (not allowed|disabled)/i.test(m))return"Pendaftaran sedang ditutup";
 if(/not authorized|email_address_not_authorized/i.test(m))return"Email ini belum bisa dipakai (pengiriman email belum aktif)";
 return"Terjadi masalah ("+(r.status||"?")+"). Coba lagi nanti"};

/* token segar (satu penyegaran sekaligus, karena refresh token berputar) */
let refreshing=null;
function token(){const s=sess();if(!s)return Promise.resolve(null);if(s.expires_at-60>Date.now()/1000)return Promise.resolve(s.access_token);
 if(!refreshing)refreshing=(async()=>{const r=await req("/auth/v1/token?grant_type=refresh_token",{method:"POST",body:{refresh_token:s.refresh_token}});
  if(r.ok&&r.j&&r.j.access_token&&r.j.user)return saveSess(r.j).access_token;
  if([400,401,403].includes(r.status)){lsd(SK);expired=true}return null})().finally(()=>{refreshing=null});
 return refreshing}

/* ---------- penggabungan data (murni, tanpa efek samping) ---------- */
function merge(l,c){const o={},P=k=>J(k),om=(a,b,f)=>{a=O(a)?a:{};b=O(b)?b:{};const r=Object.assign({},a);for(const k in b)r[k]=k in a?f(a[k],b[k]):b[k];return r};
 const pick=(k,fn)=>{const a=l[k]!==undefined?P(l[k]):undefined,b=c[k]!==undefined?P(c[k]):undefined;if(a===undefined&&b===undefined)return;o[k]=JSON.stringify(a===undefined?b:b===undefined?a:fn(a,b))};
 pick("iqro_done",(a,b)=>om(a,b,(x,y)=>x||y));
 pick("iqro_bm",(a,b)=>om(a,b,(x,y)=>x||y));
 pick("iqro_quiz",(a,b)=>om(a,b,(x,y)=>O(x)&&O(y)?((+y.s||0)>(+x.s||0)?y:x):x));
 pick("iqro_time",(a,b)=>om(a,b,(x,y)=>Math.max(+x||0,+y||0)));
 pick("iqro_lastj",(a,b)=>om(a,b,(x,y)=>Math.max(+x||0,+y||0)));
 pick("iqro_absen",(a,b)=>{if(!O(a))return b;if(!O(b))return a;return String(b.d)>String(a.d)||(b.d===a.d&&b.c>a.c)?b:a});
 pick("iqro_last",a=>a);                       /* posisi baca terakhir: milik perangkat ini bila ada */
 ["iqro_set","iqro_goal","iqro_gmsg"].forEach(k=>{const v=l[k]!==undefined?l[k]:c[k];if(v!==undefined)o[k]=v});
 const cl=l.iqro_coins!==undefined||c.iqro_coins!==undefined?Math.max(+l.iqro_coins||0,+c.iqro_coins||0):undefined;if(cl!==undefined)o.iqro_coins=String(cl);
 return o}

/* koin: ambil yang terbesar antara memori dan penyimpanan, agar data lama tidak menimpa data baru */
function snap(){try{const lc=+ls("iqro_coins")||0,mc=typeof coins==="number"?Math.max(0,Math.floor(coins)||0):0,c=Math.max(lc,mc);lss("iqro_coins",String(c));if(typeof coins==="number"&&coins<c)coins=c}catch(e){}
 const d={};KEYS.forEach(k=>{const v=ls(k);if(v!==null)d[k]=v});return d}
/* bentuk baku untuk membandingkan isi (urutan kunci tidak berpengaruh) */
const stab=v=>JSON.stringify(v,(k,x)=>O(x)?Object.keys(x).sort().reduce((r,y)=>(r[y]=x[y],r),{}):x);
const canon=d=>{const r={};KEYS.forEach(k=>{if(d[k]!==undefined){const v=J(d[k]);r[k]=v===undefined?d[k]:v}});return stab(r)};

/* ---------- sinkronisasi ----------
   Menulis ke server hanya bila baris di server belum berubah sejak terakhir dibaca (updated_at sama).
   Kalau sudah berubah (mis. HP lain baru menyimpan), baca ulang, gabung, lalu coba lagi. Jadi tidak ada data yang tertimpa. */
let busy=0,ver=null,seen=false,cloudData={};
async function pull(s,t){const r=await req("/rest/v1/progress?user_id=eq."+s.user.id+"&select=data,updated_at",{token:t});if(!r.ok)return{fail:msg(r)};
 const row=Array.isArray(r.j)&&r.j[0]?r.j[0]:null;ver=row?row.updated_at:null;cloudData=row&&O(row.data)?row.data:{};seen=true;return{cloud:cloudData}}
async function put(s,t,data,keepalive){let nu=new Date().toISOString();if(nu===ver)nu=new Date(Date.now()+1).toISOString();const body={data,updated_at:nu};
 if(ver===null){const r=await req("/rest/v1/progress",{method:"POST",token:t,prefer:"return=minimal",keepalive,body:Object.assign({user_id:s.user.id},body)});
  if(r.ok){ver=nu;cloudData=data;return{ok:1}}return r.status===409?{conflict:1}:{fail:msg(r)}}
 const r=await req("/rest/v1/progress?user_id=eq."+s.user.id+"&updated_at=eq."+encodeURIComponent(ver),{method:"PATCH",token:t,prefer:"return=representation",keepalive,body});
 if(!r.ok)return{fail:msg(r)};
 if(keepalive||(Array.isArray(r.j)&&r.j.length)){ver=Array.isArray(r.j)&&r.j[0]&&r.j[0].updated_at||nu;cloudData=data;return{ok:1}}
 return{conflict:1}}
async function sync(opt){opt=opt||{};if(!on||busy)return{skip:1};const s=sess();if(!s)return{skip:1};busy=1;
 try{const t=await token();if(!t)return{fail:"sesi"};let changed=false;
  for(let k=0;k<4;k++){const p=await pull(s,t);if(p.fail)return p;
   const local=snap(),m=merge(local,p.cloud);KEYS.forEach(x=>{if(m[x]!==undefined&&m[x]!==local[x]){lss(x,m[x]);changed=true}});
   const now=snap();
   if(canon(now)===canon(p.cloud)){lss(LAST,String(Date.now()));return{ok:1,changed}}
   const w=await put(s,t,now,false);if(w.fail)return w;if(w.ok){lss(LAST,String(Date.now()));return{ok:1,changed}}}
  return{fail:"Server sedang sibuk, coba lagi nanti"}}
 finally{busy=0}}
/* kirim cepat saat halaman ditutup: sekali coba, tanpa menunggu; bila server sudah berubah, tidak menimpa (data tetap di HP, digabung saat dibuka lagi) */
function flush(){const s=sess();if(!on||!s||!seen||s.expires_at-30<=Date.now()/1000)return;const now=snap();if(canon(now)===canon(cloudData))return;
 const m=merge(now,cloudData),data={};KEYS.forEach(k=>{if(m[k]!==undefined)data[k]=m[k]});put(s,s.access_token,data,true)}

/* ---------- akun ---------- */
async function finish(j,prof){const s=saveSess(j),t=s.access_token;let name=prof&&prof.name,g=prof&&prof.g;
 if(!name){const p=await req("/rest/v1/profiles?id=eq."+s.user.id+"&select=name,gender",{token:t});if(p.ok&&Array.isArray(p.j)&&p.j[0]){name=p.j[0].name;g=p.j[0].gender||g}}
 if(!name)name=(j.user&&j.user.user_metadata&&j.user.user_metadata.name)||String(s.user.email).split("@")[0];
 /* akun lain di perangkat yang sama: jangan campur progres */
 const own=ls(OWN);let wiped=false;if(own&&own!==s.user.id){KEYS.forEach(lsd);wiped=true}lss(OWN,s.user.id);
 const acc={name:String(name).slice(0,20),g:g==="P"?"P":"L",email:s.user.email,cloud:1};lss("iqro_acc",JSON.stringify(acc));lss("iqro_ses","1");ver=null;seen=false;cloudData={};
 return{acc,wiped}}
async function register(email,password,name,g){const r=await req("/auth/v1/signup",{method:"POST",body:{email,password,data:{name,g}}});if(!r.ok)return{err:msg(r)};
 if(r.j&&r.j.access_token&&r.j.user)return finish(r.j,{name,g});return{confirm:true}}
async function login(email,password){const r=await req("/auth/v1/token?grant_type=password",{method:"POST",body:{email,password}});if(!r.ok)return{err:msg(r)};return finish(r.j)}

const busyUI=b=>{document.querySelectorAll("[data-act=login],[data-act=regdone]").forEach(x=>{x.disabled=b;if(b){x.dataset.t=x.textContent;x.textContent="Memproses…"}else if(x.dataset.t)x.textContent=x.dataset.t})};
let working=0;
async function afterAuth(r,reg,name){U=r.acc;otpC="";try{ses(1)}catch(e){}go("home");
 if(reg)modal({center:1,t:"Yay Barakallah, "+esc(r.acc.name)+"!",p:"Yey Alhamdulillah, akunmu sudah jadi! Progresmu akan tersimpan di awan.",stars:3,b:"Bismillah siap!"});
 const s=await sync({});if(r.wiped||(s&&s.changed))reload()}
function reload(){try{if(sessionStorage.getItem("quro_cl_rl")==="1"){sessionStorage.removeItem("quro_cl_rl");return}sessionStorage.setItem("quro_cl_rl","1")}catch(e){}location.reload()}
async function doLogin(email,pw){email=String(email||"").trim().toLowerCase();if(working)return;if(!EM.test(email))return toast("Email belum benar");if(!pw)return toast("Isi kata sandi dulu");
 working=1;busyUI(true);const r=await login(email,pw);working=0;busyUI(false);if(r.err)return toast(r.err);return afterAuth(r,false)}
async function doRegister(name,email,pw){email=String(email||"").trim().toLowerCase();name=String(name||"").trim();if(working)return;if(!name)return toast("Isi nama panggilan dulu");if(!EM.test(email))return toast("Email belum benar");if(pw.length<8)return toast("Kata sandi minimal 8 karakter");
 working=1;busyUI(true);const r=await register(email,pw,name,G||"L");working=0;busyUI(false);if(r.err)return toast(r.err);
 if(r.confirm){RS=1;go("login");return modal({center:1,t:"Cek emailmu",p:"Kami mengirim tautan konfirmasi ke "+esc(email)+". Setelah dikonfirmasi, masuk dengan email dan kata sandimu.",b:"Oke"})}
 return afterAuth(r,true)}
const signedIn=()=>!!sess();
/* keluar: kirim progres terakhir, lalu bersihkan data perangkat (progres aman di awan) */
async function doLogout(force){const s=sess();if(s){if(!force){const r=await sync({});if(r&&r.fail){return modal({center:1,t:"Belum tersinkron",p:"Progres terbaru belum terkirim ("+esc(String(r.fail))+"). Kalau keluar sekarang, progres yang belum terkirim akan hilang dari HP ini.",b:"Batal",y:"Tetap keluar",ok:()=>doLogout(true)})}}
  const t=await token();if(t)req("/auth/v1/logout",{method:"POST",token:t})}
 KEYS.forEach(lsd);[SK,OWN,LAST,"iqro_acc","iqro_ses","iqro_coins"].forEach(lsd);try{sessionStorage.removeItem("quro_cl_rl")}catch(e){}location.reload()}

/* ---------- kartu status di layar Cadangkan & pulihkan ---------- */
const ago=()=>{const t=+ls(LAST);if(!t)return"belum pernah";const m=Math.round((Date.now()-t)/6e4);return m<1?"baru saja":m<60?m+" menit lalu":m<1440?Math.round(m/60)+" jam lalu":Math.round(m/1440)+" hari lalu"};
const cloudCard=()=>{if(!on)return"";const s=sess();
 return `<section class="${card} mt-3 !p-4"><div class="flex items-center gap-3 mb-3"><span class="w-12 h-12 rounded-2xl bg-soft text-brand grid place-items-center shrink-0">${ic("user","w-6 h-6")}</span><div><b class="block">Akun & sinkronisasi</b><small class="text-mute text-xs font-semibold">${s?"Masuk sebagai "+esc(s.user.email)+". Terakhir tersinkron: "+ago()+".":"Masuk dengan email agar progresmu tersimpan di awan dan ikut ke HP lain."}</small></div></div>${s?`<button data-act="cl_sync" class="btn w-full">Sinkronkan sekarang</button>`:`<button data-go="login" class="btn w-full">Masuk / daftar</button>`}</section>`};
if(typeof V!=="undefined"&&V.backup){const vb=V.backup;V.backup=()=>vb()+cloudCard()}

document.addEventListener("click",e=>{const t=e.target.closest("[data-act=pw],[data-act=cl_sync]");if(!t)return;
 if(t.dataset.act==="pw"){const i=document.getElementById("fw");if(i){const h=i.type==="password";i.type=h?"text":"password";t.textContent=h?"Sembunyikan":"Lihat"}}
 else{t.disabled=true;sync({}).then(r=>{t.disabled=false;if(r&&r.ok){toast("Progres tersinkron");if(r.changed)reload();else if(S==="backup")render()}else toast(r&&r.fail&&r.fail!=="sesi"?String(r.fail):"Sesi berakhir, silakan masuk lagi")})}});

/* jadwal: saat dibuka, tiap 60 dtk (hanya bila ada perubahan), saat disembunyikan/ditutup */
if(on){if(sess())setTimeout(()=>sync({}).then(r=>{if(r&&r.changed)reload();else try{sessionStorage.removeItem("quro_cl_rl")}catch(e){}}),1500);
 setInterval(()=>{if(!document.hidden)sync({})},60000);
 document.addEventListener("visibilitychange",()=>{if(document.hidden)flush()});addEventListener("pagehide",flush);
 setTimeout(()=>{if(expired&&typeof toast==="function")toast("Sesi berakhir, masuk lagi untuk menyinkronkan")},2500)}
return{on,merge,doLogin,doRegister,doLogout,sync,signedIn,flush,_req:req,_sess:sess,KEYS}})();
