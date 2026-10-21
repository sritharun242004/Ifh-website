/* IFH Connects — shared script
   1. Active nav link   2. Sticky header style   3. Mobile drawer
   4. FAQ accordion     5. Reveal on scroll */
(function () {
  "use strict";

  // 1. Mark the current page's link as active (aria-current="page")
  var file = location.pathname.replace(/\.html$/, "").replace(/\/$/, "") || "/";
  document.querySelectorAll("[data-nav]").forEach(function (a) {
    if (a.getAttribute("href") === file) a.setAttribute("aria-current", "page");
  });

  // 2. Header gets a background + shadow after scrolling 8px
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  }
  // Lime bar: plays a loading sweep, then tracks scroll progress
  var bar = document.querySelector(".scroll-progress");
  function onProgress() {
    if (!bar) return;
    var max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? Math.min(scrollY / max, 1) : 0) + ")";
  }
  if (bar) bar.addEventListener("animationend", function () { bar.classList.add("tracking"); onProgress(); });
  window.addEventListener("scroll", onProgress, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // 3. Mobile drawer: open, close (button, link click, Esc), lock body scroll
  var drawer = document.getElementById("drawer");
  var menuBtn = document.getElementById("menu-btn");
  var closeBtn = document.getElementById("drawer-close");
  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle("open", open);
    document.body.classList.toggle("no-scroll", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    drawer.setAttribute("aria-hidden", String(!open));
    if (open) closeBtn.focus(); else menuBtn.focus();
  }
  if (drawer && menuBtn) {
    menuBtn.addEventListener("click", function () { setDrawer(true); });
    closeBtn.addEventListener("click", function () { setDrawer(false); });
    drawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { drawer.classList.remove("open"); document.body.classList.remove("no-scroll"); menuBtn.setAttribute("aria-expanded", "false"); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("open")) setDrawer(false);
    });
    window.matchMedia("(min-width: 900px)").addEventListener("change", function (m) { if (m.matches) setDrawer(false); });
  }

  // 4. FAQ accordion — one open at a time, smooth height animation
  var questions = document.querySelectorAll(".faq-q");
  function toggle(btn, open) {
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    btn.setAttribute("aria-expanded", String(open));
    panel.style.height = open ? panel.scrollHeight + "px" : "0px";
  }
  questions.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var willOpen = btn.getAttribute("aria-expanded") !== "true";
      questions.forEach(function (other) { if (other.closest(".faq") === btn.closest(".faq")) toggle(other, false); });
      if (willOpen) toggle(btn, true);
    });
  });

  // 5. Reveal on scroll (fade + 16px rise, staggered for grid children)
  var items = document.querySelectorAll(".reveal");
  items.forEach(function (el) {
    var siblings = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
    el.style.setProperty("--i", Math.min(siblings, 8));
  });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }
})();
