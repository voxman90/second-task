'use strict';

import jQuery from 'jquery';

import { RoomSearchCard } from 'components/room-search-card/room-search-card';
import { InvoiceCard } from 'components/invoice-card/invoice-card';
import { Calendar } from 'components/calendar/calendar';

(function ($) {
  function initRoomSearchCard() {
    const roomSearchCard = initComp('.js-room-search-card', RoomSearchCard);
    roomSearchCard.components.dropdownDate.setArrivalAndDeparture(new Date(2021, 8, 21), new Date(2021, 8, 26));
    roomSearchCard.components.dropdownGuests.setOptionValues([1, 2]);
  }

  function initInvoiceCard() {
    initComp('.js-invoice-card', InvoiceCard);
  }

  function initCalendar() {
    const calendar = initComp('.js-calendar-card', Calendar);
    calendar.setArrival(new Date(2021, 8, 21));
    calendar.setDeparture(new Date(2021, 8, 26));
    calendar.updateCurrentSheet(calendar.getClosestDate());
  }

  function initComp(selector, Class) {
    const element= $(selector).get(0);
    return new Class(element);
  }

  function init() {
    initRoomSearchCard();
    initCalendar();
    initInvoiceCard()
  }

  $(init());

})(jQuery);
