'use strict';

import { BEMComponent } from 'scripts/BEMComponent';
import { Trigger } from 'scripts/Trigger';

const Navbar = ((document) => {
  const ClassName = {
    ROOT : 'js-navbar',
  };

  const Selector = {
    EXPANDABLE_ITEM : '.js-navbar__item_expandable',
    TRIGGER         : '.js-navbar__trigger',
    CONTAINER       : '.js-navbar__submenu',
  };

  const Modifier = {
    TRIGGER_ACTIVED   : 'navbar__trigger_active',
    CONTAINER_ACTIVED : 'navbar__submenu_visible',
  };

  class Navbar extends BEMComponent {
    constructor(element) {
      super(element, 'navbar');

      this.listeners = this.defineExpansionTriggerListeners();
      console.log(this.listeners);
      this.attachMultipleEventListeners(this.listeners);
    }

    defineExpansionTriggerListeners() {
      const items = this.root.querySelectorAll(Selector.EXPANDABLE_ITEM);
      return [...items].map((item) => Trigger.define(item, Selector, Modifier));
    }
  }

  const initNavbarComps = BEMComponent.makeAutoInitializer(Navbar, ClassName.ROOT);

  document.addEventListener('DOMContentLoaded', initNavbarComps);

  return Navbar;
})(document);

export { Navbar }
