<script>
  function initButtonCharacterStagger() {
  const offsetIncrement = 0.01; // Transition offset increment in seconds
  const buttons = document.querySelectorAll('[data-button-animate-chars]');

  buttons.forEach(button => {
    const text = button.textContent; // Get the button's text content
    button.innerHTML = ''; // Clear the original content

    [...text].forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.transitionDelay = `${index * offsetIncrement}s`;

      // Handle spaces explicitly
      if (char === ' ') {
        span.style.whiteSpace = 'pre'; // Preserve space width
      }

      button.appendChild(span);
    });
  });
}

// Initialize Button Character Stagger Animation
document.addEventListener('DOMContentLoaded', () => {
  initButtonCharacterStagger();
});
</script>

<script>
document.addEventListener("DOMContentLoaded", function () {
  // Easing cubic : plus doux et fluide
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
  const duration = 1500;

  function formatWithSpaces(n) {
    const str = n.toString();
    // Si le nombre est trop court (ex: 1992), on ne met pas d'espace
    if (str.length <= 4) return str;
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0'); // espace insécable
  }

  function extractParts(text) {
    const match = text.match(/^([^0-9-]*)([\d\s.,+-]+)([^0-9]*)$/);
    if (!match) return { prefix: "", value: 0, suffix: "" };
    const prefix = match[1] || "";
    const rawValue = match[2].replace(/[^\d.-]/g, ""); // garde chiffres, "." et "-"
    const suffix = match[3] || "";
    return {
      prefix,
      value: parseFloat(rawValue),
      suffix
    };
  }

  function animateValue(el, start, end, duration, prefix = "", suffix = "") {
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const currentValue = Math.floor(start + (end - start) * eased);
      el.textContent = `${prefix}${formatWithSpaces(currentValue)}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = `${prefix}${formatWithSpaces(end)}${suffix}`;
      }
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (!el.classList.contains("already-animated")) {
          el.classList.add("already-animated");

          const { prefix, value, suffix } = extractParts(el.textContent.trim());
          animateValue(el, 0, value, duration, prefix, suffix);
        }
      }
    });
  }, {
    threshold: 0.5
  });

  document.querySelectorAll(".chiffre-head").forEach(el => {
    observer.observe(el);
  });
});
</script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script>
  document.querySelectorAll('.footer-link').forEach(link => {
    // Split les lettres dans des spans
    const letters = link.textContent.trim().split('');
    link.innerHTML = ''; // Vide le lien

    letters.forEach(letter => {
      const span = document.createElement('span');
      span.textContent = letter;
      span.style.display = 'inline-block';
      span.style.transition = 'transform 0.3s ease';
      link.appendChild(span);
    });

    const spans = link.querySelectorAll('span');

    link.addEventListener('mouseenter', () => {
      spans.forEach((span, i) => {
        gsap.to(span, {
          y: -5,
          delay: i * 0.02,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });

    link.addEventListener('mouseleave', () => {
      spans.forEach((span, i) => {
        gsap.to(span, {
          y: 0,
          delay: i * 0.02,
          duration: 0.4,
          ease: "power2.inOut"
        });
      });
    });
  });
</script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script>
  document.querySelectorAll('.footer-link').forEach(link => {
    const originalText = link.textContent;
    link.innerHTML = '';

    originalText.split('').forEach(char => {
      const span = document.createElement('span');

      // Garde les espaces visibles
      span.innerHTML = char === ' ' ? '&nbsp;' : char;

      span.style.display = 'inline-block';
      span.style.transition = 'transform 0.2s ease-out';

      link.appendChild(span);
    });

    const spans = link.querySelectorAll('span');

    link.addEventListener('mouseenter', () => {
      spans.forEach((span, i) => {
        gsap.fromTo(span,
          { y: 0 },
          {
            y: -4,
            duration: 0.15,
            ease: "power1.out",
            yoyo: true,
            repeat: 1,
            delay: i * 0.015
          }
        );
      });
    });
  });
</script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script>
  document.querySelectorAll('.icon-item').forEach(item => {
    const image = item.querySelector('.icon-image');

    item.addEventListener('mouseenter', () => {
      // Lance une anim en chaîne : sort à droite, revient de la gauche
      gsap.to(image, {
        x: 40, // vers la droite, hors du block
        duration: 0.15,
        ease: 'power2.inOut',
        onComplete: () => {
          // Replace instantanément à gauche (hors champ)
          gsap.set(image, { x: -40 });

          // Puis anim retour vers x: 0 (recentrage)
          gsap.to(image, {
            x: 0,
            duration: 0.15,
            ease: 'power2.inOut'
          });
        }
      });
    });
  });
</script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<script>
  document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray("h2, h3").forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 90%", // 10% offset du bas de l'écran
          toggleActions: "play none none none", // joue une fois
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power2.out",
      });
    });
  });
</script>
<script>
  document.addEventListener("DOMContentLoaded", function () {
    const navLink = document.querySelector('.nav-link.solution');
    const megaNav = document.querySelector('.mega-nav');
    const lineSep = document.querySelector('.line-sep');

    const getFadeElements = () => {
      return Array.from(megaNav.querySelectorAll('[class*="fade-in-child"]')).map(el => {
        const cls = [...el.classList].find(c => c.startsWith('fade-in-child'));
        const index = parseInt(cls.split('-')[3]) || 1;
        return { el, index };
      });
    };

    let hideTimeout;

    const animateLineSepIn = () => {
      if (!lineSep) return;
      lineSep.style.transition = 'max-height 0.5s ease';
      lineSep.style.maxHeight = '300px'; // ajuste cette hauteur selon ta maquette
    };

    const animateLineSepOut = () => {
      if (!lineSep) return;
      lineSep.style.transition = 'max-height 0.4s ease';
      lineSep.style.maxHeight = '0';
    };

    const showMegaNav = () => {
      clearTimeout(hideTimeout);
      megaNav.classList.add('show');
      document.body.classList.add('menu-open');
      animateLineSepIn();

      const elements = getFadeElements().sort((a, b) => a.index - b.index);
      elements.forEach(({ el }, i) => {
        setTimeout(() => {
          el.classList.add('visible');
        }, i * 100);
      });
    };

    const hideMegaNav = () => {
      const elements = getFadeElements().sort((a, b) => b.index - a.index);
      elements.forEach(({ el }, i) => {
        setTimeout(() => {
          el.classList.remove('visible');
        }, i * 60);
      });

      animateLineSepOut();

      hideTimeout = setTimeout(() => {
        megaNav.classList.remove('show');
        document.body.classList.remove('menu-open');
      }, elements.length * 60 + 200);
    };

    navLink.addEventListener('mouseenter', showMegaNav);
    navLink.addEventListener('mouseleave', () => {
      hideTimeout = setTimeout(hideMegaNav, 200);
    });

    megaNav.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
    megaNav.addEventListener('mouseleave', hideMegaNav);
  });
</script>

