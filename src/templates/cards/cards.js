'use strict';

import jQuery from 'jquery';

import { Calendar } from 'components/calendar/calendar';
import { InvoiceCard } from 'components/invoice-card/invoice-card';
import { HotelRoomCard } from 'components/hotel-room-card/hotel-room-card';
import { RoomSearchCard } from 'components/room-search-card/room-search-card';

(function ($) {
  const Selector = {
    HOTEL_ROOM_CARD  : '.js-hotel-room-card',
    CALENDAR         : '.js-calendar',
    ROOM_SEARCH_CARD : '.js-room-search-card',
    INVOICE_CARD     : '.js-invoice-card',
    CALENDAR_CARD    : '.js-calendar-card',
  };

  const hotelRoomCardConfig = [
    {
      roomNumber: 888,
      isLux: true,
      pricePerDay: 9990,
      reviewNumber: 145,
      rating: 5,
      imgAttributes: [
        {
          srcset: `${require('assets/img/room888-1080w.jpg').default} 1080w,
                   ${require('assets/img/room888-540w.jpg').default} 540w,
                   ${require('assets/img/room888-405w.jpg').default} 405w`,
          sizes: `(max-width: 320px) 405px,
                  (max-width: 768px) 540px,
                  1080px`,
          src: require('assets/img/room888-540w.jpg').default,
          alt: 'photo of the room 888',
        },
      ],
    },
    {
      roomNumber: 840,
      isLux: false,
      pricePerDay: 9900,
      reviewNumber: 65,
      rating: 4,
      imgAttributes: [
        {
          srcset: `${require('assets/img/room840-1080w.jpg').default} 1080w,
                   ${require('assets/img/room840-540w.jpg').default} 540w,
                   ${require('assets/img/room840-405w.jpg').default} 405w`,
          sizes: `(max-width: 320px) 405px,
                  (max-width: 768px) 540px,
                  1080px`,
          src: require('assets/img/room840-540w.jpg').default,
          alt: 'photo of the room 840',
        },
      ],
    },
  ];

  function initRoomSearchCard() {
    const roomSearchCard = initComp(Selector.ROOM_SEARCH_CARD, RoomSearchCard);
    // TODO: Вынести в методы карточки, т.к. нарушает закон Деметры
    roomSearchCard.components.dropdownDate.setArrivalAndDeparture(new Date(2021, 8, 21), new Date(2021, 8, 26));
    roomSearchCard.components.dropdownGuests.setOptionValues([1, 2]);
  }

  function initInvoiceCard() {
    initComp(Selector.INVOICE_CARD, InvoiceCard);
  }

  function initCalendar() {
    const calendar = initComp(Selector.CALENDAR_CARD, Calendar);
    calendar.setArrival(new Date(2021, 8, 21));
    calendar.setDeparture(new Date(2021, 8, 26));
    calendar.updateCurrentSheet(calendar.getClosestDate());
  }

  function initHotelRoomCards() {
    const hotelRoomCards = document.querySelectorAll(Selector.HOTEL_ROOM_CARD);
    hotelRoomCards.forEach((card, i) => {
      HotelRoomCard.init(card, hotelRoomCardConfig[i]);
    });
  }

  function initComp(selector, Class) {
    const element= $(selector).get(0);
    return new Class(element);
  }

  function init() {
    initRoomSearchCard();
    initCalendar();
    initInvoiceCard();
    initHotelRoomCards();
  }

  $(init());

})(jQuery);
