'use strict';

import { BEMComponent } from 'scripts/BEMComponent';

const LikeButton = ((document) => {
  const ClassName = {
    ROOT : 'js-like-button',
  };

  const Selector = {
    COUNTER : '.js-like-button__counter',
    INPUT   : '.js-like-button__input',
  }

  class LikeButton extends BEMComponent {
    constructor(element) {
      super(element, 'like-button');

      this._connectBasis();

      this.listeners = this._defineEventListeners();
      this.attachMultipleEventListeners(this.listeners);
    }

    check() {
      this._input.checked = true;
    }

    uncheck() {
      this._input.checked = false;
    }

    setNumberOfLikes(count) {
      this._input.setAttribute('value', count);
      this._counter.textContent = count;
    }

    getNumberOfLikes() {
      return parseInt(this._input.getAttribute('value'));
    }

    _connectBasis() {
      this._input = this.root.querySelector(Selector.INPUT);
      this._counter = this.root.querySelector(Selector.COUNTER);
    }

    handleLikeButtonClick = () => {
      let count = this.getNumberOfLikes();

      if (this._input.checked) {
        count += 1;
        this.setNumberOfLikes(count);
      } else {
        count -= 1;
        this.setNumberOfLikes(count);
      }
    }

    _defineEventListeners() {
      return [
        {
          element: this.root,
          event: 'change',
          handler: this.handleLikeButtonClick,
        },
      ];
    }
  }

  const initLikeButtonComps = BEMComponent.makeAutoInitializer(
    LikeButton,
    ClassName.ROOT,
  );

  document.addEventListener('DOMContentLoaded', initLikeButtonComps);

  return LikeButton;
})(document);

export { LikeButton }
