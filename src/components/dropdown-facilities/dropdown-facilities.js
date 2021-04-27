'use strict';

import { BEMComponent } from 'scripts/BEMComponent';
import { Dropdown, DropdownModel } from 'components/dropdown/dropdown';

const DropdownFacilities = ((document) => {
  const Dictionary = [
    {
      name: 'bedrooms',
      forms: {
        nominative       : 'спальня',
        nominativePlural : 'спальни',
        genitive         : 'спальни',
        genitivePlural   : 'спален',
      },
    },

    {
      name: 'beds',
      forms: {
        nominative       : 'кровать',
        nominativePlural : 'кровати',
        genitive         : 'кровати',
        genitivePlural   : 'кроватей',
      },
    },

    {
      name: 'bathrooms',
      forms: {
        nominative       : 'ванная комната',
        nominativePlural : 'ванные комнаты',
        genitive         : 'ванных комнаты',
        genitivePlural   : 'ванных комнат',
      },
    },
  ];

  const Default = 'Сколько удобств';

  const ClassName = {
    ROOT : 'js-dropdown-facilities',
  }

  const Modifier = {
    READOUT_ANGLED : 'dropdown__readout_angled',
  }

  class DropdownFacilities extends Dropdown {
    constructor(element) {
      const model = new DropdownModel(Default, Dictionary);
      super(element, 'dropdown-facilities', model);

      this.input.classList.add(Modifier.READOUT_ANGLED);

      this._hangHooks();
    }

    _hangHooks() {
      this.hooks.optionValueIncreased = this._updateDropdownState().bind(this);
      this.hooks.optionValueDecreased = this._updateDropdownState().bind(this);
    }
  }

  const initDropdownFacilitiesComps = BEMComponent.makeAutoInitializer(DropdownFacilities, ClassName.ROOT);

  document.addEventListener('DOMContentLoaded', initDropdownFacilitiesComps);

  return DropdownFacilities;
})(document);

export { DropdownFacilities }
