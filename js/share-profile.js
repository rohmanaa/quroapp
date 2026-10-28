/* Modal bagikan profil */
(function(){
  const $m=()=>document.getElementById('shareProfileModal');
  const url=()=>location.href.split('#')[0];
  const nm=()=>(typeof U!=='undefined'&&U&&U.name)?U.name:'Aku';
  const msg=()=>nm()+' sedang belajar Iqro di QURO. Yuk belajar bareng!';
  let back=null,qrUrl='',ct=null;

  function copyText(t){
    if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(t);
    return new Promise((ok,no)=>{try{const a=document.createElement('textarea');a.value=t;a.setAttribute('readonly','');a.style.cssText='position:fixed;opacity:0';document.body.appendChild(a);a.select();const r=document.execCommand('copy');a.remove();r?ok():no()}catch(e){no(e)}});
  }
  function say(t){if(typeof toast==='function')toast(t)}
  function doCopy(){
    copyText(url()).then(()=>{
      const b=document.getElementById('smCopy');b.textContent='Tersalin ✓';clearTimeout(ct);ct=setTimeout(()=>b.textContent='Salin',1800);say('Link berhasil disalin');
    }).catch(()=>say('Gagal menyalin. Tekan lama link untuk menyalin.'));
  }
  function drawQR(){
    const w=document.getElementById('smQRWrap'),b=document.getElementById('smQR');
    if(qrUrl===url()&&b.firstChild){w.hidden=false;return}
    b.innerHTML='';
    try{new QRCode(b,{text:url(),width:256,height:256,colorDark:'#12301c',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M});qrUrl=url();w.hidden=false}
    catch(e){w.hidden=true}
  }
  function openWin(u){const w=window.open(u,'_blank','noopener,noreferrer');if(!w){doCopy()}}

  window.openShareProfileModal=function(){
    const el=$m();if(!el)return;
    back=document.activeElement;
    const g=(typeof U!=='undefined'&&U&&U.g==='P')?'girl':'boy';
    document.getElementById('smAv').innerHTML=(typeof fe==='function')?fe(g,'w-12 h-12'):'';
    document.getElementById('smName').textContent=nm()==='Aku'?'Profil belajarku':nm();
    document.getElementById('smProg').textContent='Iqro '+jl+' · '+jp(jl)+'%';
    document.getElementById('smUrl').textContent=url().replace(/^https?:\/\//,'');
    drawQR();
    el.classList.add('open');el.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');
    const x=el.querySelector('.sm-x');if(x)x.focus();
  };
  window.closeShareProfileModal=function(){
    const el=$m();if(!el)return;
    el.classList.remove('open');el.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');
    if(back&&back.focus)back.focus();
  };

  document.addEventListener('click',function(e){
    const t=e.target.closest('#shareProfileModal [data-sa]');if(!t)return;
    const a=t.dataset.sa,text=encodeURIComponent(msg()),u=encodeURIComponent(url());
    if(a==='close')closeShareProfileModal();
    else if(a==='copy')doCopy();
    else if(a==='wa')openWin('https://wa.me/?text='+text+'%20'+u);
    else if(a==='tg')openWin('https://t.me/share/url?url='+u+'&text='+text);
    else if(a==='more'){
      if(navigator.share)navigator.share({title:'QURO',text:msg(),url:url()}).catch(()=>{});
      else doCopy();
    }
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeShareProfileModal()});
})();
