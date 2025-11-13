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

  // Newsletter form
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterStatus = document.getElementById('newsletterStatus');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletterEmail').value.trim();
      
      try {
        const res = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        newsletterStatus.textContent = data.message;
        if (res.ok) {
          newsletterForm.reset();
        }
      } catch (err) {
        newsletterStatus.textContent = 'Failed to subscribe. Please try again later.';
      }
    });
  }

  // Load testimonials
  loadTestimonials();

  // Testimonial modal
  const addTestimonialBtn = document.getElementById('addTestimonialBtn');
  if (addTestimonialBtn) {
    addTestimonialBtn.addEventListener('click', () => showTestimonialModal());
  }
});

// Load testimonials
async function loadTestimonials() {
  const container = document.getElementById('testimonialsList');
  if (!container) return;

  try {
    const res = await fetch('/api/testimonials/featured');
    const testimonials = await res.json();
    
    if (testimonials.length === 0) {
      container.innerHTML = '<p class="muted">No testimonials yet. Be the first to share your experience!</p>';
      return;
    }

    container.innerHTML = testimonials.map(t => `
      <div class="testimonial-card">
        <div class="rating">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</div>
        <p>${t.testimonial}</p>
        <div class="name">${t.name}</div>
        <div class="position">${t.position || ''} ${t.company ? `at ${t.company}` : ''}</div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Failed to load testimonials:', err);
    container.innerHTML = '<p class="muted">Unable to load testimonials.</p>';
  }
}

// Show testimonial modal
function showTestimonialModal() {
  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="modal-close">&times;</span>
      <h2>Share Your Experience</h2>
      <form id="testimonialForm">
        <label>
          <span>Your Name *</span>
          <input type="text" name="name" required />
        </label>
        <label>
          <span>Company</span>
          <input type="text" name="company" />
        </label>
        <label>
          <span>Position</span>
          <input type="text" name="position" />
        </label>
        <label>
          <span>Rating *</span>
          <select name="rating" required>
            <option value="5">5 Stars - Excellent</option>
            <option value="4">4 Stars - Very Good</option>
            <option value="3">3 Stars - Good</option>
            <option value="2">2 Stars - Fair</option>
            <option value="1">1 Star - Poor</option>
          </select>
        </label>
        <label>
          <span>Your Testimonial *</span>
          <textarea name="testimonial" rows="4" required></textarea>
        </label>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Submit</button>
          <div id="testimonialStatus"></div>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('.modal-close').addEventListener('click', () => {
    modal.remove();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  const form = modal.querySelector('#testimonialForm');
  const status = modal.querySelector('#testimonialStatus');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
      });
      const result = await res.json();
      status.textContent = result.message;
      if (res.ok) {
        form.reset();
        setTimeout(() => modal.remove(), 2000);
      }
    } catch (err) {
      status.textContent = 'Failed to submit. Please try again.';
    }
  });
}

// Theme Switcher
const themeButtons = document.querySelectorAll('.theme-btn');
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'default';
body.setAttribute('data-theme', savedTheme);
updateActiveTheme(savedTheme);

themeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.dataset.theme;
    body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateActiveTheme(theme);
  });
});

function updateActiveTheme(theme) {
  themeButtons.forEach(btn => {
    if (btn.dataset.theme === theme) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Order Modal Functions
window.openOrderModal = function(productName) {
  const modal = document.getElementById('orderModal');
  const productInput = document.getElementById('orderProduct');
  const productDisplay = document.getElementById('orderProductDisplay');
  
  if (modal && productInput && productDisplay) {
    productInput.value = productName;
    productDisplay.value = productName;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

window.closeOrderModal = function() {
  const modal = document.getElementById('orderModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('orderForm').reset();
    document.getElementById('orderStatus').textContent = '';
  }
}

// Order Form Handler
const orderForm = document.getElementById('orderForm');
if (orderForm) {
  orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const statusEl = document.getElementById('orderStatus');
    statusEl.innerHTML = '<div class="status-message info">⏳ Generating your custom quote...</div>';
    
    const formData = new FormData(orderForm);
    const data = {
      // Personal Information
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      whatsapp: formData.get('whatsapp'),
      
      // Product Specifications
      category: formData.get('category'),
      brand: formData.get('brand'),
      processor: formData.get('processor'),
      ram: formData.get('ram'),
      storage: formData.get('storage'),
      screen: formData.get('screen'),
      graphics: formData.get('graphics'),
      os: formData.get('os'),
      
      // Additional Requirements
      quantity: formData.get('quantity'),
      usage: formData.get('usage'),
      budget: formData.get('budget'),
      location: formData.get('location'),
      notes: formData.get('notes'),
      
      // Delivery method
      delivery_method: formData.get('delivery_method'),
      
      orderDate: new Date().toISOString()
    };
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        const quotation = result.quotation;
        const totalPrice = quotation.totalPrice.toLocaleString();
        
        let message = `<div class="status-message success">
          ✓ Quote Generated Successfully! 🎉<br>
          <strong>Order ID:</strong> ${result.orderId}<br>
          <strong>Total Price:</strong> UGX ${totalPrice}<br>
          <br>`;
        
        // Show delivery confirmation
        if (data.delivery_method === 'email' || data.delivery_method === 'both') {
          message += `📧 Quote sent to: ${data.email}<br>`;
        }
        if (data.delivery_method === 'whatsapp' || data.delivery_method === 'both') {
          message += `💬 WhatsApp quote ready<br>`;
          if (result.whatsappUrl) {
            message += `<a href="${result.whatsappUrl}" target="_blank" class="btn btn-sm" style="margin-top:10px">Open WhatsApp Quote</a><br>`;
          }
        }
        
        message += `<br><small>We'll contact you within 24 hours to confirm your order.</small>
        </div>`;
        
        statusEl.innerHTML = message;
        
        setTimeout(() => {
          if (result.whatsappUrl && (data.delivery_method === 'whatsapp' || data.delivery_method === 'both')) {
            window.open(result.whatsappUrl, '_blank');
          }
        }, 1500);
        
        setTimeout(() => {
          closeOrderModal();
        }, 8000);
      } else {
        const errors = result.errors || [];
        const errorMsg = errors.length > 0 ? errors.map(e => e.msg).join(', ') : result.message;
        throw new Error(errorMsg || 'Quote generation failed');
      }
    } catch (error) {
      statusEl.innerHTML = `<div class="status-message error">⚠ ${error.message}<br>Please call +256 752 052202 for assistance.</div>`;
    }
  });
}

// Appointment Form Handler
const appointmentForm = document.getElementById('appointmentForm');
if (appointmentForm) {
  appointmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const statusEl = document.getElementById('appointmentStatus');
    statusEl.innerHTML = '<div class="status-message info">Booking your appointment...</div>';
    
    const formData = new FormData(appointmentForm);
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      date: formData.get('date'),
      time: formData.get('time'),
      service: formData.get('service'),
      details: formData.get('details'),
      bookingDate: new Date().toISOString()
    };
    
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        statusEl.innerHTML = `<div class="status-message success">✓ Appointment booked for ${data.date} at ${data.time}! Confirmation sent to ${data.phone}</div>`;
        appointmentForm.reset();
        
        setTimeout(() => {
          statusEl.innerHTML = '';
        }, 8000);
      } else {
        throw new Error(result.message || 'Booking failed');
      }
    } catch (error) {
      statusEl.innerHTML = `<div class="status-message error">⚠ ${error.message}. Please call +256 752 052202</div>`;
    }
  });
}

// Close modal on outside click
window.addEventListener('click', (e) => {
  const modal = document.getElementById('orderModal');
  if (e.target === modal) {
    closeOrderModal();
  }
});

// Set minimum date for appointment booking (today)
const dateInput = document.querySelector('input[name="date"]');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

console.log('🎨 Avis IT Solutions - Three Liquid Glass Themes Active');
console.log('📱 Order & Appointment System Ready');

// Enhanced Order Form Handler with Quote Generation
const enhancedOrderForm = document.getElementById('orderForm');
if (enhancedOrderForm) {
  enhancedOrderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const statusEl = document.getElementById('orderStatus');
    statusEl.innerHTML = '<div class="status-message info generating-quote">⚙️ Generating your custom quote...</div>';
    
    const formData = new FormData(enhancedOrderForm);
    const data = {
      // Personal Info
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      whatsapp: formData.get('whatsapp') || formData.get('phone'),
      
      // Device Specs
      category: formData.get('category'),
      brand: formData.get('brand'),
      processor: formData.get('processor'),
      ram: formData.get('ram'),
      storage: formData.get('storage'),
      screen: formData.get('screen'),
      graphics: formData.get('graphics'),
      os: formData.get('os'),
      
      // Requirements
      quantity: parseInt(formData.get('quantity')),
      usage: formData.get('usage'),
      budget: formData.get('budget'),
      location: formData.get('location'),
      notes: formData.get('notes'),
      
      // Delivery
      delivery_method: formData.get('delivery_method'),
      
      requestDate: new Date().toISOString()
    };
    
    try {
      const response = await fetch('/api/quotes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        const deliveryMsg = data.delivery_method === 'email' ? 'email' : 
                           data.delivery_method === 'whatsapp' ? 'WhatsApp' : 
                           'email and WhatsApp';
        
        statusEl.innerHTML = `
          <div class="status-message success">
            ✅ Quote Generated Successfully!<br>
            <strong>Quote ID:</strong> ${result.quoteId}<br>
            <strong>Estimated Price:</strong> UGX ${result.estimatedPrice?.toLocaleString() || 'TBD'}<br>
            <br>
            📨 Your detailed quote has been sent to your ${deliveryMsg}.<br>
            We'll contact you within 30 minutes to finalize details.
          </div>
        `;
        
        // Show WhatsApp notification if applicable
        if (data.delivery_method === 'whatsapp' || data.delivery_method === 'both') {
          setTimeout(() => {
            statusEl.innerHTML += '<div class="status-message info">📱 Check your WhatsApp for the quote message!</div>';
          }, 1500);
        }
        
        setTimeout(() => {
          closeOrderModal();
        }, 8000);
        
      } else {
        throw new Error(result.message || 'Quote generation failed');
      }
    } catch (error) {
      statusEl.innerHTML = `<div class="status-message error">⚠ ${error.message}. Please call +256 752 052202</div>`;
    }
  });
}

// Update theme switcher to include gray theme
function updateActiveTheme(theme) {
  document.querySelectorAll('.theme-btn').forEach(btn => {
    if (btn.dataset.theme === theme) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Enhance modal opening for larger quote form
window.openOrderModal = function(productName) {
  const modal = document.getElementById('orderModal');
  const productInput = document.getElementById('orderProduct');
  const productDisplay = document.getElementById('orderProductDisplay');
  const modalContent = modal.querySelector('.modal-content');
  
  if (modal && productInput && productDisplay) {
    productInput.value = productName;
    productDisplay.value = productName;
    modalContent.classList.add('quote-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

console.log('🎨 Four Themes Active: Blue, Purple, Green, Gray');
console.log('💰 Auto-Quote System Ready');
console.log('📧 Email & WhatsApp Quote Delivery Active');
