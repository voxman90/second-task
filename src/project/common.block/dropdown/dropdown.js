function containsIn(supposedParent, checkedNode) {
  let isSameNodes = false;
  let ancestor = checkedNode;
  while ((ancestor !== null) && !isSameNodes) {    
    if (ancestor.isSameNode(supposedParent)) {
      isSameNodes = true;
    } else {
      ancestor = ancestor.parentNode;
    }
  }
  return isSameNodes;
}

function fillVault(nodeVault) {
  const Options = nodeVault.querySelectorAll(".dropdown__option");
  let Vault = {};
  for (let i = 0; i < Options.length; i++) {
    Vault[Options[i].firstElementChild.innerText] = 0;
  }
  return Vault;
}

function numberVaultSumm(numberVault) {
  let Summ = 0;
  for (let key in numberVault) {
    Summ += numberVault[key];
  }
  return Summ;
}

function wordEnding(number, nominative, genitive, genitivePlural) {
  let word = genitivePlural;
  if ((number % 100 < 11) || (number % 100 > 14)) {
    switch (number % 10) {
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

function guestAmount(numberVault) {
  let sentence = "";
  const guestCount = numberVault["Взрослые"] + numberVault["Дети"];
  const infantCount = numberVault["Младенцы"];
  if (infantCount === 0) {
    sentence = `${guestCount} ${wordEnding(guestCount, "гость", "гостя", "гостей")}`;
  } else if (guestCount === 0) {
    sentence = `${infantCount} ${wordEnding(infantCount, "младенец", "младенца", "младенцев")}`;
  } else {
    sentence = `${guestCount} ${wordEnding(guestCount, "гость", "гостя", "гостей")}, ${infantCount} ${wordEnding(infantCount, "младенец", "младенца", "младенцев")}`;
  }
  return sentence;
}

function easeAmount(numberVault) {
  let phrases = [];
  let sentence = "";
  const bedroomCount = numberVault["Спальни"];
  const bedCount = numberVault["Кровати"];
  const bathCount = numberVault["Ванные комнаты"];
  if (bedroomCount + bedCount + bathCount === 0) {
    sentence = "Какие удобства";
  } else {
    if (bedroomCount > 0) {
      phrases.push(`${bedroomCount} ${wordEnding(bedroomCount, "спальня", "спальни", "спален")}`);
    }
    if (bedCount > 0) {
      phrases.push(`${bedCount} ${wordEnding(bedCount, "кровать", "кровати", "кроватей")}`);
    }
    if (bathCount > 0) {
      phrases.push(`${bathCount} ${wordEnding(bathCount, "ванная комната", "ванных комнаты", "ванных комнат")}`);
    }
    let i = 1;
    sentence = phrases[0];
    while (i < phrases.length) {
      sentence = sentence + ", " + phrases[i];
      i = i + 1;
    }
    if (i < 3) {sentence = sentence + `…`}
  }
  return sentence;
}

document.addEventListener("DOMContentLoaded", function () {
  const dropdownForms = document.body.querySelectorAll(".dropdown");
  for (let i = 0; i < dropdownForms.length; i++) {
    const dropdownForm = dropdownForms[i];
    const dropdownTextField = dropdownForm.firstElementChild.children[1];
    const dropdownIcon = dropdownForm.firstElementChild.children[2];
    const dropdownBar = dropdownForm.firstElementChild.children[3];
    const dropdownOptions = dropdownBar.firstElementChild;
    let numberVault = fillVault(dropdownOptions);
    const dropdownBattonClear = dropdownBar.querySelector(".dropdown__button-clear");
    
    dropdownForm.firstElementChild.addEventListener("mousedown", function (event) {
      if (dropdownTextField.isSameNode(event.target) || dropdownIcon.isSameNode(event.target)) {
        dropdownBar.classList.toggle("dropdown__bar_hidden");
        dropdownTextField.classList.toggle("dropdown__text-field_expanded");
      }
    });   

    document.addEventListener("mousedown", function (event) {
      if (!containsIn(dropdownForm, event.target) && !dropdownBar.classList.contains("dropdown__bar_hidden")) {
        dropdownBar.classList.add("dropdown__bar_hidden");
        dropdownTextField.classList.remove("dropdown__text-field_expanded");
      }
    });

    dropdownBar.addEventListener("mouseup", function (event) {
      const Target = event.target;
      const TargetClass = Target.classList;
      if (TargetClass.contains("dropdown__option-button")) {
        const ButtonKey = Target.parentNode.firstElementChild.innerHTML;
        if (Target.innerHTML === "-") {
          switch (numberVault[ButtonKey]) {
            case 0: break;
            case 1: 
              numberVault[ButtonKey] -= 1;
              Target.previousElementSibling.innerHTML = numberVault[ButtonKey]; 
              TargetClass.add("dropdown__option-button_blacked");
            break;
            default: 
              numberVault[ButtonKey] -= 1;
              Target.previousElementSibling.innerHTML = numberVault[ButtonKey]; 
            break;
          } 
        } else { 
          switch (numberVault[ButtonKey]) {
            case 0: 
              numberVault[ButtonKey] += 1;
              Target.nextElementSibling.innerHTML = numberVault[ButtonKey];
              Target.parentNode.children[3].classList.toggle("dropdown__option-button_blacked");
            break;
            default: 
              numberVault[ButtonKey] += 1;
              Target.nextElementSibling.innerHTML = numberVault[ButtonKey];
            break;
          } 
        }   
        if (dropdownBattonClear) { 
          if (numberVaultSumm(numberVault) > 0) {
            dropdownBattonClear.classList.remove("dropdown__button-clear_hidden");
          } else {
            dropdownBattonClear.classList.add("dropdown__button-clear_hidden");
          }
        } else {
            dropdownTextField.value = easeAmount(numberVault);
        }
      }
      if (TargetClass.contains("dropdown__button-clear")) {
        for (let key in numberVault) {
          numberVault[key] = 0;
        }
        dropdownTextField.value = "Сколько гостей";
        for (let j = 0; j < 3; j++) {
          dropdownOptions.children[j].children[2].innerHTML = 0;
          dropdownOptions.children[j].children[3].classList.add("dropdown__option-button_blacked"); 
        }
        TargetClass.toggle("dropdown__button-clear_hidden");
      }
      if (TargetClass.contains("dropdown__button-apply")) {
        if (numberVaultSumm(numberVault) > 0) {
          dropdownTextField.value = guestAmount(numberVault);
        }
      }
    }); 
  }
});
