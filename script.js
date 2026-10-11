document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Keep the subtle background drift without relying on a scrolling library.
  const siteBg = document.querySelector('.site-background');
  if (siteBg && !prefersReducedMotion) {
    window.addEventListener('scroll', () => {
      siteBg.style.transform = `translate3d(0, ${window.scrollY * 0.05}px, 0)`;
    }, { passive: true });
  }

  const heroImage = document.querySelector('.hero-image');
  if (heroImage) {
    if (heroImage.complete) {
      heroImage.style.opacity = '1';
    } else {
      heroImage.addEventListener('load', () => {
        heroImage.style.opacity = '1';
      });
    }
  }

  // Navigation Pill Smooth Sliding Indicator
  const indicator = document.querySelector('.nav-pill-indicator');
  const navButtons = document.querySelectorAll('.nav-pill-btn');

  function updateIndicator(targetBtn, animate = true) {
    if (!indicator || !targetBtn) return;
    if (!animate) {
      indicator.style.transition = 'none';
    } else {
      indicator.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), width 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease';
    }

    const left = targetBtn.offsetLeft;
    const width = targetBtn.offsetWidth;

    indicator.style.transform = `translateX(${left}px)`;
    indicator.style.width = `${width}px`;
    indicator.style.opacity = '1';

    if (!animate) {
      void indicator.offsetWidth; // Force reflow
      indicator.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), width 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease';
    }
  }

  // Initialize indicator on active button once fonts are loaded
  const initialActive = document.querySelector('.nav-pill-btn.active') || navButtons[0];
  if (initialActive) {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        updateIndicator(initialActive, false);
      });
    } else {
      setTimeout(() => updateIndicator(initialActive, false), 50);
    }
  }

  window.addEventListener('resize', () => {
    const currentActive = document.querySelector('.nav-pill-btn.active');
    if (currentActive) {
      updateIndicator(currentActive, false);
    }
  });

  // Toast notification helper
  function showToast(message) {
    let toast = document.getElementById('nav-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'nav-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 32px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: rgba(26, 26, 26, 0.95);
        border: none;
        color: #ffffff;
        padding: 12px 24px;
        border-radius: 9999px;
        font-family: 'Interphases', sans-serif;
        font-size: 13px;
        font-weight: 500;
        z-index: 999;
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2800);
  }

  const shopBtn = document.getElementById('shop-btn');
  const hireBtn = document.getElementById('hire-btn');
  const contactWorkBtn = document.getElementById('contact-work-btn');

  if (shopBtn) {
    shopBtn.addEventListener('click', () => {
      navButtons.forEach(btn => btn.classList.remove('active'));
      shopBtn.classList.add('active');
      updateIndicator(shopBtn, true);
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      showToast('Shop launching soon');
    });
  }

  if (hireBtn) {
    hireBtn.addEventListener('click', () => {
      navButtons.forEach(btn => btn.classList.remove('active'));
      hireBtn.classList.add('active');
      updateIndicator(hireBtn, true);
      const contactSec = document.getElementById('contact');
      if (contactSec) {
        contactSec.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'center',
        });
      }
      setTimeout(() => {
        openContactModal();
      }, 350);
    });
  }

  // Contact Modal Logic (Matching Reference 2 with smooth in & out animations)
  const contactModal = document.getElementById('contact-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const contactForm = document.getElementById('contact-form');
  const formSuccessState = document.getElementById('form-success-state');
  const contactFormStatus = document.getElementById('contact-form-status');
  const successDoneBtn = document.getElementById('success-done-btn');
  let isModalAnimating = false;

  function openContactModal() {
    if (!contactModal || isModalAnimating) return;
    isModalAnimating = true;
    contactModal.classList.remove('closing');
    contactModal.classList.add('active');
    contactModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Reset success state if previously opened
    if (formSuccessState && contactForm) {
      formSuccessState.hidden = true;
      contactForm.style.display = 'flex';
    }
    if (contactFormStatus) {
      contactFormStatus.hidden = true;
      contactFormStatus.textContent = '';
    }

    setTimeout(() => {
      isModalAnimating = false;
      const firstInput = document.getElementById('contact-email');
      if (firstInput) firstInput.focus();
    }, 360);
  }

  function closeContactModal() {
    if (!contactModal || !contactModal.classList.contains('active') || isModalAnimating) return;
    isModalAnimating = true;
    contactModal.classList.remove('active');
    contactModal.classList.add('closing');
    contactModal.setAttribute('aria-hidden', 'true');

    setTimeout(() => {
      contactModal.classList.remove('closing');
      document.body.style.overflow = '';
      isModalAnimating = false;
      if (formSuccessState && contactForm) {
        formSuccessState.hidden = true;
        contactForm.style.display = 'flex';
      }
      if (contactFormStatus) {
        contactFormStatus.hidden = true;
        contactFormStatus.textContent = '';
      }
    }, 350);
  }

  if (contactWorkBtn) {
    contactWorkBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openContactModal();
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeContactModal);
  }

  if (successDoneBtn) {
    successDoneBtn.addEventListener('click', closeContactModal);
  }

  if (contactModal) {
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) {
        closeContactModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && contactModal && contactModal.classList.contains('active')) {
      closeContactModal();
    }
  });

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('contact-email')?.value.trim() || '';
      const handle = document.getElementById('contact-handle')?.value.trim() || '';
      const message = document.getElementById('contact-message')?.value.trim() || '';
      const website = document.getElementById('contact-website')?.value.trim() || '';
      const submitButton = document.getElementById('form-submit-btn');
      const buttonLabel = submitButton?.querySelector('span');
      const originalButtonLabel = buttonLabel?.textContent || 'Send Message';

      if (contactFormStatus) {
        contactFormStatus.hidden = true;
        contactFormStatus.textContent = '';
      }
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.setAttribute('aria-busy', 'true');
      }
      if (buttonLabel) buttonLabel.textContent = 'Sending...';

      try {
        const configuredBaseUrl = window.JZE_SITE_CONFIG?.apiBaseUrl;
        const apiBaseUrl = typeof configuredBaseUrl === 'string'
          ? configuredBaseUrl.trim().replace(/\/+$/, '')
          : '';
        const response = await fetch(`${apiBaseUrl}/api/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name: handle, message, website }),
        });
        const result = await response.json().catch(() => null);

        if (!response.ok || result?.ok !== true) {
          throw new Error(response.status === 429 ? 'rate-limit' : 'send-failed');
        }

        contactForm.reset();
        contactForm.style.display = 'none';
        if (formSuccessState) formSuccessState.hidden = false;
      } catch (error) {
        if (contactFormStatus) {
          contactFormStatus.textContent = error instanceof Error && error.message === 'rate-limit'
            ? 'You have sent a few messages recently. Please wait a little and try again.'
            : 'We could not send your message. Please try again in a moment.';
          contactFormStatus.hidden = false;
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.removeAttribute('aria-busy');
        }
        if (buttonLabel) buttonLabel.textContent = originalButtonLabel;
      }
    });
  }

  // Sync nav pills on scroll
  window.addEventListener('scroll', () => {
    const contactSec = document.getElementById('contact');
    if (!contactSec || !hireBtn || !shopBtn) return;
    const rect = contactSec.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.45) {
      if (!hireBtn.classList.contains('active')) {
        navButtons.forEach(btn => btn.classList.remove('active'));
        hireBtn.classList.add('active');
        updateIndicator(hireBtn, true);
      }
    } else {
      if (!shopBtn.classList.contains('active')) {
        navButtons.forEach(btn => btn.classList.remove('active'));
        shopBtn.classList.add('active');
        updateIndicator(shopBtn, true);
      }
    }
  }, { passive: true });

  // Gallery Card Interaction (Touch and click expand support)
  const galleryCards = document.querySelectorAll('.gallery-card');
  galleryCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const isAlreadyExpanded = card.classList.contains('expanded');
      galleryCards.forEach(c => c.classList.remove('expanded'));
      if (!isAlreadyExpanded) {
        card.classList.add('expanded');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.gallery-card')) {
      galleryCards.forEach(c => c.classList.remove('expanded'));
    }
  });

  // Footer Year
  const footerYear = document.getElementById('footer-year');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear().toString();
  }

  // Subtle Scroll Reveal for Gallery & Stats Sections
  const revealElements = document.querySelectorAll('.scroll-reveal');
  if (revealElements.length > 0) {
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach(el => {
        // If element is already in viewport on load, reveal immediately
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) {
          el.classList.add('is-revealed');
        } else {
          revealObserver.observe(el);
        }
      });
    } else {
      // Fallback: reveal immediately if observer not supported or reduced motion
      revealElements.forEach(el => el.classList.add('is-revealed'));
    }
  }

  // Stats Animated Count-Up
  const statsSection = document.getElementById('stats');
  if (statsSection && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let animated = false;
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          const statValues = statsSection.querySelectorAll('.stat-value');
          statValues.forEach(el => {
            const target = parseInt(el.getAttribute('data-target') || '0', 10);
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = 1200;
            const startTime = performance.now();

            function updateCount(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easeProgress = 1 - Math.pow(1 - progress, 3);
              const currentVal = Math.floor(easeProgress * target);
              el.textContent = `${currentVal}${suffix}`;
              if (progress < 1) {
                requestAnimationFrame(updateCount);
              } else {
                el.textContent = `${target}${suffix}`;
              }
            }

            requestAnimationFrame(updateCount);
          });
          statsObserver.unobserve(statsSection);
        }
      });
    }, { threshold: 0.15 });

    statsObserver.observe(statsSection);
  }
});
