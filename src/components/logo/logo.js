'use strict';

import { BEMComponent } from 'scripts/BEMComponent';

const Logo = ((document) => {

  const PRIMARY_COLOR   = ['#BC9CFF', '#8BA4F9'];
  const AUXILIARY_COLOR = ['#6FCF97', '#66D2EA'];

  const ClassName = {
    COLORED_MODIFIER: 'js-logo_colored',
  }

  class Logo extends BEMComponent {
    constructor(element) {
      super(element, 'logo');

      this.container = this.root.firstElementChild;
      this.svgColl = this.container.children;

      const logo = this.root.removeChild(this.container);
      this.appendLinearGradient();
      this.root.prepend(logo);
    }

    createLinearGradient(primaryTone, auxiliaryTone, id) {
      const elementDefs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

      const elementLinearGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      elementLinearGradient.setAttribute('gradientTransform', 'rotate(90)');
      elementLinearGradient.setAttribute('id', id);

      const elementStopFirst = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      elementStopFirst.setAttribute('offset', '0%');
      elementStopFirst.setAttribute('stop-color', primaryTone);

      const elementStopSecond = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      elementStopSecond.setAttribute('offset', '100%');
      elementStopSecond.setAttribute('stop-color', auxiliaryTone);

      /** <defs>
       *   <linearGradient>
       *     <stop>
       *     <stop>
       */
      elementLinearGradient.appendChild(elementStopFirst);
      elementLinearGradient.appendChild(elementStopSecond);   
      elementDefs.appendChild(elementLinearGradient);

      return elementDefs;
    }

    appendLinearGradient() {
      const svgColl = this.svgColl;
      let id = this.createId();
      let firstTone = PRIMARY_COLOR[0];
      let secondTone = PRIMARY_COLOR[1];

      for (let i = 0; i < svgColl.length; i += 1) {
        const path = svgColl[i].firstElementChild;
        id = `${id}${i}`;
        path.setAttribute('fill', `url(#${id})`);
        path.setAttribute('fill-opacity', '1');

        if (i === 2) {
          firstTone = AUXILIARY_COLOR[0];
          secondTone = AUXILIARY_COLOR[1];
        }

        svgColl[i].appendChild(
          this.createLinearGradient(firstTone, secondTone, id)
        );
      }
    }
  }

  const initLogoComps = BEMComponent.makeAutoInitializer(
    Logo,
    ClassName.COLORED_MODIFIER,
  );

  document.addEventListener('DOMContentLoaded', initLogoComps);

  return Logo;
})(document);

export { Logo }
