(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --------------------------------------------------------------------
     Scroll reveal: IntersectionObserver, no scroll listener.
     Stagger index is scoped per parent so distant sections don't inherit
     a huge cumulative delay, capped at 5 so long lists don't crawl in.
     -------------------------------------------------------------------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  var groupCounts = new Map();

  revealEls.forEach(function (el) {
    var parent = el.parentElement;
    var index = groupCounts.get(parent) || 0;
    groupCounts.set(parent, index + 1);
    el.style.setProperty("--reveal-index", Math.min(index, 5));
  });

  if (reduceMotion) {
    revealEls.forEach(function (el) {
      el.classList.add("is-in");
    });
  } else if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-in");
    });
  }

  /* --------------------------------------------------------------------
     Testimonials: scroll-snap strip, prev/next just scroll by one card.
     -------------------------------------------------------------------- */
  var track = document.querySelector("[data-testi-track]");
  if (track) {
    var prevBtn = document.querySelector("[data-testi-prev]");
    var nextBtn = document.querySelector("[data-testi-next]");
    var step = function () {
      var card = track.querySelector(".testi-card");
      return card ? card.getBoundingClientRect().width + 20 : 340;
    };
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        track.scrollBy({ left: -step(), behavior: reduceMotion ? "auto" : "smooth" });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        track.scrollBy({ left: step(), behavior: reduceMotion ? "auto" : "smooth" });
      });
    }
  }

  /* --------------------------------------------------------------------
     Consultation form: client-side only. No backend is wired up yet,
     this simulates the request/success cycle so the UI states are real.
     Wire the fetch call to the actual CRM/webhook before going live.
     -------------------------------------------------------------------- */
  var form = document.querySelector("[data-consult-form]");
  if (form) {
    var submitBtn = form.querySelector("[data-submit-btn]");
    var submitLabel = submitBtn ? submitBtn.textContent : "";

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var valid = true;
      var requiredFields = form.querySelectorAll("[data-required]");
      requiredFields.forEach(function (input) {
        var field = input.closest(".field");
        var isEmpty = !input.value || !input.value.trim();
        if (field) {
          field.classList.toggle("has-error", isEmpty);
        }
        if (isEmpty) {
          valid = false;
        }
      });

      if (!valid) {
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Отправляем...";

      window.setTimeout(function () {
        form.closest(".consult-form").classList.add("is-submitted");
        submitBtn.disabled = false;
        submitBtn.textContent = submitLabel;
      }, 700);
    });

    form.querySelectorAll("[data-required]").forEach(function (input) {
      input.addEventListener("input", function () {
        var field = input.closest(".field");
        if (field && input.value.trim()) {
          field.classList.remove("has-error");
        }
      });
    });
  }

  /* --------------------------------------------------------------------
     Footer year.
     -------------------------------------------------------------------- */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
