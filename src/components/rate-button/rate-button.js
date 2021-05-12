'use strict';

import { BEMComponent } from 'scripts/BEMComponent';

const RateButton = ((document) => {
  const Attribute = {
    AMOUNT : 'data-amount',
    INDEX  : 'data-index',
  };

  const ClassName = {
    ROOT : 'js-rate-button',
    ICON : 'js-rate-button__icon',
  };

  const Selector = {
    INPUT : '.js-rate-batton__input',
    ICON  : '.js-rate-button__icon',
  };

  const ICON_STATE = {
    filled: 'star',
    empty: 'star_border',
  };

  class RateButton extends BEMComponent {
    constructor(element) {
      super(element, 'rate-button');

      this.input = this.root.querySelector(Selector.INPUT);
      this.icons = this._getIconsReverseArray();

      this.positions = this.getAttributeNumericalValue(this.root, Attribute.AMOUNT);
      this.filled = this._getFilledPositionsNumber();

      this.fill(this.filled);

      this.listeners = this._defineEventListeners();
      this.attachMultipleEventListeners(this.listeners);
    }

    fill(rating) {
      const isMatchBound = 0 <= rating && rating <= this.positions;
      if (isMatchBound) {
        this._setInputValue(rating);
        this._setFilled(rating);
        this._drawRatingBar(rating);
      }
    }

    _setFilled(value) {
      this.filled = value;
    }

    _setInputValue(value) {
      this.input.value = value;
    }

    _getIconsReverseArray() {
      const icons = this.root.querySelectorAll(Selector.ICON);
      return Array.from(icons).reverse();
    }

    _getFilledPositionsNumber() {
      const firstEmptyPosition = this.icons.findIndex((icon) => {
        return icon.textContent === ICON_STATE['empty'];
      });

      if (firstEmptyPosition === -1) {
        return this.positions;
      }

      return firstEmptyPosition;
    }

    _drawRatingBar(filled) {
      this.icons.forEach((icon, i) => {
        icon.textContent = (i < filled) ? ICON_STATE['filled'] : ICON_STATE['empty'];
      });
    }

    _findFilledPositionsNumber(selectedPosition) {
      const lastFilledPosition = this.filled;
      const isLastFilledPosition = selectedPosition === lastFilledPosition;

      if (!isLastFilledPosition) {
        return selectedPosition;
      }

      return lastFilledPosition - 1;
    }

    handleRateButtonClick = (event) => {
      const et = event.target;

      if (et.classList.contains(ClassName.ICON)) {
        const selectedPosition = 1 + this.getAttributeNumericalValue(et, Attribute.INDEX);
        const filled = this._findFilledPositionsNumber(selectedPosition);
        this._setFilled(filled);
        this._setInputValue(filled);
        this._drawRatingBar(filled);
      }
    }

    _defineEventListeners() {
      return [
        {
          element: this.root,
          event: 'click',
          handler: this.handleRateButtonClick,
        },
      ];
    }
  }

  const initRateButtonComps = BEMComponent.makeAutoInitializer(
    RateButton,
    ClassName.ROOT,
  );

  document.addEventListener('DOMContentLoaded', initRateButtonComps);

  return RateButton;
})(document);

export { RateButton }
