'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//////////////////////// create element /////////////////
const header = document.querySelector('.header');
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  'We you cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// header.prepend(message);
// header.append(message);
// header.before(message);
header.after(message);

// Delete elements
document.querySelector('.btn--close-cookie').addEventListener('click', () => {
  message.remove();
});

//! Style
// console.log(getComputedStyle(message).color);

// Change property a :root
// document.documentElement.style.setProperty('--color-primary', 'orangered');

// Smooth scrolling
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', e => {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  // C1:
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // C2
  section1.scrollIntoView({ behavior: 'smooth' });
});

//! Page navigation
//? C1:
// document.querySelectorAll('.nav__link').forEach(el => {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//? C2:
document.querySelector('.nav__links').addEventListener('click', e => {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//! Tabbed components
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) {
    return;
  }

  tabs.forEach((tab, i) => {
    tab.classList.remove('operations__tab--active');
    tabsContent[i].classList.remove('operations__content--active');
  });

  clicked.classList.add('operations__tab--active');

  //? Remove activate content
  // tabsContent.forEach(tab =>
  //   tab.classList.remove('operations__content--active')
  // );

  //?activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//! Menu fade animation
const nav = document.querySelector('.nav');

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

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

//!Sticky navigation
//? one way
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', () => {
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

//? two way
const stickyNav = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else nav.classList.remove('sticky');
};

const navHeight = nav.getBoundingClientRect().height;

const obsOption = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const headerObserver = new IntersectionObserver(stickyNav, obsOption);
headerObserver.observe(header);

//! Reveal sections
const allSection = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
});

allSection.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

//! Lazy loading images
const imgTarget = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  console.log(entries);
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 1,
});
imgTarget.forEach(img => imgObserver.observe(img));

//!  Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const slider = document.querySelector('.slider');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const dotsContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  const createDot = function () {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `
      <button class="dots__dot" data-slide=${i}></button>
    `
      );
    });
  };

  const activeDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });

    const dot = document.querySelector(`.dots__dot[data-slide="${slide}"]`);
    dot.classList.add('dots__dot--active');
  };

  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * i}%)`;
  });

  const goToSlide = function (curSlide) {
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${100 * (i - curSlide)}%)`;
    });
  };

  const nextSlide = function () {
    if (curSlide === slides.length - 1) {
      curSlide = 0;
    } else curSlide++;
    goToSlide(curSlide);
    activeDot(curSlide);
  };

  const preSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else curSlide--;

    goToSlide(curSlide);
    activeDot(curSlide);
  };

  const init = function () {
    createDot();
    goToSlide(0);
    activeDot(0);
  };
  init();

  btnRight.addEventListener('click', nextSlide);
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') {
      nextSlide();
    }
  });

  btnLeft.addEventListener('click', preSlide);
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') {
      preSlide();
    }
  });

  dotsContainer.addEventListener('click', e => {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activeDot(slide);
    }
  });
};
slider();

//!
// // RandomInt
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// // Random color
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('link');
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('links');
// });
