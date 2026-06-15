// EDU ONEQ floating consultation flow for the 2026 AI support program.
(function () {
  const root = document.getElementById('floatchat');
  if (!root) return;

  const fab = document.getElementById('floatchat-fab');
  const panel = document.getElementById('floatchat-panel');
  const closeBtn = document.getElementById('floatchat-close');
  const expandBtn = document.getElementById('floatchat-expand');
  const form = document.getElementById('floatchat-form');
  const input = document.getElementById('floatchat-text');
  const body = document.getElementById('floatchat-body') || panel.querySelector('.fc-body');
  const nudge = document.getElementById('floatchat-nudge');
  const nudgeMain = document.getElementById('floatchat-nudge-main');
  const nudgeClose = document.getElementById('floatchat-nudge-close');

  const CONTACT_EMAILS = ['gwangphago@gmail.com', 'ghcho@eduoneq.com'];
  const STORAGE_KEY = 'eduoneq-ai-support-chat-nudge-dismissed';

  const steps = [
    {
      id: 'stage',
      type: 'choice',
      question: '현재 어느 단계이신가요?',
      placeholder: '예: 신청서 작성 중입니다',
      options: [
        '공고를 보고 검토 중',
        '신청서·사업계획서 준비 중',
        'AI 아이디어 구체화 필요',
        '선정 후 구축 파트너 탐색',
        '멘토기업 상담 먼저 희망'
      ]
    },
    {
      id: 'business',
      type: 'text',
      question: '운영 중인 사업을 간단히 알려주세요.',
      help: '예: 대구 수성구 베이커리 / 직원 3명 / 온라인 주문과 매장 판매 병행',
      placeholder: '업종, 지역, 사업장 규모를 적어주세요'
    },
    {
      id: 'problem',
      type: 'choice',
      question: 'AI로 가장 먼저 해결하고 싶은 업무는 무엇인가요?',
      placeholder: '직접 입력도 가능합니다',
      options: [
        '고객문의·예약·상담 자동화',
        '마케팅 콘텐츠·광고 자동화',
        '리뷰·고객반응 분석',
        '매출·재고·발주 데이터 분석',
        '문서·견적·보고서 자동화',
        '상품·서비스 고도화',
        '맞춤형 챗봇·AI 에이전트',
        '아직 모르겠고 진단 필요'
      ]
    },
    {
      id: 'data',
      type: 'choice',
      question: '현재 활용 가능한 자료나 시스템이 있나요?',
      placeholder: '예: 스마트스토어 주문 데이터와 엑셀이 있습니다',
      options: [
        '엑셀·구글시트',
        'POS·주문·예약 데이터',
        '스마트스토어·배민 등 판매 데이터',
        '인스타그램·블로그·카카오채널',
        '문서·PDF·HWP 자료',
        '정리된 데이터 없음'
      ]
    },
    {
      id: 'output',
      type: 'choice',
      question: '최종적으로 원하는 결과물은 무엇에 가깝나요?',
      placeholder: '예: 내부 직원용 자동화 도구가 필요합니다',
      options: [
        'AI 상담봇',
        'AI 마케팅 자동화',
        '업무 자동화 대시보드',
        'AI 기반 신제품·서비스',
        '내부 직원용 AI 업무도구',
        '사업계획서·발표평가용 모델 구체화'
      ]
    },
    {
      id: 'contact',
      type: 'text',
      question: '상담 회신을 위해 연락처를 남겨주세요.',
      help: '성함 / 사업장명 / 휴대폰 / 이메일을 함께 적어주시면 가장 빠릅니다.',
      placeholder: '예: 홍길동 / OO상점 / 010-0000-0000 / email@example.com'
    },
    {
      id: 'method',
      type: 'choice',
      question: '희망 상담 방식은 무엇인가요?',
      placeholder: '희망 시간을 직접 적어도 됩니다',
      options: [
        '전화 상담',
        '이메일 회신',
        '화상 미팅',
        '대구·경북 대면 상담',
        '가장 빠른 방식'
      ]
    },
    {
      id: 'consent',
      type: 'choice',
      question: '상담 접수를 위해 개인정보 수집에 동의하시나요?',
      help: '수집 항목: 이름, 연락처, 사업장명, 문의 내용. 이용 목적: AI 활용지원 사업 상담 회신. 보유 기간: 상담 종료 후 1년.',
      options: [
        '동의하고 상담 요청',
        '동의 없이 요약만 복사'
      ]
    }
  ];

  let started = false;
  let currentStep = 0;
  const answers = {};

  function open() {
    root.classList.add('is-open');
    root.classList.remove('show-nudge');
    fab.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
    if (!started) startFlow();
    setTimeout(() => input && input.focus(), 280);
  }

  function close() {
    root.classList.remove('is-open');
    fab.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
  }

  function toggleExpanded() {
    const expanded = !root.classList.contains('is-expanded');
    root.classList.toggle('is-expanded', expanded);
    expandBtn.setAttribute('aria-pressed', expanded ? 'true' : 'false');
    expandBtn.setAttribute('aria-label', expanded ? '상담창 축소' : '상담창 확대');
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function scrollToBottom() {
    body.scrollTop = body.scrollHeight;
  }

  function appendBubble(content, side, options = {}) {
    const bubble = document.createElement('div');
    bubble.className = `fc-bubble fc-bubble-${side}${options.className ? ` ${options.className}` : ''}`;
    if (options.html) {
      bubble.innerHTML = content;
    } else {
      bubble.textContent = content;
    }
    body.appendChild(bubble);
    scrollToBottom();
    return bubble;
  }

  function appendSystemCard() {
    const card = document.createElement('div');
    card.className = 'fc-program-card';
    card.innerHTML = `
      <div class="fc-program-kicker">2026 혁신 소상공인 AI 활용지원 사업</div>
      <strong>EDU ONEQ는 전문 AI 멘토/공급기업으로 함께합니다.</strong>
      <p>AI 활용모델 기획, RAG·에이전트 설계, 업무자동화, 챗봇, 데이터 연계, 시제품 구축까지 상담 가능합니다.</p>
      <div class="fc-program-grid">
        <span>STEP1 활용모델 구축</span>
        <span>STEP2 BM 구현</span>
        <span>최대 4천만원</span>
        <span>정부지원 80%</span>
      </div>
    `;
    body.appendChild(card);
    scrollToBottom();
  }

  function appendOptions(step) {
    const wrap = document.createElement('div');
    wrap.className = 'fc-options';
    step.options.forEach((option) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'fc-option';
      btn.textContent = option;
      btn.addEventListener('click', () => {
        wrap.classList.add('is-answered');
        wrap.querySelectorAll('.fc-option').forEach((item) => {
          item.disabled = true;
        });
        acceptAnswer(option);
      });
      wrap.appendChild(btn);
    });
    body.appendChild(wrap);
    scrollToBottom();
  }

  function replyWithTyping(callback) {
    const typing = document.createElement('div');
    typing.className = 'fc-bubble fc-bubble-in fc-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(typing);
    scrollToBottom();
    setTimeout(() => {
      typing.remove();
      callback();
      scrollToBottom();
    }, 520);
  }

  function askCurrentStep() {
    const step = steps[currentStep];
    if (!step) {
      finishFlow();
      return;
    }

    input.disabled = true;
    replyWithTyping(() => {
      appendBubble(step.question, 'in');
      if (step.help) appendBubble(step.help, 'in', { className: 'fc-note' });
      if (step.type === 'choice') appendOptions(step);
      input.placeholder = step.placeholder || '답변을 입력하세요';
      input.disabled = false;
    });
  }

  function startFlow() {
    started = true;
    currentStep = 0;
    Object.keys(answers).forEach((key) => delete answers[key]);
    body.innerHTML = '';
    appendBubble('안녕하세요. EDU ONEQ AI 활용지원 사업 상담입니다.', 'in');
    appendBubble('단순 AI 솔루션 구매가 아니라, 사업장에 맞는 AI 활용모델을 함께 기획하고 실제 적용 가능한 형태로 구체화합니다.', 'in');
    appendSystemCard();
    askCurrentStep();
  }

  function acceptAnswer(value) {
    const answer = String(value || '').trim();
    if (!answer) return;

    const step = steps[currentStep];
    if (!step) {
      appendBubble(answer, 'out');
      return;
    }

    answers[step.id] = answer;
    appendBubble(answer, 'out');
    currentStep += 1;
    input.disabled = true;

    if (step.id === 'consent') {
      finishFlow();
    } else {
      askCurrentStep();
    }
  }

  function buildSummary() {
    return [
      '[2026 혁신 소상공인 AI 활용지원 사업 상담]',
      '',
      `현재 단계: ${answers.stage || '-'}`,
      `사업 정보: ${answers.business || '-'}`,
      `해결 과제: ${answers.problem || '-'}`,
      `보유 자료/시스템: ${answers.data || '-'}`,
      `희망 결과물: ${answers.output || '-'}`,
      `연락처: ${answers.contact || '-'}`,
      `희망 상담 방식: ${answers.method || '-'}`,
      `개인정보 동의: ${answers.consent || '-'}`,
      '',
      'EDU ONEQ 지원 가능 범위:',
      '- AI 활용모델 기획 및 로드맵 수립',
      '- 프롬프트/에이전트/RAG 설계',
      '- 업무자동화 및 데이터 연계',
      '- AI 챗봇/상담봇/마케팅 자동화',
      '- 시제품 및 서비스 고도화',
      '- 사업계획서·발표평가용 실행계획 정리'
    ].join('\n');
  }

  function finishFlow() {
    const summary = buildSummary();
    const subject = encodeURIComponent('[AI 활용지원 상담] 소상공인 AI 도입 문의');
    const bodyText = encodeURIComponent(summary);
    const recipients = CONTACT_EMAILS.join(',');
    const mailto = `mailto:${recipients}?subject=${subject}&body=${bodyText}`;
    const consented = answers.consent === '동의하고 상담 요청';

    const html = `
      <strong>상담 요약이 정리되었습니다.</strong>
      <div class="fc-summary">
        <dl>
          <div><dt>단계</dt><dd>${escapeHtml(answers.stage || '-')}</dd></div>
          <div><dt>사업</dt><dd>${escapeHtml(answers.business || '-')}</dd></div>
          <div><dt>과제</dt><dd>${escapeHtml(answers.problem || '-')}</dd></div>
          <div><dt>자료</dt><dd>${escapeHtml(answers.data || '-')}</dd></div>
          <div><dt>결과물</dt><dd>${escapeHtml(answers.output || '-')}</dd></div>
          <div><dt>연락처</dt><dd>${escapeHtml(answers.contact || '-')}</dd></div>
          <div><dt>상담 방식</dt><dd>${escapeHtml(answers.method || '-')}</dd></div>
        </dl>
      </div>
      <p class="fc-disclaimer">지원사업 선정 여부와 지원금 규모는 주관기관 평가에 따라 결정됩니다. EDU ONEQ는 AI 활용모델 기획과 구축 실행을 지원합니다.</p>
      <div class="fc-actions">
        <a class="fc-action-primary" href="${mailto}">${consented ? '상담 메일 보내기' : '요약 메일로 직접 보내기'}</a>
        <button type="button" class="fc-action-secondary" data-copy-summary>요약 복사</button>
        <button type="button" class="fc-action-secondary" data-restart-flow>다시 작성</button>
      </div>
    `;

    replyWithTyping(() => {
      appendBubble(html, 'in', { html: true, className: 'fc-wide' });
      input.placeholder = '추가로 남길 내용을 입력하세요';
      input.disabled = false;
    });
  }

  function maybeShowNudge() {
    let dismissed = false;
    try {
      dismissed = window.sessionStorage.getItem(STORAGE_KEY) === 'true';
    } catch (error) {
      dismissed = false;
    }
    if (!nudge || dismissed) return;
    setTimeout(() => {
      if (!root.classList.contains('is-open')) root.classList.add('show-nudge');
    }, 1400);
  }

  fab.addEventListener('click', () => {
    root.classList.contains('is-open') ? close() : open();
  });
  closeBtn.addEventListener('click', close);
  expandBtn.addEventListener('click', toggleExpanded);

  if (nudgeMain) nudgeMain.addEventListener('click', () => open());

  if (nudgeClose) {
    nudgeClose.addEventListener('click', (event) => {
      event.stopPropagation();
      root.classList.remove('show-nudge');
      try {
        window.sessionStorage.setItem(STORAGE_KEY, 'true');
      } catch (error) {
        // Some embedded browsers disable sessionStorage; the nudge can still close.
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && root.classList.contains('is-open')) close();
  });

  body.addEventListener('click', async (event) => {
    const copyBtn = event.target.closest('[data-copy-summary]');
    if (copyBtn) {
      const summary = buildSummary();
      try {
        await navigator.clipboard.writeText(summary);
        copyBtn.textContent = '복사 완료';
      } catch (error) {
        copyBtn.textContent = '복사 실패';
      }
      setTimeout(() => {
        copyBtn.textContent = '요약 복사';
      }, 1800);
      return;
    }

    if (event.target.closest('[data-restart-flow]')) {
      startFlow();
    }
  });

  form.addEventListener('submit', () => {
    const value = (input.value || '').trim();
    if (!value) return;
    input.value = '';

    if (currentStep < steps.length) {
      acceptAnswer(value);
    } else {
      appendBubble(value, 'out');
      replyWithTyping(() => {
        appendBubble('추가 내용까지 확인했습니다. 상담 메일을 보내주시면 담당자가 내용을 기준으로 빠르게 회신드리겠습니다.', 'in');
      });
    }
  });

  maybeShowNudge();
})();
