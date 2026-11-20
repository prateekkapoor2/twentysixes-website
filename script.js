const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');
if (menu && nav) {
  const closeMobileMenu = () => {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
  };

  menu.addEventListener('click', event => {
    event.stopPropagation();
    const isOpen = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(isOpen));
    menu.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close when the visitor taps anywhere outside the expanded navigation.
  document.addEventListener('pointerdown', event => {
    if (!nav.classList.contains('open')) return;
    if (nav.contains(event.target) || menu.contains(event.target)) return;
    closeMobileMenu();
  });

  // Scrolling should dismiss the mobile menu immediately, including touch scrolling.
  window.addEventListener('scroll', () => {
    if (nav.classList.contains('open')) closeMobileMenu();
  }, { passive: true });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) closeMobileMenu();
  });
}

// Keep the URL hash in sync with the section currently in view.
// Navigation clicks still scroll to their anchors; as the visitor continues
// scrolling, the hash follows the active section without adding history entries.
(() => {
  const sectionIds = ['home', 'studio', 'services', 'work', 'approach', 'contact'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  if (!sections.length) return;
  let frame = 0;
  const syncSectionHash = () => {
    frame = 0;
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
  window.addEventListener('load', scheduleHashSync);
  scheduleHashSync();
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
  strategy: {
    number:'01', kicker:'THE THINKING BEHIND THE WORK', title:'Content strategy <em>&amp; creative.</em>',
    intro:'A useful content plan starts with a clear reason to exist. We connect the audience, the business objective and the platform — then turn that thinking into ideas a team can actually make.',
    deliverables:['Audience and channel research','Content pillars and editorial direction','Campaign concepts and creative territories','Scripts, calendars and briefs'],
    steps:['Understand the brief','Find the angle','Shape the formats','Build the plan'],
    artLabel:'FROM SIGNAL TO STORY', artFoot:'Audience signal → editorial angle → usable plan.', visual:'<div class="visual-strategy"><div class="vs-top"><span>AUDIENCE SIGNAL</span><b>01</b></div><div class="vs-signal"><i></i><i></i><i></i><i></i><i></i></div><div class="vs-arrow">↓</div><div class="vs-story"><small>EDITORIAL ANGLE</small><strong>One clear<br>point of view.</strong></div><div class="vs-tags"><span>FORMAT</span><span>HOOK</span><span>CALENDAR</span></div></div>'
  },
  founder: {
    number:'02', kicker:'MAKE EXPERTISE VISIBLE', title:'Founder &amp; executive <em>content.</em>',
    intro:'The strongest founder content sounds like the person behind the business — not a corporate brochure. We help turn experience, opinions and expertise into a consistent editorial voice.',
    deliverables:['Positioning and personal narrative','Thought-leadership themes','Short-form scripts and post concepts','Editorial calendar and repurposing plan'],
    steps:['Find the voice','Choose the themes','Create the stories','Publish and refine'],
    artLabel:'A HUMAN POINT OF VIEW', artFoot:'Experience → point of view → a recognisable voice.', visual:'<div class="visual-founder"><div class="vf-card"><small>FOUNDER / FIELD NOTES</small><div class="vf-avatar">P</div><strong>What I believe<br>and why it matters.</strong><span>VOICE · EXPERTISE · EXPERIENCE</span></div><div class="vf-quote">“The insight only you can own.”</div><div class="vf-orbit"></div></div>'
  },
  'white-label': {
    number:'03', kicker:'EXTRA CAPACITY. YOUR CLIENT RELATIONSHIP.', title:'White-label content <em>execution.</em>',
    intro:'An adaptable creative partner behind the scenes. We support agencies with research, ideas and content production tasks that help their teams deliver more — while the agency remains front of house.',
    deliverables:['Research and content planning','Concepts, hooks and scripting','Creative development and asset coordination','Platform-ready copy and content packs'],
    steps:['Align on the brief','Work to your process','Create and coordinate','Hand over cleanly'],
    artLabel:'BUILT TO FIT YOUR TEAM', artFoot:'Brief in. Coordinated creative. Clean handover.', visual:'<div class="visual-whitelabel"><div class="vw-node vw-agency"><small>YOUR AGENCY</small><b>Client brief</b></div><div class="vw-link">↓</div><div class="vw-node vw-studio"><small>STUDIO SUPPORT</small><b>Research · Scripts<br>Creative · Assets</b></div><div class="vw-link">↓</div><div class="vw-node vw-output"><small>BACK TO YOUR TEAM</small><b>Ready to present<br>and publish</b></div></div>'
  },
  campaigns: {
    number:'04', kicker:'IDEAS PEOPLE WANT TO SPEND TIME WITH', title:'Brand campaigns &amp; <em>creator-led ideas.</em>',
    intro:'A campaign needs more than a placement. We develop the central idea, the story and the creative shape — then help coordinate the right collaborators and content around it.',
    deliverables:['Campaign territories and creative concepts','Branded entertainment ideas','Creator research and shortlist development','Briefs, content direction and coordination'],
    steps:['Define the audience','Land the idea','Select collaborators','Coordinate delivery'],
    artLabel:'MAKE THE BRAND PART OF THE STORY', artFoot:'Audience tension → campaign idea → creator fit.', visual:'<div class="visual-campaign"><div class="vc-poster"><small>CAMPAIGN TERRITORY / 01</small><strong>MAKE IT<br>WORTH<br>SHARING<span>.</span></strong><i>BRAND × CULTURE</i></div><div class="vc-orbit vc-one">AUDIENCE</div><div class="vc-orbit vc-two">CREATOR</div></div>'
  },
  ip: {
    number:'05', kicker:'BUILD SOMETHING WITH A LIFE OF ITS OWN', title:'Original formats &amp; <em>media IP.</em>',
    intro:'We create and develop distinctive content properties — from repeatable editorial formats to music-led concepts — with a recognisable voice, a clear audience and room to grow.',
    deliverables:['Format and property development','Editorial identity and recurring concepts','Original scripts, music-led ideas and content','Publishing and audience-learning frameworks'],
    steps:['Spot the territory','Design the format','Make the pilot','Publish and evolve'],
    artLabel:'AN IDEA THAT CAN TRAVEL', artFoot:'A repeatable format. A returning audience. Room to grow.', visual:'<div class="visual-ip"><div class="vi-header"><small>ORIGINAL FORMAT / SERIES 01</small><b>REPEATABLE BY DESIGN</b></div><div class="vi-episodes"><div><small>EP. 01</small><b>THE IDEA</b></div><div><small>EP. 02</small><b>THE RETURN</b></div><div><small>EP. 03</small><b>THE TWIST</b></div></div><div class="vi-footer">FORMAT → IDENTITY → IP</div></div>'
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
