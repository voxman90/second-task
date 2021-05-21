'use strict';

import { BEMComponent } from 'scripts/BEMComponent';
import { Utility } from 'scripts/Utility';
import { DropdownDate } from 'components/dropdown-date/dropdown-date';
import { DropdownGuests } from 'components/dropdown-guests/dropdown-guests';

const InvoiceCard = ((document) => {
  const ClassName = {
    ROOT : 'js-invoice-card',
  };

  const Name = {
    FORM : 'invoice-card',
  }

  const Selector = {
    DROPDOWN_DATE   : '.js-dropdown-date',
    DROPDOWN_GUESTS : '.js-dropdown-guests',
    HEADING_PRICE   : '.js-hotel-room-heading__price',
    HEADING_NUMBER  : '.js-hotel-room-heading__number',
    HEADING_LUX     : '.js-hotel-room-heading__lux',
    GROSS           : '.js-invoice-card__gross-product',
    GROSS_RESULT    : '.js-invoice-card__gross',
    DISCOUNT        : '.js-invoice-card__discount',
    SERVICE_PRICE   : '.js-invoice-card__service-price',
    SERVICE_TOOLTIP : '.js-invoice-card__service-tooltip',
    EXTRA_TOOLTIP   : '.js-invoice-card__extra-tooltip',
    EXTRA_PRICE     : '.js-invoice-card__extra-price',
    FINAL_PRICE     : '.js-invoice-card__final-price',
  };

  const Modifier = {
    LUX_HIDDEN : 'hotel-room-heading__lux_hidden',
  }

  const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

  const Extra = {
    dinner          : 'Завтрак',
    crib            : 'Кроватка',
    tv              : 'Телевизор',
    shampoo         : 'Шампунь',
    'eatra-tv'      : 'Телевизор',
    'extra-shampoo' : 'Шампунь',
    'writing-desk'  : 'Письменный стол',
    'feeding-chair' : 'Стул для кормления',
  }

  const Default = {
    number: 888,
    isLux: true,
    pricePerDay: 9990,
    arrival: new Date(2021, 8, 21),
    departure: new Date(2021, 8, 26),
    guests: [2, 1],
    service: '???',
    extra: [
      'writing-desk',
      'feeding-chair',
      'crib',
    ]
  };

  class InvoiceCard extends BEMComponent {
    constructor(element, options = Default) {
      super(element, 'invoice-card');

      this.nodes = {};
      this.components = {};

      this._connectBasis();
      this._initComponents();

      this.pricePerDay = options.pricePerDay;
      this.extraPrice = this._getExtraPrice(options.extra);
      this.servicePrice = this._getServicePrice();

      this._drawHeading(options);
      this._drawServiceAndExtra(options);
      this.setState(options);
      this.updateAccount();
    }

    setState(options) {
      const { arrival, departure, guests } = options;
      this._setGuestCount(guests);
      this._setArrivalAndDeparture(arrival, departure);
    }

    updateAccount() {
      const days = this._gatNumberOfDays();
      const gross = this._getGross(this.pricePerDay, days);
      const discount = this._getDiscount();
      const finalPrice = this._getFinalPrice(gross, this.servicePrice, this.extraPrice, discount);
      
      this._drawGrossProduct(this.pricePerDay, days);
      this._drawGrossResult(gross);
      this._drawDiscount(discount);
      this._drawFinalPrice(finalPrice);
    }

    _connectBasis() {
      this.nodes.dropdownDate = this.root.querySelector(Selector.DROPDOWN_DATE);
      this.nodes.dropdownGuests = this.root.querySelector(Selector.DROPDOWN_GUESTS);

      this.nodes.form = document.forms[Name.FORM];
      this._connectFormFields();
    }

    _connectFormFields() {
      this.nodes.number = this.root.querySelector(Selector.HEADING_NUMBER);
      this.nodes.lux = this.root.querySelector(Selector.HEADING_LUX);
      this.nodes.price = this.root.querySelector(Selector.HEADING_PRICE);

      this.nodes.grossProduct = this.root.querySelector(Selector.GROSS);
      this.nodes.grossResult = this.root.querySelector(Selector.GROSS_RESULT);

      this.nodes.discount = this.root.querySelector(Selector.DISCOUNT);
      this.nodes.serviceTooltip = this.root.querySelector(Selector.SERVICE_TOOLTIP);
      this.nodes.servicePrice = this.root.querySelector(Selector.SERVICE_PRICE);

      this.nodes.extraPrice = this.root.querySelector(Selector.EXTRA_PRICE);
      this.nodes.extraTooltip = this.root.querySelector(Selector.EXTRA_TOOLTIP);

      this.nodes.finalPrice = this.root.querySelector(Selector.FINAL_PRICE);
    }

    _initComponents() {
      this.components.dropdownDate = new DropdownDate(this.nodes.dropdownDate);
      this.components.dropdownDate.hooks.inputValueSet = this.handleArrivalAndDepartureSet;

      this.components.dropdownGuests = new DropdownGuests(this.nodes.dropdownGuests);
    }

    _setGuestCount(guests) {
      this.components.dropdownGuests.setOptionValues(guests)
    }

    _setArrivalAndDeparture(arrival, departure) {
      this.components.dropdownDate.setArrival(arrival);
      this.components.dropdownDate.setDeparture(departure);
    }

    _getGuestsCount() {
      const dropdownGuestsInputValue = this.components.dropdownGuests.getInputValue();
      const isGuestNumber = new RegExp(/\d*(?= г)/);
      const guestNumber = dropdownGuestsInputValue.match(isGuestNumber);
      return (guestNumber !== null) ? guestNumber : 0;
    }

    _gatNumberOfDays() {
      const arrival = this.components.dropdownDate.getArrival();
      const departure = this.components.dropdownDate.getDeparture();
      return this._getNumbersOfDaysBetweenDates(arrival, departure);
    }

    _getGross(pricePerDay, days) {
      return pricePerDay * days;
    }

    _getDiscount() {
      // The calculation logic is unknown
      return 2179;
    }

    _getServicePrice() {
      // The calculation logic is unknown
      return 0;
    }

    _getExtraPrice(extra) {
      // The calculation logic is unknown
      return extra.length * 100;
    }

    _getExtraList(extra) {
      return extra.map((value) => Extra[value].toLowerCase());
    }

    _getFinalPrice(gross, service, extra, discount) {
      return gross + service + extra - discount;
    }

    _getNumbersOfDaysBetweenDates(arrival, departure) {
      return 1 + Math.ceil((departure.getTime() - arrival.getTime()) / MILLISECONDS_PER_DAY);
    }

    _drawHeading(options) {
      const { number, isLux, pricePerDay } = options;
      this._drawNumber(number);
      this._drawLux(isLux);
      this._drawPricePerDay(pricePerDay);
    }

    _drawServiceAndExtra(options) {
      const { service, extra } = options;
      this._drawServiceToolip(service);
      this._drawServicePrice(this.servicePrice);
      this._drawExtraToolip(extra);
      this._drawExtraPrice(this.extraPrice);
    }

    _drawNumber(number) {
      this.nodes.number.textContent = number;
    }

    _drawLux(isLux) {
      if (isLux) {
        this.nodes.lux.classList.remove(Modifier.LUX_HIDDEN);
      } else {
        this.nodes.lux.classList.add(Modifier.LUX_HIDDEN);
      }
    }

    _drawPricePerDay(price) {
      this.nodes.price.textContent = `${Utility.presentAsRublesPrice(price)} `;
    }

    _drawGrossProduct(pricePerDay, days) {
      const pricePerDayPretty = Utility.presentAsRublesPrice(pricePerDay);
      const wordForNumberOfDays = this._getCorrectWordForNumberOfDays(days);
      this.nodes.grossProduct.textContent = `${pricePerDayPretty} x ${days} ${wordForNumberOfDays}`;
    }

    _drawGrossResult(gross) {
      this._drawPrice(gross, this.nodes.grossResult);
    }

    _drawDiscount(discount) {
      this._drawPrice(discount, this.nodes.discount);
    }

    _drawServicePrice(service) {
      this._drawPrice(service, this.nodes.servicePrice);
    }

    _drawServiceToolip(service) {
      this.nodes.serviceTooltip.setAttribute('title', service);
    }

    _drawExtraPrice(extra) {
      this._drawPrice(extra, this.nodes.extraPrice);
    }

    _drawExtraToolip(extra) {
      const extraList = this._getExtraList(extra);
      this.nodes.extraTooltip.setAttribute('title', extraList.join(', '));
    }

    _drawFinalPrice(final) {
      this._drawPrice(final, this.nodes.finalPrice);
    }

    _drawPrice(price, node) {
      node.textContent = Utility.presentAsRublesPrice(price);
    }

    _getCorrectWordForNumberOfDays(numberOf) {
      if (1 < numberOf && numberOf <= 4) return 'суток';

      if (numberOf % 100 < 11 || 14 < numberOf % 100) {
        switch (numberOf % 10) {
          case 1: {
            return 'сутки';
          }
          case 2:
          case 3:
          case 4: {
            return 'дня';
          }
          default: {
            break;
          }
        }
      }
  
      return 'суток';
    }

    handleArrivalAndDepartureSet = (arrival, departure) => {
      if (arrival !== null && departure !== null) {
        this.updateAccount();
      }
    }
  }

  const initInvoiceCard = BEMComponent.makeAutoInitializer(InvoiceCard, ClassName.ROOT);

  document.addEventListener('DOMContentLoaded', initInvoiceCard);

  return InvoiceCard;
})(document);

export { InvoiceCard }
