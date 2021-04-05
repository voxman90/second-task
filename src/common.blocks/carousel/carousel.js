import $ from 'jquery';

import { BEMComponent } from '../../scripts/BEMComponent';
import { Utility } from '../../scripts/Utility';

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

  const transitionEndEventName = Utility.getTransitionEndEventName();

  class Carousel extends BEMComponent {
    constructor(element) {
      super(element, 'carousel');

      this.connectBasis();

      this.attachEventListeners();
    }

    connectBasis() {
      this.$items = $(Selector.ITEM, this.root);
      this.prevButton = $(Selector.BUTTON_PREV, this.root).get(0);
      this.nextButton = $(Selector.BUTTON_NEXT, this.root).get(0);
      this.navPanel = $(Selector.NAV_PANEL, this.root).get(0);
      this.$navItems = $(this.navPanel).children();

      this.amount = this.$items.length;
      this.setActive(0).checkNavItem(0);

      this.isSliding = false;
    };

    attachEventListeners() {
      this.listeners = [
        {
          elem: this.prevButton,
          event: 'click',
          callback: this.handlePrevButtonClick.bind(this),
        },

        {
          elem: this.nextButton,
          event: 'click',
          callback: this.handleNextButtonClick.bind(this),
        },

        {
          elem: this.navPanel,
          event: 'click',
          callback: this.handleNavPanelClick.bind(this),
        },
      ];

      this.bindEventListeners(this.listeners);
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
      const curr = $(this.$items).eq(from);
      const next = $(this.$items).eq(to);

      async function a(event) {
        $(event.target).removeClass(`${active} ${direction}`);
        return null;
      }

      async function b(event) {
        $(event.target).removeClass(`${order} ${direction}`).addClass(active);
        return null;
      }

      $(curr).one(transitionEndEventName, a);

      $(next).one(transitionEndEventName, b);

      $(next).addClass(order);

      setTimeout(() => {
        $(curr).addClass(direction);
        $(next).addClass(direction);
      }, 0);

      const iss = this.isSliding;
      console.log('до завершения, должно быть true', iss);
      await a;
      await b;
      this.isSliding = false;
      console.log('присвоили false', this.isSliding);
    }

    setItems(itemProps) {
      $(this.$items).each((i, item) => {
        $(item).children().eq(i).attr(itemProps[i]);
      });
      return this;
    }

    setActive(index) {
      this.active = index;
      $(this.$items).eq(index).addClass(Modifier.ITEM_ACTIVE);

      return this;
    }

    deactivateItem(index) {
      $(this.$items).eq(index).removeClass(Modifier.ITEM_ACTIVE);

      return this;
    }

    checkNavItem(index) {
      $(this.$navItems)
        .each((i, item) => {
          $(item).removeClass(Modifier.NAV_ITEM_CHECKED);
        })
        .eq(index)
        .addClass(Modifier.NAV_ITEM_CHECKED);

      return this;
    }

    handlePrevButtonClick() {
      if (this.isSliding === false) {
        this.isSliding = true;
        const from = this.active;
        const to = this.mod(from - 1, this.amount);
        this.active = to;
        this.checkNavItem(to).slideToRight(from, to);
      }
    }

    handleNextButtonClick() {
      if (this.isSliding === false) {
        this.isSliding = true;
        const from = this.active;
        const to = this.mod(from + 1, this.amount);
        this.active = to;
        this.checkNavItem(to).slideToLeft(from, to);
      }
    }

    handleNavPanelClick(event) {
      if (this.isSliding === false) {
        this.isSliding = true;
        console.log(this.isSliding);
        const et = event.target;
        if ($(et).hasClass(ClassName.NAV_ITEM)) {
          const from = this.active;
          const to = parseInt($(et).attr('data-item'), 10);
          if (from !== to) {
            this.active = to;
            this.checkNavItem(to).slideTo(from, to);
          }
        }
      }
    }

    mod(a, b) {
      return ((a % b) + b) % b;
    }

    isCloserToLeft(from, to) {
      const length = this.amount;
      return this.mod(from - to, length) > this.mod(to - from, length);
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
