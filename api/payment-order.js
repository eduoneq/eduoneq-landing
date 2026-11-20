const { getPaymentConfig } = require('../lib/payment-config');
const {
  getSession,
  getOrder,
  createOrder,
  orderMatchesConfig,
  isSameOriginRequest
} = require('../lib/payment-security');
const { setJsonHeaders } = require('../lib/payment-headers');

module.exports = async function handler(req, res) {
  setJsonHeaders(res);
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'POST 요청만 허용됩니다.' });
  }

  try {
    const config = getPaymentConfig();
    if (!isSameOriginRequest(req, config)) {
      return res.status(403).json({ ok: false, message: '요청 출처를 확인할 수 없습니다.' });
    }
    if (!getSession(req, config)) {
      return res.status(401).json({ ok: false, message: '결제 페이지 인증이 만료되었습니다.' });
    }

    // Widget secret keys cannot call GET /v1/payments/orders/{orderId}.
    // The fixed orderId is reserved once, and Toss rejects a second confirm.
    const existingOrder = getOrder(req, config);
    const order = orderMatchesConfig(existingOrder, config)
      ? { payload: existingOrder, cookie: null }
      : createOrder(req, config);
    if (order.cookie) res.setHeader('Set-Cookie', order.cookie);
    return res.status(200).json({
      ok: true,
      orderId: order.payload.orderId,
      amount: order.payload.amount,
      currency: order.payload.currency,
      orderName: order.payload.orderName
    });
  } catch (error) {
    return res.status(503).json({ ok: false, message: '주문을 준비할 수 없습니다.' });
  }
};
