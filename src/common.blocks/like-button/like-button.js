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
    const counter = that.counter;
    let count = parseInt(input.getAttribute('value'), 10);
    if (input.checked) {
      count = (count + 1).toString();
      input.setAttribute('value', count);
      counter.textContent = count;
    } else {
      count = (count - 1).toString();
      input.setAttribute('value', count);
      counter.textContent = count;
    }
  }
}

const initLikeButtonComps = BEMComponent.makeInitializer(LikeButton, '.js-like-button');

document.addEventListener('DOMContentLoaded', initLikeButtonComps);