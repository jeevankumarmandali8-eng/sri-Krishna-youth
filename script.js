/* =========================================================
   SHANTI NAGAR MANDAL — Ganesh Chaturthi
   script.js
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     NAVIGATION: sticky translucency + mobile hamburger
  --------------------------------------------------------- */
  var nav = document.getElementById("siteNav");
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  function onScrollNav() {
    if (window.scrollY > 40) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  navToggle.addEventListener("click", function () {
    var isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  var navLinkEls = document.querySelectorAll(".nav-link");
  navLinkEls.forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* Highlight active nav link based on section in view */
  var sections = ["home", "about", "committee", "celebrations", "gallery"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  function onScrollActive() {
    var scrollPos = window.scrollY + 140;
    var current = sections[0];
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) current = sec;
    });
    navLinkEls.forEach(function (link) {
      link.classList.toggle("active-link", link.getAttribute("href") === "#" + current.id);
    });
  }
  window.addEventListener("scroll", onScrollActive, { passive: true });
  onScrollActive();

  /* ---------------------------------------------------------
     HERO DECORATION: floating petals + golden particles
  --------------------------------------------------------- */
  function spawnField(containerId, count, factory) {
    var container = document.getElementById(containerId);
    if (!container) return;
    if (reduceMotion) return; // respect reduced motion: skip decorative animation
    for (var i = 0; i < count; i++) {
      container.appendChild(factory(i));
    }
  }

  const ganeshaImages = [
    "image1.png",
    "image2.png",
    "image3.png"
];

const heroGanesha = document.querySelector(".hero-ganesha");

if (heroGanesha) {
    const randomIndex = Math.floor(Math.random() * ganeshaImages.length);
    heroGanesha.src = ganeshaImages[randomIndex];
}
  spawnField("petalField", 10, function () {
    var el = document.createElement("span");
    el.className = "petal";
    var left = Math.random() * 100;
    var duration = 9 + Math.random() * 8;
    var delay = Math.random() * 10;
    var size = 8 + Math.random() * 10;
    el.style.left = left + "%";
    el.style.width = size + "px";
    el.style.height = size + "px";
    el.style.animationDuration = duration + "s";
    el.style.animationDelay = delay + "s";
    return el;
  });

  spawnField("particleField", 26, function () {
    var el = document.createElement("span");
    el.className = "spark";
    el.style.left = Math.random() * 100 + "%";
    el.style.top = Math.random() * 100 + "%";
    el.style.animationDuration = (2.5 + Math.random() * 3) + "s";
    el.style.animationDelay = Math.random() * 3 + "s";
    return el;
  });

  spawnField("closingParticles", 18, function () {
    var el = document.createElement("span");
    el.className = "spark";
    el.style.left = Math.random() * 100 + "%";
    el.style.top = Math.random() * 100 + "%";
    el.style.animationDuration = (2.5 + Math.random() * 3) + "s";
    el.style.animationDelay = Math.random() * 3 + "s";
    return el;
  });

  /* ---------------------------------------------------------
     SCROLL REVEAL
  --------------------------------------------------------- */
  var revealTargets = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------------------------------------------------------
     GALLERY DATA
     Replace the "tint" pair or swap in real <img> markup once
     community photos are available — see README notes below.
  --------------------------------------------------------- */
  var galleryData = {
    2026: [
      { caption: "Ganesh Sthapana morning", tint: ["#F97316", "#7C2D12"], span: 34 },
      { caption: "Evening aarti", tint: ["#FBBF24", "#EA580C"], span: 22 },
      { caption: "Kids' rangoli contest", tint: ["#FACC15", "#F97316"], span: 28 },
      { caption: "Cultural night performance", tint: ["#EA580C", "#7C2D12"], span: 30 },
      { caption: "Community dinner", tint: ["#7C2D12", "#FBBF24"], span: 24 },
      { caption: "Bhajan sandhya", tint: ["#F97316", "#FACC15"], span: 26 },
      { caption: "Decorated mandap", tint: ["#FBBF24", "#7C2D12"], span: 32 },
      { caption: "Visarjan procession", tint: ["#EA580C", "#FACC15"], span: 22 }
    ],
    2025: [
      { caption: "Idol arrival celebration", tint: ["#7C2D12", "#F97316"], span: 26 },
      { caption: "Morning puja", tint: ["#FBBF24", "#F97316"], span: 30 },
      { caption: "Dance performance", tint: ["#F97316", "#EA580C"], span: 24 },
      { caption: "Annadanam seva", tint: ["#FACC15", "#7C2D12"], span: 22 },
      { caption: "Youth committee volunteers", tint: ["#EA580C", "#FBBF24"], span: 28 },
      { caption: "Diya decoration", tint: ["#7C2D12", "#FACC15"], span: 32 }
    ]
  };

  var galleryGrid = document.getElementById("galleryGrid");
  var tabs = document.querySelectorAll(".gallery-tab");
  var activeYear = "2026";
  var activeImages = [];
  var activeIndex = 0;

  function renderGallery(year) {
    activeYear = year;
    activeImages = galleryData[year] || [];
    galleryGrid.innerHTML = "";
    activeImages.forEach(function (item, idx) {
      var el = document.createElement("figure");
      el.className = "gallery-item reveal is-visible";
      el.style.setProperty("--rowspan", item.span);
      el.style.setProperty("--c1", item.tint[0]);
      el.style.setProperty("--c2", item.tint[1]);
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      el.setAttribute("aria-label", "View photo: " + item.caption);
      el.innerHTML =
        '<div class="gi-fill">' +
          '<span class="gi-icon" aria-hidden="true">⛶</span>' +
          '<figcaption class="gi-caption">' + item.caption + "</figcaption>" +
        "</div>";
      el.addEventListener("click", function () { openLightbox(idx); });
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(idx); }
      });
      galleryGrid.appendChild(el);
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      renderGallery(tab.dataset.year);
    });
  });

  renderGallery(activeYear);

  /* ---------------------------------------------------------
     LIGHTBOX
  --------------------------------------------------------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImage = document.getElementById("lightboxImage");
  var lightboxCaption = document.getElementById("lightboxCaption");
  var lightboxClose = document.getElementById("lightboxClose");
  var lightboxPrev = document.getElementById("lightboxPrev");
  var lightboxNext = document.getElementById("lightboxNext");

  function openLightbox(index) {
    activeIndex = index;
    updateLightbox();
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function updateLightbox() {
    var item = activeImages[activeIndex];
    if (!item) return;
    lightboxImage.style.setProperty("--c1", item.tint[0]);
    lightboxImage.style.setProperty("--c2", item.tint[1]);
    lightboxCaption.textContent = item.caption + " — " + activeYear;
  }

  function nextImage() {
    activeIndex = (activeIndex + 1) % activeImages.length;
    updateLightbox();
  }
  function prevImage() {
    activeIndex = (activeIndex - 1 + activeImages.length) % activeImages.length;
    updateLightbox();
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxNext.addEventListener("click", nextImage);
  lightboxPrev.addEventListener("click", prevImage);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
  });

  /* ---------------------------------------------------------
     "Explore Our Celebrations" button — smooth scroll
  --------------------------------------------------------- */
  var exploreBtn = document.getElementById("exploreBtn");
  if (exploreBtn) {
    exploreBtn.addEventListener("click", function (e) {
      var target = document.querySelector(exploreBtn.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
    });
  }
})();
