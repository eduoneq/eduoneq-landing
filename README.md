# EDU ONEQ Landing

> **기술은 첨단으로, 교육은 더 가까이.**
> AI 입시·진로 진단 플랫폼 **AiBU** 와 HWP 문서 자동화 플랫폼 **Docs ONEQ** 를 운영하는 **㈜에듀원큐(EDU ONEQ Corp.)** 의 공식 기업 랜딩페이지.

[![Status](https://img.shields.io/badge/status-production--ready-success)]()
[![License](https://img.shields.io/badge/license-Proprietary-blue)]()
[![Built with](https://img.shields.io/badge/built%20with-HTML%20%2B%20CSS%20%2B%20Vanilla%20JS-orange)]()

---

## 📌 개요

EDU ONEQ는 한국 교육 현장의 두 가지 핵심 페인포인트 — **학생의 진로·입시 설계** 와 **교육기관의 문서 업무** — 를 AI로 풀어내는 에듀테크 기업입니다.

이 리포는 EDU ONEQ Corp.의 **회사 소개 + 두 프로덕트(AiBU · Docs ONEQ) 진입점** 역할을 하는 단일 페이지 랜딩 사이트의 소스 코드입니다.

레퍼런스 디자인은 [PolyAI Behance 케이스](https://www.behance.net/gallery/246115611/PolyAI-AI-Voice-Translation-Platform-Web-Design)의 톤·매너·인터랙션을 EDU ONEQ 브랜드(블루 그라디언트, Pretendard 타이포, 한국 교육 컨텍스트)로 어댑테이션 했습니다.

브랜드 디자인 기준은 [`DESIGN.md`](./DESIGN.md)에 정리되어 있습니다.

---

## 🧭 주요 섹션

| # | 섹션 | 설명 |
|---|------|------|
| 01 | **Hero** | 그라디언트 헤드라인 + Floating AiBU 대시보드 / Docs 문서 미리보기 카드 + 핵심 통계 메타 |
| 02 | **Products** | AiBU(레이더 차트로 전공적합성 시각화) / Docs ONEQ(diff 워크플로우 미리보기) |
| 03 | **Features (Bento)** | 6개 카드 — AI 엔진 · 보안 · API · 속도 · 워크스페이스 · 통합 |
| 04 | **How it works** | 4단계 진행 트랙 (생기부 업로드 → AI 분석 → 매칭 → 리포트) |
| 05 | **Use Cases** | 학생/학부모, 교사/강사, 학원/기관, 정부/공공 — 4탭 인터랙션 |
| 06 | **Numbers / Stats** | 인터섹션 옵저버 기반 카운터 애니메이션 |
| 07 | **About** | EDU ONEQ Corp. 미션 · 사업 영역 · 본사 정보 |
| 08 | **News / Press** | 매일신문 인터뷰 · DGTP 영상 · 한국장학재단 기부 약정 |
| 09 | **FAQ** | 아코디언 6문항 |
| 10 | **Trusted by** | 도입 기관·파트너 무한 마퀴 (푸터 위) |
| 11 | **Footer** | 사이트맵 · 사업자 정보 · 소셜 · 다국어 카피 |
| 12 | **AI Support Popup / Floating Chat** | 소상공인 AI 활용지원 사업 멘토기업 선정 배너 + 단계형 상담 접수 |

---

## ✨ 인터랙션 / 동작

- **스크롤 Reveal 애니메이션** — `IntersectionObserver` 기반 페이드/슬라이드 인
- **카운터 애니메이션** — 통계 숫자 0 → 목표값 이징 보간
- **Marquee** — 도입 기관 로고/텍스트 무한 가로 스크롤
- **Mega Menu** — Products 메뉴에 Hover 시 펼쳐지는 패널
- **Use Cases Tabs** — 4탭 스위칭, 활성 인디케이터
- **FAQ Accordion** — 단일 오픈 + 부드러운 height 전환
- **Smooth Scroll** — 앵커 클릭 시 보정 스크롤
- **Hover Glow** — 카드/버튼 호버 시 라이트 글로우
- **AI Support Award Popup** — 첫 진입 시 멘토기업 선정 배너 노출, 신청서 초안 작성 페이지와 상담창 연결
- **Floating Chat** — 단계형 상담 플로우, 요약 생성, `/api/consultation` 서버리스 메일 접수, ESC 닫기
- **AI Application Draft** — HWP 신청서식 기반 초안 작성, 우측 Docs ONEQ Agent 사이드바, `/api/consultation` 초안 제출

---

## 🎚️ Tweaks 패널 (오른쪽 하단 토글)

상단 툴바의 **Tweaks 토글**을 ON 하면 우측 하단에 패널이 노출됩니다.

| 컨트롤 | 옵션 |
|--------|------|
| **Mood** | Light · Dark · Editorial |
| **Accent** | EDU Blue · Indigo · Teal |
| **Hero glow orbs** | on / off |
| **Dense spacing** | on / off |

다크 모드는 PolyAI 톤의 순수 #000 베이스 + 흰 텍스트 + 헤어라인 보더로 즉시 전환됩니다.

---

## 🌐 다국어 (KO / EN)

우측 상단의 **KO / EN** 토글로 모든 카피가 즉시 전환됩니다.

- 구현: `scripts/i18n.js` — `data-i18n` 속성 기반 사전 매핑
- KO 모드는 HTML의 한글 원본을 사용, EN 모드에서만 사전을 lookup → 영문 lookup 실패 시 원본 fallback
- 푸터의 사업자 정보·주소·저작권까지 전부 토글 대상

---

## 🎨 브랜드 시스템

### 컬러
- **EDU Blue 그라디언트** — `#3a8dff → #1a5cff → #0b3fc7` (라이트 모드 핵심)
- **Brand Wash** — `oklch(0.97 0.025 245)` (블루 톤 paper)
- **Ink scale** — `--ink-0` ~ `--ink-9` (`tokens.css` 참조)
- **Mint accent** — Docs ONEQ 보조 (`#10b981`)

### 타이포그래피
- **본문/헤드라인** — `Pretendard Variable` (CDN)
- **모노스페이스** — `JetBrains Mono` (코드 블록, 라벨)

### 로고
| 파일 | 용도 |
|------|------|
| `assets/eduoneq-logo.png` | Light 모드 워드마크 |
| `assets/eduoneq-logo-white.png` | Dark 모드 워드마크 |
| `assets/aibu-wordmark-black.png` | AiBU 로고 |
| `assets/aibu-wordmark-white.png` | AiBU 로고 (다크) |
| `assets/aibu-icon.png` | AiBU 아이콘 |
| `assets/docs-icon.png` | Docs ONEQ 아이콘 |
| `assets/favicon.png` | 파비콘 |

---

## 📁 프로젝트 구조

```
eduoneq-landing/
├── api/
│   └── consultation.js          # Vercel 서버리스 상담 접수/메일 발송 API
├── EDU ONEQ Landing.html        # 단일 진입점 (메인 랜딩)
├── index.html                   # Vercel 기본 진입점
├── ai-application.html          # 소상공인 AI 활용지원 사업 신청서 초안 작성
├── styles/
│   ├── tokens.css               # 디자인 토큰 (color, type, radius, shadow)
│   ├── landing.css              # 컴포넌트 스타일 전체
│   └── ai-application.css       # 신청서 초안 작성 페이지
├── scripts/
│   ├── main.js                  # 스크롤 reveal, 카운터, 메가메뉴, FAQ, smooth scroll
│   ├── i18n.js                  # KO/EN 토글 (data-i18n 사전)
│   ├── floatchat.js             # 플로팅 챗 패널
│   ├── ai-application.js        # 초안 생성, 저장, 복사, 제출
│   └── tweaks.jsx               # Tweaks 패널 (mood, accent, glow, density)
├── assets/                      # 로고, 뉴스 썸네일, 아이콘
└── README.md
```

---

## 🚀 로컬 실행

빌드 도구 없이 정적 파일만으로 동작합니다. 프로젝트 루트에서 정적 서버를 띄우면 됩니다.

```bash
# Python 3
python3 -m http.server 8000

# Node (npx)
npx serve .

# VS Code
# → Live Server 확장 사용
```

브라우저에서 `http://localhost:8000/EDU ONEQ Landing.html` 접속.

> ℹ️ React + Babel CDN을 사용하므로 인터넷 연결이 필요합니다.
> ℹ️ Pretendard Variable 폰트는 cdn.jsdelivr.net 에서 로드합니다.
> ℹ️ `/api/consultation` 메일 발송은 Vercel 서버리스 환경에서 동작합니다.

---

## 📦 배포

정적 호스팅 어디서든 동작합니다.

- **Vercel** — 루트 그대로 import → 즉시 배포
- **Netlify** — drag & drop or git connect
- **GitHub Pages** — `main` 브랜치 root 게시
- **AWS S3 + CloudFront** — 정적 파일 업로드 후 CDN 연결

추후 SEO 최적화 시:
- `<meta>` OG/Twitter 카드, JSON-LD `Organization` 스키마 추가
- `sitemap.xml` / `robots.txt` 보강

### 상담 메일 발송 환경변수

Vercel Project Settings → Environment Variables에 아래 값을 설정하면 상담창/신청서의 제출 버튼이 메일 앱 없이 서버에서 직접 발송합니다.

#### Google Apps Script 방식 권장

DNS/DKIM 설정 없이 Google 계정의 `MailApp`으로 알림 메일을 보냅니다.

1. Google Apps Script에서 새 프로젝트 생성
2. `integrations/google-apps-script/consultation-mailer.gs` 내용을 붙여넣기
3. 프로젝트 설정 → 스크립트 속성에 아래 값 추가
   - `WEBHOOK_SECRET`: 임의의 긴 문자열
   - `CONSULTATION_RECIPIENTS`: `gwangphago@gmail.com,ghcho@eduoneq.com`
   - `SENDER_NAME`: `EDU ONEQ`
4. 배포 → 새 배포 → 웹 앱
   - 실행 사용자: 나
   - 액세스 권한: 모든 사용자
5. 웹 앱 URL을 Vercel 환경변수에 추가

| Key | 예시 |
|-----|------|
| `GOOGLE_APPS_SCRIPT_WEBHOOK_URL` | `https://script.google.com/macros/s/.../exec` |
| `GOOGLE_APPS_SCRIPT_SECRET` | Apps Script의 `WEBHOOK_SECRET`과 동일한 값 |
| `CONSULTATION_RECIPIENTS` | `gwangphago@gmail.com,ghcho@eduoneq.com` |

#### Resend fallback

Resend를 계속 쓰고 싶을 때만 아래 값을 추가합니다. Google Apps Script URL이 있으면 Apps Script가 우선 사용됩니다.

| Key | 예시 |
|-----|------|
| `RESEND_API_KEY` | `re_...` |
| `CONSULTATION_FROM` | `EDU ONEQ <noreply@eduoneq.com>` |
| `CONSULTATION_RECIPIENTS` | `gwangphago@gmail.com,ghcho@eduoneq.com` |

`CONSULTATION_FROM`은 Resend에서 인증된 도메인/발신자여야 합니다. 수신자는 기본값으로 `gwangphago@gmail.com,ghcho@eduoneq.com`이 설정되어 있지만, 운영에서는 환경변수로 명시하는 것을 권장합니다.

---

## 🧩 주요 외부 의존성 (CDN)

| 라이브러리 | 용도 |
|------------|------|
| React 18.3.1 | Tweaks 패널 |
| ReactDOM 18.3.1 | Tweaks 패널 |
| Babel Standalone 7.29.0 | JSX 인라인 트랜스파일 |
| Pretendard Variable | 본문 폰트 |
| JetBrains Mono | 코드 폰트 |

---

## 🛠️ 커스터마이징 가이드

### 컬러 수정
`styles/tokens.css` 의 `--brand-*` / `--ink-*` 변수를 수정.

### 카피 변경
- **한국어** — `EDU ONEQ Landing.html` 의 텍스트 직접 수정
- **영어** — `scripts/i18n.js` 의 `dict` 객체에서 키별 영문 수정

### 섹션 추가/제거
`EDU ONEQ Landing.html` 의 `<!-- ========== SECTION ========== -->` 주석 블록 단위로 잘라내거나 복제.

### 새 KO/EN 키 추가
1. HTML 요소에 `data-i18n="my.key"` 추가, 한글 원본 작성
2. `scripts/i18n.js` `dict` 에 `'my.key': 'English copy'` 등록

---

## 🏢 회사 정보

**㈜에듀원큐 / EDU ONEQ Corp.**

- **대표** — 조광현
- **사업자등록번호** — 168-88-03261
- **본사** — 대구광역시 동구 동대구로 465, 3층 308호 (신천동, 대구스케일업허브)
- **전화** — 053-742-1007
- **이메일** — ghcho@eduoneq.com

### 운영 서비스
- **AiBU** — https://aibu.co.kr (생활기록부 기반 AI 입시·진로 진단)
- **Docs ONEQ** — https://docsoneq.com (HWP 웹 편집 + AI 문서 자동화)

---

## 📄 라이선스

© 2026 EDU ONEQ Corp. All rights reserved.

이 리포의 모든 코드·디자인·텍스트·이미지 자산은 EDU ONEQ Corp. 의 자산입니다. 무단 복제·재배포·상업적 이용을 금합니다.
