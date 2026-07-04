(function () {
  const ROOT_PATH = "/";
  const SERVICE_INTRO_PATH = "/#service-intro";
  const CUSTOMER_PROOF_ID = "customer-proof";
  const CUSTOMER_PROOF_PATH = `/#${CUSTOMER_PROOF_ID}`;
  const CONTACT_PATH = "/main/contact/";
  const VERSION = "20260705-flow-order";
  const PREPARING_POPUP_ID = "eduoneq-preparing-popup";
  const NEWS_SECTION_ID = "news";
  const PRODUCT_DEEP_DIVE_ID = "eduoneq-static-products";
  let rootLandingUrlNormalized = false;
  let lastSyncedHash = "";

  const NEWS_ITEMS = [
    {
      source: "2026.07.02 · 경북신문",
      title: "대구청년창업센터 입주기업, 한국장학재단에 800만 원 기부",
      summary: "㈜에듀원큐와 ㈜웨일리유가 한국장학재단과 총 800만 원 규모의 기부약정을 체결했습니다.",
      image: "/eduoneq-assets/news/news-kbsm-donation.jpg",
      href: "https://www.kbsm.net/news/view.php?idx=500362",
      cta: "기사 읽기",
    },
    {
      source: "2026.04.08 · 매일신문",
      title: "입시 부담 덜어주는 AI로 교육 플랫폼 진화",
      summary: "고교학점제와 대입 변화 속에서 데이터 기반 진로 설계와 문서 업무 자동화 비전을 소개했습니다.",
      image: "/eduoneq-assets/news/news-maeil-thumb.png",
      href: "https://www.imaeil.com/page/view/2026040811464701294",
      cta: "기사 읽기",
    },
    {
      source: "2026.03 · DGTP 인터뷰",
      title: "교육의 판을 바꿀 AI 기술, 한큐에 해결",
      summary: "AiBU와 Docs ONEQ가 교육 현장과 문서 자동화에서 해결하는 문제와 로드맵을 다룹니다.",
      image: "/eduoneq-assets/news/news-dgtp-thumb.png",
      href: "https://www.youtube.com/watch?v=2oI89eFHo5U",
      cta: "영상 보기",
    },
  ];

  const PENDING_SOCIAL_LABELS = [
    "playstore button",
    "appstore button",
    "instagram button",
    "youtube button",
    "kakao button",
  ];
  const HIDDEN_TEXTS = new Set([
    "공지사항",
    "제품 소식",
    "로그인",
    "로그아웃",
    "EN",
    "ZH",
    "VI",
  ]);
  const CONTACT_ARIA_LABELS = new Set([
    "contact button",
    "create workspace button",
    "view adoption options",
    "custom pricing button",
  ]);

  function textOf(element) {
    return (element && element.textContent ? element.textContent : "").replace(/\s+/g, " ").trim();
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[char]);
  }

  function sectionByText(match) {
    return Array.from(document.querySelectorAll("section")).find((section) => match(textOf(section)));
  }

  function findHeroSection() {
    return sectionByText((text) => text.includes("교육 AI 인프라를") && text.includes("하나의 흐름으로"));
  }

  function findProductLineupSection() {
    return sectionByText((text) => text.includes("에듀원큐 제품 라인업"));
  }

  function findPartnerSection() {
    return sectionByText((text) => text.includes("전국 주요 교육기관과 함께 검증한 AI 교육 인프라"));
  }

  function insertAfter(reference, node) {
    if (!reference || !node || !reference.parentNode) return;
    if (node.previousElementSibling === reference) return;
    reference.parentNode.insertBefore(node, reference.nextSibling);
  }

  function sectionBlock(section) {
    const parent = section && section.parentElement;
    if (!parent || parent.classList.contains("contents")) return section;
    return parent.classList.contains("w-full") ? parent : section;
  }

  function insertSectionBlockAfter(referenceSection, movingSection) {
    const referenceBlock = sectionBlock(referenceSection);
    const movingBlock = sectionBlock(movingSection);
    if (!referenceBlock || !movingBlock || referenceBlock === movingBlock || !referenceBlock.parentNode) return;
    if (movingBlock.previousElementSibling === referenceBlock) return;
    referenceBlock.parentNode.insertBefore(movingBlock, referenceBlock.nextSibling);
  }

  function getLocalPath(href) {
    if (!href) return "";
    try {
      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return href;
      return url.pathname;
    } catch {
      return href;
    }
  }

  function setHref(link, href) {
    if (!link || link.getAttribute("href") === href) return;
    link.setAttribute("href", href);
  }

  function hideElement(element) {
    if (!element || element.dataset.eduoneqAuditHidden === VERSION) return;
    element.dataset.eduoneqAuditHidden = VERSION;
    element.setAttribute("aria-hidden", "true");
    element.setAttribute("inert", "");
    element.style.display = "none";
  }

  function disableButton(button, reason) {
    if (!button || button.dataset.eduoneqAuditDisabled === VERSION) return;
    button.dataset.eduoneqAuditDisabled = VERSION;
    button.disabled = true;
    button.setAttribute("aria-disabled", "true");
    button.setAttribute("tabindex", "-1");
    button.setAttribute("title", reason);
    button.style.cursor = "default";
    button.style.pointerEvents = "none";
  }

  function showPreparingPopup(anchor) {
    let popup = document.getElementById(PREPARING_POPUP_ID);
    if (!popup) {
      popup = document.createElement("div");
      popup.id = PREPARING_POPUP_ID;
      popup.setAttribute("role", "status");
      popup.setAttribute("aria-live", "polite");
      popup.textContent = "준비중입니다..";
      popup.style.position = "fixed";
      popup.style.zIndex = "10050";
      popup.style.padding = "10px 14px";
      popup.style.borderRadius = "10px";
      popup.style.background = "rgba(17, 24, 39, 0.94)";
      popup.style.color = "#fff";
      popup.style.fontSize = "14px";
      popup.style.fontWeight = "700";
      popup.style.lineHeight = "1";
      popup.style.boxShadow = "0 12px 30px rgba(15, 23, 42, 0.20)";
      popup.style.pointerEvents = "none";
      popup.style.opacity = "0";
      popup.style.transform = "translateY(4px)";
      popup.style.transition = "opacity 160ms ease, transform 160ms ease";
      document.body.appendChild(popup);
    }

    const rect = anchor && anchor.getBoundingClientRect ? anchor.getBoundingClientRect() : null;
    const popupWidth = 112;
    const x = rect ? rect.left + rect.width / 2 - popupWidth / 2 : window.innerWidth / 2 - popupWidth / 2;
    const y = rect ? rect.top - 42 : window.innerHeight - 96;
    popup.style.minWidth = `${popupWidth}px`;
    popup.style.textAlign = "center";
    popup.style.left = `${Math.max(12, Math.min(window.innerWidth - popupWidth - 12, x))}px`;
    popup.style.top = `${Math.max(12, y)}px`;
    popup.style.display = "block";
    popup.style.setProperty("opacity", "1", "important");
    popup.style.transform = "translateY(0)";

    clearTimeout(showPreparingPopup.timer);
    showPreparingPopup.timer = setTimeout(() => {
      popup.style.setProperty("opacity", "0", "important");
      popup.style.transform = "translateY(4px)";
    }, 2200);
  }

  function setLandingSectionIds() {
    document.querySelectorAll("section").forEach((section) => {
      const text = textOf(section);
      if (!document.getElementById(CUSTOMER_PROOF_ID) && text.includes("전국 주요 교육기관과 함께 검증한")) {
        section.id = CUSTOMER_PROOF_ID;
        section.classList.add("scroll-mt-[82px]");
      }
    });
  }

  function normalizeHeroSection() {
    const hero = findHeroSection();
    if (!hero) return;

    hero.classList.add("eduoneq-main-hero");
    const headline = Array.from(hero.querySelectorAll("h1,h2")).find((heading) => {
      const text = textOf(heading);
      return text.includes("교육 AI 인프라를") && text.includes("하나의 흐름으로");
    });
    if (headline && headline.dataset.eduoneqHeroHeadline !== VERSION) {
      headline.innerHTML = "교육 AI 인프라를<br>하나의 흐름으로";
      headline.classList.add("eduoneq-hero-headline");
      headline.dataset.eduoneqHeroHeadline = VERSION;
    }

    const firstSection = document.querySelector(".contents section");
    const heroBlock = sectionBlock(hero);
    const firstBlock = sectionBlock(firstSection);
    if (firstBlock && firstBlock !== heroBlock && firstBlock.parentNode === heroBlock.parentNode) {
      firstBlock.parentNode.insertBefore(heroBlock, firstBlock);
    }
  }

  function markAutomationBackdrop() {
    const section = sectionByText((text) => (
      text.includes("학생 기록에 맞춰 설계하는") &&
      text.includes("권한·로그·연동까지")
    ));
    if (!section) return;
    section.classList.add("eduoneq-automation-flow");
  }

  function ensureProductDeepDiveSections() {
    const anchor = findProductLineupSection();
    if (!anchor || !anchor.parentNode) return;

    let section = document.getElementById(PRODUCT_DEEP_DIVE_ID);
    if (!section) {
      section = document.createElement("section");
      section.id = PRODUCT_DEEP_DIVE_ID;
      section.className = "eduoneq-static-products";
      section.innerHTML = `
      <div class="eduoneq-static-products__inner">
        <article class="eduoneq-product-deepdive eduoneq-product-deepdive--aibu">
          <div class="eduoneq-product-copy">
            <p class="eduoneq-product-kicker"><img src="/eduoneq-assets/aibu-icon-web.png" alt=""> AiBU</p>
            <h2>생활기록부를 기록해<br>진로를 설계합니다.</h2>
            <p>학생의 활동, 과목, 세특을 종합 분석해 전공 적합성과 계열 적합도를 진단합니다. 목표 대학·학과·전형 기준으로 현재 위치와 보완 전략을 제시합니다.</p>
            <ul>
              <li>생활기록부 자동 정리</li>
              <li>전공·계열 적합도 진단</li>
              <li>대학·전형별 지원 전략</li>
            </ul>
            <div class="eduoneq-product-metrics" aria-label="AiBU 분석 지표">
              <span><strong>92%</strong><small>전공 적합도</small></span>
              <span><strong>A+</strong><small>교과 일관성</small></span>
              <span><strong>3건</strong><small>추천 학과</small></span>
            </div>
          </div>
          <div class="eduoneq-aibu-result" aria-label="AiBU 전공적합성 분석 결과 예시">
            <div class="eduoneq-result-head">
              <img src="/eduoneq-assets/aibu-icon-web.png" alt="">
              <span><strong>전공적합성 분석 결과</strong><small>김민준 · 서울○○고 3학년</small></span>
            </div>
            <p><span>AI 추천 학과</span><strong>컴퓨터공학과</strong></p>
            <p><span>적합도 점수</span><b>92.4<small>/100</small></b></p>
            <i></i>
            <div><span>교과<strong>95</strong></span><span>활동<strong>88</strong></span><span>독서<strong>91</strong></span></div>
          </div>
        </article>
        <article class="eduoneq-product-deepdive eduoneq-product-deepdive--docs">
          <div class="eduoneq-doc-preview" aria-label="Docs ONEQ 문서 검토 예시">
            <div>
              <h3>2025년 진로교육 운영계획.hwp</h3>
              <p>최종 수정 · 2025.03.14 · 조광현</p>
              <em></em><em></em><em></em>
              <section>
                <strong>AI 수정 제안 · 공식 문서 톤</strong>
                <span></span>
              </section>
              <footer><button type="button">반영하기</button><button type="button">건너뛰기</button></footer>
            </div>
          </div>
          <div class="eduoneq-product-copy">
            <p class="eduoneq-product-kicker"><img src="/eduoneq-assets/docs-icon-web.png" alt=""> Docs ONEQ</p>
            <h2>HWP를 웹에서,<br>AI가 함께 검토합니다.</h2>
            <p>HWP/HWPX 문서를 웹에서 직접 편집하고, AI 수정안을 제안해 검토 후 반영할 수 있습니다. 공공·교육 현장의 문서 업무를 한 단계 단축합니다.</p>
            <div class="eduoneq-doc-feature-list">
              <p><span>웹 기반 HWP 편집</span><strong>설치 없이 브라우저에서 문단과 표 셀을 직접 편집</strong></p>
              <p><span>AI 문서 검토</span><strong>요약, 톤 점검, 공식 문서화, 오탈자 점검 자동 수행</strong></p>
              <p><span>변경 이력</span><strong>수정안을 비교하고 승인·거절 방식으로 안전하게 반영</strong></p>
              <p><span>보안 반영</span><strong>권한과 로그를 남기는 기관형 운영 구조</strong></p>
            </div>
          </div>
        </article>
      </div>`;
    }
    insertAfter(anchor, section);
  }

  function movePartnerSectionAfterProductDetails() {
    const productDetails = document.getElementById(PRODUCT_DEEP_DIVE_ID);
    const partner = findPartnerSection();
    if (!productDetails || !partner) return;
    insertSectionBlockAfter(productDetails, partner);
  }

  function newsCardMarkup(item, index) {
    return `
      <article class="eduoneq-news-card" data-news-card="${index}">
        <a class="eduoneq-news-card__image" style="background-image:url('${escapeHtml(item.image)}')" href="${escapeHtml(item.href)}" target="_blank" rel="noopener" aria-label="${escapeHtml(item.title)}"></a>
        <div>
          <span>${escapeHtml(item.source)}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.summary)}</p>
          <a href="${escapeHtml(item.href)}" target="_blank" rel="noopener">${escapeHtml(item.cta)} →</a>
        </div>
      </article>`;
  }

  function setupNewsInteractions(section) {
    if (!section || section.dataset.eduoneqNewsReady === VERSION) return;
    section.dataset.eduoneqNewsReady = VERSION;
    const track = section.querySelector("[data-news-track]");
    const details = section.querySelector("[data-news-details]");
    section.querySelector("[data-news-next]")?.addEventListener("click", () => {
      if (!track) return;
      const card = track.querySelector(".eduoneq-news-card");
      track.scrollBy({ left: (card ? card.getBoundingClientRect().width : 340) + 24, behavior: "smooth" });
    });
    section.querySelector("[data-news-prev]")?.addEventListener("click", () => {
      if (!track) return;
      const card = track.querySelector(".eduoneq-news-card");
      track.scrollBy({ left: -((card ? card.getBoundingClientRect().width : 340) + 24), behavior: "smooth" });
    });
    section.querySelector("[data-news-toggle]")?.addEventListener("click", (event) => {
      const expanded = section.classList.toggle("is-expanded");
      event.currentTarget.setAttribute("aria-expanded", String(expanded));
      if (details) details.hidden = !expanded;
    });
  }

  function ensureNewsShowcase() {
    const anchor = findPartnerSection();
    if (!anchor || !anchor.parentNode) return;

    const existingNewsIdOwner = document.getElementById(NEWS_SECTION_ID);
    if (existingNewsIdOwner && !existingNewsIdOwner.classList.contains("eduoneq-news-showcase")) {
      existingNewsIdOwner.id = "eduoneq-react-news";
    }

    let section = document.querySelector(`#${NEWS_SECTION_ID}.eduoneq-news-showcase`);
    if (!section) {
      section = document.createElement("section");
      section.id = NEWS_SECTION_ID;
      section.className = "eduoneq-news-showcase scroll-mt-[82px]";
      section.innerHTML = `
        <div class="eduoneq-news-showcase__inner">
          <div class="eduoneq-news-head">
            <div>
              <p>NEWS</p>
              <h2>관련 기사와 검증 사례를<br>한눈에 확인하세요.</h2>
              <span>보도, 인터뷰, 사회공헌 소식을 실제 운영 흐름 아래 자연스럽게 정리했습니다.</span>
            </div>
            <div class="eduoneq-news-actions">
              <button type="button" data-news-toggle aria-expanded="false">관련 기사 자세히 보기</button>
              <button type="button" data-news-prev aria-label="이전 기사">‹</button>
              <button type="button" data-news-next aria-label="다음 기사">›</button>
            </div>
          </div>
          <div class="eduoneq-news-track" data-news-track>${NEWS_ITEMS.map(newsCardMarkup).join("")}</div>
          <div class="eduoneq-news-details" data-news-details hidden>
            ${NEWS_ITEMS.map((item) => `<a href="${escapeHtml(item.href)}" target="_blank" rel="noopener"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.source)}</span></a>`).join("")}
          </div>
        </div>`;
    }
    insertAfter(anchor, section);
    setupNewsInteractions(section);
  }

  function normalizeLandingLinks() {
    document.querySelectorAll("a[href]").forEach((link) => {
      const href = link.getAttribute("href");
      const path = getLocalPath(href);
      const label = textOf(link);
      const ariaLabel = link.getAttribute("aria-label");

      if (ariaLabel === "EDU ONEQ 홈" || path === "/main" || path === "/main/") {
        setHref(link, ROOT_PATH);
      } else if (label === "검증 사례" || path === "/main/customers" || path === "/main/customers/") {
        setHref(link, CUSTOMER_PROOF_PATH);
      } else if (path === "/main/contact" || path === "/main/contact/" || path === "/main/space-select/create") {
        setHref(link, CONTACT_PATH);
      } else if (path === "/terms") {
        setHref(link, "/terms/");
      } else if (path === "/privacy") {
        setHref(link, "/privacy/");
      }

      const normalizedPath = getLocalPath(link.getAttribute("href"));
      if (
        normalizedPath.includes("/undefined/") ||
        normalizedPath.includes("/auth/sign-in") ||
        normalizedPath.includes("/auth/sign-out") ||
        normalizedPath.startsWith("/main/notice") ||
        /^\/main\/(en|zh|vi)$/.test(normalizedPath)
      ) {
        hideElement(link.closest("[role='menuitem']") || link);
      }
    });
  }

  function syncRecentNewsMenu() {
    document.querySelectorAll('[role="menuitem"], a, button').forEach((element) => {
      const label = textOf(element);
      if (label === "가이드") element.textContent = "Docs ONEQ 가이드";
      if (HIDDEN_TEXTS.has(label)) hideElement(element.closest("[role='menuitem']") || element);
      if (label === "최근 소식" && element.getAttribute("role") === "menuitem") hideElement(element);
      const href = element.getAttribute && element.getAttribute("href");
      const path = getLocalPath(href);
      if (
        path.startsWith("/main/notice") ||
        path.includes("/auth/sign-in") ||
        path.includes("/auth/sign-out") ||
        path.includes("/undefined/")
      ) {
        hideElement(element.closest("[role='menuitem']") || element);
      }
    });
  }

  function hideLanguageControls() {
    document.querySelectorAll("button[aria-haspopup='menu']").forEach((button) => {
      const label = textOf(button);
      if (/^(KR|EN|ZH|VI)$/.test(label)) hideElement(button.closest(".relative") || button);
    });
  }

  function markPendingSocialButtons() {
    PENDING_SOCIAL_LABELS.forEach((label) => {
      document.querySelectorAll(`button[aria-label="${label}"]`).forEach((button) => {
        if (button.dataset.eduoneqAuditPending === VERSION) return;
        button.dataset.eduoneqAuditPending = VERSION;
        button.disabled = false;
        button.removeAttribute("aria-disabled");
        button.removeAttribute("tabindex");
        button.setAttribute("title", "준비중입니다..");
        button.style.cursor = "pointer";
        button.style.pointerEvents = "";
      });
    });
  }

  function disableHeroChatDemoControls() {
    document.querySelectorAll('[aria-label="EDU ONEQ chat demo"]').forEach((demo) => {
      demo.querySelectorAll('button[aria-label="첨부"], button[aria-label="음성"], button[aria-label="전송"]').forEach((button) => {
        disableButton(button, "비활성 데모 UI");
      });
      demo.querySelectorAll("button").forEach((button) => {
        if (textOf(button) === "GPT-5") disableButton(button, "비활성 데모 UI");
      });
    });
  }

  function routeTo(url) {
    window.location.href = url;
  }

  function scrollToSection(id) {
    const section = document.getElementById(id);
    if (!section) return false;
    window.requestAnimationFrame(() => section.scrollIntoView({ behavior: "smooth", block: "start" }));
    return true;
  }

  function goToLandingHash(id) {
    const hashPath = `/#${id}`;
    if (scrollToSection(id)) {
      window.history.replaceState(window.history.state || {}, "", hashPath);
      lastSyncedHash = window.location.hash;
    } else {
      routeTo(hashPath);
    }
  }

  function syncHashScroll() {
    const id = window.location.hash.replace(/^#/, "");
    if (!id || lastSyncedHash === window.location.hash) return;
    if (scrollToSection(id)) lastSyncedHash = window.location.hash;
  }

  function normalizeRootLandingUrl() {
    if (rootLandingUrlNormalized) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("root") !== "1") return;
    if (window.location.pathname.replace(/\/$/, "") !== "/main") return;
    const mainContentReady = document.getElementById("service-intro") || document.querySelector('[aria-label="EDU ONEQ chat demo"]');
    if (!mainContentReady) return;
    window.history.replaceState(window.history.state || {}, "", `${ROOT_PATH}${window.location.hash || ""}`);
    rootLandingUrlNormalized = true;
  }

  function applyFixes() {
    normalizeHeroSection();
    setLandingSectionIds();
    markAutomationBackdrop();
    ensureProductDeepDiveSections();
    movePartnerSectionAfterProductDetails();
    ensureNewsShowcase();
    normalizeLandingLinks();
    syncRecentNewsMenu();
    hideLanguageControls();
    markPendingSocialButtons();
    disableHeroChatDemoControls();
    normalizeRootLandingUrl();
    syncHashScroll();
  }

  document.addEventListener(
    "click",
    function (event) {
      const target = event.target && event.target.closest ? event.target.closest("a,button,[role='button']") : null;
      if (!target) return;

      const label = textOf(target);
      const href = target.getAttribute && target.getAttribute("href");
      const path = getLocalPath(href);
      const ariaLabel = target.getAttribute && target.getAttribute("aria-label");

      if (PENDING_SOCIAL_LABELS.includes(ariaLabel || "")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        showPreparingPopup(target);
        return;
      }

      if (
        HIDDEN_TEXTS.has(label) ||
        path.includes("/undefined/") ||
        path.includes("/auth/sign-in") ||
        path.includes("/auth/sign-out") ||
        path.startsWith("/main/notice") ||
        /^\/main\/(en|zh|vi)$/.test(path)
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }

      if (ariaLabel === "EDU ONEQ 홈" || path === "/main" || path === "/main/") {
        event.preventDefault();
        event.stopImmediatePropagation();
        routeTo(ROOT_PATH);
        return;
      }

      if (label === "서비스 소개" || path === SERVICE_INTRO_PATH) {
        event.preventDefault();
        event.stopImmediatePropagation();
        goToLandingHash("service-intro");
        return;
      }

      if (label === "검증 사례" || path === "/main/customers" || path === "/main/customers/" || path === CUSTOMER_PROOF_PATH) {
        event.preventDefault();
        event.stopImmediatePropagation();
        goToLandingHash(CUSTOMER_PROOF_ID);
        return;
      }

      if (label === "최근 소식" || path === `/#${NEWS_SECTION_ID}`) {
        event.preventDefault();
        event.stopImmediatePropagation();
        goToLandingHash(NEWS_SECTION_ID);
        return;
      }

      if (
        CONTACT_ARIA_LABELS.has(ariaLabel || "") ||
        path === "/main/contact" ||
        path === "/main/contact/" ||
        path === "/main/space-select/create"
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
        routeTo(CONTACT_PATH);
      }
    },
    true,
  );

  applyFixes();
  window.addEventListener("load", applyFixes);
  window.addEventListener("hashchange", syncHashScroll);
  const observer = new MutationObserver(applyFixes);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
