'use strict';

import { BEMComponent } from 'scripts/BEMComponent';
import { Utility } from 'scripts/Utility';
import { Calendar } from 'components/calendar/calendar';

const DropdownFilterDate = ((document) => {
  const ClassName = {
    ROOT    : 'js-dropdown-filter-date',
    READOUT : 'js-dropdown-filter-date__readout',
  }

  const Modifier = {
    BAR_HIDDEN  : 'dropdown-filter-date__bar_hidden',
    ICON_SHADED : 'dropdown-filter-date__icon_shaded',
  }

  const Selector = {
    HEAD            : '.js-dropdown-filter-date__head',
    READOUT         : '.js-dropdown-filter-date__readout',
    ICON            : '.js-dropdown-filter-date__icon',
    INPUT_ARRIVAL   : '.js-dropdown-filter-date__arrival',
    INPUT_DEPARTURE : '.js-dropdown-filter-date__departure',
    BAR             : '.js-dropdown-filter-date__bar',
    CALENDAR        : '.js-dropdown-filter-date__calendar',
  }


  class DropdownFilterDate extends BEMComponent {
    constructor(element) {
      super(element, 'dropdown-filter-date');

      this._connectBasis();
      this._connectCalendar();

      this.listeners = this._defineEventListeners();
      this.attachMultipleEventListeners(this.listeners);
    }

    setDates(arrival, departure) {
      const isCorrectArrivalDate = this.calendar.setArrival(arrival);
      const isCorrectDepartureDate = this.calendar.setDeparture(departure);
      if (isCorrectArrivalDate && isCorrectDepartureDate) {
        this._setInputValues(arrival, departure);
        this._fillReadout(arrival, departure);
        const closestDate = this.calendar.getClosestDate();
        this.calendar.updateCurrentSheet(closestDate);
      }
    }

    closeBar() {
      this.icon.classList.remove(Modifier.ICON_SHADED);
      this.bar.classList.add(Modifier.BAR_HIDDEN);
    }

    openBar() {
      this.icon.classList.add(Modifier.ICON_SHADED);
      this.bar.classList.remove(Modifier.BAR_HIDDEN);
    }

    toggleBar() {
      this.icon.classList.toggle(Modifier.ICON_SHADED);
      this.bar.classList.toggle(Modifier.BAR_HIDDEN);
    }

    _connectBasis() {
      this.head = this.root.querySelector(Selector.HEAD);
      this.readout = this.root.querySelector(Selector.READOUT);
      this.icon = this.root.querySelector(Selector.ICON);
      this.inputArrival = this.root.querySelector(Selector.INPUT_ARRIVAL);
      this.inputDeparture = this.root.querySelector(Selector.INPUT_DEPARTURE);
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

    _setInputValues(arrival, departure) {
      this._setInputArrivalValue(arrival);
      this._setInutDepartureValue(departure);
    }

    _setInputArrivalValue(arrival) {
      const arrivalDate = new Date(arrival).toLocaleDateString('en-CA');
      this.inputArrival.value = arrivalDate;
    }

    _setInutDepartureValue(departure) {
      const departureDate = new Date(departure).toLocaleDateString('en-CA');
      this.inputDeparture.value = departureDate;
    }

    _getDateRange(arrival, departure) {
      if (arrival !== null && departure !== null) {
        return this.calendar.model.convertDatesToDDMDDM(arrival, departure).toLowerCase();
      }

      return null;
    }

    _fillReadout(arrival, departure) {
      this.readout.value = this._getDateRange(arrival, departure);
    }

    _clearReadout() {
      this.readout.value = null;
    }

    handleReadoutClick = (event) => {
      const et = event.target;
      const isThisReadout = et.classList.contains(ClassName.READOUT);
      if (isThisReadout) {
        this.toggleBar();
      }
    }

    handleButtonClearClick = () => {
      this._clearReadout();
    }

    handleButtonApplyClick = (arrival, departure) => {
      this._setInputValues(arrival, departure);
      this._fillReadout(arrival, departure);
      this.closeBar();
    }

    _defineEventListeners() {
      return [
        {
          element: this.readout,
          handlers: { 'click': this.handleReadoutClick, 'keydown': Utility.makeKeydownHandler(this.handleReadoutClick) }
        },

        {
          element: this.icon,
          handlers: { 'click': this.handleIconClick }
        }
      ];
    }
  }

  const initDropdownFilterDateComps = BEMComponent.makeAutoInitializer(DropdownFilterDate, ClassName.ROOT);

  document.addEventListener('DOMContentLoaded', initDropdownFilterDateComps);

  return DropdownFilterDate;
})(document);

export { DropdownFilterDate }
