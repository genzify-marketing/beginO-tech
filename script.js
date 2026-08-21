/* ==========================================================================
   BegiNo Tech — Premium Interactive Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Native smooth scrolling keeps anchor navigation reliable without a second scroll controller. */
  const lenis = null;

  /* --------------------------------------------------------------------------
     2. Scroll Progress & Back To Top
     -------------------------------------------------------------------------- */
  const progressBar = document.getElementById('progress-bar');
  const backToTop = document.getElementById('backToTop');
  const navbar = document.getElementById('navbar');
  let scrollUpdatePending = false;

  function updateScroll() {
    if (scrollUpdatePending) return;
    scrollUpdatePending = true;

    requestAnimationFrame(() => {
      scrollUpdatePending = false;
      const h = document.documentElement;
      const scrollRange = h.scrollHeight - h.clientHeight;
      const scrolled = scrollRange > 0 ? h.scrollTop / scrollRange : 0;

      if (progressBar) progressBar.style.transform = `scaleX(${scrolled})`;

      if (backToTop) backToTop.classList.toggle('show', h.scrollTop > 500);
      if (navbar) navbar.classList.toggle('scrolled', h.scrollTop > 40);
    });
  }

  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  function scrollToTarget(target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
    });
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      scrollToTarget(document.body);
    });
  }

  const heroScreen = document.getElementById('heroScreen');
  if (heroScreen) {
    const flipHeroScreen = () => {
      const isFlipped = heroScreen.classList.toggle('is-flipped');
      heroScreen.setAttribute('aria-pressed', String(isFlipped));
    };

    heroScreen.addEventListener('click', flipHeroScreen);
    heroScreen.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        flipHeroScreen();
      }
    });
  }

  /* --------------------------------------------------------------------------
     3. Accessible Mobile Navigation
     -------------------------------------------------------------------------- */
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMenu() {
    if (!mobileMenu || !menuBtn) return;
    mobileMenu.classList.remove('open');
    document.body.classList.remove('mobile-menu-open');
    document.body.classList.add('mobile-menu-closed');
    mobileMenu.style.removeProperty('max-height');
    mobileMenu.style.removeProperty('opacity');
    mobileMenu.style.removeProperty('transform');
    mobileMenu.style.removeProperty('pointer-events');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.innerHTML = '<i data-lucide="menu" class="w-5 h-5"></i>';
    if (window.lucide) lucide.createIcons();
  }

  if (menuBtn && mobileMenu) {
    document.body.classList.add('mobile-menu-closed');

    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      document.body.classList.toggle('mobile-menu-open', isOpen);
      document.body.classList.toggle('mobile-menu-closed', !isOpen);
      if (isOpen) {
        mobileMenu.style.setProperty('max-height', '32rem', 'important');
        mobileMenu.style.setProperty('opacity', '1', 'important');
        mobileMenu.style.setProperty('transform', 'translateY(0)', 'important');
        mobileMenu.style.setProperty('pointer-events', 'auto', 'important');
      } else {
        mobileMenu.style.setProperty('max-height', '0px', 'important');
        mobileMenu.style.setProperty('opacity', '0', 'important');
        mobileMenu.style.setProperty('transform', 'translateY(-8px)', 'important');
        mobileMenu.style.setProperty('pointer-events', 'none', 'important');
      }
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
     4. Hero Interactive Code Animation
     -------------------------------------------------------------------------- */
  const heroCode = document.getElementById('heroCode');
  if (heroCode && !reduceMotion) {
    const codeLines = [
      '<span class="comment">// BegiNo Tech — Build. Ship. Scale.</span>',
      '',
      '<span class="keyword">const</span> <span class="fn">project</span> = {',
      '  <span class="string">name</span>: <span class="string">"Your Next Product"</span>,',
      '  <span class="string">stack</span>: [<span class="string">"React"</span>, <span class="string">"Node"</span>, <span class="string">"AI"</span>],',
      '  <span class="string">performance</span>: <span class="number">98</span>,',
      '  <span class="string">scalable</span>: <span class="keyword">true</span>,',
      '};',
      '',
      '<span class="keyword">await</span> <span class="fn">beginotech</span>.<span class="fn">deploy</span>(project);',
      '<span class="comment">// ✓ Build deployed successfully</span>',
    ];

    codeLines.forEach((line, i) => {
      const div = document.createElement('div');
      div.className = 'line';
      div.innerHTML = line || '&nbsp;';
      div.style.animationDelay = `${0.8 + i * 0.15}s`;
      heroCode.appendChild(div);
    });
  } else if (heroCode) {
    // Static fallback for reduced motion
    heroCode.innerHTML = `
      <div class="line" style="opacity:1"><span class="comment">// BegiNo Tech — Build. Ship. Scale.</span></div>
      <div class="line" style="opacity:1">&nbsp;</div>
      <div class="line" style="opacity:1"><span class="keyword">const</span> <span class="fn">project</span> = {</div>
      <div class="line" style="opacity:1">  <span class="string">name</span>: <span class="string">"Your Next Product"</span>,</div>
      <div class="line" style="opacity:1">  <span class="string">stack</span>: [<span class="string">"React"</span>, <span class="string">"Node"</span>, <span class="string">"AI"</span>],</div>
      <div class="line" style="opacity:1">  <span class="string">performance</span>: <span class="number">98</span>,</div>
      <div class="line" style="opacity:1">  <span class="string">scalable</span>: <span class="keyword">true</span>,</div>
      <div class="line" style="opacity:1">};</div>
      <div class="line" style="opacity:1">&nbsp;</div>
      <div class="line" style="opacity:1"><span class="keyword">await</span> <span class="fn">beginotech</span>.<span class="fn">deploy</span>(project);</div>
      <div class="line" style="opacity:1"><span class="comment">// ✓ Build deployed successfully</span></div>
    `;
  }

  /* --------------------------------------------------------------------------
     5. Services Data & Rendering (with Interactive Demos)
     -------------------------------------------------------------------------- */
  const services = [
    {
      title: 'Web Development',
      desc: 'Fast, responsive websites and web applications that make complex things feel simple.',
      demoType: 'terminal',
      demoContent: {
        lines: [
          { prompt: '$ ', cmd: 'npx create-next-app beginotech-client' },
          { output: '✓ Installing dependencies...' },
          { output: '✓ Initializing project structure...' },
          { success: '✓ Ready — running on localhost:3000' },
          { prompt: '$ ', cmd: 'npm run build' },
          { success: '✓ Build optimized — 98/100 Performance' }
        ]
      },
      icon: 'code-2'
    },
    {
      title: 'Digital Marketing',
      desc: 'Strategy, content, and measurable campaigns that turn attention into steady demand.',
      demoType: 'dashboard',
      demoContent: {
        metrics: [
          { label: 'Reach', value: '2.4x', up: true },
          { label: 'Leads', value: '+38%', up: true },
          { label: 'Content live', value: '24', up: true },
          { label: 'Audience', value: '12k', up: false }
        ]
      },
      icon: 'megaphone'
    },
    {
      title: 'Mobile Apps',
      desc: 'Clear, considered mobile experiences that people can use without instructions.',
      demoType: 'app',
      icon: 'smartphone'
    },
    {
      title: 'UI/UX Design',
      desc: 'Interfaces and design systems that give every important action a clear place.',
      demoType: 'theme',
      icon: 'figma'
    },
    {
      title: 'Graphic Design',
      desc: 'Distinct visual systems, campaign assets, and brand details people remember.',
      demoType: 'theme',
      icon: 'palette'
    },
    {
      title: 'Ads',
      desc: 'Focused Meta and Google advertising built around testing, learning, and efficient growth.',
      demoType: 'terminal',
      demoContent: {
        lines: [
          { prompt: '$ ', cmd: 'launch campaign --focused' },
          { output: '✓ Audience segments ready' },
          { output: '✓ Creative variants tested' },
          { success: '✓ ROAS tracking enabled' },
          { success: '✓ Campaign ready to scale' }
        ]
      },
      icon: 'target'
    }
  ];

  const servicesGrid = document.getElementById('servicesGrid');
  if (servicesGrid) {
    services.forEach((s, i) => {
      const card = document.createElement('div');
      card.className = 'service-interactive-card';
      card.setAttribute('data-aos', 'fade-up');
      card.setAttribute('data-aos-delay', (i % 2) * 100);

      let demoHTML = '';

      if (s.demoType === 'terminal' && s.demoContent) {
        let linesHTML = s.demoContent.lines.map(l => {
          if (l.prompt) return `<div><span class="prompt">${l.prompt}</span><span class="cmd">${l.cmd}</span></div>`;
          if (l.output) return `<div class="output">${l.output}</div>`;
          if (l.success) return `<div class="success">${l.success}</div>`;
          return '';
        }).join('');
        demoHTML = `
          <div class="service-demo-terminal">
            <div class="service-demo-terminal-bar">
              <span style="background: #F38BA8;"></span>
              <span style="background: #FAB387;"></span>
              <span style="background: #A6E3A1;"></span>
            </div>
            <div class="service-demo-terminal-body">${linesHTML}</div>
          </div>`;
      } else if (s.demoType === 'app') {
        demoHTML = `
          <div class="service-demo-app">
            <div class="service-demo-app-bar">
              <span>●●● BegiNo App</span>
              <span style="font-size: 0.55rem; opacity: 0.7;">9:41 AM</span>
            </div>
            <div class="service-demo-app-body">
              <div class="app-item"><div class="app-icon"><i data-lucide="home" class="w-3 h-3" style="color: var(--primary);"></i></div><span>Dashboard</span></div>
              <div class="app-item"><div class="app-icon"><i data-lucide="bell" class="w-3 h-3" style="color: var(--primary);"></i></div><span>Notifications (3)</span></div>
              <div class="app-item"><div class="app-icon"><i data-lucide="settings" class="w-3 h-3" style="color: var(--primary);"></i></div><span>Settings</span></div>
              <div class="app-item"><div class="app-icon"><i data-lucide="user" class="w-3 h-3" style="color: var(--primary);"></i></div><span>Profile</span></div>
            </div>
          </div>`;
      } else if (s.demoType === 'dashboard' && s.demoContent) {
        let metricsHTML = s.demoContent.metrics.map(m =>
          `<div class="metric">
            <div class="metric-label">${m.label}</div>
            <div class="metric-value${m.up ? ' up' : ''}">${m.value}</div>
          </div>`
        ).join('');
        demoHTML = `<div class="service-demo-dash">${metricsHTML}</div>`;
      } else if (s.demoType === 'workflow' && s.demoContent) {
        let nodesHTML = s.demoContent.nodes.map((n, ni) => {
          const cls = ni < 2 ? ' done' : (ni === 2 ? ' active' : '');
          return `<div class="workflow-node${cls}">${n}</div>` +
            (ni < s.demoContent.nodes.length - 1 ? '<span class="workflow-arrow">→</span>' : '');
        }).join('');
        demoHTML = `<div class="service-demo-workflow">${nodesHTML}</div>`;
      } else if (s.demoType === 'theme') {
        demoHTML = `
          <div class="service-demo-theme">
            <div class="theme-switcher" id="themeSwitcher">
              <button class="theme-btn active" data-color="#7C3AED" data-bg="#FAFBFD">Violet</button>
              <button class="theme-btn" data-color="#059669" data-bg="#F0FDF4">Emerald</button>
              <button class="theme-btn" data-color="#2563EB" data-bg="#EFF6FF">Blue</button>
              <button class="theme-btn" data-color="#DC2626" data-bg="#FEF2F2">Red</button>
            </div>
            <div class="theme-preview-box" id="themePreview" style="background: #FAFBFD; border-color: rgba(124,58,237,0.15);">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                <div style="width:28px;height:28px;border-radius:8px;background:#7C3AED;"></div>
                <div>
                  <div style="font-size:0.7rem;font-weight:700;color:#0A0A14;">BegiNo Tech</div>
                  <div style="font-size:0.55rem;color:#5C5C72;">Component Preview</div>
                </div>
              </div>
              <div style="height:6px;border-radius:3px;background:#7C3AED;width:65%;margin-bottom:6px;transition:all 0.3s;"></div>
              <div style="height:6px;border-radius:3px;background:rgba(124,58,237,0.15);width:90%;transition:all 0.3s;"></div>
            </div>
          </div>`;
      } else if (s.demoType === 'seo' && s.demoContent) {
        let rowsHTML = s.demoContent.keywords.map(k =>
          `<div class="seo-rank-row">
            <span class="seo-rank-keyword">${k.keyword}</span>
            <span class="seo-rank-pos ${k.cls}">${k.pos}</span>
          </div>`
        ).join('');
        demoHTML = `
          <div class="service-demo-seo">
            <div style="font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-subtle);margin-bottom:0.5rem;">Search Rankings</div>
            ${rowsHTML}
            <button class="seo-optimize-btn" onclick="this.textContent='✓ Optimized!';this.style.background='#059669';setTimeout(()=>{this.textContent='Run SEO Audit';this.style.background='var(--primary)';},2000);">Run SEO Audit</button>
          </div>`;
      }

      card.innerHTML = `
        <div class="service-demo">${demoHTML}</div>
        <div class="service-info">
          <h3 class="font-heading">${s.title}</h3>
          <p>${s.desc}</p>
          <a href="#contact" data-service="${s.title}" class="service-link">
            Get Started <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </a>
        </div>
      `;
      servicesGrid.appendChild(card);
    });

    // Theme switcher interactivity
    const themeSwitcher = document.getElementById('themeSwitcher');
    const themePreview = document.getElementById('themePreview');
    if (themeSwitcher && themePreview) {
      themeSwitcher.addEventListener('click', (e) => {
        const btn = e.target.closest('.theme-btn');
        if (!btn) return;

        themeSwitcher.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const color = btn.dataset.color;
        const bg = btn.dataset.bg;
        themePreview.style.background = bg;
        themePreview.style.borderColor = color + '25';

        const swatch = themePreview.querySelector('div > div > div:first-child');
        if (swatch) swatch.style.background = color;

        const bar1 = themePreview.querySelectorAll('div[style*="height:6px"]')[0];
        const bar2 = themePreview.querySelectorAll('div[style*="height:6px"]')[1];
        if (bar1) bar1.style.background = color;
        if (bar2) bar2.style.background = color + '25';
      });
    }

    // Service link → form auto-fill (preserved functionality)
    servicesGrid.addEventListener('click', (e) => {
      const link = e.target.closest('.service-link');
      if (link) {
        e.preventDefault();
        const serviceName = link.dataset.service;
        const select = document.getElementById('service');
        if (select && serviceName) {
          // Find closest matching option
          const options = Array.from(select.options);
          const match = options.find(o => o.value === serviceName || o.text.includes(serviceName.split(' ')[0]));
          if (match) select.value = match.value;
        }
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          scrollToTarget(contactSection);
        }
      }
    });
  }

  /* --------------------------------------------------------------------------
     6. Tech Stack Strip
     -------------------------------------------------------------------------- */
  const techStrip = document.getElementById('techStrip');
  if (techStrip) {
    const techs = [
      { name: 'React', icon: '⚛️' },
      { name: 'Next.js', icon: '▲' },
      { name: 'Node.js', icon: '🟢' },
      { name: 'Python', icon: '🐍' },
      { name: 'Flutter', icon: '💙' },
      { name: 'TypeScript', icon: '🔷' },
      { name: 'Figma', icon: '🎨' },
      { name: 'AWS', icon: '☁️' },
      { name: 'Firebase', icon: '🔥' },
      { name: 'MongoDB', icon: '🍃' },
      { name: 'PostgreSQL', icon: '🐘' },
      { name: 'TailwindCSS', icon: '🎐' },
      { name: 'Docker', icon: '🐳' },
      { name: 'Git', icon: '🔀' },
      { name: 'Vercel', icon: '▲' },
      { name: 'OpenAI', icon: '🤖' },
    ];

    // Create items twice for seamless loop
    const createItems = () => techs.map(t => `
      <div class="tech-item">
        <div class="tech-icon">${t.icon}</div>
        <span class="tech-label">${t.name}</span>
      </div>
    `).join('');

    techStrip.innerHTML = createItems() + createItems();
  }

  /* --------------------------------------------------------------------------
     7. Why Us — Horizontal Scroll Cards
     -------------------------------------------------------------------------- */
  const whyTrack = document.getElementById('whyTrack');
  if (whyTrack) {
    const whyItems = [
      { icon: 'code-2', title: 'Close collaboration', desc: 'You work with the people shaping the work, with decisions kept clear and conversations direct.' },
      { icon: 'scan-search', title: 'Useful by default', desc: 'We start with the real problem, then remove anything that does not help someone use the product.' },
      { icon: 'layers', title: 'Built to evolve', desc: 'The system is shaped for the next version as well as the first, without adding complexity for its own sake.' },
      { icon: 'palette', title: 'Design with purpose', desc: 'Visual decisions carry meaning: hierarchy, motion, and detail all help people move forward.' },
      { icon: 'sparkles', title: 'Thoughtful automation', desc: 'We use AI where it makes work lighter and clearer, with a human decision still in the loop.' },
      { icon: 'shield-check', title: 'Steady after launch', desc: 'Good work keeps its shape after release through documentation, care, and an honest view of what comes next.' },
    ];

    const createWhyCards = () => whyItems.map(w => `
      <div class="why-card">
        <div class="why-card-icon">
          <i data-lucide="${w.icon}" class="w-5 h-5"></i>
        </div>
        <h3 class="font-heading">${w.title}</h3>
        <p>${w.desc}</p>
      </div>
    `).join('');

    whyTrack.innerHTML = createWhyCards() + createWhyCards();
  }

  /* --------------------------------------------------------------------------
     8. Process Timeline Scroll Animation
     -------------------------------------------------------------------------- */
  if (window.gsap && window.ScrollTrigger && !reduceMotion) {
    const processTimeline = document.getElementById('processTimeline');
    const processProgress = document.getElementById('processProgress');

    if (processTimeline && processProgress) {
      const isMobile = window.innerWidth < 641;
      const steps = processTimeline.querySelectorAll('.process-step');

      ScrollTrigger.create({
        trigger: processTimeline,
        start: 'top 80%',
        end: 'bottom 50%',
        onUpdate: (self) => {
          const progress = self.progress;
          if (isMobile) {
            processProgress.style.height = (progress * 90) + '%';
          } else {
            processProgress.style.width = (progress * 90) + '%';
          }

          steps.forEach((step, i) => {
            const threshold = i / (steps.length - 1);
            if (progress >= threshold) {
              step.classList.add('done');
              step.querySelector('.process-step-num').style.background = 'var(--primary)';
              step.querySelector('.process-step-num').style.borderColor = 'var(--primary)';
              step.querySelector('.process-step-num').style.color = '#fff';
            }
          });
        }
      });
    }
  }

  /* --------------------------------------------------------------------------
     9. Contact Form Handling (WhatsApp Integration — PRESERVED)
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
     10. GSAP Scroll Animations
     -------------------------------------------------------------------------- */
  if (window.gsap && window.ScrollTrigger && !reduceMotion) {
    // Hero reveal
    gsap.from('.hero-reveal', {
      opacity: 0,
      y: 30,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.2
    });

    // AOS style triggers for [data-aos] elements
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

    // Hero floating notification animation
    const heroNotif = document.getElementById('heroNotif');
    if (heroNotif) {
      gsap.from(heroNotif, {
        opacity: 0,
        x: 30,
        duration: 0.8,
        delay: 2,
        ease: 'power3.out'
      });
    }

    // Hero dashboard animation
    const heroDash = document.getElementById('heroDash');
    if (heroDash) {
      gsap.from(heroDash, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 2.5,
        ease: 'power3.out'
      });
    }
  }

  /* --------------------------------------------------------------------------
     11. Initialize Lucide Icons
     -------------------------------------------------------------------------- */
  if (window.lucide) {
    lucide.createIcons();
  }
});
