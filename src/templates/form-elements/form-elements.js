"use strict";

import jQuery from 'jquery';

import { DropdownDate } from '../../common.blocks/dropdown-date/dropdown-date';
import { DropdownFilterDate } from '../../common.blocks/dropdown-filter-date/dropdown-filter-date';

(function ($) {
  function initDropdownDate() {
    const dropdownDateNode = $('.js-dropdown-date-1st').get(0);
    const dropdownDateComp = new DropdownDate(dropdownDateNode);
    dropdownDateComp.setDeparture(new Date(2019, 7, 19));
  }

  function initDropdownFilterDate() {
    const dropdownFilterDateNode = $('.js-dropdown-filter-date-1st').get(0);
    const dropdownFilterDateComp = new DropdownFilterDate(dropdownFilterDateNode);
    dropdownFilterDateComp.setTimeInterval(new Date(2021, 7, 19), new Date(2021, 7, 23));
  }

  function init() {
    initDropdownDate();
    initDropdownFilterDate();
  }


  $(init());

})(jQuery);