'use strict';

import { BEMComponent } from 'scripts/BEMComponent';
import { DropdownDate } from 'components/dropdown-date/dropdown-date';
import { DropdownGuests } from 'components/dropdown-guests/dropdown-guests';

const RoomSearchCard = ((document) => {
  const ClassName = {
    ROOT : 'js-room-search-card',
  };

  const Name = {
    FORM : 'room-search-card',
  }

  const Selector = {
    DROPDOWN_DATE   : '.js-dropdown-date',
    DROPDOWN_GUESTS : '.js-dropdown-guests',
  };

  class RoomSearchCard extends BEMComponent {
    constructor(element) {
      super(element, 'room-search-card');

      this.nodes = {};
      this.components = {};

      this._connectBasis();
      this._initComponents();
    }

    _connectBasis() {
      this.nodes.form = document.forms[Name.FORM];
      this.nodes.dropdownDate = this.root.querySelector(Selector.DROPDOWN_DATE);
      this.nodes.dropdownGuests = this.root.querySelector(Selector.DROPDOWN_GUESTS);
    }

    _initComponents() {
      this.components.dropdownDate = new DropdownDate(this.nodes.dropdownDate);
      this.components.dropdownGuests = new DropdownGuests(this.nodes.dropdownGuests);
    }
  }

  const initRoomSearchCard = BEMComponent.makeAutoInitializer(RoomSearchCard, ClassName.ROOT);

  document.addEventListener('DOMContentLoaded', initRoomSearchCard);

  return RoomSearchCard;
})(document);

export { RoomSearchCard }
