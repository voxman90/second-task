import { BEMComponent } from '../../scripts/scripts.ts';

class RateButton extends BEMComponent {
  constructor(elem) {
    super('rate-buton');

    this.connectBasis(elem);

    this.bindEventListeners(this.listeners);
  }

  #ICON_STATES = {
    fill: 'star', 
    empty: 'star_border',
  };

  connectBasis(elem) {
    this.root = elem;
    this.icons = this.getIcons();
    this.value = this.getValue();

    // TODO: Перенести объявление массива слушателей в BEMComnonent
    this.listeners = [];
    this.listeners.push(
      {
        elem: this.root,
        event: 'click',
        callback: this.handleRateButtonClick,
        data: {
          that: this
        },
      },
    );
  }

  getValue() {
    return this.root.getAttribute('data-value');
  }

  setValue(value) {
    this.value = value;
    this.root.setAttribute('data-value', value);
  }

  getIcons() {
    return this.root.querySelectorAll('.js-rate-button__icon');
  }

  drawValue(value) {
    const current = this.value;
    let from = Math.min(current, value);
    const to = Math.max(current, value);
    const state = (value <= current) ? 'empty' : 'fill';
    if (from === to) {
      from = from - 1;
      value = value - 1;
    }

    for (let i = from; i < to; i++) {
      this.icons[i].textContent = this.#ICON_STATES[state];
    }

    this.setValue(value);
  }

  handleRateButtonClick(event) {
    const that = event.that;
    const et = event.target;
    if (et.classList.contains('js-rate-button__icon')) {
      const value = parseInt(et.getAttribute('data-index')) + 1;
      that.drawValue(value);
    }
  }
}

const initRateButtonComps = BEMComponent.makeInitializer(
  RateButton,
  '.js-rate-button.js-auto-init'
);

document.addEventListener('DOMContentLoaded', initRateButtonComps);
