(function () {
  "use strict";

  /* Mobile nav toggle */
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");
  if (nav && toggle) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    document.querySelectorAll(".nav__links a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
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
