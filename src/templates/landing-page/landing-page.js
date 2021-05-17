'use strict';

(function (document) {
  const imageClass = [
    'img-first',
    'img-second',
    'img-third',
  ];

  const Selector = {
    BACKGROUND: '.bg__image',
  }

  function attachRandomImageToBackground() {
    const bg = document.querySelector(Selector.BACKGROUND);
    const randomImageClass = getRandomClass(imageClass);
    bg.classList.add(randomImageClass);
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

  document.addEventListener('DOMContentLoaded', () => attachRandomImageToBackground());
})(document);
