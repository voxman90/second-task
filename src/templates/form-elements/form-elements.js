import jQuery from 'jquery';

import { DropdownDate } from 'components/dropdown-date/dropdown-date';
import { DropdownFilterDate } from 'components/dropdown-filter-date/dropdown-filter-date';
import { DropdownFacilities } from 'components/dropdown-facilities/dropdown-facilities';
import { DropdownGuests } from 'components/dropdown-guests/dropdown-guests';

(function ($, document) {
  function setTextFieldValue() {
    const textField = document.querySelector('.js-text-field-focused');
    textField.value = 'This is pretty awesome';
  }

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
    initDropdownDate();
    initDropdownFilterDate();
    initDropdownFacilitiesComps();
    initDropdownGuestsComps();
  }

  $(init());

})(jQuery, document);