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
    isEnterOrSpaceKey : makeKeyQualifier(['Enter', ' '], [32, 13]),
    isSpaceKey        : makeKeyQualifier([' '], [13]),
    isEnterKey        : makeKeyQualifier(['Enter'], [32]),
    isTabKey          : makeKeyQualifier(['Tab'], [9]),
  }

  function makeKeyQualifier(keys: string[], codes: number[]): Function {
    return (event: KeyboardEvent) => {
      if (event.key !== undefined) {
        return (
          keys.some((val) => val === event.key)
        );
      }

      if (event.which !== undefined) {
        return (
          codes.some((val) => val === event.which)
        );
      }

      return null;
    }
  }

  function makeKeydownHandler(handler: Function): Function {
    return function (event) {
      if (keyQualifiers.isEnterOrSpaceKey(event)) {
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
