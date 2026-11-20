const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');
if (menu && nav) {
  menu.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(isOpen));
    menu.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
  }));
}
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

/* Service details: concise editorial explanations, deliverables and process. */
const serviceDetails = {
  strategy: {
    number: '01 / CONTENT STRATEGY & CREATIVE',
    title: 'Find the story. <em>Give it direction.</em>',
    lead: 'Good content starts before the camera, the caption or the calendar. We help turn a business objective into a clear point of view, a useful creative idea and a plan people can actually make.',
    caption: 'THE IDEA BEFORE THE OUTPUT',
    art: 'strategy',
    mark: '01',
    deliverables: ['Audience, category and format research', 'Positioning, content pillars and editorial direction', 'Creative concepts, scripts and campaign territories', 'Practical content calendars and briefs'],
    process: ['Understand the business objective and audience.', 'Find the strongest story and the right format.', 'Turn the direction into a usable creative plan.']
  },
  founder: {
    number: '02 / FOUNDER & EXECUTIVE CONTENT',
    title: 'Make expertise <em>visible.</em>',
    lead: 'The strongest founder content does not sound like a press release. We shape the ideas, experiences and opinions a leader can credibly own—and build a repeatable way to share them.',
    caption: 'A DISTINCT VOICE, CONSISTENTLY',
    art: 'founder',
    mark: 'VO',
    deliverables: ['Founder positioning and voice development', 'Thought-leadership themes and editorial planning', 'Short-form video concepts, hooks and scripts', 'Repurposing plans across relevant channels'],
    process: ['Map expertise, lived experience and business priorities.', 'Build a set of recognisable themes and formats.', 'Plan, script and refine a sustainable publishing rhythm.']
  },
  whitelabel: {
    number: '03 / WHITE-LABEL CONTENT EXECUTION',
    title: 'Your client relationship. <em>Our creative support.</em>',
    lead: 'When an agency needs more thinking or making capacity, we can work behind the scenes as an extension of its team. Clear briefs, agreed workflows and delivery that fits your standards.',
    caption: 'BUILT TO FIT YOUR WORKFLOW',
    art: 'whitelabel',
    mark: 'W/L',
    deliverables: ['Research, references and content angles', 'Scripts, captions, concepts and creative decks', 'Content calendars and production coordination', 'Platform-ready copy and asset handover'],
    process: ['Align on your brief, brand voice and delivery process.', 'Agree scope, owners, deadlines and review rounds.', 'Deliver in your workflow, with your team in control.']
  },
  campaigns: {
    number: '04 / BRAND CAMPAIGNS & CREATOR-LED IDEAS',
    title: 'Make the message <em>mean something.</em>',
    lead: 'A campaign needs more than a placement. We develop audience-first creative territories and branded entertainment ideas that give a message a reason to be noticed, remembered and shared.',
    caption: 'A BIG IDEA, MADE RELEVANT',
    art: 'campaigns',
    mark: '04',
    deliverables: ['Campaign territories and creative concepts', 'Branded entertainment and content formats', 'Creator-fit thinking and collaboration briefs', 'Creative coordination and content rollout planning'],
    process: ['Define the audience, message and desired response.', 'Shape a concept that belongs in the audience’s world.', 'Plan the content, collaborators and execution scope.']
  },
  ip: {
    number: '05 / ORIGINAL FORMATS & MEDIA IP',
    title: 'Create something <em>people come back to.</em>',
    lead: 'We develop original editorial and entertainment formats with their own identity, repeatable structure and audience promise. Our owned properties keep this work grounded in the realities of publishing.',
    caption: 'FORMATS WITH A POINT OF VIEW',
    art: 'ip',
    mark: 'IP',
    deliverables: ['Format concepts, names and editorial architecture', 'Recurring segments, scripts and visual language', 'Music-led and culture-led content ideas', 'Publishing plans and format development'],
    process: ['Start with a clear audience tension or curiosity.', 'Build a repeatable format with a recognisable point of view.', 'Pilot, publish, learn and evolve the property.']
  }
};
const dialog = document.getElementById('service-dialog');
if (dialog) {
  const title = document.getElementById('dialog-title');
  const number = document.getElementById('dialog-number');
  const lead = document.getElementById('dialog-lead');
  const deliverables = document.getElementById('dialog-deliverables');
  const process = document.getElementById('dialog-process');
  const art = document.getElementById('dialog-art');
  const caption = document.getElementById('dialog-caption');
  const close = dialog.querySelector('.dialog-close');
  document.querySelectorAll('[data-service]').forEach(button => {
    button.addEventListener('click', () => {
      const item = serviceDetails[button.dataset.service];
      if (!item) return;
      number.textContent = item.number;
      title.innerHTML = item.title;
      lead.textContent = item.lead;
      caption.textContent = item.caption;
      art.dataset.art = item.art;
      art.querySelector('span').textContent = item.mark;
      deliverables.replaceChildren(...item.deliverables.map(text => {
        const li = document.createElement('li'); li.textContent = text; return li;
      }));
      process.replaceChildren(...item.process.map(text => {
        const li = document.createElement('li'); li.textContent = text; return li;
      }));
      dialog.showModal();
      close.focus();
    });
  });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.querySelector('.dialog-contact-link').addEventListener('click', () => dialog.close());
}

/* Formspree sends submissions directly to the configured hello@ inbox. */
const form = document.getElementById('enquiry-form');
if (form) {
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const status = document.getElementById('form-status');
    const submit = document.getElementById('form-submit');
    const data = new FormData(form);
    if (data.get('_gotcha')) return;
    submit.disabled = true;
    submit.textContent = 'Sending…';
    status.classList.remove('form-error', 'form-success');
    status.textContent = 'Sending your enquiry securely…';
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) {
        let detail = '';
        try { const result = await response.json(); detail = (result.errors || []).map(e => e.message).join(' '); } catch (_) {}
        throw new Error(detail || 'The form could not be sent. Please email hello@twentysixes.com directly.');
      }
      status.textContent = 'Thank you. Your enquiry has been sent. We’ll be in touch soon.';
      status.classList.add('form-success');
      form.reset();
    } catch (error) {
      status.textContent = error.message || 'Something went wrong. Please email hello@twentysixes.com directly.';
      status.classList.add('form-error');
    } finally {
      submit.disabled = false;
      submit.textContent = 'Send enquiry ↗';
    }
  });
}
