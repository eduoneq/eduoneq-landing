// EDU ONEQ Landing — main interactivity

(function() {
  // Nav scroll state
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 12) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mega menu hover
  const productLink = document.querySelector('[data-mega="products"]');
  const megaPanel = document.getElementById('mega-products');
  let megaTimeout;
  const showMega = () => {
    clearTimeout(megaTimeout);
    megaPanel.classList.add('open');
    productLink.setAttribute('data-open', 'true');
  };
  const hideMega = () => {
    megaTimeout = setTimeout(() => {
      megaPanel.classList.remove('open');
      productLink.setAttribute('data-open', 'false');
    }, 120);
  };
  if (productLink && megaPanel) {
    productLink.addEventListener('mouseenter', showMega);
    productLink.addEventListener('mouseleave', hideMega);
    megaPanel.addEventListener('mouseenter', showMega);
    megaPanel.addEventListener('mouseleave', hideMega);
  }

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Use case tabs
  document.querySelectorAll('.cases-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      document.querySelectorAll('.cases-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.case-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.querySelector(`.case-panel[data-panel="${target}"]`).classList.add('active');
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // Counter animations
  const counters = document.querySelectorAll('[data-count]');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const duration = 1400;
        const start = performance.now();
        const formatter = new Intl.NumberFormat('en-US');
        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = formatter.format(Math.round(target * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterIO.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterIO.observe(c));

  // Smooth scroll for anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 64, behavior: 'smooth' });
        }
      }
    });
  });
})();
