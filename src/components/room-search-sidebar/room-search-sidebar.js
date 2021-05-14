'use strict';

import { BEMComponent } from 'scripts/BEMComponent';
import { DropdownFilterDate } from 'components/dropdown-filter-date/dropdown-filter-date';
import { DropdownGuests } from 'components/dropdown-guests/dropdown-guests';
import { DropdownFacilities } from 'components/dropdown-facilities/dropdown-facilities';
import { RangeSlider } from 'components/range-slider/range-slider';
import { ExpandableList } from 'components/expandable-list/expandable-list';

const RoomSearchSidebar = ((document) => {
  const ClassName = {
    ROOT : 'js-room-search-sidebar',
  };

  const Name = {
    FORM : 'room-search-sidebar',
  }

  const Selector = {
    DROPDOWN_FILTER_DATE : '.js-dropdown-filter-date',
    DROPDOWN_GUESTS      : '.js-dropdown-guests',
    DROPDOWN_FACILITIES  : '.js-dropdown-facilities',
    RANGE_SLIDER         : '.js-range-slider',
    EXPANDABLE_LIST      : '.js-expandable-list',
  };

  class RoomSearchSidebar extends BEMComponent {
    constructor(element) {
      super(element, 'room-search-sidebar');

      this.nodes = {};
      this.components = {};

      this._connectBasis();
      this._initComponents();
    }

    setDates(arrival, departure) {
      this.components.dropdownFilterDate.setDates(arrival, departure);
    }

    setGuests(guests) {
      this.components.dropdownGuests.setOptionValues(guests);
    }

    setFacilities(facilities) {
      this.components.dropdownFacilities.setOptionValues(facilities);
    }

    setRules(names) {
      this._check(names, this.nodes.fieldsetRules, true);
    }

    setAccessibility(names) {
      this._check(names, this.nodes.fieldsetAccessibility, true);
    }

    setExtra(names) {
      this._check(names, this.nodes.fieldsetExtra, true);
    }

    toggleExpandableList() {
      this.components.expandableList.toggle();
    }

    toggleDropdownFacilitiesBar() {
      this.components.dropdownFacilities.toggleBar();
    }

    _connectBasis() {
      this.nodes.form = document.forms[Name.FORM];
      this.nodes.fieldsetRules = this.nodes.form.elements['rules'];
      this.nodes.fieldsetAccessibility = this.nodes.form.elements['accessibility'];
      this.nodes.fieldsetExtra = this.nodes.form.elements['extra'];
      this.nodes.dropdownFilterDate = this.root.querySelector(Selector.DROPDOWN_FILTER_DATE);
      this.nodes.dropdownGuests = this.root.querySelector(Selector.DROPDOWN_GUESTS);
      this.nodes.dropdownFacilities = this.root.querySelector(Selector.DROPDOWN_FACILITIES);
      this.nodes.rangeSlider = this.root.querySelector(Selector.RANGE_SLIDER);
      this.nodes.expandableList = this.root.querySelector(Selector.EXPANDABLE_LIST);
    }

    _initComponents() {
      this.components.dropdownFilterDate = new DropdownFilterDate(this.nodes.dropdownFilterDate);
      this.components.dropdownGuests = new DropdownGuests(this.nodes.dropdownGuests);
      this.components.dropdownFacilities = new DropdownFacilities(this.nodes.dropdownFacilities);
      this.components.expandableList = new ExpandableList(this.nodes.expandableList);
      this.components.rangeSlider = new RangeSlider(this.nodes.rangeSlider);
    }

    _check(names, fieldset, state) {
      if (this._isArrayAndNotEmpty(names)) {
        names.forEach((name) => {
          const checkbox = fieldset.querySelector(`[name="${name}"]`);
          if (checkbox !== undefined) {
            checkbox.checked = state;
          }
        })
      }
    }

    _isArrayAndNotEmpty(arg) {
      const isArray = Array.isArray(arg);
      const isEmpty = arg.length === 0;
      return isArray && !isEmpty;
    }
  }

  const initRoomSearchSidebar = BEMComponent.makeAutoInitializer(RoomSearchSidebar, ClassName.ROOT);

  document.addEventListener('DOMContentLoaded', initRoomSearchSidebar);

  return RoomSearchSidebar;
})(document);

export { RoomSearchSidebar }
