const PAYMENT_CSP = [
  "default-src 'none'",
  "script-src 'self' https://js.tosspayments.com",
  "connect-src 'self' https://*.tosspayments.com https://*.toss.im",
  "frame-src https://*.tosspayments.com https://*.toss.im",
  "img-src 'self' data: https://*.tosspayments.com https://*.toss.im",
  "style-src 'self'",
  "font-src 'self'",
  "form-action 'self' https://*.tosspayments.com https://*.toss.im",
  "frame-ancestors 'none'",
  "base-uri 'none'",
  "object-src 'none'"
].join('; ');

function setPrivateHeaders(res, contentType = 'text/html; charset=utf-8') {
  res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', 'private, no-store, max-age=0, must-revalidate');
  res.setHeader('CDN-Cache-Control', 'no-store');
  res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Vary', 'Cookie');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy', PAYMENT_CSP);
}

function setJsonHeaders(res) {
  setPrivateHeaders(res, 'application/json; charset=utf-8');
}

module.exports = {
  PAYMENT_CSP,
  setPrivateHeaders,
  setJsonHeaders
};
