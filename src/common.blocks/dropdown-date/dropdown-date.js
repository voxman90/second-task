'use strict';

import $ from 'jquery';
import 'jquery.inputmask';

import { BEMComponent } from 'scripts/BEMComponent';
import { Utility } from 'scripts/Utility';
import { Calendar } from 'common.blocks/calendar/calendar';

const DropdownDate = (($, document) => {
  const ClassName = {
    ROOT : 'js-dropdown-date',
  }

  const Modifier = {
    BAR_HIDDEN : 'dropdown-date__bar_hidden',
  }

  const Selector = {
    INPUT_ARRIVAL   : '.js-dropdown-date__input-arrival',
    INPUT_DEPARTURE : '.js-dropdown-date__input-departure',
    ICON            : '.js-dropdown-date__icon',
    BAR             : '.js-dropdown-date__bar',
    CALENDAR        : '.js-dropdown-date__calendar',
  }

  class DropdownDate extends BEMComponent {
    constructor(element) {
      super(element, 'dropdown-date');

      this.connectBasis();
      this.connectCalendar();

      this.attachInputMask();

      this.listeners = this.defineEventListeners();
      this.attachMultipleEventListeners(this.listeners);
    }

    defineEventListeners() {
      return [
        {
          element: this.icons,
          handlers: {
            'click': this.handleIconClick.bind(this),
            'keydown': Utility.makeKeydownHandler(this.handleIconClick.bind(this)),
          }
        },
      ];
    }

    connectBasis() {
      this.inputArrival = this.root.querySelector(Selector.INPUT_ARRIVAL);
      this.inputDeparture = this.root.querySelector(Selector.INPUT_DEPARTURE);
      this.icons = this.root.querySelectorAll(Selector.ICON);
      this.bar = this.root.querySelector(Selector.BAR);
    }

    connectCalendar() {
      const calendar = this.root.querySelector(Selector.CALENDAR);
      this.calendar = new Calendar(calendar);

      this.calendar.hooks.buttonClearClick = this.handleButtonClearClick.bind(this);
      this.calendar.hooks.buttonApplyClick = this.handleButtonApplyClick.bind(this);
    }

    setArrival(date) {
      this.inputArrival.value = date;

      return this;
    }

    setDeparture(date) {
      this.inputDeparture.value = date;

      return this;
    }

    attachInputMask() {
      $(this.inputArrival).inputmask({
        oncomplete: this.handleInputArrivalComplete.bind(this),
      });

      $(this.inputDeparture).inputmask({
        oncomplete: this.handleInputDepartureComplete.bind(this),
      });
    }

    closeBar() {
      this.bar.classList.add(Modifier.BAR_HIDDEN);

      return this;
    }

    openBar() {
      this.bar.classList.remove(Modifier.BAR_HIDDEN);

      return this;
    }

    redrawCalendar() {
      const arrivalDate = this.convertInputValueToDate(this.inputArrival.value);
      this.calendar.model.setArrival(arrivalDate);

      const departureDate = this.convertInputValueToDate(this.inputDeparture.value);
      this.calendar.model.setDeparture(departureDate);

      this.calendar.model.setCurrent(this.calendar.getClosestDate());

      this.calendar.drawCalendar();

      return this;
    }

    convertInputValueToDate(inputValue) {
      if (inputValue === '') {
        return null;
      }

      const DMY = inputValue.split('.').map(
        (str) => parseInt(str, 10)
      );

      const date = new Date();
      date.setDate(DMY[0]);
      date.setMonth(DMY[1] - 1);
      date.setFullYear(DMY[2]);

      return date;
    }

    handleIconClick() {
      this.inputArrival.toggleAttribute('readonly');
      this.inputDeparture.toggleAttribute('readonly');

      if (this.bar.classList.contains(Modifier.BAR_HIDDEN)) {
        this.redrawCalendar().openBar();
      } else {
        this.closeBar();
      }
    }

    handleInputArrivalComplete(event) {
      const arrival = event.currentTarget.value;
      if (!this.isCorrectArrivalDate(arrival)) {
        event.currentTarget.value = '';
      }
    }

    handleInputDepartureComplete(event) {
      const departure = event.currentTarget.value;
      if (!this.isCorrectDepartureDate(departure)) {
        event.currentTarget.value = '';
      }
    }

    handleButtonClearClick() {
      this.inputArrival.value = '';
      this.inputDeparture.value = '';
    }

    handleButtonApplyClick(arrival, departure) {
      this.inputArrival.value = arrival || '';
      this.inputDeparture.value = departure || '';

      this.inputArrival.toggleAttribute('readonly');
      this.inputDeparture.toggleAttribute('readonly');

      this.bar.classList.add(Modifier.BAR_HIDDEN);
    }

    isCorrectArrivalDate(arrivalDate) {
      const arrival = this.convertInputValueToDate(arrivalDate);
      const departure = this.convertInputValueToDate(this.inputDeparture.value);
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
      const arrival = this.convertInputValueToDate(this.inputArrival.value);
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
})($, document);

export { DropdownDate };
