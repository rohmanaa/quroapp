/* Materi latihan QURO. Dibuat oleh program (bukan salinan buku mana pun): huruf dan tanda baca disusun bertahap.
   Jilid 1 fathah | 2 kasrah, dhammah | 3 mad | 4 sukun, tanwin | 5 tasydid | 6 gabungan.
   Halaman dibuat saat aplikasi dibuka dengan pengacak bersemi, jadi isinya selalu sama untuk setiap orang. */
(function(){
const H=[["ب","B"],["ت","T"],["ث","TS"],["ج","J"],["ح","H"],["خ","KH"],["د","D"],["ذ","DZ"],["ر","R"],["ز","Z"],["س","S"],["ش","SY"],["ص","SH"],["ض","DH"],["ط","TH"],["ظ","ZH"],["ع","'"],["غ","GH"],["ف","F"],["ق","Q"],["ك","K"],["ل","L"],["م","M"],["ن","N"],["ه","H"],["و","W"],["ي","Y"]];
const LT={};H.forEach(([a,l])=>LT[a]={a,l});LT["ا"]={a:"ا",l:""};
const MK={a:["\u064E","A"],i:["\u0650","I"],u:["\u064F","U"]},TN={a:"\u064B",i:"\u064D",u:"\u064C"},CAR={a:"ا",i:"ي",u:"و"},SH="\u0651",SK="\u0652";
const CN=H.map(x=>LT[x[0]]),NS=CN.filter(x=>x.a!=="و"&&x.a!=="ي");
const grp=s=>s.split(" ").map(c=>LT[c]);
const rng=s=>{let h=1779033703^s.length;for(let i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),3432918353);h=h<<13|h>>>19}let a=h>>>0;return()=>{a|=0;a=a+1831565813|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
const pick=(a,r)=>a[Math.floor(r()*a.length)];
const dist=(a,n,r)=>{const o=[];let g=0;while(o.length<n&&g++<50){const x=pick(a,r);if(!o.includes(x))o.push(x)}return o};
function unit(t,L,v){const c=L.a,l=L.l,m=MK[v];
  if(t==="S")return[c+m[0],l+m[1]];
  if(t==="M")return[c+m[0]+CAR[v]+(v==="a"?"":SK),l+m[1]+m[1]]; /* waw dan ya mati wajib bersukun; alif tanpa sukun (alif bersukun = berhenti mendadak, bukan panjang) */
  if(t==="T")return[c+TN[v],l+m[1]+"N"];
  if(t==="D")return[c+SH+m[0],l+l+m[1]];
  return[c+SK,l]}
/* Sambungan huruf. Huruf yang tidak menyambung ke huruf sesudahnya (NJ) memutus kata.
   Huruf RS (ج ح خ ه) bentuk tengah/akhirnya mirip satu sama lain dan mudah terbaca terbalik bila menerima sambungan
   dari huruf sebelumnya (mis. قخص terbaca "khoqash"), jadi hanya boleh di awal kata atau setelah huruf pemutus. */
const NJ="ادذرزو",RS="جحخه";
function word(pat,vs,pool,r){let a="",l="",join=false;
  for(const t of pat){const base=t==="S"||t==="M"?pool:NS;
    let L=pick(base,r);const v=pick(vs,r);
    if(join&&RS.indexOf(L.a)>=0){const ok=base.filter(x=>RS.indexOf(x.a)<0),r2=rng("fix|"+pat+"|"+a+"|"+l+"|"+L.a);L=pick(ok,r2)} /* pengundi cadangan: aliran acak utama tidak berubah, jadi kata yang sudah aman tetap sama */
    const u=unit(t,L,v);a+=u[0];l+=u[1];
    join=NJ.indexOf(t==="M"?CAR[v]:L.a)<0}
  return[a,l]}
const tok=(L,v)=>{const u=unit("S",L,v);return[u[0],u[1]]};
function put(rows,r,cells){cells.forEach((c,i)=>rows.push({order_id:rows.length+1,position:{row:r,col:i+1},latin:c[1],arabic:c[0]}))}
function uniq(n,mk,seen){let c,g=0;do{c=mk()}while(seen[c[1]]&&g++<40);seen[c[1]]=1;return c}

/* Jilid 1: huruf berfathah */
const G1=["ا ب ت ث","ج ح خ","د ذ","ر ز","س ش","ص ض","ط ظ","ع غ","ف ق","ك ل","م ن","و ه ي"].map(grp);
function j1(p,r){const rev=p>=G1.length,nw=rev?[]:G1[p],pool=[].concat(...G1.slice(0,rev?G1.length:p+1)),rows=[],seen={};
  if(nw.length)put(rows,1,nw.map(L=>tok(L,"a")));
  const R0=nw.length?2:1;
  for(let i=0;i<6;i++){const cs=[];for(let k=0;k<2;k++)cs.push(uniq(0,()=>{const ls=[0,1,2].map(()=>nw.length&&r()<.6?pick(nw,r):pick(pool,r));if(nw.length&&!ls.some(x=>nw.includes(x)))ls[Math.floor(r()*3)]=pick(nw,r);const t=ls.map(L=>tok(L,"a"));return[t.map(x=>x[0]).join(" "),t.map(x=>x[1]).join(" ")]},seen));put(rows,R0+i,cs)}
  const tp=nw.map(L=>tok(L,"a"));
  return{topic:{latin:rev?"ULANGAN":tp.map(x=>x[1]).join(" "),arab:rev?"":tp.map(x=>x[0]).join(" ")},rows,id:"Bacalah huruf-huruf berfathah dengan suara pendek dan jelas. Ulangi sampai lancar.",ar:"اقرأ الحروف بالفتحة بصوت قصير"}}

/* Jilid 2: kasrah dan dhammah */
const P2=[grp("ا ب ت ث ج ح خ د ذ ر ز"),grp("س ش ص ض ط ظ ع غ ف"),grp("ق ك ل م ن و ه ي")];
function j2(p,r){const ph=p<4?"i":p<8?"u":"m",pi=p<8?p%4:3,pool=pi<3?P2[pi]:[].concat(...P2),rows=[],seen={},vs=ph==="m"?["a","i","u"]:[ph];
  if(ph!=="m"&&pi<3)put(rows,1,dist(pool,3,r).map(L=>tok(L,ph)));
  const R0=rows.length?2:1,mk=()=>{const t=[0,1,2].map(()=>tok(pick(pool,r),pick(vs,r)));return[t.map(x=>x[0]).join(" "),t.map(x=>x[1]).join(" ")]};
  for(let i=0;i<6;i++)put(rows,R0+i,[uniq(0,mk,seen),uniq(0,mk,seen)]);
  const t=ph==="i"?tok(LT["ب"],"i"):ph==="u"?tok(LT["ب"],"u"):null,t3=ph==="m"?["a","i","u"].map(v=>tok(LT["ب"],v)):null;
  return{topic:t?{latin:t[1],arab:t[0]}:{latin:t3.map(x=>x[1]).join(" "),arab:t3.map(x=>x[0]).join(" ")},rows,id:ph==="i"?"Bacalah huruf berkasrah. Bunyinya I, bukan A.":ph==="u"?"Bacalah huruf berdhammah. Bunyinya U, bukan A.":"Bacalah fathah, kasrah, dan dhammah bergantian. Perhatikan tandanya.",ar:"اقرأ الحروف بالكسرة والضمة"}}

/* Pola kata untuk jilid 3-6. S suku kata, M mad, T tanwin, D tasydid, K sukun */
function wordPage(o,r){const rows=[],seen={};
  if(o.intro){const v=o.intro,ps=dist(o.pool,3,r).map(L=>unit("M",L,v));put(rows,1,ps)}
  const R0=rows.length?2:1;
  for(let i=0;i<7-(rows.length?1:0);i++){const mk=()=>word(pick(o.pats,r),o.vs,o.pool,r);put(rows,R0+i,[uniq(0,mk,seen),uniq(0,mk,seen)])}
  return{topic:o.topic,rows,id:o.id,ar:o.ar}}
function okPat(p){return /^[SMTDK]+$/.test(p)&&/^[SM]/.test(p)&&(p.indexOf("T")<0||p.indexOf("T")===p.length-1)&&!/M[KD]|KD|KK/.test(p)}
const WP={};
const P=(l,fb)=>{const g=l.filter(okPat);l.filter(x=>!okPat(x)&&!WP[x]).forEach(x=>{WP[x]=1;console.warn("QURO: pola \""+x+"\" dilewati (melanggar aturan, lihat data/pola.js)")});return g.length?g:fb};
const T3=[CN.slice(0,14),CN.slice(13),CN];
const tp=(t,v)=>{const u=unit(t,LT["ب"],v);return{latin:u[1],arab:u[0]}};
function j3(p,r){const g=Math.floor(p/3),k=p%3,v=["a","i","u"][g],mixed=g===3,vs=mixed?["a","i","u"]:[v];
  let pats=mixed?P(POLA.j3.campur,["MS"]):P(POLA.j3.satu,["MS"]);
  if(mixed){const pool=CN;return wordPage({pool,pats,vs,topic:{latin:"BAA BII BUU",arab:unit("M",LT["ب"],"a")[0]+" "+unit("M",LT["ب"],"i")[0]+" "+unit("M",LT["ب"],"u")[0]},id:"Bacalah dan bedakan bacaan panjang dan pendek. Panjang kira-kira dua ketukan.",ar:"اقرأ المد بصوت طويل"},r)}
  return wordPage({pool:T3[k],pats,vs,intro:v,topic:tp("M",v),id:"Bacalah huruf yang bertemu "+(v==="a"?"alif setelah fathah":v==="i"?"ya mati setelah kasrah":"waw mati setelah dhammah")+" dengan panjang, kira-kira dua ketukan.",ar:"اقرأ المد بصوت طويل"},r)}
function j4(p,r){const ph=Math.floor(p/2);
  if(ph===0)return wordPage({pool:CN,pats:P(POLA.j4.sukun,["SK"]),vs:["a","i","u"],topic:{latin:"BAL",arab:"بَلْ"},id:"Huruf yang bertanda sukun dibaca mati, tanpa bunyi vokal.",ar:"اقرأ الحرف الساكن بدون حركة"},r);
  const v=["a","i","u"][ph-1];
  if(ph<4)return wordPage({pool:CN,pats:P(POLA.j4.tanwin,["ST"]),vs:[v],topic:tp("T",v),id:"Tanwin dibaca dengan tambahan bunyi N di akhir kata: "+(v==="a"?"AN":v==="i"?"IN":"UN")+".",ar:"اقرأ التنوين"},r);
  return wordPage({pool:CN,pats:P(POLA.j4.campur,["ST"]),vs:["a","i","u"],topic:{latin:"BAN BIN BUN",arab:unit("T",LT["ب"],"a")[0]+" "+unit("T",LT["ب"],"i")[0]+" "+unit("T",LT["ب"],"u")[0]},id:"Bacalah tanwin fathatain, kasratain, dan dhammatain dengan jelas.",ar:"اقرأ التنوين والسكون"},r)}
function j5(p,r){const g=Math.floor(p/2),v=["a","i","u"][g];
  if(g<3)return wordPage({pool:CN,pats:P(POLA.j5.dasar,["SD"]),vs:[v],topic:tp("D",v),id:"Huruf bertasydid dibaca dobel: huruf pertama mati, huruf kedua berharakat.",ar:"اقرأ الحرف المشدد مضاعفا"},r);
  return wordPage({pool:CN,pats:P(p<8?POLA.j5.campur1:POLA.j5.campur2,["SD"]),vs:["a","i","u"],topic:{latin:"BBA BBI BBU",arab:unit("D",LT["ب"],"a")[0]+" "+unit("D",LT["ب"],"i")[0]+" "+unit("D",LT["ب"],"u")[0]},id:"Bacalah huruf bertasydid bersama mad, tanwin, dan sukun.",ar:"اقرأ الحرف المشدد مع المد والتنوين"},r)}
function j6(p,r){const ex=p>=POLA.j6Halaman-2;
  return wordPage({pool:CN,pats:P(POLA.j6,["SMS"]),vs:["a","i","u"],topic:{latin:ex?"UJIAN":"GABUNGAN",arab:""},id:ex?"Ujian akhir: bacalah semuanya dengan lancar dan benar, tanpa dieja.":"Gabungan semua tanda: fathah, kasrah, dhammah, mad, tanwin, sukun, tasydid. Bacalah dengan tenang.",ar:"اقرأ بطلاقة وبتأن"},r)}

const SPEC=[[14,j1],[10,j2],[12,j3],[10,j4],[10,j5],[Math.max(3,POLA.j6Halaman|0),j6]];
SPEC.forEach(([n,f],ji)=>{const j=ji+1;JL[j]={ok:1,n};
  for(let p=0;p<n;p++){const r=rng("quro-"+j+"-"+p),b=f(p,r);
    IQ[j+"-"+(p+1)]={level_id:j,level_title:"JILID "+j,topic:b.topic,instruction_id:b.id,instruction_en:"",instruction_ar:b.ar,content:b.rows}}});
})();
