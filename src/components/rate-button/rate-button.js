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
      this.icons = this.getIconsReverseArray();

      this.positions = this.getAttributeNumericalValue(this.root, Attribute.AMOUNT);
      this.filled = this.getFilledPositionsNumber();

      this.setInputValue(this.filled);

      this.listeners = this.defineEventListeners();
      this.attachMultipleEventListeners(this.listeners);
    }

    setFilled(value) {
      this.filled = value;
    }

    setInputValue(value) {
      this.input.value = value;
    }

    getIconsReverseArray() {
      const icons = this.root.querySelectorAll(Selector.ICON);
      return Array.from(icons).reverse();
    }

    getFilledPositionsNumber() {
      const firstEmptyPosition = this.icons.findIndex((icon) => {
        return icon.textContent === ICON_STATE['empty'];
      });

      if (firstEmptyPosition === -1) {
        return this.positions;
      }

      return firstEmptyPosition;
    }

    defineEventListeners() {
      return [
        {
          element: this.root,
          event: 'click',
          handler: this.handleRateButtonClick.bind(this),
        },
      ];
    }

    handleRateButtonClick(event) {
      const et = event.target;

      if (et.classList.contains(ClassName.ICON)) {
        const selectedPosition = 1 + this.getAttributeNumericalValue(et, Attribute.INDEX);
        const filledPositions = this.findFilledPositionsNumber(selectedPosition);
        this.setFilled(filledPositions);
        this.setInputValue(filledPositions);
        this.drawRatingBar(filledPositions);
      }
    }

    drawRatingBar(filled) {
      this.icons.forEach((icon, i) => {
        icon.textContent = (i < filled) ? ICON_STATE['filled'] : ICON_STATE['empty'];
      });
    }

    findFilledPositionsNumber(selectedPosition) {
      const lastFilledPosition = this.filled;
      const isLastFilledPosition = selectedPosition === lastFilledPosition;

      if (!isLastFilledPosition) {
        return selectedPosition;
      }

      return lastFilledPosition - 1;
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
