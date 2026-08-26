/* Murder Crow — crow sound only on the About menu item. */
(() => {
  if (window.__murderCrowSoundLoaded) return;
  window.__murderCrowSoundLoaded = true;

  const clip = new Audio('https://commons.wikimedia.org/wiki/Special:Redirect/file/American_Crow.ogg');
  clip.preload = 'auto';
  clip.volume = 0.22;

  const playCrow = () => {
    try {
      clip.pause();
      clip.currentTime = 0;
      const p = clip.play();
      if (p?.catch) p.catch(() => {});
      window.setTimeout(() => { try { clip.pause(); } catch (_) {} }, 1050);
    } catch (_) {}
  };

  // ONLY the About item triggers the crow sound.
  document.addEventListener('click', event => {
    const el = event.target.closest?.('a,button,[role="button"]');
    if (!el) return;
    const text = (el.textContent || '').trim().toLowerCase();
    const aria = (el.getAttribute('aria-label') || '').trim().toLowerCase();
    const href = (el.getAttribute('href') || '').toLowerCase();
    if (text === 'about' || aria === 'about' || href.includes('#about') || href.includes('/about')) playCrow();
  }, true);

  let lead = {};
  const expectedFormId = 'eb9a7aa6-e191-4f23-913d-cf24348cb7c2';

  const normalizePhone = value => {
    let digits = String(value ?? '').replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
    if (digits.length > 10) digits = digits.slice(-10);
    return digits;
  };

  const normalizeKey = value => String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

  const readHubSpotValues = async event => {
    const form = window.HubSpotFormsV4?.getFormFromEvent(event);
    if (!form?.getFormFieldValues) return false;
    for (let attempt = 0; attempt < 6; attempt++) {
      try {
        const values = await form.getFormFieldValues();
        const next = {};
        values.forEach(item => {
          const rawName = String(item?.name || '');
          const key = normalizeKey(rawName.split('/').pop());
          const value = Array.isArray(item?.value) ? item.value.join(',') : String(item?.value ?? '');
          if (key) next[key] = value;
        });
        lead = {...lead, ...next};
        const phoneCandidate = next.phone || next.mobilephone || next.mobile || next.phonenumber || next.mobilenumber || next.whatsapp || next.whatsappnumber || '';
        const normalized = normalizePhone(phoneCandidate);
        if (/^\d{10}$/.test(normalized)) { lead.phone = normalized; return true; }
      } catch (_) {}
      await new Promise(resolve => setTimeout(resolve, 250));
    }
    return false;
  };

  const transitionToPayment = () => {
    const leadStep = document.getElementById('leadStep');
    const paymentStep = document.getElementById('paymentStep');
    if (leadStep) leadStep.hidden = true;
    if (paymentStep) paymentStep.hidden = false;
  };

  window.addEventListener('hs-form-event:on-submission:success', event => {
    const detail = event.detail || {};
    if (detail.formId && detail.formId !== expectedFormId) return;
    transitionToPayment();
    readHubSpotValues(event);
  });

  const loadCashfree = () => new Promise((resolve, reject) => {
    if (typeof window.Cashfree === 'function') return resolve();
    const existing = document.querySelector('script[data-mcl-cashfree]');
    if (existing) {
      existing.addEventListener('load', resolve, {once:true});
      existing.addEventListener('error', () => reject(new Error('Cashfree Checkout failed to load.')), {once:true});
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.dataset.mclCashfree = 'true';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Cashfree Checkout failed to load.'));
    document.head.appendChild(script);
  });

  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const showError = message => {
    const box = document.getElementById('paymentError');
    if (box) box.innerHTML = message ? `<div class="error">${escape(message)}</div>` : '';
  };
  const verify = async orderId => {
    const r = await fetch('/api/verify-payment',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({order_id:orderId})});
    return r.json();
  };
  const showSuccess = () => {
    const paymentStep = document.getElementById('paymentStep');
    const thankyouStep = document.getElementById('thankyouStep');
    if (paymentStep) paymentStep.hidden = true;
    if (thankyouStep) thankyouStep.hidden = false;
  };

  window.startRazorpay = async function startCashfree() {
    const button = document.getElementById('payButton');
    if (!button) return;
    button.disabled = true;
    button.textContent = 'Creating secure order…';
    showError('');
    try {
      if (!/^\d{10}$/.test(normalizePhone(lead.phone))) {
        const formFrame = document.querySelector('.hs-form-frame');
        if (formFrame) {
          const formId = formFrame.getAttribute('data-form-id');
          if (formId === expectedFormId && window.HubSpotFormsV4?.getForms) {
            for (let attempt = 0; attempt < 8 && !/^\d{10}$/.test(normalizePhone(lead.phone)); attempt++) {
              try {
                const forms = window.HubSpotFormsV4.getForms();
                const form = forms?.find(f => f?.getFormFieldValues);
                if (form) {
                  const values = await form.getFormFieldValues();
                  values.forEach(item => {
                    const key = normalizeKey(String(item?.name || '').split('/').pop());
                    const value = Array.isArray(item?.value) ? item.value.join(',') : String(item?.value ?? '');
                    if (key) lead[key] = value;
                  });
                  lead.phone = normalizePhone(lead.phone || lead.mobilephone || lead.mobile || lead.phonenumber || lead.mobilenumber || lead.whatsapp || lead.whatsappnumber);
                }
              } catch (_) {}
              if (!/^\d{10}$/.test(normalizePhone(lead.phone))) await new Promise(resolve => setTimeout(resolve, 250));
            }
          }
        }
      }
      const phone = normalizePhone(lead.phone || lead.mobilephone || lead.mobile || lead.phonenumber || lead.mobilenumber || lead.whatsapp || lead.whatsappnumber);
      const email = String(lead.email || '').trim();
      const first = lead.firstname || lead.first_name || '';
      const last = lead.lastname || lead.last_name || '';
      if (!/^\d{10}$/.test(phone)) throw new Error('We could not read the phone number from the submitted form. Please go back, enter your 10-digit mobile number, and submit the form again.');
      await loadCashfree();
      const orderResponse = await fetch('/api/create-order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({amount:1000,currency:'INR',order_type:'reserve',customer_phone:phone,customer_email:email,customer_name:[first,last].filter(Boolean).join(' ')||'Murder Crow Learner'})});
      const order = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(order.error || 'Could not create the Cashfree order.');
      if (!order.payment_session_id) throw new Error('Cashfree did not return a payment session. Please try again.');
      const cashfree = Cashfree({mode:order.mode || 'sandbox'});
      let settled = false;
      let attempts = 0;
      const timer = window.setInterval(async () => {
        if (settled) return;
        attempts++;
        try {
          const result = await verify(order.order_id);
          if (result.success) { settled = true; window.clearInterval(timer); showSuccess(); }
        } catch (_) {}
        if (attempts >= 45) {
          window.clearInterval(timer);
          if (!settled) { button.disabled=false; button.textContent='Pay ₹10 & Reserve →'; showError('Payment confirmation is taking longer than expected. Please try again.'); }
        }
      },2000);
      button.textContent='Opening Cashfree…';
      await cashfree.checkout({paymentSessionId:order.payment_session_id});
      if (!settled) button.textContent='Waiting for payment confirmation…';
    } catch (error) {
      button.disabled=false;
      button.textContent='Pay ₹10 & Reserve →';
      showError(error.message || 'Unable to start Cashfree Checkout.');
    }
  };

  const updateProviderCopy = () => {
    document.querySelectorAll('body *').forEach(node => {
      if (node.children.length === 0 && /Razorpay/i.test(node.textContent || '')) node.textContent = node.textContent.replace(/Razorpay/gi,'Cashfree');
    });
  };
  updateProviderCopy();
  setTimeout(updateProviderCopy,250);
  setTimeout(updateProviderCopy,1000);

  /* ================================================================
     MURDER CROW — lightweight website assistant + query support
     No API key is exposed in the browser. It answers verified basics
     from the site's own content and routes specific questions to email.
     ================================================================ */
  const mountCrowChat = () => {
    if (document.getElementById('mcl-crow-chat')) return;

    const style = document.createElement('style');
    style.textContent = `
      #mcl-crow-chat{position:fixed;right:18px;bottom:18px;z-index:1200;font-family:"DM Sans",sans-serif}
      #mcl-crow-toggle{width:58px;height:58px;border:1px solid #11120f;border-radius:50%;background:#d8e92d;color:#11120f;display:grid;place-items:center;cursor:pointer;box-shadow:5px 5px 0 #11120f;transition:transform .25s ease,box-shadow .25s ease}
      #mcl-crow-toggle:hover{transform:translateY(-3px) rotate(-2deg);box-shadow:7px 8px 0 #11120f}
      #mcl-crow-toggle svg{width:31px;height:31px}
      #mcl-crow-panel{width:min(390px,calc(100vw - 28px));height:min(610px,calc(100vh - 105px));background:#fffefa;border:1px solid #11120f;border-radius:25px;box-shadow:0 24px 70px rgba(17,18,15,.2);overflow:hidden;display:none;flex-direction:column;margin-bottom:14px;transform-origin:bottom right}
      #mcl-crow-panel.open{display:flex;animation:mclCrowIn .25s cubic-bezier(.2,.8,.2,1)}
      @keyframes mclCrowIn{from{opacity:0;transform:translateY(14px) scale(.96)}to{opacity:1;transform:none}}
      .mcl-crow-head{background:#11120f;color:#fff;padding:17px 18px;display:flex;align-items:center;gap:12px}
      .mcl-crow-head-icon{width:38px;height:38px;border-radius:50%;background:#d8e92d;color:#11120f;display:grid;place-items:center;font-size:21px}
      .mcl-crow-head b{display:block;font:800 16px Manrope}.mcl-crow-head small{color:#c9cbc2;font-size:11px}
      .mcl-crow-close{margin-left:auto;background:transparent;border:0;color:#fff;font-size:22px;cursor:pointer}
      .mcl-crow-messages{flex:1;overflow:auto;padding:17px;background:#f7f5ee;scroll-behavior:smooth}
      .mcl-msg{max-width:88%;padding:11px 13px;border-radius:16px;margin:0 0 10px;font-size:13px;line-height:1.45;white-space:pre-wrap}
      .mcl-msg.bot{background:#fffefa;border:1px solid #d9d8cf;border-bottom-left-radius:5px}.mcl-msg.user{margin-left:auto;background:#d8e92d;border:1px solid #68772b;border-bottom-right-radius:5px}
      .mcl-quick{display:flex;gap:7px;flex-wrap:wrap;margin-top:8px}.mcl-quick button{border:1px solid #b8baaf;background:#fff;border-radius:999px;padding:8px 10px;font-size:11px;font-weight:800;cursor:pointer}.mcl-quick button:hover{background:#d8e92d}
      .mcl-crow-form{border-top:1px solid #d9d8cf;background:#fffefa;padding:11px;display:flex;gap:8px}.mcl-crow-form textarea{flex:1;resize:none;min-height:44px;max-height:100px;border:1px solid #c5c6bd;border-radius:14px;padding:11px;font:13px "DM Sans";outline:none}.mcl-crow-form textarea:focus{border-color:#68772b}.mcl-crow-send{width:45px;border:0;border-radius:13px;background:#11120f;color:#fff;cursor:pointer;font-size:17px}
      .mcl-query{display:none;margin:9px 0 2px;padding:12px;border:1px solid #d9d8cf;border-radius:16px;background:#fffefa}.mcl-query.show{display:block}.mcl-query input,.mcl-query textarea{width:100%;border:1px solid #c5c6bd;border-radius:10px;padding:9px;margin:5px 0;font:12px "DM Sans"}.mcl-query textarea{min-height:70px;resize:vertical}.mcl-query button{border:0;border-radius:999px;background:#11120f;color:#fff;padding:10px 14px;font-weight:800;cursor:pointer}
      @media(max-width:600px){#mcl-crow-chat{right:12px;bottom:12px}#mcl-crow-panel{height:min(650px,calc(100vh - 90px))}}
    `;
    document.head.appendChild(style);

    const root = document.createElement('div');
    root.id = 'mcl-crow-chat';
    root.innerHTML = `
      <div id="mcl-crow-panel" role="dialog" aria-label="Ask the Crow">
        <div class="mcl-crow-head"><div class="mcl-crow-head-icon">🐦‍⬛</div><div><b>Ask the Crow</b><small>Digital marketing, services & Murder Crow #Labs</small></div><button class="mcl-crow-close" aria-label="Close">×</button></div>
        <div class="mcl-crow-messages" id="mcl-crow-messages"></div>
        <div class="mcl-crow-form"><textarea id="mcl-crow-input" placeholder="Ask a basic question…" aria-label="Your question"></textarea><button class="mcl-crow-send" id="mcl-crow-send" aria-label="Send">➜</button></div>
      </div>
      <button id="mcl-crow-toggle" aria-label="Open Ask the Crow" aria-expanded="false"><svg viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M11 31c-2-6 0-14 6-18 7-5 17-4 22 2l-3 5 5 2-6 5c-1 8-7 12-15 11l-3 5-4-7c-2-1-2-3-2-5Z"/><circle cx="31" cy="19" r="2.2" fill="#d8e92d"/><path d="M37 25l8 2-8 3Z" fill="#d8e92d"/></svg></button>`;
    document.body.appendChild(root);

    const panel = root.querySelector('#mcl-crow-panel');
    const toggle = root.querySelector('#mcl-crow-toggle');
    const close = root.querySelector('.mcl-crow-close');
    const messages = root.querySelector('#mcl-crow-messages');
    const input = root.querySelector('#mcl-crow-input');
    const send = root.querySelector('#mcl-crow-send');

    const addMessage = (text, who='bot') => {
      const div = document.createElement('div'); div.className = `mcl-msg ${who}`; div.textContent = text; messages.appendChild(div); messages.scrollTop = messages.scrollHeight;
      return div;
    };
    const addQuick = (items) => {
      const wrap = document.createElement('div'); wrap.className='mcl-quick';
      items.forEach(item => { const b=document.createElement('button'); b.textContent=item.label; b.onclick=()=>handle(item.prompt || item.label); wrap.appendChild(b); });
      messages.appendChild(wrap); messages.scrollTop=messages.scrollHeight;
    };
    const openQuery = (prefill='') => {
      if (root.querySelector('.mcl-query')) return;
      const q=document.createElement('div'); q.className='mcl-query show'; q.innerHTML=`<b>Send your query to Subash</b><input id="mcl-q-name" placeholder="Your name"><input id="mcl-q-email" type="email" placeholder="Your email"><input id="mcl-q-phone" placeholder="Phone (optional)"><textarea id="mcl-q-text" placeholder="Your query">${escape(prefill)}</textarea><button id="mcl-q-send">Send Query →</button>`;
      messages.appendChild(q); messages.scrollTop=messages.scrollHeight;
      q.querySelector('#mcl-q-send').onclick=()=>{
        const name=q.querySelector('#mcl-q-name').value.trim(), email=q.querySelector('#mcl-q-email').value.trim(), phone=q.querySelector('#mcl-q-phone').value.trim(), text=q.querySelector('#mcl-q-text').value.trim();
        if(!name||!email||!text){alert('Please enter your name, email and query.');return;}
        const subject=encodeURIComponent(`Murder Crow website query — ${name}`);
        const body=encodeURIComponent(`New query from Murder Crow website\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\n\nQuery:\n${text}`);
        window.location.href=`mailto:subash@mudercrowlabs.in?subject=${subject}&body=${body}`;
        q.querySelector('#mcl-q-send').textContent='Opening email…';
      };
    };

    const knowledge = [
      {keys:['digital marketing','what is digital marketing'],answer:'Digital marketing is marketing through digital channels to attract, engage and convert people. At Murder Crow #Labs, the learning path is practical and connects strategy, content, SEO/AEO/GEO, social media, paid ads, analytics, CRM, automation and AI.'},
      {keys:['course','program','programme','what do i learn','learn in course','modules'],answer:'The Digital Marketing Programme is designed around practical marketing and growth skills: fundamentals, SEO/AEO/GEO, content, social media, Meta Ads, Google Ads, analytics, funnels, CRM/automation and AI-assisted marketing, with practical work.'},
      {keys:['beginner','beginner friendly','no experience','experience'],answer:'Yes, the programme is designed to be approachable for learners who are building their marketing foundation. If you have a specific background or career goal, send a query and the team can guide you.'},
      {keys:['coding','do i need coding','programming'],answer:'You do not need to be a programmer to start learning digital marketing. Some technical concepts are useful, but the focus is marketing, growth, tools and practical execution.'},
      {keys:['seo','search engine optimization'],answer:'SEO is the practice of improving a website and its content so it can earn relevant visibility in search engines. The course covers SEO as part of a broader search and growth strategy.'},
      {keys:['aeo','answer engine'],answer:'AEO means Answer Engine Optimization: structuring useful information so answer-focused search experiences can understand and surface it.'},
      {keys:['geo','generative engine'],answer:'GEO is Generative Engine Optimization: preparing useful, trustworthy content so AI-powered discovery and answer systems can understand and reference it.'},
      {keys:['meta ads','facebook ads','instagram ads'],answer:'Meta Ads are paid campaigns across Meta platforms such as Facebook and Instagram. The course covers paid-media thinking, campaign structure, creative, targeting and measurement.'},
      {keys:['google ads','google advertising'],answer:'Google Ads is paid search and advertising on Google properties. The course covers paid advertising as part of practical digital marketing and growth.'},
      {keys:['ai','artificial intelligence','ai tools'],answer:'AI is used as a practical marketing assistant: research, ideation, content workflows, analysis, automation and productivity. The goal is to use AI with marketing judgement, not blindly.'},
      {keys:['crm','automation'],answer:'CRM and automation help businesses organize leads, customer information and follow-ups. Murder Crow #Labs covers CRM and automation as part of building repeatable growth systems.'},
      {keys:['playbook','1399','1,399'],answer:'The Growth Marketing Playbook is available as a separate ₹1,399 purchase. The programme offer can also include the Playbook as a stated complimentary value of ₹1,599.'},
      {keys:['27499','27,499','programme price','program price','fee'],answer:'The Digital Marketing Programme has an offer price of ₹27,499. The current offer presentation states a ₹45,000 course value. The separate ₹10 reservation is used to reserve the offer and is intended to be adjusted against the programme fee.'},
      {keys:['45000','45,000','value'],answer:'The programme offer is presented with a stated course value of ₹45,000 and an offer price of ₹27,499. For the exact current offer terms, use the payment page or contact the team.'},
      {keys:['10','₹10','reserve','reservation','claim'],answer:'The ₹10 option is a separate reservation flow. After a successful payment, the reservation confirms the offer journey and the ₹10 is intended to be adjusted against the ₹27,499 programme fee.'},
      {keys:['demo','demo class'],answer:'The programme offer includes a choice of a free demo class or free consultation as the next step. You can choose the route after reserving, subject to the current offer terms.'},
      {keys:['consultation','consult'],answer:'You can request a free consultation through the programme offer flow. If your question is specific, use “Send a query” and Subash can respond.'},
      {keys:['services','service','social media','branding','advertising','digital marketing services','paid media','event'],answer:'Murder Crow #Labs also provides business and growth services. The site includes digital marketing/growth, brand development, CRM & automation, advertising/paid media and event/experience-related services. Pricing depends on scope, so the Crow will not invent a quote.'},
      {keys:['contact','talk to','human','subash','support'],answer:'For a specific question or human support, send a query and it will be prepared for Subash at subash@mudercrowlabs.in. Payment and receipt support can also be directed there.'},
      {keys:['payment','cashfree','receipt','paid','payment failed'],answer:'Payments on the site use Cashfree. For a payment or receipt issue, keep your order/reference details and send a query to Subash at subash@mudercrowlabs.in.'}
    ];

    const handle = (raw) => {
      const question=String(raw||'').trim(); if(!question) return;
      addMessage(question,'user');
      const q=question.toLowerCase();
      const hit=knowledge.find(item=>item.keys.some(k=>q.includes(k)));
      window.setTimeout(()=>{
        if(hit){ addMessage('🐦‍⬛ '+hit.answer); addQuick([{label:'Ask another question',prompt:''},{label:'Send my query',prompt:'I have a specific question for the Murder Crow team.'}]); }
        else { addMessage('🐦‍⬛ I can help with basic questions about the Digital Marketing course, services, Playbook, programme offer and payments. For a specific question I do not want to guess — I can send it to Subash.'); addQuick([{label:'Course basics',prompt:'What will I learn in the digital marketing course?'},{label:'Services',prompt:'What services does Murder Crow #Labs provide?'},{label:'Send my query',prompt:'I have a specific question for the Murder Crow team.'}]); }
        if(q.includes('specific question')||q.includes('send my query')) openQuery(question);
      },180);
    };

    const welcome=()=>{ if(messages.children.length) return; addMessage('🐦‍⬛ Hey. I’m the Crow. Ask me a basic question about the Digital Marketing course, Murder Crow services, Playbook, programme offer or payments. If it’s too specific, I’ll help you send it to Subash.'); addQuick([{label:'Digital Marketing course',prompt:'What will I learn in the digital marketing course?'},{label:'Services',prompt:'What services does Murder Crow #Labs provide?'},{label:'₹27,499 offer',prompt:'How does the ₹27,499 programme offer work?'},{label:'₹1,399 Playbook',prompt:'What is the ₹1,399 Playbook?'}]);};
    toggle.onclick=()=>{const open=panel.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));if(open){welcome();input.focus();}};
    close.onclick=()=>{panel.classList.remove('open');toggle.setAttribute('aria-expanded','false');};
    send.onclick=()=>{const v=input.value;input.value='';handle(v);};
    input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send.click();}});
  };

  // Smooth the existing hero crow animation without changing its playful motion.
  const smoothCrowAnimation = () => {
    const s=document.createElement('style');
    s.textContent='.crow3d{will-change:transform;backface-visibility:hidden;transform:translate3d(0,0,0);animation-timing-function:cubic-bezier(.45,.05,.55,.95)}.crow3d:hover{will-change:transform}.crow3d.pooping{animation-timing-function:cubic-bezier(.2,.8,.2,1)}';
    document.head.appendChild(s);
  };

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>{mountCrowChat();smoothCrowAnimation();});
  else {mountCrowChat();smoothCrowAnimation();}
})();
