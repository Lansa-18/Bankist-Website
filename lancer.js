'use strict';
/// SELECTING ELEMENTS //

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////// FUNCTIONS /////////////////////////////

// MODAL WINDOW //
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// OBSERVER FUNCTIONS //

const stickyNav = entries => {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const revealSection = (entries, observer) => {
  const [entry] = entries;

  // Guard Clause
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  // UnObserving the Sections
  observer.unobserve(entry.target);
};

const loadImg = (entries, observer) => {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replacing the src attribute with the data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

//////////////// APPLICATIONS //////////////////

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// BUTTON SCROLLING //
btnScrollTo.addEventListener('click', e => {
  section1.scrollIntoView({
    behavior: 'smooth',
  });
});

// PAGE NAVIGATION
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
    });
  }
});

// Tabbed Component
tabsContainer.addEventListener('click', e => {
  e.preventDefault();

  // Getting the Matching strategy
  const clicked = e.target.closest('.operations__tab');

  // Guard Clause
  if (!clicked) return;

  // removing active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Active tab
  clicked.classList.add('operations__tab--active');

  // Activating Content Area/Information
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//   MENU FADE ANIMATION
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect();

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight.height}px`,
});
headerObserver.observe(header);

// REVEALING SECTIONS
const allSections = document.querySelectorAll('.section');
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// LAZY LOADING IMAGES
const imgTarget = document.querySelectorAll('img[data-src]');

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTarget.forEach(img => imgObserver.observe(img));

// IMPLEMENTING THE SLIDER COMPONENT //
const sliderFxn = function () {
  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length - 1;

  const createDots = () => {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(d => d.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  const nextSlide = () => {
    if (curSlide === maxSlide) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = () => {
    if (curSlide === 0) {
      curSlide = maxSlide;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Initializinng the Slider
  const init = () => {
    // putting all the slides side by side and activating the DOT functionality
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // Moving to the next slide
  btnRight.addEventListener('click', nextSlide);

  // Moving to the previous slide
  btnLeft.addEventListener('click', prevSlide);

  // Enabling the slider functionality with the left and arrow keys
  document.addEventListener('keydown', e => {
    e.key === 'ArrowLeft' && prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  // Implementing the slider functionality on pagination
  dotContainer.addEventListener('click', e => {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
sliderFxn();



// LIFECYCLE DOM EVENTS
// The event gets fired when the HTML Markup as well as the script has loaded.
document.addEventListener('DOMContentLoaded', (e) =>{
  console.log('HTML PARSED AND DOM TREE BUILT', e);
})

// This event gets fired when everything on from the HTML markup to the external css libraries to scripts are all loaded. It is fired on the window object
window.addEventListener('load', (e) => {
  console.log('Page fully loaded', e);
})

// This event gets fired on the window object, it is created immediately before the user is about to leave a page

// THIS FEATURE SHOULD NOT BE ABUSED OR USED ANYHOW, IT SHOULD ONLY BE USED AS A SAFETY MEASURE TO PREVENT SOME SORT OF DATA LOSS.

// window.addEventListener('beforeunload', e => {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// })

// EFFICENT SCRIPT LOADING
// Async and Defer Attribute.
// The async and defer attribut have no pratical effect in the body.
// ONLY MODERN BROWSERS SUPPORT THE ASYNC AND DEFER ATTRIBUTES
// Overall, using the defer attribute in the script tag (placed in the head tag) is the BEST OPTION.
// The async attribute should be used for 3rd party scripts where order doesn't matter.
