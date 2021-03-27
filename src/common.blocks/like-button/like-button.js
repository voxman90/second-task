import { BEMComponent } from '../../scripts/scripts';

class LikeButton extends BEMComponent {
  constructor(elem) {
    super('like-button');
    this.connectBasis(elem);
    this.attachEventListeners();
  }

  connectBasis(elem) {
    this.root = elem;
    this.input = this.root.firstElementChild;
    this.counter = this.root.lastElementChild;
  }

  setValue(value) {
    this.input.setAttribute('data-value', value);
    this.counter.textContent = value;
  }

  getValue() {
    return parseInt(this.input.getAttribute('data-value'), 10);
  }

  attachEventListeners() {
    this.bindEventListeners([
      {
        elem: this.root,
        event: 'change',
        callback: this.handleLikeButtonClick,
        data: { that: this },
      },
    ]);
  }

  handleLikeButtonClick(e) {
    const that = e.that;
    const input = that.input;
    let count = that.getValue();
    if (input.checked) {
      count += 1;
      that.setValue(count);
    } else {
      count -= 1;
      that.setValue(count);
    }
  }
}

const initLikeButtonComps = BEMComponent.makeInitializer(
  LikeButton,
  '.js-like-button.js-auto-init'
);

document.addEventListener('DOMContentLoaded', initLikeButtonComps);
