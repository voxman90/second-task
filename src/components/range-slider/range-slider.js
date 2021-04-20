function setLabelValue(labelRight, lowerValue, upperValue) {
    labelRight.innerText = lowerValue * 1000 + "Р - " + upperValue * 1000 + "Р";
}

function setRangeFiller(rangeFiller, lowerValue, upperValue, upperMax) {
    const Step = 100 / upperMax;
    rangeFiller.style.marginLeft = lowerValue * Step + 2 + '%';
    rangeFiller.style.width = (upperValue - lowerValue) * Step - 4 + '%';
}

document.addEventListener("DOMContentLoaded", function () {
    const rangeSliders = document.querySelectorAll(".range-slider");

    for (let i = 0; i < rangeSliders.length; i++) {
        const labelRight = rangeSliders[i].children[0].children[0].children[1];
        const lowerSlider = rangeSliders[i].children[0].children[1].children[0];
        const rangeFiller = rangeSliders[i].children[0].children[1].children[1];
        const upperSlider = rangeSliders[i].children[0].children[1].children[2];
        const sliderStep = parseFloat(upperSlider.step);
        const lowerMin = parseFloat(lowerSlider.min);
        const upperMax = parseFloat(upperSlider.max); 

        setRangeFiller(rangeFiller, lowerSlider.value, upperSlider.value, upperMax);
        setLabelValue(labelRight, lowerSlider.value, upperSlider.value);
        
        upperSlider.oninput = function() {
        const lowerVal = parseFloat(lowerSlider.value); 
        const upperVal = parseFloat(upperSlider.value); 

        if (upperVal === lowerVal + sliderStep) {

            if (lowerVal >= lowerMin + sliderStep * 2) {
            lowerSlider.value = upperVal - 2 * sliderStep;
            } else {
            lowerSlider.value = lowerMin;
            upperSlider.value = lowerMin + 2 * sliderStep;
            }
        }

        setRangeFiller(rangeFiller, lowerSlider.value, upperSlider.value, upperMax);
        setLabelValue(labelRight, lowerSlider.value, upperSlider.value);
        };

        lowerSlider.oninput = function() {
        const lowerVal = parseFloat(lowerSlider.value); 
        const upperVal = parseFloat(upperSlider.value);     

        if (lowerVal === upperVal - sliderStep) {

            if (upperVal <= upperMax - sliderStep * 2) {
            upperSlider.value = lowerVal + 2 * sliderStep;
            } else {
            lowerSlider.value = upperMax - 2 * sliderStep;
            upperSlider.value = upperMax;
            }
        }

        setRangeFiller(rangeFiller, lowerSlider.value, upperSlider.value, upperMax);
        setLabelValue(labelRight, lowerSlider.value, upperSlider.value);
        };
    };
});
