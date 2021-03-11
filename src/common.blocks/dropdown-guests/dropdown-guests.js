import { Dropdown, DropdownModel } from "../dropdown/dropdown";

class DropdownGuestsModel extends DropdownModel {
    constructor() {
        const glossary = [
            {nominative: "взрослый", nominativePlural: "взрослые", genitive: "взрослых", genitivePlural: "взсролых"},
            {nominative: "ребёнок", nominativePlural: "дети", genitive: "ребёнка", genitivePlural: "детей"},
            {nominative: "младенец", nominativePlural: "младенцы", genitive: "младенца", genitivePlural: "младенцев"},
            {nominative: "гость", nominativePlural: "гости", genitive: "гостя", genitivePlural: "гостей"}
        ];
        const dft = "Сколько гостей";

        super(dft, glossary);
    }

    getSentence(values) {
        const guests = values[0] + values[1];
        const babies = values[2];
        const sentence = [];

        if (guests > 0) {
            sentence.push(guests + ' ' + this.convertToAppropriateForm(guests, this.glossary[3]));
        }
        if (babies > 0) {
            sentence.push(babies + ' ' + this.convertToAppropriateForm(babies, this.glossary[2]));
        }

        return sentence.join(', ');
    }
}

class DropdownGuests extends Dropdown {
    constructor(elem) {
        const model = new DropdownGuestsModel();
        super(elem, model);

        this.name = 'dropdown-guests';
    }
}

function initDropdownGuests() {
    const dropdowns = document.querySelectorAll(".js-dropdown-guests");

    for (const dropdown of dropdowns) {
        new DropdownGuests(dropdown);
    }
} 

document.addEventListener("DOMContentLoaded", initDropdownGuests);

// function easeAmount(numberVault) {
//   let phrases = [];
//   let sentence = "";
//   const bedroomCount = numberVault["Спальни"];
//   const bedCount = numberVault["Кровати"];
//   const bathCount = numberVault["Ванные комнаты"];
//   if (bedroomCount + bedCount + bathCount === 0) {
//     sentence = "Какие удобства";
//   } else {
//     if (bedroomCount > 0) {
//       phrases.push(`${bedroomCount} ${wordEnding(bedroomCount, "спальня", "спальни", "спален")}`);
//     }
//     if (bedCount > 0) {
//       phrases.push(`${bedCount} ${wordEnding(bedCount, "кровать", "кровати", "кроватей")}`);
//     }
//     if (bathCount > 0) {
//       phrases.push(`${bathCount} ${wordEnding(bathCount, "ванная комната", "ванных комнаты", "ванных комнат")}`);
//     }
//     let i = 1;
//     sentence = phrases[0];
//     while (i < phrases.length) {
//       sentence = sentence + ", " + phrases[i];
//       i = i + 1;
//     }
//     if (i < 3) {sentence = sentence + `…`}
//   }
//   return sentence;
// }