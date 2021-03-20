import { BEMComponent } from '../../scripts/scripts';
import { Calendar } from '../../common.blocks/calendar/calendar';

class DropdownFilterDate extends BEMComponent {
  constructor(elem) {
    super('dropdown-filter-date');

    this.connectBasis(elem);
    this.connectCalendar(elem);

    this.attachListeners();
  }

  connectBasis(elem) {
    this.rootNode = elem;
    this.pseudoInputNode = this.rootNode.querySelector('.js-dropdown-filter-date__pseudo-input');
    this.iconNode = this.rootNode.firstElementChild.firstElementChild.nextElementSibling;
    this.inputArrivalNode = this.iconNode.nextElementSibling;
    this.inputDepartureNode = this.inputArrivalNode.nextElementSibling;
  }

  connectCalendar(elem) {
    const calendar = elem.querySelector('.js-dropdown-filter-date__calendar');
    this.bodyNode = calendar.parentElement;
    this.calendar = new Calendar(calendar);

    this.calendar.hooks['buttonClearClick'] = this.handleButtonClearClick;
    this.calendar.hooks['buttonApplyClick'] = this.handleButtonApplyClick;
  }

  attachListeners() {
    this.bindEventListeners([
      {
        elem: this.iconNode,
        event: "click",
        callback: this.handleIconClick,
        data: { that: this },
      },
    ]);
  }

  handleButtonClearClick = () => {
    this.pseudoInputNode.textContent = '';
  }

  handleButtonApplyClick = (arrival, departure) => {
    this.inputArrivalNode.value = arrival;
    this.inputDepartureNode.value = departure;

    let dates = '';
    if (
      arrival !== null
      && departure !== null
    ) {
      dates = this.calendar.model.convertDatesToDDMDDM(arrival, departure).toLowerCase();
    }

    this.pseudoInputNode.textContent = dates;
    this.bodyNode.classList.add('dropdown-filter-date__body_hidden');
  }

  handleIconClick(e) {
    const that = e.that;
    if (that.bodyNode.classList.contains('dropdown-filter-date__body_hidden')) {
      that.openCalendar();
    } else {
      that.hideCalendar();
    }
  }

  hideCalendar() {
    this.bodyNode.classList.add('dropdown-filter-date__body_hidden');
  }

  openCalendar() {
    this.bodyNode.classList.remove('dropdown-filter-date__body_hidden');
  }
}

const initDropdownFilterDateComps = BEMComponent.makeInitializer(DropdownFilterDate, '.js-dropdown-filter-date');

document.addEventListener('DOMContentLoaded', initDropdownFilterDateComps);
