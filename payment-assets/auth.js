(function () {
  'use strict';

  const form = document.getElementById('unlock-form');
  const input = document.getElementById('payment-password');
  const button = document.getElementById('unlock-button');
  const status = document.getElementById('auth-status');
  if (!form || !input || !button || !status) return;

  const linkToken = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : '';
  if (!linkToken) {
    status.textContent = '전용 링크 정보가 없습니다. 전달받은 링크를 다시 열어 주세요.';
    button.disabled = true;
  }

  function setBusy(busy) {
    button.disabled = busy || !linkToken;
    button.setAttribute('aria-busy', busy ? 'true' : 'false');
    button.textContent = busy ? '확인 중…' : '결제 내용 확인';
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    const password = input.value.trim();
    if (!/^\d{4}$/.test(password)) {
      status.textContent = '숫자 4자리를 입력해 주세요.';
      input.focus();
      return;
    }

    setBusy(true);
    status.textContent = '';
    try {
      const response = await fetch('/payment/auth', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password, token: linkToken })
      });
      const result = await response.json().catch(function () { return {}; });
      if (!response.ok) {
        status.textContent = response.status === 429
          ? '입력 횟수가 너무 많습니다. 잠시 후 다시 시도해 주세요.'
          : (result.message || '비밀번호 또는 링크가 올바르지 않습니다.');
        input.select();
        return;
      }

      window.history.replaceState(null, '', '/payment/');
      window.location.replace('/payment/');
    } catch (error) {
      status.textContent = '네트워크 연결을 확인하고 다시 시도해 주세요.';
    } finally {
      setBusy(false);
    }
  });
}());
