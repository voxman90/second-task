import { BEMComponent } from '../../scripts/BEMComponent'
import { Utility } from '../../scripts/Utility'

class DropdownModel {
  constructor(dft, glossary) {
    this.default = dft;
    this.glossary = glossary;
  }

  getSentence(values) {
    const sentence = values.map(
        (value, i) => (value !== 0) ? `${value} ${this.convertToCorrectForm(value, this.glossary[i])}` : null
      )
      .filter(a => a !== null)
      .join(', ');

    return sentence;
  }

  convertToMap(glossary) {
    const map = new Map();

    glossary.forEach((wordForms) => {
      map.set(wordForms.nominativePlural, wordForms)
    });

    return map;
  }

  convertToCorrectForm(count, forms) {
    const { nominative, genitive, genitivePlural } = forms;
    return this.defineCorrectForm(count, nominative, genitive, genitivePlural);
  }

  defineCorrectForm(count, nominative, genitive, genitivePlural) {
    let form = genitivePlural;
    if (
      count % 100 < 11
      || count % 100 > 14
    ) {
      switch (count % 10) {
        case 1: {
          form = nominative;
          break;
        }
        case 2:
        case 3:
        case 4: {
          form = genitive;
          break;
        }
        default: {
          break;
        }
      }
    }

    return form;
  }
}

const Dropdown = (() => {
  const ClassName = {
    OPTION_BUTTON      : 'dropdown__option-button',
    OPTION_BUTTON_PLUS : 'js-dropdown__option-button-plus',
  }

  const Modifier = {
    INPUT_FIXED           : 'dropdown__input_fixed',
    INPUT_EXPANDED        : 'dropdown__input_expanded',
    INPUT_ANGLED          : 'dropdown__input_angled',
    BAR_HIDDEN            : 'dropdown__bar_hidden',
    BAR_FIXED             : 'dropdown__bar_fixed',
    OPTION_BUTTON_FADED   : 'dropdown__option-button_faded',
    BUTTON_CLEAR_HIDDEN   : 'dropdown__button-clear_hidden',
  };

  const Selector = {
    INPUT        : '.js-dropdown__input',
    ICON         : '.js-dropdown__icon',
    BAR          : '.js-dropdown__bar',
    OPTIONS      : '.js-dropdown__options',
    OPTION_VALUE : '.js-dropdown__option-value',
    BUTTONS      : '.js-dropdown__buttons',
  }

  const kq = Utility.keyQualifiers;

  class Dropdown extends BEMComponent {
    constructor(element, name, model) {
      super(element, name);

      this.model = model;
      this.hooks = null;
      this.listeners = [];

      this.connectBasis();

      this.buttons = this.bar.querySelector(Selector.BUTTONS);
      if (this.buttons !== null) {
        this.connectButtons();
      }

      this.bindEventListeners(this.listeners);
    }

    connectBasis() {
      this.input = this.root.querySelector(Selector.INPUT);
      this.icon = this.root.querySelector(Selector.ICON);
      this.bar = this.root.querySelector(Selector.BAR);
      this.optionsNode = this.root.querySelector(Selector.OPTIONS);
      this.optionValueNodes = this.optionsNode.querySelectorAll(Selector.OPTION_VALUE);

      this.hooks = {
        optionValueIncreased: () => {},
        optionValueDecreased: () => {},
      }

      this.listeners.push(
        {
          elem: this.input,
          event: 'click',
          callback: this.handleInputTextClick.bind(this),
        },

        {
          elem: this.input,
          event: 'keydown',
          callback: this.handleInputTextKeydown.bind(this),
        },

        {
          elem: this.optionsNode,
          event: 'click',
          callback: this.handleOptionsClick.bind(this),
        },

        {
          elem: this.optionsNode,
          event: 'keydown',
          callback: this.handleOptionsKeydown.bind(this),
        },
      );
    }

    connectButtons() {
      this.buttonClear = this.buttons.firstElementChild;
      this.buttonApply = this.buttons.lastElementChild;

      const optionValues = this.getOptionValues();
      const summ = optionValues.reduce((acc, cur) => acc + cur);
      this.toggleButtonClearVisibility(summ);

      this.listeners.push(
        {
          elem: this.buttonClear,
          event: 'click',
          callback: this.handleButtonClearClick.bind(this),
        },

        {
          elem: this.buttonClear,
          event: 'keydown',
          callback: this.handleButtonClearKeydown.bind(this),
        },

        {
          elem: this.buttonApply,
          event: 'click',
          callback: this.handleButtonApplyClick.bind(this),
        },

        {
          elem: this.buttonApply,
          event: 'keydown',
          callback: this.handleButtonApplyKeydown.bind(this),
        },
      );
    }

    toggleBar() {
      this.bar.classList.toggle(Modifier.BAR_HIDDEN);
      this.input.classList.toggle(Modifier.INPUT_EXPANDED);
      return this;
    }

    closeBar() {
      this.bar.classList.add(Modifier.BAR_HIDDEN);
      this.input.classList.remove(Modifier.INPUT_EXPANDED);
      return this;
    }

    expandBar() {
      this.bar.classList.remove(Modifier.BAR_HIDDEN);
      this.input.classList.add(Modifier.INPUT_EXPANDED);
      return this;
    }

    fixBar() {
      this.bar.classList.add(Modifier.BAR_FIXED);
      this.input.classList.add(Modifier.INPUT_FIXED);
      return this;
    }

    unfixBar() {
      this.bar.classList.remove(Modifier.BAR_FIXED);
      this.input.classList.remove(Modifier.INPUT_FIXED);
      return this;
    }

    setOptionValues(values) {
      this.drawOptionValues(values);
      const sentence = this.model.getSentence(values);
      this.drawInput(sentence);
      return this;
    }

    changeOptionValue(optionNode) {
      if (optionNode.classList.contains(ClassName.OPTION_BUTTON_PLUS)) {
        this.increaseOptionValue(optionNode);
      } else {
        this.decreaseOptionValue(optionNode);
      }
    }

    increaseOptionValue(optionButtonPlusNode) {
      const optionValueNode = optionButtonPlusNode.previousElementSibling;
      const value = parseInt(optionValueNode.textContent) + 1;
      optionValueNode.textContent = value;

      if (value === 1) {
        optionValueNode.previousElementSibling.classList.remove(Modifier.OPTION_BUTTON_FADED);
      }

      this.hooks.optionValueIncreased(value);
    }

    decreaseOptionValue(optionButtonMinusNode) {
      const isFaded = optionButtonMinusNode.classList.contains(Modifier.OPTION_BUTTON_FADED);
      if (!isFaded) {
        const optionValueNode = optionButtonMinusNode.nextElementSibling;
        const value = parseInt(optionValueNode.textContent) - 1;
        optionValueNode.textContent = value;

        if (value === 0) {
          optionButtonMinusNode.classList.add(Modifier.OPTION_BUTTON_FADED);
        }

        this.hooks.optionValueDecreased(value);
      }
    }

    getOptionValues() {
      const values = [];
      this.optionValueNodes.forEach(
        (optionValueNode) => { 
          values.push(parseInt(optionValueNode.textContent));
        }
      );

      return values;
    }

    drawOptionValues(values) {
      this.optionValueNodes.forEach(
        (optionValueNode, i) => {
          optionValueNode.textContent = values[i];
          this.toggleMinusButton(optionValueNode, values[i]);
        }
      );

      return this;
    }

    toggleMinusButton(optionValueNode, value) {
      const minusButtonNode = optionValueNode.previousElementSibling;
      if (value === 0) {
        minusButtonNode.classList.add(Modifier.OPTION_BUTTON_FADED);
      } else {
        minusButtonNode.classList.remove(Modifier.OPTION_BUTTON_FADED);
      }
    }

    drawInput(sentence) {
      this.input.value = sentence;
      return this;
    }

    cleanOptionValues() {
      this.optionValueNodes.forEach(
        (optionValueNode) => { 
          optionValueNode.textContent = 0;
        }
      );
    }

    toggleButtonClearVisibility(summ) {
      if (summ === 0) {
        this.buttonClear.classList.add(Modifier.BUTTON_CLEAR_HIDDEN);
      } else {
        this.buttonClear.classList.remove(Modifier.BUTTON_CLEAR_HIDDEN);
      }
    }

    handleInputClick() {
      this.toggleBar();
    }

    handleInputKeydown(event) {
      if (kq.isEnterOrSpaceKey(event)) {
        event.preventDefault();
        this.toggleBar();
      }
    }

    handleOptionsClick(event) {
      const et = event.target;
      if (et.classList.contains(ClassName.OPTION_BUTTON)) {
        this.changeOptionValue(et);
      }
    }

    handleOptionsKeydown(event) {
      const et = event.target;
      if (
        et.classList.contains(ClassName.OPTION_BUTTON)
        && kq.isEnterKey(event)
      ) {
        this.changeOptionValue(et);
      }
    }

    handleButtonClearClick() {
      this.cleanOptionValues();
      this.toggleButtonClearVisibility(0);
      this.drawInput(this.model.default);
    }

    handleButtonClearKeydown(event) {
      if (kq.isEnterKey(event)) {
        this.handleButtonClearClick();
      }
    }

    handleButtonApplyClick() {
      const values = this.getOptionValues();
      const sentence = this.model.getSentence(values);
      this.drawInput(sentence).closeBar();
    }

    handleButtonApplyKeydown(event) {
      if (kq.isEnterKey(event)) {
        this.handleButtonApplyClick();
      }

      if (kq.isTabKey(event)) {
        this.closeBar();
      }
    }
  }

  return Dropdown;
})();

export { Dropdown, DropdownModel }
