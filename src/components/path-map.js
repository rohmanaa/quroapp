/* Peta belajar per jilid ("dunia"): level 1 di BAWAH, jalur berkelok naik ke atas. Status mengikuti kunci level (lock.js):
   terkunci / terbuka / saat ini (MULAI) / lulus (bintang). Jilid 1 = dunia hutan-rerumputan; jilid lain memakai warna jilidnya (CVH). */
const pmQ=(j,p)=>(iqQZ["p"+j+"-"+p]||{}).s||0;
const pmCur=j=>{const n=JL[j].n;for(let p=1;p<=n;p++)if(pgOpen(j,p)&&!qOk("p"+j+"-"+p))return p;return n};
/* ===== Tema dunia: 1 alam, 2 gurun, 3 bawah laut, 4 langit, 5 hutan, 6 pegunungan =====
   Tiap dunia: a (atas), b (bawah), pe/pf (tepi/isi jalur), bt (dasar SVG 100x40), d (4 hiasan SVG kecil). */
const _s=(w,h,b)=>`<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${b}</svg>`;
const _pine=(c1,c2,cap)=>_s(40,62,`<rect x="18" y="46" width="5" height="14" fill="#6B4A2F"/><path d="M20 2L34 24H6z" fill="${c1}"/><path d="M20 14L37 38H3z" fill="${c2}"/><path d="M20 26L39 52H1z" fill="${c1}"/>${cap?'<path d="M20 2L26 12H14z" fill="#fff"/>':""}`);
const _mush=()=>_s(28,28,'<rect x="11" y="14" width="7" height="12" rx="3" fill="#FFF1D6"/><path d="M2 16a12 12 0 0 1 24 0z" fill="#E8564A"/><circle cx="9" cy="11" r="2" fill="#fff"/><circle cx="17" cy="9" r="2.2" fill="#fff"/>');
const _rock=c=>_s(44,28,`<path d="M3 26L10 8L24 3L38 12L42 26z" fill="${c}"/><path d="M10 8L24 3V26H3z" fill="#fff" opacity=".28"/>`);
const _cloud=o=>_s(64,34,`<g fill="#fff" opacity="${o}"><circle cx="20" cy="22" r="12"/><circle cx="34" cy="16" r="15"/><circle cx="48" cy="23" r="11"/><rect x="12" y="22" width="44" height="12" rx="6"/></g>`);
const PMW={
1:{a:"#B9EA8C",b:"#62C24E",pe:"#CDBE7C",pf:"#FFF4C8",
 bt:'<path d="M0 14Q12 4 25 12T50 12T75 12T100 10V40H0z" fill="#59C7F2"/><path d="M0 24Q14 16 28 23T56 23T84 22T100 21V40H0z" fill="#2FA8E6"/><path d="M12 30h10M48 33h12M76 29h9" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".6"/>',
 d:[(s)=>_s(46,60,'<rect x="20" y="36" width="6" height="22" rx="3" fill="#8B5E3C"/><circle cx="23" cy="23" r="19" fill="#3FA24A"/><circle cx="14" cy="28" r="12" fill="#6BCB5F"/><circle cx="31" cy="17" r="9" fill="#6BCB5F" opacity=".7"/>'),
  ()=>_s(50,30,'<ellipse cx="25" cy="20" rx="24" ry="10" fill="#3FA24A"/><circle cx="16" cy="14" r="10" fill="#6BCB5F"/><circle cx="32" cy="12" r="11" fill="#3FA24A"/>'),
  (s)=>{const f=["#FF7EB6","#FFD54A","#FF8A5B","#FFFFFF"][s%4];return _s(26,34,`<path d="M13 32V16" stroke="#3C8F3F" stroke-width="3" stroke-linecap="round"/>${[0,1,2,3,4].map(i=>`<circle cx="${13+8*Math.cos(i*1.256)}" cy="${9+8*Math.sin(i*1.256)}" r="4.5" fill="${f}"/>`).join("")}<circle cx="13" cy="9" r="3.5" fill="#FFB72B"/>`)},
  _mush]},
2:{a:"#FCE7B0",b:"#F0B565",pe:"#D9A75E",pf:"#FFF3D6",
 bt:'<path d="M0 22Q20 8 40 20T80 18T100 14V40H0z" fill="#E9B866"/><path d="M0 30Q25 20 50 28T100 24V40H0z" fill="#D99A4A"/>',
 d:[()=>_s(34,56,'<rect x="12" y="4" width="10" height="50" rx="5" fill="#4E9F4A"/><path d="M12 30H6a4 4 0 0 1-4-4V18M22 36h6a4 4 0 0 0 4-4V24" stroke="#4E9F4A" stroke-width="7" fill="none" stroke-linecap="round"/>'),
  ()=>_s(36,32,'<ellipse cx="18" cy="20" rx="14" ry="11" fill="#5DAA52"/><path d="M12 12v16M18 10v18M24 12v16" stroke="#3E8A3E" stroke-width="1.5"/><circle cx="18" cy="8" r="4" fill="#FF7EB6"/>'),
  ()=>_rock("#B8956A"),
  ()=>_s(40,26,'<path d="M4 24L14 8M14 24L22 4M22 24L34 10M30 24L38 14M8 24L4 14" stroke="#9C7040" stroke-width="3" stroke-linecap="round"/>')]},
3:{a:"#8FE4F3",b:"#1F7CC1",pe:"#D8B77A",pf:"#FFF0C9",
 bt:'<path d="M0 20Q25 10 50 18T100 14V40H0z" fill="#F2D79A"/><path d="M0 30Q30 22 60 30T100 27V40H0z" fill="#E3BE78"/><circle cx="20" cy="30" r="1.6" fill="#fff" opacity=".7"/><circle cx="64" cy="34" r="1.4" fill="#fff" opacity=".7"/>',
 d:[(s)=>_s(40,48,`<path d="M20 46V24M20 34L9 22M20 28L31 14M9 22V12M31 14V6" stroke="${s%2?"#FF7A8A":"#FF9F43"}" stroke-width="6" stroke-linecap="round" fill="none"/>`),
  ()=>_s(24,56,'<path d="M10 54C2 44 18 40 10 30S18 14 10 4M18 54C12 46 24 42 18 34" stroke="#2E9E5B" stroke-width="5" fill="none" stroke-linecap="round"/>'),
  ()=>_s(40,30,'<path d="M4 26a16 16 0 0 1 32 0z" fill="#FFC1A1"/><path d="M20 26V12M12 26L8 15M28 26L32 15" stroke="#FF9F7A" stroke-width="2"/>'),
  (s)=>_s(42,24,`<ellipse cx="18" cy="12" rx="14" ry="9" fill="${s%2?"#FFB72B":"#FF7A8A"}"/><path d="M30 12L40 4V20z" fill="#FF9F1C"/><circle cx="10" cy="10" r="2" fill="#1E3A2B"/>`)]},
4:{a:"#4C9DE6",b:"#CFEBFF",pe:"#BFE0F5",pf:"#FFFFFF",
 bt:'<path d="M0 20Q10 6 22 16Q32 2 46 14Q60 0 74 14Q88 4 100 16V40H0z" fill="#fff"/><path d="M0 30Q20 22 40 30T100 28V40H0z" fill="#E6F4FF"/>',
 d:[()=>_cloud(1),()=>_cloud(.7),()=>_s(30,30,'<path d="M15 2l4 9 10 1-7.500 6.500 2.500 10L15 23l-9 5.500 2.500-10L1 12l10-1z" fill="#FFD54A"/>'),
  ()=>_s(30,52,'<ellipse cx="15" cy="16" rx="12" ry="14" fill="#FF6B6B"/><path d="M15 30v20" stroke="#fff" stroke-width="1.5"/><rect x="11" y="44" width="8" height="6" rx="2" fill="#8B5E3C"/>')]},
5:{a:"#9BD58A",b:"#2F8450",pe:"#A88955",pf:"#EBD8A8",
 bt:'<path d="M0 16Q25 6 50 14T100 10V40H0z" fill="#3C8C55"/><path d="M0 28Q30 20 60 28T100 24V40H0z" fill="#2B6E43"/>',
 d:[()=>_pine("#2F7D4A","#2A7044"),()=>_pine("#3E9A5C","#34874E"),()=>_s(50,30,'<ellipse cx="25" cy="20" rx="24" ry="10" fill="#23603A"/><circle cx="16" cy="14" r="10" fill="#2F7D4A"/><circle cx="32" cy="12" r="11" fill="#23603A"/>'),_mush]},
6:{a:"#E5EEF8",b:"#8EA2BD",pe:"#A9B7C9",pf:"#F3F6FA",
 bt:'<path d="M0 18Q25 6 50 16T100 12V40H0z" fill="#F4F8FC"/><path d="M0 30Q30 22 60 30T100 26V40H0z" fill="#DCE6F1"/>',
 d:[()=>_s(70,56,'<path d="M2 54L28 8L40 28L48 18L68 54z" fill="#8C9DB5"/><path d="M28 8L20 22L28 18L34 24L40 28z" fill="#fff"/>'),
  ()=>_s(44,36,'<path d="M2 34L18 6L28 22L34 14L42 34z" fill="#9FB0C8"/><path d="M18 6L12 16L18 13L23 17L28 22z" fill="#fff"/>'),
  ()=>_rock("#8C9DB5"),()=>_pine("#2F7D4A","#2A7044",1)]}
};
function pathMap(j){
  const n=JL[j].n,h=CVH[j-1],cur=pmCur(j),RH=104,TOP=44,BOT=120,H=TOP+n*RH+BOT,t=PMW[j]||PMW[1];
  /* level p (1..n): y makin kecil ke atas */
  const pts=Array.from({length:n},(_,i)=>[50+Math.sin(i*.95)*27,TOP+(n-1-i)*RH+RH/2]);
  let dp="M"+pts[0][0]+" "+pts[0][1];
  for(let i=1;i<n;i++){const a=pts[i-1],b=pts[i];dp+=" C"+a[0]+" "+(a[1]-RH*.55)+" "+b[0]+" "+(b[1]+RH*.55)+" "+b[0]+" "+b[1]}
  let r=j*7919+13;const rnd=()=>(r=(r*1103515245+12345)&2147483647)/2147483647;
  const deco=pts.map(([x,y],i)=>{let o="";for(let q=0;q<2;q++){const left=(x>50)===(q===0),px=left?3+rnd()*18:79+rnd()*17,py=y+(rnd()-.5)*70,k=Math.floor(rnd()*4);o+=`<span class="pmdec" style="left:${px}%;top:${py}px;transform:translate(-50%,-50%)">${t.d[k](i+q)}</span>`}return o}).join("");
  const nodes=pts.map(([x,y],i)=>{const p=i+1,op=pgOpen(j,p),s=pmQ(j,p),dn=qOk("p"+j+"-"+p),c=p===cur&&op&&!dn,k=!op?"lk":dn?"dn":c?"cur":"op";
    return `<button data-act="pmnode" data-p="${p}" class="pmn ${k}" style="left:${x}%;top:${y}px" aria-label="Halaman ${p}">${op?p:ic("lock","w-6 h-6")}${s?`<span class="pms">★${s}</span>`:""}${c?'<span class="pmb">MULAI</span>':""}</button>${c?`<div class="pmm" style="left:${x>50?x-32:x+17}%;top:${y-36}px">${mas("w-16","semangat")}</div>`:""}`}).join("");
    return `<div class="pm pw" style="--h:${h};height:${H}px;background:linear-gradient(180deg,${t.a},${t.b})"><svg viewBox="0 0 100 ${H}" preserveAspectRatio="none" aria-hidden="true"><path d="${dp}" fill="none" stroke="${t.pe}" stroke-width="32" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/><path d="${dp}" fill="none" stroke="${t.pf}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>${deco}${nodes}<svg class="pmriv" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">${t.bt}</svg></div>`;
}
