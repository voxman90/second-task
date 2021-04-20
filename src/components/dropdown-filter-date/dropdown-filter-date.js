'use strict';

import { BEMComponent } from 'scripts/BEMComponent';
import { Utility } from 'scripts/Utility';
import { Calendar } from 'components/calendar/calendar';

const DropdownFilterDate = ((document) => {
  const ClassName = {
    ROOT : 'js-dropdown-filter-date',
  }

  const Modifier = {
    BAR_HIDDEN : 'dropdown-filter-date__bar_hidden',
  }

  const Selector = {
    PSEUDO_INPUT    : '.js-dropdown-filter-date__pseudo-input',
    ICON            : '.js-dropdown-filter-date__icon',
    INPUT_ARRIVAL   : '.js-dropdown-filter-date__input-arrival',
    INPUT_DEPARTURE : '.js-dropdown-filter-date__input-departure',
    BAR             : '.js-dropdown-filter-date__bar',
    CALENDAR        : '.js-dropdown-filter-date__calendar',
  }


  class DropdownFilterDate extends BEMComponent {
    constructor(element) {
      super(element, 'dropdown-filter-date');

      this.connectBasis();
      this.connectCalendar();

      this.listeners = this.defineEventListeners();
      this.attachMultipleEventListeners(this.listeners);
    }

    defineEventListeners() {
      return [
        {
          element: this.icon,
          handlers: { 'click': this.handleIconClick, 'keydown': Utility.makeKeydownHandler(this.handleIconClick) }
        },
      ];
    }

    connectBasis() {
      this.pseudoInput = this.root.querySelector(Selector.PSEUDO_INPUT);
      this.icon = this.root.querySelector(Selector.ICON);
      this.inputArrival = this.root.querySelector(Selector.INPUT_ARRIVAL);
      this.inputDeparture = this.root.querySelector(Selector.INPUT_DEPARTURE);
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

    setInputValues(arrival, departure) {
      this.inputArrival.value = arrival;
      this.inputDeparture.value = departure;
      return this;
    }

    setDates(arrival, departure) {
      this.setInputValues(arrival, departure).drawPseudoInput(arrival, departure);
      this.calendar.updateCurrentSheet(this.calendar.getClosestDate());
    }

    closeBar() {
      this.bar.classList.add(Modifier.BAR_HIDDEN);
      return this;
    }

    openBar() {
      this.bar.classList.remove(Modifier.BAR_HIDDEN);
      return this;
    }

    clearPseudoInput() {
      this.pseudoInput.textContent = '';
      return this;
    }

    drawPseudoInput(arrival, departure) {
      this.pseudoInput.textContent = this.getDateInterval(arrival, departure);
      return this;
    }

    getDateInterval(arrival, departure) {
      if (
        arrival !== null
        && departure !== null
      ) {
        return this.calendar.model.convertDatesToDDMDDM(arrival, departure).toLowerCase();
      }

      return '';
    }

    handleIconClick = () => {
      const isBarClosed = this.bar.classList.contains(Modifier.BAR_HIDDEN)
      if (isBarClosed) {
        this.openBar();
      } else {
        this.closeBar();
      }
    }

    handleButtonClearClick = () => {
      this.clearPseudoInput();
    }

    handleButtonApplyClick = (arrival, departure) => {
      this.setInputValues(arrival, departure)
        .drawPseudoInput(arrival, departure)
        .closeBar();
    }
  }

  const initDropdownFilterDateComps = BEMComponent.makeAutoInitializer(
    DropdownFilterDate,
    ClassName.ROOT,
  );

  document.addEventListener('DOMContentLoaded', initDropdownFilterDateComps);

  return DropdownFilterDate;
})(document);

export { DropdownFilterDate }
