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
    // Accept Indian numbers entered as +91XXXXXXXXXX or 91XXXXXXXXXX.
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
          const value = Array.isArray(item?.value)
            ? item.value.join(',')
            : String(item?.value ?? '');
          if (key) next[key] = value;
        });

        lead = {...lead, ...next};

        // Explicitly recognize HubSpot's phone field and common variants.
        const phoneCandidate = next.phone || next.mobilephone || next.mobile ||
          next.mobilephone || next.phonenumber || next.mobilenumber ||
          next.whatsapp || next.whatsappnumber || '';
        const normalized = normalizePhone(phoneCandidate);
        if (/^\d{10}$/.test(normalized)) {
          lead.phone = normalized;
          return true;
        }
      } catch (_) {}

      // HubSpot can finish the success event before the form API exposes
      // the submitted values, so give it a moment and retry.
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
    // Read the submitted values asynchronously; payment is blocked until
    // the actual submitted phone number has been captured.
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

  // Keep the old inline onclick name so the existing button still works.
  window.startRazorpay = async function startCashfree() {
    const button = document.getElementById('payButton');
    if (!button) return;
    button.disabled = true;
    button.textContent = 'Creating secure order…';
    showError('');
    try {
      // If HubSpot has not exposed the submitted values yet, wait briefly
      // instead of immediately rejecting a perfectly valid phone number.
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

  // Remove any stale Razorpay wording from the rendered payment step.
  const updateProviderCopy = () => {
    document.querySelectorAll('body *').forEach(node => {
      if (node.children.length === 0 && /Razorpay/i.test(node.textContent || '')) node.textContent = node.textContent.replace(/Razorpay/gi,'Cashfree');
    });
  };
  updateProviderCopy();
  setTimeout(updateProviderCopy,250);
  setTimeout(updateProviderCopy,1000);
})();
