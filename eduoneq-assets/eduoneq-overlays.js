(function () {
  if (window.__eduoneqOverlaysMounted) return;
  window.__eduoneqOverlaysMounted = true;

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  ready(function () {
    window.setTimeout(mountEduoneqOverlays, 360);
  });

  function mountEduoneqOverlays() {
    if (document.querySelector(".eduoneq-overlay-root")) return;

    var root = document.createElement("div");
    root.className = "eduoneq-overlay-root";
    root.innerHTML =
      '<section class="eduoneq-announcement" aria-label="AI 활용지원 사업 배너">' +
      '  <div class="eduoneq-announcement__body">' +
      '    <div class="eduoneq-announcement__mark">AI</div>' +
      '    <div class="eduoneq-announcement__copy">' +
      '      <div class="eduoneq-announcement__eyebrow">2026 혁신 소상공인 AI 활용지원 사업</div>' +
      '      <div class="eduoneq-announcement__title">EDU ONEQ는 전문 AI 멘토/공급기업으로 함께합니다.</div>' +
      '      <div class="eduoneq-announcement__meta"><span>활용모델 구축</span><span>BM 구현</span><span>최대 4천만원</span><span>정부지원 80%</span></div>' +
      '    </div>' +
      '  </div>' +
      '  <div class="eduoneq-announcement__actions">' +
      '    <button type="button" class="eduoneq-announcement__cta" data-eduoneq-open-agent>AI 활용지원 상담</button>' +
      '    <button type="button" class="eduoneq-announcement__dismiss" aria-label="배너 닫기" data-eduoneq-close-banner>×</button>' +
      '  </div>' +
      '</section>' +
      '<div class="eduoneq-agent-launcher is-hidden" aria-label="EDU ONEQ 상담 배너">' +
      '  <button type="button" class="eduoneq-agent-launcher__button" data-eduoneq-open-agent>' +
      '    <span class="eduoneq-agent-launcher__logo"><img src="/eduoneq-assets/eduoneq-icon-web.png" alt="" /></span>' +
      '    <span class="eduoneq-agent-launcher__text"><strong>AI 활용지원 상담</strong><span>사업장에 맞는 AI 도입 방식 확인</span></span>' +
      '  </button>' +
      '</div>' +
      '<aside class="eduoneq-agent" aria-label="EDU ONEQ Agent AI 활용지원 상담" aria-live="polite">' +
      '  <header class="eduoneq-agent__header">' +
      '    <div class="eduoneq-agent__brand"><span>EDU ONEQ Agent</span><strong>AI 활용지원 상담</strong></div>' +
      '    <div class="eduoneq-agent__controls">' +
      '      <button type="button" class="eduoneq-agent__icon-button" aria-label="새 창에서 보기" data-eduoneq-external>↗</button>' +
      '      <button type="button" class="eduoneq-agent__icon-button" aria-label="상담창 닫기" data-eduoneq-close-agent>×</button>' +
      '    </div>' +
      '  </header>' +
      '  <div class="eduoneq-agent__body" data-eduoneq-agent-body>' +
      '    <div class="eduoneq-agent__message">단순 AI 솔루션 구매가 아니라, 사업장에 맞는 AI 활용 모델을 함께 기획하고 실제 적용 가능한 형태로 구체화합니다.</div>' +
      '    <section class="eduoneq-agent__program">' +
      '      <div class="eduoneq-agent__program-label">2026 혁신 소상공인 AI 활용지원 사업</div>' +
      '      <h3>EDU ONEQ는 전문 AI 멘토/공급기업으로 함께합니다.</h3>' +
      '      <p>AI 활용모델 기획, RAG·에이전트 설계, 업무자동화, 챗봇, 데이터 연계, 시제품 구축까지 상담 가능합니다.</p>' +
      '      <div class="eduoneq-agent__stats">' +
      '        <div class="eduoneq-agent__stat">STEP1 활용모델 구축</div>' +
      '        <div class="eduoneq-agent__stat">STEP2 BM 구현</div>' +
      '        <div class="eduoneq-agent__stat">최대 4천만원</div>' +
      '        <div class="eduoneq-agent__stat">정부지원 80%</div>' +
      '      </div>' +
      '    </section>' +
      '    <div class="eduoneq-agent__question">현재 어느 단계이신가요?</div>' +
      '    <div class="eduoneq-agent__chips" role="list">' +
      '      <button type="button" class="eduoneq-agent__chip" data-eduoneq-chip="공고를 보고 검토 중">공고를 보고 검토 중</button>' +
      '      <button type="button" class="eduoneq-agent__chip" data-eduoneq-chip="신청서·사업계획서 준비 중">신청서·사업계획서 준비 중</button>' +
      '      <button type="button" class="eduoneq-agent__chip" data-eduoneq-chip="AI 아이디어 구체화 필요">AI 아이디어 구체화 필요</button>' +
      '      <button type="button" class="eduoneq-agent__chip" data-eduoneq-chip="선정 후 구축 파트너 탐색">선정 후 구축 파트너 탐색</button>' +
      '      <button type="button" class="eduoneq-agent__chip" data-eduoneq-chip="멘토기업 상담 먼저 희망">멘토기업 상담 먼저 희망</button>' +
      '    </div>' +
      '    <div class="eduoneq-agent__thread" data-eduoneq-thread></div>' +
      '  </div>' +
      '  <form class="eduoneq-agent__footer" data-eduoneq-form>' +
      '    <input class="eduoneq-agent__input" name="message" autocomplete="off" placeholder="예: 신청서 작성 중입니다" />' +
      '    <button class="eduoneq-agent__send" type="submit" aria-label="메시지 보내기">↑</button>' +
      '  </form>' +
      '</aside>';

    document.body.appendChild(root);

    var announcement = root.querySelector(".eduoneq-announcement");
    var launcher = root.querySelector(".eduoneq-agent-launcher");
    var agent = root.querySelector(".eduoneq-agent");
    var agentBody = root.querySelector("[data-eduoneq-agent-body]");
    var thread = root.querySelector("[data-eduoneq-thread]");
    var form = root.querySelector("[data-eduoneq-form]");
    var input = root.querySelector(".eduoneq-agent__input");

    function openAgent() {
      agent.classList.add("is-open");
      launcher.classList.add("is-hidden");
      if (window.matchMedia("(max-width: 780px)").matches) {
        announcement.classList.add("is-hidden");
      }
      window.setTimeout(function () {
        input.focus({ preventScroll: true });
      }, 180);
    }

    function closeAgent() {
      agent.classList.remove("is-open");
      launcher.classList.remove("is-hidden");
    }

    function closeBanner() {
      announcement.classList.add("is-hidden");
    }

    function addReply(text, isUser) {
      var bubble = document.createElement("div");
      bubble.className = "eduoneq-agent__reply" + (isUser ? " user" : "");
      bubble.innerHTML = escapeHtml(text);
      thread.appendChild(bubble);
      agentBody.scrollTop = agentBody.scrollHeight;
    }

    function answerFor(text) {
      if (text.indexOf("신청서") >= 0 || text.indexOf("사업계획서") >= 0) {
        return "신청서와 사업계획서에는 현재 업무 흐름, 반복 업무, AI 적용 후 기대효과를 먼저 정리하는 것이 좋습니다. 필요하면 활용모델 구조와 구축 범위를 같이 잡아드릴 수 있습니다.";
      }
      if (text.indexOf("아이디어") >= 0) {
        return "아이디어 단계라면 업무 데이터, 고객 응대, 내부 문서, 반복 운영 중 어디에 AI를 적용할지부터 나누면 빠릅니다. EDU ONEQ가 활용모델 기획안 형태로 정리해드릴 수 있습니다.";
      }
      if (text.indexOf("선정") >= 0 || text.indexOf("파트너") >= 0) {
        return "선정 후에는 요구사항 정의, RAG·에이전트 설계, 프로토타입 구축, 운영 검수 순서로 진행하면 안정적입니다. 공급기업 관점에서 범위와 일정도 함께 조율 가능합니다.";
      }
      if (text.indexOf("멘토") >= 0 || text.indexOf("상담") >= 0) {
        return "멘토기업 상담은 현재 단계와 준비 자료만 확인해도 시작할 수 있습니다. 사업장 상황에 맞는 AI 활용모델과 신청 전략을 먼저 제안드리겠습니다.";
      }
      return "현재 단계에 맞춰 활용모델 구축, BM 구현, 신청서 작성, 구축 파트너 검토 중 필요한 부분을 먼저 정리해드릴 수 있습니다.";
    }

    root.querySelectorAll("[data-eduoneq-open-agent]").forEach(function (button) {
      button.addEventListener("click", openAgent);
    });

    root.querySelector("[data-eduoneq-close-agent]").addEventListener("click", closeAgent);
    root.querySelector("[data-eduoneq-close-banner]").addEventListener("click", closeBanner);
    root.querySelector("[data-eduoneq-external]").addEventListener("click", function () {
      window.open("https://eduoneq.com/", "_blank", "noopener,noreferrer");
    });

    root.querySelectorAll("[data-eduoneq-chip]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var text = chip.getAttribute("data-eduoneq-chip");
        addReply(text, true);
        window.setTimeout(function () {
          addReply(answerFor(text), false);
        }, 260);
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var value = input.value.trim();
      if (!value) return;
      input.value = "";
      addReply(value, true);
      window.setTimeout(function () {
        addReply(answerFor(value), false);
      }, 260);
    });

    window.setTimeout(openAgent, 920);
  }
})();
