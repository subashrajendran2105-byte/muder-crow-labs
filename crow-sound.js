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

  // Cashfree migration bridge.
  let lead = {};
  const expectedFormId = 'eb9a7aa6-e191-4f23-913d-cf24348cb7c2';
  const transitionToPayment = () => {
    const leadStep = document.getElementById('leadStep');
    const paymentStep = document.getElementById('paymentStep');
    if (leadStep) leadStep.hidden = true;
    if (paymentStep) paymentStep.hidden = false;
  };

  window.addEventListener('hs-form-event:on-submission:success', async event => {
    const detail = event.detail || {};
    if (detail.formId && detail.formId !== expectedFormId) return;
    transitionToPayment();
    try {
      const form = window.HubSpotFormsV4?.getFormFromEvent(event);
      const values = form ? await form.getFormFieldValues() : [];
      lead = {};
      values.forEach(item => {
        const key = String(item.name || '').split('/').pop().toLowerCase();
        lead[key] = Array.isArray(item.value) ? item.value.join(',') : String(item.value ?? '');
      });
    } catch (_) {}
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
      const phone = String(lead.phone || lead.mobilephone || lead.mobile_phone || lead.phone_number || lead.whatsapp || '').replace(/\D/g,'');
      const email = String(lead.email || '').trim();
      const first = lead.firstname || lead.first_name || '';
      const last = lead.lastname || lead.last_name || '';
      if (!/^\d{10}$/.test(phone)) throw new Error('Please include a valid 10-digit phone number in the reservation form before paying.');
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
