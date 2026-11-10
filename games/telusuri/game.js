/* Telusuri: ikuti garis putus-putus dari atas ke bawah dengan jari. */
function tinit(s){const c=document.getElementById("tc");if(!c)return;const x=c.getContext("2d");x.lineWidth=14;x.lineCap=x.lineJoin="round";x.strokeStyle=x.fillStyle="#3DB54A";let d=0,l;
 const P=e=>{const r=c.getBoundingClientRect();return [(e.clientX-r.left)*300/r.width,(e.clientY-r.top)*320/r.height]};
 c.onpointerdown=e=>{d=1;c.setPointerCapture(e.pointerId);l=P(e);s.pts.push(l);x.beginPath();x.arc(l[0],l[1],7,0,7);x.fill()};
 c.onpointermove=e=>{if(!d)return;const p=P(e),n=Math.max(1,Math.ceil(Math.hypot(p[0]-l[0],p[1]-l[1])/8));for(let i=1;i<=n;i++)s.pts.push([l[0]+(p[0]-l[0])*i/n,l[1]+(p[1]-l[1])*i/n]);x.beginPath();x.moveTo(l[0],l[1]);x.lineTo(p[0],p[1]);x.stroke();l=p};
 c.onpointerup=c.onpointercancel=()=>d=0}
GK.run({
 slug:"telusuri",title:"Telusuri",hint:"Ikuti garis putus-putus dengan jarimu, dari atas ke bawah.",
 init:()=>({ok:0,pts:[]}),
 view:s=>`<div class="relative mx-auto" style="max-width:300px"><svg viewBox="0 0 300 320" class="w-full rounded-3xl bg-soft"><line x1="150" y1="40" x2="150" y2="280" stroke="var(--card)" stroke-width="44" stroke-linecap="round"/><line x1="150" y1="40" x2="150" y2="280" stroke="${s.ok?"#3DB54A":"var(--mute)"}" stroke-width="5" stroke-dasharray="2 12" stroke-linecap="round"/><circle cx="150" cy="40" r="14" fill="#3DB54A"/><text x="150" y="46" text-anchor="middle" font-size="16" font-weight="900" fill="#fff">1</text></svg>${s.ok?"":`<canvas id="tc" width="300" height="320" class="absolute inset-0 w-full h-full" style="touch-action:none"></canvas>`}</div>${s.ok?"":`<div class="flex gap-3 mt-4"><button data-act="g_tr" class="btn btn-w">Ulang</button><button data-act="g_tc" class="btn flex-1">Selesai</button></div>`}`,
 after:s=>tinit(s),
 act(a,i,s,c){
  if(a==="g_tr")s.pts=[];
  if(a==="g_tc"){const g=s.pts;if(g.length<8)return c.toast("Telusuri garisnya dulu ya");let cv=0;for(let j=0;j<=10;j++)if(g.some(p=>Math.hypot(p[0]-150,p[1]-(40+24*j))<30))cv++;const nr=g.filter(p=>Math.abs(p[0]-150)<45&&p[1]>20&&p[1]<300).length/g.length;if(cv>=9&&nr>=.7)c.win();else{c.toast("Hampir! Ikuti garisnya dari atas ke bawah");s.pts=[]}}}
});
