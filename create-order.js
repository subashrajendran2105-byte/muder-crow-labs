const Razorpay = require('razorpay');

function sendJson(res, status, body) {
  res.status(status).json(body);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return sendJson(res, 500, { error: 'Razorpay server configuration is missing.' });
  }

  const amount = Number(req.body?.amount);
  const currency = req.body?.currency || 'INR';

  // Supported Murder Crow payments:
  // ₹10 reservation = 1,000 paise
  // ₹27,499 full enrolment = 2,749,900 paise
  if (!Number.isInteger(amount) || amount < 100) {
    return sendJson(res, 400, { error: 'Amount must be at least 100 paise.' });
  }

  if (![1000, 2749900].includes(amount) || currency !== 'INR') {
    return sendJson(res, 400, { error: 'Invalid payment amount or currency.' });
  }

  const orderType = req.body?.order_type === 'full' ? 'full' : 'reserve';

  const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });

  try {
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: `mcl_${Date.now()}`,
      notes: {
        purpose: orderType === 'full'
          ? 'Murder Crow #Labs full enrolment'
          : 'Murder Crow #Labs seat reservation'
      }
    });

    return sendJson(res, 200, {
      key_id: keyId,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Razorpay create-order error:', error);

    if (error?.statusCode === 401 || error?.statusCode === 403) {
      return sendJson(res, 401, { error: 'Razorpay authentication failed.' });
    }

    return sendJson(res, 500, { error: 'Unable to create Razorpay order.' });
  }
};
