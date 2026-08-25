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
        section.className = 'section reveal mcl-playbook-home';
        section.innerHTML = `
          <div class="wrap">
            <div class="mcl-playbook-grid">
              <div class="mcl-playbook-poster" aria-label="Playbook poster space">
                <div class="mcl-playbook-poster-note">PLAYBOOK COVER</div>
              </div>
              <article class="mcl-playbook-offer">
                <div>
                  <div class="kicker">09 · THE PLAYBOOK</div>
                  <h2>Growth Marketing<br>Playbook.</h2>
                  <p>How digital marketing, SEO, AEO, GEO, social media, ads, AI tools, funnels and growth actually work.</p>
                  <div class="mcl-playbook-price">₹1,399</div>
                  <div class="mcl-playbook-free">FREE WITH YOUR #LABS COURSE</div>
                </div>
                <button class="btn btn-lime mcl-playbook-reserve" onclick="openReservation()">Reserve your seat →</button>
              </article>
            </div>
          </div>`;
        anchor.parentNode.insertBefore(section, anchor);
      }
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();