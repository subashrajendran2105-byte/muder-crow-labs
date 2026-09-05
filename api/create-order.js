function sendJson(res, status, body) {
  res.status(status).json(body);
}

function cleanSecret(value) {
  return String(value || '')
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .trim();
}

function getCashfreeConfig() {
  const appId = cleanSecret(process.env.CASHFREE_CLIENT_ID);
  const secretKey = cleanSecret(process.env.CASHFREE_CLIENT_SECRET);
  const mode = String(process.env.CASHFREE_ENV || 'production').trim().toLowerCase();
  const baseUrl = mode === 'production' ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg';
  return { appId, secretKey, mode, baseUrl };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const { appId, secretKey, baseUrl, mode } = getCashfreeConfig();
  if (!appId || !secretKey) {
    return sendJson(res, 500, { error: 'Cashfree server configuration is missing.' });
  }

  const body = req.body || {};
  const amount = Number(body.amount);
  const currency = body.currency || 'INR';
  const orderType = ['reserve', 'full', 'playbook', 'custom'].includes(body.order_type) ? body.order_type : 'reserve';
  const phone = String(body.customer_phone || '').replace(/\D/g, '');
  const email = String(body.customer_email || '').trim();
  const name = String(body.customer_name || 'Murder Crow Learner').trim();
  const crewSize = Math.min(20, Math.max(1, Number(body.crew_size || 1)));
  const rawMembers = Array.isArray(body.crew_members) ? body.crew_members : [];
  const crewMembers = rawMembers.slice(0, 19).map(m => ({
    name: String(m?.name || '').trim().slice(0, 100),
    phone: String(m?.phone || '').replace(/\D/g, '').slice(-10)
  }));

  // Fixed product amounts remain protected. Custom payments accept ₹10–₹5,000 only.
  const allowedAmounts = { reserve: 1000, playbook: 79900, full: 2699900 };
  const isCustom = orderType === 'custom';
  if (currency !== 'INR') {
    return sendJson(res, 400, { error: 'Invalid payment currency.' });
  }
  if (isCustom) {
    if (!Number.isInteger(amount) || amount < 1000 || amount > 500000) {
      return sendJson(res, 400, { error: 'Custom payment must be between ₹10 and ₹5,000.' });
    }
  } else if (amount !== allowedAmounts[orderType]) {
    return sendJson(res, 400, { error: 'Invalid payment amount or currency.' });
  }
  if (!/^\d{10}$/.test(phone)) {
    return sendJson(res, 400, { error: 'Please provide a valid 10-digit phone number before payment.' });
  }
  if (orderType === 'reserve' && crewSize > 1 && crewMembers.length !== crewSize - 1) {
    return sendJson(res, 400, { error: 'Please provide the selected crew member details.' });
  }
  if (crewMembers.some(m => !m.name || !/^\d{10}$/.test(m.phone))) {
    return sendJson(res, 400, { error: 'Please provide a valid name and 10-digit WhatsApp number for every crew member.' });
  }

  const orderId = `mcl_${orderType}_${Date.now()}`;
  const productLabel = orderType === 'playbook'
    ? 'Murder Crow Growth Marketing Playbook'
    : orderType === 'full'
      ? 'Murder Crow #Labs full enrolment · ₹26,999'
      : orderType === 'custom'
        ? `Murder Crow custom payment · ₹${(amount / 100).toFixed(2)}`
        : `Murder Crow #Labs seat reservation · ₹10 · crew size ${crewSize}`;

  const returnPage = orderType === 'playbook'
    ? 'payment-playbook.html'
    : orderType === 'full'
      ? 'payment-full.html'
      : orderType === 'custom'
        ? 'custom-payment.html'
        : 'payment.html';

  const payload = {
    order_id: orderId,
    order_amount: amount / 100,
    order_currency: currency,
    customer_details: {
      customer_id: `mcl_${Date.now()}`,
      customer_phone: phone,
      customer_name: name,
      ...(email ? { customer_email: email } : {})
    },
    order_meta: {
      return_url: `https://mudercrowlabs.in/${returnPage}?payment=return&order_id=${encodeURIComponent(orderId)}`,
      notify_url: 'https://mudercrowlabs.in/api/cashfree-webhook'
    },
    order_note: productLabel + (crewMembers.length
      ? ` · crew members: ${crewMembers.map(m => `${m.name} (${m.phone})`).join(', ')}`
      : '')
  };

  try {
    const requestId = `mcl_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    const response = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': '2025-01-01',
        'x-request-id': requestId
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('Cashfree create-order failed:', {
        status: response.status,
        type: data?.type,
        code: data?.code,
        message: data?.message,
        environment: mode,
        requestId
      });
      return sendJson(res, response.status, {
        error: data?.message || data?.type || 'Unable to create Cashfree order.',
        cashfree_type: data?.type || null,
        cashfree_code: data?.code || null,
        cashfree_status: response.status,
        cashfree_request_id: requestId,
        environment: mode
      });
    }

    return sendJson(res, 200, {
      order_id: data.order_id || orderId,
      payment_session_id: data.payment_session_id,
      amount,
      currency,
      order_type: orderType,
      crew_size: crewSize,
      mode
    });
  } catch (error) {
    console.error('Cashfree create-order request failed:', error);
    return sendJson(res, 500, { error: 'Unable to connect to Cashfree.' });
  }
};
