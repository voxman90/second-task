import { BEMComponent } from '../../scripts/scripts.ts';

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
}

function initExpandableList() {
  const expandableLists = document.querySelectorAll('.js-expandable-list');

  for (const expandableList of expandableLists) {
      new ExpandableList(expandableList);
  }
}

document.addEventListener('DOMContentLoaded', initExpandableList);
