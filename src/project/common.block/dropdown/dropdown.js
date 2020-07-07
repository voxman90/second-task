document.addEventListener("DOMContentLoaded", function () {
  const dropdownInputs = document.querySelectorAll(".dropdown__text-field");
  const dropdownTables = document.querySelectorAll(".dropdown__table");
  
  function containsIn(supposedParent, checkedNode) {
    let ancestor = checkedNode;
    let sameNodes = false;
    while ( !ancestor.isSameNode(document.body) && !sameNodes ) {    
      if (ancestor.isSameNode(supposedParent)) {
        sameNodes = true;
      } else {
        ancestor = ancestor.parentNode;
      }
    }
    return sameNodes;
  }; 
  
  for (let i = 0; i < dropdownInputs.length; i++) {
    let dropdownItem = dropdownInputs[i];
    let dropdownMenu = dropdownItem.nextElementSibling;
    let parentItem = dropdownItem.parentNode.parentNode;             
    dropdownItem.addEventListener("mousedown", function () {
      this.nextElementSibling.classList.toggle("dropdown__menu_display");
      this.classList.toggle("dropdown__text-field_drop");
    });
    
    document.addEventListener("mousedown", function (event) {
      if ( !containsIn(parentItem, event.target) && !(dropdownMenu.classList.contains("dropdown__menu_display")) ) {
        dropdownMenu.classList.add("dropdown__menu_display");
        dropdownItem.classList.remove("dropdown__text-field_drop");
      }
    });
  };
  
  for (let j = 0; j < dropdownTables.length; j++) {
    let dropdownTable = dropdownTables[j];
    dropdownTable.addEventListener("mouseup", function (event) {
      let tableElement = event.target;
      if ( tableElement.classList.contains("dropdown__option-batton") ) {
        if ( (tableElement.innerHTML.trim() === "-") ) {
          if (!tableElement.classList.contains("dropdown__option-batton_blacked")) {
          tableElement.nextElementSibling.innerHTML = tableElement.nextElementSibling.innerHTML*1 - 1;
          if (tableElement.nextElementSibling.innerHTML*1 === 0) {
            tableElement.classList.add("dropdown__option-batton_blacked");
          } }
        } else { if (tableElement.previousElementSibling.innerHTML*1 === 0) {
            tableElement.previousElementSibling.previousElementSibling.classList.remove("dropdown__option-batton_blacked");
          }
          tableElement.previousElementSibling.innerHTML = tableElement.previousElementSibling.innerHTML*1 + 1;
        }
      };
    });
  };

});
  