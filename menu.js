(() => {
  const boot = () => {
    if (document.getElementById('mc-menu-trigger')) return;
    const nav = document.querySelector('.nav');
    if (!nav) return;

    // Keep the header focused: one action only. Course/service CTAs live on their pages.
    nav.querySelector('.navcta, .btn')?.remove();

    const trigger = document.createElement('button');
    trigger.id = 'mc-menu-trigger';
    trigger.className = 'mc-menu-trigger';
    trigger.setAttribute('aria-label','Open menu');
    trigger.setAttribute('aria-expanded','false');
    trigger.innerHTML = '<b>Menu</b><i><span></span></i>';
    nav.appendChild(trigger);

    const panel = document.createElement('div');
    panel.className = 'mc-menu-panel';
    panel.innerHTML = `
      <div class="mc-menu-drawer" role="dialog" aria-label="Murder Crow menu">
        <div class="mc-menu-kicker">Murder Crow · Explore</div>
        <a class="mc-menu-item" href="/about.html">About us</a>
        <a class="mc-menu-item" href="/mission.html">Our mission</a>

        <div class="mc-menu-item">Services</div>
        <div class="mc-menu-sub">
          <a href="/services/">All services</a>
          <a href="/services/digital-marketing.html">Digital marketing · growth & paid media</a>
          <a href="/services/brand-development.html">Brand development</a>
          <a href="/services/crm.html">CRM & automation</a>
          <a href="/services/advertising.html">Advertising</a>
          <a href="/services/events.html">Event management & experiences</a>
        </div>

        <div class="mc-menu-item">Skill Up Courses</div>
        <div class="mc-menu-sub">
          <a href="/courses/digital-marketing-course.html">Digital Marketing · ₹27,499 offer</a>
          <a href="/courses/ui-ux-design.html">UI / UX Design · fee on WhatsApp</a>
          <a href="/courses/graphic-design.html">Graphic Design · fee on WhatsApp</a>
          <a href="/courses/growth-marketing-course.html">Growth Marketing</a>
          <a href="/learn/ai-tools.html">AI Tools · simple learning</a>
        </div>

        <a class="mc-menu-item" href="/playbook.html">Growth Marketing Playbook · ₹1,399</a>
        <a class="mc-menu-item" href="/blog/">Blog / Learn</a>
        <a class="mc-menu-item" href="/support.html">Support</a>

        <div class="mc-menu-card">
          <b>Need a rate?</b>
          <p>Tell us what you need. We'll share the right service or course details on WhatsApp.</p>
          <a href="https://wa.me/?text=Hi%20Murder%20Crow%2C%20I%20want%20service%20or%20course%20details.">Ask on WhatsApp →</a>
        </div>
        <div class="mc-menu-partner">Events & experiences co-partnered with <a href="https://leaflineevents.in" target="_blank" rel="noopener">Leafline Events</a>.</div>
      </div>`;
    document.body.appendChild(panel);

    const close = () => {
      panel.classList.remove('open');
      trigger.classList.remove('open');
      trigger.setAttribute('aria-expanded','false');
      document.body.style.overflow = '';
    };
    trigger.addEventListener('click', () => {
      const open = panel.classList.toggle('open');
      trigger.classList.toggle('open', open);
      trigger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    panel.addEventListener('click', e => {
      if (e.target === panel || e.target.closest('a')) close();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

    // Add the Playbook directly to the homepage without disturbing the existing layout.
    const isHome = location.pathname === '/' || /\/index\.html$/.test(location.pathname);
    if (isHome && !document.getElementById('mcl-playbook-home')) {
      const anchor = document.querySelector('#murder-crow-learn') || document.querySelector('.final');
      if (anchor) {
        const section = document.createElement('section');
        section.id = 'mcl-playbook-home';
        section.className = 'section reveal';
        section.innerHTML = `
          <div class="wrap">
            <div class="section-head">
              <div>
                <div class="kicker">09 · THE PLAYBOOK</div>
                <h2>Keep the growth system with you.</h2>
              </div>
              <p>Our practical Growth Marketing Playbook explains how modern marketing works with AI, search, paid media, creative, analytics and CRM.</p>
            </div>
            <div style="display:grid;grid-template-columns:1.15fr .85fr;gap:15px">
              <article style="background:var(--ink);color:#fff;border-radius:28px;padding:32px;position:relative;overflow:hidden">
                <div class="kicker" style="color:var(--olive-bright)">GROWTH MARKETING PLAYBOOK</div>
                <h3 style="font:800 clamp(34px,5vw,58px)/.96 Manrope;letter-spacing:-.06em;margin:12px 0">How growth marketing actually works.</h3>
                <p style="color:#d4d8cf;max-width:650px">A practical reference for SEO, AEO, GEO, paid media, social, funnels, CRM, automation, AI tools and real-world growth thinking.</p>
                <div style="font:800 44px Manrope;color:var(--olive-bright);margin:20px 0 4px">₹1,399</div>
                <div style="font:700 10px 'Space Mono';letter-spacing:.12em;color:#aeb4a9">FREE WITH THE #LABS PROGRAMME</div>
              </article>
              <article style="background:var(--olive-bright);border:1px solid var(--ink);border-radius:28px;padding:32px;display:flex;flex-direction:column;justify-content:space-between">
                <div>
                  <div class="kicker" style="color:var(--ink)">BUILD · TEST · UNDERSTAND</div>
                  <h3 style="font:800 30px Manrope;letter-spacing:-.05em;margin:12px 0">Not another collection of hacks.</h3>
                  <p style="color:#30350f">Understand the decisions behind modern marketing — then use the Playbook while you build.</p>
                </div>
                <a href="/playbook.html" style="display:inline-flex;align-items:center;justify-content:center;margin-top:22px;padding:14px 18px;border-radius:999px;background:var(--ink);color:#fff;font-weight:900">View Playbook →</a>
              </article>
            </div>
          </div>`;
        anchor.parentNode.insertBefore(section, anchor);
      }
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();