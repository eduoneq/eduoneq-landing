(function () {
  'use strict';

  const root = document.getElementById('payment-checkout');
  const payButton = document.getElementById('payment-button');
  const logoutButton = document.getElementById('logout-button');
  const status = document.getElementById('payment-status');
  if (!root || !payButton || !status) return;

  const config = {
    clientKey: root.dataset.clientKey || '',
    amount: Number(root.dataset.amount || 0),
    currency: root.dataset.currency || '',
    orderName: root.dataset.orderName || '',
    paymentVariant: root.dataset.paymentVariant || '',
    agreementVariant: root.dataset.agreementVariant || ''
  };

  let widgets;
  let started = false;
  let activePaymentWindow = null;
  const defaultButtonLabel = payButton.textContent;
  const allowedPaymentCodes = new Set([
    'CARD', 'TRANSFER', 'EASY_PAY',
    'TOSSPAY', 'NAVERPAY', 'SAMSUNGPAY', 'LPAY', 'KAKAOPAY', 'PAYCO', 'SSG', 'APPLEPAY', 'PINPAY'
  ]);

  function setStatus(message, isError) {
    status.textContent = message;
    status.classList.toggle('is-error', Boolean(isError));
  }

  function setBusy(busy) {
    payButton.disabled = busy;
    payButton.setAttribute('aria-busy', busy ? 'true' : 'false');
  }

  async function destroyPaymentWindow() {
    const paymentWindow = activePaymentWindow;
    activePaymentWindow = null;
    if (!paymentWindow) return;
    try {
      await paymentWindow.destroy();
    } catch (error) {
      // The Toss SDK can report that the window was already closed.
    }
  }

  function validateConfig() {
    return /^(?:test|live)_gck_/.test(config.clientKey)
      && Number.isSafeInteger(config.amount)
      && config.amount > 0
      && config.currency === 'KRW'
      && config.orderName
      && config.paymentVariant
      && config.agreementVariant
      && typeof window.TossPayments === 'function';
  }

  async function requestOrder() {
    const response = await fetch('/payment/order', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: '{}'
    });
    const result = await response.json().catch(function () { return {}; });
    if (!response.ok) throw new Error(result.message || '주문을 준비하지 못했습니다.');
    if (result.amount !== config.amount
      || result.currency !== config.currency
      || result.orderName !== config.orderName
      || !/^[A-Za-z0-9_-]{6,64}$/.test(result.orderId || '')) {
      throw new Error('주문 정보 검증에 실패했습니다.');
    }
    return result;
  }

  if (!validateConfig()) {
    setStatus('결제 설정을 불러오지 못했습니다. EDU ONEQ에 문의해 주세요.', true);
    payButton.disabled = true;
  } else {
    widgets = window.TossPayments(config.clientKey).widgets({ customerKey: window.TossPayments.ANONYMOUS });
  }

  payButton.addEventListener('click', async function () {
    if (started || !widgets) return;
    started = true;
    setBusy(true);
    setStatus('결제창을 준비하고 있습니다.', false);

    try {
      await destroyPaymentWindow();
      const order = await requestOrder();
      await widgets.setAmount({ value: config.amount, currency: config.currency });
      activePaymentWindow = await widgets.renderPaymentWindow({
        variantKey: {
          paymentMethod: config.paymentVariant,
          agreement: config.agreementVariant
        }
      });
      setStatus('결제수단을 선택한 뒤 토스페이먼츠 창에서 결제를 완료해 주세요.', false);
      started = false;
      setBusy(false);
      payButton.textContent = '결제창 다시 열기';

      let paymentRequested = false;
      activePaymentWindow.on('paymentRequest', async function (event) {
        if (paymentRequested) return;
        const paymentMethod = event && (event.paymentMethod || event);
        if (!paymentMethod || !allowedPaymentCodes.has(paymentMethod.code)) {
          await destroyPaymentWindow();
          payButton.textContent = defaultButtonLabel;
          setStatus('이 링크에서는 즉시 승인되는 카드·계좌이체·간편결제만 이용할 수 있습니다.', true);
          return;
        }
        paymentRequested = true;
        started = true;
        setBusy(true);
        try {
          await widgets.requestPayment({
            orderId: order.orderId,
            orderName: order.orderName,
            successUrl: window.location.origin + '/payment/success',
            failUrl: window.location.origin + '/payment/fail'
          });
        } catch (error) {
          await destroyPaymentWindow();
          paymentRequested = false;
          started = false;
          setBusy(false);
          payButton.textContent = defaultButtonLabel;
          setStatus(error && error.code === 'USER_CANCEL'
            ? '결제를 취소했습니다. 다시 시도할 수 있습니다.'
            : '결제창을 열지 못했습니다. 잠시 후 다시 시도해 주세요.', true);
        }
      });
    } catch (error) {
      await destroyPaymentWindow();
      started = false;
      setBusy(false);
      payButton.textContent = defaultButtonLabel;
      setStatus(error.message || '결제를 준비하지 못했습니다. 잠시 후 다시 시도해 주세요.', true);
    }
  });

  if (logoutButton) {
    logoutButton.addEventListener('click', async function () {
      logoutButton.disabled = true;
      try {
        await destroyPaymentWindow();
        await fetch('/payment/logout', { method: 'POST', credentials: 'same-origin' });
      } finally {
        window.location.replace('/');
      }
    });
  }
}());
