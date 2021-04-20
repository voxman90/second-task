'use strict';

import { BEMComponent } from 'scripts/BEMComponent';

import { Utility } from '../../scripts/Utility';

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
      this.trigger.setAttribute('aria-expanded', false);
      this.container = this.root.querySelector(Selector.CONTAINER);

      this.listeners = this.defineEventListeners();
      this.attachMultipleEventListeners(this.listeners);
    }

    defineEventListeners() {
      return [
        {
          element: this.trigger,
          handlers: {
            'click': this.handleTriggerClick.bind(this),
            'keypdown': Utility.makeKeydownHandler(this.handleTriggerClick).bind(this),
          },
        },
      ];
    }

    handleTriggerClick() {
      this.trigger.classList.toggle(Modifier.TRIGGER_ACTIVE);
      this.toggleAriaExpanded(this.trigger);
      this.container.classList.toggle(Modifier.CONTAINER_VISIBLE);
    }

    toggleAriaExpanded(element) {
      const ariaExpandedValue = ('false' !== element.getAttribute('aria-expanded'));
      element.setAttribute('aria-expanded', !ariaExpandedValue);
    }

    expand() {
      this.trigger.classList.add(Modifier.TRIGGER_ACTIVE);
      this.trigger.setAttribute('aria-expanded', true);
      this.container.classList.add(Modifier.CONTAINER_VISIBLE);

      return this;
    }

    close() {
      this.trigger.classList.remove(Modifier.TRIGGER_ACTIVE);
      this.trigger.setAttribute('aria-expanded', false);
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
