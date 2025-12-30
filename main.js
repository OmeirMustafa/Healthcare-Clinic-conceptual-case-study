// Style loaded via link tag in HTML for better FCP
// import './style.css'

// ========================================
// State Management
// ========================================
const bookingState = {
  step: 1,
  data: {
    service: null,
    date: null,
    time: null,
    name: '',
    email: ''
  }
};

const services = [
  { id: 'primary', name: 'Primary Care Consultation', duration: '45 mins', price: '$250' },
  { id: 'specialist', name: 'Specialist Diagnostic', duration: '60 mins', price: '$400' },
  { id: 'wellness', name: 'Wellness & Nutrition', duration: '60 mins', price: '$200' },
];

const timeSlots = [
  '9:00 AM', '10:30 AM', '1:00 PM', '2:30 PM', '4:00 PM', '5:30 PM'
];

// ========================================
// Booking Widget
// ========================================
function renderBookingWidget() {
  const container = document.getElementById('booking-widget');
  if (!container) return;

  container.innerHTML = '';

  // Progress Indicator
  const progress = document.createElement('div');
  progress.className = 'booking-progress';
  progress.setAttribute('role', 'progressbar');
  progress.setAttribute('aria-valuenow', bookingState.step);
  progress.setAttribute('aria-valuemin', '1');
  progress.setAttribute('aria-valuemax', '4');

  for (let i = 1; i <= 3; i++) {
    const step = document.createElement('div');
    step.className = `progress-step ${i < bookingState.step ? 'completed' : ''} ${i === bookingState.step ? 'active' : ''}`;
    progress.appendChild(step);
  }
  container.appendChild(progress);

  // Step Content
  const content = document.createElement('div');
  content.className = 'booking-content';

  // Step 1: Select Service
  if (bookingState.step === 1) {
    content.innerHTML = `
      <div class="booking-step-title fade-in-up">
        <span class="step-number">1</span>
        Select Service
      </div>
      <div class="service-list fade-in-up delay-1" role="radiogroup" aria-label="Select a service">
        <!-- Injected via loop -->
      </div>
    `;

    const list = content.querySelector('.service-list');
    services.forEach((service, index) => {
      const btn = document.createElement('button');
      btn.className = `service-select-btn ${bookingState.data.service?.id === service.id ? 'active' : ''}`;
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', bookingState.data.service?.id === service.id);
      btn.innerHTML = `
        <div class="service-info">
          <strong>${service.name}</strong>
          <small>${service.duration}</small>
        </div>
        <div class="service-price">${service.price}</div>
      `;
      btn.onclick = () => {
        // Simulate loading for premium feel
        container.classList.add('loading');
        setTimeout(() => {
          bookingState.data.service = service;
          bookingState.step = 2;
          renderBookingWidget();
          container.classList.remove('loading');
        }, 600);
      };
      list.appendChild(btn);
    });
  }

  // Step 2: Select Time
  else if (bookingState.step === 2) {
    content.innerHTML = `
      <div class="fade-in-up">
        <button class="back-btn" aria-label="Go back to service selection">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back
        </button>
        <div class="booking-step-title">
            <span class="step-number">2</span>
            Choose Availability
        </div>
        <p style="color: var(--color-text-muted); margin-bottom: var(--spacing-lg); font-size: 0.9375rem;">
            Available slots for <strong>Today</strong>
        </p>
        <div class="time-grid" role="radiogroup" aria-label="Select a time slot">
            <!-- Injected via loop -->
        </div>
      </div>
    `;

    content.querySelector('.back-btn').onclick = () => {
      bookingState.step = 1;
      renderBookingWidget();
    };

    const grid = content.querySelector('.time-grid');
    timeSlots.forEach((time, index) => {
      const btn = document.createElement('button');
      btn.className = 'time-btn';
      btn.textContent = time;
      btn.onclick = () => {
        container.classList.add('loading');
        setTimeout(() => {
          bookingState.data.time = time;
          bookingState.step = 3;
          renderBookingWidget();
          container.classList.remove('loading');
        }, 500);
      };
      grid.appendChild(btn);
    });
  }

  // Step 3: Confirm Details
  else if (bookingState.step === 3) {
    content.innerHTML = `
      <div class="fade-in-up">
        <button class="back-btn" aria-label="Go back to time selection">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back
        </button>
        <div class="booking-step-title">
            <span class="step-number">3</span>
            Confirm Details
        </div>
        <div class="booking-summary">
            <p><strong>Service:</strong> ${bookingState.data.service.name}</p>
            <p><strong>Time:</strong> Today at ${bookingState.data.time}</p>
            <p><strong>Duration:</strong> ${bookingState.data.service.duration}</p>
        </div>
        <form id="booking-form" novalidate>
            <div class="booking-form-group">
            <label for="booking-name">Full Name *</label>
            <input type="text" id="booking-name" name="name" required autocomplete="name" aria-required="true">
            </div>
            <div class="booking-form-group">
            <label for="booking-email">Email Address *</label>
            <input type="email" id="booking-email" name="email" required autocomplete="email" aria-required="true">
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">
                Request Appointment
            </button>
        </form>
      </div>
    `;

    content.querySelector('.back-btn').onclick = () => {
      bookingState.step = 2;
      renderBookingWidget();
    };

    const form = content.querySelector('form');
    form.onsubmit = (e) => {
      e.preventDefault();
      const name = form.querySelector('#booking-name').value.trim();
      const email = form.querySelector('#booking-email').value.trim();

      if (!name || !email) return;

      container.classList.add('loading');
      setTimeout(() => {
        bookingState.data.name = name;
        bookingState.data.email = email;
        bookingState.step = 4;
        renderBookingWidget();
        container.classList.remove('loading');
      }, 1500); // Longer delay for "processing" feel
    };
  }

  // Step 4: Success
  else if (bookingState.step === 4) {
    content.innerHTML = `
      <div class="success-state">
        <div class="success-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <h3>Request Received</h3>
        <p>We've received your appointment request. Our concierge team will contact you within 2 hours to confirm details.</p>
        <button class="btn btn-secondary" id="reset-booking">Book Another</button>
      </div>
    `;

    content.querySelector('#reset-booking').onclick = () => {
      bookingState.step = 1;
      bookingState.data = { service: null, date: null, time: null, name: '', email: '' };
      renderBookingWidget();
    };
  }

  container.appendChild(content);
}

// ========================================
// Navigation
// ========================================
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  // Scroll behavior
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // Mobile menu toggle
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      const isActive = navLinks.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
      mobileMenuBtn.setAttribute('aria-expanded', isActive);
    });

    // Close menu on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

// ========================================
// Scroll Animations
// ========================================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Pause animations initially, let observer trigger them
  document.querySelectorAll('.fade-in, .fade-in-up').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
}

// ========================================
// Smooth Scroll for Anchor Links
// ========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 120;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ========================================
// Initialize
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  renderBookingWidget();
  initNavigation();
  initScrollAnimations();
  initSmoothScroll();
});
