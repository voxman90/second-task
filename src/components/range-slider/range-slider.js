'use strict';

import $ from 'jquery';
import noUiSlider from 'nouislider';

import { BEMComponent } from 'scripts/BEMComponent';

const RangeSlider = ((document, $) => {
  const ClassName = {
    ROOT : 'js-range-slider',
  };

  const Selector = {
    TARGET : '.js-range-slider__target',
    LABEL  : '.label__appendix',
  }

  const defaultConfig = {
    start: [5000, 10000],
    connect: [false, true, false],
    step: 100,
    range: {
      'min': [0],
      'max': [16000],
    },
  }

  const RUBLE_SIGN = '\u20bd';

  class RangeSlider extends BEMComponent {
    constructor(element, config = defaultConfig) {
      super(element, 'range-slider');

      this.connectBasis();

      this.initNoUISlider(config);
    }

    connectBasis() {
      this.label = this.root.querySelector(Selector.LABEL);
      this.slider = this.root.querySelector(Selector.TARGET);
    }

    initNoUISlider(config) {
      noUiSlider.create(this.slider, config);
      this.slider.noUiSlider.on('update', this.handleSliderUpdate);
    }

    getValues() {
      return this.slider.noUiSlider.get();
    }

    setValues(values) {
      this.slider.noUiSlider.set(values);
    }

    setFrom(value) {
      this.setValues([value, null]);
    }

    setTo(value) {
      this.setValues([null, value]);
    }

    drawValues() {
      const values = this.getValues();
      this.label.textContent = this.prettify(values);
    }

    prettify(values) {
      const from = parseInt(values[0], 10);
      const to = parseInt(values[1], 10);

      /**
       * For an integer number, Number.toLocaleString will add spaces every three characters
       */
      const fromPretty = from.toLocaleString();
      const toPretty = to.toLocaleString();
      return `${fromPretty}${RUBLE_SIGN} - ${toPretty}${RUBLE_SIGN}`;
    }

    handleSliderUpdate = () => {
      this.drawValues();
    }
  }

  const initRateButtonComps = BEMComponent.makeAutoInitializer(
    RangeSlider,
    ClassName.ROOT,
  );

  document.addEventListener('DOMContentLoaded', initRateButtonComps);

  return RangeSlider;
})(document, $);

export { RangeSlider }