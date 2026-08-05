const { getPaymentConfig } = require('../lib/payment-config');
const { getSession, getOrder, clearCookie, ORDER_COOKIE } = require('../lib/payment-security');
const { setPrivateHeaders } = require('../lib/payment-headers');
const { resultPage } = require('../lib/payment-html');

const SAFE_MESSAGES = {
  USER_CANCEL: '결제를 취소했습니다. 다시 시도할 수 있습니다.',
  REJECT_CARD_COMPANY: '카드사에서 결제를 승인하지 않았습니다. 다른 결제수단을 이용해 주세요.',
  INVALID_CARD_COMPANY: '선택한 카드로 결제를 진행할 수 없습니다.',
  INVALID_STOPPED_CARD: '사용이 정지된 카드입니다. 다른 결제수단을 이용해 주세요.',
  EXCEED_MAX_DAILY_PAYMENT_COUNT: '결제 가능 횟수를 초과했습니다. 다른 결제수단을 이용해 주세요.'
};

module.exports = function handler(req, res) {
  setPrivateHeaders(res);
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).send('Method Not Allowed');
  }

  let orderName = '';
  let amount = 0;
  let orderId = '';
  try {
    const config = getPaymentConfig();
    if (getSession(req, config)) {
      const order = getOrder(req, config);
      if (order) {
        orderName = order.orderName;
        amount = order.amount;
        orderId = order.orderId;
      }
    }
  } catch (error) {
    // The failure page remains useful without exposing configuration details.
  }

  const code = typeof req.query.code === 'string' && /^[A-Z0-9_]{2,80}$/.test(req.query.code)
    ? req.query.code
    : '';
  res.setHeader('Set-Cookie', clearCookie(req, ORDER_COOKIE));
  return res.status(400).send(resultPage({
    ok: false,
    title: '결제가 완료되지 않았습니다',
    message: SAFE_MESSAGES[code] || '결제수단을 확인한 뒤 다시 시도해 주세요.',
    orderName,
    amount,
    orderId,
    retryAllowed: true
  }));
};
