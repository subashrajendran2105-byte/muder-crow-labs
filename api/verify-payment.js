function sendJson(res, status, body) {
  res.status(status).json(body);
}

function getCashfreeConfig() {
  const appId = process.env.CASHFREE_CLIENT_ID;
  const secretKey = process.env.CASHFREE_CLIENT_SECRET;
  const mode = (process.env.CASHFREE_ENV || 'sandbox').toLowerCase();
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

  const { appId, secretKey, baseUrl } = getCashfreeConfig();
  if (!appId || !secretKey) {
    return sendJson(res, 500, { error: 'Cashfree server configuration is missing.' });
  }

  const orderId = String(req.body?.order_id || '').trim();
  if (!orderId) {
    return sendJson(res, 400, { success: false, error: 'Missing Cashfree order ID.' });
  }

  try {
    const response = await fetch(`${baseUrl}/orders/${encodeURIComponent(orderId)}/payments`, {
      method: 'GET',
      headers: {
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': '2025-01-01'
      }
    });

    const payments = await response.json().catch(() => []);
    if (!response.ok) {
      console.error('Cashfree payment-status error:', payments);
      return sendJson(res, response.status, {
        success: false,
        error: payments?.message || 'Unable to verify Cashfree payment.'
      });
    }

    const list = Array.isArray(payments) ? payments : [];
    const successful = list.find(payment => payment?.payment_status === 'SUCCESS');
    const latest = list[0] || {};

    if (successful) {
      return sendJson(res, 200, {
        success: true,
        order_id: orderId,
        payment_id: successful.cf_payment_id || successful.payment_id || null,
        payment_status: successful.payment_status
      });
    }

    return sendJson(res, 200, {
      success: false,
      order_id: orderId,
      payment_status: latest.payment_status || 'PENDING',
      error: latest.payment_message || 'Payment is not successful yet.'
    });
  } catch (error) {
    console.error('Cashfree verification request failed:', error);
    return sendJson(res, 500, { success: false, error: 'Unable to connect to Cashfree.' });
  }
};
