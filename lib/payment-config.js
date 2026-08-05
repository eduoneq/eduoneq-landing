const REQUIRED_ENV = [
  'PAYMENT_ENABLED',
  'PAYMENT_PASSWORD_SALT',
  'PAYMENT_PASSWORD_HASH',
  'PAYMENT_LINK_TOKEN_HASH',
  'PAYMENT_SESSION_SECRET',
  'PAYMENT_LINK_EXPIRES_AT',
  'PAYMENT_ORDER_ID',
  'PAYMENT_IDEMPOTENCY_SEED',
  'PAYMENT_AMOUNT',
  'PAYMENT_CURRENCY',
  'PAYMENT_ORDER_NAME',
  'TOSS_CLIENT_KEY',
  'TOSS_SECRET_KEY',
  'TOSS_PAYMENT_METHOD_VARIANT_KEY',
  'TOSS_AGREEMENT_VARIANT_KEY'
];

class PaymentConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PaymentConfigError';
    this.code = 'PAYMENT_CONFIG_ERROR';
  }
}

function readRequired(name) {
  const value = String(process.env[name] || '').trim();
  if (!value) throw new PaymentConfigError(`Missing payment environment variable: ${name}`);
  return value;
}

function parseAmount(value) {
  if (!/^\d{1,12}$/.test(value)) throw new PaymentConfigError('PAYMENT_AMOUNT must be a positive integer.');
  const amount = Number(value);
  if (!Number.isSafeInteger(amount) || amount <= 0) {
    throw new PaymentConfigError('PAYMENT_AMOUNT must be a positive safe integer.');
  }
  return amount;
}

function detectKeyMode(clientKey, secretKey) {
  const clientMode = clientKey.startsWith('live_gck_')
    ? 'live'
    : clientKey.startsWith('test_gck_')
      ? 'test'
      : null;
  const secretMode = secretKey.startsWith('live_gsk_')
    ? 'live'
    : secretKey.startsWith('test_gsk_')
      ? 'test'
      : null;

  if (!clientMode || !secretMode || clientMode !== secretMode) {
    throw new PaymentConfigError('Toss widget client and secret keys must be a matching gck/gsk pair.');
  }

  if (process.env.VERCEL_ENV === 'production' && clientMode !== 'live') {
    throw new PaymentConfigError('Production must use live Toss widget keys.');
  }
  if (clientMode === 'live' && process.env.VERCEL_ENV !== 'production') {
    throw new PaymentConfigError('Live Toss widget keys are only allowed in Vercel production.');
  }
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production' && clientMode !== 'test') {
    throw new PaymentConfigError('Preview and development must use test Toss widget keys.');
  }

  return clientMode;
}

function decodeBase64url(name, value, minimumBytes, exactBytes) {
  if (!/^[A-Za-z0-9_-]+$/.test(value) || /placeholder|example|change[-_]?me|unit[-_]?test/i.test(value)) {
    throw new PaymentConfigError(`${name} must be a non-placeholder base64url value.`);
  }
  const decoded = Buffer.from(value, 'base64url');
  if (decoded.toString('base64url') !== value
    || (exactBytes && decoded.length !== exactBytes)
    || (!exactBytes && decoded.length < minimumBytes)) {
    throw new PaymentConfigError(`${name} has an invalid length or encoding.`);
  }
  return value;
}

function parseExpiry(value, now = Date.now()) {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp) || timestamp <= now) {
    throw new PaymentConfigError('PAYMENT_LINK_EXPIRES_AT must be a future ISO 8601 timestamp.');
  }
  return timestamp;
}

function resolveAllowedOrigin() {
  if (process.env.VERCEL_ENV === 'production') return 'https://eduoneq.com';
  if (process.env.VERCEL_URL) return `https://${String(process.env.VERCEL_URL).trim().toLowerCase()}`;

  const value = String(process.env.PAYMENT_ALLOWED_ORIGIN || '').trim();
  let parsed;
  try {
    parsed = new URL(value);
  } catch (error) {
    throw new PaymentConfigError('PAYMENT_ALLOWED_ORIGIN is required outside Vercel.');
  }
  const isLocal = parsed.protocol === 'http:'
    && (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1' || parsed.hostname === '::1');
  if (!isLocal || parsed.origin !== value) {
    throw new PaymentConfigError('PAYMENT_ALLOWED_ORIGIN must be an exact local HTTP origin.');
  }
  return parsed.origin;
}

function getPaymentConfig() {
  for (const name of REQUIRED_ENV) readRequired(name);
  if (readRequired('PAYMENT_ENABLED') !== 'true') {
    throw new PaymentConfigError('The private payment link is disabled.');
  }

  const clientKey = readRequired('TOSS_CLIENT_KEY');
  const secretKey = readRequired('TOSS_SECRET_KEY');
  const mode = detectKeyMode(clientKey, secretKey);
  const currency = readRequired('PAYMENT_CURRENCY').toUpperCase();
  if (currency !== 'KRW') throw new PaymentConfigError('Only KRW payments are supported.');

  const orderId = readRequired('PAYMENT_ORDER_ID');
  const idempotencySeed = readRequired('PAYMENT_IDEMPOTENCY_SEED');
  if (!/^[A-Za-z0-9_-]{6,64}$/.test(orderId)
    || /placeholder|example|change[-_]?me|your_/i.test(orderId)) {
    throw new PaymentConfigError('PAYMENT_ORDER_ID must match the Toss orderId format.');
  }
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idempotencySeed)
    || idempotencySeed.toLowerCase() === '00000000-0000-4000-8000-000000000000') {
    throw new PaymentConfigError('PAYMENT_IDEMPOTENCY_SEED must be a UUID v4.');
  }

  const orderName = readRequired('PAYMENT_ORDER_NAME').slice(0, 100);
  const paymentMethodVariantKey = readRequired('TOSS_PAYMENT_METHOD_VARIANT_KEY');
  const agreementVariantKey = readRequired('TOSS_AGREEMENT_VARIANT_KEY');
  if (/placeholder|example|change[-_]?me|your_/i.test(orderName)) {
    throw new PaymentConfigError('PAYMENT_ORDER_NAME must not be a placeholder.');
  }
  for (const [name, value] of [
    ['TOSS_PAYMENT_METHOD_VARIANT_KEY', paymentMethodVariantKey],
    ['TOSS_AGREEMENT_VARIANT_KEY', agreementVariantKey]
  ]) {
    if (!/^[A-Za-z0-9_-]{1,64}$/.test(value) || /placeholder|example|change[-_]?me|your_/i.test(value)) {
      throw new PaymentConfigError(`${name} has an invalid value.`);
    }
  }

  return {
    amount: parseAmount(readRequired('PAYMENT_AMOUNT')),
    currency,
    orderName,
    clientKey,
    secretKey,
    paymentMethodVariantKey,
    agreementVariantKey,
    mode,
    passwordSalt: decodeBase64url('PAYMENT_PASSWORD_SALT', readRequired('PAYMENT_PASSWORD_SALT'), 16),
    passwordHash: decodeBase64url('PAYMENT_PASSWORD_HASH', readRequired('PAYMENT_PASSWORD_HASH'), 0, 32),
    linkTokenHash: decodeBase64url('PAYMENT_LINK_TOKEN_HASH', readRequired('PAYMENT_LINK_TOKEN_HASH'), 0, 32),
    sessionSecret: decodeBase64url('PAYMENT_SESSION_SECRET', readRequired('PAYMENT_SESSION_SECRET'), 32),
    linkExpiresAt: parseExpiry(readRequired('PAYMENT_LINK_EXPIRES_AT')),
    orderId,
    idempotencySeed,
    allowedOrigin: resolveAllowedOrigin()
  };
}

module.exports = {
  PaymentConfigError,
  getPaymentConfig,
  parseAmount,
  detectKeyMode,
  parseExpiry,
  resolveAllowedOrigin
};
