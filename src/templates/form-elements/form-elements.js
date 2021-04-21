import jQuery from 'jquery';

import { DropdownDate } from 'components/dropdown-date/dropdown-date';
import { DropdownFilterDate } from 'components/dropdown-filter-date/dropdown-filter-date';
import { DropdownFacilities } from 'components/dropdown-facilities/dropdown-facilities';
import { DropdownGuests } from 'components/dropdown-guests/dropdown-guests';

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
    const element= $(selector).get(0);
    return new Class(element);
  }

  function initDropdownFacilitiesComps() {
    const firstComp = getComp('.js-dropdown-facilities-1st', DropdownFacilities);
    firstComp.setOptionValues([2, 2, 0]);

    const secondComp = getComp('.js-dropdown-facilities-2nd', DropdownFacilities);
    secondComp.setOptionValues([2, 2, 0]).expandBar().fixBar();
  }

  function initDropdownGuestsComps() {
    const firstComp = getComp('.js-dropdown-guests-1st', DropdownGuests.DropdownGuests);
    firstComp.setOptionValues([0, 0, 0]).expandBar();

    const secondComp = getComp('.js-dropdown-guests-2nd', DropdownGuests.DropdownGuests);
    secondComp.setOptionValues([2, 1, 0]).expandBar();
  }

  function init() {
    initDropdownDate();
    initDropdownFilterDate();
    initDropdownFacilitiesComps();
    initDropdownGuestsComps();
  }

  $(init());

})(jQuery);