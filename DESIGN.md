# EDU ONEQ Design System

현재 `eduoneq.com` 랜딩 페이지를 기준으로 도출한 EDU ONEQ 고유 디자인 문서입니다. 이 문서는 새 랜딩 섹션, 제품 소개 페이지, 세일즈 자료, 앱 진입 화면을 만들 때 같은 브랜드 경험을 유지하기 위한 기준입니다.

## 1. Brand Core

### Brand Sentence

> 기술은 첨단으로,  
> 교육은 더 가까이.

EDU ONEQ의 디자인은 "첨단 AI 기술"을 과시하기보다, 교육 현장에 가까이 다가가는 신뢰감 있는 도구처럼 보여야 합니다. 화면은 미래적이지만 차갑지 않고, 전문적이지만 복잡하지 않아야 합니다.

### Personality

- **Precise**: 분석, 진단, 문서 자동화의 정확성이 먼저 느껴져야 합니다.
- **Calm**: 교육기관, 학부모, 학생이 안심할 수 있도록 과장된 색과 장식을 피합니다.
- **Close**: 한국 교육 현장 언어를 사용하고, 사용자의 실제 업무 흐름을 시각화합니다.
- **Intelligent**: AI는 마법처럼 표현하지 않고, 구조화, 비교, 제안, 승인 같은 업무 단위로 보여줍니다.
- **Institution-ready**: 개인 서비스가 아니라 학교, 학원, 기관 도입까지 감당할 수 있는 기업 신뢰감을 유지합니다.

### Design Keywords

`AI Education`, `Structured Intelligence`, `Korean EdTech`, `Document Automation`, `Trusted SaaS`, `Institutional Clarity`

## 2. Design Principles

### 1. Advanced, But Not Distant

기술의 첨단성은 그리드, 은은한 글로우, 정교한 인터페이스 미리보기로 표현합니다. 그러나 사용자는 교육 관계자이므로 과도한 사이버 느낌, 네온, 게임식 인터랙션은 피합니다.

### 2. Trust Before Hype

AI 성능보다 먼저 데이터 보호, 검증 가능성, 승인 워크플로우, 기관 도입 가능성을 보여줍니다. 지표는 크고 명확하게, 설명은 짧고 검증 가능한 문장으로 씁니다.

### 3. Product Screens Are the Main Visual Asset

EDU ONEQ의 핵심 시각 자산은 추상 일러스트가 아니라 실제 제품 UI입니다. AiBU는 진단 대시보드와 레이더 차트, Docs ONEQ는 문서 diff와 승인 흐름을 중심으로 보여줍니다.

### 4. Dense Information, Calm Composition

섹션은 충분히 여백을 주되, 카드 안에는 실제 기능 정보를 밀도 있게 담습니다. SaaS 운영 도구처럼 빠르게 스캔 가능해야 합니다.

### 5. Korean Context First

생활기록부, HWP/HWPX, 세특, 진로, 전형, 교육기관 같은 한국 교육 맥락의 단어를 적극 사용합니다. 영어는 라벨, 카테고리, 기술 신뢰 신호에 보조적으로만 씁니다.

## 3. Color System

현재 구현 기준: [`styles/tokens.css`](./styles/tokens.css)

### Brand Colors

| Token | Hex | Usage |
|---|---:|---|
| `--brand-deep` | `#1A37A8` | 진한 브랜드 포인트, 그라디언트 시작점, 중요 CTA hover |
| `--brand` | `#2B52D6` | 기본 EDU Blue, 링크, 포인트, 활성 상태 |
| `--brand-mid` | `#4373E5` | 히어로 텍스트 그라디언트 중간색 |
| `--brand-light` | `#6B96F0` | 히어로 텍스트 그라디언트 끝색, 어두운 배경 위 라벨 |
| `--brand-soft` | `#B9CCF7` | 보조 라인, 비활성 블루 장식 |
| `--brand-wash` | `#EEF3FE` | 히어로 배경, 연한 블루 섹션 |
| `--brand-ink` | `#0E1740` | 브랜드 기반 딥 네이비 텍스트 |

### Neutral Scale

| Token | Hex | Usage |
|---|---:|---|
| `--ink-0` | `#07091A` | 가장 강한 헤드라인, primary 버튼 배경 |
| `--ink-1` | `#0E1430` | 본문 주요 텍스트 |
| `--ink-2` | `#1B2447` | 강조 본문, 다크 UI 보조 |
| `--ink-3` | `#2D3A66` | 일반 본문 |
| `--ink-4` | `#4A5784` | 설명문, lead 텍스트 |
| `--ink-5` | `#6F7AA0` | 작은 설명, 메타 라벨 |
| `--ink-6` | `#9AA3C2` | 비활성 텍스트 |
| `--ink-7` | `#C4CADF` | 다크 섹션 보조 텍스트 |
| `--ink-8` | `#E0E4F0` | hover border, 연한 구분선 |
| `--ink-9` | `#EEF1F8` | 기본 카드 border |
| `--ink-10` | `#F6F8FC` | 연한 섹션 배경 |
| `--paper` | `#FFFFFF` | 기본 표면 |

### Accent Colors

Accent는 기능 의미를 보조할 때만 사용합니다.

| Token | Hex | Role |
|---|---:|---|
| `--mint` | `#19C39A` | 성공, 승인, 안전 처리, 데이터 보호 |
| `--amber` | `#F5A524` | 주의, 진행 중, 분석 상태 |
| `--coral` | `#F26A5C` | 삭제, 거절, 위험, 오류 |

### Color Rules

- 기본 화면은 `paper`와 `brand-wash`를 중심으로 맑고 밝게 유지합니다.
- 진한 면은 CTA, 숫자 임팩트 섹션, footer에 제한적으로 씁니다.
- 블루는 브랜드 신뢰를 위한 기본색입니다. 한 화면 전체를 푸른색으로만 채우지 말고 흰색, 잉크색, 연한 회색과 함께 써야 합니다.
- 성공/경고/오류 색상은 UI 의미가 있을 때만 씁니다. 장식용으로 남발하지 않습니다.
- 배경 글로우는 매우 낮은 불투명도로 사용합니다. 정보보다 앞서 보이면 안 됩니다.

## 4. Typography

현재 구현 기준: [`styles/landing.css`](./styles/landing.css)

### Font Stack

```css
--font-sans: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Segoe UI', Roboto, sans-serif;
--font-display: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', Menlo, monospace;
```

### Type Scale

| Class | Size | Line Height | Weight | Usage |
|---|---|---:|---:|---|
| `.display-1` | `clamp(48px, 7.4vw, 104px)` | `0.96` | `700` | 히어로 메인 문장 |
| `.display-2` | `clamp(40px, 5.4vw, 72px)` | `1.02` | `700` | 주요 섹션 제목 |
| `.h2` | `clamp(32px, 3.6vw, 48px)` | `1.08` | `700` | 제품 설명 제목 |
| `.h3` | `24px` | `1.25` | `600` | 카드 제목, 하위 제목 |
| `.lead` | `clamp(17px, 1.3vw, 20px)` | `1.55` | normal | 섹션 설명문 |
| `.body` | `16px` | `1.65` | normal | 본문 |
| `.small` | `14px` | default | normal | 작은 설명 |
| `.label` | `12px` | default | `600` | 영문 섹션 라벨 |

### Korean Line Break Rules

- 히어로 문장은 반드시 두 줄로 유지합니다.

```text
기술은 첨단으로,
교육은 더 가까이.
```

- 한글 헤드라인은 음절 단위로 쪼개지지 않게 합니다.
- 중요한 문장 단위는 `<span>`과 `<br>`로 줄바꿈을 명시합니다.
- 제목 안에서는 `word-break: keep-all` 또는 `white-space: nowrap`을 필요한 범위에 적용합니다.
- 너무 긴 문장은 줄을 강제로 늘리지 말고 카피를 줄입니다.

### Typographic Mood

- 헤드라인은 굵지만 공격적이지 않게 씁니다.
- 자간은 현재 구현에서 큰 제목에 음수값이 있지만, 새 화면에서는 과도한 압축을 피합니다.
- 영문 라벨은 대문자와 넓은 letter spacing으로 정보 구조를 만듭니다.
- 본문은 `ink-4`, `ink-5`를 사용해 부드럽게 읽히도록 합니다.

## 5. Layout System

### Container

```css
--container: 1280px;
--gutter: 24px;
```

- 기본 콘텐츠 폭은 `1280px`입니다.
- 넓은 시각 자료는 `.container--wide`로 `1440px`까지 확장할 수 있습니다.
- 모바일에서도 좌우 gutter는 최소 `24px`을 유지합니다.

### Section Spacing

```css
.section { padding: clamp(72px, 9vw, 144px) 0; }
.section-tight { padding: clamp(56px, 6vw, 88px) 0; }
```

- 랜딩은 넓은 호흡을 유지합니다.
- 제품 기능 카드가 많은 섹션은 넓은 상하 여백으로 복잡함을 낮춥니다.
- CTA와 footer는 정보 밀도가 높으므로 spacing을 줄여도 됩니다.

### Grid

| Utility | Columns | Use |
|---|---:|---|
| `.grid-2` | 2 | 제품 설명, about 정보 |
| `.grid-3` | 3 | 뉴스 카드, 일부 feature |
| `.grid-4` | 4 | 숫자/지표 카드 |
| `.bento` | 6 base columns | 기능 Bento |

Responsive:

- `1024px` 이하: 3열/4열은 2열로 축소
- `640px` 이하: 모든 grid는 1열
- 제품 row는 모바일에서 시각 자료와 텍스트가 자연스럽게 세로로 쌓입니다.

## 6. Shape, Radius, Shadow

### Radius

| Token | Value | Usage |
|---|---:|---|
| `--r-xs` | `6px` | 아주 작은 내부 요소 |
| `--r-sm` | `10px` | 작은 버튼, 언어 토글 |
| `--r-md` | `14px` | 입력 필드, 작은 카드 |
| `--r-lg` | `20px` | 패널, floating chat |
| `--r-xl` | `28px` | 기본 카드, 제품 미리보기 |
| `--r-2xl` | `36px` | Bento 카드 |
| `--r-pill` | `999px` | CTA, chip, language switch |

### Shadow

EDU ONEQ의 그림자는 "떠 있는 SaaS UI"를 만들기 위한 장치입니다.

- `--shadow-sm`: 미세한 elevation
- `--shadow-md`: 카드 hover
- `--shadow-lg`: 큰 카드, 뉴스 카드 hover
- `--shadow-xl`: 히어로 제품 미리보기
- `--shadow-glow`: 브랜드 CTA hover

### Shape Rules

- 버튼과 chip은 pill 형태로 부드럽게 만듭니다.
- 카드와 제품 화면은 28px 이상 radius를 써서 고급 SaaS 느낌을 만듭니다.
- 실제 앱 UI처럼 보이는 내부 요소는 6px에서 14px 사이의 작은 radius를 씁니다.
- 장식용 도형보다 제품 인터페이스, 표, 차트, diff 라인이 우선입니다.

## 7. Component System

### Navigation

Purpose: 신뢰감 있는 SaaS 사이트의 고정 상단 바.

Behavior:

- 초기 상태는 투명에 가깝게 둡니다.
- 스크롤 후 `rgba(255, 255, 255, 0.78)` 배경과 blur를 적용합니다.
- 제품 메뉴는 mega menu로 AiBU와 Docs ONEQ 진입점을 제공합니다.
- CTA는 우측 `시작하기`로 고정합니다.

Rules:

- 로고는 좌측, 메뉴는 중앙, 언어/CTA는 우측.
- 메뉴 수는 6개 이하로 유지합니다.
- 다국어 토글은 KO/EN 두 개만 노출합니다.

### Hero

Purpose: 브랜드 선언과 제품 신뢰를 동시에 전달합니다.

Structure:

- Eyebrow: `AI 에듀테크 · 입시 · 문서 자동화`
- H1: `기술은 첨단으로, 교육은 더 가까이.`
- Lead: AI가 진로 설계와 문서 업무를 자동화한다는 한 문단
- CTA: AiBU 무료 시작, 기관/기업 도입 문의
- Meta: 운영 플랫폼 수, 누적 분석 리포트, AI 분석 정확도
- Visual: AiBU와 Docs ONEQ의 layered product preview

Visual Rules:

- 배경은 `paper → brand-wash` 세로 그라디언트.
- 64px grid를 낮은 opacity로 깔아 "구조화된 지능"을 표현합니다.
- orb는 희미하게만 사용합니다.
- 제품 UI 카드가 장식보다 앞서야 합니다.

### Button

Variants:

- `.btn-primary`: 검정 배경, 흰 텍스트. 가장 중요한 액션.
- `.btn-brand`: 브랜드 블루 배경. 제품/기능 CTA.
- `.btn-secondary`: 투명 배경, hairline border. 보조 액션.
- `.btn-ghost`: 텍스트형 탐색 액션.

Interaction:

- hover 시 `translateY(-1px)`과 shadow를 적용합니다.
- arrow icon은 hover 시 오른쪽으로 3px 이동합니다.
- 버튼 텍스트는 줄바꿈하지 않습니다.

### Card

Base:

```css
background: var(--paper);
border: 1px solid var(--ink-9);
border-radius: var(--r-xl);
padding: 32px;
```

Interaction:

- hover: border 진하게, shadow-md, `translateY(-2px)`
- 카드 안에는 제목, 설명, 미니 UI 요소를 명확히 분리합니다.

### Bento

Purpose: 기술 역량을 기능 단위로 빠르게 스캔하게 만듭니다.

Grid:

- 6-column 기반
- `.span-2`, `.span-3`, `.span-4`로 카드 폭 조절
- 모바일에서는 1열

Variants:

- Default: 흰 카드
- Dark: `ink-0` 배경, technical emphasis
- Brand: `brand-deep → brand` 그라디언트, 핵심 기능 강조

Rules:

- Bento 카드에는 추상 아이콘만 넣지 말고 실제 상태, 코드, 인증, 데이터 흐름, 수치 중 하나를 포함합니다.
- 한 카드의 메시지는 하나의 기능만 말합니다.

### Product Row

Purpose: AiBU와 Docs ONEQ의 차이를 명확히 보여줍니다.

AiBU:

- 키워드: 입시 진단, 생활기록부 분석, 전공 적합도, 지원 전략
- 시각 요소: 레이더 차트, 점수, 계열/학과 추천, 리포트 패널

Docs ONEQ:

- 키워드: 문서 자동화, HWP/HWPX, AI 문서 검토, 승인 워크플로우
- 시각 요소: 문서 화면, diff line, AI 제안, 반영/건너뛰기 액션

Rules:

- 제품명 옆에는 아이콘 또는 워드마크를 함께 둡니다.
- 제품 설명은 문제보다 해결 흐름 중심으로 씁니다.
- CTA는 외부 제품 사이트로 연결합니다.

### Numbers

Purpose: 검증된 신뢰 신호를 크게 보여줍니다.

Rules:

- 숫자는 큰 크기와 tabular numeric 느낌으로 사용합니다.
- 지표는 실제로 설명 가능한 것만 사용합니다.
- 어두운 배경에서는 숫자를 흰색, 설명을 `ink-7`로 둡니다.

### FAQ

Purpose: 도입 전 우려를 줄입니다.

Rules:

- 질문은 실제 구매/도입 의사결정 질문으로 씁니다.
- 답변은 짧게, 정책/보안/지원 범위를 명확히 합니다.
- 보안 문구는 인증 여부를 과장하지 않습니다.
- 현재 기준 보안 인증 표기는 `ISO 27001`입니다. `ISMS-P`는 인증 획득 전까지 사용하지 않습니다.

### Floating Chat

Purpose: 랜딩의 마지막 문의 장벽을 낮춥니다.

Rules:

- 우측 하단 고정.
- 검정 원형 FAB로 프리미엄 SaaS 톤 유지.
- 패널은 Telegram-style이지만 EDU ONEQ 톤에 맞게 차분하게 구성합니다.
- 빠른 문의 chip은 4개 이하.

## 8. Motion System

### Timing

| Motion | Duration | Easing |
|---|---:|---|
| Button hover | `0.18s` | `--ease-out` |
| Card hover | `0.24s` | `--ease-out` |
| Nav scroll | `0.3s` | `--ease-out` |
| Floating card | `6s` loop | ease-in-out |
| Orb drift | `20s-22s` loop | ease-in-out |
| Chat panel | `0.22s-0.28s` | `--ease-out` |

### Motion Rules

- 모션은 사용자의 이해를 돕는 수준에서만 씁니다.
- 큰 요소는 천천히, 작은 요소는 빠르게 반응합니다.
- 제품 카드 floating은 미세해야 하며, 콘텐츠 가독성을 흔들면 안 됩니다.
- pulse는 현재 위치나 활성 상태를 알려줄 때만 씁니다.
- 스크롤 reveal은 섹션 진입감을 만들되, 콘텐츠 접근성을 막지 않아야 합니다.

## 9. Imagery and Assets

Current assets:

- `assets/eduoneq-logo.png`: 라이트 모드 기본 로고
- `assets/eduoneq-logo-white.png`: 다크 모드 로고
- `assets/aibu-icon.png`: AiBU 제품 아이콘
- `assets/aibu-wordmark-black.png`: AiBU 라이트 워드마크
- `assets/aibu-wordmark-white.png`: AiBU 다크 워드마크
- `assets/docs-icon.png`: Docs ONEQ 아이콘
- `assets/news-*.png/jpg`: 뉴스/프레스 썸네일
- `assets/favicon.png`: 파비콘

### Asset Rules

- 로고는 변형하지 않습니다.
- 제품 아이콘은 카드, mega menu, 제품 row에서 동일 비율로 사용합니다.
- 뉴스 이미지는 어둡게 덮기보다 원본 콘텐츠 신뢰가 드러나도록 둡니다.
- 새 이미지가 필요할 때는 추상 스톡 이미지보다 실제 제품 화면 또는 실제 교육 현장 맥락이 우선입니다.

## 10. Content Voice

### Tone

- 전문적이되 어렵지 않게 씁니다.
- "AI가 모든 것을 해결" 같은 과장 대신 "분석", "정리", "제안", "검토", "승인"처럼 검증 가능한 동사를 사용합니다.
- 기관 담당자가 바로 이해할 수 있는 명사로 씁니다.

### Preferred Words

- 생활기록부
- HWP/HWPX
- 진로 설계
- 전공 적합도
- 계열 적합도
- 문서 검토
- 승인 워크플로우
- 교육기관 도입
- 데이터 보호
- 화이트라벨링
- API/SSO

### Avoid

- 인증받지 않은 보안 인증명
- 검증되지 않은 수치
- "완벽한", "세계 최고", "무조건" 같은 절대 표현
- 기술만 강조하고 교육 현장 맥락이 없는 카피
- 과한 영어 슬로건

### Copy Pattern

```text
[문제/맥락]을 [AI 기능]으로 [현장 결과]까지 연결합니다.
```

Examples:

- 생활기록부를 분석해 학생의 전공 방향과 보완 전략을 제시합니다.
- HWP 문서를 웹에서 검토하고, AI 수정안을 승인 방식으로 반영합니다.
- 업로드된 데이터는 암호화되어 처리되며, 모델 학습에 사용되지 않습니다.

## 11. Accessibility and Usability

### Contrast

- 본문 텍스트는 기본적으로 `ink-3` 이상을 사용합니다.
- 작은 라벨은 `ink-5`보다 연해지지 않게 합니다.
- 블루 배경 위 흰 텍스트는 충분한 대비를 확보합니다.

### Interaction

- 버튼과 링크는 hover/focus 상태가 분명해야 합니다.
- Floating chat은 ESC 또는 close 버튼으로 닫을 수 있어야 합니다.
- Accordion은 현재 열린 상태가 시각적으로 분명해야 합니다.

### Responsive

- 모바일에서는 메뉴가 숨겨지고 핵심 CTA/로고가 우선됩니다.
- 히어로 제목은 두 줄 유지가 원칙이나, 아주 좁은 화면에서는 크기를 줄여 넘침을 방지합니다.
- 카드 안 텍스트는 영역 밖으로 나가지 않아야 합니다.

## 12. Dark Mood and Tweaks

현재 랜딩은 Tweaks 패널을 통해 mood, accent, hero glow, dense spacing을 조정할 수 있습니다.

### Dark Mood Principles

- dark mode는 네이비가 아니라 거의 순수한 black 기반입니다.
- 흰 텍스트와 hairline border로 editorial SaaS 톤을 만듭니다.
- 브랜드 블루는 accent로만 사용합니다.
- 제품 UI 카드의 대비를 유지해 어두운 배경에서도 정보가 읽혀야 합니다.

### Accent Options

- EDU Blue: 기본 브랜드
- Indigo: 더 기술적이고 AI SaaS 느낌
- Teal: 문서/데이터 처리의 안정감

Tweaks는 운영자/디자이너 확인용 성격입니다. 실제 운영 화면에서 노출할지 여부는 배포 정책에 따라 결정합니다.

## 13. Implementation Guidelines

### File Structure

```text
styles/tokens.css       # 브랜드 토큰, reset, 전역 기초
styles/landing.css      # 랜딩 컴포넌트 전체 스타일
scripts/main.js         # 스크롤, 카운터, 메뉴, FAQ 등 인터랙션
scripts/i18n.js         # KO/EN 다국어 사전
scripts/floatchat.js    # Floating chat
scripts/tweaks.jsx      # Tweaks panel behavior
index.html              # Vercel/production entry
EDU ONEQ Landing.html   # 원본 HTML 파일
```

### CSS Rules

- 새 색상은 먼저 `styles/tokens.css`에 token으로 등록합니다.
- 컴포넌트별 스타일은 `styles/landing.css`의 기존 섹션 구조 안에 추가합니다.
- 같은 의미의 radius, shadow, color를 임의 값으로 반복하지 않습니다.
- 제품별 커스텀 UI는 클래스 prefix를 명확히 둡니다.
  - AiBU: `.aibu-*`
  - Docs ONEQ: `.docs-*`
  - Floating chat: `.fc-*`

### HTML Rules

- 배포 기준 파일은 `index.html`입니다.
- `EDU ONEQ Landing.html`은 원본 보존용으로 함께 갱신합니다.
- KO/EN 전환이 필요한 문구는 `data-i18n` 키를 추가합니다.
- 새 섹션은 `data-screen-label`을 붙여 구조를 명확히 합니다.

### Deployment Rule

- GitHub `main`에 push하면 Vercel이 자동 배포합니다.
- 랜딩 변경 후 최소 확인:
  - `https://eduoneq.com` HTTP 200
  - hero title 두 줄 유지
  - 로고/제품 이미지 로드
  - 모바일 가로 스크롤 없음
  - 인증/보안 문구 최신성 확인

## 14. Page Blueprint

현재 랜딩의 정보 구조입니다.

1. **Nav**
   - EDU ONEQ 로고
   - 제품, 기술, 사례, 회사, 뉴스, 문의
   - KO/EN
   - 시작하기 CTA

2. **Hero**
   - 브랜드 선언
   - 제품 미리보기
   - 핵심 CTA
   - 지표

3. **Products**
   - AiBU
   - Docs ONEQ

4. **Core Technology**
   - AI 모델
   - 보안/데이터 보호
   - API/화이트라벨
   - 속도
   - 워크스페이스

5. **How It Works**
   - 업로드
   - 분석
   - 매칭
   - 리포트/검토

6. **Use Cases**
   - 학생/학부모
   - 교사/강사
   - 학원/기관
   - 정부/공공

7. **Numbers**
   - 누적 리포트
   - 정확도
   - 시간 단축
   - 도입 기관

8. **About**
   - 회사 미션
   - 본사/대표/사업영역

9. **News**
   - 언론/기관 신뢰 신호

10. **FAQ**
   - 가입, 데이터 보관, 기관 도입, 파일 형식, 해외 사용

11. **Trusted By**
   - 파트너/기관 마퀴

12. **Footer**
   - 회사 정보
   - 제품/회사/지원 링크
   - 사업자 정보

13. **Floating Chat**
   - 도입 문의 유도

## 15. Design QA Checklist

새로운 디자인 변경 전후로 아래를 확인합니다.

- [ ] 브랜드 문장과 핵심 메시지가 유지되는가
- [ ] `ISMS-P`처럼 아직 획득하지 않은 인증명이 들어가지 않았는가
- [ ] `ISO 27001` 표기가 현재 정책과 맞는가
- [ ] 히어로 제목이 두 줄로 유지되는가
- [ ] CTA가 1차/2차로 명확히 구분되는가
- [ ] 제품 UI가 실제 기능을 보여주는가
- [ ] 카드가 과하게 장식적이지 않은가
- [ ] 모바일에서 텍스트가 잘리지 않는가
- [ ] 이미지와 스크립트가 404 없이 로드되는가
- [ ] 다국어 키가 누락되지 않았는가
- [ ] Vercel 배포 후 실제 도메인에서 확인했는가
