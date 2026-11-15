/* Penulis ZIP minimal (tanpa kompresi) untuk membuat paket stiker .wastickers di browser. zipStore([{n:"nama.ext",d:Uint8Array}]) -> Blob */
const ZCRC=(()=>{const t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
const zcrc32=u=>{let c=0xFFFFFFFF;for(let i=0;i<u.length;i++)c=ZCRC[(c^u[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0};
function zipStore(files){const enc=new TextEncoder(),parts=[],cen=[];let off=0,cs=0;
 for(const f of files){const nb=enc.encode(f.n),crc=zcrc32(f.d),sz=f.d.length;
  const lh=new DataView(new ArrayBuffer(30));lh.setUint32(0,0x04034b50,true);lh.setUint16(4,20,true);lh.setUint16(6,0x0800,true);lh.setUint16(12,0x21,true);lh.setUint32(14,crc,true);lh.setUint32(18,sz,true);lh.setUint32(22,sz,true);lh.setUint16(26,nb.length,true);
  parts.push(lh.buffer,nb,f.d);
  const ch=new DataView(new ArrayBuffer(46));ch.setUint32(0,0x02014b50,true);ch.setUint16(4,20,true);ch.setUint16(6,20,true);ch.setUint16(8,0x0800,true);ch.setUint16(14,0x21,true);ch.setUint32(16,crc,true);ch.setUint32(20,sz,true);ch.setUint32(24,sz,true);ch.setUint16(28,nb.length,true);ch.setUint32(42,off,true);
  cen.push(ch.buffer,nb);cs+=46+nb.length;off+=30+nb.length+sz}
 const end=new DataView(new ArrayBuffer(22));end.setUint32(0,0x06054b50,true);end.setUint16(8,files.length,true);end.setUint16(10,files.length,true);end.setUint32(12,cs,true);end.setUint32(16,off,true);
 return new Blob([...parts,...cen,end.buffer],{type:"application/octet-stream"})}
