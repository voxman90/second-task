import { BEMComponent } from '../../scripts/scripts';

class Pagination extends BEMComponent {
  constructor(elem) {
    super('pagination');
    this.setDefaultState();
    this.appendTableRow(elem);
    this.connectBasis(elem);
    this.drawPaginatorState(this.state.current);
    this.attachListeners();
  }

  setDefaultState() {
    this.state = {
      current: 1,
      pages: 25,
      positions: 5,
      descriptor: () => {},
      callback: () => {},
    }
  }

  setState(args) {
    this.state = args;
  }

  appendTableRow(elem) {
    this.trNode = elem.querySelector('.js-pagination-tr');
    const tbody = this.trNode.parentNode;
    const tr = tbody.removeChild(this.trNode);

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
    td.classList.add('pagination__td', 'js-pagination__td');
    td.setAttribute('data-index', i);
    tr.appendChild(td);
  }

  appendButtons(tr) {
    const buttonBackward = document.createElement('td');
    buttonBackward.classList.add('pagination__td', 'pagination__button');
    const iconBackward = document.createElement('p');
    iconBackward.classList.add('pagination__icon_rotate_180deg');
    iconBackward.textContent = 'arrow_forward';
    buttonBackward.appendChild(iconBackward);
    tr.prepend(buttonBackward);

    const buttonForward = document.createElement('td');
    buttonForward.classList.add('pagination__td', 'pagination__button');
    const iconForward = document.createElement('p');
    iconForward.textContent = 'arrow_forward';
    buttonForward.appendChild(iconForward);
    tr.appendChild(buttonForward);
  }

  connectBasis(elem) {
    this.rootNode = elem;
    this.captionNode = elem.querySelector('.js-pagination__caption');
    this.tdNodes = this.trNode.querySelectorAll('.js-pagination__td:not(.js-pagination__button)');
    this.buttonBackNode = this.trNode.firstElementChild;
    this.buttonForwNode = this.trNode.lastElementChild;
  }

  drawPaginatorState() {
    const { blank, currentIndex } = this.getState();
    this.drawButtons();
    this.clearPositions();
    this.drawPositions(blank);
    this.highlightCurrent(currentIndex);
    this.drawCaption();
    const { current, callback } = this.state;
    callback(current);
  }

  clearPositions() {
    this.tdNodes.forEach((td) => {
      td.classList.remove(
        'js-pagination__td_clickable',
        'pagination__td_current',
        'pagination__td_hide'
      );
    });
  }

  drawButtons() {
    const { current, pages } = this.state;
    if (current === 1) {
      this.buttonBackNode.classList.add('pagination__button_hide');
    } else {
      this.buttonBackNode.classList.remove('pagination__button_hide');
    }

    if (current === pages) {
      this.buttonForwNode.classList.add('pagination__button_hide');
    } else {
      this.buttonForwNode.classList.remove('pagination__button_hide');
    }
  }

  drawPositions(state) {
    this.tdNodes.forEach((td, i) => {
      if (state[i] === 0) {
        td.textContent = '\u2026';
      } else if (state[i] !== null) {
        td.classList.add('js-pagination__td_clickable');
        td.textContent = state[i];
      } else {
        td.classList.add('pagination__td_hide');
      }
    });
  }

  highlightCurrent(currentIndex) {
    const currentCell = this.tdNodes[currentIndex];
    currentCell.classList.add('pagination__td_current');
  }

  drawCaption() {
    const { current, descriptor } = this.state;
    descriptor(this.captionNode, current);
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
      currentIndex: current - 1
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
      currentIndex: centerIndent + 2
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
      currentIndex: current - 1
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
      currentIndex: 1 + endLength + (current - pages)
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

  isEnoughPages() {
    const { positions, pages } = this.state;
    if (  pages <= positions ) {
      return false;
    }

    return true;
  }

  attachListeners() {
    this.bindEventListeners([
      {
        elem: this.buttonBackNode,
        event: "click",
        callback: this.handleButtonBackwardClick,
        data: { that: this },
      },

      {
        elem: this.buttonForwNode,
        event: "click",
        callback: this.handleButtonForwardClick,
        data: { that: this },
      },

      {
        elem: this.trNode,
        event: "click",
        callback: this.handleTableRowClick,
        data: { that: this },
      },
    ]);
  }

  handleButtonBackwardClick(e) {
    const that = e.that;
    that.state.current -= 1;
    that.drawPaginatorState();
  }

  handleButtonForwardClick(e) {
    const that = e.that;
    that.state.current += 1;
    that.drawPaginatorState();
  }

  handleTableRowClick(e) {
    const that = e.that;
    const tg = e.target;
    if (that.isClickableAndNotCurrent(tg)) {
      that.state.current = parseInt(tg.textContent, 10);
      that.drawPaginatorState();
    }
  }

  isClickableAndNotCurrent(target) {
    return (
      target.classList.contains('js-pagination__td_clickable')
      && !target.classList.contains('js-pagination__td_current')
    );
  }
}

const initPaginationComps = BEMComponent.makeInitializer(Pagination, '.js-pagination');

document.addEventListener('DOMContentLoaded', initPaginationComps);