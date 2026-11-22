// Mobile navigation: close reliably on outside interaction and any touch/scroll gesture.
(() => {
  const menu = document.querySelector('.site-header .menu');
  const nav = document.querySelector('.site-header nav');
  if (!menu || !nav) return;

  const isMobileMenu = () => window.matchMedia('(max-width: 850px)').matches;
  const closeMobileMenu = () => {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
  };
  const openMobileMenu = () => {
    nav.classList.add('open');
    menu.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-label', 'Close navigation');
  };

  menu.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    if (nav.classList.contains('open')) closeMobileMenu();
    else openMobileMenu();
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Capture phase is intentional: dismissal must run before other page handlers.
  const outsideInteraction = event => {
    if (!isMobileMenu() || !nav.classList.contains('open')) return;
    const target = event.target;
    if (menu === target || menu.contains(target) || nav === target || nav.contains(target)) return;
    closeMobileMenu();
  };
  document.addEventListener('pointerdown', outsideInteraction, true);
  document.addEventListener('touchstart', outsideInteraction, { capture: true, passive: true });
  document.addEventListener('click', outsideInteraction, true);

  // iOS Safari can deliver touch movement before a conventional scroll event.
  const dismissOnMovement = () => {
    if (isMobileMenu() && nav.classList.contains('open')) closeMobileMenu();
  };
  window.addEventListener('scroll', dismissOnMovement, { passive: true, capture: true });
  document.addEventListener('touchmove', dismissOnMovement, { passive: true, capture: true });
  document.addEventListener('wheel', dismissOnMovement, { passive: true, capture: true });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMobileMenu();
  });
  window.addEventListener('resize', () => {
    if (!isMobileMenu()) closeMobileMenu();
  });
})();

// Keep the URL hash in sync with the section currently in view.
// Navigation clicks still scroll to their anchors; as the visitor continues
// scrolling, the hash follows the active section without adding history entries.
(() => {
  const sectionIds = ['home', 'studio', 'services', 'work', 'approach', 'contact'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  if (!sections.length) return;
  let frame = 0;
  // A page opened with an incoming section hash (for example from /founder)
  // must first land on that section. Do not let the scroll/hash synchronizer
  // replace the requested hash with the homepage hero while the new document
  // is still at scroll position zero.
  const initialHashId = decodeURIComponent(window.location.hash.slice(1));
  const initialHashTarget = initialHashId ? document.getElementById(initialHashId) : null;
  let initialHashPending = Boolean(initialHashTarget);

  const syncSectionHash = () => {
    frame = 0;
    if (initialHashPending) return;
    const marker = Math.min(window.innerHeight * 0.38, 300);
    let active = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= marker) active = section;
      else break;
    }
    // The homepage uses the clean root URL. Only interior sections get hashes.
    // replaceState keeps scroll tracking from filling the browser history.
    const nextUrl = active.id === 'home'
      ? `${window.location.pathname}${window.location.search}`
      : `${window.location.pathname}${window.location.search}#${active.id}`;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (currentUrl !== nextUrl) {
      window.history.replaceState(null, '', nextUrl);
    }
  };
  const scheduleHashSync = () => {
    if (!frame) frame = window.requestAnimationFrame(syncSectionHash);
  };
  window.addEventListener('scroll', scheduleHashSync, { passive: true });
  window.addEventListener('resize', scheduleHashSync);
  window.addEventListener('load', () => {
    if (initialHashPending && initialHashTarget) {
      // Explicitly honour the incoming fragment on both hosted URLs and
      // local file previews, then resume normal active-section hash tracking.
      window.scrollTo({ top: initialHashTarget.getBoundingClientRect().top + window.scrollY, behavior: 'instant' });
      initialHashPending = false;
    }
    scheduleHashSync();
  }, { once: true });
  if (!initialHashPending) scheduleHashSync();
})();

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Direct website enquiries are delivered by Formspree.
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xgakzgqq';
const form = document.getElementById('enquiry-form');
if (form) form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const status = document.getElementById('form-status');
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = 'Sending…';
  status.textContent = 'Sending your enquiry…';
  try {
    const response = await fetch(FORMSPREE_ENDPOINT, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } });
    if (!response.ok) throw new Error('Submission failed');
    form.reset();
    status.textContent = 'Thank you. Your enquiry has been received. We will be in touch shortly.';
  } catch (error) {
    status.textContent = 'We could not send your enquiry just now. Please email hello@twentysixes.com directly.';
  } finally {
    button.disabled = false;
    button.textContent = 'Send enquiry ↗︎';
  }
});

// Service overlays: concise, practical descriptions rather than generic agency copy.
const serviceDetails = {
  founder: {
    number:'01', kicker:'TURN EXPERTISE INTO BUYER CONFIDENCE', title:'Founder &amp; Executive <em>GTM Engines.</em>',
    intro:'Turn a focused monthly founder session into a consistent stream of buyer-focused ideas, executive thought leadership and sales-enablement content.',
    deliverables:['Founder positioning and buyer narrative','LinkedIn thought-leadership programme','Short-form executive video scripts','Sales-enablement content and repurposing'],
    steps:['Capture the expertise','Shape buyer-relevant themes','Create the content system','Publish and learn'],
    artLabel:'ONE SESSION. A MONTH OF SIGNAL.', artFoot:'Founder insight → buyer relevance → market presence.', visual:'<div class="visual-founder"><div class="vf-card"><small>FOUNDER / GTM FIELD NOTES</small><div class="vf-avatar">60</div><strong>One hour.<br>Useful ideas.</strong><span>VOICE · TRUST · PIPELINE</span></div><div class="vf-quote">“Make expertise visible.”</div><div class="vf-orbit"></div></div>'
  },
  ip: {
    number:'02', kicker:'BUILD DISTINCTIVE BRAND ASSETS', title:'Original Formats &amp; <em>Branded IP.</em>',
    intro:'Develop repeatable video series, musical hooks and cultural storytelling that interrupt the feed, create recognition and give audiences a reason to return.',
    deliverables:['Original format and series concepts','Branded video IP and recurring story worlds','Musical hooks and cultural storytelling','Pilot scripts and repeatable production formats'],
    steps:['Find the cultural tension','Design the format','Create the pilot','Build for repeatability'],
    artLabel:'MAKE THE BRAND RECOGNISABLE', artFoot:'A strong format. A distinct voice. A reason to return.', visual:'<div class="visual-ip"><div class="vi-header"><small>BRANDED FORMAT / SERIES 01</small><b>REPEATABLE BY DESIGN</b></div><div class="vi-episodes"><div><small>EP. 01</small><b>THE HOOK</b></div><div><small>EP. 02</small><b>THE RETURN</b></div><div><small>EP. 03</small><b>THE TWIST</b></div></div><div class="vi-footer">FORMAT → RECALL → IP</div></div>'
  },
  campaigns: {
    number:'03', kicker:'CREATIVE BUILT FOR THE FEED', title:'High-Retention Campaign <em>&amp; Ad Creative.</em>',
    intro:'Performance-minded video concepts and scripts designed around attention, message clarity and the behaviours of modern social and paid platforms.',
    deliverables:['Campaign and ad creative territories','Short-form video concepts and scripts','Hooks, storyboards and creative variations','Rapid creative testing recommendations'],
    steps:['Define the action','Develop the hooks','Create variations','Test and refine'],
    artLabel:'EARN THE NEXT SECOND', artFoot:'Hook → hold attention → make the message land.', visual:'<div class="visual-campaign"><div class="vc-poster"><small>CREATIVE TEST / 01</small><strong>STOP<br>THE<br>SCROLL<span>.</span></strong><i>HOOK × HOLD × ACT</i></div><div class="vc-orbit vc-one">ATTENTION</div><div class="vc-orbit vc-two">ACTION</div></div>'
  },
  strategy: {
    number:'04', kicker:'THE SYSTEM BEFORE THE SHOOT', title:'Content Strategy <em>&amp; Positioning.</em>',
    intro:'Build the audience understanding, narrative architecture and commercial content system before a single frame is shot.',
    deliverables:['Audience and category research','Positioning and narrative architecture','Content pillars and channel roles','Commercial content roadmap and briefs'],
    steps:['Understand the market','Define the point of view','Build the content system','Brief the execution'],
    artLabel:'STRATEGY BEFORE PRODUCTION', artFoot:'Audience signal → narrative → commercial content system.', visual:'<div class="visual-strategy"><div class="vs-top"><span>AUDIENCE SIGNAL</span><b>01</b></div><div class="vs-signal"><i></i><i></i><i></i><i></i><i></i></div><div class="vs-arrow">↓</div><div class="vs-story"><small>NARRATIVE ARCHITECTURE</small><strong>One clear<br>point of view.</strong></div><div class="vs-tags"><span>POSITIONING</span><span>CONTENT</span><span>GTM</span></div></div>'
  }
};
const dialog = document.getElementById('service-dialog');
const panel = dialog?.querySelector('.service-dialog-panel');
let lastTrigger = null;
function closeServiceDialog(){
  if (!dialog || !dialog.classList.contains('is-open')) return;
  dialog.classList.remove('is-open');
  dialog.setAttribute('aria-hidden','true');
  document.body.classList.remove('dialog-open');
  if (lastTrigger) lastTrigger.focus();
}
function openServiceDialog(key, trigger){
  const data = serviceDetails[key];
  if (!data || !dialog) return;
  lastTrigger = trigger;
  document.getElementById('dialog-kicker').textContent = `${data.number} / ${data.kicker}`;
  document.getElementById('dialog-title').innerHTML = data.title;
  document.getElementById('dialog-intro').textContent = data.intro;
  document.getElementById('dialog-deliverables').innerHTML = data.deliverables.map(item => `<li>${item}</li>`).join('');
  document.getElementById('dialog-steps').innerHTML = data.steps.map((item,index) => `<div><small>0${index+1}</small><b>${item}</b></div>`).join('');
  const art = dialog.querySelector('.dialog-art');
  art.className = `dialog-art art-${key}`;
  document.getElementById('art-index').textContent = data.number;
  document.getElementById('art-label').textContent = data.artLabel;
  document.getElementById('art-foot').textContent = data.artFoot;
  document.getElementById('art-composition').innerHTML = data.visual;
  dialog.classList.add('is-open');
  dialog.setAttribute('aria-hidden','false');
  document.body.classList.add('dialog-open');
  panel?.focus();
}
document.querySelectorAll('.service-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => openServiceDialog(trigger.dataset.service, trigger));
  trigger.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openServiceDialog(trigger.dataset.service, trigger); }
  });
});
dialog?.querySelectorAll('[data-close-dialog], .dialog-close').forEach(control => control.addEventListener('click', closeServiceDialog));
dialog?.addEventListener('click', event => { if (event.target.matches('.dialog-cta')) closeServiceDialog(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeServiceDialog();
  if (event.key === 'Tab' && dialog?.classList.contains('is-open')) {
    const focusables = [...dialog.querySelectorAll('a[href],button:not([disabled])')];
    if (!focusables.length) return;
    const first = focusables[0], last = focusables[focusables.length-1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});


// Accessible floating back-to-top control. It only appears after the hero and
// yields whenever its footprint would cover meaningful text or imagery.
const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
  const meaningfulContent = 'p, h1, h2, h3, h4, img, svg, video, canvas, picture, figure, blockquote, .hero-art, .sensex-card, .cricdoosra-card, .service-trigger, .dialog-art, .approach-grid, .principles, .contact-form-wrap, .contact-details';
  let checkFrame = 0;
  const updateBackToTop = () => {
    const pastHero = window.scrollY > Math.max(360, window.innerHeight * 0.65);
    const overlayOpen = document.body.classList.contains('dialog-open');
    const menuOpen = document.querySelector('.site-header nav.open');
    backToTop.classList.remove('is-visible');
    if (!pastHero || overlayOpen || menuOpen) return;

    // Temporarily make the invisible control hit-testable. Without this,
    // elementFromPoint sees the page behind it and falsely reports a collision
    // on every scroll, so the control never appears.
    const oldVisibility = backToTop.style.visibility;
    const oldPointerEvents = backToTop.style.pointerEvents;
    backToTop.style.visibility = 'visible';
    backToTop.style.pointerEvents = 'none';
    const rect = backToTop.getBoundingClientRect();
    const inset = 5;
    const samples = [
      [rect.left + inset, rect.top + inset],
      [rect.right - inset, rect.top + inset],
      [rect.left + inset, rect.bottom - inset],
      [rect.right - inset, rect.bottom - inset],
      [rect.left + rect.width / 2, rect.top + rect.height / 2]
    ];
    const overlapsContent = samples.some(([x, y]) => {
      const stack = document.elementsFromPoint(x, y);
      return stack.some(el => el !== backToTop && !backToTop.contains(el) && el.matches(meaningfulContent));
    });
    backToTop.style.visibility = oldVisibility;
    backToTop.style.pointerEvents = oldPointerEvents;
    if (!overlapsContent) backToTop.classList.add('is-visible');
  };
  const scheduleUpdate = () => {
    if (checkFrame) cancelAnimationFrame(checkFrame);
    checkFrame = requestAnimationFrame(updateBackToTop);
  };
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('load', scheduleUpdate);
  const observer = new MutationObserver(scheduleUpdate);
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  document.querySelector('.menu')?.addEventListener('click', scheduleUpdate);
  scheduleUpdate();
}
