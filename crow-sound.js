/* Murder Crow — interaction layer. */
(()=>{if(window.__MCL_CROW_INTERACTION_V9__)return;window.__MCL_CROW_INTERACTION_V9__=1;
const css=document.createElement('style');css.textContent=`
.mcl-payment-success-crow{display:inline-block;transform-origin:50% 80%;animation:mclPaymentCrowDance 1.05s cubic-bezier(.2,.9,.25,1) infinite}
@keyframes mclPaymentCrowDance{0%,100%{transform:translateY(5px) rotate(-7deg) scale(.98)}25%{transform:translateY(-9px) rotate(8deg) scale(1.06)}50%{transform:translateY(1px) rotate(-5deg) scale(1)}75%{transform:translateY(-7px) rotate(6deg) scale(1.04)}}
.hero-price{display:none!important}
.mcl-demo-first{display:flex;flex-direction:column;gap:10px;margin-top:20px}
.mcl-demo-claim{width:100%;border:0;border-radius:999px;padding:16px 20px;background:var(--olive-bright);color:var(--ink);font-weight:900;cursor:pointer;box-shadow:6px 6px 0 var(--olive);font-size:16px}
.mcl-seat-option{width:100%;border:1px solid #c9c8bf;border-radius:999px;padding:13px 18px;background:transparent;color:var(--ink);font-weight:800;cursor:pointer}
.mcl-seat-note{text-align:center;color:var(--muted);font-size:11px;margin-top:2px}
.mcl-demo-success{margin-top:14px;padding:16px;border:1px solid var(--line);border-radius:18px;background:#f7f5ee;color:var(--ink);text-align:center}
.mcl-demo-success strong{display:block;font:800 22px/1.05 Manrope;letter-spacing:-.04em;margin-bottom:6px}
.mcl-demo-success p{margin:0;color:var(--muted);font-size:13px}
.mcl-demo-reserve{margin-top:14px;width:100%;border:1px solid #c9c8bf;border-radius:999px;padding:13px 18px;background:transparent;color:var(--ink);font-weight:900;cursor:pointer}
`;
document.head.appendChild(css);

// Fresh 54-hour offer clock. A new key prevents the previous 72-hour/local timer from winning.
const countdownKey='murderCrowOfferEndsAtV3';let end=Number(localStorage.getItem(countdownKey));if(!end||end<Date.now()){end=Date.now()+54*60*60*1000;localStorage.setItem(countdownKey,String(end))}
const update=()=>{const h=document.getElementById('cdh'),m=document.getElementById('cdm'),s=document.getElementById('cds');if(!h||!m||!s)return;let d=Math.max(0,end-Date.now());const hours=Math.floor(d/36e5);d%=36e5;const mins=Math.floor(d/6e4);d%=6e4;const secs=Math.floor(d/1e3);h.textContent=String(hours).padStart(2,'0');m.textContent=String(mins).padStart(2,'0');s.textContent=String(secs).padStart(2,'0')};update();setInterval(update,1000);

// The hero is a FREE-demo CTA. ₹10 is offered only after the demo form is successfully submitted.
const setHeroCopy=()=>{const b=document.querySelector('.hero .actions .btn-lime');if(b)b.textContent='Claim your FREE Demo →'};setHeroCopy();setTimeout(setHeroCopy,300);setTimeout(setHeroCopy,1000);

const getSteps=()=>({reservation:document.getElementById('reservation'),lead:document.getElementById('leadStep'),payment:document.getElementById('paymentStep'),thankyou:document.getElementById('thankyouStep')});
const ensureDemoFirst=()=>{const x=getSteps();if(!x.reservation||!x.lead)return; x.lead.hidden=false;if(x.payment)x.payment.hidden=true;if(x.thankyou)x.thankyou.hidden=true;};

// Wrap the existing inline openReservation() without rewriting index.html.
const wrapOpen=()=>{if(typeof window.openReservation!=='function'||window.openReservation.__mclWrapped)return;const original=window.openReservation;const wrapped=function(){original.apply(this,arguments);ensureDemoFirst();};wrapped.__mclWrapped=true;window.openReservation=wrapped;};
wrapOpen();setTimeout(wrapOpen,50);setTimeout(wrapOpen,300);

const showDemoClaimed=()=>{const x=getSteps();if(!x.reservation||!x.payment)return;ensureDemoFirst();x.lead.hidden=true;x.payment.hidden=true;x.thankyou&&(x.thankyou.hidden=true);let panel=document.getElementById('mcl-demo-claimed');if(!panel){panel=document.createElement('div');panel.id='mcl-demo-claimed';panel.innerHTML='<div class="mcl-demo-success"><strong>FREE demo claimed ✓</strong><p>No payment is required for the demo class.</p><button type="button" class="mcl-demo-reserve">Want to secure your seat? Reserve for ₹10 →</button><div class="mcl-seat-note">Seats are filling fast · reservation is completely optional.</div></div>';x.reservation.querySelector('.modal')?.appendChild(panel);panel.querySelector('.mcl-demo-reserve').addEventListener('click',()=>{panel.hidden=true;x.payment.hidden=false;});}panel.hidden=false;};

// HubSpot submits the details first. Never advance automatically into ₹10 payment.
window.addEventListener('hs-form-event:on-submission:success',()=>{setTimeout(showDemoClaimed,0);setTimeout(showDemoClaimed,120);});

// If an older script/deployment exposes the payment step directly, force it back to the demo-first state.
const guard=()=>{const r=document.getElementById('reservation');if(!r||r.getAttribute('aria-hidden')!=='false')return;const p=document.getElementById('paymentStep');const lead=document.getElementById('leadStep');if(lead&&!lead.hidden)return;const claimed=document.getElementById('mcl-demo-claimed');if(!claimed||claimed.hidden)ensureDemoFirst();};
new MutationObserver(guard).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','aria-hidden']});

// Keep this layer passive with respect to actual payment processing.
})();