"use strict";

import jQuery from 'jquery';

import { DropdownDate } from '../../common.blocks/dropdown-date/dropdown-date';
import { DropdownFilterDate } from '../../common.blocks/dropdown-filter-date/dropdown-filter-date';
import { DropdownFacilities } from '../../common.blocks/dropdown-facilities/dropdown-facilities';
import { DropdownGuests } from '../../common.blocks/dropdown-guests/dropdown-guests';
import { ExpandableList } from '../../common.blocks/expandable-list/expandable-list';

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

  function getComp(selector, Class) {
    const elem = $(selector).get(0);
    return new Class(elem);
  }

  function initDropdownFacilitiesComps() {
    const firstComp = getComp('.js-dropdown-facilities-1st', DropdownFacilities);
    firstComp.setValues([2, 2, 0]);

    const secondComp = getComp('.js-dropdown-facilities-2nd', DropdownFacilities);
    secondComp.setValues([2, 2, 0]).expandBar().fixBar();
  }

  function initDropdownGuestsComps() {
    const firstComp = getComp('.js-dropdown-guests-1st', DropdownGuests);
    firstComp.setValues([0, 0, 0]).expandBar();

    const secondComp = getComp('.js-dropdown-guests-2nd', DropdownGuests);
    secondComp.setValues([2, 1, 0]).expandBar();
  }

  function initExpandableList() {
    const expandableListNode = $('.js-exp-list-2nd').get(0);
    const expandableListComp = new ExpandableList(expandableListNode);
    expandableListComp.expand().off();
  }

  function init() {
    initDropdownDate();
    initDropdownFilterDate();
    initDropdownFacilitiesComps();
    initExpandableList();
    initDropdownGuestsComps();
  }

  $(init());

})(jQuery);