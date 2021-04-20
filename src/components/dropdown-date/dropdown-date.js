'use strict';

import $ from 'jquery';
import 'jquery.inputmask';

import { BEMComponent } from 'scripts/BEMComponent';
import { Utility } from 'scripts/Utility';
import { Calendar } from 'components/calendar/calendar';

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
          handlers: { 'click': this.handleIconClick, 'keydown': Utility.makeKeydownHandler(this.handleIconClick) }
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

      this.calendar.hooks = {
        buttonClearClick: this.handleButtonClearClick,
        buttonApplyClick: this.handleButtonApplyClick,
      }
    }

    attachInputMask() {
      $(this.inputArrival).inputmask({
        oncomplete: this.handleInputArrivalComplete,
      });

      $(this.inputDeparture).inputmask({
        oncomplete: this.handleInputDepartureComplete,
      });
    }

    setArrival(date) {
      this.setInputValue(this.inputArrival, date);
      return this;
    }

    setDeparture(date) {
      this.setInputValue(this.inputDeparture, date);
      return this;
    }

    setInputValue(input, date) {
      input.value = date;
      const event = new Event('complete');
      input.dispatchEvent(event);
    }

    clearInputs() {
      this.inputArrival.value = '';
      this.inputDeparture.value = '';
      return this;
    }

    closeBar() {
      this.bar.classList.add(Modifier.BAR_HIDDEN);
      return this;
    }

    openBar() {
      this.bar.classList.remove(Modifier.BAR_HIDDEN);
      return this;
    }

    toggleInputsReadonly() {
      this.inputArrival.toggleAttribute('readonly');
      this.inputDeparture.toggleAttribute('readonly');
      return this;
    }

    drawCalendar() {
      const closestDate = this.calendar.getClosestDate();
      this.calendar.updateCurrentSheet(closestDate);
      return this;
    }

    drawInputs(arrival, departure) {
      this.inputArrival.value = (arrival !== null) ? arrival : '';
      this.inputDeparture.value = (departure !== null) ? departure : '';
      return this;
    }

    convertInputValueToDate(inputValue) {
      if (inputValue === '') { return null };

      const DMY = inputValue.split('.').map((str) => parseInt(str, 10));

      const date = new Date();
      date.setDate(DMY[0]);
      date.setMonth(DMY[1] - 1);
      date.setFullYear(DMY[2]);

      return date;
    }

    handleIconClick = () => {
      this.toggleInputsReadonly();

      if (this.bar.classList.contains(Modifier.BAR_HIDDEN)) {
        this.drawCalendar().openBar();
      } else {
        this.closeBar();
      }
    }

    // TODO: reduce to a single function with a setter-argument
    handleInputArrivalComplete = (event) => {
      const ct = event.currentTarget;
      const date = this.convertInputValueToDate(ct.value);
      if (!this.calendar.setArrival(date)) {
        ct.value = '';
      }
    }

    handleInputDepartureComplete = (event) => {
      const ct = event.currentTarget;
      const date = this.convertInputValueToDate(ct.value);
      if (!this.calendar.setDeparture(date)) {
        ct.value = '';
      }
    }

    handleButtonClearClick = () => {
      this.clearInputs();
    }

    handleButtonApplyClick = (arrival, departure) => {
      this.drawInputs(arrival, departure)
        .toggleInputsReadonly()
        .closeBar();
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
