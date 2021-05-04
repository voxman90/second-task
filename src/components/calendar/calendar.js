'use strict';

import { BEMComponent } from 'scripts/BEMComponent';
import { Utility } from 'scripts/Utility';
import { Carousel } from 'components/carousel/carousel';

const Calendar = ((document) => {
  const monthName = {
    0: 'Январь',
    1: 'Февраль',
    2: 'Март',
    3: 'Апрель',
    4: 'Май',
    5: 'Июнь',
    6: 'Июль',
    7: 'Август',
    8: 'Сентябрь',
    9: 'Октябрь',
    10: 'Ноябрь',
    11: 'Декабрь'
  }

  const CALENDAR_CACHE_CAPACITY = 12;

  class CalendarModel {
    constructor() {
      this._cache = [];
      this._setToday();
    }

    getSheet(date, shift) {
      const month = this._reduceDateToMonth(date, shift);
      let sheet = this._getSheetFromCache(month);

      if (sheet === null) {
        sheet = this._createSheet(month);
        this._cacheSheet(sheet);
      }

      return sheet;
    }

    getToday() {
      this._setToday();
      return this.today;
    }

    getDateIndex(date, sheet) {
      try {
        return this._convertDateToIndex(date, sheet.state);
      } catch (error) {
        if (error === 'The date is null') {
          return null;
        } else if (error === 'The date goes beyond the calendar sheet') {
          return this._getDateShift(date, sheet);
        }
      }
    }

    countSheetRowsNumber(date) {
      const daysInMonth = this._countDaysInMonth(date);
      const firstDayOfMonth = this._countFirstDayOfMonth(date);
      const isFitsInFiveRows = firstDayOfMonth + daysInMonth <= 35;
      return isFitsInFiveRows ? 5 : 6;
    }

    convertIndexToDate(index, sheet) {
      const { dates, from: firstDayIndex, to: lastDayIndex, month } = sheet;
      const shift = this._findShift(index, firstDayIndex, lastDayIndex);
      const date = this._reduceDateToMonth(month, shift);
      const day = dates[index];
      date.setDate(day);
      return date;
    }

    _convertDateToIndex(date, sheet) {
      if (date === null) throw 'The date is null';

      const { dates, from: firstDayIndex, to: lastDayIndex, month } = sheet;
      const day = date.getDate();

      if (this._isSameMonthAndYear(date, month)) {
        return firstDayIndex + day - 1;
      }

      const doesSheetStartWithCurrentMonth = firstDayIndex === 0;
      const previousMonth = this._reduceDateToMonth(month, -1);
      if (
        !doesSheetStartWithCurrentMonth
        && this._isSameMonthAndYear(date, previousMonth)
      ) {
        const firstDayOfSheet = dates[0];
        const index = day - firstDayOfSheet;
        const doesIndexGoBeyondSheet = index < 0;
        if (!doesIndexGoBeyondSheet) return index;
      }

      const nextMonth = this._reduceDateToMonth(month, 1);
      if (this._isSameMonthAndYear(date, nextMonth)) {
        const index = day + firstDayIndex + lastDayIndex;
        const doesIndexGoBeyondSheet = dates[index] === undefined;
        if (!doesIndexGoBeyondSheet) return index;
      }

      throw 'The date goes beyond the calendar sheet';
    }

    convertDateToMYYYY(date) {
      const month = monthName[date.getMonth()];
      const year = date.getFullYear();
      return `${month} ${year}`;
    }
    
    convertDateToDDMMYYYY(date) {
      const DD = date.getDate();
      const MM = `0${date.getMonth() + 1}`.slice(-2);
      const YYYY = date.getFullYear();
      return [DD, MM, YYYY].join('.');
    }
    
    convertDatesToDDMDDM(arrival, departure) {
      const arrivalDay = arrival.getDate();
      const arrivalMonth = monthName[arrival.getMonth()]
        .substring(0, 3)
        .toLowerCase();

      const departureDay = departure.getDate();
      const departureMonth = monthName[departure.getMonth()]
        .substring(0, 3)
        .toLowerCase();

      return `${arrivalDay} ${arrivalMonth} - ${departureDay} ${departureMonth}`;
    }

    isSameDayOrLater(date, modelDate) {
      const isThisLaterDate = modelDate.getTime() - date.getTime() < 0;
      return this._isSameDay(date, modelDate) || isThisLaterDate;
    }

    _isSameDay(dateA, dateB) {
      if (this._isSameMonthAndYear(dateA, dateB)) {
        return dateA.getDate() === dateB.getDate();
      }

      return false;
    }

    _getSheetFromCache(date) {
      const sheet = this._cache.find((sheet) =>
        this._isSameMonthAndYear(date, sheet.month)
      );

      return (sheet === undefined) ? null : sheet;
    }

    _getDateShift(date, sheet) {
      const difference = date.getTime() - sheet.state.month.getTime();

      if (difference < 0) {
        return -999;
      }

      return 999;
    }

    _setToday() {
      this.today = new Date();
    }

    _cacheSheet(sheet) {
      if (this._cache.length === CALENDAR_CACHE_CAPACITY) {
        this._cache.shift();
      }

      this._cache.push(sheet);
    }

    _createSheet(date) {
      const month = this._reduceDateToMonth(date);
      const daysInMonth = this._countDaysInMonth(month);

      const previousMonth = this._reduceDateToMonth(date, -1);
      const daysInPreviousMonth = this._countDaysInMonth(previousMonth);

      const firstDayIndex = this._countFirstDayOfMonth(month);
      const lastDayIndex = firstDayIndex + daysInMonth - 1;

      const rows = this.countSheetRowsNumber(month);
      const lastSheetIndex = rows * 7 - 1;

      const dates = [];

      // The days of the previous month included in this calendar sheet
      for(let i = 1; i <= firstDayIndex; i++) {
        dates.push(daysInPreviousMonth - firstDayIndex + i);
      }

      // The days of the current month included in this calendar sheet
      for(let i = 1; i <= daysInMonth; i++) {
        dates.push(i);
      }

      // The days of the next month included in this calendar sheet
      for(let i = 1; i <= lastSheetIndex - lastDayIndex; i++) {
        dates.push(i);
      }

      return { dates, from: firstDayIndex, to: lastDayIndex, month };
    }

    _reduceDateToMonth(date, shift = 0) {
      const dateMod = new Date(date);
      dateMod.setMonth(date.getMonth() + shift, 1);
      return dateMod;
    }

    _findShift(index, firstDayIndex, lastDayIndex) {
      let shift = 0;
      const isPreviousMonth = index < firstDayIndex;
      const isNextMonth = lastDayIndex < index;
      if (isPreviousMonth) shift = -1;
      if (isNextMonth) shift = 1;
      return shift;
    }

    _countDaysInMonth(date) {
      const dateMod = new Date(date);
      dateMod.setDate(31);
      return 31 - dateMod.getDate() % 31;
    }

    _countFirstDayOfMonth(dateArg) {
      const date = this._reduceDateToMonth(dateArg);
      const firstDayOfMonth = date.getDay();

      // [1..6, 0] --> [0..6]
      return (firstDayOfMonth + 6) % 7;
    }

    _countSheetRow(date) {
      const firstDayOfMonth = this._countFirstDayOfMonth(date);
      const day = date.getDate();
      return Math.floor((firstDayOfMonth + day - 0.1) / 7);
    }

    _isSameMonthAndYear(dateA, dateB) {
      const isSameMonth = dateA.getMonth() === dateB.getMonth();
      const isSameYear = dateA.getYear() === dateB.getYear();
      return isSameMonth && isSameYear;
    }
  }

  const ClassName = {
    ROOT         : 'js-calendar',
    CELL         : 'calendar__td',
  }

  const Modifier = {
    ROW_HIDDEN         : 'calendar__tr_hidden',
    CELL_CURRENT_MONTH : 'calendar__td_current',
    TRACE_TODAY        : 'calendar__trace_today',
    TRACE_ARRIVAL      : 'calendar__trace_arrival',
    TRACE_DEPARTURE    : 'calendar__trace_departure',
    TRACE_FILLED       : 'calendar__trace_filled',
  }

  const Selector = {
    TITLE           : '.js-calendar__title',
    BUTTON_BACKWARD : '.js-calendar__button-backward',
    BUTTON_FORWARD  : '.js-calendar__button-forward',
    SHEET           : '.js-calendar__sheet',
    TBODY           : '.js-calendar__tbody',
    ROW_6TH         : '.js-calendar__tr-6th',
    CELL            : '.js-calendar__td',
    BUTTON_CLEAR    : '.js-calendar__button-clear',
    BUTTON_APPLY    : '.js-calendar__button-apply',
  }

  const NUMBER_OF_SHEETS = 2;

  const calendarCarouselConfig = {
    haveButtons: false,
    haveNavbar: false,
  }

  class CalendarSlider extends Carousel {
    constructor(element) {
      super(element, 'calendar-slider', calendarCarouselConfig);
    }
  }

  class Calendar extends BEMComponent {
    constructor(element) {
      super(element, 'calendar');

      this.model = new CalendarModel();
      this.slider = new CalendarSlider(this.root);

      this.arrival = null;
      this.departure = null;
      this.currentIndex = 0;

      this._connectBasis();
      this.updateCurrentSheet(this.model.getToday());

      this.listeners = this._defineEventListeners();
      this.attachMultipleEventListeners(this.listeners);
    }

    updateCurrentSheet(date) {
      this._setCurrentSheetState(date);
      this._updateSheet(this._getCurrentSheet());
    }

    setArrival(date) {
      const isArrivalAfterToday = this.model.isSameDayOrLater(date, this.model.today);
      const isDepartureDateUnset = this.departure === null;
      const isDepartureAfterArrival = isDepartureDateUnset || this.model.isSameDayOrLater(this.departure, date);
      if (isArrivalAfterToday && isDepartureAfterArrival) {
        this.arrival = date;
        return true;
      }

      return false;
    }

    setDeparture(date) {
      const isDepartureAfterToday = this.model.isSameDayOrLater(date, this.model.today);
      const isArrivalDateUnset = this.arrival === null;
      const isDepartureAfterArrival = isArrivalDateUnset || this.model.isSameDayOrLater(date, this.arrival);
      if (isDepartureAfterToday && isDepartureAfterArrival) {
        this.departure = date;
        return true;
      }

      return false;
    }

    getClosestDate() {
      if (this.arrival !== null) {
        return this.arrival;
      }

      if (this.departure !== null) {
        return this.departure;
      }

      return this.model.getToday();
    }

    _connectBasis() {
      this.title = this.root.querySelector(Selector.TITLE);
      this._connectSheets();
      this._connectButtons();
    }

    _connectSheets() {
      const sheets = Array.from(this.root.querySelectorAll(Selector.SHEET));

      this.sheets = sheets.map((sheet) => {
        return {
          self: sheet,
          tableBody: sheet.querySelector(Selector.TBODY),
          tableCells: sheet.querySelectorAll(Selector.CELL),
          table6thRow: sheet.querySelector(Selector.ROW_6TH),
          state: null,
        }
      });
    }

    _connectButtons() {
      this.buttonBackward = this.root.querySelector(Selector.BUTTON_BACKWARD);
      this.buttonForward = this.root.querySelector(Selector.BUTTON_FORWARD);
      this.buttonClear = this.root.querySelector(Selector.BUTTON_CLEAR);
      this.buttonApply = this.root.querySelector(Selector.BUTTON_APPLY);

      this.hooks = {
        buttonClearClick: () => void(0),
        buttonApplyClick: () => void(0),
      }
    }

    _setCurrentSheetState(date, shift = 0) {
      this._setSheetState(this.currentIndex, date, shift);
    }

    _setNextSheetState(date, shift = 0) {
      this._setSheetState(this._getNextIndex(), date, shift);
    }

    _setSheetState(index, date, shift) {
      this.sheets[index].state = this.model.getSheet(date, shift);
    }

    _setDateFromIndex(index, sheet) {
      const date = this.model.convertIndexToDate(index, sheet);
      const isArrivalSet = this.arrival !== null;
      const isDepartureSet = this.departure !== null;

      if (!isArrivalSet && !isDepartureSet) {
        return this.setArrival(date);
      }

      if (isArrivalSet) {
        const isCorrectDepartureDate = this.setDeparture(date);
        if (isCorrectDepartureDate) {
          return true;
        }
      }

      if (isDepartureSet) {
        const isCorrectArrivalDate = this.setArrival(date);
        if (isCorrectArrivalDate) {
          return true;
        }
      }

      return this.setDeparture(date);
    }

    _getMonth(sheetIndex) {
      return this.sheets[sheetIndex].state.month;
    }

    _getNextIndex() {
      return (this.currentIndex + 1) % NUMBER_OF_SHEETS;
    }

    _getCurrentSheet() {
      return this.sheets[this.currentIndex];
    }

    _getNextSheet() {
      return this.sheets[this._getNextIndex()];
    }

    _getNextMonth() {
      return this._getMonth(this._getNextIndex());
    }

    _getCurrentMonth() {
      return this._getMonth(this.currentIndex);
    }

    _getCellIndex(cell) {
      return parseInt(cell.dataset.index, 10) - 1;
    }

    _toggleHiddenRow(sheet, month) {
      const rows = this.model.countSheetRowsNumber(month);
      if (rows === 6) {
        sheet.table6thRow.classList.remove(Modifier.ROW_HIDDEN);
      } else {
        sheet.table6thRow.classList.add(Modifier.ROW_HIDDEN);
      }
    }

    _drawSheet(sheet) {
      this._drawTitle(sheet);
      this._drawDates(sheet);
      this._drawToday(sheet);
      this._drawDateRange(sheet);
    }

    _drawTitle(sheet) {
      const month = sheet.state.month;
      this.title.textContent = this.model.convertDateToMYYYY(month);
    }

    _drawDates(sheet) {
      const { dates, from: firstDayIndex, to: lastDayIndex, month } = sheet.state;
      this._toggleHiddenRow(sheet, month);
      sheet.tableCells.forEach((cell, i) => {
        this._drawCellContent(cell, dates[i]);
        const isCurrentMonth = firstDayIndex <= i && i <= lastDayIndex;
        if (isCurrentMonth) {
          cell.classList.add(Modifier.CELL_CURRENT_MONTH);
        }
      });
    }

    _drawCellContent(cell, content) {
      const cellContent = cell.firstElementChild.firstElementChild;
      cellContent.textContent = content;
    }

    _drawToday(sheet) {
      const todayIndex = this.model.getDateIndex(this.model.today, sheet);
      if (this._isCorrectIndex(todayIndex)) {
        const cell = sheet.tableCells[todayIndex];
        this._modifyCellTrace(cell, Modifier.TRACE_TODAY);
      }
    }

    _drawDateRange(sheet) {
      const arrivalIndex = this._getArrivalIndex(sheet);
      const departureIndex = this._getDepartureIndex(sheet);

      this._drawArrival(sheet, arrivalIndex);
      this._drawDeparture(sheet, departureIndex);
      this._drawTrace(sheet, arrivalIndex, departureIndex);
    }

    _getDepartureIndex(sheet) {
      return this.model.getDateIndex(this.departure, sheet);
    }

    _getArrivalIndex(sheet) {
      return this.model.getDateIndex(this.arrival, sheet);
    }

    _drawTrace(sheet, arrivalIndex, departureIndex) {
      const isArrivalSet = this.arrival !== null;
      const isDepartureSet = this.departure !== null;
      const areArrivalAndDepartureIndexesEqual = arrivalIndex === departureIndex;
      if (isArrivalSet && isDepartureSet && !areArrivalAndDepartureIndexesEqual) {
        sheet.tableCells.forEach((cell, i) => {
          if (arrivalIndex <= i && i <= departureIndex) {
            this._modifyCellTrace(cell, Modifier.TRACE_FILLED);
          }
        });
      }
    }

    _drawArrival(sheet, index) {
      if (this._isCorrectIndex(index)) {
        const cell = sheet.tableCells[index];
        this._modifyCellTrace(cell, Modifier.TRACE_ARRIVAL);
      }
    }

    _drawDeparture(sheet, index) {
      if (this._isCorrectIndex(index)) {
        const cell = sheet.tableCells[index];
        this._modifyCellTrace(cell, Modifier.TRACE_DEPARTURE);
      }
    }

    _drawNextSheet(month, shift) {
      const nextSheet = this._getNextSheet();
      nextSheet.state = this.model.getSheet(month, shift);
      this._updateSheet(nextSheet);
    }

    _modifyCellTrace(cell, modifier) {
      const trace = cell.firstElementChild;
      trace.classList.add(modifier);
    }

    _clearSheet(sheet) {
      const modifiers = [
        Modifier.TRACE_TODAY,
        Modifier.TRACE_ARRIVAL,
        Modifier.TRACE_DEPARTURE,
        Modifier.TRACE_FILLED,
      ];

      this._clearTrace(sheet, modifiers);
      this._clearCells(sheet, [Modifier.CELL_CURRENT_MONTH]);
    }

    _clearDateRange(sheet) {
      const modifiers = [
        Modifier.TRACE_ARRIVAL,
        Modifier.TRACE_DEPARTURE,
        Modifier.TRACE_FILLED,
      ];

      this._clearTrace(sheet, modifiers);
    }

    _clearCells(sheet, modifiers) {
      sheet.tableCells.forEach((cell) => {
        cell.classList.remove(...modifiers)
      });
    }

    _clearTrace(sheet, modifiers) {
      sheet.tableCells.forEach((cell) => {
        cell.firstElementChild.classList.remove(...modifiers)
      });
    }

    _updateSheet(sheet) {
      this._clearSheet(sheet);
      this._drawSheet(sheet);
    }

    _updateDateRange(sheet) {
      this._clearDateRange(sheet);
      this._drawDateRange(sheet);
    }

    _transferFocus(prevIndex, prevState) {
      const date = this.model.convertIndexToDate(prevIndex, prevState);
      const currentSheet = this._getCurrentSheet();
      const newIndex = this.model.getDateIndex(date, currentSheet);
      this._setFocusOnCell(newIndex, currentSheet);
    }

    _setFocusOnCell(index, sheet) {
      sheet.tableCells[index].focus();
    }

    _slidingStart() {
      this.slider.isSliding = true;
    }

    _slidingEnd() {
      this.slider.isSliding = false;
    }

    _isSliding() {
      return this.slider.isSliding;
    }

    _isCorrectIndex(i) {
      const isNull = i === null;
      const isWithinSheetBoundaries = 0 <= i && i < 42;
      return !isNull && isWithinSheetBoundaries;
    }

    _prepareNextSheet(shift) {
      this._drawNextSheet(this._getCurrentMonth(), shift);
    }

    async _flip(shift) {
      const from = this.currentIndex;
      const to = this._getNextIndex();

      if (shift === 1) {
        return this.slider.slideToLeft(from, to);
      }

      return this.slider.slideToRight(from, to);
    }

    async _handleArrowButtonClick(shift) {
      if (!this._isSliding()) {
        this._slidingStart();
        this._prepareNextSheet(shift);
        await this._flip(shift).finally(() => {
          this.currentIndex = this._getNextIndex(shift);
          this._slidingEnd();
        });
      }
    }

    handleButtonApplyClick = () => {
      const arrival = this.arrival;
      const departure = this.departure;

      this.hooks.buttonApplyClick(arrival, departure);
    }

    handleButtonClearClick = () => {
      this.arrival = null;
      this.departure = null;
      this.updateCurrentSheet(this.model.getToday());

      this.hooks.buttonClearClick();
    }

    handleTableBodyClick = (event) => {
      const et = event.target;
      const isThisCell = et.classList.contains(ClassName.CELL);

      if (isThisCell) {
        this._handleCellClick(event, et);
      }
    }

    _handleCellClick(event, cell) {
      const { sheet, sheet: { state, state: { from, to } } } = event.data;
      const index = this._getCellIndex(cell);
      const isThisPreviousMonth = index < from;
      const isThisNextMonth = to < index;
      const isThisCurrentMonth = !isThisPreviousMonth && !isThisNextMonth;

      if (isThisPreviousMonth) {
        this._handleArrowButtonClick(-1).then(() => {
          this._transferFocus(index, state);
        });
      }

      if (isThisNextMonth) {
        this._handleArrowButtonClick(1).then(() => {
          this._transferFocus(index, state);
        });
      }

      if (isThisCurrentMonth) {
        this._setDateFromIndex(index, state);
        this._updateDateRange(sheet);
      }
    }

    handleButtonBackwardClick = () => {
      this._handleArrowButtonClick(-1);
    }

    handleButtonForwardClick = () => {
      this._handleArrowButtonClick(1);
    }

    _defineEventListeners() {
      return [
        {
          element: this.buttonBackward,
          handlers: { 'click': this.handleButtonBackwardClick, 'keydown': Utility.makeKeydownHandler(this.handleButtonBackwardClick) }
        },

        {
          element: this.buttonForward,
          handlers: { 'click': this.handleButtonForwardClick, 'keydown': Utility.makeKeydownHandler(this.handleButtonForwardClick) }
        },

        {
          element: this.buttonClear,
          handlers: { 'click': this.handleButtonClearClick, 'keydown': Utility.makeKeydownHandler(this.handleButtonClearClick) }
        },

        {
          element: this.buttonApply,
          handlers: { 'click': this.handleButtonApplyClick, 'keydown': Utility.makeKeydownHandler(this.handleButtonApplyClick) }
        },

        {
          element: this.sheets[0].tableBody,
          data: { sheet: this.sheets[0] },
          handlers: { 'click': this.handleTableBodyClick, 'keydown': Utility.makeKeydownHandler(this.handleTableBodyClick) }
        },

        {
          element: this.sheets[1].tableBody,
          data: { sheet: this.sheets[1] },
          handlers: { 'click': this.handleTableBodyClick, 'keydown': Utility.makeKeydownHandler(this.handleTableBodyClick) }
        },
      ];
    }
  }

  return Calendar;
})(document);

export { Calendar }
