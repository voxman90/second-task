'use strict';

import { BEMComponent } from '../../scripts/BEMComponent';

const Pagination = ((document) => {
  const Default = {
    current: 1,
    pages: 25,
    positions: 5,
    descriptor: () => {},
    handler: () => {},
  }

  const ClassName = {
    ROOT          : 'js-pagination',
    TABLE_DATA    : 'pagination__td',
    TABLE_DATA_JS : 'js-pagination__td',
    BUTTON        : 'pagination__button',
  }

  const Modifier = {
    ICON_ROTATE         : 'pagination__icon_rotate_180deg',
    TABLE_DATA_HIDE     : 'pagination__td_hide',
    TABLE_DATA_CURRENT  : 'pagination__td_current',
    TABLE_DATA_CLICABLE : 'js-pagination__td_clickable',
    BUTTON_FADED        : 'pagination__button_faded',
    BUTTON_HIDE         : 'pagination__button_hide',
  }

  const Selector = {
    TABLE_ROW     : '.js-pagination__tr',
    TABLE_DATA    : '.js-pagination__td',
    TABLE_CAPTION : '.js-pagination__caption',
  }

  class Pagination extends BEMComponent {
    constructor(element) {
      super(element, 'pagination');

      this.setState(Default);

      this.connectBasis();

      this.updatePaginator(this.state.current);
      this.bind();
    }

    connectBasis() {
      this.tr = this.root.querySelector(Selector.TABLE_ROW);
      this.caption = this.root.querySelector(Selector.TABLE_CAPTION);

      this.renderTableRow();

      this.tdNodes = this.tr.querySelectorAll(Selector.TABLE_DATA);
      this.buttonBackward = this.tr.firstElementChild;
      this.buttonForward = this.tr.lastElementChild;
    }

    setState(args) {
      this.state = { ...args };
    }

    renderTableRow() {
      const tbody = this.tr.parentNode;
      const tr = tbody.removeChild(this.tr);

      let i = 0;
      while (i < this.state.positions + 2) {
        this.appendTableData(tr, i);
        i += 1;
      }

      this.appendButtons(tr);

      tbody.appendChild(tr);
    }

    appendTableData(tr, i) {
      const td = document.createElement('td');
      td.classList.add(ClassName.TABLE_DATA, ClassName.TABLE_DATA_JS);
      td.setAttribute('data-index', i);

      tr.appendChild(td);
    }

    appendButtons(tr) {
      const buttonBackward = document.createElement('td');
      buttonBackward.classList.add(ClassName.TABLE_DATA, ClassName.BUTTON);

      const iconBackward = document.createElement('p');
      iconBackward.classList.add(Modifier.ICON_ROTATE);
      iconBackward.textContent = 'arrow_forward';

      buttonBackward.appendChild(iconBackward);
      tr.prepend(buttonBackward);

      const buttonForward = document.createElement('td');
      buttonForward.classList.add(ClassName.TABLE_DATA, ClassName.BUTTON);

      const iconForward = document.createElement('p');
      iconForward.textContent = 'arrow_forward';

      buttonForward.appendChild(iconForward);
      tr.appendChild(buttonForward);
    }

    updatePaginator() {
      const { blank, currentIndex } = this.getState();
      this.updateButtonsState()
        .clearPositions()
        .fillPositions(blank)
        .highlightCurrent(currentIndex)
        .updateCaption();

      const { current, handler } = this.state;
      handler(current);
    }

    clearPositions() {
      this.tdNodes.forEach((td) => {
        td.classList.remove(
          Modifier.TABLE_DATA_CLICABLE,
          Modifier.TABLE_DATA_CURRENT,
          Modifier.TABLE_DATA_HIDE,
        );
      });

      return this;
    }

    updateButtonsState() {
      const { current, pages } = this.state;

      if (current === 1) {
        this.buttonBackward.classList.add(Modifier.BUTTON_HIDE);
      } else {
        this.buttonBackward.classList.remove(Modifier.BUTTON_HIDE);
      }

      if (current === pages) {
        this.buttonForward.classList.add(Modifier.BUTTON_HIDE);
      } else {
        this.buttonForward.classList.remove(Modifier.BUTTON_HIDE);
      }

      return this;
    }

    fillPositions(state) {
      this.tdNodes.forEach((td, i) => {
        switch (state[i]) {
          case 0: {
            td.textContent = '\u2026';
            break;
          }
          case null: {
            td.classList.add(Modifier.TABLE_DATA_HIDE);
            break;
          }
          default: {
            td.classList.add(Modifier.TABLE_DATA_CLICABLE);
            td.textContent = state[i];
            break;
          }
        }
      });

      return this;
    }

    highlightCurrent(index) {
      this.tdNodes[index].classList.add(Modifier.TABLE_DATA_CURRENT);

      return this;
    }

    updateCaption() {
      const { current, descriptor } = this.state;
      this.caption.textContent = descriptor(current);

      return this;
    }

    getState() {
      if (!this.isEnoughPages()) {
        return this.placeCurrent();
      }

      const currentPos = this.findCurrentPosition();
      if (currentPos === 'center') {
        return this.placeCurrentInTheCenter();
      }

      if (currentPos === 'start') {
        return this.placeCurrentOnTheStart();
      }

      return this.placeCurrentOnTheEnd();
    }

    placeCurrent() {
      const { current, positions, pages } = this.state;
      const blank = new Array(positions + 2);

      blank.fill(null).forEach((val, i, arr) => {
        if (i <= pages) {
          arr[i] = i;
        }
      });

      return {
        blank,
        currentIndex: current - 1,
      };
    }

    placeCurrentInTheCenter() {
      const { current, positions, pages } = this.state;

      const centerLength = positions - 2;
      const centerIndent = (centerLength % 2 === 1) ? (
        (centerLength - 1) / 2
      ) : (
        (centerLength / 2) - 1
      );
      const firstCenterPage = current - centerIndent;

      const blank = new Array(centerLength);
      blank.fill(null).forEach((val, i, arr) => {
        arr[i] = firstCenterPage + i;
      });

      return {
        blank: [1, 0, ...blank, 0, pages],
        currentIndex: centerIndent + 2,
      }
    }

    placeCurrentOnTheStart() {
      const { current, positions, pages } = this.state;

      const startLength = (current < positions - 2) ? (
        positions - 2
      ) : (
        positions - 1
      );

      const blank = new Array(startLength);
      blank.fill(null).forEach((val, i, arr) => {
        arr[i] = i + 1;
      });

      return {
        blank: [...blank, 0, pages, null, null],
        currentIndex: current - 1,
      }
    }

    placeCurrentOnTheEnd() {
      const { current, positions, pages } = this.state;

      const endLength = (pages - current + 1 < positions - 2) ? (
        positions - 2
      ) : (
        positions - 1
      );

      const blank = new Array(positions);
      blank.fill(null).forEach((val, i, arr) => {
        if (i < endLength) {
          arr[i] = (pages - endLength + 1) + i;
        }
      });

      return {
        blank: [1, 0, ...blank],
        currentIndex: 1 + endLength + (current - pages),
      }
    }

    findCurrentPosition() {
      const { current, positions, pages } = this.state;
      if (current < positions - 1) {
        return 'start';
      }

      if (pages - current + 1 < positions - 1) {
        return 'end';
      }

      return 'center';
    }

    bind() {
      this.attachMultipleEventListeners([
        {
          element: this.buttonBackward,
          event: 'click',
          handler: this.handlebuttonBackwardClick.bind(this),
        },

        {
          element: this.buttonForward,
          event: 'click',
          handler: this.handlebuttonForwardClick.bind(this),
        },

        {
          element: this.tr,
          event: 'click',
          handler: this.handleTableRowClick.bind(this),
        },
      ]);
    }

    handlebuttonBackwardClick() {
      this.state.current -= 1;
      this.updatePaginator();
    }

    handlebuttonForwardClick() {
      this.state.current += 1;
      this.updatePaginator();
    }

    handleTableRowClick(event) {
      const et = event.target;
      if (this.isClickableAndNotCurrent(et)) {
        this.state.current = parseInt(et.textContent, 10);
        this.updatePaginator();
      }
    }

    isEnoughPages() {
      const { positions, pages } = this.state;
      if (pages <= positions) {
        return false;
      }

      return true;
    }

    isClickableAndNotCurrent(element) {
      return (
        element.classList.contains(Modifier.TABLE_DATA_CLICABLE)
        && !element.classList.contains(Modifier.TABLE_DATA_CURRENT)
      );
    }
  }

  const initPaginationComps = BEMComponent.makeAutoInitializer(
    Pagination,
    ClassName.ROOT,
  );

  document.addEventListener('DOMContentLoaded', initPaginationComps);

  return Pagination
})(document);

export { Pagination }
