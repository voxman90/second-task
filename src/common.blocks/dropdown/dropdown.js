import { BEMComponent } from "../../scripts/scripts.ts";

class Dropdown extends BEMComponent {
    constructor(elem) {
        super('dropdown');

        this.root = elem;

        this.input = this.root.querySelector('.js-dropdown__input-text');
        this.icon = this.input.nextElementSibling;
        this.bar = this.root.querySelector('.js-dropdown__bar');
        this.options = this.bar.firstElementChild;

        this.haveButtons = false;
        const buttons = this.bar.querySelector('.js-dropdown__buttons');
        if (buttons) {
            this.haveButtons = true;
            this.clear = buttons.firstElementChild;
            this.apply = buttons.lastElementChild;
        }

        this.bindEventListeners();
    }

    wordEnding(count, nominative, genitive, plural) {
        let word = plural;
        if ((count % 100 < 11) || (count % 100 > 14)) {
            switch (count % 10) {
                case 1: 
                    word = nominative; 
                    break;
                case 2: 
                case 3: 
                case 4: 
                    word = genitive; 
                    break; 
                default: 
                    break;
            } 
        }
        return word;
    }

    bindEventListeners() {
        this.bindEventListener({
            elem: this.input,
            event: "click",
            callback: this.handleInputTextClick,
            options: null,
            data: {
                that: this
            }
        });
    }

    handleInputTextClick(e) {
        const that = e.that;
        that.bar.classList.toggle("dropdown__bar_hidden");
        that.input.classList.toggle("dropdown__input-text_expanded");
    }
}

export { Dropdown }
