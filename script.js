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

const form = document.getElementById('enquiry-form');
if (form) form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const subject = `Twenty Sixes Media enquiry — ${data.get('enquiry')}`;
  const body = [
    `Name: ${data.get('name')}`,
    `Email: ${data.get('email')}`,
    `Company: ${data.get('company') || 'Not provided'}`,
    `Enquiry: ${data.get('enquiry')}`,
    '',
    'Project details:',
    data.get('message')
  ].join('\n');
  const mailto = `mailto:hello@twentysixes.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const status = document.getElementById('form-status');
  status.textContent = 'Your email app should open with the enquiry prepared. Please review and send it to complete the enquiry.';
  window.location.href = mailto;
});

// Add a Calendly booking link only after the founder supplies the real URL.
// Example: https://calendly.com/your-handle/intro-call
const CALENDLY_URL = '';
if (CALENDLY_URL && /^https:\/\/calendly\.com\//i.test(CALENDLY_URL)) {
  const contactDetails = document.querySelector('.contact-details');
  if (contactDetails) {
    const label = document.createElement('span');
    label.textContent = 'BOOK A CONVERSATION';
    const link = document.createElement('a');
    link.href = CALENDLY_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Schedule an intro call ↗';
    contactDetails.append(label, link);
  }
}
