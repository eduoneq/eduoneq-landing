(function () {
  const ROOT_PATH = "/";
  const SERVICE_INTRO_PATH = "/#service-intro";
  const CUSTOMER_PROOF_ID = "customer-proof";
  const CUSTOMER_PROOF_PATH = `/#${CUSTOMER_PROOF_ID}`;
  const CONTACT_PATH = "/main/contact/";
  const VERSION = "20260704-landing-links";
  const PREPARING_POPUP_ID = "eduoneq-preparing-popup";
  let rootLandingUrlNormalized = false;
  let lastSyncedHash = "";

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
    setLandingSectionIds();
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
