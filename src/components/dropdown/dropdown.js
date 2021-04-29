'use strict';

import { BEMComponent } from 'scripts/BEMComponent'
import { Utility } from 'scripts/Utility'

class DropdownModel {
  constructor(defaultSentence, dictionary) {
    this.default = defaultSentence;
    this._dictionary = this._convertDictionaryToMap(dictionary);
  }

  getSentence(options) {
    const sentence = options.map(this._getCollocation)
      .filter(collocation => collocation !== null)
      .join(', ');

    return (sentence === '') ? this.default : sentence;
  }

  _getCollocation(option) {
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
    ICON          : 'icon',
    INPUT         : 'dropdown__input',
  }

  const Selector = {
    HEAD          : '.js-dropdown__head',
    INPUT         : '.js-dropdown__input',
    BAR           : '.js-dropdown__bar',
    OPTIONS       : '.js-dropdown__options',
    OPTION_OUTPUT : '.js-dropdown__option-output',
    BUTTON        : '.js-dropdown__button',
  }

  const Modifier = {
    INPUT_ANGLED         : 'dropdown__input_angled',
    INPUT_EXPANDED       : 'dropdown__input_expanded',
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
      this.attachMultipleEventListeners(this.listeners);
    }

    setOptionValues(values) {
      this._fillOptionOutputs(values);
      this._updateDropdownState();
    }

    toggleBar() {
      this.bar.classList.toggle(Modifier.BAR_HIDDEN);
      this.input.classList.toggle(Modifier.INPUT_EXPANDED);
    }

    _connectBasis() {
      this.head = this.root.querySelector(Selector.HEAD);
      this.input = this.root.querySelector(Selector.INPUT);
      this.bar = this.root.querySelector(Selector.BAR);
      this._connectOptions();
    }

    _connectOptions() {
      this.optionsContainer = this.root.querySelector(Selector.OPTIONS);

      const optionOutputsNodeList = this.root.querySelectorAll(Selector.OPTION_OUTPUT);
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

      this._updateButtonClearState();

      return true;
    }

    _updateButtonClearState() {
      const options = this._getOptions();
      const sum = this._getSumOfValues(options);
      this._toggleButtonClearVisibility(sum);
    }

    _updateDropdownState() {
      const options = this._getOptions();
      const sentence = this.model.getSentence(options);
      this._setInput(sentence);
    }

    _setInput(sentence) {
      this.input.value = sentence;
    }

    _getOptions() {
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

    handleHeadClick = (event) => {
      const et = event.target;
      const isIcon = et.classList.contains(ClassName.ICON);
      const isInput = et.classList.contains(ClassName.INPUT);
      if (isIcon || isInput) {
        this.toggleBar();
      }
    }

    handleHeadKeydown = (event) => {
      if (kq.isEnterOrSpaceKey(event)) {
        event.preventDefault();
        this.handleHeadClick(event);
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
    }

    handleButtonClearKeydown = (event) => {
      if (kq.isEnterOrSpaceKey(event)) {
        this.handleButtonClearClick();
      }
    }

    handleButtonApplyClick = () => {
      this._updateDropdownState();
      this.toggleBar();
    }

    handleButtonApplyKeydown = (event) => {
      if (kq.isEnterOrSpaceKey(event)) {
        this.handleButtonApplyClick();
      }

      if (kq.isTabKey(event)) {
        this.toggleBar();
      }
    }

    _defineEventListeners() {
      const listeners = [
        {
          element: this.head,
          handlers: {
            'click': this.handleHeadClick,
            'keydown': this.handleHeadKeydown,
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
