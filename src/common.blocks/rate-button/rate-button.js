import { BEMComponent } from "../../scripts/scripts.ts";

class RateButton extends BEMComponent {
    constructor(elem) {
        super("rate-buton");
        this.ICON_STATES = ["star_border", "star"];
        
        this.root = elem;
        this.icons = this.getIcons();
        this.value = this.getValue();

        this.bindEventListeners();
    }

    getValue() {
        return this.root.getAttribute("data-value");
    }

    setValue(value) {
        this.value = value;
        this.root.setAttribute("data-value", value);
    }

    getIcons() {
        return this.root.querySelectorAll(".js-rate-button__icon");
    }

    drawValue(value) {
        const current = this.value;
        let from = Math.min(current, value);
        const to = Math.max(current, value);
        const state = (value <= current) ? 0 : 1;
        if (from === to) {
            from = from - 1;
            value = value - 1;
        }

        for (let i = from; i < to; i++) {
            this.icons[i].innerHTML = this.ICON_STATES[state];
        }

        this.setValue(value);
    }

    handleRateButtonClick(event) {
        const that = event.that;
        const et = event.target;

        if (et.classList.contains("js-rate-button__icon")) {
            const value = Number.parseInt(et.getAttribute("data-index")) + 1;

            that.drawValue(value);
        }
    }

    bindEventListeners() {
        this.bindEventListener({
            elem: this.root,
            event: "click",
            callback: this.handleRateButtonClick,
            options: null,
            data: {
                that: this
            }
        });
    }
}

function initRateButtons() {
    const buttons = document.querySelectorAll(".js-rate-button");

    for (const button of buttons) {
        new RateButton(button);
    }
} 

document.addEventListener("DOMContentLoaded", initRateButtons);
