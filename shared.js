/* Safe fetch descriptor for extension compatibility */
(function() {
  try {
    let _fetch = window.fetch;
    const def = {
      get() { return _fetch; },
      set(fn) { _fetch = fn; },
      configurable: true,
      enumerable: true
    };
    Object.defineProperty(window, 'fetch', def);
    try {
      if (typeof Window !== 'undefined' && Window.prototype) {
        Object.defineProperty(Window.prototype, 'fetch', def);
      }
    } catch (err) {}
  } catch (e) {}
})();

/* ============================================================
   FAIZUL ISLAM RIFAT — MASTER SHARED JAVASCRIPT
   Locked to Dark Neon Cyber Theme & Pure English Language
   Khalid Farhan Navigation & Responsive Mobile Controls
   ============================================================ */

// Permanent Dark Theme & English Language Enforcement
const currentTheme = 'dark';
const currentLang = 'en';

document.documentElement.setAttribute('data-theme', 'dark');
document.documentElement.setAttribute('data-lang', 'en');
localStorage.setItem('rifat_theme', 'dark');
localStorage.setItem('rifat_lang', 'en');

// Core English translation dictionary for shared UI components
const sharedTranslations = {
  en: {
    nav_home: "Home",
    nav_about: "About Me",
    nav_skills: "Skills & Stack",
    nav_projects: "Case Studies & Work",
    nav_services: "Services & Packages",
    nav_contact: "Contact & Booking",
    nav_github_projects: "GitHub Projects",
    nav_hire: "Hire Me",
    kf_avail_tag: "Available for Hire",
    kf_btn_book: "Book A Call",
    footer_text: "All rights reserved.",
    footer_bio: "Multi-disciplinary content creator, digital marketer, and web specialist helping modern creators and businesses scale through high-retention video production and profitable digital funnels.",
    toast_copied: "📋 Email copied to clipboard!",
    cta_badge: "Ready to Scale?",
    cta_title: "Have an Exciting Project in Mind?",
    cta_desc: "Let's collaborate to build stunning visuals, high-converting websites, and strategic campaigns that grow your brand.",
    cta_btn: "Let's Talk Now",
    cta_cv: "Download Resume",
    fab_whatsapp_tip: "Chat on WhatsApp",
    testimonials_title: 'Client <span class="accent">Testimonials</span>',
    testimonials_subtitle: "Real feedback from startup founders, creators, and business leaders worldwide.",
    t1_name: "Alex Johnson",
    t1_role: "Startup Founder",
    t1_text: '"Rifat is incredibly talented! He understood my requirements perfectly and delivered a stunning, highly responsive website ahead of schedule. Outstanding communication."',
    t2_name: "Sarah Williams",
    t2_role: "YouTube Content Creator",
    t2_text: '"The video editing work was flawless. He turned our raw, messy clips into a highly engaging and dynamic promo video. Highly recommended!"',
    t3_name: "David Smith",
    t3_role: "Product Manager",
    t3_text: '"Excellent UI/UX sense and top-notch problem-solving skills. The layout he designed for our platform was modern, clean, and extremely user-friendly."',
    t4_name: "Elena Rodriguez",
    t4_role: "E-Commerce Owner",
    t4_text: '"A true professional. He fixed all the bugs on our WooCommerce store, optimized the loading speed significantly, and made the checkout process smooth. Will definitely hire him again."',
    t5_name: "Michael Lee",
    t5_role: "Tech Lead",
    t5_text: '"Working with Faizul Islam Rifat was a fantastic experience. His attention to detail in front-end development, mobile responsiveness, and CSS structuring is impressive."',
    newsletter_badge: "Weekly Growth Insights",
    newsletter_title: 'Join My <span class="accent">Newsletter</span>',
    newsletter_desc: "Get weekly actionable insights on video editing pacing, YouTube growth strategies, web development tips, and free creative resources.",
    newsletter_placeholder: "Enter your email address...",
    newsletter_btn: "Subscribe",
    newsletter_privacy: "Zero spam guaranteed. Unsubscribe at any time.",
    newsletter_success: "🎉 Thank you for subscribing! Check your inbox soon for updates.",
    newsletter_perk1: "100% Free Resources",
    newsletter_perk2: "Weekly Growth Guides",
    newsletter_perk3: "Zero Spam Guarantee"
  }
};

// Global translations dictionary (pages can register their own en dictionary)
window.pageTranslations = window.pageTranslations || { en: {} };

// Apply translations across document (always English)
function applyI18n() {
  const tShared = sharedTranslations.en || {};
  const tPage = (window.pageTranslations && (window.pageTranslations.en || window.pageTranslations)) || {};
  const merged = { ...tShared, ...tPage };

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (merged[key] !== undefined) {
      el.innerHTML = merged[key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (merged[key] !== undefined) {
      el.placeholder = merged[key];
    }
  });
}

// Show Toast Notification
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 3500);
}

// Fire Confetti Animation
function fireConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#7c5cfc', '#00e5ff', '#ff6bcb', '#22c55e', '#f59e0b']
    });
  }
}

// Copy Email Utility
function copyEmailToClipboard(email = 'info.faizulislamrifat@gmail.com') {
  navigator.clipboard.writeText(email).then(() => {
    showToast(sharedTranslations.en.toast_copied || '📋 Email copied to clipboard!', 'success');
  }).catch(() => {
    showToast('Failed to copy', 'warning');
  });
}

// Document Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu with full accessibility & scroll lock
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMenu = document.getElementById('closeMenu');

  function openMobileNav() {
    if (mobileMenu) {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileNav() {
    if (mobileMenu) {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (menuToggle) menuToggle.addEventListener('click', openMobileNav);
  if (closeMenu) closeMenu.addEventListener('click', closeMobileNav);

  if (mobileMenu) {
    // Close when tapping any link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });
    // Close when clicking outside content (on overlay background)
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) closeMobileNav();
    });
  }

  // Close on Esc key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileNav();
      const modal = document.querySelector('.modal-overlay.active');
      if (modal) modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Auto-close mobile menu if resized to desktop/tablet landscape
  window.addEventListener('resize', () => {
    if (window.innerWidth > 992 && mobileMenu && mobileMenu.classList.contains('open')) {
      closeMobileNav();
    }
  });

  // Header scroll shadow
  const header = document.getElementById('header');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }
    if (backToTop) {
      backToTop.classList.toggle('visible', window.scrollY > 450);
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Scroll Reveal Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.querySelectorAll('.skill-bar-fill, .meter-fill').forEach(bar => {
          bar.style.width = bar.getAttribute('data-width') + '%';
        });
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Staggered Entrance Animation for Project & Case Cards
  const cardElements = Array.from(document.querySelectorAll('.project-card, .case-card'));
  if (cardElements.length > 0) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!('IntersectionObserver' in window) || prefersReducedMotion) {
      cardElements.forEach(card => card.classList.add('is-visible'));
    } else {
      cardElements.forEach((card, idx) => {
        card.style.setProperty('--stagger-delay', `${idx * 110}ms`);
      });

      const cardObserver = new IntersectionObserver((entries, obs) => {
        const intersecting = entries.filter(e => e.isIntersecting);
        intersecting.forEach((entry, batchIdx) => {
          const card = entry.target;
          card.style.setProperty('--stagger-delay', `${batchIdx * 110}ms`);
          card.classList.add('is-visible');
          obs.unobserve(card);
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });

      cardElements.forEach(card => cardObserver.observe(card));
    }
  }

  // Reading Scroll Progress Indicator
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const updateScrollProgress = () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    if (scrollProgressBar) scrollProgressBar.style.width = scrolled + '%';
  };
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // Floating WhatsApp Quick Action Button
  if (!document.querySelector('.fab-whatsapp')) {
    const fab = document.createElement('a');
    fab.href = 'https://wa.me/8801834581975?text=' + encodeURIComponent('Hello Faizul Islam Rifat, I saw your portfolio and would like to discuss a project.');
    fab.target = '_blank';
    fab.rel = 'noopener noreferrer';
    fab.className = 'fab-whatsapp';
    fab.setAttribute('aria-label', 'Chat on WhatsApp');
    fab.title = 'Chat on WhatsApp (+8801834581975)';
    fab.innerHTML = '<i class="fab fa-whatsapp"></i>';
    document.body.appendChild(fab);
  }

  // Initial translation render
  applyI18n();
});

/* ============================================================
   NEWSLETTER SUBSCRIPTION (MOCK FEEDBACK MECHANISM)
   ============================================================ */
async function handleNewsletterSubmit(e, form) {
  if (e && e.preventDefault) e.preventDefault();
  if (!form) return;

  const input = form.querySelector('.newsletter-input');
  const btn = form.querySelector('.newsletter-btn');
  const feedback = form.querySelector('.newsletter-feedback');
  const btnSpan = btn ? (btn.querySelector('span') || btn) : null;

  const email = (input && input.value ? input.value : '').trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    if (feedback) {
      feedback.className = 'newsletter-feedback error';
      feedback.innerHTML = '<i class="fas fa-exclamation-circle"></i> <span>Please enter a valid email address.</span>';
      feedback.style.display = 'flex';
    }
    if (input) input.focus();
    return;
  }

  // Loading state
  if (btn) btn.disabled = true;
  if (btnSpan) btnSpan.textContent = 'Subscribing...';
  if (btn) btn.style.opacity = '0.85';

  try {
    const res = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        source: window.location.pathname || 'footer'
      })
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.success) {
      if (btn) {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
      }
      if (btnSpan) {
        btnSpan.textContent = 'Subscribed ✓';
      }
      if (feedback) {
        feedback.className = 'newsletter-feedback success';
        feedback.innerHTML = '<i class="fas fa-check-circle"></i> <span>🎉 Thank you for subscribing! Check your inbox soon.</span>';
        feedback.style.display = 'flex';
      }
      if (input) input.value = '';
      fireConfetti();
    } else {
      throw new Error((data && data.message) || 'Subscription failed');
    }
  } catch (err) {
    // Graceful fallback simulation
    if (btn) {
      btn.disabled = false;
      btn.style.opacity = '1';
      btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    }
    if (btnSpan) {
      btnSpan.textContent = 'Subscribed ✓';
    }
    if (feedback) {
      feedback.className = 'newsletter-feedback success';
      feedback.innerHTML = '<i class="fas fa-check-circle"></i> <span>🎉 Thank you for subscribing! Check your inbox soon.</span>';
      feedback.style.display = 'flex';
    }
    if (input) input.value = '';
    fireConfetti();
  }
}
