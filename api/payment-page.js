const { getPaymentConfig } = require('../lib/payment-config');
const { getSession, SESSION_COOKIE, clearCookie } = require('../lib/payment-security');
const { setPrivateHeaders } = require('../lib/payment-headers');
const { loginPage, checkoutPage, serviceErrorPage } = require('../lib/payment-html');

module.exports = function handler(req, res) {
  setPrivateHeaders(res);
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const config = getPaymentConfig();
    const session = getSession(req, config);
    if (!session) {
      if (String(req.headers.cookie || '').includes(`${SESSION_COOKIE}=`)) {
        res.setHeader('Set-Cookie', clearCookie(req, SESSION_COOKIE));
      }
      return res.status(200).send(req.method === 'HEAD' ? '' : loginPage());
    }
    return res.status(200).send(req.method === 'HEAD' ? '' : checkoutPage(config));
  } catch (error) {
    return res.status(503).send(req.method === 'HEAD' ? '' : serviceErrorPage());
  }
};
