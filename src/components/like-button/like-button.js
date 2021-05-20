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
      const count = this._getNumberOfLikes();
      this.setNumberOfLikes(count + 1);
    }

    uncheck() {
      this._input.checked = false;
      const count = this._getNumberOfLikes();
      this.setNumberOfLikes(count - 1);
    }

    setNumberOfLikes(count) {
      this._counter.textContent = count;
    }

    _getNumberOfLikes() {
      return parseInt(this._counter.textContent);
    }

    _connectBasis() {
      this._input = this.root.querySelector(Selector.INPUT);
      this._counter = this.root.querySelector(Selector.COUNTER);
    }

    handleLikeButtonChange = () => {
      const numberOfLikes = this._getNumberOfLikes();
      if (this._input.checked) {
        this.setNumberOfLikes(numberOfLikes + 1);
      } else {
        this.setNumberOfLikes(numberOfLikes - 1);
      }
    }

    _defineEventListeners() {
      return [
        {
          element: this.root,
          event: 'change',
          handler: this.handleLikeButtonChange,
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
