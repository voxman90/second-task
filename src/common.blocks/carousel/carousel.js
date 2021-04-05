import $ from 'jquery';

import { BEMComponent } from '../../scripts/BEMComponent';
import { Utility } from '../../scripts/Utility';

const Carousel = (($) => {

  class Carousel extends BEMComponent {
    constructor(element) {
      super(element, 'carousel');

      this.connectBasis();

      this.attachListeners();
    }

    connectBasis() {
      this.$items = $('.js-carousel__item', this.root);
      this.prevButton = $('.js-carousel__prev-button').get(0);
      this.nextButton = $('.js-carousel__next-button').get(0);
      this.navPanel = $('.js-carousel__nav-panel').get(0);
      this.$navItems = $(this.navPanel).children();

      this.amount = this.$items.length;
      this.setActive(0).checkNavItem(0);
      this.transitionEndEventName = Utility.getTransitionEndEventName();
      this.isSliding = false;
    };

    attachListeners() {
      this.bindEventListeners([
        {
          elem: this.prevButton,
          event: 'click',
          callback: this.handlePrevButtonClick,
        },

        {
          elem: this.nextButton,
          event: 'click',
          callback: this.handleNextButtonClick,
        },

        {
          elem: this.navPanel,
          event: 'click',
          callback: this.handleNavPanelClick,
        },
      ]);
    }

    attachTransitionEndEventListener(elem, callback) {
      $(elem).on(this.transitionEndEventName, function(event) {
        callback(event);
        $(this).off(event);
      });
    }

    handlePrevButtonClick = () => {
      if (this.isSliding === false) {
        this.isSliding === true;
        const from = this.active;
        const to = this.mod(from - 1, this.amount);
        this.active = to;
        this.checkNavItem(to).slideToRight(from, to);
      }
    }

    handleNextButtonClick = () => {
      if (this.isSliding === false) {
        this.isSliding === true;
        const from = this.active;
        const to = this.mod(from + 1, this.amount);
        this.active = to;
        this.checkNavItem(to).slideToLeft(from, to);
      }
    }

    handleNavPanelClick = (event) => {
      if (this.isSliding === false) {
        this.isSliding === true;
        const et = event.target;
        if ($(et).hasClass('carousel__nav-panel-item')) {
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

    isToLeftCloser(from, to) {
      const length = this.amount;
      return this.mod(from - to, length) > this.mod(to - from, length);
    }

    slideTo(from, to) {
      if (this.isToLeftCloser(from, to)) {
        return this.slideToLeft(from, to);
      }

      return this.slideToRight(from, to);
    }

    slideToLeft(curr, next) {
      const currSlide = $(this.$items).eq(curr);
      const nextSlide = $(this.$items).eq(next);
      $(nextSlide).addClass('carousel__item_next');

      this.attachTransitionEndEventListener(currSlide, function(event) {
        $(event.target)
          .removeClass('carousel__item_active carousel__item_left');
      });

      this.attachTransitionEndEventListener(nextSlide, function(event) {
        $(event.target)
          .removeClass('carousel__item_next carousel__item_left')
          .addClass('carousel__item_active');
        setTimeout(() => { 
          this.isSliding === false;
        }, 100);
      });

      setTimeout(() => {
        $(currSlide).addClass('carousel__item_left');
        $(nextSlide).addClass('carousel__item_left');
      }, 0);
    }

    slideToRight(curr, next) {
      const currSlide = $(this.$items).eq(curr);
      const nextSlide = $(this.$items).eq(next);
      $(nextSlide).addClass('carousel__item_prev');

      this.attachTransitionEndEventListener(currSlide, (event) => {
        $(event.target)
          .removeClass('carousel__item_active carousel__item_right');
      });

      this.attachTransitionEndEventListener(nextSlide, (event) => {
        $(event.target)
          .removeClass('carousel__item_prev carousel__item_right')
          .addClass('carousel__item_active');
        setTimeout(() => { 
          this.isSliding === false;
        }, 100);
      });

      setTimeout(() => {
        $(currSlide).addClass('carousel__item_right');
        $(nextSlide).addClass('carousel__item_right');
      }, 0);
    }

    setItems(itemProps) {
      $(this.$items).each((i, item) => {
        $(item).children().eq(i).attr(itemProps[i]);
      });
      return this;
    }

    setActive(index) {
      this.active = index;
      $(this.$items).eq(index).addClass('carousel__item_active');
      return this;
    }

    deactivateItem(index) {
      $(this.$items).eq(index).removeClass('carousel__item_active');
      return this;
    }

    checkNavItem(index) {
      $(this.$navItems)
        .each((i, item) => {
          $(item).removeClass('carousel__nav-panel-item_check');
        })
        .eq(index)
        .addClass('carousel__nav-panel-item_check');
      return this;
    }
  }

  const initCarouselComps = BEMComponent.makeAutoInitializer(
    Carousel,
    'js-carousel',
  );

  document.addEventListener('DOMContentLoaded', initCarouselComps);

  return Carousel;
})($);

export { Carousel };
