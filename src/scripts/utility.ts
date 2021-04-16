import $ from 'jquery';

const Utility = (($) => {
  const transitionEndEventNames = {
    'transition'       : 'transitionend',
    'OTransition'      : 'oTransitionEnd',
    'MozTransition'    : 'transitionend',
    'WebkitTransition' : 'webkitTransitionEnd',
  };

  function getTransitionEndEventName(): string {
    const bodyStyle = document.body.style;

    for (let transitionEndProp in transitionEndEventNames) {
      if(bodyStyle[transitionEndProp] !== undefined) {
        return transitionEndEventNames[transitionEndProp];
      }
    }

    return null;
  }

  const keyQualifiers = {
    isEnterOrSpaceKey : makeKeyQualifier(['Enter', ' ']),
    isSpaceKey        : makeKeyQualifier([' ']),
    isEnterKey        : makeKeyQualifier(['Enter']),
    isTabKey          : makeKeyQualifier(['Tab']),
  }

  function makeKeyQualifier(keys: string[]): Function {
    return (event: KeyboardEvent) => keys.some((val) => val === event.key)
  }

  function makeKeydownHandler(handler: Function, keys: string[] = null): Function {
    const isMatchingKey = (keys === null) ? keyQualifiers.isEnterOrSpaceKey : makeKeyQualifier(keys);
    return function (event) {
      if (isMatchingKey(event)) {
        event.preventDefault();
        handler(event);
      }
    }
  }

  return {
    getTransitionEndEventName,
    makeKeyQualifier,
    makeKeydownHandler,
    keyQualifiers,
  };
})($);

export { Utility };
