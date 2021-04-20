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
      this.today = new Date();
      this.cache = [];
    }

    getSheet(date, shift) {
      const month = this.changeMonth(date, shift);
      let sheet = this.getSheetFromCache(month);

      if (sheet === null) {
        sheet = this.createSheet(month);
        this.cacheSheet(sheet);
      }

      return sheet;
    }

    getSheetFromCache(date) {
      const sheet = this.cache.find(
        (sheet) => this.isSameYearAndMonth(sheet.month, date)
      );
      return (sheet !== undefined) ? sheet : null;
    }

    getToday() {
      this.today = new Date();
      return this.today;
    }

    cacheSheet(sheet) {
      if (this.cache.length === CALENDAR_CACHE_CAPACITY) {
        this.cache.shift();
      }

      this.cache.push(sheet);
    }

    createSheet(date) {
      const month = this.changeMonth(date, 0);
      const prevMonth = this.changeMonth(date, -1);

      const days = this.countDays(month);
      const prevDays = this.countDays(prevMonth);

      const rows = this.countSheetRowsNumber(month);
      const end = rows * 7;

      const from = this.countFirstDayOfMonth(month);
      const to = from + days;
      
      const dates = [];

      // Days of the previous month.
      for (let i = 0; i < from; i++) {
        dates.push(prevDays - from + i + 1);
      }

      for (let i = from; i < to; i++) {
        dates.push(i - from + 1);
      }

      // Days of the next month.
      let j = 1;
      for (let i = to; i < end; i++) {
        dates.push(j);
        j += 1;
      } 

      return { dates, from, to, month };
    }

    changeMonth(dateArg, shift) {
      const date = new Date(dateArg);
      date.setMonth(dateArg.getMonth() + shift, 1);
      return date;
    }

    countDays(dateArg) {
      const date = new Date(dateArg);
      date.setDate(31);
      return 31 - date.getDate() % 31;
    }

    countMonths(date) {
      return date.getYear() * 12 + date.getMonth() + 1;
    }

    countFirstDayOfMonth(dateArg) {
      const date = this.changeMonth(dateArg, 0);
      const firstDayOfMonth = date.getDay();

      // This is so that the days of the week are counted from Monday, not Sunday.
      return (firstDayOfMonth + 6) % 7;
    }

    countSheetRow(date) {
      const firstDayOfMonth = this.countFirstDayOfMonth(date);
      const day = date.getDate();
      return Math.floor((firstDayOfMonth + day - 0.1) / 7);
    }
    
    countSheetRowsNumber(date) {
      const days = this.countDays(date);
      const firstDayOfMonth = this.countFirstDayOfMonth(date);
      return (firstDayOfMonth + days > 35) ? 6 : 5;
    }

    convertIndexToDate(index, sheet) {
      const { dates, from, to, month } = sheet;

      let shift = 0;
      if (index < from) { shift = -1 }
      if (to <= index) { shift = 1 }
      const date = this.changeMonth(month, shift);
  
      const day = dates[index];
      date.setDate(day);
      
      return date;
    }

    convertDateToIndex(date, sheet) {
      const { dates, from, to, month } = sheet;

      if (date === null) {
        return null;
      }

      if (this.isSameYearAndMonth(date, month)) {
        // getDate() -> 1 - 31
        return date.getDate() + from - 1;
      } 
      
      const prevMonth = this.changeMonth(month, -1);
      if (this.isSameYearAndMonth(date, prevMonth)) {
        const index = date.getDate() - dates[0];

        if (index >= 0) {
          return index;
        }

        return -999;
      }

      const nextMonth = this.changeMonth(month, 1);
      if (this.isSameYearAndMonth(date, nextMonth)) {
        const index = date.getDate() + from + to - 1;

        if (dates[index]) {
          return index;
        }

        return 999;
      }

      return null;
    }
    
    converDateToMYYYY(date) {
      const month = monthName[date.getMonth()];
      const year = date.getFullYear();
      return `${month} ${year}`;
    }
    
    convertDateToDDMMYYYY(date) {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day}${month}${year}`;
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

    isSameYearAndMonth(dateA, dateB) {
      return (
        dateA.getMonth() === dateB.getMonth()
        && dateA.getYear() === dateB.getYear()
      );
    }

    isSameDayOrAfter(date, bottomDate) {
      if (
        bottomDate === null
        || date === null
      ) {
        return true;
      }

      const bottomTime = bottomDate.getTime();
      const dateTime = date.getTime();
      const diff = dateTime - bottomTime;

      if (diff > 0) {
        return true;
      }

      if (this.isSameYearAndMonth(date, bottomDate)) {
        return (
          date.getDate() === bottomDate.getDate()
        );
      }

      return false;
    }
  }

  const ClassName = {
    ROOT         : 'js-calendar',
    CELL         : 'calendar__td',
    CELL_CONTENT : 'calendar__td-content',
  }

  const Modifier = {
    ROW_HIDDEN         : 'calendar__tr_hidden',
    CELL_DEPARTURE     : 'calendar__td_departure',
    CELL_ARRIVAL       : 'calendar__td_arrival',
    CELL_FILLED        : 'calendar__td_filled',
    CELL_TODAY         : 'calendar__td_today',
    CELL_CURRENT_MONTH : 'calendar__td_current',
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

      this.connectBasis();
      this.connectButtons();

      this.setCurrentSheet(this.model.today, 0);

      const currentSheet = this.sheets[this.currentIndex]
      const currentMonth = currentSheet.state.month
      this.drawTitle(currentMonth);
      this.drawSheet(currentSheet);

      this.listeners = this.defineEventListeners();
      this.attachMultipleEventListeners(this.listeners);
    }

    connectBasis() {
      this.title = this.root.querySelector(Selector.TITLE);

      const sheets = Array.from(this.root.querySelectorAll(Selector.SHEET));
      this.sheets = sheets.map((sheet) => this.connectSheet(sheet));
    }

    connectSheet(sheet) {
      return {
        self: sheet,
        tableBody: sheet.querySelector(Selector.TBODY),
        tableCells: sheet.querySelectorAll(Selector.CELL),
        table6thRow: sheet.querySelector(Selector.ROW_6TH),
        state: null,
      }
    }

    connectButtons() {
      this.buttonBackward = this.root.querySelector(Selector.BUTTON_BACKWARD);
      this.buttonForward = this.root.querySelector(Selector.BUTTON_FORWARD);
      this.buttonClear = this.root.querySelector(Selector.BUTTON_CLEAR);
      this.buttonApply = this.root.querySelector(Selector.BUTTON_APPLY);

      this.hooks = {
        buttonClearClick: () => {},
        buttonApplyClick: () => {},
      }
    }
    
    defineEventListeners() {
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

    updateCurrentSheet(date) {
      this.setCurrentSheet(date, 0);
      this.drawTitle(date);
      this.drawCurrentSheet();
    }

    setCurrentSheet(date, shift) {
      this.setSheet(this.currentIndex, date, shift);
    }

    setNextSheet(date, shift) {
      this.setSheet(this.getNextIndex(), date, shift);
    }

    setSheet(index, date, shift) {
      this.sheets[index].state = this.model.getSheet(date, shift);
    }

    setArrival(date) {
      if (
        this.model.isSameDayOrAfter(date, this.model.today)
        && this.model.isSameDayOrAfter(this.departure, date)
      ) {
        this.arrival = date;
        return true;
      }

      return false;
    }

    setDeparture(date) {
      if (this.model.isSameDayOrAfter(date, this.arrival)) {
        this.departure = date;
        return true;
      }

      return false;
    }

    setDateFromIndex(index, sheet) {
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

    getMonth(sheetIndex) {
      return this.sheets[sheetIndex].state.month;
    }

    getNextIndex() {
      return (this.currentIndex + 1) % NUMBER_OF_SHEETS;
    }

    getCurrentSheet() {
      return this.sheets[this.currentIndex];
    }

    getNextSheet() {
      return this.sheets[this.getNextIndex()];
    }

    getNextMonth() {
      return this.getMonth(this.getNextIndex());
    }

    getCurrentMonth() {
      return this.getMonth(this.currentIndex);
    }

    getCellIndex(cell) {
      return parseInt(cell.dataset.index, 10) - 1;
    }

    getArrivalIndex(sheet) {
      const state = sheet.state;
      return this.model.convertDateToIndex(this.arrival, state);
    }

    getDepartureIndex(sheet) {
      const state = sheet.state;
      return this.model.convertDateToIndex(this.departure, state);
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

    drawCurrentSheet() {
      this.drawSheet(this.getCurrentSheet());
    }

    drawSheet(sheet) {
      this.clearSheet(sheet);

      this.drawDates(sheet);
      this.drawToday(sheet);
      this.drawTrace(sheet);
    }

    clearSheet(sheet) {
      const sheetModifiers = [
        Modifier.CELL_ARRIVAL,
        Modifier.CELL_DEPARTURE,
        Modifier.CELL_FILLED,
        Modifier.CELL_TODAY,
        Modifier.CELL_CURRENT_MONTH
      ];

      this.clearCells(sheet, sheetModifiers);
    }

    clearTrace(sheet) {
      const traceModifiers = [
        Modifier.CELL_ARRIVAL,
        Modifier.CELL_DEPARTURE,
        Modifier.CELL_FILLED
      ];

      this.clearCells(sheet, traceModifiers);
    }

    clearCells(sheet, modifiers) {
      sheet.tableCells.forEach((cell) => {
        cell.classList.remove(...modifiers)
      });
    }

    drawTitle(month) {
      this.title.textContent = this.model.converDateToMYYYY(month);
    }

    drawToday(sheet) {
      const { state } = sheet;
      const todayIndex = this.model.convertDateToIndex(this.model.today, state);
      this.modifyCell(sheet, todayIndex, Modifier.CELL_TODAY);
    }

    drawArrival(sheet, index) {
      this.modifyCell(sheet, index, Modifier.CELL_ARRIVAL);
    }

    drawDeparture(sheet, index) {
      this.modifyCell(sheet, index, Modifier.CELL_DEPARTURE);
    }

    modifyCell(sheet, index, modifier) {
      if (this.isCorrectIndex(index)) {
        sheet.tableCells[index].classList.add(modifier);
      }
    }

    drawDates(sheet) {
      const { dates, from, to, month } = sheet.state;
      const rows = this.model.countSheetRowsNumber(month);

      this.expandHiddenRow(sheet, rows);

      sheet.tableCells.forEach((cell, i) => {
        if (from <= i && i < to) {
          cell.classList.add(Modifier.CELL_CURRENT_MONTH);
        }

        this.drawCellContent(cell, dates[i]);
      });
    }

    drawCellContent(cell, content) {
      cell.firstElementChild.textContent = content;
    }

    expandHiddenRow(sheet, rows) {
      if (rows === 6) {
        sheet.table6thRow.classList.remove(Modifier.ROW_HIDDEN);
      } else {
        sheet.table6thRow.classList.add(Modifier.ROW_HIDDEN);
      }
    }

    drawTrace(sheet) {
      const arr = this.arrival;
      const dep = this.departure;
      const arrIndex = this.getArrivalIndex(sheet);
      const depIndex = this.getDepartureIndex(sheet);

      this.drawArrival(sheet, arrIndex);
      this.drawDeparture(sheet, depIndex);

      if (this.isNotNullAndNotEqual(arr, dep, arrIndex, depIndex)) {
        let start = 0;
        let end = sheet.tableCells.length;

        if (arrIndex !== null) {
          start = arrIndex;
        }

        if (depIndex !== null) {
          end = depIndex;
        }

        sheet.tableCells.forEach((cell, i) => {
          if (start <= i && i <= end) {
            cell.classList.add(Modifier.CELL_FILLED);
          }
        });
      }
    }

    handleTableBodyClick = (event) => {
      const { target: et, target: { classList } } = event;
      const isCell = classList.contains(ClassName.CELL);
      const isCellContent = classList.contains(ClassName.CELL_CONTENT);

      if (isCell) {
        this.handleCellClick(event, et);
      }

      if (isCellContent) {
        this.handleCellClick(event, et.parentElement);
      }
    }

    handleCellClick(event, cell) {
      const { data: { sheet, sheet: { state, state: { from, to } } } } = event;
      const index = this.getCellIndex(cell);
      const isPrevMonth = index < from;
      const isNextMonth = to <= index;
      const isCurrentMonth = !isPrevMonth && !isNextMonth;

      if (isPrevMonth) {
        this.handleArrowButtonClick(-1).then(() => {
          this.transferFocus(index, state);
        });
      }

      if (isNextMonth) {
        this.handleArrowButtonClick(1).then(() => {
          this.transferFocus(index, state);
        });
      }

      if (isCurrentMonth) {
        this.setDateFromIndex(index, state);
        this.redrawTrace(sheet);
      }
    }

    redrawTrace(sheet) {
      this.clearTrace(sheet);
      this.drawTrace(sheet);
    }

    handleButtonBackwardClick = () => {
      this.handleArrowButtonClick(-1);
    }

    handleButtonForwardClick = () => {
      this.handleArrowButtonClick(1);
    }

    async handleArrowButtonClick(shift) {
      if (!this.isSliding()) {
        this.slidingStart();
        this.prepareNextSheet(shift);
        await this.flip(shift)
          .finally(() => {
            this.currentIndex = this.getNextIndex(shift);
            this.slidingEnd();
          });
      }
    }

    prepareNextSheet(shift) {
      this.drawNextSheet(this.getCurrentMonth(), shift);
      this.drawTitle(this.getNextMonth());
    }

    drawNextSheet(month, shift) {
      const nextSheet = this.getNextSheet();
      nextSheet.state = this.model.getSheet(month, shift);

      this.drawSheet(nextSheet);
    }

    async flip(shift) {
      const from = this.currentIndex;
      const to = this.getNextIndex();

      if (shift === 1) {
        return this.slider.slideToLeft(from, to);
      }

      return this.slider.slideToRight(from, to);
    }

    handleButtonApplyClick = () => {
      const arrival = this.arrival;
      const departure = this.departure;

      this.hooks.buttonApplyClick(arrival, departure);
    }

    handleButtonClearClick = () => {
      this.arrival = null;
      this.departure = null;

      this.setCurrentSheet(this.model.today, 0);

      const currentSheet = this.sheets[this.currentIndex]
      const currentMonth = currentSheet.state.month
      this.drawTitle(currentMonth);
      this.drawSheet(currentSheet);

      this.hooks.buttonClearClick();
    }

    transferFocus(prevIndex, prevState) {
      const date = this.model.convertIndexToDate(prevIndex, prevState);
      const currentSheet = this.getCurrentSheet();
      const newIndex = this.model.convertDateToIndex(date, currentSheet.state);
      this.setFocusOnCell(newIndex, currentSheet);
    }

    setFocusOnCell(index, sheet) {
      sheet.tableCells[index].focus();
    }

    slidingStart() {
      this.slider.isSliding = true;
    }

    slidingEnd() {
      this.slider.isSliding = false;
    }

    isSliding() {
      return this.slider.isSliding;
    }

    isNotNullAndNotEqual(arrivalDate, departureDate, arrivalIndex, departureIndex) {
      return (
        arrivalDate !== null
        && departureDate !== null
        && arrivalIndex !== departureIndex
      );
    }

    isCorrectIndex(index) {
      return (
        index !== null
        && 0 <= index
        && index < 42
      );
    }
  }

  return Calendar;
})(document);

export { Calendar }
