'use strict';

import $ from 'jquery';
import noUiSlider from 'nouislider';

import { BEMComponent } from 'scripts/BEMComponent';
import { Utility } from 'scripts/Utility';

const RangeSlider = ((document, $) => {
  const ClassName = {
    ROOT : 'js-range-slider',
  };

  const Selector = {
    TARGET : '.js-range-slider__target',
    LABEL  : '.js-label__appendix',
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

  class RangeSlider extends BEMComponent {
    constructor(element, config = defaultConfig) {
      super(element, 'range-slider');

      this._connectBasis();
      this._initNoUISlider(config);
    }

    _connectBasis() {
      this._label = this.root.querySelector(Selector.LABEL);
      this._slider = this.root.querySelector(Selector.TARGET);
    }

    _initNoUISlider(config) {
      noUiSlider.create(this._slider, config);
      this._slider.noUiSlider.on('update', this.handleSliderUpdate);
    }

    getValues() {
      return this._slider.noUiSlider.get();
    }

    setValues(values) {
      this._slider.noUiSlider.set(values);
    }

    setFrom(value) {
      this.setValues([value, null]);
    }

    setTo(value) {
      this.setValues([null, value]);
    }

    _drawValues() {
      const values = this.getValues();
      this._label.textContent = this._prettify(values);
    }

    _prettify(values) {
      const from = parseInt(values[0]);
      const to = parseInt(values[1]);
      const fromPrice = Utility.presentAsRublesPrice(from);
      const toPrice = Utility.presentAsRublesPrice(to);
      return `${fromPrice} - ${toPrice}`;
    }

    handleSliderUpdate = () => {
      this._drawValues();
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
