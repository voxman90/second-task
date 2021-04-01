import $ from 'jquery';

import { BEMComponent } from '../../scripts/scripts';

class Carousel extends BEMComponent {
  constructor(elem) {
    super('carousel');

    this.connectBasis(elem);

    this.attachListeners();
  }

  connectBasis(elem) {
    this.rootNode = elem;
    this.$items = $('.js-carousel-item', this.rootNode);
    this.prevButtonNode = $('.js-carousel__prev-button').get(0);
    this.nextButtonNode = $('.js-carousel__next-button').get(0);
    this.navPanelNode = $('.js-carousel__nav-panel').get(0);
    this.$navItems = $(this.navPanelNode).children();

    this.amount = this.$items.length;
    this.setActive(0).checkNavItem(0);
    this.transitionEndEventName = this.getTransitionEndEventName();
  };

  attachListeners() {
    this.bindEventListeners([
      {
        elem: this.prevButtonNode,
        event: 'click',
        callback: this.handlePrevButtonClick,
      },

      {
        elem: this.nextButtonNode,
        event: 'click',
        callback: this.handleNextButtonClick,
      },

      {
        elem: this.navPanelNode,
        event: 'click',
        callback: this.handleNavPanelClick,
      },
    ]);
  }

  attachTransitionEndEventListener(elem, callback) {
    this.bindEventListener({
      elem,
      callback,
      event: this.transitionEndEventName,
      options: { 
        once: true,
      },
    });
  }

  handlePrevButtonClick = () => {}

  handleNextButtonClick = () => {}

  handleNavPanelClick = (event) => {
    const et = event.target;
    if ($(et).hasClass('carousel__nav-panel-item')) {
      const from = this.active;
      const to = parseInt($(et).attr('data-item'), 10);
      console.log('from', from);
      console.log('to', to);
      if (from !== to) {
        this.checkNavItem(to).moveTo(from, to);
      }
    }
  }

  moveTo(from, to) {
    if (from >= to) {
      return this.moveFromRTL(from, to);
    }

    return this.moveFromLTR(from, to);
  }

  moveFromRTL(from, to) {
    const fromNode = $(this.$items).eq(from);
    const toNode = $(this.$items).eq(to);
    this.attachTransitionEndEventListener(fromNode, (event) => {
      $(event.target)
        .removeClass('carousel__item_right carousel__item_next')
        .addClass('carousel__item_active');
    });
    this.attachTransitionEndEventListener(toNode, (event) => {
      $(event.target)
        .removeClass('carousel__item_left carousel__item_active');
    });

    $(fromNode).eq(from).addClass('carousel__item_right carousel__item_next');
    $(toNode).eq(to).addClass('carousel__item_left');
  }

  moveFromLTR(from, to) {
    const fromNode = $(this.$items).eq(from);
    const toNode = $(this.$items).eq(to);
    this.attachTransitionEndEventListener(fromNode, (event) => {
      $(event.target)
        .removeClass('carousel__item_left carousel__item_prev')
        .addClass('carousel__item_active');
    });
    this.attachTransitionEndEventListener(toNode, (event) => {
      $(event.target)
        .removeClass('carousel__item_right carousel__item_active');
    });

    $(fromNode).eq(from).addClass('carousel__item_left carousel__item_prev');
    $(toNode).eq(to).addClass('carousel__item_right');
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

  getItem() {

  }

  getItems() {

  }
}


const initCarouselComps = BEMComponent.makeInitializer(
  Carousel,
  '.js-carousel.js-auto-init'
);

document.addEventListener('DOMContentLoaded', initCarouselComps);

export { Carousel };
