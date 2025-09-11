/**
 * For product page only.
 */

(function () {
  // Change product tab.
  for (const element of document.querySelectorAll('[data-product-tab-to]')) {
    element.addEventListener('click', () => {
      const tabTo = element.getAttribute('data-product-tab-to');
      const tab = document.querySelector(`product-detail-tab-bar [data-tab-for="${tabTo}"]`);
      tab?.click();
    });
  }
})();

document.querySelector('.product-meta__reviews')?.addEventListener('click', (e) => {
  // Reviews snippet #product_just_stars 
  e.preventDefault();
  /** @type {HTMLElement} */
  const target = e.target;
  if (target?.matches('.sa_jump_to_reviews')) {
    const tab = document.querySelector('[data-tab-for="#reviews"]');
    const headerOffset = document.querySelector('[data-section-type="header"]')?.clientHeight ?? 0;
    if (tab) {
      tab.click();
      window.scrollTo({
        top: tab.getBoundingClientRect().top + window.scrollY - headerOffset,
        behavior: 'smooth',
      });
    }
  } else if (target?.matches('#ab-tiny-widget a')) {
    const tab = document.querySelector('[data-tab-for="#questions"]');
    const headerOffset = document.querySelector('[data-section-type="header"]')?.clientHeight ?? 0;
    if (tab) {
      tab.click();
      window.scrollTo({
        top: tab.getBoundingClientRect().top + window.scrollY - headerOffset,
        behavior: 'smooth',
      });
    }
  }
});


var ProductDetailTabBar = class extends HTMLElement {
  index = 0;
  /** @type {HTMLElement} */
  previousContentElement;

  constructor() {
    super();
    this.tabItems = [...this.querySelectorAll('[data-tab-item]')];
    // Set first content as previous
    if (this.tabItems.length > 0) {
      this.previousContentElement = document.querySelector(this.tabItems[0].getAttribute('data-tab-for'));
    }
    this.section = this.closest('.shopify-section');
  }

  connectedCallback() {
    this.addEventListener('click', (e) => {
      /** @type {HTMLElement} */
      const item = e.target.closest('[data-tab-item]');
      this.index = this.tabItems.indexOf(item);
      if (item) {
        this.handleClickItem(item);
      }
    });
    this.section.addEventListener('click', (e) => {
      /** @type {HTMLElement} */
      const collapseButton = e.target.closest('[data-collapse-button]');
      if (collapseButton) {
        const $content = $(collapseButton.nextElementSibling);
        if (collapseButton.hasAttribute('open')) {
          $content.stop().slideUp();
          collapseButton.removeAttribute('open');
        } else {
          $content.stop().slideDown();
          collapseButton.setAttribute('open', '');
        }
      }
    });
  }

  /**
   * Click tab item
   * @param {HTMLElement} item 
   */
  handleClickItem(item) {
    const el = item;
    if (item == this.previousContentElement) return;

    // Active tab item
    this.querySelector('[data-tab-item][open]')?.removeAttribute('open');
    item.setAttribute('open', '');

    // Active content
    this.previousContentElement?.removeAttribute('open');
    const selectors = item.getAttribute('data-tab-for');
    const contentElement = document.querySelector(selectors);
    contentElement?.setAttribute('open', '');
    this.previousContentElement = contentElement;

    // Tab item scroll into view
    const container = this.querySelector('[data-scroll-container]');
    const containerLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const itemLeft = el.offsetLeft;
    const itemWidth = el.offsetWidth;
    if (item.matches(':first-child')) {
      // first item
      container.scroll({ left: 0, behavior: 'smooth' });
    } else if (item.matches(':first-child')) {
      // last item
      container.scroll({ left: container.scrollWidth, behavior: 'smooth' });
    } else if (itemLeft < containerLeft || itemLeft + itemWidth > containerLeft + containerWidth) {
      // other item
      container.scroll({
        left: itemLeft,
        behavior: 'smooth'
      });
    }
  }
};

if (!window.customElements.get("product-detail-tab-bar")) {
  window.customElements.define("product-detail-tab-bar", ProductDetailTabBar);
}

var ProductFixedBar = class extends HTMLElement {
  mainBuyButtonsOffsetTop = 0;

  constructor() {
    super();
    this.mainBuyButtons = document.querySelector('product-rerender .product-form__buy-buttons');
    this.productImage = this.querySelector('[data-image]');
    this.productTitle = this.querySelector('[data-title]');
    this.productPrice = this.querySelector('[data-price]');
    this.productComparePrice = this.querySelector('[data-compare-price]');
    this.listener();
  }

  listener() {
    window.addEventListener('variant:change', (e) => {
      this.hanldeChangeVariant(e.detail.variant);
    });
    window.addEventListener('scroll', () => {
      if (window.scrollY > this.mainBuyButtonsOffsetTop) {
        this.show();
      } else {
        this.hide();
      }
    });
    const resizeObserver = new ResizeObserver((entries) => this.handleResize.bind(this));
    resizeObserver.observe(document.body);
    this.handleResize();
  }

  handleResize() {
    const bound = this.mainBuyButtons.getBoundingClientRect();
    this.mainBuyButtonsOffsetTop = bound.top + window.scrollY;
  }

  hanldeChangeVariant(variant) {
    if (variant) {
      const formatter = new Intl.NumberFormat(Shopify.locale, { style: "currency", currency: Shopify.currency.active });
      this.productImage.src = this.imageWithSize(variant.featured_image.src, 200);
      this.productPrice.innerHTML = formatter.format(variant.price / 100);
      this.productComparePrice.innerHTML = formatter.format(variant.compare_at_price / 100);
    }
  }

  imageWithSize(url, width) {
    const [base, query] = url.split('?');
    const params = new URLSearchParams(query || '');
    params.set('width', width);
    return base + '?' + params.toString();
  }

  show() {
    this.setAttribute('open', '');
  }

  hide() {
    this.removeAttribute('open');
  }
};

if (!window.customElements.get("product-fixed-bar")) {
  window.customElements.define("product-fixed-bar", ProductFixedBar);
}
