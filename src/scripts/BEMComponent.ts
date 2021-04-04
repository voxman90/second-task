import $ from 'jquery';

const BEMComponent = (($, document) => {
  type EventListenerParameters = {
    elem: HTMLElement,
    event: string,
    callback: Function,
    data?: Object,
  };

  const ID_LENGTH = 16;
  const SET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  const AUTO_INIT_CLASS = 'js-auto-init';

  class BEMComponent {
    root: HTMLElement;
    protected name: string;
    protected id: string;
    protected namespace: string;

    constructor(element: HTMLElement, name: string) {
      this.root = element;
      this.name = name;
      this.id = this.createId();
      this.namespace = `${this.name}_${this.id}`;
    }

    protected createId(): string {
      let id = '';

      for (let i = 0; i < ID_LENGTH; i++) {
        id += this.getRandomChar();
      }

      return id;
    }

    protected getRandomChar(): string {
      return SET.charAt(
        Math.floor(
          Math.random() * SET.length
        )
      );
    }

    protected bindEventListeners(els: EventListenerParameters[]): void {
      els.forEach(
        (el) => this.bindEventListener(el)
      );
    }

    protected bindEventListener(el: EventListenerParameters): void {
      let { elem, event, callback, data } = el;

      if (this.isNullOrUndefined(data)) {
        data = {};
      }

      const eventName = `${event}.${this.namespace}`;

      $(elem).on(eventName, null, data, (e) => {
        callback(e);
      });
    }

    protected removeEventListeners(els: EventListenerParameters[]): void {
      els.forEach(
        (el) => this.removeEventListener(el)
      );
    }

    protected removeEventListener(el: EventListenerParameters): void {
      const { elem, event } = el;
      const eventName = `${event}.${this.namespace}`;

      $(elem).off(eventName);
    }

    public isNullOrUndefined(prop) {
      return (
        prop === undefined
        || prop === null
      );
    }

    static makeAutoInitializer(Constructor: any, rootClass: string, config?: Object) {
      return (event) => {
        const selector = `.${rootClass}.${AUTO_INIT_CLASS}`;
        const components = document.querySelectorAll(selector);

        components.forEach((component) => {
          new Constructor(component, config);
        });
      };
    }
  }

  return BEMComponent;
})($, document);

export { BEMComponent };