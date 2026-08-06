const crypto = require('node:crypto');

function installPaymentEnv(overrides = {}) {
  const salt = Buffer.alloc(16, 3).toString('base64url');
  const passwordHash = crypto.scryptSync('1234', salt, 32).toString('base64url');
  const tokenHash = crypto.createHash('sha256').update('unit-test-link-token').digest('base64url');
  const values = {
    PAYMENT_ENABLED: 'true',
    PAYMENT_PASSWORD_SALT: salt,
    PAYMENT_PASSWORD_HASH: passwordHash,
    PAYMENT_LINK_TOKEN_HASH: tokenHash,
    PAYMENT_SESSION_SECRET: Buffer.alloc(32, 4).toString('base64url'),
    PAYMENT_LINK_EXPIRES_AT: '2099-12-31T14:59:59.000Z',
    PAYMENT_ORDER_ID: 'EOQ_UNIT_FIXED_ORDER_123456',
    PAYMENT_IDEMPOTENCY_SEED: 'a97e69fa-2602-4977-8437-c15bf3349e15',
    PAYMENT_AMOUNT: '765432',
    PAYMENT_CURRENCY: 'KRW',
    PAYMENT_ORDER_NAME: 'Unit test service',
    TOSS_CLIENT_KEY: 'test_' + 'gck_unit_test_client_key_123456',
    TOSS_SECRET_KEY: 'test_' + 'gsk_unit_test_secret_key_123456',
    TOSS_PAYMENT_METHOD_VARIANT_KEY: 'UNIT_WIDGET',
    TOSS_AGREEMENT_VARIANT_KEY: 'UNIT_AGREEMENT',
    VERCEL_ENV: 'preview',
    VERCEL_URL: '',
    PAYMENT_ALLOWED_ORIGIN: 'http://localhost:3000',
    ...overrides
  };
  Object.assign(process.env, values);
  return values;
}

function mockRequest(overrides = {}) {
  return {
    method: 'GET',
    headers: {
      host: 'localhost:3000',
      origin: 'http://localhost:3000'
    },
    query: {},
    body: {},
    socket: { remoteAddress: '127.0.0.1' },
    ...overrides
  };
}

function mockResponse() {
  return {
    headers: {},
    statusCode: 200,
    body: undefined,
    setHeader(name, value) {
      this.headers[String(name).toLowerCase()] = value;
    },
    getHeader(name) {
      return this.headers[String(name).toLowerCase()];
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(value) {
      this.body = value;
      return this;
    },
    send(value) {
      this.body = value;
      return this;
    },
    end(value) {
      this.body = value;
      return this;
    }
  };
}

function cookiePair(setCookie) {
  return String(setCookie).split(';')[0];
}

module.exports = {
  installPaymentEnv,
  mockRequest,
  mockResponse,
  cookiePair
};
