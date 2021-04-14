'use strict';

import { BEMComponent } from 'scripts/BEMComponent';
import { Dropdown, DropdownModel } from 'common.blocks/dropdown/dropdown';

const DropdownFacilities = ((document) => {
  const Glossary = [
    {
      nominative       : 'спальня',
      nominativePlural : 'спальни',
      genitive         : 'спальни',
      genitivePlural   : 'спален',
    },

    {
      nominative       : 'кровать',
      nominativePlural : 'кровати',
      genitive         : 'кровати',
      genitivePlural   : 'кроватей',
    },

    {
      nominative       : 'ванная комната',
      nominativePlural : 'ванные комнаты',
      genitive         : 'ванных комнаты',
      genitivePlural   : 'ванных комнат',
    },
  ];

  const Default = 'Сколько удобств';

  const ClassName = {
    ROOT : 'js-dropdown-facilities',
  }

  const Modifier = {
    INPUT_ANGLED : 'dropdown__input-text_angled',
  }

  class DropdownFacilities extends Dropdown {
    constructor(element) {
      const model = new DropdownModel(Default, Glossary);
      super(element, 'dropdown-facilities', model);

      this.input.classList.add(Modifier.INPUT_ANGLED);

      this.hangHooks();
    }

    hangHooks() {
      this.hooks.optionValueIncreased = function () {
        const values = this.getOptionValues();
        const sentence = this.model.getSentence(values);
        this.drawInput(sentence);
      };

      this.hooks.optionValueDecreased = function () {
        const values = this.getOptionValues();
        const summ = values.reduce((a, b) => a + b);
        if (summ === 0) {
          this.drawInput(this.model.default);
        } else {
          const sentence = this.model.getSentence(values);
          this.drawInput(sentence);
        }
      };
    }
  }

  const initDropdownFacilitiesComps = BEMComponent.makeAutoInitializer(
    DropdownFacilities,
    ClassName.ROOT,
  );

  document.addEventListener('DOMContentLoaded', initDropdownFacilitiesComps);

  return DropdownFacilities;
})(document);

export { DropdownFacilities }
