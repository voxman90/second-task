import $ from 'jquery';

class BEMComponent {
  name: string;
  id: string;

  constructor(name: string) {
    this.name = name;
    this.id = this.createId();
  }

  #ID_LENGTH = 16;
  #SET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789';

  createId(): string {
    const length = this.#ID_LENGTH;
    let id = '';
    for (let i = 0; i < length; i++) {
      id += this.getCharFromSet();
    };

    return id;
  }

  getCharFromSet(): string {
    const SET = this.#SET;
    return SET.charAt(Math.floor(Math.random() * SET.length));
  }

  bindEventListeners(els: { elem: HTMLElement, event: string, callback: Function, data?: Object, options?: any }[]): void {
    els.forEach(
      (el) => this.bindEventListener(el)
    );
  }

  bindEventListener(arg: { elem: HTMLElement, event: string, callback: Function, data?: Object, options?: any }): void {
    let { data, elem, callback, event, options } = arg;

    // checking that data is null or undefined
    if (data == null) {
      data = {};
    }

    // checking that options is null or undefined
    if (options == null) {
      options = null;
    }

    const uniqeEventName = `${event}.${this.name}${this.id}`;

    $(elem).on(uniqeEventName, options, (event) => {
      Object.assign(event, data);
      callback(event);
    });
  }

  removeEventListeners(els: { elem: HTMLElement, event: string, callback: Function, data?: Object, options?: any }[]): void {
    els.forEach(
      (el) => this.removeEventListener(el)
    );
  }

  removeEventListener(el: { elem: HTMLElement, event: string, callback: Function, data?: Object, options?: any }): void {
    const { elem, event } = el;
    $(elem).off(`${event}.${this.name}${this.id}`);
  }

  isEnterOrSpaceKey = this.makeKeyQualifier(['Enter', ' '], [32, 13]);

  isSpaceKey = this.makeKeyQualifier([' '], [13]);

  isEnterKey = this.makeKeyQualifier(['Enter'], [32]);

  isTabKey = this.makeKeyQualifier(['Tab'], [9]);

  makeKeyQualifier(keys: string[], codes: number[]): Function {
    return (event) => {
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

      return false;
    }
  }

  static makeInitializer(Constructor: any, selector: string) {
    return () => {
      const components = document.querySelectorAll(selector);
      for (const component of components) {
        new Constructor(component);
      }
    };
  }
}

export { BEMComponent };