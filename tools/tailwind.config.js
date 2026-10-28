/* Konfigurasi build Tailwind (pengganti js/tailwind-config.js yang dulu untuk CDN) */
module.exports={
  content:['./index.html','./js/**/*.js','./assets/**/*.js','./data/**/*.js'],
  theme:{extend:{fontFamily:{sans:['Nunito','system-ui','sans-serif']},colors:{bg:'var(--bg)',card:'var(--card)',ink:'var(--ink)',mute:'var(--mute)',brand:'var(--brand)',on:'var(--on)',soft:'var(--soft)',line:'var(--line)',gold:'#FFB72B',sun:'#FF9F43'}}}
};
