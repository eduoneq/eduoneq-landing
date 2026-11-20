const test = require('node:test');
const assert = require('node:assert/strict');
const {
  confirmPayment,
  confirmIdempotencyKey,
  queryPaymentByKey,
  validateCompletedPayment
} = require('../lib/toss-payments');

const config = {
  secretKey: 'test_' + 'gsk_unit_test_secret_key_123456',
  sessionSecret: Buffer.alloc(32, 7).toString('base64url'),
  idempotencySeed: 'a97e69fa-2602-4977-8437-c15bf3349e15'
};
const input = {
  paymentKey: 'payment-key-for-unit-test',
  orderId: 'EOQ_unit_test_order',
  amount: 765432,
  currency: 'KRW',
  orderName: 'Unit test service'
};

function completedPayment(overrides = {}) {
  return {
    paymentKey: input.paymentKey,
    orderId: input.orderId,
    orderName: input.orderName,
    totalAmount: input.amount,
    currency: input.currency,
    status: 'DONE',
    method: '카드',
    ...overrides
  };
}

test('confirms with Basic auth, fixed body, and idempotency key', async (t) => {
  const calls = [];
  t.mock.method(global, 'fetch', async (url, options) => {
    calls.push({ url, options });
    return new Response(JSON.stringify(completedPayment()), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  });

  const payment = await confirmPayment(input, config);
  assert.equal(payment.status, 'DONE');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://api.tosspayments.com/v1/payments/confirm');
  assert.equal(calls[0].options.headers['Idempotency-Key'], confirmIdempotencyKey(input.paymentKey, config));
  assert.equal(
    Buffer.from(calls[0].options.headers.Authorization.slice('Basic '.length), 'base64').toString(),
    `${config.secretKey}:`
  );
  assert.deepEqual(JSON.parse(calls[0].options.body), {
    paymentKey: input.paymentKey,
    orderId: input.orderId,
    amount: input.amount
  });
});

test('recovers an uncertain confirm response by payment key', async (t) => {
  const calls = [];
  t.mock.method(console, 'error', () => {});
  t.mock.method(global, 'fetch', async (url) => {
    calls.push(url);
    if (url.endsWith('/confirm')) {
      return new Response(JSON.stringify({ code: 'FAILED_INTERNAL_SYSTEM_PROCESSING' }), { status: 500 });
    }
    return new Response(JSON.stringify(completedPayment()), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  });

  const payment = await confirmPayment(input, config);
  assert.equal(payment.status, 'DONE');
  assert.deepEqual(calls, [
    'https://api.tosspayments.com/v1/payments/confirm',
    'https://api.tosspayments.com/v1/payments/confirm',
    `https://api.tosspayments.com/v1/payments/${encodeURIComponent(input.paymentKey)}`
  ]);
});

test('rejects a reused order id on confirm and logs only the Toss code', async (t) => {
  const logs = [];
  const calls = [];
  t.mock.method(console, 'error', (line) => logs.push(String(line)));
  t.mock.method(global, 'fetch', async (url, options) => {
    calls.push({ url, options });
    return new Response(JSON.stringify({
      code: 'DUPLICATED_ORDER_ID',
      message: 'DO_NOT_LOG_THIS_BODY'
    }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  });

  await assert.rejects(
    () => confirmPayment(input, config),
    (error) => {
      assert.equal(error.code, 'PAYMENT_LINK_ALREADY_USED');
      assert.equal(error.status, 409);
      assert.match(error.message, /이미 처리되었습니다/);
      return true;
    }
  );
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://api.tosspayments.com/v1/payments/confirm');
  assert.equal(calls[0].options.headers['Idempotency-Key'], confirmIdempotencyKey(input.paymentKey, config));
  assert.equal(JSON.stringify(calls).includes('/v1/payments/orders/'), false);
  assert.deepEqual(JSON.parse(logs[0]), {
    source: 'toss-payments',
    operation: 'confirm',
    status: 400,
    code: 'DUPLICATED_ORDER_ID'
  });
  assert.equal(logs.join('\n').includes('DO_NOT_LOG_THIS_BODY'), false);
  assert.equal(logs.join('\n').includes(config.secretKey), false);
  assert.equal(logs.join('\n').includes('Authorization'), false);
});

test('logs a paymentKey lookup failure without the response body', async (t) => {
  const logs = [];
  t.mock.method(console, 'error', (line) => logs.push(String(line)));
  t.mock.method(global, 'fetch', async (url) => {
    assert.equal(
      url,
      `https://api.tosspayments.com/v1/payments/${encodeURIComponent(input.paymentKey)}`
    );
    return new Response(JSON.stringify({
      code: 'FORBIDDEN_REQUEST',
      message: 'DO_NOT_LOG_THIS_BODY'
    }), { status: 403, headers: { 'Content-Type': 'application/json' } });
  });

  await assert.rejects(
    () => queryPaymentByKey(input.paymentKey, config),
    (error) => error.code === 'FORBIDDEN_REQUEST'
  );
  assert.deepEqual(JSON.parse(logs[0]), {
    source: 'toss-payments',
    operation: 'lookup',
    status: 403,
    code: 'FORBIDDEN_REQUEST'
  });
  assert.equal(logs.join('\n').includes('DO_NOT_LOG_THIS_BODY'), false);
  assert.equal(logs.join('\n').includes(config.secretKey), false);
});

test('keeps a declined confirm as a retryable payment failure', async (t) => {
  t.mock.method(console, 'error', () => {});
  t.mock.method(global, 'fetch', async () => new Response(
    JSON.stringify({ code: 'REJECT_CARD_COMPANY' }),
    { status: 400, headers: { 'Content-Type': 'application/json' } }
  ));
  await assert.rejects(
    () => confirmPayment(input, config),
    (error) => {
      assert.equal(error.code, 'REJECT_CARD_COMPANY');
      assert.equal(error.status, 400);
      assert.match(error.message, /결제 승인이 완료되지 않았습니다/);
      return true;
    }
  );
});

test('rejects a payment whose key or order name was changed', () => {
  assert.throws(
    () => validateCompletedPayment(completedPayment({ paymentKey: 'different-key' }), input),
    /주문 내용과 일치하지 않습니다/
  );
  assert.throws(
    () => validateCompletedPayment(completedPayment({ orderName: 'Changed item' }), input),
    /주문 내용과 일치하지 않습니다/
  );
});

test('rejects a completed response whose amount differs from the order', () => {
  assert.throws(
    () => validateCompletedPayment(completedPayment({ totalAmount: 1 }), input),
    /주문 내용과 일치하지 않습니다/
  );
});
