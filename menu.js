(() => {
  // Shared favicon: Murder Crow mark on every page that loads the shared menu script.
  if (!document.querySelector('link[rel="icon"]')) {
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/svg+xml';
    favicon.href = '/favicon.svg';
    document.head.appendChild(favicon);
  }

  const boot = () => {
    if (document.getElementById('mc-menu-trigger')) return;
    const nav = document.querySelector('.nav');
    if (!nav) return;

    nav.querySelector('.navcta, .btn')?.remove();

    const trigger = document.createElement('button');
    trigger.id = 'mc-menu-trigger';
    trigger.className = 'mc-menu-trigger';
    trigger.setAttribute('aria-label','Open menu');
    trigger.setAttribute('aria-expanded','false');
    trigger.innerHTML = '<b>Menu</b><i><span></span></i>';

    // Keep the shared header geometry consistent: logo on the left,
    // menu control on the right, both inside the same aligned wrapper.
    const headerWrap = nav.querySelector('.wrap');
    (headerWrap || nav).appendChild(trigger);

    // Every inner page uses the real Murder Crow logo asset, never a text substitute.
    const brand = nav.querySelector('.brand');
    if (brand) {
      brand.textContent = '';
      brand.setAttribute('aria-label', 'Murder Crow Labs');
      brand.style.backgroundImage = "url('/muder-crow-logo.jpg')";
      brand.style.backgroundRepeat = 'no-repeat';
      brand.style.backgroundPosition = 'left center';
      brand.style.backgroundSize = 'contain';
      brand.style.display = 'block';
      brand.style.flex = '0 0 auto';
    }

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

    // Homepage only: use the left half of the Playbook card as a clean reusable ad area.
    // The existing hero, crow animation, hook, timer and reserve CTA remain untouched.
    const isHome = location.pathname === '/' || /\/index\.html$/.test(location.pathname);
    const banner = document.querySelector('.banner');
    if (isHome && banner && !document.getElementById('mcl-playbook-home')) {
      banner.id = 'mcl-playbook-home';
      banner.classList.add('mcl-playbook-home');
      banner.innerHTML = `
        <div class="mcl-playbook-card">
          <div class="mcl-ad-slot" aria-label="Murder Crow advertising banner slot"></div>
          <article class="mcl-playbook-offer">
            <div class="mcl-playbook-kicker">09 · MURDER CROW #LABS · PLAYBOOK</div>
            <h2>The Growth<br>Marketing Playbook.</h2>
            <p>Digital marketing, SEO · AEO · GEO, social media, ads, AI tools, funnels and growth — explained in one practical playbook.</p>
            <div class="mcl-playbook-price">₹1,399</div>
            <div class="mcl-playbook-free">FREE WITH #LABS · ₹1,399 VALUE</div>
            <a class="mcl-playbook-cta" href="/playbook.html">Get the Playbook →</a>
          </article>
        </div>`;
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();

(() => {
  if (document.getElementById('mcl-playbook-style')) return;
  const style = document.createElement('style');
  style.id = 'mcl-playbook-style';
  style.textContent = `
    #mcl-playbook-home{width:min(1180px,calc(100% - 36px));margin:10px auto 70px;padding:0;min-height:0;border:1px solid var(--line);border-radius:30px;background:var(--paper2);overflow:hidden;display:block;box-shadow:var(--shadow)}
    .mcl-playbook-card{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);min-height:540px}
    .mcl-ad-slot{min-height:540px;background:var(--paper);position:relative;overflow:hidden}
    .mcl-ad-slot:after{content:"AD SPACE";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:700 10px "Space Mono";letter-spacing:.16em;color:rgba(120,125,108,.18);pointer-events:none}
    .mcl-playbook-offer{padding:44px 42px;display:flex;flex-direction:column;justify-content:center;min-width:0}
    .mcl-playbook-kicker{font:700 10px "Space Mono";letter-spacing:.16em;text-transform:uppercase;color:var(--olive)}
    .mcl-playbook-offer h2{font:800 clamp(38px,5vw,64px)/.94 Manrope;letter-spacing:-.065em;margin:15px 0}
    .mcl-playbook-offer p{max-width:540px;color:var(--muted);font-size:16px}
    .mcl-playbook-price{font:800 clamp(44px,6vw,72px)/1 Manrope;letter-spacing:-.07em;color:var(--olive);margin-top:24px}
    .mcl-playbook-free{font:700 10px "Space Mono";letter-spacing:.13em;color:var(--olive);margin-top:6px}
    .mcl-playbook-cta{display:inline-flex;align-items:center;justify-content:center;margin-top:28px;padding:16px 22px;border-radius:999px;background:var(--olive-bright);color:var(--ink);font-weight:900;box-shadow:6px 6px 0 var(--olive);width:100%}
    @media(max-width:700px){
      #mcl-playbook-home{width:calc(100% - 36px);margin:10px auto 48px}
      .mcl-playbook-card{grid-template-columns:1fr;min-height:0}
      .mcl-ad-slot{min-height:360px}
      .mcl-playbook-offer{padding:30px 28px 34px}
      .mcl-playbook-offer h2{font-size:48px}
    }
  `;
  document.head.appendChild(style);
})();