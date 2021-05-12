'use strict';

import $ from 'jquery';

import { BEMComponent } from 'scripts/BEMComponent';
import { Utility } from 'scripts/Utility';

const Carousel = (($, document) => {
  const ClassName = {
    ROOT     : 'js-carousel',
    NAV_ITEM : 'carousel__nav-panel-item',
  }

  const Selector = {
    ITEM        : '.js-carousel__item',
    BUTTON_PREV : '.js-carousel__prev-button',
    BUTTON_NEXT : '.js-carousel__next-button',
    NAV_PANEL   : '.js-carousel__nav-panel',
  }

  const Modifier = {
    ITEM_DIRECTION_LEFT  : 'carousel__item_direction_left',
    ITEM_DIRECTION_RIGHT : 'carousel__item_direction_right',
    ITEM_ORDER_PREV      : 'carousel__item_order_prev',
    ITEM_ORDER_NEXT      : 'carousel__item_order_next',
    ITEM_ACTIVE          : 'carousel__item_active',
    NAV_ITEM_CHECKED     : 'carousel__nav-panel-item_checked',
  }

  const Event = {
    transitionEndEventName : Utility.getTransitionEndEventName(),
  }

  const Default = {
    haveNavbar: true,
    haveButtons: true,
  }

  class Carousel extends BEMComponent {
    constructor(element, config = Default, name = 'carousel') {
      super(element, name);

      this._config = config;
      this._isSliding = false;

      this._connectBasis();

      this._defineEventListeners();
      this.attachMultipleEventListeners(this.listeners);
    }

    slideTo(from, to) {
      if (this._isCloserToLeft(from, to)) {
        return this.slideToLeft(from, to);
      }

      return this.slideToRight(from, to);
    }

    slideToLeft(from, to) {
      return this._slide({
        from,
        to,
        order: Modifier.ITEM_ORDER_NEXT,
        direction: Modifier.ITEM_DIRECTION_LEFT,
        active: Modifier.ITEM_ACTIVE,
      });
    }

    slideToRight(from, to) {
      return this._slide({
        from,
        to,
        order: Modifier.ITEM_ORDER_PREV,
        direction: Modifier.ITEM_DIRECTION_RIGHT,
        active: Modifier.ITEM_ACTIVE,
      });
    }

    setItems(itemProps) {
      $(this._$items).each((i, item) => {
        $(item).children().eq(i).attr(itemProps[i]);
      });
    }

    slidingStart() {
      this._isSliding = true;
    }

    slidingEnd() {
      this._isSliding = false;
    }

    isSliding() {
      return this._isSliding;
    }

    _connectBasis() {
      this._$items = $(Selector.ITEM, this.root);
      this._amount = this._$items.length;
      this._setActive(0);

      const { haveNavbar, haveButtons } = this._config;

      if (haveButtons) {
        this._connectButtons();
      }

      if (haveNavbar) {
        this._connectNavbar();
      }
    }

    _connectNavbar() {
      this.navPanel = $(Selector.NAV_PANEL, this.root).get(0);
      this._$navItems = $(this.navPanel).children();
      this._checkNavItem(0);
    }

    _connectButtons() {
      this.prevButton = $(Selector.BUTTON_PREV, this.root).get(0);
      this.nextButton = $(Selector.BUTTON_NEXT, this.root).get(0);
    }

    _setActive(index) {
      this._active = index;
      $(this._$items).eq(index).addClass(Modifier.ITEM_ACTIVE);
    }

    _getNextSlideIndex(from) {
      return this._mod(from + 1, this._amount);
    }

    _getPrevSlideIndex(from) {
      return this._mod(from - 1, this._amount);
    }

    async _slide(args) {
      const { from, to, order, direction, active } = args;

      const currentSlide = $(this._$items).eq(from);
      const nextSlide = $(this._$items).eq(to);

      $(nextSlide).addClass(order);

      this._reflow(nextSlide);

      const currentSlideTransitionEndEventPromise = new Promise((resolve, reject) => {
        $(currentSlide).one(Event.transitionEndEventName, (event) => {
          $(event.currentTarget).removeClass(`${active} ${direction}`);
          return resolve();
        })
      });

      const nextSlideTransitionEndEventPromise = new Promise((resolve, reject) => {
        $(nextSlide).one(Event.transitionEndEventName, (event) => {
          $(event.currentTarget).removeClass(`${order} ${direction}`).addClass(active);
          return resolve();
        })
      });

      $(currentSlide).addClass(direction);
      $(nextSlide).addClass(direction);

      await currentSlideTransitionEndEventPromise;
      await nextSlideTransitionEndEventPromise;
    }

    _checkNavItem(index) {
      $(this._$navItems)
        .each((_, _i, item) => {
          $(item).removeClass(Modifier.NAV_ITEM_CHECKED);
        })
        .eq(index)
        .addClass(Modifier.NAV_ITEM_CHECKED);
    }

    _reflow(element) {
      $(element).outerHeight();
    }

    _mod(a, b) {
      return ((a % b) + b) % b;
    }

    _isCloserToLeft(from, to) {
      const slidesAmount = this._amount;
      return this._mod(from - to, slidesAmount) > this._mod(to - from, slidesAmount);
    }

    handleNextButtonClick = () => {
      if (!this.isSliding()) {
        this.slidingStart();

        const from = this._active;
        const to = this._getNextSlideIndex(from);

        this.slideToLeft(from, to)
          .then(() => {
            this.slidingEnd();
          })
          .catch((error) => {
            console.log(`%c ${this.namespace}, slideToLeft -> ${error}`, 'color: darkgreen');
          });

        this._active = to;

        if (this._config.haveNavbar) {
          this._checkNavItem(to);
        }
      }
    }

    handlePrevButtonClick = () => {
      if (!this.isSliding()) {
        this.slidingStart();

        const from = this._active;
        const to = this._getPrevSlideIndex(from);

        this.slideToRight(from, to)
          .then(() => {
            this.slidingEnd();
          })
          .catch((error) => {
            console.log(`%c ${this.namespace}, slideToRight -> ${error}`, 'color: darkgreen');
          });

        this._active = to;

        if (this._config.haveNavbar) {
          this._checkNavItem(to);
        }
      }
    }

    handleNavPanelClick = (event) => {
      const isThisNavItem = $(event.target).hasClass(ClassName.NAV_ITEM);
      const isThisChekedNavItem = $(event.target).hasClass(Modifier.NAV_ITEM_CHECKED);
      if (
        !this.isSliding()
        && isThisNavItem
        && !isThisChekedNavItem
      ) {
        this.slidingStart();

        const from = this._active;
        const to = this.getAttributeNumericalValue(event.target, 'data-item')

        this.slideTo(from, to)
          .then(() => {
            this.slidingEnd();
          }).catch((error) => {
            console.log(`%c ${this.namespace}, slideTo -> ${error}`, 'color: darkgreen');
          });

        this._active = to;
        this._checkNavItem(to);
      }
    }

    _defineEventListeners() {
      const { haveButtons, haveNavbar } = this._config;

      if (haveButtons) {
        this.listeners.push(
          {
            element: this.prevButton,
            event: 'click',
            handler: this.handlePrevButtonClick,
          },
  
          {
            element: this.nextButton,
            event: 'click',
            handler: this.handleNextButtonClick,
          },
        )
      }

      if (haveNavbar) {
        this.listeners.push(
          {
            element: this.navPanel,
            event: 'click',
            handler: this.handleNavPanelClick,
          },
        )
      }
    }
  }

  const initCarouselComps = BEMComponent.makeAutoInitializer(
    Carousel,
    ClassName.ROOT,
  );

  document.addEventListener('DOMContentLoaded', initCarouselComps);

  return Carousel;
})($, document);

export { Carousel };
