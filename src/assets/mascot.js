/* Maskot: burung hud-hud (WebP transparan di src/assets/mascot/).
   mas(kelas, mood): kelas = ukuran Tailwind (mis. "w-32"); mood = nama berkas tanpa .webp:
   utama, melambai, senang, semangat, ngantuk, sedih, rayakan, bingung, atau iqro1..iqro6 (aksesori tiap jilid).
   Nama yang tidak dikenal jatuh ke "utama". */
const MAS_MOOD=["utama","melambai","senang","semangat","ngantuk","sedih","rayakan","bingung","iqro1","iqro2","iqro3","iqro4","iqro5","iqro6"];
const mas=(c="w-32",m="utama")=>`<img class="mas ${c}" src="src/assets/mascot/${MAS_MOOD.includes(m)?m:"utama"}.webp" alt="" aria-hidden="true" decoding="async" draggable="false" style="height:auto">`;
