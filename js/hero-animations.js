(function () {
  "use strict";

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function splitHeroTitleWords(el) {
    if (!el || el.dataset.heroWordsDone) return;
    el.dataset.heroWordsDone = "1";

    var originalHTML = el.innerHTML;
    var parser = new DOMParser();
    var doc = parser.parseFromString("<div>" + originalHTML + "</div>", "text/html");
    var container = doc.body.firstChild;
    var walker = doc.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
    var textNodes = [];
    var node;

    while ((node = walker.nextNode())) textNodes.push(node);

    textNodes.forEach(function (textNode) {
      var text = textNode.nodeValue;
      if (!text || !text.trim()) return;

      var frag = doc.createDocumentFragment();
      var parts = text.split(/(\s+)/);

      parts.forEach(function (part) {
        if (/\s+/.test(part)) {
          frag.appendChild(doc.createTextNode(part));
        } else {
          var word = doc.createElement("span");
          word.className = "hero-word";
          word.textContent = part;
          frag.appendChild(word);
        }
      });

      textNode.parentNode.replaceChild(frag, textNode);
    });

    el.innerHTML = container.innerHTML;

    el.querySelectorAll(".hero-word").forEach(function (word, index) {
      word.style.setProperty("--hero-word-i", String(index));
    });
  }

  function initHeroAnimations() {
    document.querySelectorAll(".sec-hero").forEach(function (hero) {
      if (prefersReducedMotion()) {
        hero.classList.add("hero-enter--active", "hero-enter--reduced");
        return;
      }

      hero.querySelectorAll(".text-fade").forEach(splitHeroTitleWords);

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          hero.classList.add("hero-enter--active");
        });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeroAnimations);
  } else {
    initHeroAnimations();
  }
})();
