const test = require('node:test');
const assert = require('node:assert/strict');
const { installPaymentEnv } = require('./helpers');
const { getPaymentConfig, detectKeyMode, parseAmount, PaymentConfigError } = require('../lib/payment-config');

test('loads an enabled test payment configuration in preview', () => {
  installPaymentEnv();
  const config = getPaymentConfig();
  assert.equal(config.amount, 765432);
  assert.equal(config.currency, 'KRW');
  assert.equal(config.mode, 'test');
  assert.equal(config.orderName, 'Unit test service');
});

test('rejects invalid amounts and mixed Toss key pairs', () => {
  assert.throws(() => parseAmount('1.5'), PaymentConfigError);
  assert.throws(
    () => detectKeyMode('test_' + 'gck_example', 'live_' + 'gsk_example'),
    PaymentConfigError
  );
});

test('rejects test keys in production', () => {
  installPaymentEnv({ VERCEL_ENV: 'production' });
  assert.throws(() => getPaymentConfig(), /Production must use live Toss widget keys/);
});

test('rejects live keys outside Vercel production', () => {
  installPaymentEnv({
    VERCEL_ENV: '',
    TOSS_CLIENT_KEY: 'live_' + 'gck_example_client_key',
    TOSS_SECRET_KEY: 'live_' + 'gsk_example_secret_key'
  });
  assert.throws(() => getPaymentConfig(), /only allowed in Vercel production/);
});

test('rejects short or placeholder security material', () => {
  installPaymentEnv({ PAYMENT_SESSION_SECRET: 'short' });
  assert.throws(() => getPaymentConfig(), /PAYMENT_SESSION_SECRET/);
});

test('rejects copied placeholder order identifiers', () => {
  installPaymentEnv({ PAYMENT_ORDER_ID: 'your_stable_order_id' });
  assert.throws(() => getPaymentConfig(), /PAYMENT_ORDER_ID/);
  installPaymentEnv({ PAYMENT_IDEMPOTENCY_SEED: '00000000-0000-4000-8000-000000000000' });
  assert.throws(() => getPaymentConfig(), /PAYMENT_IDEMPOTENCY_SEED/);
});
