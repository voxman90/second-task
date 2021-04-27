'use strict';

import { BEMComponent } from 'scripts/BEMComponent'
import { Utility } from 'scripts/Utility'

class DropdownModel {
  constructor(defaultSentence, dictionary) {
    this.default = defaultSentence;
    this._dictionary = this._convertDictionaryToMap(dictionary);
  }

  getSentence(options) {
    console.log('options', options)
    const sentence = options.map(this._getCollocation)
      .filter(collocation => collocation !== null)
      .join(', ');

    return (sentence === '') ? this.default : sentence;
  }

  _getCollocation(option) {
    console.log('option', option)
    const { name, value } = option;

    if (value !== 0) {
      const countable = this._defineCorrectForm(name, value);
      return `${value} ${countable}`;
    }

    return null;
  }

  _convertDictionaryToMap(dictionary) {
    const map = new Map();

    dictionary.forEach((word) => {
      map.set(word.name, word.forms);
    });

    return map;
  }

  _defineCorrectForm(name, number) {
    console.log(name)
    console.log(number)
    console.log(this._dictionary)
    const { nominative, genitive, genitivePlural } = this._dictionary.get(name);
    let form = genitivePlural;

    if (number % 100 < 11 || 14 < number % 100) {
      switch (number % 10) {
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
    OPTION_BUTTON : 'dropdown__option-button',
  }

  const Selector = {
    READOUT       : '.js-dropdown__readout',
    INPUT         : '.js-dropdown__input',
    BAR           : '.js-dropdown__bar',
    OPTIONS       : '.js-dropdown__options',
    OPTION_OUTPUT : '.js-dropdown__option-output',
    BUTTON        : '.js-dropdown__button',
  }

  const Modifier = {
    READOUT_ANGLED       : 'dropdown__readout_angled',
    READOUT_EXPANDED     : 'dropdown__readout_expanded',
    BAR_HIDDEN           : 'dropdown__bar_hidden',
    BAR_FIXED            : 'dropdown__bar_fixed',
    OPTION_BUTTON_FADED  : 'dropdown__option-button_faded',
    OPTION_BUTTON_MINUS  : 'dropdown__option-button_minus',
    BUTTON_CLEAR_HIDDEN  : 'dropdown__button-clear_hidden',
  }

  const kq = Utility.keyQualifiers;

  class Dropdown extends BEMComponent {
    constructor(element, name, model) {
      super(element, name);

      this.model = model;
      this.hooks = null;

      this._connectBasis();
      this.hasButtons = this._connectButtons();
      this.listeners = this._defineEventListeners();
      this._updateDropdownState();
      console.log(this.listeners)
      this.attachMultipleEventListeners(this.listeners);
    }

    setOptionValues(values) {
      this._fillOptionOutputs(values);
      this._updateDropdownState();
    }

    toggleBar() {
      this.bar.classList.toggle(Modifier.BAR_HIDDEN);
      this.readout.classList.toggle(Modifier.READOUT_EXPANDED);
    }

    _connectBasis() {
      this.readout = this.root.querySelector(Selector.READOUT);
      this.input = this.root.querySelector(Selector.INPUT);
      this.bar = this.root.querySelector(Selector.BAR);
      this._connectOptions();
    }

    _connectOptions() {
      this.optionsContainer = this.root.querySelector(Selector.OPTIONS);

      const optionOutputsNodeList = this.root.querySelectorAll(Selector.OPTION_OUTPUT);
      console.log(optionOutputsNodeList)
      this.optionOutputs = Array.from(optionOutputsNodeList);

      this.hooks = {
        optionValueIncreased: () => void(0),
        optionValueDecreased: () => void(0),
      }
    }

    _connectButtons() {
      const buttons = this.root.querySelectorAll(Selector.BUTTON);
      const hasButtons = buttons.length !== 0;
      if (!hasButtons) return false;

      this.buttonClear = buttons[0];
      this.buttonApply = buttons[1];
      console.log(buttons);

      this._updateButtonClearState();

      return true;
    }

    _updateButtonClearState() {
      const options = this._getOptions();
      console.log(options);
      const sum = this._getSumOfValues(options);
      this._toggleButtonClearVisibility(sum);
    }

    _updateDropdownState() {
      const options = this._getOptions();
      const sentence = this.model.getSentence(options);
      this._setInput(options);
      this._fillReadout(sentence);
    }

    _setInput(options = {}) {
      this.input.textContent = JSON.stringify(options);
    }

    _getOptions() {
      console.log(this.optionOutputs);
      return this.optionOutputs.map((output) => {
        const name = output.dataset.name;
        const value = parseInt(output.textContent);
        return { name, value };
      });
    }

    _getSumOfValues(options) {
      return options.reduce((accumulator, option) => accumulator + option.value);
    }

    _increaseOptionValue(buttonPlus) {
      const output = buttonPlus.previousElementSibling;
      const value = parseInt(output.textContent) + 1;
      output.textContent = value;

      if (value === 1) {
        this._toggleButtonMinus(output, 1);
      }

      this.hooks.optionValueIncreased(value);
    }

    _decreaseOptionValue(buttonMinus) {
      const output = buttonMinus.nextElementSibling;
      const value = parseInt(output.textContent) - 1;
      output.textContent = value;

      if (value === 0) {
        this._disableButtonMinus(buttonMinus);
      }

      this.hooks.optionValueDecreased(value);
    }

    _changeOptionValue(button) {
      const isButtonMinus = button.classList.contains(Modifier.OPTION_BUTTON_MINUS)
      if (isButtonMinus) {
        const isButtonMinusDisable = button.classList.contains(Modifier.OPTION_BUTTON_FADED);
        if (!isButtonMinusDisable) {
          this._decreaseOptionValue(button);
        }
      } else {
        this._increaseOptionValue(button);
      }
    }

    _enableButtonMinus(buttonMinus) {
      buttonMinus.classList.remove(Modifier.OPTION_BUTTON_FADED);
    }

    _disableButtonMinus(buttonMinus) {
      buttonMinus.classList.add(Modifier.OPTION_BUTTON_FADED);
    }

    _toggleButtonMinus(output, value) {
      const buttonMinus = output.previousElementSibling;
      if (value === 0) {
        this._disableButtonMinus(buttonMinus);
      } else {
        this._enableButtonMinus(buttonMinus);
      }
    }

    _enableButtonClear() {
      this.buttonClear.classList.add(Modifier.BUTTON_CLEAR_HIDDEN);
    }

    _disableButtonClear() {
      this.buttonClear.classList.remove(Modifier.BUTTON_CLEAR_HIDDEN);
    }

    _toggleButtonClearVisibility(sumOfValues) {
      if (sumOfValues === 0) {
        this._enableButtonClear();
      } else {
        this._disableButtonClear();
      }
    }

    _fillReadout(sentence = this.model.default) {
      this.readout.textContent = sentence;
    }

    _fillOptionOutputs(values) {
      this.optionOutputs.forEach((output, i) => {
        output.textContent = values[i];
        this._toggleButtonMinus(output, values[i]);
      });
    }

    _clearOptionOutputs() {
      this.optionOutputs.forEach((output) => { 
        output.textContent = 0;
        this._toggleButtonMinus(output, 0);
      });
    }

    handleReadoutClick = () => {
      this.toggleBar();
    }

    handleReadoutKeydown = (event) => {
      if (kq.isEnterOrSpaceKey(event)) {
        event.preventDefault();
        this.toggleBar();
      }
    }

    handleOptionsContainerClick = (event) => {
      const et = event.target;
      const isButton = et.classList.contains(ClassName.OPTION_BUTTON);
      if (isButton) {
        this._changeOptionValue(et);
      }
    }

    handleOptionsContainerKeydown = (event) => {
      const et = event.target;
      const isButton = et.classList.contains(ClassName.OPTION_BUTTON);
      if (kq.isEnterKey(event) && isButton) {
        this._changeOptionValue(et);
      }
    }

    handleButtonClearClick = () => {
      this._clearOptionOutputs();
      this._disableButtonClear();
      this._setInput();
      this._fillReadout();
    }

    handleButtonClearKeydown = (event) => {
      if (kq.isEnterKey(event)) {
        this.handleButtonClearClick();
      }
    }

    handleButtonApplyClick = () => {
      this._updateDropdownState();
      this.toggleBar();
    }

    handleButtonApplyKeydown = (event) => {
      if (kq.isEnterKey(event)) {
        this.handleButtonApplyClick();
      }

      if (kq.isTabKey(event)) {
        this.toggleBar();
      }
    }

    _defineEventListeners() {
      const listeners = [
        {
          element: this.readout,
          handlers: {
            'click': this.handleReadoutClick,
            'keydown': this.handleReadoutKeydown,
          }
        },
        {
          element: this.optionsContainer,
          handlers: {
            'click': this.handleOptionsContainerClick,
            'keydown': this.handleOptionsContainerKeydown,
          }
        },
      ];

      if (this.hasButtons) {
        listeners.push(
          {
            element: this.buttonClear,
            handlers: {
              'click': this.handleButtonClearClick,
              'keydown': this.handleButtonClearKeydown,
            }
          },
          {
            element: this.buttonApply,
            handlers: {
              'click': this.handleButtonApplyClick,
              'keydown': this.handleButtonApplyKeydown,
            }
          }
        );
      }

      return listeners;
    }
  }

  return Dropdown;
})();

export { Dropdown, DropdownModel }
