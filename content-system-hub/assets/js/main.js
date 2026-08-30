(function () {
  "use strict";

  /* Mobile nav toggle: morphs the hamburger glyph into a close (X) glyph
     so state indication (heuristic #1) doesn't rely on aria-expanded alone. */
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");
  var HAMBURGER_PATH = "M4 6h16M4 12h16M4 18h16";
  var CLOSE_PATH = "M6 6l12 12M18 6L6 18";
  if (nav && toggle) {
    var togglePath = toggle.querySelector("path");
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      toggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
      if (togglePath) {
        togglePath.setAttribute("d", isOpen ? CLOSE_PATH : HAMBURGER_PATH);
      }
    });
    document.querySelectorAll(".nav__links a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Открыть меню");
        if (togglePath) {
          togglePath.setAttribute("d", HAMBURGER_PATH);
        }
      });
    });
  }

  /* Scrollspy: highlights the nav link for the section currently in view.
     Recognition over recall - the reader always sees where they are. */
  var navLinks = document.querySelectorAll(".nav__links a[href^='#']");
  var spySections = Array.prototype.slice
    .call(navLinks)
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  if (navLinks.length && spySections.length) {
    var spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = "#" + entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.toggle("is-current", link.getAttribute("href") === id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    spySections.forEach(function (section) {
      spyObserver.observe(section);
    });
  }

  /* Scroll reveal: sequential stagger within each group, ~70ms apart.
     Purpose: storytelling - shows the pipeline as a sequence of stages. */
  var groups = document.querySelectorAll("[data-reveal-group]");
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -60px 0px" }
  );

  groups.forEach(function (group) {
    var items = group.querySelectorAll(".reveal");
    items.forEach(function (item, i) {
      item.style.transitionDelay = Math.min(i * 70, 280) + "ms";
      observer.observe(item);
    });
  });

  /* Pipeline connecting line: fills once the map scrolls into view. */
  var lineFill = document.querySelector(".pipeline-nodes__line-fill");
  if (lineFill) {
    var lineObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            lineFill.classList.add("is-visible");
            lineObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    lineObserver.observe(document.querySelector(".pipeline-nodes"));
  }
})();
