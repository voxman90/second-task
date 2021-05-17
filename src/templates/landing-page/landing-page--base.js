'use sctrict';

import { RoomSearchCard } from 'components/room-search-card/room-search-card';

(function (document) {
  const Selector = {
    ROOM_SEARCH_CARD : '.js-room-search-card',
  }

  function initRoomSearchCard() {
    const root = document.querySelector(Selector.ROOM_SEARCH_CARD);
    new RoomSearchCard(root);
  }

  document.addEventListener('DOMContentLoaded', initRoomSearchCard);
})(document);
