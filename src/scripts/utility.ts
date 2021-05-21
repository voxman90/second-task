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
    isEnterKey        : makeKeyQualifier(['Enter']),
    isSpaceKey        : makeKeyQualifier([' ']),
    isEnterOrSpaceKey : makeKeyQualifier(['Enter', ' ']),
    isTabKey          : makeKeyQualifier(['Tab']),
    isArrayRightKey   : makeKeyQualifier(['ArrowRight']),
    isArrowLeftKey    : makeKeyQualifier(['ArrowLeft']),
    isArrowUpKey      : makeKeyQualifier(['ArrowUp']),
    isArrowDownKey    : makeKeyQualifier(['ArrowDown']),
    isArrowKey        : makeKeyQualifier(['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown']),
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

  type formOfWord = {
    nominative: string,
    nominativePlural: string,
    genitive: string,
    genitivePlural: string,
  }

  function getCorrectFormOfWord(numberOf: number, formOfWord: Partial<formOfWord>): formOfWord[keyof formOfWord] {
    const { nominative, genitive, genitivePlural } = formOfWord;

    if (numberOf % 100 < 11 || 14 < numberOf % 100) {
      switch (numberOf % 10) {
        case 1: {
          return nominative;
        }
        case 2:
        case 3:
        case 4: {
          return genitive;
        }
        default: {
          break;
        }
      }
    }

    return genitivePlural;
  }

  const RUBLE_SIGN = '\u20bd';

  function presentAsRublesPrice(price: number): string {
    return presentAsLocalPrice(price, '', RUBLE_SIGN);
  }

  function presentAsLocalPrice(price: number, localeSettings: string | string[], currencySign: string): string {
    return `${price.toLocaleString(localeSettings)}${currencySign}`
  }

  return {
    getCorrectFormOfWord,
    getTransitionEndEventName,
    keyQualifiers,
    makeKeyQualifier,
    makeKeydownHandler,
    presentAsRublesPrice,
  };
})($);

export { Utility };
