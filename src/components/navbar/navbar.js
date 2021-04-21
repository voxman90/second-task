'use strict';

import { BEMComponent } from 'scripts/BEMComponent';
import { ExpansionTrigger } from 'scripts/ExpansionTrigger';

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
    TRIGGER_ACTIVE    : 'navbar__trigger_active',
    CONTAINER_VISIBLE : 'navbar__submenu_visible',
  };

  class Navbar extends BEMComponent {
    constructor(element) {
      super(element, 'navbar');
      
      this.connectExpansionTriggers();

      const triggerListeners = this.triggers.map((trigger) => trigger.getListeners());
      this.listeners = [].concat(...triggerListeners);
      this.attachMultipleEventListeners(this.listeners);
    }

    connectExpansionTriggers() {
      const expandableItems = Array.from(this.root.querySelectorAll(Selector.EXPANDABLE_ITEM));
      this.triggers = expandableItems.map((item) => new ExpansionTrigger(item, Selector, Modifier));
    }
  }

  const initNavbarComps = BEMComponent.makeAutoInitializer(Navbar, ClassName.ROOT);

  document.addEventListener('DOMContentLoaded', initNavbarComps);

  return Navbar;
})(document);

export { Navbar }
