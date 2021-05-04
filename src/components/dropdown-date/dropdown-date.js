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

      this._connectBasis();
      this._connectCalendar();
      this._attachInputMask();

      this.listeners = this._defineEventListeners();
      this.attachMultipleEventListeners(this.listeners);
    }

    setArrival(date) {
      this._setInputValue(this.inputArrival, date);
    }

    setDeparture(date) {
      this._setInputValue(this.inputDeparture, date);
    }

    closeBar() {
      this.bar.classList.add(Modifier.BAR_HIDDEN);
    }

    openBar() {
      this.bar.classList.remove(Modifier.BAR_HIDDEN);
    }

    _connectBasis() {
      this.inputArrival = this.root.querySelector(Selector.INPUT_ARRIVAL);
      this.inputDeparture = this.root.querySelector(Selector.INPUT_DEPARTURE);
      this.icons = this.root.querySelectorAll(Selector.ICON);
      this.bar = this.root.querySelector(Selector.BAR);
    }

    _connectCalendar() {
      const calendar = this.root.querySelector(Selector.CALENDAR);
      this.calendar = new Calendar(calendar);

      this.calendar.hooks = {
        buttonClearClick: this.handleButtonClearClick,
        buttonApplyClick: this.handleButtonApplyClick,
      }
    }

    _attachInputMask() {
      $(this.inputArrival).inputmask({
        oncomplete: this.handleInputArrivalComplete,
      });

      $(this.inputDeparture).inputmask({
        oncomplete: this.handleInputDepartureComplete,
      });
    }

    _setInputValue(input, date) {
      input.value = date // this._formatDateForInput(date);
      const event = new Event('complete');
      input.dispatchEvent(event);
    }

    _clearInputs() {
      this.inputArrival.value = '';
      this.inputDeparture.value = '';
    }

    _formatDateForInput(date) {
      return this.calendar.model.convertDateToDDMMYYYY(date);
    }

    _toggleInputsReadonly() {
      this.inputArrival.toggleAttribute('readonly');
      this.inputDeparture.toggleAttribute('readonly');
    }

    _updateCalendar() {
      const closestDate = this.calendar.getClosestDate();
      this.calendar.updateCurrentSheet(closestDate);
    }

    _drawInputs(arrival, departure) {
      this.inputArrival.value = (arrival === null) ? '' : arrival;
      this.inputDeparture.value = (departure === null) ? '' : departure;
    }

    _convertInputValueToDate(inputValue) {
      if (inputValue === '') return null;

      const dmy = inputValue.split('.').map((str) => parseInt(str));

      const date = new Date();
      date.setDate(dmy[0]);
      date.setMonth(dmy[1] - 1);
      date.setFullYear(dmy[2]);

      return date;
    }

    handleIconClick = () => {
      this._toggleInputsReadonly();
      const isBarHidden = this.bar.classList.contains(Modifier.BAR_HIDDEN)
      if (isBarHidden) {
        this._updateCalendar();
        this.openBar();
      } else {
        this.closeBar();
      }
    }

    handleInputArrivalComplete = (event) => {
      const ct = event.currentTarget;
      const date = this._convertInputValueToDate(ct.value);
      const isCorrectArrivalDate = this.calendar.setArrival(date)
      if (!isCorrectArrivalDate) {
        ct.value = '';
      }
    }

    handleInputDepartureComplete = (event) => {
      const ct = event.currentTarget;
      const date = this._convertInputValueToDate(ct.value);
      const isCorrectDepartureDate = this.calendar.setDeparture(date);
      if (!isCorrectDepartureDate) {
        ct.value = '';
      }
    }

    handleButtonClearClick = () => {
      this._clearInputs();
    }

    handleButtonApplyClick = (arrival, departure) => {
      this._drawInputs(arrival, departure);
      this._toggleInputsReadonly();
      this.closeBar();
    }

    _defineEventListeners() {
      return [
        {
          element: this.icons,
          handlers: { 'click': this.handleIconClick, 'keydown': Utility.makeKeydownHandler(this.handleIconClick) }
        },
      ];
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
