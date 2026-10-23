(() => {
  const form = document.getElementById('education-inquiry');
  const topic = document.getElementById('topic');
  const status = document.getElementById('mail-status');
  const recipient = 'ghcho@eduoneq.com';
  if (!form || !topic || !status) return;

  document.querySelectorAll('[data-course]').forEach((link) => {
    link.addEventListener('click', () => {
      topic.value = link.dataset.course;
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = (name) => form.elements.namedItem(name).value.trim();
    const subject = `[교육 문의] ${value('organization') || '맞춤 교육 상담'} / ${value('topic')}`;
    const body = [
      '안녕하세요. 에듀원큐 교육을 문의합니다.',
      '',
      `기관·학교: ${value('organization') || '상담 시 협의'}`,
      `관심 교육: ${value('topic')}`,
      `대상·인원: ${value('audience') || '상담 시 협의'}`,
      `희망 일정·방식: ${value('schedule') || '상담 시 협의'}`,
      '',
      '[교육 목적·요청사항]',
      value('message') || '상담을 통해 교육 내용을 정하고 싶습니다.',
      '',
      '관련 페이지: https://eduoneq.com/education/'
    ].join('\n');
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = '메일 앱에서 내용을 확인한 뒤 전송해 주세요. 앱이 열리지 않으면 ghcho@eduoneq.com으로 직접 보내실 수 있습니다.';
  });
})();
