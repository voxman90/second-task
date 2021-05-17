'use strict';

import { BEMComponent } from 'scripts/BEMComponent';
import { HotelRoomCard } from 'components/hotel-room-card/hotel-room-card';

const Reviews = (function (document){
  const ClassName = {
    ROOT : 'js-reviews',
  }

  const Selector = {
    COUNTER     : '.js-reviews__counter',
    COMMENT     : '.js-comment',
    LIKE_BUTTON : '.js-like-button',
  }

  class Reviews {
    constructor() {
      this._nodes = {}
      this._components = {}

      this._connectBasis();
      this._setCounter();
    }

    _setCounter() {
      const reviewsNumber = this._nodes.comments.length;
      const wordForNumberOfReviews = HotelRoomCard.defineCorrectWordForNumberOfReviews(reviewsNumber);
      this._nodes.counter.textContent = `${reviewsNumber} ${wordForNumberOfReviews}`;
    }

    _connectBasis() {
      this._nodes.counter = this.root.querySelector(Selector.COUNTER);
      this._nodes.comments = this.root.querySelectorAll(Selector.COMMENT);
      this._components.likeButtons = this._nodes.reviews.querySelector(Selector.LIKE_BUTTON);
    }
  }

  const initReviews = BEMComponent.makeAutoInitializer(Reviews, ClassName.ROOT);

  document.addEventListener('DOMContentLoaded', initReviews);

  return Reviews;
})(document);

export { Reviews }
