(function () {
  'use strict';

  function initCarousel(root) {
    const viewport = root.querySelector('.carousel-viewport');
    const track = root.querySelector('.carousel-track');
    const slides = root.querySelectorAll('.carousel-slide');
    const prevBtn = root.querySelector('.carousel-prev');
    const nextBtn = root.querySelector('.carousel-next');
    const dotsContainer = root.querySelector('.carousel-dots');

    if (!viewport || !track || !slides.length) return;

    let index = 0;
    let timer = null;
    let paused = false;
    const interval = parseInt(root.getAttribute('data-autoplay'), 10) || 5000;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const autoplayEnabled = interval > 0 && !reducedMotion;

    function goTo(i) {
      index = ((i % slides.length) + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + index * 100 + '%)';
      slides.forEach(function (slide, j) {
        slide.setAttribute('aria-hidden', j !== index ? 'true' : 'false');
      });
      if (dotsContainer) {
        dotsContainer.querySelectorAll('.carousel-dot').forEach(function (dot, j) {
          const active = j === index;
          dot.classList.toggle('active', active);
          dot.setAttribute('aria-selected', active ? 'true' : 'false');
        });
      }
    }

    function next() {
      goTo(index + 1);
    }

    function prev() {
      goTo(index - 1);
    }

    function resetTimer() {
      if (!autoplayEnabled) return;
      clearInterval(timer);
      timer = setInterval(function () {
        if (!paused) next();
      }, interval);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        prev();
        resetTimer();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        next();
        resetTimer();
      });
    }

    if (dotsContainer) {
      dotsContainer.querySelectorAll('.carousel-dot').forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          goTo(i);
          resetTimer();
        });
      });
    }

    root.addEventListener('mouseenter', function () {
      paused = true;
    });
    root.addEventListener('mouseleave', function () {
      paused = false;
    });
    root.addEventListener('focusin', function () {
      paused = true;
    });
    root.addEventListener('focusout', function (e) {
      if (!root.contains(e.relatedTarget)) paused = false;
    });

    goTo(0);
    resetTimer();
  }

  function initCarousels() {
    document.querySelectorAll('[data-autoplay]').forEach(initCarousel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousels);
  } else {
    initCarousels();
  }
})();
