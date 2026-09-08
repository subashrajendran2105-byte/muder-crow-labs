/* Murder Crow — interaction layer. */
(()=>{if(window.__MCL_CROW_INTERACTION_V13__)return;window.__MCL_CROW_INTERACTION_V13__=1;
const css=document.createElement('style');css.textContent=`
.mcl-payment-success-crow{display:inline-block;transform-origin:50% 80%;animation:mclPaymentCrowDance 1.05s cubic-bezier(.2,.9,.25,1) infinite}
@keyframes mclPaymentCrowDance{0%,100%{transform:translateY(5px) rotate(-7deg) scale(.98)}25%{transform:translateY(-9px) rotate(8deg) scale(1.06)}50%{transform:translateY(1px) rotate(-5deg) scale(1)}75%{transform:translateY(-7px) rotate(6deg) scale(1.04)}}
.hero-price{display:none!important}
.countdown{padding:11px 16px!important;gap:13px!important}
.countdown span{min-width:58px!important}
.countdown b{font-size:24px!important;line-height:1!important;letter-spacing:-.045em!important}
.countdown small{font-size:8px!important;margin-top:5px!important}
.countdown i{font-size:16px!important}
.mcl-demo-success{margin-top:14px;padding:20px;border:1px solid var(--line);border-radius:20px;background:#f7f5ee;color:var(--ink);text-align:center;position:relative;overflow:hidden}
.mcl-demo-success strong{display:block;font:800 24px/1.05 Manrope;letter-spacing:-.04em;margin-bottom:6px}
.mcl-demo-success p{margin:0;color:var(--muted);font-size:13px}
.mcl-demo-reserve{margin-top:16px;width:100%;border:1px solid #c9c8bf;border-radius:999px;padding:14px 18px;background:var(--olive-bright);color:var(--ink);font-weight:900;cursor:pointer;box-shadow:5px 5px 0 var(--olive)}
.mcl-seat-note{text-align:center;color:var(--muted);font-size:11px;margin-top:9px}
.mcl-confetti{position:absolute;width:8px;height:14px;border-radius:2px;top:-20px;pointer-events:none;animation:mclConfetti 900ms ease-out forwards}
@keyframes mclConfetti{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(180px) rotate(260deg);opacity:0}}
#paymentStep .reserve-continue{background:var(--olive-bright)!important;color:var(--ink)!important}
`;
document.head.appendChild(css);

// One stable 24-hour offer clock. A fresh 24 hours starts automatically at zero.
const countdownKey='murderCrowOfferEndsAtV4';
const DAY=24*60*60*1000;
let end=Number(localStorage.getItem(countdownKey));
if(!Number.isFinite(end)||end<=Date.now()){end=Date.now()+DAY;localStorage.setItem(countdownKey,String(end))}
try{['murderCrowOfferEndsAt','murderCrowOfferEndsAtV2','murderCrowOfferEndsAtV3'].forEach(k=>localStorage.removeItem(k))}catch(e){}
let last='';
const updateCountdown=()=>{
 const h=document.getElementById('cdh'),m=document.getElementById('cdm'),s=document.getElementById('cds');if(!h||!m||!s)return;
 let remaining=end-Date.now();
 if(remaining<=0){end=Date.now()+DAY;localStorage.setItem(countdownKey,String(end));remaining=DAY}
 let d=remaining;const hours=Math.floor(d/3600000);d%=3600000;const mins=Math.floor(d/60000);d%=60000;const secs=Math.floor(d/1000);
 const vals=[String(hours).padStart(2,'0'),String(mins).padStart(2,'0'),String(secs).padStart(2,'0')];const next=vals.join('|');
 if(next!==last){h.textContent=vals[0];m.textContent=vals[1];s.textContent=vals[2];last=next}
};
updateCountdown();setInterval(updateCountdown,250);

// Keep the legacy inline countdown from visibly overwriting the new 24-hour clock.
const countdownGuard=new MutationObserver(()=>updateCountdown());
['cdh','cdm','cds'].forEach(id=>{const el=document.getElementById(id);if(el)countdownGuard.observe(el,{childList:true,characterData:true,subtree:true})});

const setHeroCopy=()=>{const b=document.querySelector('.hero .actions .btn-lime');if(b)b.textContent='Claim your FREE Demo →'};setHeroCopy();setTimeout(setHeroCopy,300);setTimeout(setHeroCopy,1000);

const getSteps=()=>({reservation:document.getElementById('reservation'),lead:document.getElementById('leadStep'),payment:document.getElementById('paymentStep'),thankyou:document.getElementById('thankyouStep')});
const ensureDemoFirst=()=>{const x=getSteps();if(!x.reservation||!x.lead)return;x.lead.hidden=false;if(x.payment)x.payment.hidden=true;if(x.thankyou)x.thankyou.hidden=true;};
const wrapOpen=()=>{if(typeof window.openReservation!=='function'||window.openReservation.__mclWrapped)return;const original=window.openReservation;const wrapped=function(){original.apply(this,arguments);ensureDemoFirst()};wrapped.__mclWrapped=true;window.openReservation=wrapped};
wrapOpen();setTimeout(wrapOpen,50);setTimeout(wrapOpen,300);

const celebrate=panel=>{
 if(!panel)return;
 for(let i=0;i<18;i++){
  const c=document.createElement('span');c.className='mcl-confetti';c.style.left=(5+Math.random()*90)+'%';c.style.animationDelay=(Math.random()*180)+'ms';c.style.transform='rotate('+(Math.random()*180)+'deg)';c.style.background=['#d8e92d','#68772b','#d9d6ff','#11120f'][i%4];panel.appendChild(c);setTimeout(()=>c.remove(),1300)
 }
};

const showDemoClaimed=()=>{const x=getSteps();if(!x.reservation||!x.payment)return;ensureDemoFirst();x.lead.hidden=true;x.payment.hidden=true;if(x.thankyou)x.thankyou.hidden=true;let panel=document.getElementById('mcl-demo-claimed');if(!panel){panel=document.createElement('div');panel.id='mcl-demo-claimed';panel.innerHTML='<div class="mcl-demo-success"><strong>🎉 Congratulations!</strong><p>Your FREE Demo Class is claimed — <b>₹0 paid.</b></p><button type="button" class="mcl-demo-reserve">Reserve your seat for ₹10 →</button><div class="mcl-seat-note">Seats are filling fast · reservation is completely optional.</div></div>';x.reservation.querySelector('.modal')?.appendChild(panel);panel.querySelector('.mcl-demo-reserve').addEventListener('click',()=>{panel.hidden=true;x.lead.hidden=true;x.payment.hidden=false;x.thankyou.hidden=true;const pay=document.getElementById('payButton');if(pay){pay.disabled=false;pay.textContent='Pay ₹10 & Reserve →';pay.setAttribute('aria-label','Pay ₹10 and reserve your seat')}const step=x.payment.querySelector('.step');if(step)step.textContent='STEP 02 · ₹10 SEAT RESERVATION';const heading=x.payment.querySelector('h2');if(heading)heading.textContent='Reserve your seat.';const note=x.payment.querySelector('.form-note');if(note)note.textContent='Secure ₹10 payment. Your reservation is adjusted against the final programme fee.'});}panel.hidden=false;celebrate(panel)};
window.addEventListener('hs-form-event:on-submission:success',()=>{setTimeout(showDemoClaimed,0);setTimeout(showDemoClaimed,120)});

// Never allow the old inline HubSpot listener to turn the free-demo result directly into payment.
const guard=()=>{const r=document.getElementById('reservation');if(!r||r.getAttribute('aria-hidden')!=='false')return;const claimed=document.getElementById('mcl-demo-claimed');if(claimed)return;const lead=document.getElementById('leadStep');if(lead&&!lead.hidden)return;ensureDemoFirst()};
new MutationObserver(guard).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','aria-hidden']});

// Add one separate custom-payment option to the existing menu.
const addCustomPayment=()=>{const sub=[...document.querySelectorAll('.mc-menu-sub')].find(el=>el.previousElementSibling?.textContent?.trim()==='Payments');if(!sub||sub.querySelector('[data-mcl-custom-payment]'))return false;const link=document.createElement('a');link.href='/custom-payment.html';link.textContent='Custom payment · ₹10–₹5,000';link.setAttribute('data-mcl-custom-payment','true');sub.appendChild(link);return true};
addCustomPayment();let menuTries=0;const menuTimer=setInterval(()=>{if(addCustomPayment()||++menuTries>20)clearInterval(menuTimer)},100);
})();