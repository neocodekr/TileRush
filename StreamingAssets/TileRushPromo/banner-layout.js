(function () {
  "use strict";

  function start() {
    var root = document.documentElement;
    var banner = null;
    var gameFrame = null;
    var bannerObserver = new MutationObserver(syncLayout);
    var sizeObserver = typeof ResizeObserver === "function"
      ? new ResizeObserver(syncLayout) : null;

    function syncLayout() {
      var currentFrame = document.getElementById("unity-fullscreen-container");
      if (currentFrame !== gameFrame) {
        if (sizeObserver && gameFrame) sizeObserver.unobserve(gameFrame);
        gameFrame = currentFrame;
        if (sizeObserver && gameFrame) sizeObserver.observe(gameFrame);
      }
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

      if (banner && gameFrame) {
        var frame = gameFrame.getBoundingClientRect();
        var left = Math.round(frame.left) + "px";
        var width = Math.round(frame.width) + "px";
        if (banner.style.left !== left) banner.style.left = left;
        if (banner.style.width !== width) banner.style.width = width;
        if (banner.style.right !== "auto") banner.style.right = "auto";
      }

      var visible = banner && getComputedStyle(banner).display !== "none";
      var height = visible ? Math.ceil(banner.getBoundingClientRect().height) : 0;
      var heightChanged = root.style.getPropertyValue("--tilerush-promo-height") !== height + "px";
      if (heightChanged) root.style.setProperty("--tilerush-promo-height", height + "px");
      if (root.classList.contains("tilerush-promo-visible") !== (height > 0)) {
        root.classList.toggle("tilerush-promo-visible", height > 0);
      }
      if (heightChanged) {
        // Unity must recalculate its canvas after CSS reserves the banner space.
        requestAnimationFrame(function () { window.dispatchEvent(new Event("resize")); });
      }
    }

    new MutationObserver(syncLayout).observe(document.body, { childList: true });
    new MutationObserver(syncLayout).observe(root, {
      attributes: true,
      attributeFilter: ["class"]
    });
    window.addEventListener("resize", syncLayout);
    if (window.visualViewport) window.visualViewport.addEventListener("resize", syncLayout);
    window.tileRushSyncPromoLayout = syncLayout;
    syncLayout();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
