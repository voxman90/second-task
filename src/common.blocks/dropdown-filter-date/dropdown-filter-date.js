import { BEMComponent } from '../../scripts/BEMComponent';
import { Calendar } from '../calendar/calendar';

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

      this.attachMultipleEventListeners([
        {
          element: this.icon,
          event: 'click',
          handler: this.handleIconClick.bind(this),
        },
      ]);
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

      this.calendar.hooks.buttonClearClick = this.handleButtonClearClick.bind(this);
      this.calendar.hooks.buttonApplyClick = this.handleButtonApplyClick.bind(this);
    }

    setTimeInterval(arrival, departure) {
      this.inputArrival.value = arrival;
      this.inputDeparture.value = departure;

      this.drawPseudoInput(arrival, departure);

      this.calendar.model.arrival = arrival;
      this.calendar.model.departure = departure;
      this.calendar.model.setCurrent(this.calendar.getClosestDate());
      this.calendar.drawCalendar();
    }

    drawPseudoInput(arrival, departure) {
      let dates = '';

      if (
        arrival !== null
        && departure !== null
      ) {
        dates = this.calendar.model.convertDatesToDDMDDM(arrival, departure).toLowerCase();
      }

      this.pseudoInput.textContent = dates;
    }

    closeBar() {
      this.bar.classList.add(Modifier.BAR_HIDDEN);
    }

    openBar() {
      this.bar.classList.remove(Modifier.BAR_HIDDEN);
    }

    handleIconClick() {
      if (this.bar.classList.contains(Modifier.BAR_HIDDEN)) {
        this.openBar();
      } else {
        this.closeBar();
      }
    }

    handleButtonClearClick() {
      this.pseudoInput.textContent = '';
    }

    handleButtonApplyClick (arrival, departure) {
      this.inputArrival.value = arrival;
      this.inputDeparture.value = departure;

      this.drawPseudoInput(arrival, departure);

      this.bar.classList.add(Modifier.BAR_HIDDEN);
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
