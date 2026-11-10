/* Penangan klik utama (data-act, data-go, dll) */
document.addEventListener("click",e=>{const t=e.target.closest("[data-act]");if(!t)return;const d=t.dataset,a=d.act,v=id=>(($("#"+id)||{}).value||"").trim();
  const chk=()=>{const p=v("fp").replace(/\D/g,"");if(p.length<9){toast("Nomor HP belum benar");return 0}if(!otpC){toast("Tekan Kirim kode dulu");return 0}if(v("fc")!==otpC){toast("Kode belum tepat, coba lagi ya");return 0}return p};
  if(a==="gen"){G=d.g;render()}
  if(a==="rnext"){if(!G)return toast("Eits, pilih dulu ya!");RS=2;render()}
  if(a==="rback"){RS=1;render()}
  if(a==="otp"){otpC=""+(1000+Math.floor(Math.random()*9000));toast("Kode demo: "+otpC);let n=30;t.disabled=true;clearInterval(window.oi);window.oi=setInterval(()=>{const b=$("#ob");if(!b||--n<=0){clearInterval(window.oi);if(b){b.disabled=false;b.textContent="Kirim ulang"}return}b.textContent=n+" dtk"},1000)}
  if(a==="login"){const p=chk();if(!p)return;const c=acc();if(!c||c.phone!==p){toast("Nomor belum terdaftar, yuk daftar dulu");RS=1;return go("reg")}U=c;ses(1);otpC="";go("home")}
  if(a==="regdone"){const n=v("fn");if(!n)return toast("Isi nama panggilan dulu");const p=chk();if(!p)return;U={name:n,g:G,phone:p};try{localStorage.setItem("iqro_acc",JSON.stringify(U))}catch(e){}ses(1);otpC="";go("home");modal({center:1,t:"Yay Barakallah, "+esc(n)+"!",p:"Yey Alhamdulillah, akunmu sudah jadi! Yuk Bismillah, kita belajar huruf hijaiyah.",stars:3,b:"Bismillah siap!"})}
  if(a==="guest"){U={name:"Tamu",g:"L"};go("home")}
  if(a==="out")modal({t:"Yakin mau keluar?",p:"Kamu bisa masuk lagi kapan saja, yuk lanjut belajar nanti!",b:"Batal",y:"Ya, keluar",ok:()=>{U=null;ses(0);G="";RS=1;go("login")}});
  if(a==="hearq")say(L[qi][0]);
  if(a==="qp"||a==="qn"){qi=(qi+(a==="qn"?1:9))%10;rec=0;render()}
  if(a==="mine")toast(had?"Memutar rekamanmu…":"Belum ada rekaman, rekam dulu ya");
  if(a==="bmgo"){const[j,q]=d.k.split("-");jl=+j;pn=+q;go("reader")}if(a==="off")offDl();if(a==="spd"){rs=rs<.5?.6:rs<.7?.85:.42;render()}if(a==="like"){lk[d.id]=!lk[d.id];render()}
  
});
document.addEventListener("click",e=>{
  const t=e.target.closest("[data-go],[data-back],[data-act],[data-hk],[data-hx],[data-h],[data-j],[data-pg],[data-cell]");if(!t)return;
  const d=t.dataset;
  if(d.t!==undefined)tabF=+d.t;if(d.gm!==undefined)GM=+d.gm;if(d.j!==undefined){const j=+d.j;if(!JL[j].ok)return toast("Iqro "+j+" segera hadir");jl=j;pn=iqLast[j]||1}if(d.pg!==undefined){pn=+d.pg;return go("reader")}if(d.cell!==undefined){const cp=curPg(),cc=cp&&cp.content.find(x=>x.order_id==d.cell);if(cc){stopSeq();hi=cc.order_id;render();say(cl(cc.arabic));setTimeout(()=>{if(hi===cc.order_id){hi=0;render()}},1200)}return}if(d.go)return go(d.go);
  if(d.back!==undefined){navDir=-1;return go(S==="game"&&fromGames?"games":(BK&&!B[BK]?BK:B[S]))}
  if(d.hk!==undefined){hk=+d.hk;say(hkEx(hk,0)[0]);if(S!=="harakat")return go("harakat");render();const c=$("#hktab"),e=c&&c.querySelector(".on");if(e)c.scrollLeft=e.offsetLeft-c.clientWidth/2+e.offsetWidth/2;return}
  if(d.hx!==undefined){say(hkEx(hk,+d.hx)[0]);return}
  if(d.h!==undefined){sel=+d.h;say(L[sel][0]);return S==="huruf"?render():go("huruf")}
  const a=d.act;
  if(a==="hearhk")say(hkEx(hk,0)[0]);
  if(a==="hear")say(L[sel][0]);
  if(a==="prev")turn(-1);
  if(a==="next")turn(1);if(a==="pick"){pj=jl;showPick()}if(a==="fs")toggleFs();if(a==="gc"){gcat=d.c;render()}if(a==="an")showAn();if(a==="mb"){mblink=!mblink;applyMb();saveSet();if(document.getElementById("anw"))showAn()}if(a==="st")showSt();if(a==="setc"){useColor=!useColor;saveSet();render();if(document.getElementById("stw"))showSt()}if(a==="setl"){showLat=!showLat;saveSet();render();if(document.getElementById("stw"))showSt()}if(a==="retry"){delete IQ[jl+"-"+pn];render()}if(a==="soon")toast("Data Iqro "+jl+" belum tersedia")
  if(a==="play"){if(S==="reader"){const cp=curPg();if(!cp)return toast("Halaman belum dimuat");if(play){stopSeq();render()}else playSeq(cp);return}const tx=S==="record"?sampleTxt():(curPg()?pgTxt(curPg()):"");if(!tx)return toast("Halaman belum dimuat");play=!play;if(play){if(!say(tx))play=false}else{try{speechSynthesis.cancel()}catch(e){}}if(S==="reader")render()}
  if(a==="mok"){$("#m").classList.add("hidden");mcb=null;if(mok){const f=mok;mok=null;f()}}
  if(a==="mclose"){mok=null;$("#m").classList.add("hidden");if(mcb){const f=mcb;mcb=null;f()}}
  if(a==="sp"){$("#sp").classList.add("out");setTimeout(()=>$("#sp").remove(),700)}
  if(a==="claim"){if(claimed)return toast("Hadiah hari ini sudah diambil");claimed=true;ci=Math.min(ci+1,7);coins+=5;render();modal({center:1,t:"Yey Alhamdulillah, hadiah diambil!",p:"+5 koin masuk! Insya Allah, besok datang lagi ya!",stars:3,b:"Yey Alhamdulillah!"})}
  if(a==="tl"){tabL=+d.i;render()}
  if(a==="th"){setTheme(d.m);render()}
  if(a==="settarget"){goal=+d.v;saveGoal();render();toast("Target "+d.v+" menit dipilih. Bismillah!")}
  if(a==="speed")toast("Kecepatan "+d.v+" dipilih");
  if(a==="toggleauto"||a==="privacy")toast("Pengaturan diperbarui");
  if(a==="follow")toast("Yuk belajar bareng "+d.n+"!");
  if(a==="tf"){tabF=+d.i;render()}
  if(a==="fo"){if(fol[d.n])modal({t:"Berhenti mengikuti?",p:"Kamu tidak akan melihat kabar "+esc(d.n)+" lagi di daftar ikutanmu.",b:"Batal",y:"Ya, berhenti",ok:()=>{fol[d.n]=false;render()}});else{fol[d.n]=true;render()}}
  if(a==="watch")modal({t:"Live: "+esc(d.n),p:esc(d.n)+" sedang membaca Iqro 3 · Hal 12. Kirim semangat!",b:"Kirim Love ❤️"});
  if(a==="share")shr("Yey Alhamdulillah, aku dapat 4 bintang di QURO! Yuk belajar Iqro bareng!");
  if(a==="sh"){const m="Yuk Bismillah, belajar Iqro bareng aku di QURO!",u=encodeURIComponent(location.href);if(d.k==="wa")window.open("https://wa.me/?text="+encodeURIComponent(m)+"%20"+u,"_blank","noopener,noreferrer");else if(d.k==="tg")window.open("https://t.me/share/url?url="+u+"&text="+encodeURIComponent(m),"_blank","noopener,noreferrer");else shr(m)}
  if(a==="bm"){const k=jl+"-"+pn;if(iqBM[k])modal({t:"Hapus penanda?",p:"Halaman ini akan dihapus dari daftar penandamu.",b:"Batal",y:"Ya, hapus",ok:()=>{delete iqBM[k];saveBM();render();toast("Penanda dihapus")}});else{iqBM[k]=1;saveBM();render();toast("Halaman ditandai")}}
  if(a==="bell")modal({t:"Yah, belum ada kabar nih",p:"Belum ada notifikasi baru. Yuk belajar dulu hari ini!",b:"Yuk Bismillah"});
  if(a==="rec"){if(rec===2){rec=0;coins+=10;had=1;sc=[85.6,75,83];return go("result")}rec++;render()}
});
