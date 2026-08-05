const { getPaymentConfig } = require('../lib/payment-config');
const { clearCookie, SESSION_COOKIE, ORDER_COOKIE, isSameOriginRequest } = require('../lib/payment-security');
const { setJsonHeaders } = require('../lib/payment-headers');

module.exports = function handler(req, res) {
  setJsonHeaders(res);
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false });
  }
  try {
    const config = getPaymentConfig();
    if (!isSameOriginRequest(req, config)) return res.status(403).json({ ok: false });
    res.setHeader('Set-Cookie', [clearCookie(req, SESSION_COOKIE), clearCookie(req, ORDER_COOKIE)]);
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(503).json({ ok: false });
  }
};
