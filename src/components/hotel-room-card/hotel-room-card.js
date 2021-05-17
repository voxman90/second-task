'use strict';

import { Carousel } from 'components/carousel/carousel';
import { RateButton } from 'components/rate-button/rate-button';

const HotelRoomCard = (() => {
  const Selector = {
    CAROUSEL     : '.js-carousel',
    HOTEL_NUMBER : '.js-hotel-room-heading__number',
    LUX          : '.js-hotel-room-heading__lux',
    HOTEL_PRICE  : '.js-hotel-room-heading__price',
    RATE_BUTTON  : '.js-rate-button',
    REVIEW       : '.js-hotel-room-card__review',
  };

  const Modifier = {
    LUX_HIDDEN : 'hotel-room-heading__lux_hidden',
  }

  function init(element, config) {
    _drawHeading(element, config);
    _drawRatingPanel(element, config);
    const carousel = _initCarousel(element);
    _setCarouselItems(carousel, config);
  }

  function defineCorrectWordForNumberOfReviews(number) {
    let form = 'отзывов';

    if (number % 100 < 11 || 14 < number % 100) {
      switch (number % 10) {
        case 1: {
          form = 'отзыв';
          break;
        }
        case 2:
        case 3:
        case 4: {
          form = 'отзыва';
          break;
        }
        default: {
          break;
        }
      }
    }

    return form;
  }

  function _setCarouselItems(carousel, config) {
    const imgAttributes = config.imgAttributes;
    carousel.setImages(imgAttributes);
  }

  function _drawHeading(element, config) {
    const { isLux, roomNumber, pricePerDay } = config;
    const hotelNumberNode = element.querySelector(Selector.HOTEL_NUMBER);
    const hotelPriceNode = element.querySelector(Selector.HOTEL_PRICE);
    hotelNumberNode.textContent = roomNumber;
    hotelPriceNode.textContent = `${_prettify(pricePerDay)} `;
    if (isLux) {
      _displayLuxMark(element);
    }
  }

  function _displayLuxMark(element) {
    const luxNode = element.querySelector(Selector.LUX);
    luxNode.classList.remove(Modifier.LUX_HIDDEN);
  }

  function _drawRatingPanel(element, config) {
    const { reviewNumber, rating } = config;
    _drawReviewNumber(element, reviewNumber);
    _initRateButton(element, rating);
  }

  function _drawReviewNumber(element, reviewNumber) {
    const reviewNode = element.querySelector(Selector.REVIEW);
    const reviewNumberNode = reviewNode.childNodes[0];
    const reviewTextNode = reviewNode.childNodes[1];
    reviewNumberNode.textContent = reviewNumber;
    reviewTextNode.textContent = ` ${defineCorrectWordForNumberOfReviews(reviewNumber)}`;
  }

  function _initRateButton(element, rating) {
    const rateButtonNode = element.querySelector(Selector.RATE_BUTTON);
    const rateButtonComp =  new RateButton(rateButtonNode);
    rateButtonComp.fill(rating);
  }

  function _initCarousel(element) {
    const carouselNode = element.querySelector(Selector.CAROUSEL);
    return new Carousel(carouselNode);
  }

  function _prettify(price) {
    return `${price.toLocaleString()}\u20bd`;
  }

  return { init, defineCorrectWordForNumberOfReviews };
})();

export { HotelRoomCard };
