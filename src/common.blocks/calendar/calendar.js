import { BEMComponent } from "../../scripts/scripts.ts";

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
    const from = this.countFirstDayOfMonth(currMonth);
    const to = from + currDays;
    const end = rows * 7;
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

class Calendar extends BEMComponent {
  constructor(elem) {
    super('calendar');
    this.model = new CalendarModel();
    this.hooks = {};
    this.connectBasis(elem);
    this.connectButtons();
    this.drawCalendar();
    this.attachListeners();
  }

  connectBasis(elem) {
    this.rootNode = elem;
    this.titleNode = this.rootNode.firstElementChild.lastElementChild;
    this.tableBodyNode = this.rootNode.querySelector('.js-calendar__table-body');
    this.tableCellNodes = this.rootNode.querySelectorAll('.js-calendar__table-cell');
    this.table6thRowNode = this.rootNode.querySelector('.js-calendar__table-6th-row');
  }

  connectButtons() {
    this.buttonBackwardNode = this.rootNode.firstElementChild.firstElementChild;
    this.buttonForwardNode = this.buttonBackwardNode.nextElementSibling;
    this.buttonClearNode = this.rootNode.lastElementChild.firstElementChild;
    this.buttonApplyNode = this.buttonClearNode.nextElementSibling;
  }

  drawCalendar() {
    const date = this.model.current;
    this.clearCalendarSheet();
    this.drawCalendarTitle(date);
    this.drawCalendarSheet(date);
    this.drawToday();
    this.drawTrace();
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

  clearCalendarSheet() {
    this.tableCellNodes.forEach((cell) => {
      cell.classList.remove(
        'calendar__table-cell_departure',
        'calendar__table-cell_arrival',
        'calendar__table-cell_filled',
        'calendar__table-cell_today',
        'calendar__table-cell_recent',
      );
    });
  }

  clearTrace() {
    this.tableCellNodes.forEach((cell) => {
      cell.classList.remove(
        'calendar__table-cell_departure',
        'calendar__table-cell_arrival',
        'calendar__table-cell_filled',
      );
    });
  }

  drawCalendarTitle(date) {
    this.titleNode.textContent = this.model.converDateToMYYYY(date);
  }

  drawToday() {
    const today = this.model.today;
    const current = this.model.current;
    if (this.model.isSameYearAndMonth(today, current)) {
      const day = today.getDate() - 1;
      this.tableCellNodes[day].classList.add('calendar__table-cell_today');
    }
  }

  drawCalendarSheet(date) {
    const { sheet, from, to } = this.model.currentCalendarSheet;
    const weeks = this.model.countCalendarRows(date);
    if (weeks === 6) {
      this.table6thRowNode.classList.remove('calendar__table-row_hidden');
    } else {
      this.table6thRowNode.classList.add('calendar__table-row_hidden');
    }

    this.tableCellNodes.forEach((cell, i) => {
      if (from <= i && i < to) {
        cell.classList.add('calendar__table-cell_recent');
      }

      cell.textContent = sheet[i];
    });
  }

  drawArrivalDate() {
    const arr = this.model.arrival;
    const arrIndex = this.model.findCellIndex(arr);
    if (this.isCorrectIndex(arrIndex)) {
      this.tableCellNodes[arrIndex].classList.add('calendar__table-cell_arrival');
    }

    return arrIndex;
  }

  drawDepartureDate() {
    const dep = this.model.departure;
    const depIndex = this.model.findCellIndex(dep);
    if (this.isCorrectIndex(depIndex)) {
      this.tableCellNodes[depIndex].classList.add('calendar__table-cell_departure');
    }

    return depIndex;
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
    const arrIndex = this.drawArrivalDate();
    const depIndex = this.drawDepartureDate();
    if (this.isNotNullAndNotEqual(arr, dep, arrIndex, depIndex)) {
      let start = 0;
      let end = this.tableCellNodes.length;

      if (arrIndex) {
        start = arrIndex;
      }

      if (depIndex) {
        end = depIndex;
      }

      this.tableCellNodes.forEach((cell, i) => {
        if (start <= i && i <= end) {
          cell.classList.add('calendar__table-cell_filled');
        }
      });
    }
  }

  isNotNullAndNotEqual(arr, dep, arrIndex, depIndex) {
    return (
      arr !== null
      && dep !== null
      && arrIndex !== depIndex
    );
  }

  attachListeners() {
    this.bindEventListeners([
      { 
        elem: this.buttonBackwardNode,
        event: "click",
        callback: this.handleButtonBackwardClick,
        data: { that: this },
      },

      {
        elem: this.buttonForwardNode,
        event: "click",
        callback: this.handleButtonForwardClick,
        data: { that: this },
      },

      { 
        elem: this.buttonClearNode,
        event: "click",
        callback: this.handleButtonClearClick,
        data: { that: this },
      },

      { 
        elem: this.buttonApplyNode,
        event: "click",
        callback: this.handleButtonApplyClick,
        data: { that: this },
      },

      { 
        elem: this.tableBodyNode,
        event: "click",
        callback: this.handleTableBodyClick,
        data: { that: this },
      },
    ]);
  }

  handleTableBodyClick(e) {
    const that = e.that;
    const tg = e.target;
    if (tg.classList.contains('calendar__table-cell_recent')) {
      const index = parseInt(tg.dataset.index, 10) - 1;
      if (that.model.setDate(index)) {
        that.clearTrace();
        that.drawTrace();
      }
    }
  }

  handleButtonApplyClick(e) {
    const that = e.that;
    const arrival = that.model.arrival;
    const departure = that.model.departure;
    if (that.hooks['buttonApplyClick']) {
      that.hooks['buttonApplyClick'](arrival, departure);
    }
  }

  handleButtonClearClick(e) {
    const that = e.that;
    that.model.setDefault();
    that.drawCalendar();
    if (that.hooks['buttonClearClick']) {
      that.hooks['buttonClearClick']();
    }
  }

  handleButtonBackwardClick(e) {
    const that = e.that;
    that.model.moveToPrevMonth();
    that.drawCalendar();
  }

  handleButtonForwardClick(e) {
    const that = e.that;
    that.model.moveToNextMonth();
    that.drawCalendar();
  }
}

const initCalendarComps = BEMComponent.makeInitializer(
  Calendar,
  '.js-calendar.js-auto-init'
);

document.addEventListener('DOMContentLoaded', initCalendarComps);

export { Calendar }
