'use strict';

import { BEMComponent } from 'scripts/BEMComponent';
import { Utility } from 'scripts/Utility';

const Pagination = ((document) => {
  const Default = {
    currentPage: 1,
    pages: 15,
    segmentLength: 3,
    descriptor: _carriedDefaultDescriptor(12),
    pageSelectionHandler: () => void(0),
  }

  function _carriedDefaultDescriptor(itemPerPage) {
    return function(currentPage, pagesNumber) {
      const variantsOnPage = _getVariantsOnPage(currentPage, itemPerPage);
      const variantsNumber = _getVariantsNumber(pagesNumber, itemPerPage);
      return `${variantsOnPage} из ${variantsNumber} вариантов аренды`;
    }
  }

  function _getVariantsOnPage(currentPage, itemPerPage) {
    const from = (currentPage - 1) * itemPerPage + 1;
    const to = from + itemPerPage - 1;
    return `${from} – ${to}`;
  }

  function _getVariantsNumber(pagesNumber, itemPerPage) {
    const rawVariantsNumber = pagesNumber * itemPerPage;
    const variantsNumber = Math.floor(rawVariantsNumber / 100);

    if (variantsNumber > 0) {
      return `${variantsNumber * 100}+`;
    }

    return rawVariantsNumber;
  }

  const ClassName = {
    ROOT            : 'js-pagination',
    POSITION_LIST   : 'pagination__position-list js-pagination__position-list',
    POSITION        : 'pagination__position js-pagination__position',
    CAPTION         : 'pagination__caption js-pagination__caption',
    CAPTION_WRAPPER : 'pagination__caption-wrapper',
    BUTTON_BACKWARD : 'pagination__button-backward js-pagination__button-backward',
    BUTTON_FORWARD  : 'pagination__button-forward js-pagination__button-forward',
  }

  const Modifier = {
    POSITION_HIDDEN   : 'pagination__position_hidden',
    POSITION_CURRENT  : 'pagination__position_current',
    POSITION_CLICABLE : 'js-pagination__position_clickable',
    BUTTON_FADED      : 'pagination__button_faded',
    BUTTON_HIDDEN     : 'pagination__button_hidden',
  }

  const Selector = {
    POSITION        : '.js-pagination__position',
    POSITION_LIST   : '.js-pagination__position-list',
    BUTTON_FORWARD  : '.js-pagination__button-forward',
    BUTTON_BACKWARD : '.js-pagination__button-backward',
    CAPTION         : '.js-pagination__caption',
  }

  const ICON_BACKWARD = 'arrow_back';
  const ICON_FORWARD = 'arrow_forward';
  const ELLIPSIS = '\u2026';

  class Pagination extends BEMComponent {
    constructor(element, config = Default) {
      super(element, 'pagination');

      this._config = {};
      this._state = {};

      this._setConfig(config);
      this._state.pages = config.pages;
      this.setCurrentPage(config.currentPage);

      const pagination = this._createPagination();
      this._appendPagination(pagination);
      this._connectBasis();

      this.updatePagination();

      this.listeners = this._defineEvenListeners();
      this.attachMultipleEventListeners(this.listeners);
    }

    setCurrentPage(page) {
      const isPositive = page > 0;
      const isOutOfRange = page >= this._pages;
      if (isPositive && !isOutOfRange) {
        this._state.currentPage = page;
      }
    }

    updatePagination() {
      const state = this._getState();
      this._updateButtonsState();
      this._clearPositionsModifiers();
      this._fillPositions(state);
      this._markCurrentPosition(state);
      this._updateCaption();

      this._config.pageSelectionHandler(this._state.currentPage);
    }

    _connectBasis() {
      this._positionList = this.root.querySelector(Selector.POSITION_LIST);
      this._positions = this.root.querySelectorAll(Selector.POSITION);
      this._buttonBackward = this.root.querySelector(Selector.BUTTON_BACKWARD);
      this._buttonForward = this.root.querySelector(Selector.BUTTON_FORWARD);
      this._caption = this.root.querySelector(Selector.CAPTION);
    }

    _createPagination() {
      const positionsList = this._createPositionsList();
      const buttonBackward = this._createButtonBackward();
      const buttonForward = this._createButtonForward();
      const caption = this._createCaption();
      return `${buttonBackward}${positionsList}${buttonForward}${caption}`;
    }

    _createPositionsList() {
      const positions = this._createPositions();
      const pagesList = `<ul class="${ClassName.POSITION_LIST}">${positions}</ul>`;
      return pagesList;
    }

    _createPositions() {
      const positions = [];

      for (let i = 0; i < this._config.segmentLength + 4; i += 1) {
        positions.push(this._createPosition(i));
      }

      return positions.join('');
    }

    _createPosition(i) {
      return `<li class="${ClassName.POSITION}" data-index="${i}" role="button" tabindex="0"></li>`
    }

    _createButtonBackward() {
      return this._createButton(ClassName.BUTTON_BACKWARD, ICON_BACKWARD);
    }

    _createButtonForward() {
      return this._createButton(ClassName.BUTTON_FORWARD, ICON_FORWARD);
    }

    _createButton(className, icon) {
      return `<div class="${className}" role="button" tabindex="0">${icon}</div>`;
    }

    _createCaption() {
      return `<div class="${ClassName.CAPTION_WRAPPER}"><div class="${ClassName.CAPTION}"></div></div>`;
    }

    _appendPagination(pagination) {
      this.root.insertAdjacentHTML('afterbegin', pagination);
    }

    _setConfig(config) {
      this._config.segmentLength = config.segmentLength;
      this._config.descriptor = config.descriptor;
      this._config.pageSelectionHandler = config.pageSelectionHandler;
    }

    _getState() {
      const { currentPage, pages } = this._state;

      if (pages <= this._config.segmentLength + 1) {
        return this._getSegment(1, pages);
      }

      const currentPageLocation = this._findCurrentPageLocation(currentPage, pages);

      const start = this._getStartSegment(currentPage, currentPageLocation);
      const middle = this._getMiddleSegment(currentPage, currentPageLocation);
      const end = this._getEndSegment(currentPage, currentPageLocation);

      return this._combineSegments(start, middle, end);
    }

    _findCurrentPageLocation(currentPage, pages) {
      const segmentLength = this._config.segmentLength;

      const isCurrentPageLocatedAtStart = currentPage <= segmentLength;
      if (isCurrentPageLocatedAtStart) {
        return 'start';
      }

      const isCurrentPageLocatedAtEnd = pages - currentPage < segmentLength;
      if (isCurrentPageLocatedAtEnd) {
        return 'end';
      }

      return 'middle';
    }

    _getStartSegment(currentPage, currentPageLocation) {
      if (currentPageLocation === 'start') {
        const length = this._getStartSegmentLength(currentPage);
        return this._getSegment(1, length);
      }

      return [1];
    }

    _getStartSegmentLength(currentPage) {
      const segmentLength = this._config.segmentLength;
      if (currentPage < segmentLength) {
        return segmentLength;
      }

      return segmentLength + 1;
    }

    _getMiddleSegment(currentPage, currentPageLocation) {
      if (currentPageLocation === 'middle') {
        const length = this._config.segmentLength;
        const firstPage = currentPage - Math.ceil((length - 1) / 2);
        return this._getSegment(firstPage, length);
      }

      return null;
    }

    _getEndSegment(currentPage, currentPageLocation) {
      if (currentPageLocation === 'end') {
        const length = this._getEndSegmentLength(currentPage);
        const firstSegmentPage = this._state.pages - length + 1;
        return this._getSegment(firstSegmentPage, length);
      }

      return [this._state.pages];
    }

    _getEndSegmentLength(currentPage) {
      const segmentLength = this._config.segmentLength;
      const pages = this._state.pages;
  
      if (pages - currentPage < segmentLength - 1) {
        return segmentLength;
      }

      return segmentLength + 1;
    }

    _getSegment(from, length) {
      const segment = [];
      const to = from + length;

      for (let i = from; i < to; i += 1) {
        segment.push(i);
      }

      return segment;
    }

    _combineSegments(start, middle, end) {
      const isCurrentPageLocatedInMiddle = middle !== null;

      if (isCurrentPageLocatedInMiddle) {
        return [...start, ELLIPSIS, ...middle, ELLIPSIS, ...end];
      }

      return [...start, ELLIPSIS, ...end];
    }

    _clearPositionsModifiers() {
      this._positions.forEach((position) => {
        position.classList.remove(
          Modifier.POSITION_CLICABLE,
          Modifier.POSITION_CURRENT,
          Modifier.POSITION_HIDDEN,
        );
      });
    }

    _updateButtonsState() {
      const isFirstPage = this._state.currentPage === 1;
      this._toggleElementModifier(this._buttonBackward, Modifier.BUTTON_HIDDEN, isFirstPage);

      const isLastPage = this._state.currentPage === this._state.pages;
      this._toggleElementModifier(this._buttonForward, Modifier.BUTTON_HIDDEN, isLastPage);
    }

    _toggleElementModifier(element, modifier, condition) {
      if (condition) {
        element.classList.add(modifier);
      } else {
        element.classList.remove(modifier);
      }
    }

    _fillPositions(state) {
      this._positions.forEach((position, i) => {
        const content = state[i] || null;
        position.textContent = content;
        this._modifyPosition(position, content);
      });
    }

    _modifyPosition(position, content) {
      if (typeof content === 'number') {
        position.classList.add(Modifier.POSITION_CLICABLE);
      }

      if (content === null) {
        this._hidePosition(position);
      }
    }

    _hidePosition(position) {
      position.classList.add(Modifier.POSITION_HIDDEN);
    }

    _markCurrentPosition(state) {
      const index = state.indexOf(this._state.currentPage);
      this._positions[index].classList.add(Modifier.POSITION_CURRENT);
    }

    _updateCaption() {
      this._caption.textContent = this._config.descriptor(this._state.currentPage, this._state.pages);
    }

    _areThereEnoughPages() {
      return this._pages > this._positions;
    }

    _isClickableAndNotCurrent(element) {
      const isClickablePosition = element.classList.contains(Modifier.POSITION_CLICABLE);
      const isCurrentPage = element.classList.contains(Modifier.POSITION_CURRENT);
      return isClickablePosition && !isCurrentPage;
    }

    handleButtonBackwardClick = () => {
      this._state.currentPage -= 1;
      this.updatePagination();
    }

    handleButtonForwardClick = () => {
      this._state.currentPage += 1;
      this.updatePagination();
    }

    handlePositionListClick = (event) => {
      const et = event.target;
      if (this._isClickableAndNotCurrent(et)) {
        this._state.currentPage = parseInt(et.textContent);
        this.updatePagination();
      }
    }

    _defineEvenListeners() {
      return [
        {
          element: this._buttonBackward,
          handlers: {
            'click': this.handleButtonBackwardClick,
            'keydown': Utility.makeKeydownHandler(this.handleButtonBackwardClick),
          }
        },

        {
          element: this._buttonForward,
          handlers: {
            'click': this.handleButtonForwardClick,
            'keydown': Utility.makeKeydownHandler(this.handleButtonForwardClick),
          }
        },

        {
          element: this._positionList,
          handlers: {
            'click': this.handlePositionListClick,
            'keydown': Utility.makeKeydownHandler(this.handlePositionListClick),
          }
        },
      ]
    }
  }

  const initPaginationComps = BEMComponent.makeAutoInitializer(
    Pagination,
    ClassName.ROOT,
  );

  document.addEventListener('DOMContentLoaded', initPaginationComps);

  return Pagination;
})(document);

export { Pagination }
