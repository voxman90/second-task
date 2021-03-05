import { bindEventWithId } from "../../scripts.ts";

class ExpandableList {
    constructor(elem) {
        this.head = elem;
        this.icon = elem.firstElementChild;
        this.dropdown = elem.nextElementSibling;
        this.compName = "ExpandableList";  

        this.bindEventListeners();
    }

    toggleDropdown(event, that) {
        that.dropdown.classList.toggle("expandable-list__dropdown_hidden");
        that.icon.classList.toggle("expandable-list__icon_turn_180deg");
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

function initExpandableList() {
    const expandableLists = document.querySelectorAll(".js-expandable-list");

    for (const expandable of expandableLists) {
        new ExpandableList(expandable);
    }
} 

document.addEventListener("DOMContentLoaded", initExpandableList);
