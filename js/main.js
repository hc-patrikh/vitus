'use strict';

/* =====================================================
   Divadlo Vitus — hlavní JavaScript
   - Mobilní menu (hamburger)
   - Zvýraznění aktivní sekce v navigaci
   - Lightbox pro fotogalerii
   ===================================================== */

// ─── KONFIGURACE ─────────────────────────────────────────────────────────────

const CONFIG = {
  comingSoon: true,  // true = zobrazit pouze hero + „Stránky se připravují..."
};

if (CONFIG.comingSoon) {
  document.body.classList.add('coming-soon');
}

// ─── MOBILNÍ MENU ────────────────────────────────────────────────────────────

const siteHeader = document.getElementById('site-header');
const navToggle  = document.querySelector('.nav-toggle');
const navMenu    = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  navToggle.classList.toggle('is-open', !isOpen);
  navMenu.classList.toggle('is-open', !isOpen);
});

// Zavřít menu klikem na odkaz
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.classList.remove('is-open');
    navMenu.classList.remove('is-open');
  });
});

// ─── SCROLL — stav headeru a aktivní odkaz ───────────────────────────────────

window.addEventListener('scroll', () => {
  siteHeader.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-menu a[href^="#"]');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.remove('active'));
    const active = document.querySelector(`.nav-menu a[href="#${entry.target.id}"]`);
    if (active) active.classList.add('active');
  });
}, {
  // Označit sekci jako aktivní, když její horní třetina překryje střed viewportu
  rootMargin: '-15% 0px -60% 0px',
});

sections.forEach(s => sectionObserver.observe(s));

// ─── ROK V PATIČCE ───────────────────────────────────────────────────────────

const footerYear = document.getElementById('footer-year');
if (footerYear) footerYear.textContent = new Date().getFullYear();

// ─── LIGHTBOX ────────────────────────────────────────────────────────────────

const lightbox      = document.getElementById('lightbox');
const lightboxImg   = lightbox.querySelector('.lightbox-img');
const lightboxClose = lightbox.querySelector('.lightbox-close');
const lightboxPrev  = lightbox.querySelector('.lightbox-prev');
const lightboxNext  = lightbox.querySelector('.lightbox-next');
const galleryGrid   = document.querySelector('.gallery-grid');

let galleryImages = [];
let currentIndex  = 0;

function collectImages() {
  galleryImages = Array.from(galleryGrid.querySelectorAll('.gallery-img'));
}

function openLightbox(index) {
  collectImages();
  if (!galleryImages.length) return;
  currentIndex = index;
  const img = galleryImages[currentIndex];
  // data-full umožňuje zobrazit větší verzi než je thumbnail
  lightboxImg.src = img.dataset.full ?? img.src;
  lightboxImg.alt = img.alt;
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
  refreshNavButtons();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
  // Vrátit focus na obrázek, který lightbox otevřel
  galleryImages[currentIndex]?.focus();
}

function showPrev() {
  openLightbox((currentIndex - 1 + galleryImages.length) % galleryImages.length);
}

function showNext() {
  openLightbox((currentIndex + 1) % galleryImages.length);
}

function refreshNavButtons() {
  const multiple = galleryImages.length > 1;
  lightboxPrev.hidden = !multiple;
  lightboxNext.hidden = !multiple;
}

// Klik na obrázek v galerii
galleryGrid.addEventListener('click', e => {
  const img = e.target.closest('.gallery-img');
  if (!img) return;
  collectImages();
  openLightbox(galleryImages.indexOf(img));
});

// Ovládání lightboxu
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrev);
lightboxNext.addEventListener('click', showNext);

// Klik mimo obrázek zavře lightbox
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

// Klávesnice
document.addEventListener('keydown', e => {
  if (lightbox.hidden) return;
  switch (e.key) {
    case 'Escape':    closeLightbox(); break;
    case 'ArrowLeft': showPrev();      break;
    case 'ArrowRight':showNext();      break;
  }
});
