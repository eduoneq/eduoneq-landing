const { getPaymentConfig } = require('../lib/payment-config');
const {
  createSessionCookie,
  verifyCredentials,
  isSameOriginRequest,
  readJson,
  anonymizeClient
} = require('../lib/payment-security');
const { setJsonHeaders } = require('../lib/payment-headers');

const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attempts = new Map();

function rateState(key, now = Date.now()) {
  const existing = attempts.get(key);
  if (!existing || existing.resetAt <= now) return { count: 0, resetAt: now + WINDOW_MS };
  return existing;
}

function recordFailure(key, now = Date.now()) {
  const state = rateState(key, now);
  state.count += 1;
  attempts.set(key, state);
  return state;
}

function clearExpired(now = Date.now()) {
  if (attempts.size < 500) return;
  for (const [key, value] of attempts) {
    if (value.resetAt <= now) attempts.delete(key);
  }
}

module.exports = async function handler(req, res) {
  setJsonHeaders(res);
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'POST 요청만 허용됩니다.' });
  }

  try {
    const config = getPaymentConfig();
    if (!isSameOriginRequest(req, config)) {
      return res.status(403).json({ ok: false, message: '요청 출처를 확인할 수 없습니다.' });
    }

    clearExpired();
    const clientKey = anonymizeClient(req, config.sessionSecret);
    const current = rateState(clientKey);
    if (current.count >= MAX_ATTEMPTS) {
      res.setHeader('Retry-After', String(Math.max(1, Math.ceil((current.resetAt - Date.now()) / 1000))));
      return res.status(429).json({ ok: false, message: '잠시 후 다시 시도해 주세요.' });
    }

    const body = await readJson(req);
    if (!await verifyCredentials(body.password, body.token, config)) {
      const state = recordFailure(clientKey);
      await new Promise((resolve) => setTimeout(resolve, 350));
      if (state.count >= MAX_ATTEMPTS) res.setHeader('Retry-After', String(Math.ceil(WINDOW_MS / 1000)));
      return res.status(state.count >= MAX_ATTEMPTS ? 429 : 401).json({
        ok: false,
        message: '비밀번호 또는 링크가 올바르지 않습니다.'
      });
    }

    attempts.delete(clientKey);
    res.setHeader('Set-Cookie', createSessionCookie(req, config));
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(503).json({ ok: false, message: '결제 페이지 인증을 준비할 수 없습니다.' });
  }
};
