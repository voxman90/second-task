import { bindEventWithId } from "../../scripts/scripts.ts";

class RateButton {
    constructor(elem) {
        this.ICON_STATES = ["star_border", "star"];
        this.compName = "rateButton";
        this.head = elem;
        this.icons = this.getIcons();
        this.value = this.getValue();

        this.bindEventListeners();
    }

    getValue() {
        return this.head.getAttribute("data-value");
    }

    setValue(value) {
        this.value = value;
        this.head.setAttribute("data-value", value);
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

    getIcons() {
        return this.head.querySelectorAll(".js-rate-button__icon");
    }

    bindEventListeners() {
        bindEventWithId({
            elem: this.head,
            evt: "mouseup",
            callback: this.handleButtonMouseup,
            options: null,
            compName: this.compName,
            that: this
        });
    }
    
    handleButtonMouseup(event, that) {
        const et = event.target;

        if (et.classList.contains("js-rate-button__icon")) {
            const value = Number.parseInt(et.getAttribute("data-index")) + 1;

            that.drawValue(value);
        }
    }
}

function initRateButtons() {
    const buttons = document.querySelectorAll(".js-rate-button");

    for (const button of buttons) {
        new RateButton(button);
    }
} 

document.addEventListener("DOMContentLoaded", initRateButtons);
