'use strict';

import $ from 'jquery';
import 'jquery.inputmask';

(function($) {
  function initMask() {
    $('.js-input_masked').inputmask();
  }

  $(initMask());
})($);
