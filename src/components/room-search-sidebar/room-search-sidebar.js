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
  }

  const initRoomSearchSidebar = BEMComponent.makeAutoInitializer(RoomSearchSidebar, ClassName.ROOT);

  document.addEventListener('DOMContentLoaded', initRoomSearchSidebar);

  return RoomSearchSidebar;
})(document);

export { RoomSearchSidebar }
