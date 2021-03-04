import { bindEventWithId } from "../../scripts.ts";

class CheckboxList {
    constructor(elem) {
        this.head = elem;
        this.icon = elem.firstElementChild;
        this.dropdown = elem.nextElementSibling;
        this.compName = "CheckboxList";  

        this.bindEventListeners();
    }

    toggleDropdown(event, that) {
        that.dropdown.classList.toggle("checkbox-list__dropdown_hidden");
        that.icon.classList.toggle("checkbox-list__icon_turn_180deg");
    } 

    bindEventListeners() {
        bindEventWithId({
            elem: this.head,
            evt: "mousedown",
            callback: this.toggleDropdown,
            options: null,
            compName: this.compName,
            that: this
        });
    }
}

function initCheckboxList() {
    const checkboxList = document.querySelectorAll(".js-checkbox-list");

    for (const checkbox of checkboxList) {
        new CheckboxList(checkbox);
    }
} 

document.addEventListener("DOMContentLoaded", initCheckboxList);
