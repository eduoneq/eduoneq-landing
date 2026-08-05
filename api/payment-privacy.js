const { setPrivateHeaders } = require('../lib/payment-headers');
const { paymentPrivacyPage } = require('../lib/payment-html');

module.exports = function handler(req, res) {
  setPrivateHeaders(res);
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).send('Method Not Allowed');
  }

  return res.status(200).send(req.method === 'HEAD' ? '' : paymentPrivacyPage());
};
