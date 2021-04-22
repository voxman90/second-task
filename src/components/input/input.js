'use strict';

import $ from 'jquery';
import 'jquery.inputmask';

(function($) {
  function initMaskedInputs() {
    $('.js-input_masked').inputmask();
  }

  $(initMaskedInputs());
})($);
