import $ from 'jquery';

class BEMComponent {
  name: string;
  id: string;

  constructor(name: string) {
    this.name = name;
    this.id = this.createId(this.#ID_LENGTH);
  }

  #ID_LENGTH = 16;

  SET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789';

  createId(length: number): string {
    let id = '';

    for (let i = 0; i < length; i++) {
      id += this.SET.charAt(Math.floor(Math.random() * this.SET.length));
    };

    return id;
  }

  bindEventListeners(els: {elem: HTMLElement, event: string, callback: Function, data?: Object, options?: any}[]): void {
    els.forEach(
      (el) => this.bindEventListener(el)
    );
  }

  bindEventListener(arg: {elem: HTMLElement, event: string, callback: Function, data?: Object, options?: any}): void {
    let { data, elem, callback, event, options } = arg;
    data = data || {};
    options = options || null;

    const uniqeEventName = `${event}.${this.name}${this.id}`;

    $(elem).on(uniqeEventName, options, (event) => {
      Object.assign(event, data);
      callback(event);
    });
  }
}

export { BEMComponent };