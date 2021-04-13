'use strict';

import { BEMComponent } from '../../scripts/BEMComponent';

const Calendar = ((document) => {
  class CalendarModel {
    constructor() {
      this.cache = [];
      this.setDefault();
    }

    monthNames = {
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

    setDefault() {
      this.today = new Date();
      this.arrival = null;
      this.departure = null;
      this.setCurrent(this.today);
    }

    setCurrent(date) {
      this.current = this.changeMonth(date, 0);
      this.currentCalendarSheet = this.getCalendarSheet(this.current);
    }

    moveToNextMonth() {
      this.current = this.changeMonth(this.current, 1);
      this.currentCalendarSheet = this.getCalendarSheet(this.current);
    }

    moveToPrevMonth() {
      this.current = this.changeMonth(this.current, -1);
      this.currentCalendarSheet = this.getCalendarSheet(this.current);
    }

    setDate(index) {
      const date = this.convertIndexToDate(index);
      const arrival = this.arrival;
      const departure = this.departure;

      if (arrival && departure) {
        return this.setDeparture(date);
      }

      if (!arrival) {
        return this.setArrival(date);
      }

      if (!departure) {
        return this.setDeparture(date);
      }

      return false;
    }

    setDeparture(date) {
      if (this.isAfter(date, this.arrival)) {
        this.departure = date;
        return true;
      }

      return false;
    }

    setArrival(date) {
      if (
        this.isAfter(date, this.today)
        && this.isAfter(this.departure, date)
      ) {
        this.arrival = date;
        return true;
      }

      return false;
    }

    isAfter(date, bottom) {
      if (
        bottom === null
        || date === null
      ) {
        return true;
      }

      const bottomTime = bottom.getTime();
      const dateTime = date.getTime();
      const diff = dateTime - bottomTime;
      if (diff > 0) {
        return true;
      }

      if (this.isSameYearAndMonth(date, bottom)) {
        return (
          date.getDate() === bottom.getDate()
        );
      }

      return false;
    }

    convertIndexToDate(index) {
      const day = this.currentCalendarSheet.sheet[index];
      const date = this.changeMonth(this.current, 0);
      date.setDate(day);
      return date;
    }

    changeMonth(dateParam, months) {
      const date = new Date(dateParam);
      date.setMonth(dateParam.getMonth() + months, 1);
      return date;
    }

    countDays(dateParam) {
      const date = new Date(dateParam);
      date.setDate(31);
      let days = 28;
      switch (date.getDate()) {
        case 31: {
          days = 31;
          break;
        }
        case 1: {
          days = 30;
          break;
        }
        case 2: {
          days = 29;
          break;
        }
        default: {
          break;
        }
      }

      return days;
    }

    countFirstDayOfMonth(dateParam) {
      const date = this.changeMonth(dateParam, 0);
      const firstDayOfMonth = date.getDay();
      return (firstDayOfMonth + 6) % 7;
    }

    convertToMonths(date) {
      return date.getYear() * 12 + date.getMonth() + 1;
    }

    countCalendarRow(date) {
      const firstDayOfMonth = this.countFirstDayOfMonth(date);
      const day = date.getDate();
      return Math.floor((firstDayOfMonth + day - 0.1) / 7);
    }
    
    countCalendarRows(date) {
      const days = this.countDays(date);
      const firstDayOfMonth = this.countFirstDayOfMonth(date);
      return (firstDayOfMonth + days > 35) ? 6 : 5;
    }

    getCalendarSheet(date) {
      let calendarSheet = this.getCalendarSheetFromCache(date);
      if (calendarSheet === null) {
        calendarSheet = this.createCalendarSheet(date);
        this.cacheCalendarSheet(date, calendarSheet);
      }

      return calendarSheet;
    }

    getCalendarSheetFromCache(date) {
      const record = this.cache.find(
        (record) => this.isSameYearAndMonth(record.date, date)
      );
      return (record) ? record.calendarSheet : null;
    }
    
    cacheCalendarSheet(date, calendarSheet) {
      const cache = this.cache;
      const length = cache.length;
      if (length === 12) {
        cache.shift();
      }

      cache.push({
        date,
        calendarSheet,
      });
    }

    createCalendarSheet(date) {
      const currMonth = this.changeMonth(date, 0);
      const prevMonth = this.changeMonth(date, -1);

      const currDays = this.countDays(currMonth);
      const prevDays = this.countDays(prevMonth);

      const rows = this.countCalendarRows(currMonth);
      const end = rows * 7;

      const from = this.countFirstDayOfMonth(currMonth);
      const to = from + currDays;
      
      const sheet = [];

      for (let i = 0; i < from; i++) {
        sheet.push(prevDays - from + i + 1);
      }

      for (let i = from; i < to; i++) {
        sheet.push(i - from + 1);
      }

      let j = 1;
      for (let i = to; i < end; i++) {
        sheet.push(j);
        j += 1;
      } 

      return { sheet, from, to };
    }

    findCellIndex(date) {
      if (!date) {
        return null;
      }

      const { sheet, from, to } = this.currentCalendarSheet;
      const curr = this.changeMonth(this.current, 0);
      if (this.isSameYearAndMonth(date, curr)) {
        return date.getDate() + from - 1;
      } 

      const next = this.changeMonth(curr, 1);
      if (this.isSameYearAndMonth(date, next)) {
        const index = date.getDate() + from + to - 1;
        if (sheet[index]) {
          return index;
        }

        return 100;
      }

      const prev = this.changeMonth(curr, -1);
      if (this.isSameYearAndMonth(date, prev)) {
        const index = date.getDate() - sheet[0];      
        if (index >= 0) {
          return index;
        }

        return -100;
      }

      return null;
    }
    
    converDateToMYYYY(date) {
      const month = this.monthNames[date.getMonth()];
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
      const arrivalMonth = this.monthNames[arrival.getMonth()]
        .substring(0, 3)
        .toLowerCase();

      const departureDay = departure.getDate();
      const departureMonth = this.monthNames[departure.getMonth()]
        .substring(0, 3)
        .toLowerCase();

      return `${arrivalDay} ${arrivalMonth} - ${departureDay} ${departureMonth}`;
    }

    isSameYearAndMonth(dateFirst, dateSecond) {
      return (
        dateFirst.getMonth() === dateSecond.getMonth()
        && dateFirst.getYear() === dateSecond.getYear()
      );
    }
  }

  const ClassName = {
    ROOT : 'js-calendar',
  }

  const Modifier = {
    TABLE_ROW_HIDDEN        : 'calendar__table-row_hidden',
    TABLE_CELL_DEPARTURE    : 'calendar__table-cell_departure',
    TABLE_CELL_ARRIVAL      : 'calendar__table-cell_arrival',
    TABLE_CELL_FILLED       : 'calendar__table-cell_filled',
    TABLE_CELL_TODAY        : 'calendar__table-cell_today',
    TABLE_CELL_RECENT_MONTH : 'calendar__table-cell_recent',
  }

  const Selector = {
    TITLE           : '.js-calendar__title',
    BUTTON_BACKWARD : '.js-calendar__button-backward',
    BUTTON_FORWARD  : '.js-calendar__button-forward',
    TABLE_BODY      : '.js-calendar__table-body',
    TABLE_6TH_ROW   : '.js-calendar__table-6th-row',
    TABLE_CELL      : '.js-calendar__table-cell',
    BUTTON_CLEAR    : '.js-calendar__button-clear',
    BUTTON_APPLY    : '.js-calendar__button-apply',
  }

  class Calendar extends BEMComponent {
    constructor(element) {
      super(element, 'calendar');

      this.model = new CalendarModel();

      this.connectBasis();
      this.connectButtons();

      this.drawCalendar();

      this.attachMultipleEventListeners([
        { 
          element: this.buttonBackward,
          event: 'click',
          handler: this.handleButtonBackwardClick.bind(this),
        },

        {
          element: this.buttonForward,
          event: 'click',
          handler: this.handleButtonForwardClick.bind(this),
        },

        { 
          element: this.buttonClear,
          event: 'click',
          handler: this.handleButtonClearClick.bind(this),
        },

        { 
          element: this.buttonApply,
          event: 'click',
          handler: this.handleButtonApplyClick.bind(this),
        },

        { 
          element: this.tableBody,
          event: 'click',
          handler: this.handleTableBodyClick.bind(this),
        },
      ]);
    }

    connectBasis() {
      this.title = this.root.querySelector(Selector.TITLE);
      this.tableBody = this.root.querySelector(Selector.TABLE_BODY);
      this.tableCells = this.root.querySelectorAll(Selector.TABLE_CELL);
      this.table6thRow = this.root.querySelector(Selector.TABLE_6TH_ROW);
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

    drawCalendar() {
      const date = this.model.current;

      this.clearCalendarSheet();

      this.drawCalendarTitle(date)
        .drawCalendarSheet(date)
        .drawToday()
        .drawTrace();
    }

    getClosestDate() {
      if (this.model.arrival !== null) {
        return this.model.arrival;
      }

      if (this.model.departure !== null) {
        return this.model.departure;
      }

      return this.model.current;
    }

    getArrivalIndex() {
      const arr = this.model.arrival;
      const arrIndex = this.model.findCellIndex(arr);
      return arrIndex;
    }

    getDepartureIndex() {
      const dep = this.model.departure;
      const depIndex = this.model.findCellIndex(dep);
      return depIndex;
    }

    clearCalendarSheet() {
      this.tableCells.forEach((cell) => {
        cell.classList.remove(
          Modifier.TABLE_CELL_ARRIVAL,
          Modifier.TABLE_CELL_DEPARTURE,
          Modifier.TABLE_CELL_FILLED,
          Modifier.TABLE_CELL_TODAY,
          Modifier.TABLE_CELL_RECENT_MONTH,
        );
      });

      return this;
    }

    clearTrace() {
      this.tableCells.forEach((cell) => {
        cell.classList.remove(
          Modifier.TABLE_CELL_ARRIVAL,
          Modifier.TABLE_CELL_DEPARTURE,
          Modifier.TABLE_CELL_FILLED,
        );
      });

      return this;
    }

    drawCalendarTitle(date) {
      this.title.textContent = this.model.converDateToMYYYY(date);

      return this;
    }

    drawToday() {
      const day = this.model.findCellIndex(this.model.today);

      if (this.isCorrectIndex(day)) {
        this.tableCells[day].classList.add(Modifier.TABLE_CELL_TODAY);
      }

      return this;
    }

    drawCalendarSheet(date) {
      const { sheet, from, to } = this.model.currentCalendarSheet;
      const weeks = this.model.countCalendarRows(date);

      if (weeks === 6) {
        this.table6thRow.classList.remove(Modifier.TABLE_ROW_HIDDEN);
      } else {
        this.table6thRow.classList.add(Modifier.TABLE_ROW_HIDDEN);
      }

      this.tableCells.forEach((cell, i) => {
        if (from <= i && i < to) {
          cell.classList.add(Modifier.TABLE_CELL_RECENT_MONTH);
        }

        cell.textContent = sheet[i];
      });

      return this;
    }

    drawArrivalDate(index) {
      if (this.isCorrectIndex(index)) {
        this.tableCells[index].classList.add(Modifier.TABLE_CELL_ARRIVAL);
      }

      return this;
    }

    drawDepartureDate(index) {
      if (this.isCorrectIndex(index)) {
        this.tableCells[index].classList.add(Modifier.TABLE_CELL_DEPARTURE);
      }

      return this;
    }

    isCorrectIndex(index) {
      return (
        index !== null
        && 0 <= index
        && index < 42
      );
    }

    drawTrace() {
      const arr = this.model.arrival;
      const dep = this.model.departure;
      const arrIndex = this.getArrivalIndex();
      const depIndex = this.getDepartureIndex();

      this.drawArrivalDate(arrIndex).drawDepartureDate(depIndex);

      if (this.isNotNullAndNotEqual(arr, dep, arrIndex, depIndex)) {
        let start = 0;
        let end = this.tableCells.length;

        if (arrIndex !== null) {
          start = arrIndex;
        }

        if (depIndex !== null) {
          end = depIndex;
        }

        this.tableCells.forEach((cell, i) => {
          if (start <= i && i <= end) {
            cell.classList.add(Modifier.TABLE_CELL_FILLED);
          }
        });
      }

      return this;
    }

    isNotNullAndNotEqual(arr, dep, arrIndex, depIndex) {
      return (
        arr !== null
        && dep !== null
        && arrIndex !== depIndex
      );
    }


    handleTableBodyClick(event) {
      const et = event.target;
      if (et.classList.contains(Modifier.TABLE_CELL_RECENT_MONTH)) {
        const index = parseInt(et.dataset.index, 10) - 1;
        if (this.model.setDate(index)) {
          this.clearTrace().drawTrace();
        }
      }
    }

    handleButtonApplyClick() {
      const arrival = this.model.arrival;
      const departure = this.model.departure;

      this.hooks.buttonApplyClick(arrival, departure);
    }

    handleButtonClearClick() {
      this.model.setDefault();
      this.drawCalendar();

      this.hooks.buttonClearClick();
    }

    handleButtonBackwardClick() {
      this.model.moveToPrevMonth();
      this.drawCalendar();
    }

    handleButtonForwardClick() {
      this.model.moveToNextMonth();
      this.drawCalendar();
    }
  }

  const initCalendarComps = BEMComponent.makeAutoInitializer(
    Calendar,
    ClassName.ROOT,
  );

  document.addEventListener('DOMContentLoaded', initCalendarComps);

  return Calendar;
})(document);

export { Calendar }
