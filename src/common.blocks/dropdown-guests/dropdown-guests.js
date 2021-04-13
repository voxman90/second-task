'use strict';

import { BEMComponent } from '../../scripts/BEMComponent';
import { Dropdown, DropdownModel } from '../dropdown/dropdown';

const DropdownGuests = ((document) => {

  const Glossary = [
    {
      nominative       : 'взрослый',
      nominativePlural : 'взрослые',
      genitive         : 'взрослых',
      genitivePlural   : 'взсролых',
    },

    {
      nominative       : 'ребёнок',
      nominativePlural : 'дети',
      genitive         : 'ребёнка',
      genitivePlural   : 'детей',
    },

    {
      nominative       : 'младенец',
      nominativePlural : 'младенцы', 
      genitive         : 'младенца',
      genitivePlural   : 'младенцев',
    },

    {
      nominative       : 'гость',
      nominativePlural : 'гости',
      genitive         : 'гостя',
      genitivePlural   : 'гостей',
    },
  ];

  const Default = 'Сколько гостей';

  class DropdownGuestsModel extends DropdownModel {
    constructor() {
      super(Default, Glossary);
    }

    getSentence(values) {
      const guestsCount = values[0] + values[1];
      const babiesCount = values[2];
      const sentence = [];

      if (guestsCount > 0) {
        const words = this.convertToCorrectForm(guestsCount, this.glossary[3]);
        sentence.push(`${guestsCount} ${words}`);
      }

      if (babiesCount > 0) {
        const words = this.convertToCorrectForm(babiesCount, this.glossary[2]);
        sentence.push(`${babiesCount} ${words}`);
      }

      if (sentence.length === 0) {
        sentence.push(this.default);
      }

      return sentence.join(', ');
    }
  }

  const ClassName = {
    ROOT : 'js-dropdown-guests',
  }

  class DropdownGuests extends Dropdown {
    constructor(element) {
      const model = new DropdownGuestsModel();
      super(element, 'dropdown-guests', model);

      this.hangHooks();
    }

    hangHooks() {
      this.hooks.optionValueIncreased = function (value) {
        if (value === 1) {
          this.toggleButtonClearVisibility(value);
        }
      };

      this.hooks.optionValueDecreased = function (value) {
        if (value === 0) {
          const values = this.getOptionValues();
          const summ = values.reduce((a, b) => a + b);
          this.toggleButtonClearVisibility(summ);
        }
      }
    }

    drawOptionValues(values) {
      let summ = 0;

      this.optionValueNodes.forEach((optionValueNode, i) => {
        summ += values[i];
        optionValueNode.textContent = values[i];
        this.toggleMinusButton(optionValueNode, values[i]);
      });

      this.toggleButtonClearVisibility(summ);
    }
  }

  const initDropdownGuestsComps = BEMComponent.makeAutoInitializer(
    DropdownGuests,
    ClassName.ROOT,
  );

  document.addEventListener('DOMContentLoaded', initDropdownGuestsComps);

  return {
    DropdownGuests,
    DropdownGuestsModel,
  };
})(document);

export { DropdownGuests }
