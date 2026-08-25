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
        <a class="mc-menu-item" href="/about.html">About Murder Crow</a>
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

    // Homepage only: replace the existing empty banner slot with the Playbook block.
    // Nothing above it is touched, so the existing hero, crow animation, timer and reserve CTA stay intact.
    const isHome = location.pathname === '/' || /\/index\.html$/.test(location.pathname);
    if (isHome && !document.getElementById('mcl-playbook-home')) {
      const section = document.createElement('section');
      section.id = 'mcl-playbook-home';
      section.className = 'mcl-playbook-home';
      section.innerHTML = `
        <div class="mcl-playbook-grid">
          <div class="mcl-playbook-poster" aria-label="Growth Marketing Playbook cover placeholder">
            <div class="mcl-playbook-poster-label">YOUR PLAYBOOK COVER</div>
          </div>
          <article class="mcl-playbook-offer">
            <div>
              <div class="mcl-playbook-kicker">09 · MURDER CROW #LABS · PLAYBOOK</div>
              <h2>The Growth<br>Marketing Playbook.</h2>
              <p>Digital marketing, SEO · AEO · GEO, social media, ads, AI tools, funnels and growth — explained in one practical playbook.</p>
              <div class="mcl-playbook-price">₹1,399</div>
              <div class="mcl-playbook-free">FREE WITH #LABS · ₹1,399 VALUE</div>
            </div>
            <a class="mcl-playbook-cta" href="/playbook.html">Get the Playbook →</a>
          </article>
        </div>`;

      // The screenshot's large blank region is the old banner slot. Replace that slot,
      // rather than adding another section and creating more empty vertical space.
      const banner = document.querySelector('.banner');
      const anchor = document.querySelector('#murder-crow-learn');
      if (banner) {
        banner.replaceWith(section);
      } else if (anchor) {
        anchor.parentNode.insertBefore(section, anchor);
      }
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();

/* Homepage Playbook styling is kept here so it can be added without touching the existing design system. */
(() => {
  if (document.getElementById('mcl-playbook-style')) return;
  const style = document.createElement('style');
  style.id = 'mcl-playbook-style';
  style.textContent = `
    #mcl-playbook-home{width:min(1180px,calc(100% - 36px));margin:0 auto 70px;border-top:1px solid var(--line);padding:56px 0 0}
    .mcl-playbook-grid{display:grid;grid-template-columns:1fr 1fr;gap:15px;align-items:stretch}
    .mcl-playbook-poster{min-height:430px;border:1px dashed #b8b8ae;border-radius:28px;background:rgba(255,254,250,.7);display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative}
    .mcl-playbook-poster:before{content:"";position:absolute;width:68%;height:78%;border-radius:8px;background:#11120f;transform:rotate(-4deg);opacity:.035}
    .mcl-playbook-poster-label{font:700 10px "Space Mono";letter-spacing:.16em;color:#9a9c92;position:relative}
    .mcl-playbook-offer{min-height:430px;border:1px solid var(--line);border-radius:28px;background:var(--paper2);padding:38px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:var(--shadow)}
    .mcl-playbook-kicker{font:700 10px "Space Mono";letter-spacing:.16em;text-transform:uppercase;color:var(--olive)}
    .mcl-playbook-offer h2{font:800 clamp(38px,5vw,64px)/.94 Manrope;letter-spacing:-.065em;margin:15px 0}
    .mcl-playbook-offer p{max-width:540px;color:var(--muted);font-size:16px}
    .mcl-playbook-price{font:800 clamp(44px,6vw,72px)/1 Manrope;letter-spacing:-.07em;color:var(--olive);margin-top:24px}
    .mcl-playbook-free{font:700 10px "Space Mono";letter-spacing:.13em;color:var(--olive);margin-top:6px}
    .mcl-playbook-cta{display:inline-flex;align-items:center;justify-content:center;margin-top:28px;padding:16px 22px;border-radius:999px;background:var(--olive-bright);color:var(--ink);font-weight:900;box-shadow:6px 6px 0 var(--olive);width:100%}
    @media(max-width:700px){
      #mcl-playbook-home{width:calc(100% - 36px);padding-top:34px;margin-bottom:48px}
      .mcl-playbook-grid{grid-template-columns:1fr;gap:12px}
      .mcl-playbook-poster,.mcl-playbook-offer{min-height:330px}
      .mcl-playbook-offer{padding:28px}
    }
  `;
  document.head.appendChild(style);
})();
