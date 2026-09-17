(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- scroll progress bar + nav shrink ---------- */
  const scrubFill = document.getElementById('scrubFill');
  const nav = document.getElementById('siteNav');

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrubFill) scrubFill.style.width = pct + '%';
    if (nav) nav.classList.toggle('is-scrolled', scrollTop > 40);
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  /* ---------- reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  /* ---------- count-up stats ---------- */
  const statEls = document.querySelectorAll('.stat-num');
  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduceMotion) { el.textContent = target; return; }
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window) {
    const statIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statEls.forEach((el) => statIO.observe(el));
  }
  /* ---------- mobile menu ---------- */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- work card modal ---------- */
  const modal = document.getElementById('workModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalClient = document.getElementById('modalClient');
  const modalDesc = document.getElementById('modalDesc');
  const modalMetric = document.getElementById('modalMetric');

  document.querySelectorAll('.work-card').forEach((card) => {
    card.addEventListener('click', () => {
      modalTitle.textContent = card.getAttribute('data-title') || '';
      modalClient.textContent = card.getAttribute('data-client') || '';
      modalDesc.textContent = card.getAttribute('data-desc') || '';
      modalMetric.textContent = card.getAttribute('data-metric') || '';
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });
  if (modal) {
    modal.querySelectorAll('[data-close]').forEach((el) => {
      el.addEventListener('click', () => {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- contact form (front-end only demo) ---------- */
  const form = document.querySelector('.form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.classList.add('is-sent');
    });
  }
})();
