/* Murder Crow — FREE Demo flow + smooth Crow animation */
(() => {
  if (window.__murderCrowDemoFix) return;
  window.__murderCrowDemoFix = true;

  const FORM_ID = 'eb9a7aa6-e191-4f23-913d-cf24348cb7c2';

  const css = `
    #mcl-demo-success{display:none;text-align:center;padding:4px 0 8px}
    #mcl-demo-success.show{display:block;animation:mclDemoIn .55s cubic-bezier(.2,.8,.2,1) both}
    #mcl-demo-success .mcl-demo-kicker{font:700 11px "Space Mono";letter-spacing:.17em;color:#68772b;text-transform:uppercase;margin-top:4px}
    #mcl-demo-success h2{font:800 clamp(36px,8vw,62px)/.94 Manrope;letter-spacing:-.065em;margin:12px 0 10px}
    #mcl-demo-success p{color:#666a61;font-size:16px;line-height:1.55;max-width:520px;margin:0 auto}
    .mcl-dance-wrap{height:205px;display:grid;place-items:center;position:relative;margin:-4px auto 4px;overflow:hidden}
    .mcl-dance-wrap:after{content:"";position:absolute;width:125px;height:18px;border-radius:50%;background:rgba(17,18,15,.16);bottom:22px;filter:blur(7px);animation:mclShadow 1.15s ease-in-out infinite}
    .mcl-dancing-crow{width:145px;height:145px;position:relative;z-index:2;animation:mclCrowDance 1.15s cubic-bezier(.45,.05,.55,.95) infinite}
    .mcl-crow-body{transform-origin:50% 72%;animation:mclBodyBounce 1.15s ease-in-out infinite}
    .mcl-crow-wing-l{transform-origin:84px 65px;animation:mclWingL .58s ease-in-out infinite alternate}
    .mcl-crow-wing-r{transform-origin:124px 65px;animation:mclWingR .58s ease-in-out infinite alternate-reverse}
    .mcl-crow-head{transform-origin:106px 48px;animation:mclHead 1.15s ease-in-out infinite}
    .mcl-crow-feet{animation:mclFeet 1.15s ease-in-out infinite}
    @keyframes mclDemoIn{from{opacity:0;transform:translateY(16px) scale(.97)}to{opacity:1;transform:none}}
    @keyframes mclCrowDance{0%,100%{transform:translateY(4px) rotate(-4deg)}25%{transform:translateY(-9px) rotate(5deg)}50%{transform:translateY(2px) rotate(-5deg)}75%{transform:translateY(-8px) rotate(4deg)}}
    @keyframes mclBodyBounce{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.96)}}
    @keyframes mclWingL{from{transform:rotate(12deg)}to{transform:rotate(-30deg)}}
    @keyframes mclWingR{from{transform:rotate(-12deg)}to{transform:rotate(30deg)}}
    @keyframes mclHead{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(5deg)}}
    @keyframes mclFeet{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
    @keyframes mclShadow{0%,100%{transform:scaleX(.8);opacity:.35}50%{transform:scaleX(1.05);opacity:.2}}
    #mcl-demo-success .mcl-crew-offer{margin:22px auto 0;border:1px solid #d9d8cf;border-radius:22px;background:#d8e92d;padding:19px;text-align:left;box-shadow:6px 6px 0 #68772b;max-width:560px}
    #mcl-demo-success .mcl-crew-offer b{font:800 22px/1.05 Manrope;letter-spacing:-.035em}
    #mcl-demo-success .mcl-crew-offer span{display:block;color:#30350f;font-size:13px;margin-top:7px}
    #mcl-demo-success .mcl-demo-done{margin-top:18px;width:100%;max-width:560px;border:0;border-radius:999px;background:#11120f;color:#fff;padding:15px 20px;font-weight:800;cursor:pointer}
    @media(prefers-reduced-motion:reduce){.mcl-dancing-crow,.mcl-crow-body,.mcl-crow-wing-l,.mcl-crow-wing-r,.mcl-crow-head,.mcl-crow-feet,.mcl-dance-wrap:after{animation:none!important}}
  `;

  function addStyles(){
    if(document.getElementById('mcl-demo-fix-css')) return;
    const s=document.createElement('style'); s.id='mcl-demo-fix-css'; s.textContent=css; document.head.appendChild(s);
  }

  function dancingCrow(){
    return `<div class="mcl-dance-wrap" aria-hidden="true">
      <svg class="mcl-dancing-crow" viewBox="0 0 180 180" fill="none">
        <g class="mcl-crow-body">
          <ellipse cx="104" cy="91" rx="43" ry="48" fill="#11120f"/>
          <path d="M70 86C52 76 45 58 56 43C66 29 87 31 101 43C113 53 116 72 106 87C97 100 83 97 70 86Z" fill="#171813"/>
          <g class="mcl-crow-head">
            <circle cx="106" cy="48" r="27" fill="#090a08"/>
            <circle cx="115" cy="43" r="4" fill="#d8e92d"/>
            <path d="M128 51L158 59L128 67L136 59L128 51Z" fill="#68772b"/>
          </g>
          <g class="mcl-crow-wing-l"><path d="M83 69C62 64 39 76 35 94C54 103 73 98 89 82L83 69Z" fill="#252821"/></g>
          <g class="mcl-crow-wing-r"><path d="M124 69C145 64 168 76 172 94C153 103 134 98 118 82L124 69Z" fill="#252821"/></g>
          <path d="M76 111C69 125 71 139 83 146" stroke="#68772b" stroke-width="7" stroke-linecap="round"/>
          <path d="M130 111C137 125 135 139 123 146" stroke="#68772b" stroke-width="7" stroke-linecap="round"/>
          <g class="mcl-crow-feet" stroke="#11120f" stroke-width="5" stroke-linecap="round">
            <path d="M78 145L69 151M78 145L78 154M78 145L87 151"/>
            <path d="M125 145L116 151M125 145L125 154M125 145L134 151"/>
          </g>
        </g>
      </svg>
    </div>`;
  }

  function setupModal(){
    addStyles();
    const modal=document.querySelector('#reservation .modal');
    if(!modal) return false;

    const lead=document.getElementById('leadStep');
    const payment=document.getElementById('paymentStep');
    const thank=document.getElementById('thankyouStep');
    if(!lead) return false;

    const step=lead.querySelector('.step');
    const title=lead.querySelector('h2');
    const copy=lead.querySelector(':scope > p');
    const note=lead.querySelector('.form-note');
    if(step) step.textContent='FREE DEMO · YOUR DETAILS';
    if(title) title.textContent='Claim your FREE Demo.';
    if(copy) copy.textContent='No payment. No ₹10 reservation. Just tell us a little about you and we’ll unlock the demo experience.';
    if(note) note.textContent='Your details are submitted securely to HubSpot. There is no payment for the demo.';

    if(payment) payment.setAttribute('hidden','hidden');
    if(thank) thank.setAttribute('hidden','hidden');

    let success=document.getElementById('mcl-demo-success');
    if(!success){
      success=document.createElement('div');
      success.id='mcl-demo-success';
      success.innerHTML=`${dancingCrow()}
        <div class="mcl-demo-kicker">DEMO UNLOCKED · WELCOME TO THE CREW</div>
        <h2>You're in. 🖤</h2>
        <p>Your FREE Demo request is received. Take a look around, then decide what you want to build next.</p>
        <div class="mcl-crew-offer"><b>🐦‍⬛ Crew-only next step</b><span>After the demo, you’ll get the exclusive Murder Crow Crew offer and your next-step options.</span></div>
        <button class="mcl-demo-done" type="button">Back to the Lab →</button>`;
      modal.appendChild(success);
      success.querySelector('.mcl-demo-done').addEventListener('click',()=>{
        success.classList.remove('show');
        lead.hidden=false;
        if(payment) payment.hidden=true;
        if(thank) thank.hidden=true;
        document.body.style.overflow='';
        document.getElementById('reservation')?.setAttribute('aria-hidden','true');
      });
    }
    return true;
  }

  function openDemo(){
    addStyles();
    if(typeof window.openReservation==='function') window.openReservation();
    const reservation=document.getElementById('reservation');
    if(reservation){reservation.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}
    if(!setupModal()) return;
    const lead=document.getElementById('leadStep'),payment=document.getElementById('paymentStep'),thank=document.getElementById('thankyouStep'),success=document.getElementById('mcl-demo-success');
    if(lead) lead.hidden=false; if(payment) payment.hidden=true; if(thank) thank.hidden=true; if(success) success.classList.remove('show');
  }

  function showDemoSuccess(){
    if(!setupModal()) return;
    const lead=document.getElementById('leadStep'),payment=document.getElementById('paymentStep'),thank=document.getElementById('thankyouStep'),success=document.getElementById('mcl-demo-success');
    if(lead) lead.hidden=true;
    if(payment) payment.hidden=true;
    if(thank) thank.hidden=true;
    if(success){success.classList.remove('show');requestAnimationFrame(()=>requestAnimationFrame(()=>success.classList.add('show')));}
  }

  // Replace the old reservation behavior with the free-demo flow.
  window.openReservation=openDemo;
  window.startRazorpay=()=>{};

  // Never send a free-demo click to payment.html.
  document.addEventListener('click',event=>{
    const el=event.target.closest?.('a,button,[role="button"]');
    if(!el) return;
    const href=(el.getAttribute('href')||'').toLowerCase();
    const text=(el.textContent||'').trim().toLowerCase();
    const isPaymentLink=href.includes('/payment.html') || href.includes('payment.html?');
    const isDemoText=/(claim|book|reserve|join|get|start|unlock).*free.*demo|free.*demo.*(claim|book|reserve|join|get|start|unlock)/i.test(text) || /₹?0\s*(rs|inr|rupees)?\s*(demo|class)/i.test(text);
    if(isPaymentLink || isDemoText){
      event.preventDefault();
      event.stopPropagation();
      openDemo();
    }
  },true);

  // HubSpot success: let its own listener finish, then replace the payment step.
  window.addEventListener('hs-form-event:on-submission:success',event=>{
    const detail=event.detail||{};
    if(detail.formId && detail.formId!==FORM_ID) return;
    setTimeout(showDemoSuccess,40);
  });

  // If a demo query is used, open the modal directly.
  if(new URLSearchParams(location.search).get('demo')==='1'){
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(openDemo,80),{once:true});
    else setTimeout(openDemo,80);
  }

  // Remove stale payment-provider wording from the demo modal.
  function cleanDemoCopy(){
    document.querySelectorAll('#reservation *').forEach(node=>{
      if(node.children.length===0 && /payment happens after this step|cashfree|razorpay|₹10 reservation/i.test(node.textContent||'')){
        if(node.closest('#paymentStep')) return;
        node.textContent=(node.textContent||'').replace(/Payment comes after this step\.?/gi,'No payment is required for the demo.').replace(/Payment happens separately through (Cashfree|Razorpay)\.?/gi,'There is no payment for the demo.').replace(/Your details are submitted securely to HubSpot for programme communication\. Payment happens separately through (Cashfree|Razorpay)\.?/gi,'Your details are submitted securely to HubSpot. There is no payment for the demo.');
      }
    });
  }
  setTimeout(cleanDemoCopy,100);
  setTimeout(cleanDemoCopy,700);
})();
