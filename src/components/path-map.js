/* Peta belajar per jilid ("dunia"): level 1 di BAWAH, jalur berkelok naik ke atas. Status mengikuti kunci level (lock.js):
   terkunci / terbuka / saat ini (MULAI) / lulus (bintang). Jilid 1 = dunia hutan-rerumputan; jilid lain memakai warna jilidnya (CVH). */
const pmQ=(j,p)=>(iqQZ["p"+j+"-"+p]||{}).s||0;
const pmCur=j=>{const n=JL[j].n;for(let p=1;p<=n;p++)if(pgOpen(j,p)&&!qOk("p"+j+"-"+p))return p;return n};
const pmTheme=j=>{const h=CVH[j-1];return j===1?{a:"#B9EA8C",b:"#62C24E",cn:"#3FA24A",cl:"#6BCB5F"}:{a:`hsl(${h} 62% 84%)`,b:`hsl(${h} 50% 62%)`,cn:`hsl(${h} 50% 42%)`,cl:`hsl(${h} 55% 58%)`}};
/* hiasan: pohon, semak, bunga, jamur (SVG kecil, bukan emoji supaya sama di semua HP) */
const pmDeco=(k,t,s)=>{const f=["#FF7EB6","#FFD54A","#FF8A5B","#FFFFFF"][s%4];
 return k===0?`<svg width="46" height="60" viewBox="0 0 46 60"><rect x="20" y="36" width="6" height="22" rx="3" fill="#8B5E3C"/><circle cx="23" cy="23" r="19" fill="${t.cn}"/><circle cx="14" cy="28" r="12" fill="${t.cl}"/><circle cx="31" cy="17" r="9" fill="${t.cl}" opacity=".7"/></svg>`
 :k===1?`<svg width="50" height="30" viewBox="0 0 50 30"><ellipse cx="25" cy="20" rx="24" ry="10" fill="${t.cn}"/><circle cx="16" cy="14" r="10" fill="${t.cl}"/><circle cx="32" cy="12" r="11" fill="${t.cn}"/></svg>`
 :k===2?`<svg width="26" height="34" viewBox="0 0 26 34"><path d="M13 32V16" stroke="#3C8F3F" stroke-width="3" stroke-linecap="round"/><circle cx="13" cy="9" r="4" fill="#FFB72B"/>${[0,1,2,3,4].map(i=>`<circle cx="${13+8*Math.cos(i*1.256)}" cy="${9+8*Math.sin(i*1.256)}" r="4.5" fill="${f}"/>`).join("")}<circle cx="13" cy="9" r="3.5" fill="#FFB72B"/></svg>`
 :`<svg width="28" height="28" viewBox="0 0 28 28"><rect x="11" y="14" width="7" height="12" rx="3" fill="#FFF1D6"/><path d="M2 16a12 12 0 0 1 24 0z" fill="#E8564A"/><circle cx="9" cy="11" r="2" fill="#fff"/><circle cx="17" cy="9" r="2.2" fill="#fff"/></svg>`};
function pathMap(j){
  const n=JL[j].n,h=CVH[j-1],cur=pmCur(j),RH=104,TOP=44,BOT=120,H=TOP+n*RH+BOT,t=pmTheme(j);
  /* level p (1..n): y makin kecil ke atas */
  const pts=Array.from({length:n},(_,i)=>[50+Math.sin(i*.95)*27,TOP+(n-1-i)*RH+RH/2]);
  let dp="M"+pts[0][0]+" "+pts[0][1];
  for(let i=1;i<n;i++){const a=pts[i-1],b=pts[i];dp+=" C"+a[0]+" "+(a[1]-RH*.55)+" "+b[0]+" "+(b[1]+RH*.55)+" "+b[0]+" "+b[1]}
  let r=j*7919+13;const rnd=()=>(r=(r*1103515245+12345)&2147483647)/2147483647;
  const deco=pts.map(([x,y],i)=>{let o="";for(let q=0;q<2;q++){const left=(x>50)===(q===0),px=left?3+rnd()*18:79+rnd()*17,py=y+(rnd()-.5)*70,k=rnd()<.4?0:rnd()<.35?1:rnd()<.6?2:3;o+=`<span class="pmdec" style="left:${px}%;top:${py}px;transform:translate(-50%,-50%)">${pmDeco(k,t,i+q)}</span>`}return o}).join("");
  const nodes=pts.map(([x,y],i)=>{const p=i+1,op=pgOpen(j,p),s=pmQ(j,p),dn=qOk("p"+j+"-"+p),c=p===cur&&op&&!dn,k=!op?"lk":dn?"dn":c?"cur":"op";
    return `<button data-act="pmnode" data-p="${p}" class="pmn ${k}" style="left:${x}%;top:${y}px" aria-label="Halaman ${p}">${op?p:ic("lock","w-6 h-6")}${s?`<span class="pms">★${s}</span>`:""}${c?'<span class="pmb">MULAI</span>':""}</button>${c?`<div class="pmm" style="left:${x>50?x-32:x+17}%;top:${y-36}px">${mas("w-16","semangat")}</div>`:""}`}).join("");
  const river=`<svg class="pmriv" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 14Q12 4 25 12T50 12T75 12T100 10V40H0z" fill="#59C7F2"/><path d="M0 24Q14 16 28 23T56 23T84 22T100 21V40H0z" fill="#2FA8E6"/><path d="M12 30h10M48 33h12M76 29h9" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".6"/></svg>`;
  return `<div class="pm pw" style="--h:${h};height:${H}px;background:linear-gradient(180deg,${t.a},${t.b})"><svg viewBox="0 0 100 ${H}" preserveAspectRatio="none" aria-hidden="true"><path d="${dp}" fill="none" stroke="#CDBE7C" stroke-width="32" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/><path d="${dp}" fill="none" stroke="#FFF4C8" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>${deco}${nodes}${river}</div>`;
}
