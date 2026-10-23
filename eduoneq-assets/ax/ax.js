(() => {
  const form = document.getElementById('ax-inquiry');
  const topic = document.getElementById('topic');
  const status = document.getElementById('mail-status');
  if (!form || !topic || !status) return;

  document.querySelectorAll('[data-ax-topic]').forEach((link) => {
    link.addEventListener('click', () => { topic.value = link.dataset.axTopic; });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = (name) => form.elements.namedItem(name).value.trim();
    const subject = `[AX 구축 문의] ${value('organization') || '기업 맞춤 AI 시스템'} / ${value('topic')}`;
    const body = [
      '안녕하세요. 에듀원큐 기업 AX 구축을 문의합니다.',
      '',
      `기업·기관: ${value('organization') || '상담 시 협의'}`,
      `관심 구축 분야: ${value('topic')}`,
      `현재 사용 도구: ${value('tools') || '상담 시 협의'}`,
      `희망 일정·예산: ${value('schedule') || '상담 시 협의'}`,
      '',
      '[바꾸고 싶은 업무·원하는 결과]',
      value('message') || '상담을 통해 구축 범위를 정하고 싶습니다.',
      '',
      '관련 페이지: https://eduoneq.com/ax/'
    ].join('\n');
    window.location.href = `mailto:ghcho@eduoneq.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = '메일 앱에서 내용을 확인한 뒤 전송해 주세요. 앱이 열리지 않으면 ghcho@eduoneq.com으로 직접 보내실 수 있습니다.';
  });
})();
