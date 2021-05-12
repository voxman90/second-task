'use strict';

import $ from 'jquery';

import { HotelRoomCard } from 'components/hotel-room-card/hotel-room-card';

(function ($, document) {
  const Selector = {
    HOTEL_ROOM_CARD : '.js-hotel-room-card',
  }

  // TODO: Вынести в отдельный файл? (В базу данных на сервере.)
  const hotelRoomCardConfig = [
    {
      roomNumber: 888,
      isLux: true,
      pricePerDay: 9990,
      reviewNumber: 145,
      rating: 5,
    },
    {
      roomNumber: 840,
      isLux: false,
      pricePerDay: 9900,
      reviewNumber: 65,
      rating: 4,
    },
    {
      roomNumber: 980,
      isLux: true,
      pricePerDay: 8500,
      reviewNumber: 35,
      rating: 3,
    },
    {
      roomNumber: 856,
      isLux: false,
      pricePerDay: 7300,
      reviewNumber: 19,
      rating: 5,
    },
    {
      roomNumber: 740,
      isLux: false,
      pricePerDay: 6000,
      reviewNumber: 44,
      rating: 4,
    },
    {
      roomNumber: 982,
      isLux: false,
      pricePerDay: 5800,
      reviewNumber: 56,
      rating: 3,
    },
    {
      roomNumber: 678,
      isLux: false,
      pricePerDay: 5500,
      reviewNumber: 45,
      rating: 5,
    },
    {
      roomNumber: 450,
      isLux: false,
      pricePerDay: 5300,
      reviewNumber: 39,
      rating: 4,
    },
    {
      roomNumber: 350,
      isLux: false,
      pricePerDay: 5000,
      reviewNumber: 77,
      rating: 3,
    },
    {
      roomNumber: 666,
      isLux: false,
      pricePerDay: 5000,
      reviewNumber: 25,
      rating: 5,
    },
    {
      roomNumber: 444,
      isLux: false,
      pricePerDay: 5000,
      reviewNumber: 15,
      rating: 3,
    },
    {
      roomNumber: 352,
      isLux: false,
      pricePerDay: 5000,
      reviewNumber: 55,
      rating: 3,
    },
  ]

  function initHotelRoomCards(config) {
    const hotelRoomCardNodes = document.querySelectorAll(Selector.HOTEL_ROOM_CARD);
    hotelRoomCardNodes.forEach((node, i) => {
      HotelRoomCard.init(node, config[i]);
    })
  }

  function init() {
    initHotelRoomCards(hotelRoomCardConfig);
  }

  $(init());
})($, document);
