import $ from 'jquery';

const BEMComponent = (($, document) => {
  type eventListenerParameters = {
    element: HTMLElement | HTMLElement[],
    event: string,
    selector: string,
    data: Object,
    handler: Function,
    handlers: {
      [events: string]: Function,
    }
  };

  const ID_LENGTH = 16;
  const CHAR_SET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  const AUTO_INIT_CLASS = 'js-auto-init';

  class BEMComponent {
    protected root: HTMLElement;
    protected name: string;
    protected id: string;
    protected namespace: string;
    protected listeners: Partial<eventListenerParameters>[];

    constructor(element: HTMLElement, name: string) {
      this.root = element;
      this.name = name;
      this.id = this.createId();
      this.namespace = this.createNamespace(this.name, this.id);

      this.listeners = [];
    }

    static makeAutoInitializer(Constructor: any, rootClass: string, config: Object = null) {
      return () => {
        const selector = `.${rootClass}.${AUTO_INIT_CLASS}`;
        const components = document.querySelectorAll(selector);

        components.forEach((component) => {
          new Constructor(component);
        });
      };
    }

    protected createId(): string {
      let id = '';

      for (let i = 0; i < ID_LENGTH; i++) {
        id += this.getRandomChar();
      }

      return id;
    }

    protected createNamespace(name: string, id: string): string {
      return `${name}#${id}`;
    }

    protected createEventNameWithNamespace(event: string, namespace: string): string {
      return `${event}.${namespace}`;
    }

    protected getRandomChar(): string {
      return CHAR_SET.charAt(
        Math.floor(
          Math.random() * CHAR_SET.length
        )
      );
    }

    protected getAttributeNumericalValue(element: Element, name: string): number {
      const attributeValue = element.getAttribute(name);
      return parseInt(attributeValue, 10);
    }

    protected attachMultipleEventListeners(elps: Partial<eventListenerParameters>[]): void {
      elps.forEach(
        (elp) => this.attachEventListener(elp)
      );
    }

    protected attachEventListener(elp: Partial<eventListenerParameters>): void {
      const { element, event, handler, handlers, selector = null, data = null } = elp;
      
      if (handlers !== undefined) {
        Object.keys(handlers).forEach((events) => {
          this.attachEventListener({
            element: element,
            event: events,
            handler: handlers[events],
          })
        });

        return void(0);
      }

      const uniqeEventNames = event.split(' ')
        .map((event) => this.createEventNameWithNamespace(event, this.namespace))
        .join(' ');

      $(element).on(uniqeEventNames, selector, data, (event) => {
        handler(event);
      });
    }

    protected removeMultipleEventListeners(elps: Partial<eventListenerParameters>[]): void {
      elps.forEach(
        (elp) => this.removeEventListener(elp)
      );
    }

    protected removeEventListener(elp: Partial<eventListenerParameters>): void {
      const { element, event } = elp;
      const uniqeEventName = this.createEventNameWithNamespace(event, this.namespace);

      $(element).off(uniqeEventName);
    }

    protected isNullOrUndefined(prop: any): boolean {
      return (
        prop === undefined
        || prop === null
      );
    }
  }

  return BEMComponent;
})($, document);

export { BEMComponent };