/* Nomor versi (src/version.js dibuat otomatis tiap push oleh tools/make-sw.js) */
{const verLine=(c)=>`<p class="text-center text-mute text-[11px] font-bold ${c}">QURO v${APP_VERSION} · ${APP_DATE}</p>`;
const _pf=V.profile,_ab=V.about;V.profile=()=>_pf()+verLine("mt-6 mb-2");V.about=()=>_ab()+verLine("mt-5")}
