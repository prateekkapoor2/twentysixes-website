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
  position: {
    number:'01', kicker:'GET CLEAR ON WHAT MAKES YOU DIFFERENT', title:'Brand Positioning <em>Sprint.</em>',
    intro:'We look at your business, your customers and the alternatives they could choose. Then we define what makes you different, who you are best placed to serve and the clearest reason customers should choose you.',
    deliverables:['A review of your business and current messaging','A clear view of your priority audience','Your strengths and points of difference','A simple positioning statement','Core messages for your website and sales conversations'],
    steps:['Understand the business','Look at the customer and market','Find the clearest point of difference','Agree the position and key messages'],
    artLabel:'CLARITY BEFORE COMMUNICATION', artFoot:'Know what makes you different — and how to say it.', visual:'<div class="visual-strategy"><div class="vs-top"><span>THE BUSINESS</span><b>01</b></div><div class="vs-signal"><i></i><i></i><i></i><i></i><i></i></div><div class="vs-arrow">↓</div><div class="vs-story"><small>ONE CLEAR MESSAGE</small><strong>Why should<br>customers<br>choose you?</strong></div><div class="vs-tags"><span>AUDIENCE</span><span>VALUE</span><span>POSITION</span></div></div>'
  },
  identity: {
    number:'02', kicker:'MAKE YOUR BRAND CLEAR AND CONSISTENT', title:'Brand Messaging <em>&amp; Identity.</em>',
    intro:'Once your position is clear, we shape the words and visual direction that bring it to life. We define your brand story, the way it speaks and the way it looks, so customers get a consistent impression wherever they meet you.',
    deliverables:['A clear brand story and value proposition','A messaging framework and brand voice','Key messages for your website and sales materials','Visual direction for the brand','Practical brand guidelines for consistent use'],
    steps:['Start with the agreed brand position','Shape the story and key messages','Set the visual direction','Bring the elements together in a usable brand guide'],
    artLabel:'MAKE THE BRAND RECOGNISABLE', artFoot:'One clear story, expressed consistently.', visual:'<div class="visual-strategy"><div class="vs-top"><span>THE BRAND</span><b>02</b></div><div class="vs-signal"><i></i><i></i><i></i><i></i><i></i></div><div class="vs-arrow">↓</div><div class="vs-story"><small>ONE CONSISTENT IDENTITY</small><strong>How should your<br>brand look,<br>sound and<br>communicate?</strong></div><div class="vs-tags"><span>STORY</span><span>VOICE</span><span>IDENTITY</span></div></div>'
  },
  visibility: {
    number:'03', kicker:'MAKE YOUR EXPERTISE EASIER TO FIND', title:'Visibility &amp; Authority <em>Programme.</em>',
    intro:'We turn your experience and ideas into useful content that reaches the people you want to work with. This can include founder and executive communication, expert insights and a clear plan for where and how to share them — so people can discover your business and build trust in it.',
    deliverables:['A clear content and visibility plan','Topics based on your customers’ questions','Founder or expert-led content','Writing, design and short-form video as agreed','A publishing and distribution plan','Regular review of audience response'],
    steps:['Choose the audience and message','Plan useful themes and formats','Create and publish the work','Review response and improve'],
    artLabel:'TURN KNOWLEDGE INTO TRUST', artFoot:'Useful ideas, shared consistently with the right people.', visual:'<div class="visual-founder"><div class="vf-card"><small>WHAT YOU KNOW</small><strong>How will<br>people<br>discover<br>and trust you?</strong><span>CONTENT · VOICE · TRUST</span></div><div class="vf-quote">“Make your expertise visible.”</div><div class="vf-orbit"></div></div>'
  },
  growth: {
    number:'04', kicker:'GIVE IMPORTANT BUSINESS MOMENTS A PLAN', title:'Launch &amp; Growth <em>Programme.</em>',
    intro:'We start with the business goal, then plan the message, audience and activity needed to move it forward. Whether you are launching a product, entering a market or looking to grow, we bring the right strategy and creative work together and review what is working.',
    deliverables:['Launch or growth objective and audience','Core campaign message and creative direction','Content and campaign assets as agreed','Channel and distribution plan','A clear timeline, responsibilities and measures'],
    steps:['Agree the goal and audience','Shape the message and campaign idea','Create the content and assets','Launch, review and adjust'],
    artLabel:'GROWTH WITH A CLEAR PLAN', artFoot:'The right message, for the right people, at the right time.', visual:'<div class="visual-campaign"><div class="vc-poster"><small>CAMPAIGN PLAN</small><strong>How do you<br>grow and<br>scale<span>?</span></strong><i>PLAN × CREATE × REACH</i></div><div class="vc-orbit vc-one">AUDIENCE</div><div class="vc-orbit vc-two">ACTION</div></div>'
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
