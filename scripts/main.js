// EDU ONEQ Landing — interactive details

(function() {
  const doc = document.documentElement;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  doc.classList.add('js-ready');

  const nav = document.getElementById('nav');
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);

  const scrollTop = document.createElement('button');
  scrollTop.className = 'scroll-top';
  scrollTop.type = 'button';
  scrollTop.setAttribute('aria-label', '맨 위로 이동');
  scrollTop.innerHTML = '<span aria-hidden="true">⌃</span>';
  document.body.appendChild(scrollTop);

  const updateScrollState = () => {
    const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const ratio = Math.min(Math.max(window.scrollY / max, 0), 1);
    progress.style.setProperty('--scroll', ratio);
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 12);
    scrollTop.classList.toggle('is-visible', window.scrollY > 520);
  };

  window.addEventListener('scroll', updateScrollState, { passive: true });
  window.addEventListener('resize', updateScrollState);
  updateScrollState();

  scrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  });

  // Product mega menu
  const productLink = document.querySelector('[data-mega="products"]');
  const megaPanel = document.getElementById('mega-products');
  let megaTimeout;
  const showMega = () => {
    if (!productLink || !megaPanel) return;
    clearTimeout(megaTimeout);
    megaPanel.classList.add('open');
    productLink.setAttribute('data-open', 'true');
  };
  const hideMega = () => {
    if (!productLink || !megaPanel) return;
    megaTimeout = setTimeout(() => {
      megaPanel.classList.remove('open');
      productLink.setAttribute('data-open', 'false');
    }, 140);
  };
  if (productLink && megaPanel) {
    productLink.addEventListener('mouseenter', showMega);
    productLink.addEventListener('mouseover', showMega);
    productLink.addEventListener('pointerenter', showMega);
    productLink.addEventListener('focus', showMega);
    productLink.addEventListener('mouseleave', hideMega);
    productLink.addEventListener('pointerleave', hideMega);
    productLink.addEventListener('blur', hideMega);
    megaPanel.addEventListener('mouseenter', showMega);
    megaPanel.addEventListener('mouseover', showMega);
    megaPanel.addEventListener('pointerenter', showMega);
    megaPanel.addEventListener('mouseleave', hideMega);
    megaPanel.addEventListener('pointerleave', hideMega);
  }

  // Smooth scroll for anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
      const href = anchor.getAttribute('href');
      if (!href || href.length <= 1) return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      const offset = nav ? Math.min(nav.offsetHeight + 18, 110) : 64;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: prefersReduced ? 'auto' : 'smooth'
      });
      if (megaPanel) megaPanel.classList.remove('open');
    });
  });

  // Reveal and active section state
  const revealItems = Array.from(document.querySelectorAll('.reveal, .service-card, .resource-card, .news-card, .proof-panel'));
  revealItems.forEach((el, index) => {
    el.style.setProperty('--reveal-delay', `${Math.min((index % 4) * 70, 210)}ms`);
  });

  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in', 'is-active');
      revealIO.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -60px 0px' });
  revealItems.forEach(el => revealIO.observe(el));

  const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const sectionIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        link.classList.toggle('is-current', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { threshold: 0.42, rootMargin: '-18% 0px -55% 0px' });
  sections.forEach(section => sectionIO.observe(section));

  // Counter animations
  const counters = document.querySelectorAll('[data-count]');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.getAttribute('data-count') || 0);
      const decimals = Number(el.getAttribute('data-decimals') || 0);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = prefersReduced ? 1 : 1300;
      const start = performance.now();
      const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = `${formatter.format(target * eased)}${suffix}`;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.45 });
  counters.forEach(counter => counterIO.observe(counter));

  // Hero chat cycles like the reference page prompt card.
  const chatDemo = document.querySelector('.chat-demo');
  const userBubble = chatDemo?.querySelector('.bubble.user');
  const botBubble = chatDemo?.querySelector('.bubble.bot');
  const productButton = chatDemo?.querySelector('.chat-tools button:nth-child(2)');
  const sendButton = chatDemo?.querySelector('.chat-tools .send');
  const chatScenarios = [
    {
      user: '생활기록부 기반 진로 분석해줘',
      product: 'AiBU ⌄',
      lines: ['학생 기록 기반 진로 진단 초안입니다.', '전공 적합도는 92%이며, 추천 학과 3건과 보완 전략을 정리했습니다.']
    },
    {
      user: 'HWP 공문서 톤을 공식 문서처럼 다듬어줘',
      product: 'Docs ONEQ ⌄',
      lines: ['문서 구조와 표기 톤을 검토했습니다.', '오탈자 3건, 표현 개선 6건, 승인 전 확인 항목 2건을 제안합니다.']
    },
    {
      user: '상담 메모를 학부모 안내문으로 정리해줘',
      product: 'Agent ⌄',
      lines: ['상담 핵심과 후속 과제를 분리했습니다.', '학생 강점, 보완 계획, 가정 전달 문구까지 한 번에 정리합니다.']
    }
  ];
  let chatIndex = 0;
  let chatPaused = false;

  const renderChat = (nextIndex) => {
    if (!chatDemo || !userBubble || !botBubble) return;
    chatIndex = (nextIndex + chatScenarios.length) % chatScenarios.length;
    const scenario = chatScenarios[chatIndex];
    chatDemo.classList.add('is-thinking');
    window.setTimeout(() => {
      userBubble.textContent = scenario.user;
      botBubble.innerHTML = scenario.lines.map(line => `<p>${line}</p>`).join('');
      if (productButton) productButton.textContent = scenario.product;
      chatDemo.classList.remove('is-thinking');
    }, prefersReduced ? 0 : 260);
  };

  if (chatDemo) {
    chatDemo.addEventListener('mouseenter', () => { chatPaused = true; });
    chatDemo.addEventListener('mouseleave', () => { chatPaused = false; });
    sendButton?.addEventListener('click', () => renderChat(chatIndex + 1));
    window.setInterval(() => {
      if (!chatPaused && !document.hidden) renderChat(chatIndex + 1);
    }, 4600);
  }

  // Pointer-responsive cards.
  const tiltItems = document.querySelectorAll('.aibu-result-card, .docs-preview-card, .service-card, .resource-card, .news-card, .guide-grid a');
  tiltItems.forEach(card => {
    card.addEventListener('pointermove', event => {
      if (prefersReduced) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      card.style.setProperty('--mx', `${x * 100}%`);
      card.style.setProperty('--my', `${y * 100}%`);
      card.style.setProperty('--rx', `${(0.5 - y) * 4}deg`);
      card.style.setProperty('--ry', `${(x - 0.5) * 5}deg`);
      card.classList.add('is-hovering');
    });
    card.addEventListener('pointerleave', () => {
      card.classList.remove('is-hovering');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });

  // Docs preview accept / reject micro-interaction.
  document.querySelectorAll('.doc-actions button').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.docs-preview-card');
      if (!card) return;
      card.classList.add('is-applied');
      button.textContent = button.matches(':first-child') ? '반영 완료' : '검토 보류';
      window.setTimeout(() => card.classList.remove('is-applied'), 1200);
    });
  });

  // FAQ accordion kept for pages that include FAQ items.
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      if (!item) return;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
})();
