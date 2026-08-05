const crypto = require('node:crypto');

const SESSION_COOKIE = '__Secure-eduoneq-pay-session';
const ORDER_COOKIE = '__Secure-eduoneq-pay-order';
const COOKIE_PATH = '/payment';
const SESSION_MAX_AGE_SECONDS = 60 * 60;
const ORDER_MAX_AGE_SECONDS = 45 * 60;

function encode(value) {
  return Buffer.from(value).toString('base64url');
}

function decode(value) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function safeEqual(left, right) {
  const a = Buffer.isBuffer(left) ? left : Buffer.from(String(left));
  const b = Buffer.isBuffer(right) ? right : Buffer.from(String(right));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function signatureFor(encodedPayload, secret) {
  return crypto.createHmac('sha256', secret).update(encodedPayload).digest('base64url');
}

function signPayload(payload, secret) {
  const encodedPayload = encode(JSON.stringify(payload));
  return `${encodedPayload}.${signatureFor(encodedPayload, secret)}`;
}

function verifySignedPayload(token, secret, audience, now = Date.now()) {
  if (typeof token !== 'string' || token.length > 4096) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [encodedPayload, suppliedSignature] = parts;
  if (!safeEqual(suppliedSignature, signatureFor(encodedPayload, secret))) return null;

  try {
    const payload = JSON.parse(decode(encodedPayload));
    if (payload.v !== 1 || payload.aud !== audience) return null;
    if (!Number.isSafeInteger(payload.exp) || payload.exp <= now) return null;
    return payload;
  } catch (error) {
    return null;
  }
}

function parseCookies(req) {
  const header = String(req.headers.cookie || '');
  return header.split(';').reduce((cookies, item) => {
    const separator = item.indexOf('=');
    if (separator < 1) return cookies;
    const name = item.slice(0, separator).trim();
    const value = item.slice(separator + 1).trim();
    if (name) cookies[name] = value;
    return cookies;
  }, {});
}

function isLocalRequest(req) {
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(':')[0];
  return host === 'localhost' || host === '127.0.0.1' || host === '::1';
}

function serializeCookie(req, name, value, maxAgeSeconds) {
  const expires = new Date(Date.now() + Math.max(0, maxAgeSeconds) * 1000).toUTCString();
  const parts = [
    `${name}=${value}`,
    `Path=${COOKIE_PATH}`,
    `Max-Age=${Math.max(0, maxAgeSeconds)}`,
    `Expires=${expires}`,
    'HttpOnly',
    'SameSite=Lax',
    'Secure'
  ];
  return parts.join('; ');
}

function clearCookie(req, name) {
  return serializeCookie(req, name, '', 0);
}

function createSessionCookie(req, config, now = Date.now()) {
  const expiresAt = Math.min(now + SESSION_MAX_AGE_SECONDS * 1000, config.linkExpiresAt || Infinity);
  const maxAge = Math.max(0, Math.floor((expiresAt - now) / 1000));
  const payload = {
    v: 1,
    aud: 'eduoneq-payment-session',
    sid: crypto.randomBytes(16).toString('base64url'),
    iat: now,
    exp: expiresAt
  };
  return serializeCookie(req, SESSION_COOKIE, signPayload(payload, config.sessionSecret), maxAge);
}

function getSession(req, config, now = Date.now()) {
  const token = parseCookies(req)[SESSION_COOKIE];
  return verifySignedPayload(token, config.sessionSecret, 'eduoneq-payment-session', now);
}

function createOrder(req, config, now = Date.now()) {
  const expiresAt = Math.min(now + ORDER_MAX_AGE_SECONDS * 1000, config.linkExpiresAt || Infinity);
  const maxAge = Math.max(0, Math.floor((expiresAt - now) / 1000));
  const payload = {
    v: 1,
    aud: 'eduoneq-payment-order',
    orderId: config.orderId,
    amount: config.amount,
    currency: config.currency,
    orderName: config.orderName,
    iat: now,
    exp: expiresAt
  };
  return {
    payload,
    cookie: serializeCookie(req, ORDER_COOKIE, signPayload(payload, config.sessionSecret), maxAge)
  };
}

function getOrder(req, config, now = Date.now()) {
  const token = parseCookies(req)[ORDER_COOKIE];
  return verifySignedPayload(token, config.sessionSecret, 'eduoneq-payment-order', now);
}

function orderMatchesConfig(order, config) {
  return Boolean(order)
    && order.orderId === config.orderId
    && order.amount === config.amount
    && order.currency === config.currency
    && order.orderName === config.orderName;
}

function hashLinkToken(value) {
  return crypto.createHash('sha256').update(String(value)).digest('base64url');
}

async function verifyCredentials(password, linkToken, config) {
  if (typeof password !== 'string' || password.length > 64) return false;
  if (typeof linkToken !== 'string' || linkToken.length > 512) return false;
  if (!safeEqual(hashLinkToken(linkToken), config.linkTokenHash)) return false;

  let derivedPassword;
  try {
    const derived = await new Promise((resolve, reject) => {
      crypto.scrypt(password, config.passwordSalt, 32, (error, key) => {
        if (error) reject(error);
        else resolve(key);
      });
    });
    derivedPassword = derived.toString('base64url');
  } catch (error) {
    return false;
  }

  return safeEqual(derivedPassword, config.passwordHash);
}

function requestHost(req) {
  return String(req.headers['x-forwarded-host'] || req.headers.host || '').toLowerCase();
}

function isSameOriginRequest(req, config) {
  const origin = String(req.headers.origin || '');
  if (!origin || !config || !config.allowedOrigin) return false;
  try {
    const parsed = new URL(origin);
    const allowed = new URL(config.allowedOrigin);
    return parsed.origin === allowed.origin
      && requestHost(req) === allowed.host.toLowerCase();
  } catch (error) {
    return false;
  }
}

async function readJson(req, maxBytes = 4096) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    if (Buffer.byteLength(req.body) > maxBytes) throw new Error('PAYLOAD_TOO_LARGE');
    return req.body ? JSON.parse(req.body) : {};
  }

  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBytes) throw new Error('PAYLOAD_TOO_LARGE');
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

function anonymizeClient(req, secret) {
  const raw = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  return crypto.createHmac('sha256', secret).update(raw).digest('base64url').slice(0, 24);
}

module.exports = {
  SESSION_COOKIE,
  ORDER_COOKIE,
  createSessionCookie,
  createOrder,
  getSession,
  getOrder,
  orderMatchesConfig,
  clearCookie,
  verifyCredentials,
  isSameOriginRequest,
  readJson,
  anonymizeClient,
  signPayload,
  verifySignedPayload,
  safeEqual,
  hashLinkToken
};
