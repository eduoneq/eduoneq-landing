# EDU ONEQ Landing

㈜에듀원큐(EDU ONEQ Corp.)의 공식 기업 랜딩 사이트입니다. AI 입시·진로 진단 플랫폼 **AiBU** 와 HWP 문서 자동화 플랫폼 **Docs ONEQ** 의 진입점 역할을 합니다.

- 운영 URL: https://eduoneq.com
- 정본: GitHub `eduoneq/eduoneq-landing` (`main` = 프로덕션)
- 호스팅: Vercel 자동 배포

작업·인계·배포 규칙은 [`AGENTS.md`](./AGENTS.md) 와 [`DEVELOPMENT.md`](./DEVELOPMENT.md) 를 따릅니다.

---

## 구조

빌드 도구 없는 정적 사이트 + Vercel 서버리스 함수입니다. 홈은 `/main/` 에 프리렌더된 React Router 앱이며, 루트 `index.html` 이 `/main/` 으로 리다이렉트합니다.

```
eduoneq-landing/
├── index.html                # 진입점 → /main/ 리다이렉트
├── main/                      # 라이브 앱 (홈 · contact · customers) — 프리렌더 + /assets 번들
├── privacy/  terms/          # 약관 페이지
├── api/                      # Vercel 서버리스 (consultation.js, locales.js)
├── __manifest               # React Router 지연 라우트 탐색 엔드포인트
├── assets/  images/  eduoneq-assets/   # 앱 번들 · 이미지 · 로고
├── scripts/                  # main-link-audit-fixes.js, validate.sh
├── config/                   # naver-log.js (네이버 애널리틱스)
├── proxy/                    # popup 데이터 엔드포인트
├── favicon.*  og-image.png  apple-touch-icon.png
└── AGENTS.md  CLAUDE.md  DEVELOPMENT.md
```

---

## 로컬 실행

정적 프리뷰:

```bash
python3 -m http.server 8000   # http://localhost:8000/ → /main/
```

`api/` 서버리스 함수까지 로컬에서 실행하려면:

```bash
vercel dev
```

---

## 배포

`main` 에 병합하면 Vercel 이 https://eduoneq.com 에 자동 배포합니다. 브랜치 push 는 프리뷰 배포를 만듭니다. 자세한 절차는 [`DEVELOPMENT.md`](./DEVELOPMENT.md) 를 참고하세요.

---

## 상담 메일 환경변수 (Vercel)

`api/consultation.js` 가 상담·문의 제출을 서버에서 메일로 발송합니다. Vercel Project Settings → Environment Variables 에 설정합니다.

| Key | 용도 |
|-----|------|
| `GOOGLE_APPS_SCRIPT_WEBHOOK_URL` | Apps Script 웹앱 URL (권장 발송 경로) |
| `GOOGLE_APPS_SCRIPT_SECRET` | 위 웹앱과 공유하는 시크릿 |
| `RESEND_API_KEY` | Resend 폴백 발송 키 |
| `CONSULTATION_FROM` | 발신자 (Resend 인증 도메인) |
| `CONSULTATION_RECIPIENTS` | 수신자 (쉼표 구분) |

Apps Script URL 이 있으면 Apps Script 가 우선, 없으면 Resend 로 폴백합니다. 시크릿은 GitHub 에 커밋하지 않습니다.

---

## 회사 정보

**㈜에듀원큐 / EDU ONEQ Corp.**

- 대표: 조광현
- 사업자등록번호: 168-88-03261
- 본사: 대구광역시 동구 동대구로 465, 3층 308호 (신천동, 대구스케일업허브)
- 전화: 053-742-1007
- 이메일: ghcho@eduoneq.com

운영 서비스:

- AiBU — https://aibu.co.kr (생활기록부 기반 AI 입시·진로 진단)
- Docs ONEQ — https://docsoneq.com (HWP 웹 편집 + AI 문서 자동화)

---

## 라이선스

(c) 2026 EDU ONEQ Corp. All rights reserved.

이 리포의 모든 코드·디자인·텍스트·이미지 자산은 EDU ONEQ Corp. 의 자산입니다. 무단 복제·재배포·상업적 이용을 금합니다.
