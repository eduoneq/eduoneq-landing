const DEFAULT_RECIPIENTS = ['gwangphago@gmail.com', 'ghcho@eduoneq.com'];
const MAX_FIELD_LENGTH = 2000;
const MAX_DRAFT_FIELD_LENGTH = 6000;
const DRAFT_FIELDS = [
  ['region', '신청권역'],
  ['category', '신청유형'],
  ['company', '업체명'],
  ['owner', '대표자명'],
  ['contact', '연락처'],
  ['industry', '업종'],
  ['businessNo', '사업자번호'],
  ['budget', '사업비'],
  ['aiModels', '활용 AI 모델'],
  ['itemSummary', '사업아이템 한줄 요약'],
  ['companyIntro', '기업 소개'],
  ['motivation', '지원 동기'],
  ['companyStatus', '기업 현황'],
  ['businessContent', '사업 내용'],
  ['currentAi', 'AI 활용 현황'],
  ['aiItem', 'AI 활용 아이템 소개'],
  ['modelPlan', 'AI 활용모델 구축 계획'],
  ['bmPlan', 'AI 비즈니스 모델 개선 계획'],
  ['mentoringPlan', '멘토링 활용 계획'],
  ['fundPlan', '사업화자금 활용'],
  ['goals', '성과 목표 및 향후계획']
];

function clean(value, fallback = '-') {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  return text ? text.slice(0, MAX_FIELD_LENGTH) : fallback;
}

function escapeHtml(value) {
  return clean(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function cleanDraft(value, fallback = '-') {
  const text = String(value || '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return text ? text.slice(0, MAX_DRAFT_FIELD_LENGTH) : fallback;
}

function escapeHtmlDraft(value) {
  return cleanDraft(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseRecipients() {
  const raw = process.env.CONSULTATION_RECIPIENTS || DEFAULT_RECIPIENTS.join(',');
  return raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function extractEmail(text) {
  const match = String(text || '').match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match ? match[0] : undefined;
}

function draftRows(draft) {
  if (!draft || typeof draft !== 'object') return [];
  return DRAFT_FIELDS.map(([key, label]) => [label, draft[key]]);
}

function buildDraftText(draft) {
  const rows = draftRows(draft);
  if (!rows.length) return [];

  return [
    '[사업신청서 초안]',
    ...rows.map(([label, value]) => `${label}: ${cleanDraft(value)}`)
  ];
}

function buildDraftHtml(draft) {
  const rows = draftRows(draft);
  if (!rows.length) return '';

  return `
    <h2 style="margin:24px 0 8px;font-size:16px">사업신청서 초안</h2>
    <table style="width:100%;border-collapse:collapse;border:1px solid #dbe4ff;border-radius:12px;overflow:hidden">
      <tbody>
        ${rows.map(([label, value]) => `
          <tr>
            <th align="left" style="width:170px;padding:10px 12px;background:#f4f7ff;border-bottom:1px solid #e8eeff;color:#3154c8;font-size:13px;vertical-align:top">${escapeHtml(label)}</th>
            <td style="padding:10px 12px;border-bottom:1px solid #e8eeff;font-size:14px;white-space:pre-line">${escapeHtmlDraft(value)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function buildText(id, answers, meta, draft) {
  const draftText = buildDraftText(draft);

  return [
    `[상담 접수번호] ${id}`,
    '',
    '[2026 혁신 소상공인 AI 활용지원 사업 상담]',
    '',
    `현재 단계: ${clean(answers.stage)}`,
    `사업 정보: ${clean(answers.business)}`,
    `해결 과제: ${clean(answers.problem)}`,
    `보유 자료/시스템: ${clean(answers.data)}`,
    `희망 결과물: ${clean(answers.output)}`,
    `연락처: ${clean(answers.contact)}`,
    `희망 상담 방식: ${clean(answers.method)}`,
    `개인정보 동의: ${clean(answers.consent)}`,
    '',
    'EDU ONEQ 지원 가능 범위:',
    '- AI 활용모델 기획 및 로드맵 수립',
    '- 프롬프트/에이전트/RAG 설계',
    '- 업무자동화 및 데이터 연계',
    '- AI 챗봇/상담봇/마케팅 자동화',
    '- 시제품 및 서비스 고도화',
    '- 사업계획서·발표평가용 실행계획 정리',
    ...(draftText.length ? ['', ...draftText] : []),
    '',
    '[접수 메타]',
    `페이지: ${clean(meta.pageUrl)}`,
    `접수시각: ${clean(meta.submittedAt)}`,
    `브라우저: ${clean(meta.userAgent)}`
  ].join('\n');
}

function buildHtml(id, answers, meta, draft, isDraftSubmission) {
  const rows = [
    ['현재 단계', answers.stage],
    ['사업 정보', answers.business],
    ['해결 과제', answers.problem],
    ['보유 자료/시스템', answers.data],
    ['희망 결과물', answers.output],
    ['연락처', answers.contact],
    ['희망 상담 방식', answers.method],
    ['개인정보 동의', answers.consent]
  ];

  return `
    <div style="font-family:Arial,'Apple SD Gothic Neo','Noto Sans KR',sans-serif;color:#111827;line-height:1.6">
      <p style="margin:0 0 8px;color:#4A6FDC;font-weight:700">${isDraftSubmission ? '2026 혁신 소상공인 AI 활용지원 사업 신청서 초안' : '2026 혁신 소상공인 AI 활용지원 사업 상담'}</p>
      <h1 style="margin:0 0 16px;font-size:22px;line-height:1.25">${isDraftSubmission ? '신청서 초안 검토 요청이 접수되었습니다.' : '신규 상담이 접수되었습니다.'}</h1>
      <p style="margin:0 0 20px;color:#4b5563">접수번호: <strong>${escapeHtml(id)}</strong></p>
      <table style="width:100%;border-collapse:collapse;border:1px solid #dbe4ff;border-radius:12px;overflow:hidden">
        <tbody>
          ${rows.map(([label, value]) => `
            <tr>
              <th align="left" style="width:150px;padding:10px 12px;background:#f4f7ff;border-bottom:1px solid #e8eeff;color:#3154c8;font-size:13px">${escapeHtml(label)}</th>
              <td style="padding:10px 12px;border-bottom:1px solid #e8eeff;font-size:14px">${escapeHtml(value)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <h2 style="margin:22px 0 8px;font-size:16px">EDU ONEQ 지원 가능 범위</h2>
      <ul style="margin:0 0 20px;padding-left:20px;color:#374151">
        <li>AI 활용모델 기획 및 로드맵 수립</li>
        <li>프롬프트/에이전트/RAG 설계</li>
        <li>업무자동화 및 데이터 연계</li>
        <li>AI 챗봇/상담봇/마케팅 자동화</li>
        <li>시제품 및 서비스 고도화</li>
        <li>사업계획서·발표평가용 실행계획 정리</li>
      </ul>
      ${buildDraftHtml(draft)}
      <p style="margin:0;color:#6b7280;font-size:12px">
        페이지: ${escapeHtml(meta.pageUrl)}<br>
        접수시각: ${escapeHtml(meta.submittedAt)}<br>
        브라우저: ${escapeHtml(meta.userAgent)}
      </p>
    </div>
  `;
}

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body);

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

async function sendWithGoogleAppsScript(email) {
  const webhookUrl = process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL;
  if (!webhookUrl) return null;

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: process.env.GOOGLE_APPS_SCRIPT_SECRET || '',
      id: email.id,
      to: email.recipients,
      subject: email.subject,
      text: email.text,
      html: email.html,
      replyTo: email.replyTo || ''
    })
  });

  const raw = await response.text();
  let result = {};
  try {
    result = raw ? JSON.parse(raw) : {};
  } catch (error) {
    result = { raw };
  }

  if (!response.ok || result.ok === false) {
    const message = result.message || result.error || 'Google Apps Script 메일 발송에 실패했습니다.';
    const error = new Error(message);
    error.code = 'GOOGLE_APPS_SCRIPT_SEND_FAILED';
    error.detail = result;
    throw error;
  }

  return {
    provider: 'google-apps-script',
    mailId: result.mailId || result.id || email.id,
    detail: result
  };
}

async function sendWithResend(email) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: process.env.CONSULTATION_FROM || 'EDU ONEQ <noreply@eduoneq.com>',
      to: email.recipients,
      reply_to: email.replyTo,
      subject: email.subject,
      text: email.text,
      html: email.html
    })
  });

  const result = await resendResponse.json().catch(() => ({}));
  if (!resendResponse.ok) {
    const error = new Error(result.message || 'Resend 메일 발송에 실패했습니다.');
    error.code = 'MAIL_SEND_FAILED';
    error.detail = result;
    throw error;
  }

  return {
    provider: 'resend',
    mailId: result.id,
    detail: result
  };
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ ok: false, message: 'POST 요청만 허용됩니다.' });
  }

  try {
    const payload = await readJson(req);
    const answers = payload.answers || {};
    const isDraftSubmission = payload.kind === 'ai-application-draft';
    const draft = payload.draft && typeof payload.draft === 'object' ? payload.draft : null;

    if (answers.consent !== '동의하고 상담 요청') {
      return res.status(400).json({
        ok: false,
        code: 'CONSENT_REQUIRED',
        message: '상담 접수에는 개인정보 수집 동의가 필요합니다.'
      });
    }

    const recipients = parseRecipients();
    if (!recipients.length) {
      return res.status(503).json({
        ok: false,
        code: 'RECIPIENTS_MISSING',
        message: '상담 수신 이메일이 설정되지 않았습니다.'
      });
    }

    const id = `EDU-${Date.now().toString(36).toUpperCase()}`;
    const submittedAt = new Date().toISOString();
    const meta = {
      pageUrl: payload.pageUrl || req.headers.referer || '-',
      submittedAt,
      userAgent: payload.userAgent || req.headers['user-agent'] || '-'
    };
    const text = buildText(id, answers, meta, draft);
    const html = buildHtml(id, answers, meta, draft, isDraftSubmission);
    const replyTo = extractEmail(answers.contact);
    const subjectPrefix = isDraftSubmission ? 'AI 활용지원 신청서 초안 제출' : 'AI 활용지원 상담 접수';
    const subjectSource = draft && draft.company ? draft.company : answers.business;
    const subjectBusiness = clean(subjectSource, '소상공인 AI 도입 문의').slice(0, 80);
    const email = {
      id,
      recipients,
      replyTo,
      subject: `[${subjectPrefix}] ${id} - ${subjectBusiness}`,
      text,
      html
    };

    let result = null;
    try {
      result = await sendWithGoogleAppsScript(email);
      if (!result) result = await sendWithResend(email);
    } catch (error) {
      return res.status(502).json({
        ok: false,
        code: error.code || 'MAIL_SEND_FAILED',
        message: error.message || '메일 발송에 실패했습니다.',
        detail: error.detail || {}
      });
    }

    if (!result) {
      return res.status(503).json({
        ok: false,
        code: 'MAIL_CONFIG_MISSING',
        message: '메일 발송 환경변수 GOOGLE_APPS_SCRIPT_WEBHOOK_URL 또는 RESEND_API_KEY가 설정되지 않았습니다.'
      });
    }

    return res.status(200).json({ ok: true, id, provider: result.provider, mailId: result.mailId });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      code: 'SERVER_ERROR',
      message: '상담 접수 처리 중 오류가 발생했습니다.'
    });
  }
};
