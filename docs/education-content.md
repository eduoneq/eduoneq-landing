# Education page content maintenance

Public route: `/education/`

Source reviewed: user-supplied 에듀원큐 교육서비스 포트폴리오, 2 pages, 2026-10-23.
This source is a portfolio supplied by the company; the page does not claim independent certification.

## Verified against the supplied portfolio

- Page 1: 조광현 / representative and instructor; three teaching fields; activities; 2024 and 2025 awards; AiBU development/operation.
- Page 2: 경산여자고등학교 / 영남대학교 교육발전특구사업, 고등학생 습관형성 프로젝트, 2025-12-20.
- Page 2: 영남대학교 교육발전특구사업, 창업연계 AI 활용 웹·앱 개발 프로젝트, 2026. Exact month/day were not supplied.
- Page 2: 교육 환경 변화와 에듀테크 활용, 2026-04-03. The hosting institution was not supplied; no institution is attributed.
- The public representative portrait and stage-only classroom JPEG are extracted from that source. No stock or generated classroom images are used.

## Publication boundary

- Omit private mobile number, personal Gmail, detailed address, original full PDF and unrelated biographies.
- No registration certificate was provided. Do not use registered/accredited education provider language.
- Do not convert the five-school robot PoC into five teaching engagements.
- No claims about participant counts, satisfaction, course totals, degree or years of teaching experience.
- Data analysis and workflow automation are consultation topics in the tailored-program section, not attributed past education references.
- Course formats are offered examples, not fixed contracts. Dates, hours, sessions and price are agreed separately.
- Only the stage-only classroom photo is published. The other two source photos contain identifiable participants and device screens; they are omitted from deployed assets. Their references are text-only. Reassess participant image publication rights when expanding the gallery.

## Inquiry behavior

The inquiry builder only opens a user-reviewed email draft to the existing public company address `ghcho@eduoneq.com`. It does not submit a request, send email automatically, or save form fields to local storage or a server. The UI must explain this distinction.

Do not route this page solely to the legacy `/main/contact/` form without repairing and verifying its `/api/send-mail` endpoint. No live email was sent during implementation checks.

## Integration and checks

- The shared captured React navigation metadata and static HTML headers both include education.
- `scripts/main-link-audit-fixes.js` forces education navigation to load the standalone document.
- The home-page education entry is inserted by the existing landing integration script.
- Keep cache versions consistent in the two HTML shells and imported layout modules.
- Run `./scripts/validate.sh`, syntax-check education JavaScript and visually inspect desktop/mobile before publishing.

## Brand positioning

At the user request on 2026-10-23, public profile copy presents the company representative and AI product/system development, not a personal instructor profile. Keep real education references as company program evidence. The leadership section links to `/ax/`.
