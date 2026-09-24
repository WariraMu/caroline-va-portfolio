(function () {
  "use strict";

  /* Header border on scroll */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Lightbox */
  var dialog = document.getElementById("lightbox");
  var triggers = Array.prototype.slice.call(document.querySelectorAll(".shot-btn"));
  if (!dialog || !triggers.length) return;

  var img = dialog.querySelector(".lb-img");
  var caption = dialog.querySelector(".lb-caption");
  var count = dialog.querySelector(".lb-count");
  var current = 0;
  var lastTrigger = null;

  var items = triggers.map(function (btn) {
    var thumb = btn.querySelector("img");
    var title = btn.closest("figure").querySelector("figcaption strong");
    return {
      src: thumb.getAttribute("src"),
      alt: thumb.getAttribute("alt"),
      title: title ? title.textContent : ""
    };
  });

  function show(i) {
    current = (i + items.length) % items.length;
    var item = items[current];
    img.src = item.src;
    img.alt = item.alt;
    caption.textContent = item.title;
    count.textContent = (current + 1) + " / " + items.length;
    var stage = dialog.querySelector(".lb-stage");
    if (stage) stage.scrollLeft = 0;
  }

  function open(i, trigger) {
    lastTrigger = trigger || null;
    show(i);
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    document.body.style.overflow = "hidden";
    var closeBtn = dialog.querySelector(".lb-close");
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  dialog.addEventListener("close", function () {
    document.body.style.overflow = "";
    if (lastTrigger) lastTrigger.focus();
  });

  triggers.forEach(function (btn, i) {
    btn.addEventListener("click", function () { open(i, btn); });
  });

  dialog.addEventListener("click", function (e) {
    var action = e.target.getAttribute && e.target.getAttribute("data-lb");
    if (action === "prev") show(current - 1);
    else if (action === "next") show(current + 1);
    else if (action === "close") close();
    else if (e.target.classList.contains("lb-stage") || e.target === dialog) close();
  });

  dialog.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { e.preventDefault(); show(current - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); show(current + 1); }
  });
})();
