'use strict';

import jQuery from 'jquery';

import { InvoiceCard } from 'components/invoice-card/invoice-card';
import { Reviews } from 'components/reviews/reviews';

(function ($) {
  const Selector = {
    INVOICE_CARD : '.js-invoice-card',
    REVIEWS_FORM : '.js-reviews',
  };

  function initInvoiceCard() {
    initComp(Selector.INVOICE_CARD, InvoiceCard);
  }

  function initReviews() {
    initComp(Selector.REVIEWS_FORM, Reviews);
  }
  function initComp(selector, Class) {
    const element= $(selector).get(0);
    return new Class(element);
  }

  function init() {
    initReviews();
    initInvoiceCard();
  }

  $(init());

})(jQuery);
