import $ from 'jquery';
import 'jquery.inputmask';

import { BEMComponent } from '../../scripts/BEMComponent';
import { Calendar } from '../../common.blocks/calendar/calendar';

const DropdownDate = ((document) => {
  const ClassName = {
    ROOT            : 'js-dropdown-date',
  }

  const Selector = {
    INPUT_ARRIVAL   : '.js-dropdown-date__input-arrival',
    ICON_ARRIVAL    : '.js-dropdown-date__icon-arrival',
    INPUT_DEPARTURE : '.js-dropdown-date__input-departure',
    ICON_DEPARTURE  : '.js-dropdown-date__icon-departure',
    BAR             : '.js-dropdown-date__bar',
    CALENDAR        : '.js-dropdown-date__calendar',
  }

  class DropdownDate extends BEMComponent {
    constructor(element) {
      super(element, 'dropdown-date');

      this.connectBasis();
      this.connectCalendar();

      this.attachInputRestrictions();
      this.attachListeners();
    }

    connectBasis() {
      this.inputArrival = this.root.querySelector(Selector.INPUT_ARRIVAL);
      this.iconArrival = this.root.querySelector(Selector.ICON_ARRIVAL);
      this.inputDeparture = this.root.querySelector(Selector.INPUT_DEPARTURE);
      this.iconDeparture = this.root.querySelector(Selector.ICON_DEPARTURE);
      this.bar = this.root.querySelector(Selector.BAR);
    }

    connectCalendar() {
      const calendar = this.root.querySelector(Selector.CALENDAR);
      this.calendar = new Calendar(calendar);

      this.calendar.hooks.buttonClearClick = this.handleButtonClearClick;
      this.calendar.hooks.buttonApplyClick = this.handleButtonApplyClick;
    }

    setArrival(date) {
      this.inputArrivalNode.value = date;
    }

    setDeparture(date) {
      this.inputDepartureNode.value = date;
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

  const initDropdownDateComps = BEMComponent.makeAutoInitializer(
    DropdownDate,
    ClassName.ROOT,
  );

  document.addEventListener('DOMContentLoaded', initDropdownDateComps);

  return DropdownDate;
})(document);

export { DropdownDate };
