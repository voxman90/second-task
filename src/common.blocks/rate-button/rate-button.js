import { makeId } from "../../scripts.ts";

document.addEventListener("DOMContentLoaded", function() {
    const buttons = document.body.querySelectorAll(".js-rate-button");

    for (const button of buttons) {
        button.addEventListener("mouseup", (e) => {
            let ct = e.currentTarget;
            if (ct.classList.contains("rate-button__icon")) {
                if (ct.innerText === "star") {
                    ct.innerText = "star_border";
                while (target.nextElementSibling !== null)
                {
                    target = target.nextElementSibling;
                    target.innerText = "star_border";
                }
                } else {
                target.innerText = "star"
                while (target.previousElementSibling !== null)
                {
                    target = target.previousElementSibling;
                    if (target.innerText === "star") {
                    break;
                    }
                    target.innerText = "star";
                }
            }
            }
        });
    }
});

class RateButton {
    bindEventListeners(button) {
        const id = `rateButton${makeId(16)}`;
        button.addEventListener()
    }
    
    handleButtonClick() {

    }
}

function initRateButtons() {
    const buttons = document.querySelectorAll(".js-rate-button");

    for (const button of buttons) {
        RateButton.bindEventListeners(button);
    }
}

document.addEventListener("DOMContentLoaded", initRateButtons());
