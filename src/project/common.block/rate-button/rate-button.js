document.addEventListener("DOMContentLoaded", function() {
  const rateButtons = document.body.querySelectorAll(".rate-button");

  for (let i = 0; i < rateButtons.length; i++) {
    rateButtons[i].addEventListener("mouseup", function(event) {
      let target = event.target;
      if (target.classList.contains("rate-button__icon")) {
        if (target.innerText === "star") {
          target.innerText = "star_border";
          while (target.nextElementSibling !== null)
          {
            target = target.nextElementSibling;
            target.innerText = "star_border";
          }
        } else {
          target.innerText = "star"
          while (target.previousElementSibling !== null)
          {
            target = target.previousElementSibling;
            if (target.innerText === "star") {break;}
            target.innerText = "star";
          }
        }
      }
    });
  }
} );