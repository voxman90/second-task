document.addEventListener("DOMContentLoaded", function () {
    const dropdownInputs = document.querySelectorAll(".dropdown__text-field");
    
    function containsIn(supposedParent, checkedNode) {
      let ancestor = checkedNode;
      let sameNodes = false;
      while (!(ancestor.isSameNode(document.body)) && !(sameNodes)) {    
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
        if (!containsIn(parentItem, event.target) && !dropdownMenu.classList.contains("dropdown__menu_display")) {
          dropdownMenu.classList.add("dropdown__menu_display");
          dropdownItem.classList.remove("dropdown__text-field_drop");
        }
      });
    }
  });
  