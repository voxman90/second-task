import $ from 'jquery';
import 'jquery.inputmask';

import { BEMComponent } from '../../scripts/scripts';
import { Calendar } from '../../common.blocks/calendar/calendar';

class DropdownDate extends BEMComponent {
  constructor(elem) {
    super('dropdown-date');

    this.connectBasis(elem);
    this.connectCalendar(elem);

    this.attachInputRestrictions();
    this.attachListeners();
  }

  setArrival(date) {
    this.inputArrivalNode.value = date;
  }

  setDeparture(date) {
    this.inputDepartureNode.value = date;
  }

  connectBasis(elem) {
    this.rootNode = elem;

    const arrivalNode = this.rootNode.firstElementChild.firstElementChild;
    this.inputArrivalNode = arrivalNode.firstElementChild.lastElementChild;
    this.arrivalIconNode = arrivalNode.lastElementChild;

    const departureNode = this.rootNode.firstElementChild.lastElementChild;
    this.inputDepartureNode = departureNode.firstElementChild.lastElementChild;
    this.departureIconNode = departureNode.lastElementChild;
  }

  connectCalendar(elem) {
    const calendar = elem.querySelector('.js-dropdown-date__calendar');
    this.bodyNode = calendar.parentElement;
    this.calendar = new Calendar(calendar);

    this.calendar.hooks['buttonClearClick'] = this.handleButtonClearClick;
    this.calendar.hooks['buttonApplyClick'] = this.handleButtonApplyClick;
  }

  attachInputRestrictions() {
    $(this.inputArrivalNode).inputmask({
      oncomplete : (e) => {
        const arrival = e.currentTarget.value;
        if (!this.isCorrectArrivalDate(arrival)) {
          e.currentTarget.value = '';
        }
      },
    });

    $(this.inputDepartureNode).inputmask({
      oncomplete : (e) => {
        const departure = e.currentTarget.value;
        if (!this.isCorrectDepartureDate(departure)) {
          e.currentTarget.value = '';
        }
      },
    });
  }

  attachListeners() {
    this.bindEventListeners([
      {
        elem: this.arrivalIconNode,
        event: "click",
        callback: this.handleIconClick,
        data: { that: this },
      },

      {
        elem: this.departureIconNode,
        event: "click",
        callback: this.handleIconClick,
        data: { that: this },
      },
    ]);
  }

  handleButtonClearClick = () => {
    this.inputArrivalNode.value = '';
    this.inputDepartureNode.value = '';
  }

  handleButtonApplyClick = (arrival, departure) => {
    this.inputArrivalNode.value = arrival || '';
    this.inputDepartureNode.value = departure || '';
    this.inputArrivalNode.toggleAttribute('readonly');
    this.inputDepartureNode.toggleAttribute('readonly');
    this.bodyNode.classList.add('dropdown-date__body_hidden');
  }

  handleIconClick(e) {
    const that = e.that;
    that.inputArrivalNode.toggleAttribute('readonly');
    that.inputDepartureNode.toggleAttribute('readonly');
    if (that.bodyNode.classList.contains('dropdown-date__body_hidden')) {
      that.openCalendar();
    } else {
      that.hideCalendar();
    }
  }

  hideCalendar() {
    this.bodyNode.classList.add('dropdown-date__body_hidden');
  }

  openCalendar() {
    this.bodyNode.classList.remove('dropdown-date__body_hidden');

    const arrivalDate = this.convertInputValueToDate(this.inputArrivalNode.value);
    this.calendar.model.setArrival(arrivalDate);

    const departureDate = this.convertInputValueToDate(this.inputDepartureNode.value);
    this.calendar.model.setDeparture(departureDate);

    this.calendar.model.current = this.calendar.getClosestDate();

    this.calendar.drawCalendar();
  }

  convertInputValueToDate(value) {
    if (value === '') {
      return null;
    }

    const dmy = value.split('.').map(
      (str) => parseInt(str, 10)
    );
    const date = new Date();
    date.setDate(dmy[0]);
    date.setMonth(dmy[1] - 1);
    date.setFullYear(dmy[2]);
    return date;
  }

  isCorrectArrivalDate(arrivalDate) {
    const arrival = this.convertInputValueToDate(arrivalDate);
    const departure = this.convertInputValueToDate(this.inputDepartureNode.value);
    const today = new Date();
    if (
      this.calendar.model.isAfter(arrival, today)
      && this.calendar.model.isAfter(departure, arrival)
    ) {
      return true;
    }

    return false;
  }

  isCorrectDepartureDate(departureDate) {
    const arrival = this.convertInputValueToDate(this.inputArrivalNode.value);
    const departure = this.convertInputValueToDate(departureDate);
    const today = new Date();
    if (
      this.calendar.model.isAfter(departure, today)
      && this.calendar.model.isAfter(departure, arrival)
    ) {
      return true;
    }

    return false;
  }
}

const initDropdownDateComps = BEMComponent.makeInitializer(
  DropdownDate,
  '.js-dropdown-date.js-auto-init'
);

document.addEventListener('DOMContentLoaded', initDropdownDateComps);

export { DropdownDate };
