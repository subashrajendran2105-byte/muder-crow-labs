function sendJson(res, status, body) {
  res.status(status).json(body);
}

function getCashfreeConfig() {
  const appId = String(process.env.CASHFREE_CLIENT_ID || '').trim();
  const secretKey = String(process.env.CASHFREE_CLIENT_SECRET || '').trim();
  const mode = String(process.env.CASHFREE_ENV || 'sandbox').trim().toLowerCase();
  const baseUrl = mode === 'production'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';
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

  const amount = Number(req.body?.amount);
  const currency = req.body?.currency || 'INR';
  const orderType = ['reserve', 'full', 'playbook'].includes(req.body?.order_type)
    ? req.body.order_type
    : 'reserve';
  const customerPhone = String(req.body?.customer_phone || '').replace(/\D/g, '');
  const customerEmail = String(req.body?.customer_email || '').trim();
  const customerName = String(req.body?.customer_name || 'Murder Crow Learner').trim();

  const allowedAmounts = {
    reserve: 1000,
    playbook: 139900,
    full: 2749900
  };

  if (amount !== allowedAmounts[orderType] || currency !== 'INR') {
    return sendJson(res, 400, { error: 'Invalid payment amount or currency.' });
  }

  if (!/^\d{10}$/.test(customerPhone)) {
    return sendJson(res, 400, { error: 'Please provide a valid 10-digit phone number before payment.' });
  }

  const orderId = `mcl_${orderType}_${Date.now()}`;
  const productLabel = orderType === 'playbook'
    ? 'Murder Crow Growth Marketing Playbook'
    : orderType === 'full'
      ? 'Murder Crow #Labs full enrolment'
      : 'Murder Crow #Labs seat reservation';

  const payload = {
    order_id: orderId,
    order_amount: amount / 100,
    order_currency: currency,
    customer_details: {
      customer_id: `mcl_${Date.now()}`,
      customer_phone: customerPhone,
      customer_name: customerName,
      ...(customerEmail ? { customer_email: customerEmail } : {})
    },
    order_meta: {
      return_url: `https://mudercrowlabs.in/payment.html?payment=return&order_id=${encodeURIComponent(orderId)}`
    },
    order_note: productLabel
  };

  try {
    const response = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': '2025-01-01'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('Cashfree create-order error:', {
        status: response.status,
        type: data?.type,
        code: data?.code,
        message: data?.message,
        baseUrl,
        mode
      });
      return sendJson(res, response.status, {
        error: data?.message || data?.type || 'Unable to create Cashfree order.',
        cashfree_type: data?.type || null,
        cashfree_code: data?.code || null,
        cashfree_status: response.status,
        environment: mode
      });
    }

    return sendJson(res, 200, {
      order_id: data.order_id || orderId,
      payment_session_id: data.payment_session_id,
      amount,
      currency,
      order_type: orderType,
      mode
    });
  } catch (error) {
    console.error('Cashfree create-order request failed:', error);
    return sendJson(res, 500, { error: 'Unable to connect to Cashfree.' });
  }
};
