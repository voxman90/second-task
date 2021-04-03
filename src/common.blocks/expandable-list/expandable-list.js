import { BEMComponent } from '../../scripts/BEMComponent.ts';

class ExpandableList extends BEMComponent {
  constructor(elem) {
    super('expandable-list');

    this.connectBasis(elem);

    this.bindEventListeners(this.listeners);
  }

  connectBasis(elem) {
    this.root = elem;
    this.head = elem.firstElementChild;
    this.icon = this.head.lastElementChild;
    this.body = elem.lastElementChild;

    this.listeners = [];
    this.listeners.push(
      {
        elem: this.head,
        event: 'click',
        callback: this.handleHeadClick,
        options: null,
        data: {
          that: this
        },
      },
    );
  }

  handleHeadClick(e) {
    const that = e.that;
    that.icon.classList.toggle('expandable-list__icon_turn_180deg');
    that.body.classList.toggle('expandable-list__body_hidden');
  }

  expand() {
    this.icon.classList.add('expandable-list__icon_turn_180deg');
    this.body.classList.remove('expandable-list__body_hidden');
    return this;
  }

  close() {
    this.icon.classList.remove('expandable-list__icon_turn_180deg');
    this.body.classList.add('expandable-list__body_hidden');
    return this;
  }

  off() {
    this.removeEventListeners(this.listeners);
    return this;
  }

  on() {
    this.bindEventListeners(this.listeners);
    return this;
  }
}

const initExpandableListComps = BEMComponent.makeInitializer(
  ExpandableList,
  '.js-expandable-list.js-auto-init'
);

document.addEventListener('DOMContentLoaded', initExpandableListComps);

export { ExpandableList };
