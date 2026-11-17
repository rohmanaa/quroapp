/* Peta belajar per jilid: satu halaman = satu level di jalur berkelok. Status mengikuti kunci level (lock.js):
   terkunci / terbuka / saat ini (MULAI) / lulus (bintang). */
const pmQ=(j,p)=>(iqQZ["p"+j+"-"+p]||{}).s||0;
const pmCur=j=>{const n=JL[j].n;for(let p=1;p<=n;p++)if(pgOpen(j,p)&&!qOk("p"+j+"-"+p))return p;return n};
function pathMap(j){
  const n=JL[j].n,h=CVH[j-1],cur=pmCur(j),RH=104;
  const pts=Array.from({length:n},(_,i)=>[50+Math.sin(i*.95)*27,RH/2+i*RH]);
  let dp="M"+pts[0][0]+" "+pts[0][1];
  for(let i=1;i<n;i++){const a=pts[i-1],b=pts[i];dp+=" C"+a[0]+" "+(a[1]+RH*.55)+" "+b[0]+" "+(b[1]-RH*.55)+" "+b[0]+" "+b[1]}
  const deco=pts.map(([x,y],i)=>i%3===1?`<span class="pmd" style="left:${x>50?x-38:x+30}%;top:${y}px">${["🌿","🌳","🍄","🌼"][(i/3|0)%4]}</span>`:"").join("");
  const nodes=pts.map(([x,y],i)=>{const p=i+1,op=pgOpen(j,p),s=pmQ(j,p),dn=qOk("p"+j+"-"+p),c=p===cur&&op&&!dn,k=!op?"lk":dn?"dn":c?"cur":"op";
    return `<button data-act="pmnode" data-p="${p}" class="pmn ${k}" style="left:${x}%;top:${y}px" aria-label="Halaman ${p}">${op?p:ic("lock","w-6 h-6")}${s?`<span class="pms">★${s}</span>`:""}${c?'<span class="pmb">MULAI</span>':""}</button>${c?`<div class="pmm" style="left:${x>50?x-32:x+17}%;top:${y-36}px">${mas("w-16","semangat")}</div>`:""}`}).join("");
  return `<div class="pm" style="--h:${h};height:${n*RH}px"><svg viewBox="0 0 100 ${n*RH}" preserveAspectRatio="none" aria-hidden="true"><path d="${dp}" fill="none" stroke="var(--line)" stroke-width="22" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>${deco}${nodes}</div>`;
}
