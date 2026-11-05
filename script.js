/**
 * ==============================================================================
 * PORTFOLIO — TIMOTHÉE KIBUNDU MWELA
 * Script principal : Internationalisation, Thème, Navigation, Curseur, Carrousels
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const modeToggle = document.getElementById('modeToggle');
  const menuLinks = document.querySelectorAll('.menu-link');
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const cursorHoverSelector = 'a, button, .interactive-hover, .interactive-skill, .skill-card, [data-cursor-hover]';

  /* ----------------------------------------------------------------------------
   * 1. GESTION DES LANGUES (FR / EN)
   * ---------------------------------------------------------------------------- */

  function applyLanguage(language) {
    const selectedLanguage = language === 'en' ? 'en' : 'fr';
    document.documentElement.lang = selectedLanguage;

    // Mise à jour des textes bilingues
    document.querySelectorAll('[data-fr][data-en]').forEach(element => {
      element.textContent = element.dataset[selectedLanguage];
    });

    // Mise à jour des attributs aria-label bilingues
    document.querySelectorAll('[data-aria-fr][data-aria-en]').forEach(element => {
      const attr = selectedLanguage === 'fr' ? 'ariaFr' : 'ariaEn';
      element.setAttribute('aria-label', element.dataset[attr]);
    });

    document.querySelectorAll('[data-alt-fr][data-alt-en]').forEach(element => {
      element.alt = selectedLanguage === 'fr' ? element.dataset.altFr : element.dataset.altEn;
    });

    const description = document.querySelector('meta[name="description"][data-description-fr][data-description-en]');
    if (description) {
      description.content = selectedLanguage === 'fr' ? description.dataset.descriptionFr : description.dataset.descriptionEn;
    }

    // Boutons de bascule de langue
    document.querySelectorAll('.language-button').forEach(button => {
      const active = button.dataset.language === selectedLanguage;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    // Sauvegarde de la préférence utilisateur
    try {
      localStorage.setItem('portfolio-language', selectedLanguage);
    } catch (error) {
      console.warn('Impossible d’enregistrer la langue :', error);
    }

    updateModeText();
    document.dispatchEvent(new CustomEvent('portfolio-language-change', { detail: { language: selectedLanguage } }));
  }

  // Écouteurs sur les boutons de changement de langue
  document.querySelectorAll('.language-button').forEach(button => {
    button.addEventListener('click', () => {
      const selectedLanguage = button.dataset.language === 'en' ? 'en' : 'fr';
      const localeMatch = window.location.pathname.match(/\/(fr|en)\//);

      if (localeMatch && localeMatch[1] !== selectedLanguage) {
        const nextPath = window.location.pathname.replace(/\/(fr|en)\//, `/${selectedLanguage}/`);
        window.location.assign(`${nextPath}${window.location.search}${window.location.hash}`);
        return;
      }

      applyLanguage(selectedLanguage);
    });
  });

  // Chargement de la langue sauvegardée (par défaut 'fr')
  let savedLanguage = window.location.pathname.match(/\/en\//) ? 'en' : 'fr';
  try {
    savedLanguage = window.location.pathname.match(/\/(fr|en)\//)
      ? (window.location.pathname.match(/\/en\//) ? 'en' : 'fr')
      : (localStorage.getItem('portfolio-language') || 'fr');
  } catch (error) {
    console.warn('Impossible de lire la langue enregistrée :', error);
  }
  applyLanguage(savedLanguage);

  /* ----------------------------------------------------------------------------
   * 2. MODE NUIT / JOUR (DARK / LIGHT THEME)
   * ---------------------------------------------------------------------------- */

  function updateModeText() {
    if (!modeToggle) return;
    const isEnglish = document.documentElement.lang === 'en';
    const isDark = body.classList.contains('dark');

    modeToggle.textContent = isDark
      ? (isEnglish ? 'Light mode' : 'Mode Jour')
      : (isEnglish ? 'Dark mode' : 'Mode Nuit');
  }

  if (modeToggle) {
    modeToggle.addEventListener('click', () => {
      body.classList.toggle('dark');
      updateModeText();
    });
  }

  updateModeText();

  /* ----------------------------------------------------------------------------
   * 3. NAVIGATION & SCROLLSPY
   * ---------------------------------------------------------------------------- */

  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuLinks.forEach(item => item.classList.remove('active'));
      link.classList.add('active');
    });
  });

  function setActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;

    const scrollPosition = window.scrollY + window.innerHeight * 0.45;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.menu-link[href='#${id}']`);

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        menuLinks.forEach(item => item.classList.remove('active'));
        if (link) link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveSection, { passive: true });
  window.addEventListener('resize', setActiveSection, { passive: true });

  /* ----------------------------------------------------------------------------
   * 3b. ANIMATION DES ÉLÉMENTS À L’ENTRÉE DANS LA ZONE VISIBLE
   * ---------------------------------------------------------------------------- */

  const revealTargets = document.querySelectorAll([
    '.hero-quote',
    '.hero-image',
    '.panel-header',
    '.card',
    '.journey-item',
    '.soft-skill-grid article',
    '.skill-card',
    '.project-category-card',
    '.contact-card',
    '.project-gallery-card',
    '.project-detail-block',
    '.project-detail-hero',
    '.project-process article',
    '.project-gallery-strip img'
  ].join(','));

  if (revealTargets.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -6% 0px'
    });

    revealTargets.forEach((element, index) => {
      element.classList.add('scroll-reveal');
      element.style.setProperty('--reveal-order', String(index % 6));
      revealObserver.observe(element);
    });
  }

  /* ----------------------------------------------------------------------------
   * 4. CURSEUR PERSONNALISÉ INTERACTIF
   * ---------------------------------------------------------------------------- */

  if (cursorDot && cursorRing) {
    let cursorFrame = null;
    let cursorX = 0;
    let cursorY = 0;

    window.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;
      cursorX = event.clientX;
      cursorY = event.clientY;

      if (cursorFrame !== null) return;
      cursorFrame = window.requestAnimationFrame(() => {
        for (const cursor of [cursorDot, cursorRing]) {
          cursor.style.setProperty('--cursor-x', `${cursorX}px`);
          cursor.style.setProperty('--cursor-y', `${cursorY}px`);
          cursor.style.opacity = '1';
        }
        cursorFrame = null;
      });
    }, { passive: true });

    document.addEventListener('pointerover', event => {
      if (event.pointerType === 'touch' || !(event.target instanceof Element)) return;
      const target = event.target.closest(cursorHoverSelector);
      if (target && !(event.relatedTarget instanceof Node && target.contains(event.relatedTarget))) {
        body.classList.add('cursor-hover');
      }
    });

    document.addEventListener('pointerout', event => {
      if (event.pointerType === 'touch' || !(event.target instanceof Element)) return;
      const target = event.target.closest(cursorHoverSelector);
      const nextTarget = event.relatedTarget instanceof Element
        ? event.relatedTarget.closest(cursorHoverSelector)
        : null;

      if (target && target !== nextTarget) {
        body.classList.toggle('cursor-hover', Boolean(nextTarget));
      }
    });

    function hideCursor() {
      body.classList.remove('cursor-hover');
      cursorRing.style.opacity = '0';
      cursorDot.style.opacity = '0';
    }

    document.addEventListener('pointerleave', hideCursor);
    window.addEventListener('blur', hideCursor);
  }

  /* ----------------------------------------------------------------------------
   * 5. CARROUSELS DE PROJETS (.project-carousel)
   * ---------------------------------------------------------------------------- */

  document.querySelectorAll('.project-carousel').forEach(carousel => {
    const stage = carousel.querySelector('.carousel-stage');
    if (!stage) return;

    const slides = [...stage.querySelectorAll('img')];
    if (!slides.length) return;

    const caption = carousel.querySelector('.carousel-caption');
    const progress = carousel.querySelector('.carousel-progress');
    const previous = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let index = 0;
    let autoplayTimer = null;

    function getCaptionText(slideIndex) {
      const slide = slides[slideIndex];
      const isEnglish = document.documentElement.lang === 'en';
      return isEnglish
        ? (slide.dataset.captionEn || slide.dataset.caption || slide.alt)
        : (slide.dataset.caption || slide.alt);
    }

    function showSlide(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;

      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === index;
        slide.classList.toggle('active', active);
        slide.setAttribute('aria-hidden', String(!active));

        if (progress && progress.children[slideIndex]) {
          progress.children[slideIndex].classList.toggle('active', active);
          progress.children[slideIndex].setAttribute('aria-current', String(active));
        }
      });

      if (caption) {
        caption.textContent = getCaptionText(index);
      }
    }

    function startAutoplay() {
      stopAutoplay();
      if (carousel.dataset.autoplay === 'true' && !reducedMotion && slides.length > 1) {
        autoplayTimer = window.setInterval(() => showSlide(index + 1), 6500);
      }
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    // Indicateurs de progression (dots / barres)
    if (progress) {
      progress.innerHTML = '';
      slides.forEach((_, slideIndex) => {
        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.dataset.ariaFr = `Afficher le visuel ${slideIndex + 1}`;
        indicator.dataset.ariaEn = `Show visual ${slideIndex + 1}`;
        indicator.setAttribute('aria-label', indicator.dataset[document.documentElement.lang === 'en' ? 'ariaEn' : 'ariaFr']);

        indicator.addEventListener('click', () => {
          showSlide(slideIndex);
          startAutoplay();
        });

        progress.appendChild(indicator);
      });
    }

    // Boutons Suivant / Précédent
    if (previous) {
      previous.addEventListener('click', () => {
        showSlide(index - 1);
        startAutoplay();
      });
    }

    if (next) {
      next.addEventListener('click', () => {
        showSlide(index + 1);
        startAutoplay();
      });
    }

    // Navigation clavier (flèches gauche / droite)
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        showSlide(index - 1);
        startAutoplay();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        showSlide(index + 1);
        startAutoplay();
      }
    });

    // Pause au survol et au focus
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', startAutoplay);

    // Réactivité au changement de langue
    document.addEventListener('portfolio-language-change', () => {
      if (caption) caption.textContent = getCaptionText(index);
      if (progress) {
        const isEnglish = document.documentElement.lang === 'en';
        progress.querySelectorAll('button').forEach(button => {
          button.setAttribute('aria-label', button.dataset[isEnglish ? 'ariaEn' : 'ariaFr']);
        });
      }
    });

    showSlide(0);
    startAutoplay();
  });

  /* ----------------------------------------------------------------------------
   * 6. INFOBULLES DES COMPÉTENCES (SKILL TOOLTIP)
   * ---------------------------------------------------------------------------- */

  const skillTooltip = document.getElementById('skillTooltip');

  if (skillTooltip) {
    const tooltipTitle = skillTooltip.querySelector('.tooltip-title');
    const tooltipDesc = skillTooltip.querySelector('.tooltip-desc');
    const tooltipStars = skillTooltip.querySelector('.tooltip-stars');
    const skillIcons = document.querySelectorAll('.interactive-skill');

    function positionSkillTooltip(clientX, clientY) {
      const bounds = skillTooltip.getBoundingClientRect();
      const horizontalInset = 12;
      const minX = bounds.width / 2 + horizontalInset;
      const maxX = Math.max(minX, window.innerWidth - minX);
      const x = Math.max(minX, Math.min(clientX, maxX));
      const canFitAbove = clientY - bounds.height - 20 >= 8;

      skillTooltip.classList.toggle('below-pointer', !canFitAbove);
      skillTooltip.style.left = `${x}px`;
      skillTooltip.style.top = canFitAbove
        ? `${Math.min(clientY, window.innerHeight - 8)}px`
        : `${Math.max(8, Math.min(clientY + 12, window.innerHeight - bounds.height - 8))}px`;
    }

    function hideSkillTooltip() {
      skillTooltip.classList.remove('active', 'below-pointer');
    }

    function showSkillTooltip(icon, clientX, clientY) {
      const title = icon.dataset.title;
      const description = document.documentElement.lang === 'en'
        ? (icon.dataset.descEn || icon.dataset.desc)
        : icon.dataset.desc;
      const level = Number.parseInt(icon.dataset.level || '0', 10);

      if (tooltipTitle) tooltipTitle.textContent = title || '';
      if (tooltipDesc) tooltipDesc.textContent = description || '';

      if (tooltipStars) {
        tooltipStars.replaceChildren();
        for (let i = 0; i < 5; i++) {
          const star = document.createElement('div');
          star.className = `tooltip-star${i < level ? ' filled' : ''}`;
          tooltipStars.appendChild(star);
        }
      }

      skillTooltip.classList.add('active');
      positionSkillTooltip(clientX, clientY);
    }

    skillIcons.forEach(icon => {
      icon.tabIndex = 0;
      icon.setAttribute('aria-label', icon.dataset.title || '');
      icon.setAttribute('aria-describedby', skillTooltip.id);

      icon.addEventListener('pointerenter', event => {
        if (event.pointerType === 'touch') return;
        showSkillTooltip(icon, event.clientX, event.clientY);
      });

      icon.addEventListener('pointermove', event => {
        if (event.pointerType !== 'touch' && skillTooltip.classList.contains('active')) {
          positionSkillTooltip(event.clientX, event.clientY);
        }
      });

      icon.addEventListener('pointerleave', () => {
        if (document.activeElement !== icon) hideSkillTooltip();
      });

      icon.addEventListener('focus', () => {
        const bounds = icon.getBoundingClientRect();
        showSkillTooltip(icon, bounds.left + bounds.width / 2, bounds.top);
      });

      icon.addEventListener('blur', hideSkillTooltip);
    });
  }
});
