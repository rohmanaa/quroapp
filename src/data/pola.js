/* Pola kata untuk latihan Jilid 3–6. Ubah di sini saja, tanpa menyentuh kode lain.
   Kode: S = suku kata biasa (BA) | M = mad panjang (BAA) | T = tanwin, hanya di akhir (BAN) | D = tasydid (BBA) | K = sukun (huruf mati)
   Aturan (pola yang melanggar otomatis dilewati dan muncul peringatan di konsol browser):
   - harus diawali S atau M | T hanya boleh di akhir | tidak boleh ada mad (M) tepat sebelum K atau D | tidak boleh KD atau KK. */
const POLA={
  j3:{satu:["MS","SM","SMS"],campur:["MS","SM","SMS","MSS","SSM"]},           /* mad: halaman per huruf mad, lalu campuran */
  j4:{sukun:["SK","SKS","SSK","SKSK"],tanwin:["ST","SST","MT","SMT"],campur:["ST","SST","MT","SKT","SMT"]},
  j5:{dasar:["SD","SDS","SSD"],campur1:["SD","SDS","SSD"],campur2:["SD","SDS","SSD","SDK","SDT"]},
  j6:["SMS","MSD","SKS","SDT","SMT","SSM","SDS","SSK","SSDS","MSK"],
  j6Halaman:10   /* jumlah halaman Jilid 6 (2 halaman terakhir jadi ujian). Jilid lain jumlah halamannya tetap. */
};
