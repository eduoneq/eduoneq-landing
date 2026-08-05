const { getPaymentConfig } = require('../lib/payment-config');
const {
  getSession,
  getOrder,
  orderMatchesConfig,
  clearCookie,
  SESSION_COOKIE,
  ORDER_COOKIE
} = require('../lib/payment-security');
const { setPrivateHeaders } = require('../lib/payment-headers');
const { resultPage, serviceErrorPage } = require('../lib/payment-html');
const { confirmPayment, TossPaymentError } = require('../lib/toss-payments');

function singleQueryValue(value) {
  return typeof value === 'string' ? value : null;
}

function validPaymentKey(value) {
  return typeof value === 'string' && value.length >= 6 && value.length <= 200;
}

module.exports = async function handler(req, res) {
  setPrivateHeaders(res);
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const config = getPaymentConfig();
    const session = getSession(req, config);
    const order = getOrder(req, config);
    const paymentKey = singleQueryValue(req.query.paymentKey);
    const orderId = singleQueryValue(req.query.orderId);
    const amount = singleQueryValue(req.query.amount);
    const paymentType = singleQueryValue(req.query.paymentType);

    if (!session || !order) throw new TossPaymentError('PAYMENT_SESSION_EXPIRED', '결제 인증 정보가 만료되었습니다.', { status: 400 });
    if (!validPaymentKey(paymentKey)
      || !/^[A-Za-z0-9_-]{6,64}$/.test(orderId || '')
      || !/^\d{1,12}$/.test(amount || '')
      || paymentType !== 'NORMAL'
      || !orderMatchesConfig(order, config)
      || order.orderId !== orderId
      || order.amount !== Number(amount)) {
      throw new TossPaymentError('PAYMENT_INTEGRITY_CHECK_FAILED', '결제 정보가 주문 내용과 일치하지 않습니다.', { status: 400 });
    }

    const payment = await confirmPayment({
      paymentKey,
      orderId,
      amount: order.amount,
      currency: order.currency,
      orderName: order.orderName,
      paymentKey
    }, config);

    res.setHeader('Set-Cookie', [
      clearCookie(req, ORDER_COOKIE),
      clearCookie(req, SESSION_COOKIE)
    ]);
    return res.status(200).send(resultPage({
      ok: true,
      title: '결제가 완료되었습니다',
      message: '결제 승인이 정상적으로 완료되었습니다.',
      orderName: config.orderName,
      amount: config.amount,
      orderId: payment.orderId,
      method: payment.method,
      receiptUrl: payment.receipt && payment.receipt.url
    }));
  } catch (error) {
    if (error instanceof TossPaymentError) {
      const uncertain = error.uncertain;
      return res.status(uncertain ? 202 : (error.status || 400)).send(resultPage({
        ok: false,
        title: uncertain ? '결제 상태를 확인하고 있습니다' : '결제가 완료되지 않았습니다',
        message: error.message,
        retryAllowed: !uncertain
      }));
    }
    return res.status(503).send(serviceErrorPage());
  }
};
