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

  class Carousel extends BEMComponent {
    constructor(element) {
      super(element, 'carousel');

      this.$items = $(Selector.ITEM, this.root);
      this.prevButton = $(Selector.BUTTON_PREV, this.root).get(0);
      this.nextButton = $(Selector.BUTTON_NEXT, this.root).get(0);
      this.navPanel = $(Selector.NAV_PANEL, this.root).get(0);
      this.$navItems = $(this.navPanel).children();

      this.amount = this.$items.length;
      this.setActive(0);
      this.checkNavItem(0);

      this.isSliding = false;

      this.listeners = this.defineEventListeners();
      this.attachMultipleEventListeners(this.listeners);
    }

    setItems(itemProps) {
      $(this.$items).each((i, item) => {
        $(item).children().eq(i).attr(itemProps[i]);
      });
    }

    setActive(index) {
      this.active = index;
      $(this.$items).eq(index).addClass(Modifier.ITEM_ACTIVE);
    }

    getNextSlideIndex(from) {
      return this.mod(from + 1, this.amount);
    }

    getPrevSlideIndex(from) {
      return this.mod(from - 1, this.amount);
    }

    defineEventListeners() {
      return [
        {
          element: this.prevButton,
          event: 'click',
          handler: this.handlePrevButtonClick.bind(this),
        },

        {
          element: this.nextButton,
          event: 'click',
          handler: this.handleNextButtonClick.bind(this),
        },

        {
          element: this.navPanel,
          event: 'click',
          handler: this.handleNavPanelClick.bind(this),
        },
      ];
    }

    slideTo(from, to) {
      if (this.isCloserToLeft(from, to)) {
        return this.slideToLeft(from, to);
      }

      return this.slideToRight(from, to);
    }

    slideToLeft(from, to) {
      return this.slide({
        from,
        to,
        order: Modifier.ITEM_ORDER_NEXT,
        direction: Modifier.ITEM_DIRECTION_LEFT,
        active: Modifier.ITEM_ACTIVE,
      });
    }

    slideToRight(from, to) {
      return this.slide({
        from,
        to,
        order: Modifier.ITEM_ORDER_PREV,
        direction: Modifier.ITEM_DIRECTION_RIGHT,
        active: Modifier.ITEM_ACTIVE,
      });
    }

    async slide(args) {
      const { from, to, order, direction, active } = args;

      const currSlide = $(this.$items).eq(from);
      const nextSlide = $(this.$items).eq(to);

      $(nextSlide).addClass(order);

      this.reflow(nextSlide);

      const currSlideTransitionEndEventPromise = new Promise((resolve, reject) => {
        $(currSlide).one(Event.transitionEndEventName, (event) => {
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

      $(currSlide).addClass(direction);
      $(nextSlide).addClass(direction);

      await currSlideTransitionEndEventPromise;
      await nextSlideTransitionEndEventPromise;
    }

    deactivateItem(index) {
      $(this.$items).eq(index).removeClass(Modifier.ITEM_ACTIVE);
    }

    checkNavItem(index) {
      $(this.$navItems)
        .each((i, item) => {
          $(item).removeClass(Modifier.NAV_ITEM_CHECKED);
        })
        .eq(index)
        .addClass(Modifier.NAV_ITEM_CHECKED);
    }

    handleNextButtonClick() {
      if (!this.isSliding) {
        this.isSliding = true;

        const from = this.active;
        const to = this.getNextSlideIndex(from);

        this.slideToLeft(from, to)
          .then(() => {
            this.isSliding = false
          })
          .catch((error) => {
            console.log(`%c ${this.namespace}, slideToLeft -> ${error}`, 'color: darkgreen');
          });

        this.active = to;
        this.checkNavItem(to);
      }
    }

    handlePrevButtonClick() {
      if (!this.isSliding) {
        this.isSliding = true;

        const from = this.active;
        const to = this.getPrevSlideIndex(from);

        this.slideToRight(from, to)
          .then(() => {
            this.isSliding = false
          })
          .catch((error) => {
            console.log(`%c ${this.namespace}, slideToRight -> ${error}`, 'color: darkgreen');
          });

        this.active = to;
        this.checkNavItem(to);
      }
    }

    handleNavPanelClick(event) {
      const isThisNavItem = $(event.target).hasClass(ClassName.NAV_ITEM);
      const isThisChekedNavItem = $(event.target).hasClass(Modifier.NAV_ITEM_CHECKED);
      if (
        !this.isSliding
        && isThisNavItem
        && !isThisChekedNavItem
      ) {
        this.isSliding = true;

        const from = this.active;
        const to = this.getAttributeNumericalValue(event.target, 'data-item')

        this.slideTo(from, to)
          .then(() => {
            this.isSliding = false;
          }).catch((error) => {
            console.log(`%c ${this.namespace}, slideTo -> ${error}`, 'color: darkgreen');
          });

        this.active = to;
        this.checkNavItem(to);
      }
    }

    reflow(element) {
      $(element).outerHeight();
    }

    mod(a, b) {
      return ((a % b) + b) % b;
    }

    isCloserToLeft(from, to) {
      const slidesAmount = this.amount;
      return this.mod(from - to, slidesAmount) > this.mod(to - from, slidesAmount);
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
