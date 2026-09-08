/* Murder Crow — interaction layer. */
(()=>{if(window.__MCL_CROW_INTERACTION_V12__)return;window.__MCL_CROW_INTERACTION_V12__=1;
const css=document.createElement('style');css.textContent=`
.mcl-payment-success-crow{display:inline-block;transform-origin:50% 80%;animation:mclPaymentCrowDance 1.05s cubic-bezier(.2,.9,.25,1) infinite}
@keyframes mclPaymentCrowDance{0%,100%{transform:translateY(5px) rotate(-7deg) scale(.98)}25%{transform:translateY(-9px) rotate(8deg) scale(1.06)}50%{transform:translateY(1px) rotate(-5deg) scale(1)}75%{transform:translateY(-7px) rotate(6deg) scale(1.04)}}
.hero-price{display:none!important}
/* Bigger, easier-to-see 24-hour offer clock. */
.hero .countdown{transform:scale(1.14);transform-origin:center top;margin-bottom:8px}
.hero .countdown span,.hero .countdown b{font-size:1.18em}
.mcl-demo-success{margin-top:14px;padding:20px;border:1px solid var(--line);border-radius:20px;background:#f7f5ee;color:var(--ink);text-align:center}
.mcl-demo-success strong{display:block;font:800 24px/1.05 Manrope;letter-spacing:-.04em;margin-bottom:7px}
.mcl-demo-success p{margin:0;color:var(--muted);font-size:13px}
.mcl-demo-reserve{margin-top:14px;width:100%;border:1px solid #c9c8bf;border-radius:999px;padding:13px 18px;background:transparent;color:var(--ink);font-weight:900;cursor:pointer}
.mcl-seat-note{text-align:center;color:var(--muted);font-size:11px;margin-top:8px}
.mcl-demo-celebration{position:relative;overflow:hidden;margin-top:14px;padding:28px 20px;border:1px solid var(--line);border-radius:24px;background:#f7f5ee;color:var(--ink);text-align:center;animation:mclCelebrateIn .55s cubic-bezier(.2,.9,.25,1)}
.mcl-demo-celebration h2{position:relative;z-index:2;margin:0;font:900 30px/1 Manrope;letter-spacing:-.055em}
.mcl-demo-celebration .mcl-celebrate-main{position:relative;z-index:2;margin:10px 0 0;font-weight:800;font-size:16px}
.mcl-demo-celebration .mcl-celebrate-sub{position:relative;z-index:2;margin:6px 0 0;color:var(--muted);font-size:13px}
.mcl-celebrate-stars{position:absolute;inset:0;pointer-events:none}
.mcl-celebrate-stars i{position:absolute;width:8px;height:8px;border-radius:50%;background:currentColor;animation:mclPop 1.15s ease-out both}
.mcl-celebrate-stars i:nth-child(1){left:8%;top:60%;animation-delay:.02s}.mcl-celebrate-stars i:nth-child(2){left:18%;top:22%;animation-delay:.12s}.mcl-celebrate-stars i:nth-child(3){left:31%;top:72%;animation-delay:.08s}.mcl-celebrate-stars i:nth-child(4){left:46%;top:15%;animation-delay:.16s}.mcl-celebrate-stars i:nth-child(5){left:58%;top:78%;animation-delay:.05s}.mcl-celebrate-stars i:nth-child(6){left:72%;top:20%;animation-delay:.18s}.mcl-celebrate-stars i:nth-child(7){left:84%;top:62%;animation-delay:.1s}.mcl-celebrate-stars i:nth-child(8){left:92%;top:30%;animation-delay:.22s}
@keyframes mclCelebrateIn{from{opacity:0;transform:scale(.92) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes mclPop{0%{opacity:0;transform:translate(0,18px) scale(.2)}25%{opacity:1}100%{opacity:0;transform:translate(var(--dx,0),-42px) scale(1.35)}}
@media(prefers-reduced-motion:reduce){.mcl-demo-celebration{animation:none}.mcl-celebrate-stars i{animation:none;opacity:.5}}
`;
document.head.appendChild(css);

// Fresh 24-hour offer clock. When it reaches 00:00:00, automatically starts another 24 hours.
const countdownKey='murderCrowOfferEndsAtV4';
let end=Number(localStorage.getItem(countdownKey));
const DAY=24*60*60*1000;
if(!end||end<=Date.now()){end=Date.now()+DAY;localStorage.setItem(countdownKey,String(end))}
const update=()=>{const h=document.getElementById('cdh'),m=document.getElementById('cdm'),s=document.getElementById('cds');if(!h||!m||!s)return;let d=end-Date.now();if(d<=0){end=Date.now()+DAY;localStorage.setItem(countdownKey,String(end));d=DAY}const hours=Math.floor(d/36e5);d%=36e5;const mins=Math.floor(d/6e4);d%=6e4;const secs=Math.floor(d/1e3);h.textContent=String(hours).padStart(2,'0');m.textContent=String(mins).padStart(2,'0');s.textContent=String(secs).padStart(2,'0')};
update();setInterval(update,1000);

// The hero is a FREE-demo CTA. ₹10 is offered only after the demo form is successfully submitted.
const setHeroCopy=()=>{const b=document.querySelector('.hero .actions .btn-lime');if(b)b.textContent='Claim your FREE Demo →'};setHeroCopy();setTimeout(setHeroCopy,300);setTimeout(setHeroCopy,1000);

const getSteps=()=>({reservation:document.getElementById('reservation'),lead:document.getElementById('leadStep'),payment:document.getElementById('paymentStep'),thankyou:document.getElementById('thankyouStep')});
const ensureDemoFirst=()=>{const x=getSteps();if(!x.reservation||!x.lead)return;x.lead.hidden=false;if(x.payment)x.payment.hidden=true;if(x.thankyou)x.thankyou.hidden=true;};

// Wrap the existing inline openReservation() without rewriting the large homepage.
const wrapOpen=()=>{if(typeof window.openReservation!=='function'||window.openReservation.__mclWrapped)return;const original=window.openReservation;const wrapped=function(){original.apply(this,arguments);ensureDemoFirst();};wrapped.__mclWrapped=true;window.openReservation=wrapped;};
wrapOpen();setTimeout(wrapOpen,50);setTimeout(wrapOpen,300);

const showDemoClaimed=()=>{const x=getSteps();if(!x.reservation||!x.payment)return;ensureDemoFirst();x.lead.hidden=true;x.payment.hidden=true;if(x.thankyou)x.thankyou.hidden=true;let panel=document.getElementById('mcl-demo-claimed');if(!panel){panel=document.createElement('div');panel.id='mcl-demo-claimed';panel.innerHTML='<div class="mcl-demo-celebration"><div class="mcl-celebrate-stars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><h2>🎉 Congratulations!</h2><p class="mcl-celebrate-main">Your FREE Demo Class is claimed.</p><p class="mcl-celebrate-sub">₹0 paid · Your seat is reserved for the demo.</p><button type="button" class="mcl-demo-reserve">Want to secure your seat? Reserve for ₹10 →</button><div class="mcl-seat-note">Seats are filling fast · reservation is completely optional.</div></div>';x.reservation.querySelector('.modal')?.appendChild(panel);panel.querySelector('.mcl-demo-reserve').addEventListener('click',()=>{panel.hidden=true;x.payment.hidden=false;});}panel.hidden=false;};

// HubSpot submits the details first. Never advance automatically into ₹10 payment.
window.addEventListener('hs-form-event:on-submission:success',()=>{setTimeout(showDemoClaimed,0);setTimeout(showDemoClaimed,120);});

// Protect the demo-first state from the older inline payment-step listener. Once the celebration panel exists, leave it alone.
const guard=()=>{const r=document.getElementById('reservation');if(!r||r.getAttribute('aria-hidden')!=='false')return;const claimed=document.getElementById('mcl-demo-claimed');if(claimed)return;const lead=document.getElementById('leadStep');if(lead&&!lead.hidden)return;ensureDemoFirst();};
new MutationObserver(guard).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','aria-hidden']});

// Add one separate custom-payment option to the existing menu without changing its other entries.
const addCustomPayment=()=>{const sub=[...document.querySelectorAll('.mc-menu-sub')].find(el=>el.previousElementSibling?.textContent?.trim()==='Payments');if(!sub||sub.querySelector('[data-mcl-custom-payment]'))return false;const link=document.createElement('a');link.href='/custom-payment.html';link.textContent='Custom payment · ₹10–₹5,000';link.setAttribute('data-mcl-custom-payment','true');sub.appendChild(link);return true;};
addCustomPayment();let menuTries=0;const menuTimer=setInterval(()=>{if(addCustomPayment()||++menuTries>20)clearInterval(menuTimer)},100);
})();