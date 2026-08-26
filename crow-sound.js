/* Murder Crow — real crow interaction sound.
   Source: American Crow.ogg by G McGrane, Wikimedia Commons, public domain.
   https://commons.wikimedia.org/wiki/File:American_Crow.ogg
*/
(() => {
  if (window.__murderCrowRealSound) return;
  window.__murderCrowRealSound = true;

  const SOURCE = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/American_Crow.ogg';
  const clip = new Audio(SOURCE);
  clip.preload = 'auto';
  clip.volume = 0.22;

  let flightPlayed = false;
  let clickBusy = false;

  const playOne = (duration = 1050) => {
    try {
      clip.pause();
      clip.currentTime = 0;
      const p = clip.play();
      if (p && p.catch) p.catch(() => {});
      window.setTimeout(() => { try { clip.pause(); } catch (_) {} }, duration);
    } catch (_) {}
  };

  const playThree = () => {
    if (clickBusy) return;
    clickBusy = true;
    playOne();
    window.setTimeout(() => playOne(), 1250);
    window.setTimeout(() => { playOne(); window.setTimeout(() => { clickBusy = false; }, 1050); }, 2500);
  };

  const playFlightOnce = () => {
    if (flightPlayed) return;
    flightPlayed = true;
    playOne(1250);
  };

  document.addEventListener('click', (event) => {
    const crow = event.target.closest?.('.crow3d');
    if (crow) { playFlightOnce(); return; }
    const interactive = event.target.closest?.('a, button, .btn, .navcta, [role="button"]');
    if (interactive) playThree();
  }, true);

  // Cashfree migration bridge: keep the existing page markup/button working.
  let lead = {};

  const transitionToPayment = () => {
    const leadStep = document.getElementById('leadStep');
    const paymentStep = document.getElementById('paymentStep');
    if (leadStep) leadStep.hidden = true;
    if (paymentStep) paymentStep.hidden = false;
  };

  window.addEventListener('hs-form-event:on-submission:success', async event => {
    const detail = event.detail || {};
    const expectedFormId = 'eb9a7aa6-e191-4f23-913d-cf24348cb7c2';
    // HubSpot has used slightly different event detail shapes across versions.
    // If a formId is supplied, make sure it is our reservation form; otherwise
    // still handle the success event because this page has one reservation form.
    if (detail.formId && detail.formId !== expectedFormId) return;

    // Move to the payment step immediately. Do not wait for HubSpot field reads.
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
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', () => reject(new Error('Cashfree Checkout failed to load.')), { once: true });
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

  const escape = value => String(value).replace(/[&<>\"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#039;'
  }[c]));

  const verify = async orderId => {
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId })
    });
    return response.json();
  };

  const showError = message => {
    const box = document.getElementById('paymentError');
    if (box) box.innerHTML = message ? `<div class="error">${escape(message)}</div>` : '';
  };

  const showSuccess = () => {
    const paymentStep = document.getElementById('paymentStep');
    const thankyouStep = document.getElementById('thankyouStep');
    if (paymentStep) paymentStep.hidden = true;
    if (thankyouStep) thankyouStep.hidden = false;
  };

  window.startRazorpay = async function startCashfreeBridge() {
    const button = document.getElementById('payButton');
    if (!button) return;
    button.disabled = true;
    button.textContent = 'Creating secure order…';
    showError('');

    try {
      const phone = String(lead.phone || '').replace(/\D/g, '');
      const email = String(lead.email || '').trim();
      const first = lead.firstname || lead.firstName || '';
      const last = lead.lastname || lead.lastName || '';
      if (!/^\d{10}$/.test(phone)) throw new Error('Please include a valid 10-digit phone number in the reservation form before paying.');

      await loadCashfree();
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 1000,
          currency: 'INR',
          order_type: 'reserve',
          customer_phone: phone,
          customer_email: email,
          customer_name: [first, last].filter(Boolean).join(' ') || 'Murder Crow Learner'
        })
      });
      const order = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(order.error || 'Could not create the Cashfree order.');
      if (!order.payment_session_id) throw new Error('Cashfree did not return a payment session. Please try again.');

      const cashfree = Cashfree({ mode: order.mode || 'sandbox' });
      let settled = false;
      let attempts = 0;
      const timer = window.setInterval(async () => {
        if (settled) return;
        attempts += 1;
        try {
          const result = await verify(order.order_id);
          if (result.success) {
            settled = true;
            window.clearInterval(timer);
            showSuccess();
          }
        } catch (_) {}
        if (attempts >= 45) {
          window.clearInterval(timer);
          if (!settled) {
            button.disabled = false;
            button.textContent = 'Pay ₹10 & Reserve →';
            showError('Payment confirmation is taking longer than expected. Please try again.');
          }
        }
      }, 2000);

      button.textContent = 'Opening Cashfree…';
      await cashfree.checkout({ paymentSessionId: order.payment_session_id });
      if (!settled) button.textContent = 'Waiting for payment confirmation…';
    } catch (error) {
      button.disabled = false;
      button.textContent = 'Pay ₹10 & Reserve →';
      showError(error.message || 'Unable to start Cashfree Checkout.');
    }
  };

  // Keep visible provider copy aligned without changing the layout.
  const updateCashfreeCopy = () => {
    document.querySelectorAll('body *').forEach(node => {
      if (node.children.length === 0 && node.textContent.includes('Razorpay')) {
        node.textContent = node.textContent.replace(/Razorpay/g, 'Cashfree');
      }
    });
  };
  window.setTimeout(updateCashfreeCopy, 0);
})();
