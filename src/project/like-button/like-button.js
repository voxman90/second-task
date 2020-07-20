document.addEventListener("DOMContentLoaded", function () {
  const likeButtonsList = document.body.querySelectorAll(".like-button");

  for (let i = 0; i < likeButtonsList.length; i++) {
    likeButtonsList[i].addEventListener("change", function () {
      const target = this.children[0];
      let input = target.nextElementSibling;
      if (target.checked) {
        input.innerText = parseInt(input.innerText, 10) + 1;
      } else {
        input.innerText = parseInt(input.innerText, 10) - 1;
      }
    });
  }
  
});