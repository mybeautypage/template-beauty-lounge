(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var busyClass = "read--busy";
    var expandedClass = "read--open";
    var ctaSelector =
      "a.btn-primary, a.svc-link, a.btn-ghost, " +
      "a.nav__cta, .btn-wrap a";

    function getPanel(container) {
      return container.querySelector(".read__panel");
    }

    function syncCardAria(container) {
      var card = container.closest(".read--expand");
      if (!card) return;
      var hidden = container.querySelector(".read__hidden");
      var expanded = hidden && hidden.classList.contains(expandedClass);
      card.setAttribute("aria-expanded", expanded ? "true" : "false");
    }

    function setExpanded(container, expanded) {
      var panel = getPanel(container);
      var hidden = container.querySelector(".read__hidden");
      var btn = container.querySelector(".read__toggle");
      var dots = container.querySelector(".read__dots");
      if (!hidden || !btn) return;

      if (expanded) {
        if (dots) dots.style.display = "none";
        hidden.classList.add(expandedClass);
        if (panel) panel.classList.add(expandedClass);
        btn.textContent = btn.getAttribute("data-less") || "Weniger anzeigen";
        btn.setAttribute("aria-expanded", "true");
        syncCardAria(container);
        return;
      }

      hidden.classList.remove(expandedClass);
      if (panel) panel.classList.remove(expandedClass);
      btn.textContent = btn.getAttribute("data-more") || "Mehr anzeigen";
      btn.setAttribute("aria-expanded", "false");
      if (dots) dots.style.display = "";
      syncCardAria(container);
    }

    function collapseWidget(container, instant) {
      var hidden = container.querySelector(".read__hidden");
      if (!hidden || !hidden.classList.contains(expandedClass)) return;

      if (instant || reduced) {
        setExpanded(container, false);
        container.classList.remove(busyClass);
        return;
      }

      container.classList.add(busyClass);
      setExpanded(container, false);
      window.setTimeout(function () {
        container.classList.remove(busyClass);
      }, 560);
    }

    function expandWidget(container) {
      var hidden = container.querySelector(".read__hidden");
      if (!hidden || hidden.classList.contains(expandedClass)) return;

      document.querySelectorAll(".read").forEach(function (other) {
        if (other !== container) collapseWidget(other, reduced);
      });

      if (reduced) {
        setExpanded(container, true);
        return;
      }

      container.classList.add(busyClass);
      setExpanded(container, true);
      window.setTimeout(function () {
        container.classList.remove(busyClass);
      }, 560);
    }

    document.querySelectorAll(".read, .rm-widget-container").forEach(function (container) {
      var btn = container.querySelector(".read__toggle, .rm-toggle-btn");
      var hidden = container.querySelector(".read__hidden, .rm-hidden-text");
      if (!btn || !hidden) return;

      btn.setAttribute("role", "button");
      btn.setAttribute("tabindex", "0");
      btn.setAttribute("aria-expanded", "false");

      function toggle() {
        if (hidden.classList.contains(expandedClass)) {
          collapseWidget(container, false);
        } else {
          expandWidget(container);
        }
      }

      btn.addEventListener("click", function (event) {
        event.stopPropagation();
        toggle();
      });
      btn.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          toggle();
        }
      });

      // Clicking anywhere on the visible text area also toggles
      var content = container.querySelector(".read__content");
      if (content) {
        content.style.cursor = "pointer";
        content.addEventListener("click", function (event) {
          if (event.target.closest(".read__toggle")) return;
          if (event.target.closest("a[href], button")) return;
          event.stopPropagation();
          toggle();
        });
      }
    });

    document.querySelectorAll(".card-hover, .svc-card").forEach(function (card) {
      var rm = card.querySelector(".read, .rm-widget-container");
      if (!rm || !rm.querySelector(".read__toggle, .rm-toggle-btn")) return;
      if (card.querySelector(ctaSelector)) return;

      card.classList.add("read--expand");
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-expanded", "false");

      function toggleFromCard() {
        var hidden = rm.querySelector(".read__hidden, .rm-hidden-text");
        if (!hidden) return;
        if (hidden.classList.contains(expandedClass)) {
          collapseWidget(rm, false);
        } else {
          expandWidget(rm);
        }
      }

      card.addEventListener("click", function (event) {
        if (event.target.closest(".read__toggle, .rm-toggle-btn")) return;
        if (event.target.closest("a[href], button, input, select, textarea, label")) return;
        toggleFromCard();
      });

      card.addEventListener("keydown", function (event) {
        if (event.target !== card) return;
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        toggleFromCard();
      });
    });
  });
})();
