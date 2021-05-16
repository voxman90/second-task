'use strict';

import $ from 'jquery';

import { SearchRoom } from './search-room';
import { hotelRoomCardData } from './hotel-room-card.data';

(function($){
  function init() {
    SearchRoom.initPagination();
    SearchRoom.initHotelRoomCards(hotelRoomCardData);
    const sidebar = SearchRoom.initRoomSearchSidebar();
    SearchRoom.configureRoomSearchSidebar(sidebar);
  }

  $(init());
})($);
