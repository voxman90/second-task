import { BEMComponent } from '../../scripts/BEMComponent';

const RateButton = ((document) => {
  const ICON_STATE = {
    filled  : 'star',
    empty   : 'star_border',
  };

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

  class RateButton extends BEMComponent {
    constructor(element) {
      super(element, 'rate-button');

      this.input = this.root.querySelector(Selector.INPUT);
      this.icons = this.root.querySelectorAll(Selector.ICON);

      this.amount = this.extractAttr(this.root, Attribute.AMOUNT);
      this.filled = this.extractFilled();

      this.setInputValue(this.filled);

      this.attachEventListeners();
    }

    attachEventListeners() {
      this.bindEventListeners([
        {
          elem: this.root,
          event: 'click',
          callback: this.handleRateButtonClick.bind(this),
        },
      ]);
    }

    extractAttr(elem, attrName) {
      const attrValue = elem.getAttribute(attrName);
      return parseInt(attrValue, 10);
    }

    setInputValue(value) {
      this.input.value = value;
      return this;
    }

    setFilled(value) {
      this.filled = value;
      return this;
    }

    extractFilled() {
      const icons = Array.from(this.icons);
      const firstEmptyIconIndex = icons.findIndex((icon) => {
        console.log('icon.textContent', icon.textContent);
        return icon.textContent === ICON_STATE['empty']
      });

      console.log('firstEmptyIconIndex', firstEmptyIconIndex);

      if (firstEmptyIconIndex === -1) {
        return this.amount;
      }

      return firstEmptyIconIndex;
    }

    fillRatingBar(index) {
      const filled = this.calcFilled(index);

      this.icons.forEach((icon, i) => {
        icon.textContent = (i < filled) ? ICON_STATE['filled'] : ICON_STATE['empty'];
      });

      this.setFilled(filled).setInputValue(filled);
    }

    calcFilled(index) {
      const filled = this.filled - 1;

      if (index !== filled) {
        return index + 1;
      }

      if (
        index === filled
        && filled !== 0
      ) {
        return index;
      }

      return 0;
    }

    handleRateButtonClick(event) {
      const et = event.target;

      if (et.classList.contains(ClassName.ICON)) {
        const index = this.extractAttr(et, Attribute.INDEX);
        this.fillRatingBar(index);
      }
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
