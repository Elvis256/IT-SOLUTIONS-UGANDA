// Main UI interactions: nav toggle, contact form (client-side)
document.addEventListener('DOMContentLoaded', () => {
  // year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Nav toggle for small screens
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primary-nav');
  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      primaryNav.dataset.open = String(!expanded);
    });
  }

  // Contact form handling
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = 'Sending…';
      const data = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone ? form.phone.value.trim() : '',
        location: form.location ? form.location.value.trim() : '',
        company: form.company.value.trim(),
        message: form.message.value.trim()
      };

      if (!data.name || !data.email || !data.message) {
        status.textContent = 'Please complete the required fields.';
        return;
      }

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(data)
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Network error');
        }
        const body = await res.json();
        status.textContent = body.message || 'Thank you — we will contact you soon.';
        form.reset();
      } catch (err) {
        console.error(err);
        status.textContent = 'There was an error sending your message. Please try again later or contact us directly.';
      }
    });
  }
});