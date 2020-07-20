function setTableCaption(currentPage) {};

document.addEventListener("DOMContentLoaded", function () {
  const paginationForm = document.body.querySelector(".pagination");
  const forwardButton = paginationForm.querySelector(".pagination__button-forward");
  const backwardButton = paginationForm.querySelector(".pagination__button-backward");  
  const items = [paginationForm.children[0].children[0].children[1], 
  paginationForm.children[0].children[0].children[2],
  paginationForm.children[0].children[0].children[3],
  paginationForm.children[0].children[0].children[4],
  paginationForm.children[0].children[0].children[5]];
  let currentPage = paginationForm.querySelector(".pagination__current"); 
  
  forwardButton.addEventListener("mouseup", function () {
    if (parseInt(currentPage.innerText) === 1) {
      backwardButton.classList.remove("pagination__button_hidden");
    }

    if (items[3].isSameNode(currentPage)) {
      currentPage.classList.remove("pagination__current");
      items[4].classList.add("pagination__current");
      currentPage = items[4];
      forwardButton.classList.add("pagination__button_fade");
    }

    if (items[2].isSameNode(currentPage)) {
      const i = parseInt(items[2].innerText);
      switch (true) {
        case (i < 12): 
          items[0].innerText = items[1].innerText;
          items[1].innerText = items[2].innerText;
          items[2].innerText = parseInt(items[2].innerText) + 1;
        break;
        case (i === 12):
          items[0].innerText = items[1].innerText;
          items[1].innerText = items[2].innerText;
          items[2].innerText = parseInt(items[2].innerText) + 1;
          items[3].innerText = parseInt(items[2].innerText) + 1;
        break;
        default:
          currentPage.classList.remove("pagination__current");
          items[3].classList.add("pagination__current");
          currentPage = items[3];
        break;
      }
    } 

    if (items[1].isSameNode(currentPage)) {
      console.log("nope 2");
      currentPage.classList.remove("pagination__current");
      items[2].classList.add("pagination__current");
      currentPage = items[2];
    }

    if (items[0].isSameNode(currentPage)) {
      console.log("nope 1");
      currentPage.classList.remove("pagination__current");
      items[1].classList.add("pagination__current");
      currentPage = items[1];
    }
  }); 
});
