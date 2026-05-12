/* =========================================================
   April Matcha Café - Shared JavaScript
   This file adds interactive behavior to all five pages.
   Comments explain what each block does and why it is used.
   ========================================================= */

/* Wait until the page HTML loads so JavaScript can safely find buttons and forms. */
document.addEventListener('DOMContentLoaded', () => {
  /* Mobile navigation toggle makes the site usable on small screens. */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  /* Back-to-top button appears after scrolling so visitors can return to navigation quickly. */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('show', window.scrollY > 450);
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* Accordions are used for FAQ/story sections and are keyboard-friendly because they are buttons. */
  document.querySelectorAll('.accordion-button').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.accordion-item');
      const expanded = button.getAttribute('aria-expanded') === 'true';
      item.classList.toggle('open', !expanded);
      button.setAttribute('aria-expanded', String(!expanded));
    });
  });

  /* Menu tabs let visitors switch between drinks, desserts, and experiences without leaving the page. */
  const tabButtons = document.querySelectorAll('[data-tab-target]');
  const tabPanels = document.querySelectorAll('[data-tab-panel]');

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.tabTarget;
      tabButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      tabPanels.forEach((panel) => {
        panel.hidden = panel.dataset.tabPanel !== target;
      });
    });
  });

  /* Gallery filters organize photos by mood and make the gallery more interactive. */
  const filterButtons = document.querySelectorAll('[data-filter]');
  const galleryItems = document.querySelectorAll('[data-category]');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      galleryItems.forEach((item) => {
        const shouldShow = filter === 'all' || item.dataset.category === filter;
        item.hidden = !shouldShow;
      });
    });
  });

  /* Daily special button changes a small message to create a playful café moment. */
  const specialButton = document.querySelector('#specialButton');
  const specialOutput = document.querySelector('#specialOutput');
  const specials = [
    'Today\'s cozy pick: Strawberry Cloud Matcha with oat milk.',
    'Today\'s study pick: Classic Iced Matcha Latte and mochi brownie.',
    'Today\'s calm pick: Hot ceremonial matcha with vanilla foam.'
  ];

  if (specialButton && specialOutput) {
    specialButton.addEventListener('click', () => {
      const randomSpecial = specials[Math.floor(Math.random() * specials.length)];
      specialOutput.textContent = randomSpecial;
    });
  }

  /* Contact form validation checks required fields, email format, and message length. */
  const contactForm = document.querySelector('#contactForm');

  if (contactForm) {
    const nameInput = document.querySelector('#name');
    const emailInput = document.querySelector('#email');
    const subjectInput = document.querySelector('#subject');
    const messageInput = document.querySelector('#message');
    const charCounter = document.querySelector('#charCounter');
    const errorSummary = document.querySelector('#errorSummary');
    const successCard = document.querySelector('#successCard');

    /* This helper writes field-specific inline errors beside the correct input. */
    const setError = (fieldId, message) => {
      const error = document.querySelector(`#${fieldId}Error`);
      const field = document.querySelector(`#${fieldId}`);
      if (error && field) {
        error.textContent = message;
        field.setAttribute('aria-invalid', message ? 'true' : 'false');
      }
    };

    /* This helper validates a normal email pattern before the form can succeed. */
    const isValidEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    /* Live character counter gives feedback while the visitor writes the message. */
    messageInput.addEventListener('input', () => {
      charCounter.textContent = `${messageInput.value.length}/40 minimum characters`;
    });

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      let errorCount = 0;

      /* Clear previous messages so the newest validation result is easy to understand. */
      ['name', 'email', 'subject', 'message'].forEach((field) => setError(field, ''));
      errorSummary.textContent = '';
      successCard.classList.remove('show');

      /* Required name check. */
      if (nameInput.value.trim().length < 2) {
        setError('name', 'Please enter your name.');
        errorCount += 1;
      }

      /* Email check uses both required and format rules. */
      if (!isValidEmail(emailInput.value.trim())) {
        setError('email', 'Please enter a valid email address.');
        errorCount += 1;
      }

      /* Subject is required so the café knows why the visitor is writing. */
      if (subjectInput.value.trim().length < 3) {
        setError('subject', 'Please enter a short subject.');
        errorCount += 1;
      }

      /* Message length check encourages a useful message instead of one word. */
      if (messageInput.value.trim().length < 40) {
        setError('message', 'Please write at least 40 characters.');
        errorCount += 1;
      }

      /* Error summary uses aria-live so screen reader users hear updates. */
      if (errorCount > 0) {
        errorSummary.textContent = `Please fix ${errorCount} field${errorCount > 1 ? 's' : ''} before sending.`;
        return;
      }

      /* Success state confirms the form is valid; Formspree action is ready once the real ID is added. */
      successCard.classList.add('show');
      successCard.focus();
      contactForm.reset();
      charCounter.textContent = '0/40 minimum characters';
    });
  }
});
