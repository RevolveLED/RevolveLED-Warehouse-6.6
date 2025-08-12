/**
 * Include your custom JavaScript here.
 *
 * We also offer some hooks so you can plug your own logic. For instance, if you want to be notified when the variant
 * changes on product page, you can attach a listener to the document:
 *
 * document.addEventListener('variant:changed', function(event) {
 *   var variant = event.detail.variant; // Gives you access to the whole variant details
 * });
 *
 * You can also add a listener whenever a product is added to the cart:
 *
 * document.addEventListener('product:added', function(event) {
 *   var variant = event.detail.variant; // Get the variant that was added
 *   var quantity = event.detail.quantity; // Get the quantity that was added
 * });
 *
 * If you are an app developer and requires the theme to re-render the mini-cart, you can trigger your own event. If
 * you are adding a product, you need to trigger the "product:added" event, and make sure that you pass the quantity
 * that was added so the theme can properly update the quantity:
 *
 * document.documentElement.dispatchEvent(new CustomEvent('product:added', {
 *   bubbles: true,
 *   detail: {
 *     quantity: 1
 *   }
 * }));
 *
 * If you just want to force refresh the mini-cart without adding a specific product, you can trigger the event
 * "cart:refresh" in a similar way (in that case, passing the quantity is not necessary):
 *
 * document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
 *   bubbles: true
 * }));
 */

$(function () {
    // 统一处理 Filter Popup 显示/隐藏
    function toggleFilterPopup(show) {
        $('.filter-popup').toggle(show);
        $('.mobile-announcement.scroll').toggle(!show);
        $('header.header--inline').toggle(!show);
    }

    // 显示 Filter Popup
    $(document).on('click', '.show-filter-mb', function () {
        toggleFilterPopup(true);
    });

    // 隐藏 Filter Popup
    $(document).on('click', '.filter-by-mb svg', function () {
        toggleFilterPopup(false);
    });

    // Filter Item Title 折叠
    $(document).on('click', '.filter-item-title', function () {
        var $this = $(this);
        var $list = $this.next('.filter-item-list');
        $this.attr('aria-expanded', $list.is(':hidden') ? 'true' : 'false');
        $list.stop(true, true).slideToggle();
    });

    // 响应式 Filterboxx 折叠
    const mediaQuery = window.matchMedia('(max-width: 1014px)');

    function handleFilterboxClick(enable) {
        if (enable) {
            $(document).on('click.filterbox', '.filterboxxtop', function () {
                $(this).next('.filterboxx').stop(true, true).slideToggle();
                var $toggle = $(this).find('.tag-toggle');
                $toggle.text($toggle.text().trim() === '+' ? '—' : '+');
            });
        } else {
            $(document).off('click.filterbox', '.filterboxxtop');
            $('.filterboxx').show();
            $('.tag-toggle').text('—');
        }
    }

    // 初始化
    handleFilterboxClick(mediaQuery.matches);

    // 监听宽度变化
    mediaQuery.addEventListener('change', function (e) {
        handleFilterboxClick(e.matches);
    });

    // #tidochat 移除z-index
    // $('#tidio-chat').css('z-index', '');
});