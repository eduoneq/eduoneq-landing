const test = require('node:test');
const assert = require('node:assert/strict');
const { confirmPayment, confirmIdempotencyKey, validateCompletedPayment } = require('../lib/toss-payments');

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

test('recovers an uncertain confirm response by querying the order', async (t) => {
  let call = 0;
  t.mock.method(global, 'fetch', async (url) => {
    call += 1;
    if (url.endsWith('/confirm')) return new Response(JSON.stringify({ code: 'INTERNAL_ERROR' }), { status: 500 });
    return new Response(JSON.stringify(completedPayment()), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  });

  const payment = await confirmPayment(input, config);
  assert.equal(payment.status, 'DONE');
  assert.equal(call, 3);
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
