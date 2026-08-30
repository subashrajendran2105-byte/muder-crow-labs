/* Murder Crow — interaction layer.
   Payment is handled by payment.html + Cashfree. This file must never intercept checkout. */
(()=>{if(window.__MCL_CROW_INTERACTION_V6__)return;window.__MCL_CROW_INTERACTION_V6__=1;
const css=document.createElement('style');css.textContent=`.mcl-payment-success-crow{display:inline-block;transform-origin:50% 80%;animation:mclPaymentCrowDance 1.05s cubic-bezier(.2,.9,.25,1) infinite}@keyframes mclPaymentCrowDance{0%,100%{transform:translateY(5px) rotate(-7deg) scale(.98)}25%{transform:translateY(-9px) rotate(8deg) scale(1.06)}50%{transform:translateY(1px) rotate(-5deg) scale(1)}75%{transform:translateY(-7px) rotate(6deg) scale(1.04)}}`;document.head.appendChild(css);
// Keep this layer passive. The dedicated payment success page owns the celebration.
})();