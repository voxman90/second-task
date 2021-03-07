import {makeId} from "../../scripts/scripts.ts";

class Logo {
    constructor(elem) {
        this.PRIMARY_COLOR = ['#BC9CFF', '#8BA4F9'];
        this.AUXILIARY_COLOR = ['#6FCF97', '#66D2EA'];

        this.container = elem.parentElement;
        this.svg = elem.children;
        this.logo = this.container.removeChild(elem);

        this.appendLinearGradient();

        this.container.prepend(this.logo);
    }

    createLinearGradient(primaryColor, auxiliaryColor, id) {
        const elementDefs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

        const elementLinearGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
        elementLinearGradient.setAttribute("gradientTransform", "rotate(90)");
        elementLinearGradient.setAttribute("id", id);
    
        const elementStopFirst = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        elementStopFirst.setAttribute("offset", "0%");
        elementStopFirst.setAttribute("stop-color", primaryColor);
    
        const elementStopSecond = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        elementStopSecond.setAttribute("offset", "100%");
        elementStopSecond.setAttribute("stop-color", auxiliaryColor);

        // <defs>
        //   <linearGradient>
        //     <stop>
        //     <stop>
        elementLinearGradient.appendChild(elementStopFirst);
        elementLinearGradient.appendChild(elementStopSecond);   
        elementDefs.appendChild(elementLinearGradient);
        return elementDefs;
    }

    appendLinearGradient() {
        const svg = this.svg;
        let firstColor = this.PRIMARY_COLOR[0];
        let secondColor = this.PRIMARY_COLOR[1];

        for (let i = 0; i < svg.length; i++) {
            const id = makeId(7) + i; 

            const path = svg[i].firstElementChild;
            path.setAttribute("fill", `url(#${id})`);
            path.setAttribute("fill-opacity", "1");

            if (i === 2) {
                firstColor = this.AUXILIARY_COLOR[0];
                secondColor = this.AUXILIARY_COLOR[1];
            }
            svg[i].appendChild(this.createLinearGradient(firstColor, secondColor, id));
        }
    }
}

function initLogo() {
    const logos = document.querySelectorAll('.js-logo_colored');

    for (let logo of logos) {
        new Logo(logo);
    };
}

document.addEventListener("DOMContentLoaded", initLogo);