"use strict";

import { BEMComponent } from '../../scripts/scripts.ts';

class DropdownModel {
  constructor(dft, glossary) {
    this.default = dft;
    this.glossary = glossary;
  }

  getDefault() {
    return this.default;
  }

  getSentence(values) {
    return values.map(
      (count, i) => (count !== 0) ? `${count} ${this.convertToCorrectForm(count, this.glossary[i])}` : null
    )
      .filter(a => a !== null)
      .join(', ');
  }

  convertToMap(glossary) {
    const map = new Map();
    glossary.forEach(
      (wordForms) => map.set(wordForms.nominativePlural, wordForms)
    );

    return map;
  }

  convertToCorrectForm(count, forms) {
    const {nominative, genitive, genitivePlural} = forms;
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

class Dropdown extends BEMComponent {
  constructor(elem, model) {
    super('dropdown');

    this.model = model;
    this.hooks = {};
    this.listeners = [];

    this.connectBasis(elem);

    this.buttonsNode = this.barNode.querySelector('.js-dropdown__buttons');
    if (this.buttonsNode) {
      this.connectButtons();
    }

    this.bindEventListeners(this.listeners);
  }

  connectBasis(elem) {
    this.rootNode = elem;
    this.inputNode = this.rootNode.querySelector('.js-dropdown__input-text');
    this.iconNode = this.inputNode.nextElementSibling;
    this.barNode = this.rootNode.lastElementChild;
    this.optionsNode = this.barNode.firstElementChild;
    this.valueNodesList = this.optionsNode.querySelectorAll('.js-dropdown__option-value');

    this.listeners.push(
      {
        elem: this.inputNode,
        event: 'click',
        callback: this.handleInputTextClick,
      },

      {
        elem: this.inputNode,
        event: 'keydown',
        callback: this.handleInputTextKeydown,
      },

      {
        elem: this.optionsNode,
        event: 'click',
        callback: this.handleOptionsClick,
      },

      {
        elem: this.optionsNode,
        event: 'keydown',
        callback: this.handleOptionsKeydown,
      },
    );
  }

  connectButtons() {
    this.clearButtonNode = this.buttonsNode.firstElementChild;
    this.applyButtonNode = this.buttonsNode.lastElementChild;

    const values = this.getValues();
    const summ = values.reduce((acc, cur) => acc + cur);
    this.toggleButtonClearVisibility(summ);

    this.listeners.push(
      {
        elem: this.clearButtonNode,
        event: 'click',
        callback: this.handleButtonClearClick,
      },

      {
        elem: this.clearButtonNode,
        event: 'keydown',
        callback: this.handleButtonClearKeydown,
      },

      {
        elem: this.applyButtonNode,
        event: 'click',
        callback: this.handleButtonApplyClick,
      },

      {
        elem: this.applyButtonNode,
        event: 'keydown',
        callback: this.handleButtonApplyKeydown,
      },
    );
  }

  handleInputTextClick = () => {
    this.toggleBar();
  }

  handleInputTextKeydown = (event) => {
    if (this.isEnterOrSpaceKey(event)) {
      event.preventDefault();
      this.toggleBar();
    }
  }

  handleOptionsClick = (event) => {
    const et = event.target;
    if (et.classList.contains('dropdown__option-button')) {
      this.changeOptionValue(et);
    }
  }

  handleOptionsKeydown = (event) => {
    const et = event.target;
    if (
      et.classList.contains('dropdown__option-button')
      && this.isEnterKey(event)
    ) {
      this.changeOptionValue(et);
    }
  }

  handleButtonClearClick = () => {
    this.cleanValues();
    this.toggleButtonClearVisibility(0);
    this.drawInput(this.model.getDefault());
  }

  handleButtonClearKeydown = (event) => {
    if (this.isEnterKey(event)) {
      this.handleButtonClearClick();
    }
  }

  handleButtonApplyClick = () => {
    const values = this.getValues();
    const sentence = this.model.getSentence(values);
    this.drawInput(sentence).closeBar();
  }

  handleButtonApplyKeydown = (event) => {
    if (this.isEnterKey(event)) {
      this.handleButtonApplyClick();
    }

    if (this.isTabKey(event)) {
      this.closeBar();
    }
  }

  toggleBar() {
    this.barNode.classList.toggle('dropdown__bar_hidden');
    this.inputNode.classList.toggle('dropdown__input-text_expanded');
    return this;
  }

  closeBar() {
    this.barNode.classList.add('dropdown__bar_hidden');
    this.inputNode.classList.remove('dropdown__input-text_expanded');
    return this;
  }

  expandBar() {
    this.barNode.classList.remove('dropdown__bar_hidden');
    this.inputNode.classList.add('dropdown__input-text_expanded');
    return this;
  }

  fixBar() {
    this.barNode.classList.add('dropdown__bar_fixed');
    this.inputNode.classList.add('dropdown__input-text_fixed');
    return this;
  }

  unfixBar() {
    this.barNode.classList.remove('dropdown__bar_fixed');
    this.inputNode.classList.remove('dropdown__input-text_fixed');
    return this;
  }

  setValues(values) {
    this.drawValues(values);
    const sentence = this.model.getSentence(values);
    this.drawInput(sentence);
    return this;
  }

  changeOptionValue(et) {
    if (et.classList.contains('js-dropdown__option-button-plus')) {
      this.increaseOptionValue(et);
    } else {
      this.decreaseOptionValue(et);
    }
  }

  increaseOptionValue(et) {
    const valueNode = et.previousElementSibling;
    const value = parseInt(valueNode.textContent) + 1;
    valueNode.textContent = value;
    if (value === 1) {
      valueNode.previousElementSibling.classList.remove('dropdown__option-button_blacked');
    }

    if (this.hooks['valueIncreased']) {
      this.hooks['valueIncreased'](value);
    }
  }

  decreaseOptionValue(et) {
    const isBlacked = et.classList.contains('dropdown__option-button_blacked');
    if (!isBlacked) {
      const valueNode = et.nextElementSibling;
      const value = parseInt(valueNode.textContent) - 1;
      valueNode.textContent = value;
      if (value === 0) {
        et.classList.add('dropdown__option-button_blacked');
      }

      if (this.hooks['valueDecreased']) {
        this.hooks['valueDecreased'](value);
      }
    }
  }

  getValues() {
    const values = [];
    this.valueNodesList.forEach(
      (valueNode) => { 
        values.push(parseInt(valueNode.textContent));
      }
    );

    return values;
  }

  drawValues(values) {
    this.valueNodesList.forEach(
      (valueNode, i) => {
        const value = values[i];
        valueNode.textContent = value;
        this.toggleMinusButton(valueNode, value);
      }
    );

    return this;
  }

  toggleMinusButton(valueNode, value) {
    const minusButtonNode = valueNode.previousElementSibling;
    if (value === 0) {
      minusButtonNode.classList.add('dropdown__option-button_blacked');
    } else {
      minusButtonNode.classList.remove('dropdown__option-button_blacked');
    }
  }

  drawInput(sentence) {
    this.inputNode.value = sentence;
    return this;
  }

  cleanValues() {
    this.valueNodesList.forEach(
      (valueNode) => { 
        valueNode.textContent = 0;
      }
    );
  }

  toggleButtonClearVisibility(summ) {
    if (summ === 0) {
      this.clearButtonNode.classList.add('dropdown__button-clear_hidden');
    } else {
      this.clearButtonNode.classList.remove('dropdown__button-clear_hidden');
    }
  }
}

export { Dropdown, DropdownModel }
