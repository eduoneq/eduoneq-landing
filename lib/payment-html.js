function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatKrw(amount) {
  return `${new Intl.NumberFormat('ko-KR').format(amount)}원`;
}

function documentShell({ title, description, bodyClass = '', content, scripts = '' }) {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="robots" content="noindex,nofollow,noarchive,nosnippet">
  <meta name="referrer" content="no-referrer">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="icon" href="/favicon.ico" type="image/x-icon">
  <link rel="stylesheet" href="/payment-assets/payment.css">
</head>
<body class="${escapeHtml(bodyClass)}">
  ${content}
  ${scripts}
</body>
</html>`;
}

function brandMark() {
  return `<div class="brand-mark" aria-label="EDU ONEQ">
    <img src="/eduoneq-assets/eduoneq-logo.png" alt="EDU ONEQ" width="148" height="40">
  </div>`;
}

function loginPage() {
  return documentShell({
    title: '보호된 결제 | EDU ONEQ',
    description: '비밀번호로 보호된 EDU ONEQ 결제 페이지',
    bodyClass: 'payment-page gate-page',
    content: `<main class="gate-layout">
      <section class="gate-card" aria-labelledby="gate-title">
        ${brandMark()}
        <div class="eyebrow"><span class="status-dot" aria-hidden="true"></span>보호된 결제</div>
        <h1 id="gate-title">비밀번호를 입력해 주세요</h1>
        <p class="lead">전달받은 전용 링크와 비밀번호가 모두 일치해야 결제 내용을 확인할 수 있습니다.</p>
        <form id="unlock-form" class="gate-form" novalidate>
          <label for="payment-password">비밀번호</label>
          <input id="payment-password" name="password" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="current-password" aria-describedby="password-help auth-status" required autofocus>
          <p id="password-help" class="field-help">숫자 4자리를 입력하세요.</p>
          <button id="unlock-button" class="primary-button" type="submit">결제 내용 확인</button>
          <p id="auth-status" class="form-status" role="alert" aria-live="polite"></p>
        </form>
        <div class="security-note">
          <span class="lock-icon" aria-hidden="true"></span>
          <p>비밀번호와 결제정보는 암호화된 연결로 전송됩니다.</p>
        </div>
        <div class="gate-legal"><a href="/payment/privacy" target="_blank" rel="noopener noreferrer">결제 개인정보 처리 안내</a></div>
      </section>
    </main>`,
    scripts: '<script src="/payment-assets/auth.js" defer></script>'
  });
}

function checkoutPage(config) {
  const modeLabel = config.mode === 'test' ? '테스트 결제' : '안전 결제';
  return documentShell({
    title: '결제 확인 | EDU ONEQ',
    description: 'EDU ONEQ 결제 금액과 항목 확인',
    bodyClass: 'payment-page checkout-page',
    content: `<main id="payment-checkout" class="checkout-shell"
      data-client-key="${escapeHtml(config.clientKey)}"
      data-amount="${escapeHtml(config.amount)}"
      data-currency="${escapeHtml(config.currency)}"
      data-order-name="${escapeHtml(config.orderName)}"
      data-payment-variant="${escapeHtml(config.paymentMethodVariantKey)}"
      data-agreement-variant="${escapeHtml(config.agreementVariantKey)}">
      <header class="checkout-header">
        ${brandMark()}
        <button id="logout-button" class="text-button" type="button" aria-label="결제 페이지 나가기">나가기</button>
      </header>
      <div class="checkout-grid">
        <section class="order-panel" aria-labelledby="checkout-title">
          <div class="eyebrow"><span class="status-dot" aria-hidden="true"></span>${escapeHtml(modeLabel)}</div>
          <h1 id="checkout-title">결제 내용을 확인해 주세요</h1>
          <p class="lead">아래 금액은 서버에서 고정되어 있으며 결제 과정에서 변경되지 않습니다.</p>
          <dl class="order-summary">
            <div class="summary-row">
              <dt>결제 항목</dt>
              <dd>${escapeHtml(config.orderName)}</dd>
            </div>
            <div class="summary-row summary-total">
              <dt>최종 결제금액</dt>
              <dd>${escapeHtml(formatKrw(config.amount))}</dd>
            </div>
          </dl>
          <button id="payment-button" class="primary-button payment-button" type="button">${escapeHtml(formatKrw(config.amount))} 결제하기</button>
          <p id="payment-status" class="form-status" role="status" aria-live="polite"></p>
          <p class="contract-copy">본 결제는 거래 당사자가 별도로 합의한 계약에 따른 결제입니다. 결제 전 항목·금액·계약 내용을 다시 확인해 주세요.</p>
        </section>
        <aside class="trust-panel" aria-label="결제 안내">
          <div class="trust-icon" aria-hidden="true">✓</div>
          <h2>토스페이먼츠 안전 결제</h2>
          <p>결제수단 선택과 본인인증은 토스페이먼츠 결제창에서 진행됩니다.</p>
          <ul>
            <li>카드·계좌 정보는 EDU ONEQ 서버에 저장되지 않습니다.</li>
            <li>결제수단별 한도와 심사 상태에 따라 이용이 제한될 수 있습니다.</li>
            <li>승인 완료 전에는 결제가 완료된 것으로 처리하지 않습니다.</li>
          </ul>
          <div class="legal-links">
            <span>거래조건: 별도 계약서 기준</span>
            <a href="/payment/privacy" target="_blank" rel="noopener noreferrer">결제 개인정보 안내</a>
          </div>
        </aside>
      </div>
    </main>`,
    scripts: '<script src="https://js.tosspayments.com/v2/standard" defer></script>\n<script src="/payment-assets/checkout.js" defer></script>'
  });
}

function paymentPrivacyPage() {
  return documentShell({
    title: '결제 개인정보 처리 안내 | EDU ONEQ',
    description: 'EDU ONEQ 전용 결제의 개인정보 처리 안내',
    bodyClass: 'payment-page result-page',
    content: `<main class="result-layout">
      <section class="result-card notice-card" aria-labelledby="privacy-title">
        ${brandMark()}
        <div class="eyebrow"><span class="status-dot" aria-hidden="true"></span>결제 개인정보 안내</div>
        <h1 id="privacy-title">토스페이먼츠 결제 처리 안내</h1>
        <p class="lead">주식회사 에듀원큐는 결제 처리와 정산을 위해 아래 업무를 토스페이먼츠에 위탁합니다.</p>
        <dl class="result-details">
          <div><dt>수탁자</dt><dd>토스페이먼츠 주식회사</dd></div>
          <div><dt>처리 목적</dt><dd>결제 승인·취소·환불·정산 및 영수증 제공</dd></div>
          <div><dt>처리 정보</dt><dd>주문번호, 결제수단 식별값, 승인·취소 내역, 영수증 정보</dd></div>
          <div><dt>보유 기간</dt><dd>관련 법령과 수탁자 정책에 따른 보존기간</dd></div>
        </dl>
        <p class="notice-copy">카드번호와 계좌정보는 토스페이먼츠 결제창에서 직접 처리되며 EDU ONEQ 서버에 저장되지 않습니다. 거래조건과 환불 기준은 거래 당사자가 별도로 합의한 계약을 따릅니다. 본 안내는 2026년 8월 5일부터 적용됩니다.</p>
        <div class="result-actions">
          <a class="secondary-button link-button" href="/payment/">결제 화면으로 돌아가기</a>
        </div>
      </section>
    </main>`
  });
}

function resultPage({ ok, title, message, orderName, amount, orderId, method, receiptUrl, retryAllowed = false }) {
  const stateClass = ok ? 'result-success' : 'result-failure';
  let safeReceipt = '';
  try {
    const parsedReceipt = new URL(String(receiptUrl || ''));
    if (parsedReceipt.protocol === 'https:'
      && (parsedReceipt.hostname === 'tosspayments.com' || parsedReceipt.hostname.endsWith('.tosspayments.com'))) {
      safeReceipt = parsedReceipt.href;
    }
  } catch (error) {
    safeReceipt = '';
  }
  return documentShell({
    title: `${title} | EDU ONEQ`,
    description: message,
    bodyClass: `payment-page result-page ${stateClass}`,
    content: `<main class="result-layout">
      <section class="result-card" aria-labelledby="result-title">
        ${brandMark()}
        <div class="result-symbol" aria-hidden="true">${ok ? '✓' : '!'}</div>
        <h1 id="result-title">${escapeHtml(title)}</h1>
        <p class="lead">${escapeHtml(message)}</p>
        ${orderName ? `<dl class="result-details">
          <div><dt>결제 항목</dt><dd>${escapeHtml(orderName)}</dd></div>
          ${amount ? `<div><dt>결제금액</dt><dd>${escapeHtml(formatKrw(amount))}</dd></div>` : ''}
          ${method ? `<div><dt>결제수단</dt><dd>${escapeHtml(method)}</dd></div>` : ''}
          ${orderId ? `<div><dt>주문번호</dt><dd class="order-id">${escapeHtml(orderId)}</dd></div>` : ''}
        </dl>` : ''}
        <div class="result-actions">
          ${safeReceipt ? `<a class="primary-button link-button" href="${escapeHtml(safeReceipt)}" target="_blank" rel="noopener noreferrer">영수증 확인</a>` : ''}
          ${retryAllowed ? '<a class="secondary-button link-button" href="/payment/">다시 시도</a>' : '<a class="secondary-button link-button" href="/">홈으로</a>'}
        </div>
      </section>
    </main>`,
    scripts: '<script src="/payment-assets/result.js" defer></script>'
  });
}

function serviceErrorPage() {
  return resultPage({
    ok: false,
    title: '결제 페이지를 준비할 수 없습니다',
    message: '설정을 확인하고 잠시 후 다시 시도해 주세요. 계속되면 EDU ONEQ에 문의해 주세요.',
    retryAllowed: true
  });
}

module.exports = {
  escapeHtml,
  formatKrw,
  loginPage,
  checkoutPage,
  paymentPrivacyPage,
  resultPage,
  serviceErrorPage
};
