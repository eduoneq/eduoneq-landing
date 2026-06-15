(function () {
  const endpoint = '/api/consultation';
  const fields = Array.from(document.querySelectorAll('[data-field]'));
  const chatThread = document.getElementById('draft-chat-thread');
  const composer = document.getElementById('draft-composer');
  const chatInput = document.getElementById('draft-chat-input');
  const submitButton = document.getElementById('submit-draft');
  const submitMessage = document.getElementById('draft-submit-message');
  const consent = document.getElementById('draft-consent');
  const copyButton = document.getElementById('copy-draft');
  const resetButton = document.getElementById('reset-draft');
  const clearButton = document.getElementById('draft-chat-clear');

  const storageKey = 'eduoneq-ai-application-draft';

  const presets = {
    store: {
      category: '업무자동화',
      aiModels: 'ChatGPT, Claude, RAG 기반 FAQ 챗봇, 예약/문의 자동화 에이전트',
      itemSummary: 'AI를 활용한 고객문의·예약 자동응답 및 재방문 고객 관리 자동화 서비스',
      companyIntro: '당사는 지역 상권에서 오프라인 매장을 운영하며, 단골 고객과 신규 방문 고객을 대상으로 제품과 서비스를 제공하고 있습니다. 현장 운영 경험과 고객 응대 노하우를 보유하고 있으나, 반복 문의와 예약 관리, 리뷰 대응에 많은 시간이 소요되고 있어 AI 기반 업무 효율화가 필요한 상황입니다.',
      motivation: '본 사업을 통해 반복적인 고객 문의, 예약 확인, 리뷰 대응 업무를 자동화하고 직원이 매장 운영과 서비스 품질 개선에 집중할 수 있는 구조를 만들고자 합니다. AI 활용모델을 통해 고객 응답 속도와 재방문율을 높이고, 소상공인도 지속 운영 가능한 업무 자동화 체계를 구축하고자 합니다.',
      companyStatus: '현재 매장 방문 고객, 전화 문의, 온라인 채널 문의가 꾸준히 발생하고 있으며 고객 리뷰와 주문 기록이 축적되고 있습니다. 다만 데이터가 여러 채널에 흩어져 있어 고객 특성 분석과 맞춤 응대가 체계적으로 이루어지지 못하고 있습니다.',
      businessContent: '주요 서비스는 매장 기반 판매와 예약, 고객 상담으로 구성됩니다. 고객은 전화, 카카오채널, 네이버플레이스, SNS 등을 통해 문의하고, 매장은 주문·예약 확인과 안내를 수동으로 처리합니다. AI 도입 후에는 문의 분류, 답변 추천, 예약 확인, 리뷰 요약, 쿠폰 안내까지 하나의 흐름으로 연결하여 운영 효율성과 고객 경험을 동시에 개선할 계획입니다.',
      currentAi: '현재 생성형 AI를 콘텐츠 문구 작성에 일부 활용하고 있으나, 고객 데이터와 업무 프로세스에 직접 연결된 AI 시스템은 없습니다. 주문·예약 내역, 자주 묻는 질문, 고객 리뷰 등 AI 모델 설계에 활용 가능한 자료는 보유하고 있습니다.',
      aiItem: '본 아이템은 소상공인의 실제 고객응대 업무에 맞춘 AI 상담·예약 보조 시스템입니다. 단순 챗봇 도입이 아니라 사업장의 FAQ, 예약 규칙, 운영 시간, 고객 리뷰 데이터를 반영해 문의 유형을 분류하고 상황별 응답 초안을 생성합니다.',
      modelPlan: 'STEP1에서는 사업장 워크플로우와 고객 문의 데이터를 정리하고, FAQ/RAG 지식베이스와 응답 정책을 설계합니다. 이후 AI 멘토기업과 함께 프롬프트, 답변 톤, 예약 처리 흐름을 테스트하여 현장에서 바로 활용 가능한 AI 활용모델을 구축합니다.',
      bmPlan: 'AI 적용 후 기존 수동 응대 중심의 운영모델을 자동 응대와 직원 확인이 결합된 모델로 개선합니다. 고객은 더 빠른 답변을 받고, 사업장은 반복 업무 시간을 줄이며, 축적된 고객 데이터를 기반으로 재방문 마케팅과 상품 추천을 고도화할 수 있습니다.',
      mentoringPlan: 'AI 멘토기업과 고객 문의 유형 분석, RAG 지식베이스 구성, 챗봇 답변 품질 검수, 개인정보·보안 기준을 함께 점검하고 싶습니다. 멘토링 이후에는 사업장 담당자가 FAQ를 갱신하고 월별 문의 데이터를 확인하며 직접 운영할 계획입니다.',
      fundPlan: 'STEP2 선정 시 AI 상담봇 구축, 예약 시스템 연계, 고객 데이터 정리, 테스트 운영, 홍보 콘텐츠 제작에 사업화자금을 활용할 계획입니다. 단순 솔루션 구독이 아니라 사업장 업무 흐름에 맞춘 AI 활용모델의 현장 적용과 기능 확장을 중심으로 집행합니다.',
      goals: '정량 목표는 반복 문의 응답시간 50% 단축, 예약 누락 30% 감소, 재방문 쿠폰 발송 전환율 개선입니다. 정성 목표는 직원 업무 부담 완화와 고객 응대 품질 표준화입니다. 사업 종료 후에는 축적된 데이터를 바탕으로 상품 추천과 리뷰 분석 기능을 지속 고도화할 계획입니다.'
    },
    commerce: {
      category: '마케팅·디자인',
      aiModels: 'ChatGPT, Gemini, Claude, 이미지 생성 AI, 광고 카피 자동화 도구',
      itemSummary: 'AI 기반 상품 상세페이지·광고 소재 자동 생성 및 판매 데이터 기반 마케팅 최적화',
      companyIntro: '당사는 온라인 판매와 SNS 홍보를 병행하는 소상공인으로, 제품 기획과 고객 커뮤니케이션을 직접 수행하고 있습니다. 상품 경쟁력은 있으나 상세페이지 제작, 광고 문구 작성, 고객 반응 분석을 수작업으로 처리하고 있어 마케팅 생산성 향상이 필요합니다.',
      motivation: 'AI를 활용해 상품 콘텐츠 제작 시간을 줄이고, 판매 데이터와 리뷰를 분석하여 고객군별 마케팅 메시지를 고도화하고자 합니다. 본 사업을 통해 온라인 판로 확장과 매출 성장을 위한 실천형 AI 활용모델을 구축하고자 합니다.',
      companyStatus: '스마트스토어, SNS, 블로그 등 온라인 채널을 운영 중이며 주문 데이터, 리뷰, 방문자 반응 데이터가 일부 축적되어 있습니다. 다만 데이터 기반으로 마케팅 의사결정을 하는 체계는 부족합니다.',
      businessContent: '주요 제품은 온라인 채널을 통해 판매되며, 고객 유입은 검색, SNS, 광고 콘텐츠를 통해 발생합니다. AI 도입 후에는 상품 특성에 맞는 상세페이지 초안, 광고 문구, 이미지 콘셉트, 리뷰 요약, 고객 세그먼트별 메시지를 자동 생성하여 판매 흐름을 개선할 계획입니다.',
      currentAi: '생성형 AI를 간단한 문구 작성에 사용한 경험은 있으나 상품 데이터, 리뷰, 광고 성과와 연결한 자동화 체계는 없습니다.',
      aiItem: '본 아이템은 판매 데이터와 고객 리뷰를 바탕으로 상품 콘텐츠와 광고 소재를 자동 생성하는 AI 마케팅 보조 시스템입니다. 시장 내 경쟁 상품과 고객 반응을 분석해 차별화 포인트를 제안하고 콘텐츠 제작 시간을 단축합니다.',
      modelPlan: '상품 정보, 리뷰, 판매 데이터를 정리하고, 상품군별 카피라이팅 프롬프트와 콘텐츠 템플릿을 설계합니다. AI 멘토기업과 함께 상세페이지, SNS 문구, 광고 소재 생성 흐름을 테스트하고 품질 기준을 수립합니다.',
      bmPlan: 'AI 적용 후 콘텐츠 제작과 광고 운영이 분리되어 있던 기존 모델을 데이터 기반 마케팅 루프로 개선합니다. 판매 반응을 분석해 다음 콘텐츠에 반영하고, 고객 세그먼트별 메시지와 프로모션을 지속 최적화합니다.',
      mentoringPlan: '멘토링을 통해 상품 데이터 정리 방식, 광고 문구 프롬프트, 이미지 생성 가이드, 콘텐츠 품질 검수 기준을 구체화하고 싶습니다. 이후 운영자가 직접 템플릿을 수정하며 시즌별 상품 홍보에 활용할 계획입니다.',
      fundPlan: '사업화자금은 상품 데이터 정리, AI 콘텐츠 생성 시스템 구축, 이미지·상세페이지 제작, 광고 테스트, 성과 분석 대시보드 구축에 활용할 계획입니다.',
      goals: '콘텐츠 제작 시간 60% 절감, 광고 소재 테스트 횟수 2배 확대, 온라인 매출 증가를 목표로 합니다. 사업 종료 후에는 신제품 출시 시 AI 콘텐츠 제작 프로세스를 표준화해 지속 활용하겠습니다.'
    },
    document: {
      category: '업무자동화',
      aiModels: 'Docs ONEQ, ChatGPT, Claude, 문서 RAG, 업무 자동화 에이전트',
      itemSummary: 'AI 기반 견적서·보고서·고객 안내문 초안 작성 및 HWP 문서 자동화',
      companyIntro: '당사는 고객 상담, 견적, 납품, 보고 업무가 반복적으로 발생하는 소상공인입니다. 사업 특성상 문서 작성이 많지만 전담 인력이 부족하여 대표자와 직원이 수작업으로 문서를 작성하고 있습니다.',
      motivation: 'AI를 활용해 반복 문서 작성 시간을 줄이고, 상담 내용과 거래 정보를 기반으로 견적서·보고서·안내문 초안을 빠르게 작성하고자 합니다. 이를 통해 고객 응대 속도와 문서 품질을 동시에 개선하고자 합니다.',
      companyStatus: '기존 견적서, 거래 내역, 고객 문의 기록, 안내문 양식 등 문서 자료를 보유하고 있습니다. 다만 자료가 표준화되어 있지 않고 작성자별 품질 차이가 발생하고 있습니다.',
      businessContent: '고객 문의 접수 후 상담 내용을 정리하고, 견적 또는 안내 문서를 작성한 뒤 고객에게 전달하는 흐름으로 업무가 진행됩니다. AI 도입 후에는 상담 요약, 견적 초안, 문서 검토, 발송 문구 생성까지 일관된 프로세스로 자동화합니다.',
      currentAi: '일부 문서 문구 작성에 생성형 AI를 활용한 경험이 있으나 HWP 양식과 연결된 자동화는 구축되어 있지 않습니다.',
      aiItem: '본 아이템은 HWP 양식과 상담 데이터를 연결해 문서 초안을 자동 작성하는 AI 문서 자동화 모델입니다. 기존 양식은 유지하고 필요한 내용만 AI가 채우도록 설계합니다.',
      modelPlan: '기존 HWP 문서 양식과 자주 쓰는 문구를 정리하고, 문서 유형별 입력 항목과 생성 규칙을 설계합니다. AI 멘토기업과 함께 초안 생성, 문체 보정, 검토 체크리스트를 테스트합니다.',
      bmPlan: 'AI 적용 후 문서 작성 중심의 병목을 줄이고 고객 대응 속도를 높입니다. 문서 품질 표준화로 신뢰도를 높이고, 직원이 핵심 상담과 서비스 개선에 집중할 수 있는 구조로 개선합니다.',
      mentoringPlan: '멘토링에서는 문서 양식 구조화, HWP 편집 자동화 가능 범위, 개인정보 처리 기준, 직원이 직접 운영할 수 있는 템플릿 관리 방식을 구체화하고 싶습니다.',
      fundPlan: '사업화자금은 HWP 문서 자동화 도구 구축, 템플릿 정리, 상담 데이터 연계, 직원 교육, 테스트 운영에 활용할 계획입니다.',
      goals: '문서 작성 시간 50% 절감, 견적 회신 속도 40% 개선, 문서 오류 감소를 목표로 합니다. 종료 후에는 문서 유형을 추가하며 내부 업무 자동화 범위를 확장하겠습니다.'
    }
  };

  function valueOf(field) {
    const el = document.querySelector(`[data-field="${field}"]`);
    return el ? (el.value || '').trim() : '';
  }

  function setField(field, value) {
    const el = document.querySelector(`[data-field="${field}"]`);
    if (!el || !value) return;
    el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function collectDraft() {
    return fields.reduce((draft, el) => {
      draft[el.dataset.field] = (el.value || '').trim();
      return draft;
    }, {});
  }

  function draftSummary() {
    const draft = collectDraft();
    const labels = {
      region: '신청권역',
      category: '신청유형',
      company: '업체명',
      owner: '대표자명',
      contact: '연락처',
      industry: '업종',
      businessNo: '사업자번호',
      budget: '사업비',
      aiModels: '활용 AI 모델',
      itemSummary: '사업아이템 한줄 요약',
      companyIntro: '기업 소개',
      motivation: '지원 동기',
      companyStatus: '기업 현황',
      businessContent: '사업 내용',
      currentAi: 'AI 활용 현황',
      aiItem: 'AI 활용 아이템 소개',
      modelPlan: 'AI 활용모델 구축 계획',
      bmPlan: 'AI 비즈니스 모델 개선 계획',
      mentoringPlan: '멘토링 활용 계획',
      fundPlan: '사업화자금 활용',
      goals: '성과 목표 및 향후계획'
    };

    return Object.entries(labels)
      .map(([key, label]) => `${label}: ${draft[key] || '-'}`)
      .join('\n\n');
  }

  function saveDraft() {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(collectDraft()));
    } catch (error) {}
  }

  function loadDraft() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(storageKey) || '{}');
      Object.keys(saved).forEach((key) => setField(key, saved[key]));
    } catch (error) {}
  }

  function addMessage(type, html) {
    const bubble = document.createElement('div');
    bubble.className = `draft-bubble ${type}`;
    bubble.innerHTML = html;
    chatThread.appendChild(bubble);
    chatThread.scrollTop = chatThread.scrollHeight;
    return bubble;
  }

  function fillPreset(name, userMemo) {
    const template = presets[name] || presets.store;
    Object.keys(template).forEach((field) => setField(field, template[field]));

    if (userMemo) {
      setField('motivation', `${template.motivation}\n\n[사용자 메모 반영]\n${userMemo}`);
      setField('companyIntro', `${template.companyIntro}\n\n추가 메모: ${userMemo}`);
    }

    if (!valueOf('company')) setField('company', '작성 필요');
    if (!valueOf('owner')) setField('owner', '작성 필요');
    if (!valueOf('contact')) setField('contact', '작성 필요');
    if (!valueOf('industry')) setField('industry', name === 'commerce' ? '온라인 판매업' : name === 'document' ? '서비스업' : '음식점업');
    if (!valueOf('budget')) setField('budget', '총 40,000천원 (정부지원금 32,000천원, 자부담금 8,000천원)');

    saveDraft();
  }

  function runAgent(name, memo) {
    const labels = {
      store: '매장 고객응대 자동화',
      commerce: '온라인 판매·마케팅 자동화',
      document: '문서·견적·보고 자동화',
      review: '현재 초안 점검'
    };
    addMessage('user', `<p>${escapeHtml(memo || labels[name] || '초안 생성')}</p>`);

    if (name === 'review') {
      const missing = fields
        .filter((field) => !field.value.trim())
        .map((field) => field.closest('label')?.firstChild?.textContent?.trim() || field.dataset.field);
      addMessage('agent', `
        <strong>초안 점검 결과</strong>
        <p>${missing.length ? `아직 비어 있는 항목은 ${missing.slice(0, 8).join(', ')}입니다.` : '필수 초안 항목이 대부분 채워졌습니다.'}</p>
        <div class="draft-steps">
          <span class="draft-step">단순 AI 구독이 아닌 업무 흐름 기반 모델인지 확인하세요.</span>
          <span class="draft-step">사업화자금은 시스템 연계, 시제품, 홍보, 고도화 중심으로 작성하세요.</span>
          <span class="draft-step">정량 목표는 응답시간, 매출, 전환율, 작업시간처럼 측정 가능하게 쓰는 것이 좋습니다.</span>
        </div>
      `);
      return;
    }

    addMessage('agent', `
      <strong>${labels[name] || 'AI 활용모델'} 초안을 작성했습니다.</strong>
      <p>신청서식의 일반 현황, 사업 내용, 추진 계획 항목에 맞춰 중앙 HWP 페이지에 반영했습니다.</p>
      <div class="draft-steps">
        <span class="draft-step">업무 문제와 AI 적용 범위 정리</span>
        <span class="draft-step">STEP1 활용모델 구축 계획 작성</span>
        <span class="draft-step">STEP2 사업화자금 활용 계획 작성</span>
      </div>
    `);
    fillPreset(name, memo);
  }

  function escapeHtml(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  async function copyDraft() {
    const text = draftSummary();
    try {
      await navigator.clipboard.writeText(text);
      copyButton.textContent = '복사 완료';
    } catch (error) {
      copyButton.textContent = '복사 실패';
    }
    setTimeout(() => {
      copyButton.textContent = '초안 복사';
    }, 1600);
  }

  function resetDraft() {
    if (!window.confirm('작성 중인 초안을 초기화할까요?')) return;
    fields.forEach((field) => {
      field.value = '';
    });
    consent.checked = false;
    submitMessage.textContent = '';
    submitMessage.classList.remove('error');
    try {
      window.localStorage.removeItem(storageKey);
    } catch (error) {}
    addMessage('agent', '<strong>초안을 초기화했습니다.</strong><p>오른쪽 예시 버튼이나 직접 메모 입력으로 다시 작성할 수 있습니다.</p>');
  }

  async function submitDraft() {
    submitMessage.classList.remove('error');
    submitMessage.textContent = '';

    if (!consent.checked) {
      submitMessage.classList.add('error');
      submitMessage.textContent = '개인정보 수집·이용 동의 후 제출할 수 있습니다.';
      return;
    }

    const draft = collectDraft();
    if (!draft.contact || !draft.company) {
      submitMessage.classList.add('error');
      submitMessage.textContent = '업체명과 연락처를 먼저 입력해 주세요.';
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = '제출 중...';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'ai-application-draft',
          source: 'ai-application-page',
          pageUrl: window.location.href,
          userAgent: navigator.userAgent,
          draft,
          summary: draftSummary(),
          answers: {
            stage: 'AI 활용지원 사업 신청서 초안 작성',
            business: `${draft.company || '-'} / ${draft.industry || '-'}`,
            problem: draft.motivation || draft.itemSummary || '-',
            data: 'HWP 신청서식 기반 웹 초안',
            output: '사업신청서/사업계획서 초안 검토 요청',
            contact: draft.contact || '-',
            method: '이메일 또는 전화 회신',
            consent: '동의하고 상담 요청'
          }
        })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) {
        throw new Error(result.message || '초안 제출에 실패했습니다.');
      }
      submitMessage.textContent = `초안이 접수되었습니다. 접수번호: ${result.id}`;
      addMessage('agent', `<strong>초안 제출 완료</strong><p>접수번호는 ${escapeHtml(result.id)}입니다. EDU ONEQ 담당자가 확인 후 연락드리겠습니다.</p>`);
    } catch (error) {
      submitMessage.classList.add('error');
      submitMessage.textContent = error.message || '초안 제출에 실패했습니다. 잠시 후 다시 시도해 주세요.';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = '초안 제출하기';
    }
  }

  fields.forEach((field) => {
    field.addEventListener('input', saveDraft);
    field.addEventListener('change', saveDraft);
  });

  document.querySelectorAll('[data-preset]').forEach((button) => {
    button.addEventListener('click', () => runAgent(button.dataset.preset, chatInput.value.trim()));
  });

  composer.addEventListener('submit', (event) => {
    event.preventDefault();
    const memo = chatInput.value.trim();
    runAgent('store', memo);
    chatInput.value = '';
  });

  copyButton.addEventListener('click', copyDraft);
  resetButton.addEventListener('click', resetDraft);
  clearButton.addEventListener('click', () => {
    chatThread.innerHTML = '';
    addMessage('agent', '<strong>새 대화를 시작합니다.</strong><p>사업장 상황을 적거나 예시 버튼을 눌러 초안을 생성해 주세요.</p>');
  });
  submitButton.addEventListener('click', submitDraft);

  loadDraft();
})();
