/* Perbaikan posisi menu bawah di browser mobile */
/* fix: nav sempat turun saat halaman baru dibuka (toolbar browser mobile masih animasi) */
(function(){const nv=document.getElementById('nv');if(!nv)return;
const fix=()=>{nv.style.bottom='0px';nv.style.transform='translateZ(0)';void nv.offsetHeight};
['load','resize','orientationchange','pageshow'].forEach(e=>addEventListener(e,fix));
if(window.visualViewport)visualViewport.addEventListener('resize',fix);
[0,150,400,900].forEach(t=>setTimeout(fix,t))})();
