/* ==========================================================================
   Begino Tech — Core Interactive Logic & Application Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------------------------------------------------------------
     1. Theme Engine (System Preference + Manual Toggle + LocalStorage)
     -------------------------------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  
  function getInitialTheme() {
    const saved = localStorage.getItem('begino-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('begino-theme', theme);
  }

  const currentTheme = getInitialTheme();
  applyTheme(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const active = document.documentElement.getAttribute('data-theme');
      applyTheme(active === 'dark' ? 'light' : 'dark');
    });
  }

  /* --------------------------------------------------------------------------
     2. Lenis Smooth Scroll Engine
     -------------------------------------------------------------------------- */
  let lenis;
  if (typeof Lenis !== 'undefined' && !reduceMotion) {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0, 0);
    }
  }

  /* --------------------------------------------------------------------------
     3. Scroll Progress & Back To Top
     -------------------------------------------------------------------------- */
  const progressBar = document.getElementById('progress-bar');
  const backToTop = document.getElementById('backToTop');

  function updateScroll() {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    if (progressBar) progressBar.style.width = scrolled + '%';

    if (backToTop) {
      if (window.scrollY > 500) backToTop.classList.add('show');
      else backToTop.classList.remove('show');
    }

    const navbar = document.getElementById('navbar');
    if (navbar) {
      if (window.scrollY > 40) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --------------------------------------------------------------------------
     4. Accessible Mobile Navigation
     -------------------------------------------------------------------------- */
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMenu() {
    if (!mobileMenu || !menuBtn) return;
    mobileMenu.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.innerHTML = '<i data-lucide="menu" class="w-5 h-5"></i>';
    if (window.lucide) lucide.createIcons();
  }

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      menuBtn.innerHTML = isOpen ? '<i data-lucide="x" class="w-5 h-5"></i>' : '<i data-lucide="menu" class="w-5 h-5"></i>';
      if (window.lucide) lucide.createIcons();
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  /* --------------------------------------------------------------------------
     5. Custom Cursor & Spring Physics
     -------------------------------------------------------------------------- */
  const glow = document.getElementById('cursor-glow');
  const dot = document.getElementById('cursor-dot');
  const cursorLabel = document.getElementById('cursorLabel');
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;

  if (!reduceMotion && !isCoarse && dot && glow && window.gsap) {
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.4, ease: 'power3.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.4, ease: 'power3.out' });
    const glowX = gsap.quickTo(glow, 'x', { duration: 0.8, ease: 'power3.out' });
    const glowY = gsap.quickTo(glow, 'y', { duration: 0.8, ease: 'power3.out' });

    gsap.set(dot, { xPercent: -50, yPercent: -50 });
    gsap.set(glow, { xPercent: -50, yPercent: -50 });

    window.addEventListener('mousemove', (e) => {
      dotX(e.clientX); dotY(e.clientY);
      glowX(e.clientX); glowY(e.clientY);
    });

    document.querySelectorAll('[data-cursor-text]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.classList.add('expand');
        if (cursorLabel) cursorLabel.textContent = el.dataset.cursorText || '';
      });
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('expand');
        if (cursorLabel) cursorLabel.textContent = '';
      });
    });

    document.querySelectorAll('a, button, .tilt-card').forEach(el => {
      if (el.hasAttribute('data-cursor-text')) return;
      el.addEventListener('mouseenter', () => gsap.to(dot, { scale: 1.5, duration: 0.3 }));
      el.addEventListener('mouseleave', () => gsap.to(dot, { scale: 1, duration: 0.3 }));
    });
  }

  /* --------------------------------------------------------------------------
     6. Services Data & Rendering
     -------------------------------------------------------------------------- */
  const services = [
    { svg: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-7 h-7"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>', title: 'Web Development', desc: 'Fast, responsive, high-converting web applications engineered with modern frontend standards and clean UI/UX.' },
    { svg: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-7 h-7"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>', title: 'Digital Marketing', desc: 'Full-funnel growth strategy built on sharp audience targeting and data-driven creative execution.' },
    { svg: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-7 h-7"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>', title: 'Graphic Design', desc: 'Distinct brand visual systems, pitch decks, and digital assets crafted to elevate brand perception.' },
    { svg: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-7 h-7"><path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z"/></svg>', title: 'Meta Ads', desc: 'High-ROAS Facebook & Instagram campaigns with scroll-stopping ad creatives and audience testing.' },
    { svg: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-7 h-7"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>', title: 'Google Ads', desc: 'Intent-driven Search, Display, and Performance Max campaigns targeting customers when they buy.' },
    { svg: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-7 h-7"><path d="m8 11 2 2 4-4"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>', title: 'SEO', desc: 'Technical SEO, keyword architecture, and content strategy for lasting organic market authority.' }
  ];

  const servicesGrid = document.getElementById('servicesGrid');
  if (servicesGrid) {
    services.forEach((s, i) => {
      const card = document.createElement('div');
      card.className = 'service-card lift-card gradient-border glass rounded-20 p-6 flex flex-col h-full cursor-pointer';
      card.setAttribute('data-aos', 'fade-up');
      card.setAttribute('data-aos-delay', (i % 3) * 80);

      card.innerHTML = `
        <div class="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
          ${s.svg}
        </div>
        <h3 class="font-heading font-bold text-lg mb-2">${s.title}</h3>
        <p class="text-sm leading-relaxed mb-5 text-muted">${s.desc}</p>
        <a href="#contact" data-service="${s.title}" class="service-link mt-auto inline-flex items-center gap-2 text-primary font-semibold text-xs">
          Learn more <i data-lucide="arrow-right" class="w-3.5 h-3.5 transition-transform"></i>
        </a>
      `;
      servicesGrid.appendChild(card);
    });

    // Delegate click for service link to auto-fill form field
    servicesGrid.addEventListener('click', (e) => {
      const link = e.target.closest('.service-link');
      if (link) {
        e.preventDefault();
        const serviceName = link.dataset.service;
        const select = document.getElementById('service');
        if (select && serviceName) {
          select.value = serviceName;
        }
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          if (lenis) lenis.scrollTo(contactSection, { offset: -70 });
          else contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  /* --------------------------------------------------------------------------
     7. Process Section Steps Rendering
     -------------------------------------------------------------------------- */
  const processSteps = [
    { num: '01', title: 'Discover & Align', desc: 'We deep dive into your business goals, target demographic, brand values, and competitive landscape.' },
    { num: '02', title: 'Strategic Roadmap', desc: 'Crafting a focused action plan with milestone deliverables, timelines, and quantitative KPIs.' },
    { num: '03', title: 'Creative & Architecture', desc: 'Designing conversion-focused user interfaces, visual assets, and high-impact ad concepts.' },
    { num: '04', title: 'Agile Execution', desc: 'Building clean code or launching campaigns with continuous testing and quality assurance.' },
    { num: '05', title: 'Launch & Measure', desc: 'Deploying to live environment and monitoring analytics, user heatmaps, and performance metrics.' },
    { num: '06', title: 'Iterate & Scale', desc: 'Optimizing based on real data to maximize conversions, ROI, and sustainable brand authority.' }
  ];

  const processGrid = document.getElementById('processGrid');
  if (processGrid) {
    processSteps.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'lift-card gradient-border glass rounded-20 p-6 flex flex-col h-full relative';
      card.setAttribute('data-aos', 'fade-up');
      card.setAttribute('data-aos-delay', (i % 3) * 80);

      card.innerHTML = `
        <span class="text-2xl font-heading font-extrabold text-primary/20 mb-3 block">${p.num}</span>
        <h3 class="font-heading font-semibold text-base mb-1.5">${p.title}</h3>
        <p class="text-sm text-muted leading-relaxed">${p.desc}</p>
      `;
      processGrid.appendChild(card);
    });
  }

  /* --------------------------------------------------------------------------
     8. 3D Tilt Card Interaction
     -------------------------------------------------------------------------- */
  function attachTilt(selector) {
    document.querySelectorAll(selector).forEach(card => {
      card.classList.add('tilt-card');
      if (reduceMotion) return;
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = e.clientX - r.left, py = e.clientY - r.top;
        const rx = (py / r.height - 0.5) * -10;
        const ry = (px / r.width - 0.5) * 10;
        if (window.gsap) {
          gsap.to(card, { rotateX: rx, rotateY: ry, duration: 0.4, ease: 'power2.out', transformPerspective: 800 });
        }
      });
      card.addEventListener('mouseleave', () => {
        if (window.gsap) {
          gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power2.out' });
        }
      });
    });
  }

  setTimeout(() => {
    attachTilt('.service-card');
    attachTilt('#processGrid > div');
    attachTilt('#whyGrid > div');
    attachTilt('#heroLogoCard');
  }, 100);

  /* --------------------------------------------------------------------------
     9. Contact Form Handling (WhatsApp Fallback Integration)
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name')?.value.trim() || '';
      const email = document.getElementById('email')?.value.trim() || '';
      const phone = document.getElementById('phone')?.value.trim() || '';
      const service = document.getElementById('service')?.value || 'General Inquiry';
      const message = document.getElementById('message')?.value.trim() || '';

      if (!name || !email || !message) {
        if (formNote) {
          formNote.textContent = 'Please fill in all required fields.';
          formNote.style.color = '#ef4444';
        }
        return;
      }

      // Pre-fill WhatsApp message
      const textMessage = `Hello BegiNo Tech! 👋\n\n*Name:* ${name}\n*Email:* ${email}\n*Phone:* ${phone || 'N/A'}\n*Service Requested:* ${service}\n\n*Message:* ${message}`;
      const encodedMsg = encodeURIComponent(textMessage);
      const whatsappUrl = `https://wa.me/916381167474?text=${encodedMsg}`;

      if (formNote) {
        formNote.textContent = 'Opening WhatsApp with your details pre-filled...';
        formNote.style.color = 'var(--primary)';
      }

      // Open WhatsApp link
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      // Reset form state
      contactForm.reset();
    });
  }

  /* --------------------------------------------------------------------------
     10. GSAP Animations & Intersection Observers
     -------------------------------------------------------------------------- */
  if (window.gsap && window.ScrollTrigger && !reduceMotion) {
    // Hero elements reveal
    gsap.from('.hero-reveal', {
      opacity: 0,
      y: 30,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.2
    });

    // AOS style triggers
    document.querySelectorAll('[data-aos]').forEach(el => {
      const delay = (+el.dataset.aosDelay || 0) / 1000;
      gsap.fromTo(el, 
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true
          }
        }
      );
    });
  }

  // Initialize Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }
});
