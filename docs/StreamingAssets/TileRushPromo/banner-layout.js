(function () {
  "use strict";

  function start() {
    var root = document.documentElement;
    var banner = null;
    var bannerObserver = new MutationObserver(syncLayout);
    var sizeObserver = typeof ResizeObserver === "function"
      ? new ResizeObserver(syncLayout) : null;

    function syncLayout() {
      var current = document.getElementById("tilerush-install-banner");
      if (current !== banner) {
        bannerObserver.disconnect();
        if (sizeObserver && banner) sizeObserver.unobserve(banner);
        banner = current;
        if (banner) {
          bannerObserver.observe(banner, {
            attributes: true,
            attributeFilter: ["style", "class", "hidden"]
          });
          if (sizeObserver) sizeObserver.observe(banner);
        }
      }

      var visible = banner && getComputedStyle(banner).display !== "none";
      var height = visible ? Math.ceil(banner.getBoundingClientRect().height) : 0;
      root.style.setProperty("--tilerush-promo-height", height + "px");
      if (root.classList.contains("tilerush-promo-visible") !== (height > 0)) {
        root.classList.toggle("tilerush-promo-visible", height > 0);
      }
    }

    new MutationObserver(syncLayout).observe(document.body, { childList: true });
    new MutationObserver(syncLayout).observe(root, {
      attributes: true,
      attributeFilter: ["class"]
    });
    window.addEventListener("resize", syncLayout);
    if (window.visualViewport) window.visualViewport.addEventListener("resize", syncLayout);
    syncLayout();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
