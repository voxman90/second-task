import { BEMComponent } from '../../scripts/BEMComponent';

const LikeButton = ((document) => {
  const Attributes = {
    VALUE: 'data-value',
  };

  const ClassName = {
    ROOT: 'js-like-button',
  };

  class LikeButton extends BEMComponent {
    constructor(element) {
      super(element, 'like-button');

      this.input = this.root.firstElementChild;
      this.counter = this.root.lastElementChild;

      this.attachEventListeners();
    }

    setValue(value) {
      this.input.setAttribute(Attributes.VALUE, value);
      this.counter.textContent = value;
    }

    getValue() {
      return parseInt(this.input.getAttribute(Attributes.VALUE, 10));
    }

    attachEventListeners() {
      this.listeners = [
        {
          elem: this.root,
          event: 'change',
          callback: this.handleLikeButtonClick.bind(this),
        },
      ];

      this.bindEventListeners(this.listeners);
    }

    handleLikeButtonClick() {
      let count = this.getValue();

      if (this.input.checked) {
        count += 1;
        this.setValue(count);
      } else {
        count -= 1;
        this.setValue(count);
      }
    }
  }

  const initLikeButtonComps = BEMComponent.makeAutoInitializer(
    LikeButton,
    ClassName.ROOT,
  );

  document.addEventListener('DOMContentLoaded', initLikeButtonComps);

  return LikeButton;
})(document);

export { LikeButton }
