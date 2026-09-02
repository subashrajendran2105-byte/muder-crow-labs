/* Murder Crow — interaction layer.
   Payment is handled by payment.html + Cashfree. This file must never intercept checkout. */
(()=>{if(window.__MCL_CROW_INTERACTION_V7__)return;window.__MCL_CROW_INTERACTION_V7__=1;
const css=document.createElement('style');css.textContent=`.mcl-payment-success-crow{display:inline-block;transform-origin:50% 80%;animation:mclPaymentCrowDance 1.05s cubic-bezier(.2,.9,.25,1) infinite}@keyframes mclPaymentCrowDance{0%,100%{transform:translateY(5px) rotate(-7deg) scale(.98)}25%{transform:translateY(-9px) rotate(8deg) scale(1.06)}50%{transform:translateY(1px) rotate(-5deg) scale(1)}75%{transform:translateY(-7px) rotate(6deg) scale(1.04)}}
/* Homepage conversion cleanup: keep the first screen focused on the free demo/seat reservation. The programme price remains visible lower on the page and inside payment/details pages. */
.hero-price{display:none!important}
`;document.head.appendChild(css);
// Reset the homepage offer clock to a fresh 72-hour window without touching payment logic.
const countdownKey='murderCrowOfferEndsAtV2';let end=Number(localStorage.getItem(countdownKey));if(!end||end<Date.now()){end=Date.now()+72*60*60*1000;localStorage.setItem(countdownKey,String(end))}
const update=()=>{const h=document.getElementById('cdh'),m=document.getElementById('cdm'),s=document.getElementById('cds');if(!h||!m||!s)return;let d=Math.max(0,end-Date.now());const hours=Math.floor(d/36e5);d%=36e5;const mins=Math.floor(d/6e4);d%=6e4;const secs=Math.floor(d/1e3);h.textContent=String(hours).padStart(2,'0');m.textContent=String(mins).padStart(2,'0');s.textContent=String(secs).padStart(2,'0')};update();setInterval(update,1000);
// Keep this layer passive. The dedicated payment success page owns the celebration.
})();