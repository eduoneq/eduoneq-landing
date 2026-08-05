const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const {
  signPayload,
  verifySignedPayload,
  verifyCredentials,
  isSameOriginRequest,
  createSessionCookie,
  createOrder
} = require('../lib/payment-security');
const { mockRequest } = require('./helpers');

const securityConfig = {
  sessionSecret: Buffer.alloc(32, 5).toString('base64url'),
  passwordSalt: Buffer.alloc(16, 6).toString('base64url'),
  linkTokenHash: crypto.createHash('sha256').update('secret-fragment').digest('base64url'),
  linkExpiresAt: Date.parse('2099-12-31T14:59:59.000Z'),
  orderId: 'EOQ_UNIT_SECURITY_ORDER',
  idempotencySeed: 'a97e69fa-2602-4977-8437-c15bf3349e15',
  allowedOrigin: 'http://localhost:3000',
  amount: 765432,
  currency: 'KRW',
  orderName: 'Unit test service'
};
securityConfig.passwordHash = crypto.scryptSync('1234', securityConfig.passwordSalt, 32).toString('base64url');

test('signed payload rejects tampering and expiration', () => {
  const now = Date.now();
  const token = signPayload({ v: 1, aud: 'unit', exp: now + 1000 }, securityConfig.sessionSecret);
  assert.equal(verifySignedPayload(token, securityConfig.sessionSecret, 'unit', now).aud, 'unit');
  assert.equal(verifySignedPayload(token + 'x', securityConfig.sessionSecret, 'unit', now), null);
  assert.equal(verifySignedPayload(token, securityConfig.sessionSecret, 'unit', now + 1001), null);
});

test('link authentication requires both password and fragment token', async () => {
  assert.equal(await verifyCredentials('1234', 'secret-fragment', securityConfig), true);
  assert.equal(await verifyCredentials('0000', 'secret-fragment', securityConfig), false);
  assert.equal(await verifyCredentials('1234', 'wrong-fragment', securityConfig), false);
});

test('same-origin POST validation uses the configured exact origin', () => {
  assert.equal(isSameOriginRequest(mockRequest(), securityConfig), true);
  assert.equal(isSameOriginRequest(
    mockRequest({ headers: { host: 'localhost:3000', origin: 'https://evil.example' } }),
    securityConfig
  ), false);
  assert.equal(isSameOriginRequest(
    mockRequest({ headers: { host: 'preview.example', origin: 'http://localhost:3000' } }),
    securityConfig
  ), false);
});

test('session and order cookies are HttpOnly, scoped, and server-controlled', () => {
  const req = mockRequest();
  const sessionCookie = createSessionCookie(req, securityConfig, 1000);
  assert.match(sessionCookie, /HttpOnly/);
  assert.match(sessionCookie, /SameSite=Lax/);
  assert.match(sessionCookie, /Path=\/payment/);

  const order = createOrder(req, securityConfig, 1000);
  assert.match(order.payload.orderId, /^[A-Za-z0-9_-]{6,64}$/);
  assert.equal(order.payload.amount, securityConfig.amount);
  assert.equal(order.payload.orderName, securityConfig.orderName);
  assert.equal(order.payload.orderId, securityConfig.orderId);
  assert.equal(createOrder(req, securityConfig, 2000).payload.orderId, order.payload.orderId);
  assert.match(order.cookie, /HttpOnly/);
});
