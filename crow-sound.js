/* Murder Crow — interaction layer.
   Payment is handled by the dedicated checkout page. This file never charges a user. */
(()=>{if(window.__MCL_CROW_INTERACTION_V8__)return;window.__MCL_CROW_INTERACTION_V8__=1;
const css=document.createElement('style');css.textContent=`
.mcl-payment-success-crow{display:inline-block;transform-origin:50% 80%;animation:mclPaymentCrowDance 1.05s cubic-bezier(.2,.9,.25,1) infinite}
@keyframes mclPaymentCrowDance{0%,100%{transform:translateY(5px) rotate(-7deg) scale(.98)}25%{transform:translateY(-9px) rotate(8deg) scale(1.06)}50%{transform:translateY(1px) rotate(-5deg) scale(1)}75%{transform:translateY(-7px) rotate(6deg) scale(1.04)}}
.hero-price{display:none!important}
.mcl-demo-first{display:flex;flex-direction:column;gap:10px;margin-top:20px}
.mcl-demo-claim{width:100%;border:0;border-radius:999px;padding:16px 20px;background:var(--olive-bright);color:var(--ink);font-weight:900;cursor:pointer;box-shadow:6px 6px 0 var(--olive);font-size:16px}
.mcl-seat-option{width:100%;border:1px solid #c9c8bf;border-radius:999px;padding:13px 18px;background:transparent;color:var(--ink);font-weight:800;cursor:pointer}
.mcl-seat-note{text-align:center;color:var(--muted);font-size:11px;margin-top:2px}
.mcl-demo-success{margin-top:14px;padding:14px 16px;border:1px solid var(--line);border-radius:16px;background:#f7f5ee;color:var(--ink);font-weight:700;font-size:13px;text-align:center}
`;document.head.appendChild(css);

// Keep the first screen focused on the free demo. The programme price remains lower on the page/payment pages.
const countdownKey='murderCrowOfferEndsAtV2';let end=Number(localStorage.getItem(countdownKey));if(!end||end<Date.now()){end=Date.now()+72*60*60*1000;localStorage.setItem(countdownKey,String(end))}
const update=()=>{const h=document.getElementById('cdh'),m=document.getElementById('cdm'),s=document.getElementById('cds');if(!h||!m||!s)return;let d=Math.max(0,end-Date.now());const hours=Math.floor(d/36e5);d%=36e5;const mins=Math.floor(d/6e4);d%=6e4;const secs=Math.floor(d/1e3);h.textContent=String(hours).padStart(2,'0');m.textContent=String(mins).padStart(2,'0');s.textContent=String(secs).padStart(2,'0')};update();setInterval(update,1000);

const textOf=el=>(el?.innerText||el?.textContent||'').replace(/\s+/g,' ').trim();
const visible=el=>{if(!el)return false;const r=el.getBoundingClientRect(),s=getComputedStyle(el);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'};
const isCheckout=el=>/almost there|razorpay|seat reservation|reserve your seat/i.test(textOf(el));
const findModal=()=>[...document.querySelectorAll('[role="dialog"],.modal,.popup,.overlay,.payment-modal,.checkout-modal')].find(el=>visible(el)&&isCheckout(el))||[...document.querySelectorAll('body *')].reverse().find(el=>visible(el)&&isCheckout(el)&&textOf(el).length>80&&textOf(el).length<5000);
let transformed=null;
const makeDemoFirst=()=>{const modal=findModal();if(!modal||modal===transformed)return;if(!/almost there|razorpay|seat reservation/i.test(textOf(modal)))return;transformed=modal;
  const headings=[...modal.querySelectorAll('h1,h2,h3,h4,.step,.kicker')];const step=headings.find(x=>/step\s*02|razorpay/i.test(textOf(x)));if(step)step.textContent='STEP 02 · DEMO FIRST';
  const title=headings.find(x=>/almost there/i.test(textOf(x)));if(title)title.textContent='Your free demo is ready.';
  const body=[...modal.querySelectorAll('p,small')].find(x=>/secure payment|seat remains unconfirmed|payment fails|reservation/i.test(textOf(x)));if(body)body.textContent='Claim your free demo first — no payment is required. Seat reservation is completely optional.';
  const pay=[...modal.querySelectorAll('button,a')].find(x=>/reserve your seat|reserve.*₹10|pay.*₹10|checkout/i.test(textOf(x)));
  if(!pay)return;
  pay.classList.add('mcl-seat-option');pay.textContent='Reserve my seat for ₹10 →';
  const wrap=document.createElement('div');wrap.className='mcl-demo-first';
  const claim=document.createElement('button');claim.type='button';claim.className='mcl-demo-claim';claim.textContent='Claim my FREE demo →';
  const note=document.createElement('div');note.className='mcl-seat-note';note.textContent='Seats are filling fast · reserve only if you want to secure your place';
  claim.addEventListener('click',()=>{try{localStorage.setItem('mclDemoClaimed','1')}catch(_){};wrap.innerHTML='<div class="mcl-demo-success">✓ FREE demo claimed. No payment required.</div><div class="mcl-seat-note">Want to lock your seat too? You can still reserve it for ₹10 below.</div>';});
  pay.parentNode.insertBefore(wrap,pay);wrap.appendChild(claim);wrap.appendChild(pay);wrap.appendChild(note);
};
new MutationObserver(makeDemoFirst).observe(document.documentElement,{subtree:true,childList:true});setTimeout(makeDemoFirst,200);setTimeout(makeDemoFirst,800);setTimeout(makeDemoFirst,1800);

// Keep this layer passive. The dedicated payment flow owns payment success/verification.
})();