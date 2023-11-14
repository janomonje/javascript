'use strict';

///////////////////////////////////////
const nav = document.querySelector('.nav');
// scrolling

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
document.querySelector;

// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////

// Page Navigation

// document.querySelectorAll('.nav__link').forEach(element => {
//   element.addEventListener('click', event => {
//     event.preventDefault();
//     const id = event.target.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// Event delegation
// The eveent is caught from the parent and not from every link. So an event is added to the parent only.

// add event listener to the common parent element
document.querySelector('.nav__links').addEventListener('click', event => {
  event.preventDefault();

  // matching strategy
  if (event.target.classList.contains('nav__link')) {
    // class in the link not in the parent element
    //console.log('LINK');
    const id = event.target.getAttribute('href');
    //console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
///////////////////////////////////////////////////////////////////////////////

// Button Learn more

btnScrollTo.addEventListener('click', event => {
  // getting the coordinated to the element I want to scroll to
  // const s1coords = section1.getBoundingClientRect();

  // getting the coordinate of the element clicked
  //console.log(event.target.getBoundingClientRect());

  // current scroll position
  // console.log(
  //   'Current scroll position (x,y):',
  //   window.pageXOffset,
  //   window.pageYOffset
  // );

  // // height of the viewport
  // console.log(
  //   'height/width viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // Scrolling
  // current position + current scroll
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // scrolling
  section1.scrollIntoView({ behavior: 'smooth' });
});

/////////////////////////////////////////////////////////////////////////////

// Tabs components
// reading event "click" from the parent

tabsContainer.addEventListener('click', event => {
  const clicked = event.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );

  // Active tab
  clicked.classList.add('opereations__tab--active');

  // Active content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////////////////////////////////////////

// Menu fade animation
const handleHover = (event, opacity) => {
  if (event.target.classList.contains('nav__link')) {
    const link = event.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(element => {
      if (element !== link) element.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
};

nav.addEventListener('mouseover', event => {
  handleHover(event, 0.5);
});
nav.addEventListener('mouseout', event => {
  handleHover(event, 1);
});

//////////////////////////////////////////////////////////////////////////

// Sticky Navigation: Intersection observer API

// this function will be called with two argument, the entries and the observer.
// const observerCallback = (entries, observer) => {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// /* This object needs a root property, this root is the element that the target is intersecting.
// Second, a threshold is needed. This threshold is the % of intersection at which the observer callback will be call*/
// const observerOptions = {
//   root: null,
//   threshold: [0, 0.2], //0 and 20%
// };

// const observer = new IntersectionObserver(observerCallback, observerOptions);
// observer.observe(section1); // the observer keeps an eye on section1

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = entries => {
  const [entry] = entries;
  //console.log(entries);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, // width of the navbar!
});
headerObserver.observe(header);

//////////////////////////////////////////////////////////////////////////////

// Reveal Sections
const allSection = document.querySelectorAll('.section');
const revealSection = (entries, observer) => {
  const [entry] = entries;
  //console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSection.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//////////////////////////////////////////////////////////////////////////

// Lazy loading images
const imageTarget = document.querySelectorAll('img[data-src]');
console.log(imageTarget);

const loadImage = (entries, observer) => {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });
};

const imgObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
  rootMargin: ' 200px',
});

imageTarget.forEach(image => imgObserver.observe(image));

////////////////////////////////////////////////////////////////////////////////////

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let currentSlide = 0;
  const maxSlide = slides.length;

  // Functions

  const createDots = () => {
    slides.forEach((_, index) =>
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${index}"></button>`
      )
    );
  };

  // deactivating dots first
  const activeDots = slide => {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    // activating based on the data-slide attribute.
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  // Slider

  const goToslide = slide => {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  // Next Slide
  const nextSlide = () => {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToslide(currentSlide);
    activeDots(currentSlide);
  };

  const previousSlide = () => {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }
    goToslide(currentSlide);
    activeDots(currentSlide);
  };

  // initialization functions
  const init = function () {
    goToslide(0);
    createDots();
    activeDots(0); // So when page is loaded for the first time the first dot is activated!
  };

  init();
  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', previousSlide);

  document.addEventListener('keydown', event => {
    console.log(event);
    if (event.key === 'ArrowLeft') previousSlide();
    event.key === 'ArrowRight' && nextSlide(); // same with short circuit!
  });

  // syncronizing dots

  dotContainer.addEventListener('click', event => {
    if (event.target.classList.contains('dots__dot')) {
      const { slide } = event.target.dataset; // de-structuring;
      goToslide(slide);
      console.log(slide);
      activeDots(slide);
    }
  });
};

slider();

////////////////////////
////////////////////////
////////////////////////
/*
// SELECTING ELEMENTS
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header'); // selects the first element with that class
const allSection = document.querySelectorAll('.section'); // select all the elements with that class
console.log(allSection);

document.getElementById('section--1');
const allButtons = document.getElementsByName('button'); // selects all elements with the tag button

console.log(document.getElementsByClassName('btn'));

/////////////////////////////////////////////////////////////////////////

// CREATING AND INSERTING ELEMESTS

//.insertAdjacentHTML

const message = document.createElement('div'); // creates a DOM element
message.classList.add('cookie-message'); // adding class to the created element
message.textContent = 'We use cokkies to improve functionality and analytics.';
message.innerHTML =
  'We use cokkies to improve functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
// header.prepend(message); // appends the "message" element as the FIRST child of the selected element.
// header.append(message.cloneNode(true));
header.append(message); // appends the "message" element as the LAST child of the selected element.

// header.before(message) // inserts it before the header as a sibling
// header.after(message) // inserts it after the header as a sibling

// Delete element

document.querySelector('.btn--close-cookie').addEventListener('click', () => {
  message.remove();
});

// Styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.color);
console.log(message.style.backgroundColor);

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

// aadding 30px to the height of the element
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// selects the whole document, and changes the color of that property in all the elements that are using it
document.documentElement.style.setProperty('--color-primary', 'blue');

// Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src); // absolute
console.log(logo.getAttribute('src')); // relative

//non-standard
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist');

const link = document.querySelector('.nav__link--btn');
console.log(link.href); // absolute value

// Data attributes
console.log(logo.dataset.versionNumber); // we replace the "-" for camel-case

// Classes

logo.classList.add();
logo.classList.remove();
logo.classList.toggle("c");
logo.classList.contains('c');


// smooth scrolling

const btnScrollTo = document.querySelector('.btn--scroll-to');
// scrolling
const section1 = document.querySelector('#section--1');const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', event => {
  // getting the coordinated to the element I want to scroll to
  const s1coords = section1.getBoundingClientRect();

  // getting the coordinate of the element clicked
  //console.log(event.target.getBoundingClientRect());

  // current scroll position
  console.log(
    'Current scroll position (x,y):',
    window.pageXOffset,
    window.pageYOffset
  );

  // height of the viewport
  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Scrolling
  // current position + current scroll
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // scrolling
  section1.scrollIntoView({ behavior: 'smooth' });
});section1.scrollIntoView({ behavior: 'smooth' });
});

//Events

const h1 = document.querySelector('h1');
const alertH1 = event => {
  alert('addEventListener: Great! You are reading the header');
  // so the event gets remove once it gets ececuted
  //h1.removeEventListener('mouseenter', alertH1);
};
h1.addEventListener('mouseenter', alertH1);

// removing the event after a  set time (3 sec)
setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);


//Event propagation

//rgb(255,255,255);

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
console.log(randomColor(0, 255));

document
  .querySelector('.nav__link')
  .addEventListener('click', function (event) {
    this.style.backgroundColor = randomColor();
    console.log('LINK', event.target);
    console.log(event.currentTarget === this);
  });

document
  .querySelector('.nav__links')
  .addEventListener('click', function (event) {
    this.style.backgroundColor = randomColor();
    console.log('CONTAINER', event.target);
    console.log(event.currentTarget === this);
  });

document.querySelector('.nav').addEventListener('click', function (event) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', event.target);
  console.log(event.currentTarget === this);
});

/////////////////////////////////////////////////////////////////

// DOM TRAVERSING

const h1 = document.querySelector('h1');

// Going downwards: child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'blue';
h1.lastElementChild.style.color = 'red';

// Going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)';

// Going sideways: selecting siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);
console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(element => {
  if(element !== h1) element.style.transform='scale(0.5)'
})


// Lifecycle of the DOM

document.addEventListener('DOMContentLoaded', event => {
  console.log('HTML parsed and DOM tree built!', event);
});

window.addEventListener('load', event => {
  console.log('Page fully loaded', event);
});

window.addEventListener('beforeunload', event => {
  event.preventDefault();
  console.log(event);
  event.returnValue = '';
});
*/