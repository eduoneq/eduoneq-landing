(function () {
  const HOME_PATH = "/main/";
  const CONTACT_PATH = "/main/contact";
  const VERSION = "20260703-web-audit2";
  const PREPARING_POPUP_ID = "eduoneq-preparing-popup";
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

  function textOf(element) {
    return (element && element.textContent ? element.textContent : "").replace(/\s+/g, " ").trim();
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

  function normalizeHomeLinks() {
    document.querySelectorAll('a[href="/main"]').forEach((link) => {
      link.setAttribute("href", HOME_PATH);
    });
  }

  function syncRecentNewsMenu() {
    document.querySelectorAll('[role="menuitem"], a, button').forEach((element) => {
      const label = textOf(element);
      if (label === "가이드") element.textContent = "Docs ONEQ 가이드";
      if (HIDDEN_TEXTS.has(label)) hideElement(element.closest("[role='menuitem']") || element);
      if (label === "최근 소식" && element.getAttribute("role") === "menuitem") hideElement(element);
      const href = element.getAttribute && element.getAttribute("href");
      if (href && (href.startsWith("/main/notice") || href === "/main/auth/sign-in")) {
        hideElement(element);
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

  function applyFixes() {
    normalizeHomeLinks();
    syncRecentNewsMenu();
    hideLanguageControls();
    markPendingSocialButtons();
    disableHeroChatDemoControls();
  }

  function routeTo(url) {
    window.location.href = url;
  }

  document.addEventListener(
    "click",
    function (event) {
      const target = event.target && event.target.closest ? event.target.closest("a,button") : null;
      if (!target) return;

      const label = textOf(target);
      const href = target.getAttribute && target.getAttribute("href");
      const ariaLabel = target.getAttribute && target.getAttribute("aria-label");

      if (ariaLabel === "EDU ONEQ 홈") {
        event.preventDefault();
        event.stopImmediatePropagation();
        routeTo(HOME_PATH);
        return;
      }

      if (label === "서비스 소개") {
        event.preventDefault();
        event.stopImmediatePropagation();
        const section = document.getElementById("service-intro");
        if (section && location.pathname.replace(/\/$/, "") === "/main") {
          history.replaceState({}, "", HOME_PATH + "#service-intro");
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          routeTo(HOME_PATH + "#service-intro");
        }
        return;
      }

      if (href === "/main") {
        event.preventDefault();
        event.stopImmediatePropagation();
        routeTo(HOME_PATH);
        return;
      }

      if (href && (href.startsWith("/main/notice") || href === "/main/auth/sign-in" || /^\/main\/(en|zh|vi)$/.test(href))) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }

      if (href === "/main/space-select/create" || ariaLabel === "create workspace button") {
        event.preventDefault();
        event.stopImmediatePropagation();
        routeTo(CONTACT_PATH);
        return;
      }

      if (PENDING_SOCIAL_LABELS.includes(ariaLabel || "")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        showPreparingPopup(target);
        return;
      }

      if (HIDDEN_TEXTS.has(label)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true,
  );

  applyFixes();
  window.addEventListener("load", applyFixes);
  const observer = new MutationObserver(applyFixes);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
