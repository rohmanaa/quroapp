function toast(m){const t=$("#t");t.textContent=m;t.classList.remove("hidden");clearTimeout(window.tt);window.tt=setTimeout(()=>t.classList.add("hidden"),2000)}
