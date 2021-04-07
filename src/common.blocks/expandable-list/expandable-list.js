import { BEMComponent } from '../../scripts/BEMComponent';

const ExpandableList = ((document) => {
  const ClassName = {
    ROOT                 : 'js-expandable-list',
    BODY_HIDDEN_MODIFIER : 'expandable-list__body_hidden',
    ICON_TURN_MODIFIER   : 'expandable-list__icon_turn_180deg',
  };

  class ExpandableList extends BEMComponent {
    constructor(element) {
      super(element, 'expandable-list');

      this.head = this.root.firstElementChild;
      this.body = this.root.lastElementChild;
      this.icon = this.head.lastElementChild;

      this.bind();
    }

    bind() {
      this.listeners = [
        {
          element: this.root,
          event: 'click',
          handler: this.handleHeadClick.bind(this),
        },
      ];

      this.attachMultipleEventListeners(this.listeners);
    }

    handleHeadClick() {
      this.icon.classList.toggle(ClassName.ICON_TURN_MODIFIER);
      this.body.classList.toggle(ClassName.BODY_HIDDEN_MODIFIER);
    }

    expand() {
      this.icon.classList.add(ClassName.ICON_TURN_MODIFIER);
      this.body.classList.remove(ClassName.BODY_HIDDEN_MODIFIER);
      return this;
    }

    close() {
      this.icon.classList.remove(ClassName.ICON_TURN_MODIFIER);
      this.body.classList.add(ClassName.BODY_HIDDEN_MODIFIER);
      return this;
    }

    off() {
      this.removeMultipleEventListeners(this.listeners);
      return this;
    }

    on() {
      this.attachMultipleEventListeners(this.listeners);
      return this;
    }
  }

  const initExpandableListComps = BEMComponent.makeAutoInitializer(
    ExpandableList,
    ClassName.ROOT,
  );

  document.addEventListener('DOMContentLoaded', initExpandableListComps);

  return ExpandableList;
})(document);

export { ExpandableList }
