import jQuery from '@types/jquery'
import SwiperType from 'swiper';

export { };
declare global {
  declare const $: JQueryStatic;
  declare const jQuery: JQueryStatic;
  declare const Shopify: Shopify;
  declare const Swiper: SwiperType;
  declare const theme: Theme;

  type jQuery = JQueryStatic;
  type Swiper = SwiperType;
  type LoadCallback = (error: Error | undefined) => void;

  interface Shopify {
    country: string;
    currency: {
      active: string;
      rate: string;
    };
    designMode: boolean;
    locale: string;
    shop: string;
    loadFeatures(features: ShopifyFeature[], callback?: LoadCallback): void;
    ModelViewerUI?: ModelViewer;
    visualPreviewMode: boolean;
  }

  interface Theme {
    pageType: string;
    cartCount: string;
    moneyFormat: string;
    moneyWithCurrencyFormat: string;
    currencyCodeEnabled: string;
    showDiscount: string;
    discountMode: string;
    cartType: string;
  }

  interface Window {
    $: JQueryStatic;
    jQuery: JQueryStatic;
    Shopify: Shopify;
    Swiper: SwiperType;
    theme: Theme;
  }

  // Refer to https://github.com/Shopify/shopify/blob/main/areas/core/shopify/app/assets/javascripts/storefront/load_feature/load_features.js
  interface ShopifyFeature {
    name: string;
    version: string;
    onLoad?: LoadCallback;
  }

  // Refer to https://github.com/Shopify/model-viewer-ui/blob/main/src/js/model-viewer-ui.js
  interface ModelViewer {
    new(
      element: Element,
      options?: {
        focusOnPlay?: boolean;
      }
    ): ModelViewer;
    play(): void;
    pause(): void;
    toggleFullscreen(): void;
    zoom(amount: number): void;
    destroy(): void;
  }
}
