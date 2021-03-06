'use strict';

import { BEMComponent } from 'scripts/BEMComponent';
import { Dropdown, DropdownModel } from 'components/dropdown/dropdown';

const DropdownFacilities = ((document) => {
  const Dictionary = [
    {
      name: 'bedroom',
      forms: {
        nominative       : 'спальня',
        nominativePlural : 'спальни',
        genitive         : 'спальни',
        genitivePlural   : 'спален',
      },
    },

    {
      name: 'bed',
      forms: {
        nominative       : 'кровать',
        nominativePlural : 'кровати',
        genitive         : 'кровати',
        genitivePlural   : 'кроватей',
      },
    },

    {
      name: 'bathroom',
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
    INPUT_ANGLED : 'dropdown__input_angled',
  }

  class DropdownFacilities extends Dropdown {
    constructor(element) {
      const model = new DropdownModel(Default, Dictionary);
      super(element, 'dropdown-facilities', model);

      this.input.classList.add(Modifier.INPUT_ANGLED);

      this._hangHooks();
    }

    _hangHooks() {
      this.hooks.optionValueIncreased = this.handleOptionValueChanges;
      this.hooks.optionValueDecreased = this.handleOptionValueChanges;
    }

    handleOptionValueChanges = () => {
      this._updateDropdownState();
    }
  }

  const initDropdownFacilitiesComps = BEMComponent.makeAutoInitializer(DropdownFacilities, ClassName.ROOT);

  document.addEventListener('DOMContentLoaded', initDropdownFacilitiesComps);

  return DropdownFacilities;
})(document);

export { DropdownFacilities }
