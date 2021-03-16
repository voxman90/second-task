import { Dropdown, DropdownModel } from '../dropdown/dropdown';

class DropdownFacilitiesModel extends DropdownModel {
  constructor() {
    const glossary = [
      {
        nominative: 'спальня',
        nominativePlural: 'спальни',
        genitive: 'спальни',
        genitivePlural: 'спален',
      },

      {
        nominative: 'кровать',
        nominativePlural: 'кровати',
        genitive: 'кровати',
        genitivePlural: 'кроватей',
      },

      {
        nominative: 'ванная комната',
        nominativePlural: 'ванные комнаты',
        genitive: 'ванных комнаты',
        genitivePlural: 'ванных комнат',
      },
    ];
    const dfl = 'Сколько удобств';
    super(dfl, glossary);
  }
}

class DropdownFacilities extends Dropdown {
  constructor(elem) {
    const model = new DropdownFacilitiesModel();
    super(elem, model);
    
    this.name = 'dropdown-facilities';
    this.hangHooks();
  }

  hangHooks() {
    this.hooks.valueIncreased = () => {
      const values = this.extractValues();
      this.drawInput(this.model.getSentence(values));
    };

    this.hooks.valueDecreased = () => {
      const values = this.extractValues();
      const summ = values.reduce((a, b) => a + b);
      if (summ === 0) {
        this.drawInput(
          this.model.getDefault()
        );
      } else {
        this.drawInput(
          this.model.getSentence(values)
        );
      }
    };
  }
}

function initDropdownFacilities() {
  const dropdowns = document.querySelectorAll('.js-dropdown-facilities');
  for (const dropdown of dropdowns) {
    new DropdownFacilities(dropdown);
  }
}

document.addEventListener("DOMContentLoaded", initDropdownFacilities);
