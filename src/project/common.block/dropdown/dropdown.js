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

function numberVaultSumm(numberVault) {
  let Summ = 0;
  for (let key in numberVault) {
    Summ += numberVault[key];
  }
  return Summ;
}

function guestAmount(numberVault) {
  let Summ = numberVaultSumm(numberVault);
  let Word = "гостей";
  switch (Summ % 10) {
    case 1: 
      if (Summ % 100 !== 11) {
        Word = 'гость'; 
      }   
    break;
    case 2: 
      if (Summ % 100 !== 12) {
        Word = 'гостя'; 
      }
    break;
    case 3: 
      if (Summ % 100 !== 13) {
        Word = 'гостя'; 
      }
    break;
    case 4: 
      if (Summ % 100 !== 14) {
        Word = 'гостя'; 
      }
    break;
    default: 
    break;
  } 
  return Summ + " " + Word;
}

document.addEventListener("DOMContentLoaded", function () {
  const dropdownForms = document.body.querySelectorAll(".dropdown");
  for (let i = 0; i < dropdownForms.length; i++) {
    const dropdownForm = dropdownForms[i];
    const dropdownTextField = dropdownForm.firstElementChild.childNodes[1];
    const dropdownInput = dropdownTextField.firstElementChild;
    let numberVault = {"Взрослые": 0, "Дети": 0, "Младенцы": 0};
    const dropdownMenu = dropdownTextField.nextElementSibling;
    const dropdownTable = dropdownMenu.firstElementChild;
    const dropdownBattonClear = dropdownMenu.lastElementChild.firstElementChild;
    dropdownTextField.addEventListener("mousedown", function () {
      dropdownMenu.classList.toggle("dropdown__menu_display");
      dropdownMenu.classList.toggle("dropdown__menu_shadow");
      this.classList.toggle("dropdown__text-field_drop-border");
    });   
    document.addEventListener("mousedown", function (event) {
      if (!containsIn(dropdownForm, event.target) && !dropdownMenu.classList.contains("dropdown__menu_display")) {
        dropdownMenu.classList.add("dropdown__menu_display");
        dropdownMenu.classList.remove("dropdown__menu_shadow");
        dropdownTextField.classList.remove("dropdown__text-field_drop-border");
      }
    });
    dropdownMenu.addEventListener("mouseup", function (event) {
      const Target = event.target;
      const TargetClass = Target.classList;
      if (TargetClass.contains("dropdown__option-batton")) {
        const ButtonKey = Target.parentNode.firstElementChild.innerHTML;
        if (Target.innerHTML === "-") {
          switch (numberVault[ButtonKey]) {
            case 0: break;
            case 1: 
              numberVault[ButtonKey] -= 1;
              Target.nextElementSibling.innerHTML = numberVault[ButtonKey]; 
              TargetClass.add("dropdown__option-batton_blacked");
            break;
            default: 
              numberVault[ButtonKey] -= 1;
              Target.nextElementSibling.innerHTML = numberVault[ButtonKey]; 
            break;
          } 
        } else { 
          switch (numberVault[ButtonKey]) {
            case 0: 
              numberVault[ButtonKey] += 1;
              Target.previousElementSibling.innerHTML = numberVault[ButtonKey];
              Target.parentNode.childNodes[1].classList.toggle("dropdown__option-batton_blacked");
            break;
            default: 
              numberVault[ButtonKey] += 1;
              Target.previousElementSibling.innerHTML = numberVault[ButtonKey];
            break;
          } 
        }   
        if (numberVaultSumm(numberVault) > 0) {
          dropdownBattonClear.classList.remove("dropdown__batton-clear_hidden");
        }
      }
      if (TargetClass.contains("dropdown__batton-clear")) {
        for (let key in numberVault) {
          numberVault[key] = 0;
        }
        dropdownInput.value = "Сколько гостей";
        for (let j = 0; j < 3; j++) {
          dropdownTable.childNodes[j].childNodes[2].innerHTML = 0;
          dropdownTable.childNodes[j].childNodes[1].classList.add("dropdown__option-batton_blacked"); 
        }
        TargetClass.toggle("dropdown__batton-clear_hidden");
      }
      if (TargetClass.contains("dropdown__batton-apply")) {
        dropdownInput.value = guestAmount(numberVault);
      }
    });
  }
});
