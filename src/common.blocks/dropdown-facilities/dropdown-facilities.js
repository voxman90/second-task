import { Dropdown } from "../dropdown/dropdown";

class DropdownFacilities extends Dropdown {
    constructor(elem) {
        super(elem);
        this.name = 'dropdown-facilities';
    }

    // bindEventListeners() {
    //     this.bindEventListener({
    //         elem: this.root,
    //         event: "click",
    //         callback: () => {},
    //         options: null,
    //         data: {
    //             that: this
    //         }
    //     });
    // }
}

function initDropdownFacilities() {
    const dropdowns = document.querySelectorAll(".js-dropdown-facilities");

    for (const dropdown of dropdowns) {
        new DropdownFacilities(dropdown);
    }
} 

document.addEventListener("DOMContentLoaded", initDropdownFacilities);