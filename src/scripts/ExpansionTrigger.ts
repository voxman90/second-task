'use strict';

import { Utility } from 'scripts/Utility';

const ExpansionTrigger = (() => {
  interface selector {
    TRIGGER: string,
    CONTAINER: string,
    [key: string]: string,
  }

  interface modifier {
    TRIGGER_ACTIVE: string,
    CONTAINER_VISIBLE: string,
    [key: string]: string,
  }

  class ExpansionTrigger {
    root: HTMLElement;
    trigger: HTMLElement;
    container: HTMLElement;
    selectors: selector;
    modifiers: modifier;
    listeners: any;

    constructor(element: HTMLElement, selectors: selector, modifiers: modifier) {
      this.modifiers = modifiers;
      this.selectors = selectors;
      this.connectBasis(element);
      this.listeners = this.defineEventListeners();
    }

    connectBasis(element: HTMLElement): void {
      this.root = element;
      this.trigger = this.root.querySelector(this.selectors.TRIGGER);
      this.container = this.root.querySelector(this.selectors.CONTAINER);
    }

    defineEventListeners() {
      return [
        {
          element: this.trigger,
          handlers: {
            'click': this.handleTriggerClick,
            'keydown': Utility.makeKeydownHandler(this.handleTriggerClick),
          },
        },
      ];
    }

    getListeners() {
      return this.listeners;
    }

    handleTriggerClick = () => {
      this.trigger.classList.toggle(this.modifiers.TRIGGER_ACTIVE);
      this.toggleAriaExpanded(this.trigger);
      this.container.classList.toggle(this.modifiers.CONTAINER_VISIBLE);
    }

    toggleAriaExpanded(element: HTMLElement): void {
      const isAriaExpanded = 'true' === element.getAttribute('aria-expanded');
      element.setAttribute('aria-expanded', `${!isAriaExpanded}`);
    }

    expand() {
      this.trigger.classList.add(this.modifiers.TRIGGER_ACTIVE);
      this.trigger.setAttribute('aria-expanded', 'true');
      this.container.classList.add(this.modifiers.CONTAINER_VISIBLE);
    }

    close() {
      this.trigger.classList.remove(this.modifiers.TRIGGER_ACTIVE);
      this.trigger.setAttribute('aria-expanded', 'false');
      this.container.classList.remove(this.modifiers.CONTAINER_VISIBLE);
    }
  }

  return ExpansionTrigger;
})();

export { ExpansionTrigger }
