'use strict';

import { BEMComponent } from 'scripts/BEMComponent';
import { Trigger } from 'scripts/Trigger';

const ExpandableList = ((document) => {
  const ClassName = {
    ROOT : 'js-expandable-list',
  };

  const Selector = {
    TRIGGER   : '.js-expandable-list__trigger',
    CONTAINER : '.js-expandable-list__body',
  };

  const Modifier = {
    TRIGGER_ACTIVE   : 'expandable-list__trigger_active',
    CONTAINER_ACTIVE : 'expandable-list__body_expanded',
  };

  class ExpandableList extends BEMComponent {
    constructor(element) {
      super(element, 'expandable-list');

      this.listeners = Trigger.define(element, Selector, Modifier);
      this.attachEventListener(this.listeners);
    }

    toggle() {
      this.listeners.handlers.click();
    }
  }

  const initExpandableList = BEMComponent.makeAutoInitializer(ExpandableList, ClassName.ROOT);

  document.addEventListener('DOMContentLoaded', initExpandableList);

  return ExpandableList;
})(document);

export { ExpandableList }
