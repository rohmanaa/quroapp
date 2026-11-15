/* Konfigurasi akun & sinkronisasi (Supabase).
   Kunci "publishable" memang publik (ikut terkirim ke browser); keamanan data dijaga aturan RLS di server (supabase/schema.sql).
   JANGAN pernah menaruh kunci secret / service_role / password database di berkas ini.
   Kosongkan url atau key untuk mematikan fitur akun (aplikasi kembali ke mode tamu di perangkat). */
const QURO_CLOUD=(typeof window!=="undefined"&&window.__QURO_CLOUD)||{
  url:"https://vtkamwhorpdwsaaediwb.supabase.co",
  key:"sb_publishable_X363ct30ARyaISlLG6yKfA_1HvbTivq"};
