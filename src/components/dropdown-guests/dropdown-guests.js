'use strict';

import { BEMComponent } from 'scripts/BEMComponent';
import { Dropdown, DropdownModel } from 'components/dropdown/dropdown';

const DropdownGuests = ((document) => {
  const Dictionary = [
    {
      name: 'adult',
      forms: {
        nominative       : 'взрослый',
        nominativePlural : 'взрослые',
        genitive         : 'взрослых',
        genitivePlural   : 'взсролых',
      },
    },

    {
      name: 'child',
      forms: {
        nominative       : 'ребёнок',
        nominativePlural : 'дети',
        genitive         : 'ребёнка',
        genitivePlural   : 'детей',
      },
    },

    {
      name: 'baby',
      forms: {
        nominative       : 'младенец',
        nominativePlural : 'младенцы',
        genitive         : 'младенца',
        genitivePlural   : 'младенцев',
      }
    },

    {
      name: 'guest',
      forms: {
        nominative       : 'гость',
        nominativePlural : 'гости',
        genitive         : 'гостя',
        genitivePlural   : 'гостей',
      },
    }
  ];

  const Default = 'Сколько гостей';

  class DropdownGuestsModel extends DropdownModel {
    constructor() {
      super(Default, Dictionary);
    }

    getSentence(options) {
      const optionsMap = this._convertOptionsToMap(options);
      const guestsNumber = optionsMap.get('adult') + optionsMap.get('child');
      const babiesNumber = optionsMap.get('baby');
      const collocations = [];

      collocations.push(this._getCollocation({ name: 'guest', value: guestsNumber }));
      collocations.push(this._getCollocation({ name: 'baby', value: babiesNumber }));

      const sentense = collocations.filter((collocation) => collocation !== null).join(', ');

      return (sentense === '') ? this.default : sentense;
    }

    _convertOptionsToMap(options) {
      const map = new Map();

      options.forEach((option) => {
        map.set(option.name, option.value)
      })

      return map;
    }
  }

  const ClassName = {
    ROOT : 'js-dropdown-guests',
  }

  class DropdownGuests extends Dropdown {
    constructor(element) {
      const model = new DropdownGuestsModel();
      super(element, 'dropdown-guests', model);

      this._hangHooks();
    }

    _hangHooks() {
      this.hooks.optionValueIncreased = this.handleOptionValueIncreased;
      this.hooks.optionValueDecreased = this.handleOptionValueDecreased;
    };

    handleOptionValueDecreased = (value) => {
      if (value === 0) {
        this._updateButtonClearState();
      }
    }

    handleOptionValueIncreased = (value) => {
      if (value === 1) {
        this._toggleButtonClearVisibility(1);
      }
    }
  }

  const initDropdownGuestsComps = BEMComponent.makeAutoInitializer(
    DropdownGuests,
    ClassName.ROOT,
  );

  document.addEventListener('DOMContentLoaded', initDropdownGuestsComps);

  return DropdownGuests;
})(document);

export { DropdownGuests }
