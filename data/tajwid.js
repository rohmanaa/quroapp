/* Materi tanda baca lanjutan: tanwin, tasydid, mad (contoh kata disusun sendiri untuk latihan) */
// NOTE FOR AI: Arabic is RTL. Keep every word inside ".ar". Each example has exactly ONE rule kind (dipakai kuis).
const TJ=[
{k:"tanwin",t:"Tanwin",snd:"an / in / un",big:"بٌ",
 d:"Tanwin adalah harakat dobel di akhir kata: fathatain (an), kasratain (in), dhammatain (un). Bunyinya ada tambahan “n” di akhir.",
 ex:[["قَلَمٍ","qalamin"],["عِلْمٌ","‘ilmun"],["بَيْتٍ","baitin"],["رَجُلٌ","rajulun"],["وَلَدٌ","waladun"],["كَلْبًا","kalban"]]},
{k:"tasydid",t:"Tasydid",snd:"dobel",big:"بَّ",
 d:"Tasydid (syaddah) menandakan huruf dibaca dobel: huruf pertama mati, huruf kedua berharakat. Bacanya sedikit ditekan.",
 ex:[["ثُمَّ","tsumma"],["رَبِّ","rabbi"],["إِنَّ","inna"],["أَنَّ","anna"],["عَلَّمَ","‘allama"],["قَدَّرَ","qaddara"]]},
{k:"mad",t:"Mad",snd:"panjang",big:"بَا",
 d:"Mad artinya dibaca panjang, kira-kira dua ketukan. Mad thabi’i: fathah bertemu alif, kasrah bertemu ya mati, dhammah bertemu waw mati.",
 ex:[["قَالَ","qāla"],["قِيلَ","qīla"],["يَقُولُ","yaqūlu"],["بَابَ","bāba"],["دِينِ","dīni"],["نُورِ","nūri"]]}
];
/* kata tanpa tanda khusus (jawaban “Tidak ada” di kuis) */
const TJN=[["كَتَبَ","kataba"],["جَلَسَ","jalasa"],["ذَهَبَ","dzahaba"]];
