'use strict';

import { BEMComponent } from '../../scripts/BEMComponent';

const Expandable = ((document) => {
  const ClassName = {
    ROOT : 'js-expandable',
  };

  const Selector = {
    TRIGGER   : '.js-expandable__trigger',
    CONTAINER : '.js-expandable__container',
  };

  const Modifier = {
    TRIGGER_ACTIVE    : 'js-expandable__trigger_active',
    CONTAINER_VISIBLE : 'js-expandable__container_visible',
  }

  class Expandable extends BEMComponent {
    constructor(element, name = 'expandable') {
      super(element, name);

      this.trigger = this.root.querySelector(Selector.TRIGGER);
      this.container = this.root.querySelector(Selector.CONTAINER);

      this.listeners = this.defineEventListeners();
      this.attachMultipleEventListeners(this.listeners);
    }

    defineEventListeners() {
      return [
        {
          element: this.trigger,
          event: 'click',
          handler: this.handleTriggerClick.bind(this),
        },
      ];
    }

    handleTriggerClick() {
      this.trigger.classList.toggle(Modifier.TRIGGER_ACTIVE);
      this.container.classList.toggle(Modifier.CONTAINER_VISIBLE);
    }

    expand() {
      this.trigger.classList.add(Modifier.TRIGGER_ACTIVE);
      this.container.classList.add(Modifier.CONTAINER_VISIBLE);

      return this;
    }

    close() {
      this.trigger.classList.remove(Modifier.TRIGGER_ACTIVE);
      this.container.classList.remove(Modifier.CONTAINER_VISIBLE);

      return this;
    }

    off() {
      this.removeMultipleEventListeners(this.listeners);

      return this;
    }

    on() {
      this.attachMultipleEventListeners(this.listeners);

      return this;
    }
  }

  const initExpandableComps = BEMComponent.makeAutoInitializer(
    Expandable,
    ClassName.ROOT,
  );

  document.addEventListener('DOMContentLoaded', initExpandableComps);

  return Expandable;
})(document);

export { Expandable }
