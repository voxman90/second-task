import { BEMComponent } from "../../scripts/scripts.ts";

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
            (count, i) => (count !== 0) ? count + ' ' + this.convertToAppropriateForm(count, this.glossary[i]) : null
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

    convertToAppropriateForm(count, forms) {
        const {nominative, genitive, genitivePlural} = forms;

        return this.defineAppropriateForm(count, nominative, genitive, genitivePlural);
    }

    defineAppropriateForm(count, nominative, genitive, genitivePlural) {
        let form = genitivePlural;

        if ((count % 100 < 11) || (count % 100 > 14)) {
            switch (count % 10) {
                case 1: 
                    form = nominative;
                    break;
                case 2: 
                case 3: 
                case 4: 
                    form = genitive;
                    break; 
                default: 
                    break;
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
            { elem: this.inputNode, event: "click", callback: this.handleInputTextClick, data: { that: this } },
            { elem: this.optionsNode, event: "click", callback: this.handleOptionsClick, data: { that: this } }
        );
    }

    connectButtons() {
        this.clearButtonNode = this.buttonsNode.firstElementChild;
        this.applyButtonNode = this.buttonsNode.lastElementChild;

        const values = this.extractValues();
        const summ = values.reduce((acc, cur) => acc + cur);
        this.toggleButtonClearVisibility(summ);

        this.listeners.push(
            { elem: this.clearButtonNode, event: "click", callback: this.handleButtonClearClick, data: { that: this } },
            { elem: this.applyButtonNode, event: "click", callback: this.handleButtonApplyClick, data: { that: this } }
        );
    }

    handleInputTextClick(e) {
        const that = e.that;
        that.barNode.classList.toggle("dropdown__bar_hidden");
        that.inputNode.classList.toggle("dropdown__input-text_expanded");
    }

    handleOptionsClick(e) {
        const et = e.target;

        if (et.classList.contains("dropdown__option-button")) {
            const that = e.that;

            if (et.classList.contains("js-dropdown__option-button-plus")) {
                that.increaseValue(et);
            } else {
                that.decreaseValue(et);
            }
        }
    }

    handleButtonClearClick(e) {
        const that = e.that;

        that.cleanValues();
        that.toggleButtonClearVisibility(0);
        that.drawInput(that.model.getDefault());
    }

    handleButtonApplyClick(e) {
        const that = e.that;
        const values = that.extractValues();

        const sentence = that.model.getSentence(values);

        that.drawInput(sentence);
    }

    increaseValue(et) {
        const valueNode = et.nextElementSibling;
        const value = parseInt(valueNode.textContent) + 1;
        valueNode.textContent = value;

        if (value === 1) {
            valueNode.nextElementSibling.classList.remove("dropdown__option-button_blacked");
        }

        if (this.hooks["valueIncreased"]) {
            this.hooks["valueIncreased"](value);
        }
    }

    decreaseValue(et) {
        const isBlacked = et.classList.contains("dropdown__option-button_blacked");

        if (!isBlacked) {
            const valueNode = et.previousElementSibling;
            const value = parseInt(valueNode.textContent) - 1;
            valueNode.textContent = value;

            if (value === 0) {
                et.classList.add("dropdown__option-button_blacked");
            }

            if (this.hooks["valueDecreased"]) {
                this.hooks["valueDecreased"](value);
            }
        }
    }

    extractValues() {
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
                valueNode.textContent = values[i];
            }
        );
    }

    drawInput(sentence) {
        this.inputNode.value = sentence;
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
