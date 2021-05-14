'use strict';

import { HotelRoomCard } from 'components/hotel-room-card/hotel-room-card';
import { RoomSearchSidebar } from 'components/room-search-sidebar/room-search-sidebar';

const SearchRoom = (function (document) {
  const Selector = {
    HOTEL_ROOM_CARD     : '.js-hotel-room-card',
    ROOM_SEARCH_SIDEBAR : '.js-room-search-sidebar',
  }

  function initRoomSearchSidebar() {
    const sidebar = document.querySelector(Selector.ROOM_SEARCH_SIDEBAR);
    const sidebarComp = new RoomSearchSidebar(sidebar);
    return sidebarComp;
  }

  function initHotelRoomCards(data) {
    const cards = document.querySelectorAll(Selector.HOTEL_ROOM_CARD);
    cards.forEach((card, i) => {
      HotelRoomCard.init(card, data[i]);
    })
  }

  function configureRoomSearchSidebar(sidebar) {
    sidebar.setDates(new Date(2021, 8, 21), new Date(2021, 8, 26));
    sidebar.setGuests([1, 2, 1]);
    sidebar.setFacilities([2, 2]);
    sidebar.setRules(['pets-allowed', 'guest-allowed']);
    sidebar.setExtra(['writing-desk', 'feeding-chair', 'crib']);
  }

  return { initRoomSearchSidebar, initHotelRoomCards, configureRoomSearchSidebar };
})(document);

export { SearchRoom };
