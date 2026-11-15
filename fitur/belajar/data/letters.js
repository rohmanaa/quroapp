/* Data 30 huruf hijaiyah (L), peta warna (CM), normalisasi (BS), halaman latihan (PG) */
// NOTE FOR AI: Arabic is RTL. L / PG are in logical order (index 0 = first letter read, shown at the right). Do not reverse.
const L=[["ا","Alif"],["ب","Ba"],["ت","Ta"],["ث","Tsa"],["ج","Jim"],["ح","Ha"],["خ","Kha"],["د","Dal"],["ذ","Dzal"],["ر","Ra"],["ز","Zay"],["س","Sin"],["ش","Syin"],["ص","Shad"],["ض","Dhad"],["ط","Tha"],["ظ","Zha"],["ع","‘Ain"],["غ","Ghain"],["ف","Fa"],["ق","Qaf"],["ك","Kaf"],["ل","Lam"],["م","Mim"],["ن","Nun"],["و","Wawu"],["ه","Ha"],["ء","Hamzah"],["ي","Ya"],["لا","Lam Alif"]];
const CM={};L.forEach(([c],i)=>CM[c]=i*12);
const BS={"أ":"ا","إ":"ا","آ":"ا","ٱ":"ا","ى":"ي","ة":"ه"};
const PG=[["بَ تَ ثَ","جَ حَ خَ","دَ ذَ رَ"],["زَ سَ شَ","صَ ضَ طَ","ظَ عَ غَ"],["فَ قَ كَ","لَ مَ نَ","وَ هَ يَ"]];
