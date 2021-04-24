'use strict';

import { Utility } from 'scripts/Utility';

const Trigger = (() => {
  interface selector {
    TRIGGER: string,
    CONTAINER: string,
    [key: string]: string,
  }

  interface modifier {
    TRIGGER_ACTIVATED: string,
    CONTAINER_ACTIVATED: string,
    [key: string]: string,
  }

  function define(element: HTMLElement, Selector: selector, Modifier: modifier) {
    const trigger = element.querySelector(Selector.TRIGGER);
    const container = element.querySelector(Selector.CONTAINER);
    const triggerClickHandler = makeTriggerClickHandler(trigger, container, Selector, Modifier);
    return [{
      element: trigger,
      handlers: {
        'click': triggerClickHandler,
        'keydown': Utility.makeKeydownHandler(triggerClickHandler),
      },
    }];
  }

  function makeTriggerClickHandler(trigger: Element, container: Element, Selector: selector, Modifier: modifier) {
    return function () {
      trigger.classList.toggle(Modifier.TRIGGER_ACTIVATED);
      container.classList.toggle(Modifier.CONTAINER_ACTIVATED);
      toggleAriaExpandle(trigger);
    }
  }

  function toggleAriaExpandle(element: Element): void {
    const isAriaExpanded = 'true' === element.getAttribute('aria-expanded');
    element.setAttribute('aria-expanded', `${!isAriaExpanded}`);
  }

  return { define }
})();

export { Trigger }
