/* Murder Crow — interaction layer. */
(()=>{if(window.__MCL_CROW_INTERACTION_V12__)return;window.__MCL_CROW_INTERACTION_V12__=1;
const css=document.createElement('style');css.textContent=`
.mcl-payment-success-crow{display:inline-block;transform-origin:50% 80%;animation:mclPaymentCrowDance 1.05s cubic-bezier(.2,.9,.25,1) infinite}
@keyframes mclPaymentCrowDance{0%,100%{transform:translateY(5px) rotate(-7deg) scale(.98)}25%{transform:translateY(-9px) rotate(8deg) scale(1.06)}50%{transform:translateY(1px) rotate(-5deg) scale(1)}75%{transform:translateY(-7px) rotate(6deg) scale(1.04)}}
.hero-price{display:none!important}
.countdown{padding:11px 16px!important;gap:13px!important}
.countdown span{min-width:58px!important}
.countdown b{font-size:24px!important;line-height:1!important;letter-spacing:-.045em!important}
.countdown small{font-size:8px!important;margin-top:5px!important}
.countdown i{font-size:16px!important}
.mcl-demo-success{margin-top:14px;padding:16px;border:1px solid var(--line);border-radius:18px;background:#f7f5ee;color:var(--ink);text-align:center}
.mcl-demo-success strong{display:block;font:800 22px/1.05 Manrope;letter-spacing:-.04em;margin-bottom:6px}
.mcl-demo-success p{margin:0;color:var(--muted);font-size:13px}
.mcl-demo-reserve{margin-top:14px;width:100%;border:1px solid #c9c8bf;border-radius:999px;padding:13px 18px;background:transparent;color:var(--ink);font-weight:900;cursor:pointer}
.mcl-seat-note{text-align:center;color:var(--muted);font-size:11px;margin-top:8px}
`;
document.head.appendChild(css);

// One stable 24-hour offer clock. It automatically starts a fresh 24 hours at 00:00:00.
// V4 is intentionally isolated from every previous countdown key.
const countdownKey='murderCrowOfferEndsAtV4';
const DAY=24*60*60*1000;
let end=Number(localStorage.getItem(countdownKey));
if(!Number.isFinite(end)||end<=Date.now()){end=Date.now()+DAY;localStorage.setItem(countdownKey,String(end))}
// Remove legacy clocks so old cached values cannot be reused by this layer.
try{['murderCrowOfferEndsAt','murderCrowOfferEndsAtV2','murderCrowOfferEndsAtV3'].forEach(k=>localStorage.removeItem(k))}catch(e){}
let last='';
const updateCountdown=()=>{
  const h=document.getElementById('cdh'),m=document.getElementById('cdm'),s=document.getElementById('cds');
  if(!h||!m||!s)return;
  let remaining=end-Date.now();
  if(remaining<=0){
    end=Date.now()+DAY;
    localStorage.setItem(countdownKey,String(end));
    remaining=DAY;
  }
  let d=remaining;
  const hours=Math.floor(d/3600000);d%=3600000;
  const mins=Math.floor(d/60000);d%=60000;
  const secs=Math.floor(d/1000);
  const next=String(hours).padStart(2,'0')+'|'+String(mins).padStart(2,'0')+'|'+String(secs).padStart(2,'0');
  if(next!==last){
    h.textContent=String(hours).padStart(2,'0');
    m.textContent=String(mins).padStart(2,'0');
    s.textContent=String(secs).padStart(2,'0');
    last=next;
  }
};
updateCountdown();
// Run faster than the legacy inline timer so the visible countdown cannot fight it.
setInterval(updateCountdown,250);

const setHeroCopy=()=>{const b=document.querySelector('.hero .actions .btn-lime');if(b)b.textContent='Claim your FREE Demo →'};setHeroCopy();setTimeout(setHeroCopy,300);setTimeout(setHeroCopy,1000);

const getSteps=()=>({reservation:document.getElementById('reservation'),lead:document.getElementById('leadStep'),payment:document.getElementById('paymentStep'),thankyou:document.getElementById('thankyouStep')});
const ensureDemoFirst=()=>{const x=getSteps();if(!x.reservation||!x.lead)return;x.lead.hidden=false;if(x.payment)x.payment.hidden=true;if(x.thankyou)x.thankyou.hidden=true;};
const wrapOpen=()=>{if(typeof window.openReservation!=='function'||window.openReservation.__mclWrapped)return;const original=window.openReservation;const wrapped=function(){original.apply(this,arguments);ensureDemoFirst();};wrapped.__mclWrapped=true;window.openReservation=wrapped;};
wrapOpen();setTimeout(wrapOpen,50);setTimeout(wrapOpen,300);

const showDemoClaimed=()=>{const x=getSteps();if(!x.reservation||!x.payment)return;ensureDemoFirst();x.lead.hidden=true;x.payment.hidden=true;if(x.thankyou)x.thankyou.hidden=true;let panel=document.getElementById('mcl-demo-claimed');if(!panel){panel=document.createElement('div');panel.id='mcl-demo-claimed';panel.innerHTML='<div class="mcl-demo-success"><strong>FREE demo claimed ✓</strong><p>No payment is required for the demo class.</p><button type="button" class="mcl-demo-reserve">Want to secure your seat? Reserve for ₹10 →</button><div class="mcl-seat-note">Seats are filling fast · reservation is completely optional.</div></div>';x.reservation.querySelector('.modal')?.appendChild(panel);panel.querySelector('.mcl-demo-reserve').addEventListener('click',()=>{panel.hidden=true;x.payment.hidden=false;});}panel.hidden=false;};
window.addEventListener('hs-form-event:on-submission:success',()=>{setTimeout(showDemoClaimed,0);setTimeout(showDemoClaimed,120);});
const guard=()=>{const r=document.getElementById('reservation');if(!r||r.getAttribute('aria-hidden')!=='false')return;const claimed=document.getElementById('mcl-demo-claimed');if(claimed)return;const lead=document.getElementById('leadStep');if(lead&&!lead.hidden)return;ensureDemoFirst();};
new MutationObserver(guard).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','aria-hidden']});

const addCustomPayment=()=>{const sub=[...document.querySelectorAll('.mc-menu-sub')].find(el=>el.previousElementSibling?.textContent?.trim()==='Payments');if(!sub||sub.querySelector('[data-mcl-custom-payment]'))return false;const link=document.createElement('a');link.href='/custom-payment.html';link.textContent='Custom payment · ₹10–₹5,000';link.setAttribute('data-mcl-custom-payment','true');sub.appendChild(link);return true;};
addCustomPayment();let menuTries=0;const menuTimer=setInterval(()=>{if(addCustomPayment()||++menuTries>20)clearInterval(menuTimer)},100);
})();