'use strict';

import $ from 'jquery';

import { SearchRoom } from './search-room';
import { hotelRoomCardData } from './hotel-room-card.data';

(function($){
  function init() {
    SearchRoom.initHotelRoomCards(hotelRoomCardData);
    const sidebar = SearchRoom.initRoomSearchSidebar();
    sidebar.toggleDropdownFacilitiesBar();
    SearchRoom.configureRoomSearchSidebar(sidebar);
  }

  $(init());
})($);
