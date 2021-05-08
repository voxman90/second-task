'use strict';

import jQuery from 'jquery';

import { DropdownDate } from 'components/dropdown-date/dropdown-date';
import { ExpandableList } from 'components/expandable-list/expandable-list';
import { DropdownFilterDate } from 'components/dropdown-filter-date/dropdown-filter-date';
import { DropdownFacilities } from 'components/dropdown-facilities/dropdown-facilities';
import { DropdownGuests } from 'components/dropdown-guests/dropdown-guests';

(function ($, document) {
  function setTextFieldValue() {
    const textField = document.querySelector('.js-text-field-focused');
    textField.value = 'This is pretty awesome';
    textField.focus();
  }

  function initDropdownDate() {
    const dropdownDateNode = $('.js-dropdown-date-1st').get(0);
    const dropdownDateComp = new DropdownDate(dropdownDateNode);
    dropdownDateComp.setDeparture(new Date(2021, 7, 19));
  }

  function initDropdownFilterDate() {
    const elem = $('.js-dropdown-filter-date-1st').get(0);
    const filterDateComp = new DropdownFilterDate(elem);
    filterDateComp.setDates(new Date(2021, 7, 19), new Date(2021, 7, 23));
  }

  function expandExpandableList() {
    const expandableListComp = initComp('.js-expandable-list-2nd', ExpandableList);
    expandableListComp.toggle();
  }

  function initComp(selector, Class) {
    const element= $(selector).get(0);
    return new Class(element);
  }

  function initDropdownFacilitiesComps() {
    const firstComp = initComp('.js-dropdown-facilities-1st', DropdownFacilities);
    const secondComp = initComp('.js-dropdown-facilities-2nd', DropdownFacilities);
  }

  function initDropdownGuestsComps() {
    const firstComp = initComp('.js-dropdown-guests-1st', DropdownGuests.DropdownGuests);
    const secondComp = initComp('.js-dropdown-guests-2nd', DropdownGuests.DropdownGuests);
  }

  function init() {
    setTextFieldValue();
    expandExpandableList();
    initDropdownDate();
    initDropdownFilterDate();
    initDropdownFacilitiesComps();
    initDropdownGuestsComps();
  }

  $(init());

})(jQuery, document);
