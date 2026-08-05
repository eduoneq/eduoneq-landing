const test = require('node:test');
const assert = require('node:assert/strict');
const { installPaymentEnv, mockRequest, mockResponse, cookiePair } = require('./helpers');
const { getPaymentConfig } = require('../lib/payment-config');
const { createSessionCookie, createOrder } = require('../lib/payment-security');
const pageHandler = require('../api/payment-page');
const orderHandler = require('../api/payment-order');
const successHandler = require('../api/payment-success');

test('unauthenticated page reveals neither product nor checkout configuration', () => {
  installPaymentEnv();
  const req = mockRequest();
  const res = mockResponse();
  pageHandler(req, res);
  assert.equal(res.statusCode, 200);
  assert.match(res.body, /비밀번호를 입력해 주세요/);
  assert.doesNotMatch(res.body, /Unit test service/);
  assert.doesNotMatch(res.body, /765432/);
});

test('authenticated order ignores client pricing and uses server configuration', async (t) => {
  installPaymentEnv();
  t.mock.method(global, 'fetch', async () => new Response(JSON.stringify({ code: 'NOT_FOUND_PAYMENT' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  }));
  const config = getPaymentConfig();
  const baseReq = mockRequest({ method: 'POST' });
  const session = cookiePair(createSessionCookie(baseReq, config));
  const req = mockRequest({
    method: 'POST',
    headers: { host: 'localhost:3000', origin: 'http://localhost:3000', cookie: session },
    body: { amount: 1, orderName: 'tampered' }
  });
  const res = mockResponse();
  await orderHandler(req, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.amount, 765432);
  assert.equal(res.body.orderName, 'Unit test service');
  assert.match(res.body.orderId, /^[A-Za-z0-9_-]{6,64}$/);
});

test('a recorded payment closes the one-time link', async (t) => {
  installPaymentEnv();
  const config = getPaymentConfig();
  const baseReq = mockRequest({ method: 'POST' });
  const session = cookiePair(createSessionCookie(baseReq, config));
  t.mock.method(global, 'fetch', async () => new Response(JSON.stringify({
    orderId: config.orderId,
    status: 'DONE'
  }), { status: 200, headers: { 'Content-Type': 'application/json' } }));

  const req = mockRequest({
    method: 'POST',
    headers: { host: 'localhost:3000', origin: 'http://localhost:3000', cookie: session }
  });
  const res = mockResponse();
  await orderHandler(req, res);
  assert.equal(res.statusCode, 409);
  assert.equal(res.body.code, 'PAYMENT_LINK_ALREADY_USED');
});

test('tampered success amount is rejected before contacting Toss', async (t) => {
  installPaymentEnv();
  const config = getPaymentConfig();
  const baseReq = mockRequest();
  const session = cookiePair(createSessionCookie(baseReq, config));
  const order = createOrder(baseReq, config);
  const orderCookie = cookiePair(order.cookie);
  let fetchCalls = 0;
  t.mock.method(global, 'fetch', async () => {
    fetchCalls += 1;
    return new Response('{}', { status: 500 });
  });

  const req = mockRequest({
    headers: { host: 'localhost:3000', cookie: `${session}; ${orderCookie}` },
    query: {
      paymentKey: 'unit-payment-key',
      orderId: order.payload.orderId,
      amount: '1',
      paymentType: 'NORMAL'
    }
  });
  const res = mockResponse();
  await successHandler(req, res);
  assert.equal(res.statusCode, 400);
  assert.equal(fetchCalls, 0);
  assert.match(res.body, /결제가 완료되지 않았습니다/);
});
