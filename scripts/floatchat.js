(function () {
  const root = document.getElementById('floatchat');
  if (!root) return;
  const fab = document.getElementById('floatchat-fab');
  const panel = document.getElementById('floatchat-panel');
  const closeBtn = document.getElementById('floatchat-close');
  const form = document.getElementById('floatchat-form');
  const input = document.getElementById('floatchat-text');
  const body = panel.querySelector('.fc-body');

  function open() {
    root.classList.add('is-open');
    fab.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
    setTimeout(() => input && input.focus(), 280);
  }
  function close() {
    root.classList.remove('is-open');
    fab.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
  }
  fab.addEventListener('click', () => {
    root.classList.contains('is-open') ? close() : open();
  });
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.classList.contains('is-open')) close();
  });

  function appendBubble(text, side) {
    const b = document.createElement('div');
    b.className = 'fc-bubble fc-bubble-' + side;
    b.textContent = text;
    body.appendChild(b);
    body.scrollTop = body.scrollHeight;
    return b;
  }

  function reply(text) {
    setTimeout(() => {
      const typing = document.createElement('div');
      typing.className = 'fc-bubble fc-bubble-in fc-typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      body.appendChild(typing);
      body.scrollTop = body.scrollHeight;
      setTimeout(() => {
        typing.remove();
        appendBubble(text, 'in');
      }, 900);
    }, 350);
  }

  panel.querySelectorAll('.fc-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      appendBubble(chip.textContent.trim() + ' 문의 부탁드립니다.', 'out');
      reply('확인했습니다. 어떤 부분이 궁금하신지 자유롭게 적어주세요. 담당자가 24시간 내에 회신드릴게요.');
    });
  });

  form.addEventListener('submit', () => {
    const v = (input.value || '').trim();
    if (!v) return;
    appendBubble(v, 'out');
    input.value = '';
    reply('메시지 잘 받았습니다 🙌 이메일 주소를 함께 남겨주시면 더 빠르게 답변드릴 수 있어요.');
  });
})();
