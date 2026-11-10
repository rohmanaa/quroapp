/* Dimuat di <head> halaman game: terapkan tema aplikasi sebelum halaman tampil (tanpa kedip terang/gelap). */
try{const t=localStorage.getItem("iqro_th");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}
if(window.parent!==window)document.documentElement.classList.add("emb");
