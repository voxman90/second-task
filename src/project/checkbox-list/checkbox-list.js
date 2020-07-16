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

document.addEventListener("DOMContentLoaded", function () {
  const checkboxForms = document.querySelectorAll(".checkbox-list");
  for (let i = 0; i < checkboxForms.length; i++) {
    const checkboxForm = checkboxForms[i];
    const checkboxIcon = checkboxForm.firstElementChild;
    const checkboxDropdown = checkboxForm.nextElementSibling;
    

    checkboxForm.addEventListener("mousedown", function () {
      checkboxDropdown.classList.toggle("checkbox-list__dropdown_hidden");
      checkboxIcon.classList.toggle("checkbox-list__icon_turn");
    });   

    document.addEventListener("mousedown", function (event) {
      if (!containsIn(checkboxDropdown, event.target) 
      && !containsIn(checkboxForm, event.target) 
      && !checkboxDropdown.classList.contains("checkbox-list__dropdown_hidden")) {
        checkboxDropdown.classList.add("checkbox-list__dropdown_hidden");
        checkboxIcon.classList.toggle("checkbox-list__icon_turn");
      }
    });
  }
});
