/* Pewarnaan tajwid: tanwin, tasydid, mad thabi'i. Warna ada di css/reader.css (.tj[data-tj]). */
const tjSplit=s=>{const r=[];for(const ch of s){if(r.length&&/[\u064B-\u065F\u0670\u06D6-\u06ED]/.test(ch))r[r.length-1]+=ch;else r.push(ch)}return r};
function tjKind(c,prev){
  if(/[\u064B\u064C\u064D]/.test(c))return"tanwin";
  if(/\u0651/.test(c))return"tasydid";
  if(/[\u0653\u0670]/.test(c))return"mad";
  if(!prev)return"";
  const b=c[0],m=c.slice(1);
  if(m&&m!=="\u0652")return"";
  if(b==="\u0627"&&/\u064E/.test(prev)&&!m)return"mad";
  if(b==="\u064A"&&/\u0650/.test(prev)&&!m)return"mad";
  if(b==="\u0648"&&/\u064F/.test(prev)&&!m)return"mad";
  return"";
}
function tjh(s){const cs=tjSplit(s);return cs.map((c,i)=>{const k=tjKind(c,cs[i-1]);return k?`<span class="tj" data-tj="${k}">${c}</span>`:c}).join("")}
