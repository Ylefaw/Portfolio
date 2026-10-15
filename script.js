const body = document.body;
const modeToggle = document.getElementById('modeToggle');
const menuLinks = document.querySelectorAll('.menu-link');
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
const interactiveElements = document.querySelectorAll('.interactive-hover, button, a, .skill-card, .work-card, .contact-card');

function updateModeText() {
  modeToggle.textContent = body.classList.contains('dark') ? 'Mode Jour' : 'Mode Nuit';
}

modeToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  updateModeText();
});

menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    menuLinks.forEach(item => item.classList.remove('active'));
    link.classList.add('active');
  });
});

function setActiveSection() {
  const sections = document.querySelectorAll('section[id]');
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

window.addEventListener('scroll', setActiveSection);
window.addEventListener('resize', setActiveSection);

window.addEventListener('mousemove', (event) => {
  const x = event.clientX;
  const y = event.clientY;
  cursorDot.style.transform = `translate(${x}px, ${y}px)`;
  cursorRing.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
  const hue = (x / window.innerWidth) * 120 + (y / window.innerHeight) * 80;
  cursorRing.style.borderColor = `hsla(${hue}, 82%, 72%, 0.95)`;
  cursorRing.style.boxShadow = `0 0 24px hsla(${hue}, 85%, 68%, 0.45)`;
  cursorDot.style.background = `radial-gradient(circle, hsla(${hue}, 88%, 72%, 1) 0%, rgba(255,255,255,0.9) 55%)`;
});

interactiveElements.forEach(element => {
  element.addEventListener('pointerenter', () => body.classList.add('cursor-hover'));
  element.addEventListener('pointerleave', () => body.classList.remove('cursor-hover'));
});

// Enhanced keyboard navigation for carousels
function enableCarouselKeyboardNav(trackId, prevId, nextId) {
  const track = document.getElementById(trackId);
  const prev = document.getElementById(prevId);
  const next = document.getElementById(nextId);
  if (!track) return;
  
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && prev) { prev.click(); e.preventDefault(); }
    if (e.key === 'ArrowRight' && next) { next.click(); e.preventDefault(); }
  });
  
  track.setAttribute('role', 'region');
  track.setAttribute('aria-label', 'Carousel slides');
  track.setAttribute('tabindex', '0');
}

document.addEventListener('mouseleave', () => {
  cursorRing.style.opacity = '0';
  cursorDot.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
  cursorRing.style.opacity = '1';
  cursorDot.style.opacity = '1';
});

// Intersection Observer for scroll animations
if ('IntersectionObserver' in window) {
  const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -100px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.card, .work-card, .skill-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

updateModeText();

const siteLogoCarousel = document.getElementById('siteLogoCarousel');
const siteLogoButtons = document.querySelectorAll('.site-logo-slide');
const siteTitle = document.getElementById('siteTitle');
const siteText = document.getElementById('siteText');
const siteTechIcons = document.getElementById('siteTechIcons');
const galleryTrack = document.getElementById('siteGalleryTrack');
const galleryCaption = document.getElementById('siteGalleryCaption');
const galleryPrev = document.getElementById('siteGalleryPrev');
const galleryNext = document.getElementById('siteGalleryNext');
const logoPrev = document.getElementById('siteLogoPrev');
const logoNext = document.getElementById('siteLogoNext');
const siteGalleryDots = document.getElementById('siteGalleryDots');
const posterDots = document.getElementById('posterDots');
const videoDots = document.getElementById('videoDots');

const siteProjects = {
  AquaSite: {
    title: 'AquaSite',
    techIcons: [
      './Image_skills/HTML.png',
      './Image_skills/CSS.png',
      './Image_skills/PHP.png',
      './Image_skills/symfony.png',
      './Image_skills/JS.png',
      './Image_skills/SQL.png'
    ],
    desc: 'AquaSite a été réalisé avec HTML, CSS, PHP, Symfony, JavaScript et SQL. Ce projet présente une interface responsive, un espace administration et des pages de gestion de l’aquarium.',
    url: 'https://example.com/aquasite',
    images: [
      './Image_works/Dev_Web/AquaSite/Accueil_Aquarium.png',
      './Image_works/Dev_Web/AquaSite/Connexion_Aquarium.png',
      './Image_works/Dev_Web/AquaSite/Donnees_Aquarium.png',
      './Image_works/Dev_Web/AquaSite/Infos_Aquarium.png'
    ]
  },
  IDBaali: {
    title: 'IDBaali',
    techIcons: [
      './Image_skills/HTML.png',
      './Image_skills/CSS.png',
      './Image_skills/PHP.png',
      './Image_skills/symfony.png',
      './Image_skills/JS.png',
      './Image_skills/SQL.png'
    ],
    desc: 'IDBaali a été réalisé avec HTML, CSS, PHP, Symfony, JavaScript et SQL. Ce site inclut une gestion utilisateur, un back-office et une présentation dynamique des créations.',
    url: 'https://example.com/idbaali',
    images: [
      './Image_works/Dev_Web/IDBaali/Accueil_IDBaali.png',
      './Image_works/Dev_Web/IDBaali/Utilisateur_IDBaali.png',
      './Image_works/Dev_Web/IDBaali/Creation_IDBaali.png',
      './Image_works/Dev_Web/IDBaali/Administration_IDBaali.png'
    ]
  },
  UniGen: {
    title: 'UniGen',
    techIcons: [
      './Image_skills/HTML.png',
      './Image_skills/CSS.png'
    ],
    desc: 'UniGen a été réalisé uniquement avec HTML et CSS. Le projet présente une page d’accueil, une section activités et une courte description du concept.',
    url: 'https://example.com/unigen',
    images: [
      './Image_works/Dev_Web/UniGen/Accueil_Unigen.png',
      './Image_works/Dev_Web/UniGen/Activites_Unigen.png',
      './Image_works/Dev_Web/UniGen/Propos_Unigen.png',
      './Image_works/Dev_Web/UniGen/Soutenir_Unigen.png'
    ]
  }
};

let currentSite = 'AquaSite';
let currentGalleryIndex = 0;
let siteCarousel = null;

function createCarousel(track, prev, next, dots, onChange, options = {}) {
  const slides = [...track.children];
  let index = 0;
  let autoplayId = null;
  const delay = options.autoplayDelay || 4800;

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('active', slideIndex === index);
      slide.setAttribute('aria-current', slideIndex === index ? 'true' : 'false');
    });
    if (dots) setActiveDots(dots, index);
    if (typeof onChange === 'function') onChange(index);
    
    // Update ARIA live region
    const liveRegion = track.getAttribute('aria-live');
    if (liveRegion) {
      track.setAttribute('aria-label', `Slide ${index + 1} of ${slides.length}`);
    }
  }

  function goTo(i) {
    if (!slides.length) return;
    index = (i + slides.length) % slides.length;
    update();
  }

  function clearAutoplay() {
    if (autoplayId) {
      clearInterval(autoplayId);
      autoplayId = null;
    }
  }

  function startAutoplay() {
    clearAutoplay();
    if (!options.autoplay || slides.length <= 1) return;
    autoplayId = setInterval(() => {
      goTo(index + 1);
    }, delay);
  }

  if (prev) prev.addEventListener('click', () => {
    goTo(index - 1);
    if (options.autoplay && options.pauseOnInteraction) startAutoplay();
  });
  if (next) next.addEventListener('click', () => {
    goTo(index + 1);
    if (options.autoplay && options.pauseOnInteraction) startAutoplay();
  });

  track.style.transform = `translateX(0)`;
  track.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
  track.style.display = 'flex';
  track.setAttribute('role', 'region');
  track.setAttribute('aria-live', 'polite');
  track.setAttribute('aria-label', `Carousel with ${slides.length} slides`);

  if (dots) {
    dots.innerHTML = '';
    slides.forEach((_, slideIndex) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Go to slide ${slideIndex + 1}`);
      dot.addEventListener('click', () => {
        goTo(slideIndex);
        if (options.autoplay && options.pauseOnInteraction) startAutoplay();
      });
      dots.appendChild(dot);
    });
  }

  if (options.pauseOnHover && !track.dataset.carouselHoverAttached) {
    track.addEventListener('mouseenter', clearAutoplay);
    track.addEventListener('mouseleave', startAutoplay);
    track.dataset.carouselHoverAttached = 'true';
  }

  update();
  if (options.autoplay) startAutoplay();

  return {
    goTo,
    destroy: clearAutoplay
  };
}

function renderSiteGallery() {
  const project = siteProjects[currentSite];
  galleryTrack.innerHTML = project.images.map((src, index) => `
    <a href="${project.url || '#'}" target="_blank" rel="noreferrer" class="gallery-card${index === 0 ? ' active' : ''}" style="text-decoration:none;">
      <img loading="lazy" src="${src}" alt="${project.title} capture ${index + 1}">
    </a>
  `).join('');
  currentGalleryIndex = 0;
  if (siteCarousel && typeof siteCarousel.destroy === 'function') {
    siteCarousel.destroy();
    siteCarousel = null;
  }
  siteCarousel = createCarousel(
    galleryTrack,
    null,
    null,
    siteGalleryDots,
    (newIndex) => {
      currentGalleryIndex = newIndex;
      updateGalleryCaption();
    },
    { autoplay: true, autoplayDelay: 5200, pauseOnHover: true, pauseOnInteraction: true }
  );

  updateGalleryCaption();
}

function setActiveDots(container, activeIndex) {
  if (!container) return;
  const dots = container.querySelectorAll('.carousel-dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === activeIndex);
  });
}

function updateGalleryCaption() {
  const project = siteProjects[currentSite];
  galleryCaption.textContent = `${project.title} — ${currentGalleryIndex + 1}/${project.images.length}`;
}

function updateSiteSelection(site) {
  currentSite = site;
  siteLogoButtons.forEach(button => {
    button.classList.toggle('active', button.dataset.site === site);
  });
  const project = siteProjects[site];
  siteTitle.textContent = project.title;
  siteText.textContent = project.desc;
  siteTechIcons.innerHTML = project.techIcons.map(src => `
    <img loading="lazy" src="${src}" alt="Compétence ${src.split('/').pop().replace('.png', '')}">
  `).join('');
  renderSiteGallery();
}

siteLogoButtons.forEach(button => {
  button.addEventListener('click', () => {
    updateSiteSelection(button.dataset.site);
  });
});

logoPrev.addEventListener('click', () => {
  const currentIdx = Array.from(siteLogoButtons).findIndex(b => b.dataset.site === currentSite);
  const nextIdx = (currentIdx - 1 + siteLogoButtons.length) % siteLogoButtons.length;
  siteLogoButtons[nextIdx].click();
  siteLogoButtons[nextIdx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
});

logoNext.addEventListener('click', () => {
  const currentIdx = Array.from(siteLogoButtons).findIndex(b => b.dataset.site === currentSite);
  const nextIdx = (currentIdx + 1) % siteLogoButtons.length;
  siteLogoButtons[nextIdx].click();
  siteLogoButtons[nextIdx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
});

galleryPrev.addEventListener('click', () => {
  if (siteCarousel) siteCarousel.goTo(currentGalleryIndex - 1);
});

galleryNext.addEventListener('click', () => {
  if (siteCarousel) siteCarousel.goTo(currentGalleryIndex + 1);
});

galleryTrack.addEventListener('click', (event) => {
  const slide = event.target.closest('.gallery-card');
  if (!slide || !siteCarousel) return;
  const slidesArray = [...galleryTrack.children];
  const slideIndex = slidesArray.indexOf(slide);
  if (slideIndex !== -1) siteCarousel.goTo(slideIndex + 1);
});

function setupCarousel(trackId, prevId, nextId, selector, dotsId, options = {}) {
  const track = document.getElementById(trackId);
  const prev = document.getElementById(prevId);
  const next = document.getElementById(nextId);
  const dotsContainer = dotsId ? document.getElementById(dotsId) : null;
  if (!track || !prev || !next) return;

  createCarousel(track, prev, next, dotsContainer, null, options);
}

setupCarousel('posterTrack', 'posterPrev', 'posterNext', '.poster-slide', 'posterDots', { autoplay: true, autoplayDelay: 7600, pauseOnHover: true, pauseOnInteraction: true });
setupCarousel('videoTrack', 'videoPrev', 'videoNext', '.video-slide', 'videoDots', { autoplay: false });
enableCarouselKeyboardNav('siteGalleryTrack', 'siteGalleryPrev', 'siteGalleryNext');
enableCarouselKeyboardNav('posterTrack', 'posterPrev', 'posterNext');
enableCarouselKeyboardNav('videoTrack', 'videoPrev', 'videoNext');
updateSiteSelection(currentSite);

const p5Container = document.getElementById('p5Container');

if (window.p5 && p5Container) {
  new p5((p) => {
    const particles = [];
    const count = 12;

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.pos = p.createVector(p.random(p.width), p.random(p.height));
        this.vel = p.createVector(p.random(-0.4, 0.4), p.random(-0.4, 0.4));
        this.radius = p.random(8, 26);
        this.hue = p.random(220, 320);
        this.phase = p.random(p.TWO_PI);
      }

      update() {
        this.phase += 0.008;
        this.pos.add(this.vel);
        if (this.pos.x < -this.radius) this.pos.x = p.width + this.radius;
        if (this.pos.x > p.width + this.radius) this.pos.x = -this.radius;
        if (this.pos.y < -this.radius) this.pos.y = p.height + this.radius;
        if (this.pos.y > p.height + this.radius) this.pos.y = -this.radius;
      }

      draw(index) {
        const hue = (this.hue + p.sin(p.frameCount * 0.01 + index) * 40) % 360;
        p.stroke(`hsla(${hue}, 82%, 64%, 0.28)`);
        p.strokeWeight(2);
        p.noFill();
        const next = particles[(index + 1) % particles.length];
        p.bezier(
          this.pos.x,
          this.pos.y,
          this.pos.x + p.cos(this.phase) * 180,
          this.pos.y + p.sin(this.phase) * 120,
          next.pos.x - p.sin(next.phase) * 180,
          next.pos.y - p.cos(next.phase) * 120,
          next.pos.x,
          next.pos.y
        );

        p.fill(`hsla(${hue}, 88%, 74%, 0.65)`);
        p.noStroke();
        p.circle(this.pos.x, this.pos.y, this.radius * 0.14);
      }
    }

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.pixelDensity(1);
      for (let i = 0; i < count; i += 1) particles.push(new Particle());
      p.clear();
    };

    p.draw = () => {
      p.clear();
      p.background(15, 20, 32, 12);
      particles.forEach((particle, index) => {
        particle.update();
      });
      particles.forEach((particle, index) => particle.draw(index));
    };

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
      particles.length = 0;
      for (let i = 0; i < count; i += 1) particles.push(new Particle());
    };
  }, p5Container);
}

// --- AMÉLIORATIONS JS ---

// 1. Modal Image
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const closeModalBtn = document.getElementById('closeModal');

if (imageModal && modalImage && closeModalBtn) {
  // Modal functionality disabled in favor of direct links
}

// 2. Tooltip Compétences
const skillTooltip = document.getElementById('skillTooltip');
if (skillTooltip) {
  const tooltipTitle = skillTooltip.querySelector('.tooltip-title');
  const tooltipDesc = skillTooltip.querySelector('.tooltip-desc');
  const tooltipStars = skillTooltip.querySelector('.tooltip-stars');

  const skillIcons = document.querySelectorAll('.interactive-skill');

  skillIcons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
      const title = icon.getAttribute('data-title');
      const desc = icon.getAttribute('data-desc');
      const level = parseInt(icon.getAttribute('data-level') || '0', 10);
      
      tooltipTitle.textContent = title;
      tooltipDesc.textContent = desc;
      
      // Générer les étoiles
      tooltipStars.innerHTML = '';
      for(let i = 0; i < 5; i++) {
        const star = document.createElement('div');
        star.className = 'tooltip-star' + (i < level ? ' filled' : '');
        tooltipStars.appendChild(star);
      }
      
      skillTooltip.classList.add('active');
    });
    
    icon.addEventListener('mousemove', (e) => {
      skillTooltip.style.left = e.clientX + 'px';
      skillTooltip.style.top = e.clientY + 'px';
    });
    
    icon.addEventListener('mouseleave', () => {
      skillTooltip.classList.remove('active');
    });
  });
}

