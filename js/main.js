/* =========================================================
   Muhammad Wardaan — Premium Portfolio JS
   1. Preloader
   2. AOS Init
   3. Navbar (scroll state, active link, mobile menu)
   4. Scroll Progress Bar
   5. Custom Cursor
   6. Particle Background (hero)
   7. Typing Animation
   8. Skill Bars Animation
   9. Counter Animation
   10. Portfolio Filter
   11. Testimonial Carousel
   12. Contact Form Handling
   13. Scroll To Top
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Preloader ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('loaded'), 400);
  });
  // Fallback in case 'load' already fired
  setTimeout(() => preloader && preloader.classList.add('loaded'), 2500);

  /* ---------- 2. AOS Init ---------- */
  if (window.AOS) {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
    });
  }

  /* ---------- 3. Navbar ---------- */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-hire-btn');
  const sections = document.querySelectorAll('main section[id]');

  const onScrollNavbar = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  onScrollNavbar();
  window.addEventListener('scroll', onScrollNavbar, { passive: true });

  const toggleMobileMenu = (open) => {
    const shouldOpen = open !== undefined ? open : !mobileMenu.classList.contains('active');
    mobileMenu.classList.toggle('active', shouldOpen);
    hamburger.classList.toggle('active', shouldOpen);
    hamburger.setAttribute('aria-expanded', String(shouldOpen));
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => toggleMobileMenu());
  mobileNavLinks.forEach(link => link.addEventListener('click', () => toggleMobileMenu(false)));

  // Active link highlighting on scroll
  const setActiveLink = () => {
    let currentId = sections[0]?.id;
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) currentId = section.id;
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  };
  setActiveLink();
  window.addEventListener('scroll', setActiveLink, { passive: true });

  /* ---------- 4. Scroll Progress Bar ---------- */
  const scrollProgress = document.getElementById('scrollProgress');
  const updateScrollProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = `${progress}%`;
  };
  updateScrollProgress();
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  /* ---------- 5. Custom Cursor (desktop only) ---------- */
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  if (isFinePointer && cursorDot && cursorRing) {
    let ringX = 0, ringY = 0, targetX = 0, targetY = 0;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
    });

    const animateRing = () => {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(animateRing);
    };
    animateRing();

    const hoverTargets = 'a, button, .service-card, .project-card, input, textarea';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) cursorRing.classList.add('hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) cursorRing.classList.remove('hover');
    });
  } else {
    cursorDot?.remove();
    cursorRing?.remove();
  }

  /* ---------- 6. Particle Background (hero) ---------- */
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const hero = canvas.closest('.hero');
    let particles = [];
    let animId;

    const resizeCanvas = () => {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    };

    const countForWidth = () => Math.min(70, Math.floor(window.innerWidth / 18));

    const createParticles = () => {
      const count = countForWidth();
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.6,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.5 + 0.2,
      }));
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 125, 253, ${p.alpha})`;
        ctx.fill();
      });

      // connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(drawParticles);
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      resizeCanvas();
      createParticles();
      drawParticles();

      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          cancelAnimationFrame(animId);
          resizeCanvas();
          createParticles();
          drawParticles();
        }, 200);
      });
    }
  }

  /* ---------- 7. Typing Animation ---------- */
  const typedTextEl = document.getElementById('typedText');
  if (typedTextEl) {
    const phrases = [
      'Full Stack Web Developer',
      'AI Website Designer',
      'UI/UX Enthusiast',
      'React & Next.js Developer',
    ];
    let phraseIndex = 0, charIndex = 0, isDeleting = false;

    const type = () => {
      const current = phrases[phraseIndex];
      if (isDeleting) {
        charIndex--;
      } else {
        charIndex++;
      }
      typedTextEl.textContent = current.substring(0, charIndex);

      let speed = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === current.length) {
        speed = 1800;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        speed = 300;
      }
      setTimeout(type, speed);
    };
    type();
  }

  /* ---------- 8. Skill Bars Animation ---------- */
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.width = `${el.dataset.width}%`;
        skillObserver.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  skillBars.forEach(bar => skillObserver.observe(bar));

  /* ---------- 9. Counter Animation ---------- */
  const counters = document.querySelectorAll('.stat-number');
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1600;
    const start = performance.now();

    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    };
    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(counter => counterObserver.observe(counter));

  /* ---------- 10. Portfolio Filter ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });

  /* ---------- 11. Testimonial Carousel ---------- */
  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('testimonialDots');

  if (track && dotsWrap) {
    const cards = track.children;
    let perView = window.innerWidth >= 900 ? 2 : 1;
    let index = 0;
    let autoTimer;

    const totalSlides = () => Math.ceil(cards.length / perView);

    const buildDots = () => {
      dotsWrap.innerHTML = '';
      for (let i = 0; i < totalSlides(); i++) {
        const dot = document.createElement('button');
        dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      }
    };

    const goTo = (i) => {
      index = (i + totalSlides()) % totalSlides();
      track.style.transform = `translateX(-${index * 100}%)`;
      [...dotsWrap.children].forEach((d, di) => d.classList.toggle('active', di === index));
    };

    const startAuto = () => {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(index + 1), 5000);
    };

    buildDots();
    goTo(0);
    startAuto();

    track.addEventListener('mouseenter', () => clearInterval(autoTimer));
    track.addEventListener('mouseleave', startAuto);

    let resizeTimer2;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer2);
      resizeTimer2 = setTimeout(() => {
        const newPerView = window.innerWidth >= 900 ? 2 : 1;
        if (newPerView !== perView) {
          perView = newPerView;
          buildDots();
          goTo(0);
        }
      }, 200);
    });
  }

  /* ---------- 12. Contact Form Handling ---------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const subject = contactForm.subject.value.trim();
      const message = contactForm.message.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !subject || !message) {
        e.preventDefault();
        formStatus.textContent = 'Please fill in all required fields.';
        formStatus.className = 'form-status error';
        return;
      }
      if (!emailPattern.test(email)) {
        e.preventDefault();
        formStatus.textContent = 'Please enter a valid email address.';
        formStatus.className = 'form-status error';
        return;
      }

      formStatus.textContent = 'Sending your message...';
      formStatus.className = 'form-status';
      // Form submits normally to FormSubmit.co (action attribute on the form)
    });
  }

  /* ---------- 13. Scroll To Top ---------- */
  const scrollTopBtn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
