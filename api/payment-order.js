const { getPaymentConfig } = require('../lib/payment-config');
const {
  getSession,
  getOrder,
  createOrder,
  orderMatchesConfig,
  isSameOriginRequest
} = require('../lib/payment-security');
const { setJsonHeaders } = require('../lib/payment-headers');
const { queryPayment } = require('../lib/toss-payments');

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

    const recordedPayment = await queryPayment(config.orderId, config);
    if (recordedPayment) {
      return res.status(409).json({
        ok: false,
        code: 'PAYMENT_LINK_ALREADY_USED',
        message: recordedPayment.status === 'DONE'
          ? '이 결제 링크의 결제가 이미 완료되었습니다.'
          : '이 결제 링크로 시작된 결제가 있습니다. EDU ONEQ에 문의해 주세요.'
      });
    }

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
