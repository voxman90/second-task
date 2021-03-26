import { BEMComponent } from '../../scripts/scripts.ts';
import { Dropdown, DropdownModel } from '../dropdown/dropdown';

class DropdownGuestsModel extends DropdownModel {
  constructor() {
    const glossary = [
      {
        nominative: 'взрослый',
        nominativePlural: 'взрослые',
        genitive: 'взрослых',
        genitivePlural: 'взсролых',
      },

      {
        nominative: 'ребёнок',
        nominativePlural: 'дети',
        genitive: 'ребёнка',
        genitivePlural: 'детей',
      },

      {
        nominative: 'младенец',
        nominativePlural: 'младенцы', 
        genitive: 'младенца',
        genitivePlural: 'младенцев',
      },

      {
        nominative: 'гость',
        nominativePlural: 'гости',
        genitive: 'гостя',
        genitivePlural: 'гостей',
      },
    ];
    const dfl = 'Сколько гостей';
    super(dfl, glossary);
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

class DropdownGuests extends Dropdown {
  constructor(elem) {
    const model = new DropdownGuestsModel();
    super(elem, model);

    this.name = 'dropdown-guests';
    this.inputNode.classList.remove('dropdown__input-text_angled');
    this.hangHooks();
  }

  hangHooks() {
    this.hooks.valueIncreased = (val) => {
      if (val === 1) {
        this.toggleButtonClearVisibility(val);
      }
    };

    this.hooks.valueDecreased = (val) => {
      if (val === 0) {
        const values = this.extractValues();
        const summ = values.reduce((a, b) => a + b);
        this.toggleButtonClearVisibility(summ);
      }
    };
  }
}

const initDropdownGuestsComps = BEMComponent.makeInitializer(
  DropdownGuests,
  '.js-dropdown-guests.js-auto-init'
);

document.addEventListener('DOMContentLoaded', initDropdownGuestsComps);
