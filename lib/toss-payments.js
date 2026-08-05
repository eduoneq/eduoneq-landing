const crypto = require('node:crypto');

const ALLOWED_PAYMENT_METHODS = new Set(['카드', 'CARD', '계좌이체', 'TRANSFER', '간편결제', 'EASY_PAY']);

class TossPaymentError extends Error {
  constructor(code, message, options = {}) {
    super(message);
    this.name = 'TossPaymentError';
    this.code = code || 'PAYMENT_CONFIRM_FAILED';
    this.status = options.status || 502;
    this.uncertain = Boolean(options.uncertain);
  }
}

function authorization(secretKey) {
  return `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`;
}

async function responseJson(response) {
  try {
    return await response.json();
  } catch (error) {
    return {};
  }
}

function validatePaymentIdentity(payment, expected) {
  if (!payment || typeof payment !== 'object') {
    throw new TossPaymentError('INVALID_PAYMENT_RESPONSE', '결제 정보를 확인할 수 없습니다.', { uncertain: true });
  }
  if ((expected.paymentKey && payment.paymentKey !== expected.paymentKey)
    || payment.orderId !== expected.orderId
    || payment.orderName !== expected.orderName
    || payment.totalAmount !== expected.amount
    || payment.currency !== expected.currency
    || !ALLOWED_PAYMENT_METHODS.has(payment.method)) {
    throw new TossPaymentError('PAYMENT_INTEGRITY_CHECK_FAILED', '결제 정보가 주문 내용과 일치하지 않습니다.', { uncertain: true });
  }
  return payment;
}

function validateCompletedPayment(payment, expected) {
  validatePaymentIdentity(payment, expected);
  if (payment.status !== 'DONE') {
    throw new TossPaymentError('PAYMENT_NOT_COMPLETED', '결제가 완료 상태가 아닙니다.', { uncertain: true });
  }
  return payment;
}

async function query(path, config) {
  let response;
  try {
    response = await fetch(`https://api.tosspayments.com${path}`, {
      method: 'GET',
      headers: { Authorization: authorization(config.secretKey) },
      signal: AbortSignal.timeout(5000)
    });
  } catch (error) {
    throw new TossPaymentError(
      'PAYMENT_LOOKUP_UNAVAILABLE',
      '결제 상태를 확인할 수 없습니다. 잠시 후 다시 시도해 주세요.',
      { uncertain: true }
    );
  }

  const body = await responseJson(response);
  if (response.ok) return body;
  if (response.status === 404) return null;
  throw new TossPaymentError(
    typeof body.code === 'string' ? body.code : 'PAYMENT_LOOKUP_FAILED',
    '결제 상태를 확인할 수 없습니다. 잠시 후 다시 시도해 주세요.',
    { status: response.status >= 400 && response.status < 500 ? 400 : 502, uncertain: response.status >= 500 }
  );
}

function queryPayment(orderId, config) {
  return query(`/v1/payments/orders/${encodeURIComponent(orderId)}`, config);
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function confirmIdempotencyKey(paymentKey, config) {
  const bytes = crypto.createHmac('sha256', config.sessionSecret)
    .update(`${config.idempotencySeed}:${paymentKey}`)
    .digest()
    .subarray(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

async function recoverPayment(expected, config) {
  const delays = [0, 400, 1200];
  for (const delay of delays) {
    if (delay) await wait(delay);
    try {
      const payment = await queryPayment(expected.orderId, config);
      if (!payment) continue;
      validatePaymentIdentity(payment, expected);
      if (payment.status === 'DONE') return payment;
      if (payment.status !== 'READY' && payment.status !== 'IN_PROGRESS') {
        throw new TossPaymentError('PAYMENT_NOT_COMPLETED', '결제가 완료되지 않았습니다.', { status: 400 });
      }
    } catch (error) {
      if (error instanceof TossPaymentError
        && error.code !== 'PAYMENT_LOOKUP_UNAVAILABLE'
        && error.code !== 'PAYMENT_LOOKUP_FAILED') {
        throw error;
      }
    }
  }
  throw new TossPaymentError(
    'PAYMENT_STATE_UNKNOWN',
    '결제 상태를 즉시 확인할 수 없습니다. 추가 결제 없이 EDU ONEQ에 문의해 주세요.',
    { uncertain: true }
  );
}

async function confirmPayment(input, config) {
  const idempotencyKey = confirmIdempotencyKey(input.paymentKey, config);
  const recoverableCodes = new Set(['ALREADY_PROCESSED_PAYMENT', 'IDEMPOTENT_REQUEST_PROCESSING']);

  for (let attempt = 0; attempt < 2; attempt += 1) {
    let response;
    try {
      response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
        method: 'POST',
        headers: {
          Authorization: authorization(config.secretKey),
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify({
          paymentKey: input.paymentKey,
          orderId: input.orderId,
          amount: input.amount
        }),
        signal: AbortSignal.timeout(8000)
      });
    } catch (error) {
      if (attempt === 0) {
        await wait(400);
        continue;
      }
      return recoverPayment(input, config);
    }

    const body = await responseJson(response);
    if (response.ok) return validateCompletedPayment(body, input);

    if (response.status >= 500 || recoverableCodes.has(body.code)) {
      if (attempt === 0) {
        await wait(400);
        continue;
      }
      return recoverPayment(input, config);
    }

    throw new TossPaymentError(
      typeof body.code === 'string' ? body.code : 'PAYMENT_CONFIRM_FAILED',
      '결제 승인이 완료되지 않았습니다. 결제수단을 확인한 뒤 다시 시도해 주세요.',
      { status: response.status >= 400 && response.status < 500 ? 400 : 502 }
    );
  }

  return recoverPayment(input, config);
}

module.exports = {
  TossPaymentError,
  authorization,
  validatePaymentIdentity,
  validateCompletedPayment,
  confirmIdempotencyKey,
  confirmPayment,
  queryPayment
};
