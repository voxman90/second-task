import { Dropdown, DropdownModel } from "../dropdown/dropdown";

class DropdownFacilitiesModel extends DropdownModel {
    constructor() {
        const glossary = [
            {nominative: "спальня", nominativePlural: "спальни", genitive: "спальни", genitivePlural: "спален"},
            {nominative: "кровать", nominativePlural: "кровати", genitive: "кровати", genitivePlural: "кроватей"},
            {nominative: "ванная комната", nominativePlural: "ванные комнаты", genitive: "ванных комнаты", genitivePlural: "ванных комнат"}
        ];
        const dft = "Сколько удобств";

        super(dft, glossary);
    }
}

class DropdownFacilities extends Dropdown {
    constructor(elem) {
        const model = new DropdownFacilitiesModel();
        super(elem, model);
        
        this.name = 'dropdown-facilities';
    }
}

function initDropdownFacilities() {
    const dropdowns = document.querySelectorAll(".js-dropdown-facilities");

    for (const dropdown of dropdowns) {
        new DropdownFacilities(dropdown);
    }
} 

document.addEventListener("DOMContentLoaded", initDropdownFacilities);