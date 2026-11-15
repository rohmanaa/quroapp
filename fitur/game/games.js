/* Game: lobby (games/index.html) dan tiap game (games/<nama>/) adalah halaman sendiri.
   Di sini hanya pembungkus layar penuh (iframe, tanpa header/menu bawah) + pesan dari halaman game: koin, toast, suara, menang, keluar. */
let GM=0,gmOk=0;
/* Koin +10 pertama kali menang tiap game, sekali per hari (tersimpan agar tidak bisa diulang-ulang dengan muat ulang) */
let GDd=dk(),GD=lsj("iqro_gd",x=>isO(x)&&typeof x.d==="string"&&isO(x.k),{d:"",k:{}});GD=GD.d===GDd?GD.k:{};
const gdSave=()=>{try{localStorage.setItem("iqro_gd",JSON.stringify({d:GDd,k:GD}))}catch(e){}};
const gmFrame=(src,t)=>{gmOk=0;return `<div class="gh"><iframe id="gf" title="${t}" src="${src}" allow="autoplay" class="gf"></iframe></div>`};
V.games=()=>gmFrame("games/index.html","Semua Game");
V.game=()=>{const [k,t]=MG[GM];return gmFrame("games/"+GP[k]+"/index.html?from=home",t)};
const gmSend=m=>{const f=document.getElementById("gf");try{f&&f.contentWindow.postMessage(Object.assign({quro:1},m),"*")}catch(x){}};
/* Tombol kembali HP: diteruskan ke halaman game (game -> lobby, lobby -> Home). Kalau halaman belum siap, pakai perilaku biasa. */
const gmBack=()=>{if(!gmOk||!document.getElementById("gf"))return false;gmSend({type:"back"});return true};
addEventListener("message",e=>{const f=document.getElementById("gf"),m=e.data;if(!f||e.source!==f.contentWindow||!m||m.quro!==1)return;
 if(m.type==="ready"){gmOk=1;gmSend({type:"coins",n:coins})}
 else if(m.type==="toast")toast(String(m.t));
 else if(m.type==="say")say(String(m.t));
 else if(m.type==="exit"){navDir=-1;go("home")}
 else if(m.type==="win"){const k=String(m.slug||"game").slice(0,40);let got=0;if(GDd!==dk()){GDd=dk();GD={}}if(!GD[k]){GD[k]=1;gdSave();coins+=10;got=1;gmSend({type:"coins",n:coins})}
  modal({center:1,t:esc(m.t),p:(got?"+10 koin masuk! ":"")+esc(m.p),stars:3,b:esc(m.b||"Lanjut"),cb:m.again?()=>gmSend({type:"next"}):null})}});
