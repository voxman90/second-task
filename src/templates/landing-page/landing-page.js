'use strict';

(function (window, document) {
  const imageClass = [
    'landing__image-first',
    'landing__image-second',
    'landing__image-third',
  ];

  const Selector = {
    MAIN : '.landing__bg-image',
  }

  function attachRandomImageToMain() {
    const main = document.querySelector(Selector.MAIN);
    const randomImageClass = getRandomClass(imageClass);
    main.classList.add(randomImageClass);
  }

  function getRandomClass(classList) {
    const length = classList.length;
    const classNumber = getRandomNumber(length);
    const randomClass = classList[classNumber];
    return randomClass;
  }
  
  function getRandomNumber(x) {
    return Math.floor(Math.random() * x);
  }

  document.addEventListener('DOMContentLoaded', () => {
    attachRandomImageToMain();
  })
})(window, document);