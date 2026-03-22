/* ============================================================
   PORTFOLIO – script.js
   Author : Thanushree J
   Features: Typed text, theme toggle, scroll animations,
             skill bars, project filter, form validation,
             sticky navbar, back-to-top
   ============================================================ */

/* ── 1. DOM REFERENCES ── */
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navMenu     = document.getElementById('navMenu');
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const backToTop   = document.getElementById('backToTop');
const typedText   = document.getElementById('typedText');
const filterBtns  = document.querySelectorAll('.filter-btn');
const projectCards= document.querySelectorAll('.project-card');
const contactForm = document.getElementById('contactForm');
const navLinks    = document.querySelectorAll('.nav-link');

/* ── 2. TYPED TEXT EFFECT ── */
const roles = [
  'Aspiring Data Scientist',
  'BCA Data Science Student',
  'Learning Full Stack Dev',
  'Python Enthusiast',
];
let roleIndex = 0, charIndex = 0, isDeleting = false;

function typeEffect() {
  const current = roles[roleIndex];
  typedText.textContent = isDeleting
    ? current.slice(0, charIndex--)
    : current.slice(0, charIndex++);

  let delay = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex > current.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex < 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 400;
  }
  setTimeout(typeEffect, delay);
}
typeEffect();

/* ── 3. THEME TOGGLE (dark / light) ── */
// Persist preference
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeIcon.className = theme === 'dark' ? 'bx bx-sun' : 'bx bx-moon';
}

/* ── 4. STICKY NAVBAR + ACTIVE LINK ON SCROLL ── */
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Navbar shadow
  navbar.classList.toggle('scrolled', scrollY > 50);

  // Back-to-top visibility
  backToTop.classList.toggle('visible', scrollY > 400);

  // Active nav link
  sections.forEach(section => {
    const top    = section.offsetTop - 100;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < bottom);
  });
});

/* ── 5. HAMBURGER MENU ── */
hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navMenu.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu on link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

/* ── 6. SCROLL ANIMATIONS (IntersectionObserver) ── */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Animate skill bars when they enter view
        if (entry.target.classList.contains('skill-card')) {
          const fill  = entry.target.querySelector('.skill-fill');
          const width = fill.getAttribute('data-width');
          fill.style.width = width + '%';
        }
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

/* ── 7. PROJECT FILTER ── */
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const show     = filter === 'all' || category === filter;
      card.classList.toggle('hidden', !show);
    });
  });
});

/* ── 8. CONTACT FORM VALIDATION ── */
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (validateForm()) {
    showSuccess();
    contactForm.reset();
  }
});

// Clear error on input
contactForm.querySelectorAll('input, textarea').forEach(field => {
  field.addEventListener('input', () => clearError(field));
});

function validateForm() {
  let valid = true;

  const name    = document.getElementById('name');
  const email   = document.getElementById('email');
  const subject = document.getElementById('subject');
  const message = document.getElementById('message');

  if (!name.value.trim()) {
    showError(name, 'nameError', 'Name is required.');
    valid = false;
  }

  if (!email.value.trim()) {
    showError(email, 'emailError', 'Email is required.');
    valid = false;
  } else if (!isValidEmail(email.value.trim())) {
    showError(email, 'emailError', 'Please enter a valid email address.');
    valid = false;
  }

  if (!subject.value.trim()) {
    showError(subject, 'subjectError', 'Subject is required.');
    valid = false;
  }

  if (!message.value.trim()) {
    showError(message, 'messageError', 'Message cannot be empty.');
    valid = false;
  } else if (message.value.trim().length < 10) {
    showError(message, 'messageError', 'Message must be at least 10 characters.');
    valid = false;
  }

  return valid;
}

function showError(field, errorId, msg) {
  field.classList.add('error');
  document.getElementById(errorId).textContent = msg;
}

function clearError(field) {
  field.classList.remove('error');
  const errorEl = document.getElementById(field.id + 'Error');
  if (errorEl) errorEl.textContent = '';
  document.getElementById('formSuccess').textContent = '';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showSuccess() {
  const el = document.getElementById('formSuccess');
  el.textContent = '✅ Message sent! I\'ll get back to you soon.';
  setTimeout(() => { el.textContent = ''; }, 5000);
}

/* ── 9. BACK TO TOP ── */
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── 10. SMOOTH SCROLL for all anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── 11. HERO PARTICLES ── */
(function spawnParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  for (let i = 0; i < 28; i++) {
    const s = document.createElement('span');
    const size = Math.random() * 8 + 4;
    s.style.cssText = [
      `width:${size}px`, `height:${size}px`,
      `left:${Math.random() * 100}%`,
      `animation-duration:${Math.random() * 12 + 8}s`,
      `animation-delay:${Math.random() * 10}s`,
    ].join(';');
    container.appendChild(s);
  }
})();

/* ── 12. BUTTON RIPPLE ── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const r = document.createElement('span');
    r.className = 'ripple';
    const rect = this.getBoundingClientRect();
    const d = Math.max(rect.width, rect.height);
    r.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - rect.left - d/2}px;top:${e.clientY - rect.top - d/2}px;position:absolute;`;
    this.appendChild(r);
    r.addEventListener('animationend', () => r.remove());
  });
});

/* ── 13. PROJECT CARD TILT ── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = ((e.clientX - left) / width  - 0.5) * 14;
    const y = ((e.clientY - top)  / height - 0.5) * -14;
    card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── 14. ANIMATED COUNTERS ── */
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.getAttribute('data-target');
    let count = 0;
    const step = Math.ceil(target / 40);
    const tick = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = count + '+';
      if (count >= target) clearInterval(tick);
    }, 40);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObserver.observe(el));
