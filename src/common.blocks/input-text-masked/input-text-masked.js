import jQuery from 'jquery';
import 'jquery.inputmask';

(function($) {
  function init() {
    $('.js-input-text-masked').inputmask();
  }

  $(init());
})(jQuery);
