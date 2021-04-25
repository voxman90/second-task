'use strict';

import { BEMComponent } from 'scripts/BEMComponent';
import { Trigger } from 'scripts/Trigger';

const Hamburger = ((document) => {
  const ClassName = {
    ROOT : 'js-hamburger',
  };

  const Selector = {
    MAIN_TRIGGER    : '.js-hamburger__main-trigger',
    MAIN_CONTAINER  : '.js-hamburger__container',
    EXPANDABLE_ITEM : '.js-hamburger__item-expandable',
    TRIGGER         : '.js-hamburger__trigger',
    CONTAINER       : '.js-hamburger__submenu',
  };

  const Modifier = {
    MAIN_TRIGGER_ACTIVE   : 'hamburger__main-trigger_active',
    MAIN_CONTAINER_ACTIVE : 'hamburger__container_expanded',
    TRIGGER_ACTIVE        : 'hamburger__trigger_active',
    CONTAINER_ACTIVE      : 'hamburger__submenu_expanded',
  };

  class Hamburger extends BEMComponent {
    constructor(element) {
      super(element, 'hamburger');

      this.listeners = this.defineTriggerListeners();
      this.attachMultipleEventListeners(this.listeners);
    }

    defineTriggerListeners() {
      const main = this.defineMainListeners();
      const items = this.defineItemsListeners();
      return [main, ...items];
    }

    defineMainListeners() {
      const mainSelector = { TRIGGER: Selector.MAIN_TRIGGER, CONTAINER: Selector.MAIN_CONTAINER };
      const mainModifier = { 
        TRIGGER_ACTIVE: Modifier.MAIN_TRIGGER_ACTIVE,
        CONTAINER_ACTIVE: Modifier.MAIN_CONTAINER_ACTIVE,
      };
      return Trigger.define(this.root, mainSelector, mainModifier);
    }

    defineItemsListeners() {
      const items = this.root.querySelectorAll(Selector.EXPANDABLE_ITEM);
      return [...items].map((item) => Trigger.define(item, Selector, Modifier));
    }
  }

  const initHamburgerComps = BEMComponent.makeAutoInitializer(Hamburger, ClassName.ROOT);

  document.addEventListener('DOMContentLoaded', initHamburgerComps);

  return Hamburger;
})(document);

export { Hamburger }
