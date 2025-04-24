document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  // === INIT 1. Button Character Stagger ===
  function initButtonCharacterStagger() {
    const offsetIncrement = 0.01;
    const buttons = document.querySelectorAll('[data-button-animate-chars]');

    buttons.forEach(button => {
      const text = button.textContent;
      button.innerHTML = '';

      [...text].forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.transitionDelay = `${index * offsetIncrement}s`;
        if (char === ' ') span.style.whiteSpace = 'pre';
        button.appendChild(span);
      });
    });
  }

  // === INIT 2. Compteur animé à l'entrée dans le viewport ===
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  function formatWithSpaces(n) {
    const str = n.toString();
    return str.length <= 4 ? str : str.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
  }

  function extractParts(text) {
    const match = text.match(/^([^0-9-]*)([\d\s.,+-]+)([^0-9]*)$/);
    if (!match) return { prefix: "", value: 0, suffix: "" };
    return {
      prefix: match[1] || "",
      value: parseFloat(match[2].replace(/[^\d.-]/g, "")),
      suffix: match[3] || ""
    };
  }

  function animateValue(el, start, end, duration, prefix = "", suffix = "") {
    const startTime = performance.now();

    function update(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = easeOutCubic(progress);
      el.textContent = `${prefix}${formatWithSpaces(Math.floor(start + (end - start) * eased))}${suffix}`;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains("already-animated")) {
        entry.target.classList.add("already-animated");
        const { prefix, value, suffix } = extractParts(entry.target.textContent.trim());
        animateValue(entry.target, 0, value, 1500, prefix, suffix);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll(".chiffre-head").forEach(el => counterObserver.observe(el));

  // === INIT 3. Animation lettres sur .footer-link ===
  document.querySelectorAll('.footer-link').forEach(link => {
    const letters = link.textContent.trim().split('');
    link.innerHTML = '';
    letters.forEach(char => {
      const span = document.createElement('span');
      span.innerHTML = char === ' ' ? '&nbsp;' : char;
      span.style.display = 'inline-block';
      span.style.transition = 'transform 0.3s ease';
      link.appendChild(span);
    });

    const spans = link.querySelectorAll('span');

    link.addEventListener('mouseenter', () => {
      spans.forEach((span, i) => {
        gsap.fromTo(span,
          { y: 0 },
          {
            y: -5,
            duration: 0.2,
            ease: "power2.out",
            yoyo: true,
            repeat: 1,
            delay: i * 0.02
          });
      });
    });

    link.addEventListener('mouseleave', () => {
      spans.forEach((span, i) => {
        gsap.to(span, {
          y: 0,
          delay: i * 0.02,
          duration: 0.3,
          ease: "power2.inOut"
        });
      });
    });
  });

  // === INIT 4. Icones animées au hover ===
  document.querySelectorAll('.icon-item').forEach(item => {
    const image = item.querySelector('.icon-image');
    if (!image) return;
    item.addEventListener('mouseenter', () => {
      gsap.to(image, {
        x: 40,
        duration: 0.15,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.set(image, { x: -40 });
          gsap.to(image, {
            x: 0,
            duration: 0.15,
            ease: 'power2.inOut'
          });
        }
      });
    });
  });

  // === INIT 5. Reveal titres h2/h3 au scroll ===
  gsap.utils.toArray("h2, h3").forEach(el => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: "power2.out"
    });
  });

  // === INIT 6. Mega menu nav-hover ===
  const navLink = document.querySelector('.nav-link.solution');
  const megaNav = document.querySelector('.mega-nav');
  const lineSep = document.querySelector('.line-sep');

  if (navLink && megaNav) {
    const getFadeElements = () => Array.from(megaNav.querySelectorAll('[class*="fade-in-child"]')).map(el => {
      const cls = [...el.classList].find(c => c.startsWith('fade-in-child'));
      const index = parseInt(cls?.split('-')[3]) || 1;
      return { el, index };
    });

    let hideTimeout;

    const animateLineSep = (expand) => {
      if (!lineSep) return;
      lineSep.style.transition = 'max-height 0.4s ease';
      lineSep.style.maxHeight = expand ? '300px' : '0';
    };

    const showMegaNav = () => {
      clearTimeout(hideTimeout);
      megaNav.classList.add('show');
      document.body.classList.add('menu-open');
      animateLineSep(true);
      getFadeElements().sort((a, b) => a.index - b.index).forEach(({ el }, i) => {
        setTimeout(() => el.classList.add('visible'), i * 100);
      });
    };

    const hideMegaNav = () => {
      const elements = getFadeElements().sort((a, b) => b.index - a.index);
      elements.forEach(({ el }, i) => {
        setTimeout(() => el.classList.remove('visible'), i * 60);
      });
      animateLineSep(false);
      hideTimeout = setTimeout(() => {
        megaNav.classList.remove('show');
        document.body.classList.remove('menu-open');
      }, elements.length * 60 + 200);
    };

    navLink.addEventListener('mouseenter', showMegaNav);
    navLink.addEventListener('mouseleave', () => hideTimeout = setTimeout(hideMegaNav, 200));
    megaNav.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
    megaNav.addEventListener('mouseleave', hideMegaNav);
  }

  // === INIT 7. Slider animation (GSAP) ===
  let previousSlide = null;

  function animateSlide(slide, dir = 'in') {
    const h3 = slide.querySelector(".h3-citation");
    const name = slide.querySelector(".orange");
    const job = slide.querySelector(".sol-slide-paragraph");
    const counter = slide.querySelector(".w20");
    const items = [h3, name, job, counter];

    if (dir === 'out') {
      items.forEach(el => {
        if (el) gsap.to(el, { opacity: 0, y: -20, duration: 0.4, ease: "power2.out" });
      });
    } else {
      items.forEach(el => {
        if (el) gsap.set(el, { opacity: 0, y: 20 });
      });
      const tl = gsap.timeline();
      if (h3) tl.to(h3, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0);
      if (name) tl.to(name, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.1);
      if (job) tl.to(job, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.2);
      if (counter) tl.to(counter, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.3);
    }
  }

  function checkSlideChange() {
    const current = document.querySelector(".sol-slider .w-slide:not([aria-hidden='true'])");
    if (current && current !== previousSlide) {
      if (previousSlide) animateSlide(previousSlide, 'out');
      animateSlide(current, 'in');
      previousSlide = current;
    }
  }

  const first = document.querySelector(".sol-slider .w-slide:not([aria-hidden='true'])");
  if (first) {
    previousSlide = first;
    animateSlide(first, 'in');
  }

  setInterval(checkSlideChange, 300);

  // === Start everything ===
  initButtonCharacterStagger();
});
