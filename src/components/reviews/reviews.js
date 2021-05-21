'use strict';

import { BEMComponent } from 'scripts/BEMComponent';
import { Utility } from 'scripts/Utility';
import { LikeButton } from 'components/like-button/like-button';

const Reviews = (function (document) {
  const ClassName = {
    ROOT : 'js-reviews',
  }

  const Selector = {
    COUNTER     : '.js-reviews__counter',
    COMMENT     : '.js-comment',
    LIKE_BUTTON : '.js-like-button',
  }

  const formOfWordReview = {
    nominative: 'отзыв',
    genitive: 'отзыва',
    genitivePlural: 'отзывов',
  }

  class Reviews extends BEMComponent {
    constructor(element) {
      super(element, 'reviews');

      this._nodes = {}
      this._components = {}

      this._connectBasis();
      this._setCounter();
    }

    _setCounter() {
      const numberOfReviews = this._nodes.comments.length;
      const wordForNumberOfReviews = Utility.getCorrectFormOfWord(numberOfReviews, formOfWordReview);
      this._nodes.counter.textContent = `${numberOfReviews} ${wordForNumberOfReviews}`;
    }

    _connectBasis() {
      this._nodes.counter = this.root.querySelector(Selector.COUNTER);
      this._nodes.comments = this.root.querySelectorAll(Selector.COMMENT);
      const likeButtons = this.root.querySelectorAll(Selector.LIKE_BUTTON);
      this._components.likeButtons = this._initLikeButtons(likeButtons);
    }

    _initLikeButtons(likeButtons) {
      const likeButtonArray = Array.from(likeButtons);
      const likeButtonComps = likeButtonArray.map((root) => new LikeButton(root));
      return likeButtonComps;
    }
  }

  const initReviews = BEMComponent.makeAutoInitializer(Reviews, ClassName.ROOT);

  document.addEventListener('DOMContentLoaded', initReviews);

  return Reviews;
})(document);

export { Reviews }
