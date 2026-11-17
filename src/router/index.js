/* Scroll horizontal (card atas tab Iqro, deretan tab/chip): diingat per layar dan dipulihkan saat kembali; digambar ulang di layar yang sama = tidak loncat ke awal */
const hsEl=()=>document.querySelectorAll("#app .hs,#app .overflow-x-auto"),hsGet=()=>[...hsEl()].map(e=>e.scrollLeft),hsSet=a=>{const l=hsEl();if(a&&a.length===l.length)l.forEach((e,i)=>{if(a[i])e.scrollLeft=a[i]})},HS={};let lastS=null;
function render(){const keep=lastS===S?hsGet():null;const g=S==="games"||S==="game";document.body.classList.toggle("gm",g);if(g)$("#app").classList.remove("tr-slide","tr-slideb","tr-fade","tr-zoom","tr-up");$("#app").innerHTML=V[S]();bar();if(S==="reader"){fitRows();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{if(S==="reader")fitRows()})}if(keep)hsSet(keep);lastS=S}
/* Posisi scroll tiap layar: disimpan saat pergi, dipulihkan saat kembali (tombol kembali / HP back) */
const SC={};
/* registri layar (views): tiap layar mendaftar sebagai V.<nama>=()=>html di src/views/<nama>.js */
const V={};
function go(s){if(!V[s]){const fk=featOf(s);if(fk)return featGate(fk,()=>go(s))}if(s==="reader"&&needBook(jl))return bookGate(()=>go(s));const isBack=navDir<0;if(play)stopSeq();if(fsOn&&s!=="reader")toggleFs();if(B[s]&&!B[S])BK=S;fromGames=(S==="games"&&s==="game")||(S==="game"&&s==="game"&&fromGames);let dir=navDir;navDir=1;if(dir>0&&!B[S]&&!B[s]){const ti=k=>TABS.findIndex(t=>t[0]===k);if(ti(s)<ti(S))dir=-1}const same=s===S;if(!same){SC[S]=window.scrollY||0;HS[S]=hsGet()}S=s;try{sessionStorage.setItem("quro_scr",JSON.stringify({s:S,j:jl,p:pn,g:typeof GM==="number"?GM:0,t:tabF}))}catch(e){}render();scrollTo(0,isBack&&!same?(SC[s]||0):0);if(isBack&&!same)hsSet(HS[s]);if(!same&&s!=="games"&&s!=="game")anim(dir)}
let exitAt=0,exiting=0;
try{history.replaceState({q:1},"");history.pushState({q:2},"")}catch(e){}
addEventListener("popstate",()=>{if(exiting)return;try{history.pushState({q:2},"")}catch(e){}
 if(document.getElementById("pkw")){closePick();return}
 if(!$("#m").classList.contains("hidden")){$("#m").classList.add("hidden");mok=null;mcb=null;return}
 if((S==="games"||S==="game")&&typeof gmBack==="function"&&gmBack())return;
 if(S!=="login"&&S!=="reg"&&B[S]){navDir=-1;go(S==="game"&&fromGames?"games":(BK&&!B[BK]?BK:B[S]));return}
 const n=Date.now();if(n-exitAt<2000){exitAt=0;modal({t:"Keluar dari aplikasi?",p:"Kamu tetap masuk, jadi bisa lanjut belajar kapan saja.",b:"Batal",y:"Ya, keluar",ok:()=>{exiting=1;try{window.close()}catch(e){}history.go(-2)}});return}
 exitAt=n;toast("Tekan sekali lagi untuk keluar aplikasi")});
