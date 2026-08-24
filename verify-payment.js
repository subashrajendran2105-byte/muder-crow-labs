const crypto = require('crypto');

function sendJson(res, status, body) {
  res.status(status).json(body);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    return sendJson(res, 500, { error: 'Razorpay server configuration is missing.' });
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body || {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return sendJson(res, 400, { error: 'Missing payment verification fields.' });
  }

  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const expected = Buffer.from(generatedSignature, 'utf8');
  const received = Buffer.from(String(razorpay_signature), 'utf8');

  const matches =
    expected.length === received.length &&
    crypto.timingSafeEqual(expected, received);

  if (!matches) {
    return sendJson(res, 400, {
      success: false,
      error: 'Payment signature mismatch. Payment was not marked as paid.'
    });
  }

  return sendJson(res, 200, {
    success: true,
    payment_id: razorpay_payment_id,
    order_id: razorpay_order_id
  });
};
