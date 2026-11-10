/* State aplikasi + localStorage: tema, akun, pengaturan baca, waktu belajar, bookmark */
let hk=0;
/* Baca JSON dari localStorage dengan cek bentuk; data rusak/diubah diabaikan */
const lsj=(k,ok,def)=>{try{const v=JSON.parse(localStorage.getItem(k));return ok(v)?v:def}catch(e){return def}};
const isO=v=>v&&typeof v==="object"&&!Array.isArray(v);
let TH="system";try{TH=localStorage.getItem("iqro_th")||"system"}catch(e){}
function setTheme(m){TH=m;try{localStorage.setItem("iqro_th",m)}catch(e){}const r=document.documentElement;if(m==="system")r.removeAttribute("data-theme");else r.setAttribute("data-theme",m)}
setTheme(["light","dark"].includes(TH)?TH:"system");
let U=null,G="",RS=1,otpC="",qi=0,had=0,sc=null,lk={};try{const a=lsj("iqro_acc",x=>isO(x)&&typeof x.name==="string"&&x.name.length<=20,null);if(a&&localStorage.getItem("iqro_ses")==="1")U=a}catch(e){}
let S=U?"home":"login",pg=0,sel=0,play=false,rec=0,coins=130,ci=2,claimed=false,tabF=0,li=0;
let jl=1,pn=1,showLat=true,iqDN={},iqLast={},fsOn=false,pj=1,useColor=true,petOpen=false,fz=1,BK=null,trans="slide",mblink=true,navDir=1,fromGames=false,gcat="Semua";
try{const z=JSON.parse(localStorage.getItem("iqro_last"));if(z&&JL[z.j]&&JL[z.j].ok){jl=z.j;pn=z.p||1}iqLast=lsj("iqro_lastj",isO,{});iqDN=lsj("iqro_done",isO,{})}catch(e){}
const persist=()=>{try{iqLast[jl]=pn;localStorage.setItem("iqro_lastj",JSON.stringify(iqLast));localStorage.setItem("iqro_last",JSON.stringify({j:jl,p:pn}));localStorage.setItem("iqro_done",JSON.stringify(iqDN))}catch(e){}};
let useTj=true,iqQZ={},iqPosts=[];
try{iqQZ=lsj("iqro_quiz",isO,{});iqPosts=lsj("iqro_posts",a=>Array.isArray(a)&&a.every(x=>isO(x)&&typeof x.n==="string"),[])}catch(e){}
try{const z=JSON.parse(localStorage.getItem("iqro_set"));if(z){useTj=z.tj!==false;useColor=z.c!==false;showLat=z.l!==false;if(z.z>=0&&z.z<=2)fz=z.z;if(z.t)trans=z.t;mblink=z.mb!==false}}catch(e){}
const saveSet=()=>{try{localStorage.setItem("iqro_set",JSON.stringify({c:useColor,l:showLat,z:fz,t:trans,mb:mblink,tj:useTj}))}catch(e){}};
/* ===== Waktu belajar nyata (tersimpan di perangkat) ===== */
const dk=d=>{d=d||new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
let iqT={},goal=10,lastAct=Date.now(),goalMsg="";
try{iqT=lsj("iqro_time",isO,{});goal=+localStorage.getItem("iqro_goal")||10;goalMsg=localStorage.getItem("iqro_gmsg")||""}catch(e){}
const saveT=()=>{try{localStorage.setItem("iqro_time",JSON.stringify(iqT))}catch(e){}};
let iqBM={};iqBM=lsj("iqro_bm",isO,{});
const saveBM=()=>{try{localStorage.setItem("iqro_bm",JSON.stringify(iqBM))}catch(e){}};
let rs=.6,offBusy=0;
const acc=()=>{try{return JSON.parse(localStorage.getItem("iqro_acc"))}catch(e){return null}};
const ses=U=>{try{if(U)localStorage.setItem("iqro_ses","1");else localStorage.removeItem("iqro_ses")}catch(e){}};
