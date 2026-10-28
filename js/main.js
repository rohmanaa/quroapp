/* Mulai aplikasi: logo, splash, render pertama */
$("#logo").innerHTML='<span class="ar text-[30px] leading-none pt-1">ق</span>';$("#bell").innerHTML=ic("bell");
setInterval(()=>{li=(li+1)%LV.length;const e=$("#lv");if(e)e.textContent=LV[li]},3500);
$("#spm").innerHTML=mas("w-44");setTimeout(()=>{const e=$("#sp");if(e)$("#sp [data-act=sp]").click()},3000);
render();
