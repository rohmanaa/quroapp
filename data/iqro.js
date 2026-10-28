/* Data Iqro: sumber JSON, daftar jilid (JL), cache halaman (IQ), warna jilid (CVH) */
const CVH=[130,200,28,280,345,170],CVP=[100,72,0,0,0,0];
/* ===== Data Iqro (sumber: github.com/dyazincahya/iqro-json, hasil OCR; karya KH. As'ad Humam; non-komersial) ===== */
const IQB="https://cdn.jsdelivr.net/gh/dyazincahya/iqro-json/iqro/easyocr/";
/* ok:1 = data tersedia di repo. n = PERKIRAAN jumlah halaman, sesuaikan dengan isi repo. Iqro 3-6 belum selesai di sumber. */
const JL={1:{ok:1,n:32},2:{ok:1,n:31},3:{ok:0},4:{ok:0},5:{ok:0},6:{ok:0}};
const IQ={"1-1":{level_id:1,level_title:"IQRO' 1",topic:{latin:"A BA",arab:"اَ بَ"},instruction_id:"Bacaan langsung A Bacalah dengan suara pendek Ba dst: Tidak perlu diuraildieja ",instruction_en:"Direct reading A - Ba, etc. No need to spell out. Read with short sounds.",instruction_ar:"القراءة المباشرة أ - ب وهكذا. لا حاجة للتهجئة. اقرأ بصوت قصير.",
content:[[1,1,"A = A","أَ = أَ"],[2,1,"A BA","أَ بَ"],[2,2,"BA A BA","بَ اَ بَ"],[2,3,"A BA A","اَ بَ اَ"],[3,1,"BA A A","بَ اَ اَ"],[3,2,"A A BA","اَ اَ بَ"],[4,1,"BA BA A","بَ بَ اَ"],[5,1,"A BA BA","اَ بَ بَ"],[5,2,"BA A BA","بَ اَ بَ"],[6,1,"A BA A","اَ بَ اَ"],[6,2,"A A A","اَ اَ اَ"],[6,3,"BA BA BA","بَ بَ بَ"],[7,1,"A BA","اَ بَ"],[7,2,"A BA","اَ بَ"]].map(([r,c,l,a],i)=>({order_id:i+1,position:{row:r,col:c},latin:l,arabic:a}))}};
