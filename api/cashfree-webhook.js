const crypto = require('crypto');

function sendJson(res, status, body) {
  res.status(status).json(body);
}

function getSecret() {
  return String(process.env.CASHFREE_CLIENT_SECRET || '')
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .trim();
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    if (typeof req.body === 'string') return resolve(Buffer.from(req.body));
    const chunks = [];
    req.on('data', chunk => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const secret = getSecret();
  if (!secret) return sendJson(res, 500, { error: 'Cashfree webhook secret is not configured.' });

  try {
    const rawBody = await readRawBody(req);
    const signature = String(req.headers['x-webhook-signature'] || '');
    const timestamp = String(req.headers['x-webhook-timestamp'] || '');

    if (!signature || !timestamp) {
      return sendJson(res, 400, { error: 'Missing Cashfree webhook signature headers.' });
    }

    const signedPayload = `${timestamp}${rawBody.toString('utf8')}`;
    const expected = crypto.createHmac('sha256', secret).update(signedPayload).digest('base64');

    if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return sendJson(res, 401, { error: 'Invalid Cashfree webhook signature.' });
    }

    const event = JSON.parse(rawBody.toString('utf8'));
    const orderId = event?.data?.order?.order_id || event?.data?.order_id || null;
    const paymentStatus = event?.data?.payment?.payment_status || event?.data?.payment_status || null;

    console.log('Verified Cashfree webhook:', {
      type: event?.type || event?.event_type || null,
      orderId,
      paymentStatus
    });

    return sendJson(res, 200, { received: true });
  } catch (error) {
    console.error('Cashfree webhook error:', error);
    return sendJson(res, 400, { error: 'Invalid Cashfree webhook payload.' });
  }
};
