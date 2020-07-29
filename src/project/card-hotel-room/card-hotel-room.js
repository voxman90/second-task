document.addEventListener("DOMContentLoaded", function () {
  const carouselForms = document.body.querySelectorAll(".carousel");

  for (let i = 0; i < carouselForms.length; i++) {
    const carouselForm = carouselForms[i];
    const carouselImgages = carouselForm.querySelectorAll(".carousel__image");
    carouselImgages[0].classList.remove("carousel__image_hidden");
  }
});