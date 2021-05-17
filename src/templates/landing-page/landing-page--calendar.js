'use sctrict';

import { RoomSearchCard } from 'components/room-search-card/room-search-card';

(function (document) {
  const Selector = {
    ROOM_SEARCH_CARD : '.js-room-search-card',
  }

  function initRoomSearchCard() {
    const root = document.querySelector(Selector.ROOM_SEARCH_CARD);
    const comp = new RoomSearchCard(root);
    comp.setDates(new Date(2021, 9, 12), new Date(2021, 9, 17));
    comp.toggleDropdownDatesBar;
  }

  document.addEventListener('DOMContentLoaded', initRoomSearchCard);
})(document);
