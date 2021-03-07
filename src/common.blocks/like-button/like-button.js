import { bindEventWithId } from "../../scripts/scripts.ts";

class LikeButton {
    constructor(elem) {
        this.head = elem;
        this.input = elem.firstElementChild;
        this.counter = elem.lastElementChild;
        this.compName = "likeButton";

        this.bindEventListeners();
    }

    bindEventListeners() {
        bindEventWithId({
            elem: this.head,
            evt: "change",
            callback: this.handleButtonClick,
            options: null,
            compName: this.compName,
            that: this
        });
    }

    handleButtonClick(event, that) {
        const input = that.input;
        const counter = that.counter;
        let count = parseInt(input.getAttribute("value"), 10);
        if (input.checked) {
            count = (count + 1).toString();
            input.setAttribute("value", count);
            counter.innerText = count;
        } else {
            count = (count - 1).toString();
            input.setAttribute("value", count);
            counter.innerText = count;
        }
    }
}

function initLikeButtons() {
    const buttons = document.querySelectorAll(".js-like-button");

    for (const button of buttons) {
        new LikeButton(button);
    }
} 

document.addEventListener("DOMContentLoaded", initLikeButtons);