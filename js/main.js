/*
 * Fills the pages with values from site-config.js.
 * You should not need to edit this file — change site-config.js instead.
 *
 * Hooks used in the HTML:
 *   data-text="key"      -> element text is replaced with config[key]
 *   data-link="kind"     -> href is set (kind: shop, email, phone, whatsapp, instagram, facebook)
 *   data-requires="key"  -> element is hidden when config[key] is empty
 */
(function () {
  "use strict";

  var cfg = window.SITE_CONFIG || {};
  var FALLBACK_SHOP = "contact.html";

  function digits(s) {
    return String(s || "").replace(/\D/g, "");
  }

  var links = {
    shop: cfg.squareStoreUrl || FALLBACK_SHOP,
    email: cfg.email ? "mailto:" + cfg.email : "",
    phone: cfg.phone ? "tel:+" + digits(cfg.phone) : "",
    whatsapp: cfg.whatsapp
      ? "https://wa.me/" + digits(cfg.whatsapp) +
        (cfg.whatsappMessage ? "?text=" + encodeURIComponent(cfg.whatsappMessage) : "")
      : "",
    instagram: cfg.instagram ? "https://www.instagram.com/" + cfg.instagram.replace(/^@/, "") + "/" : "",
    facebook: cfg.facebookUrl || "",
    draping: cfg.drapingGuideUrl || ""
  };

  var text = Object.assign({}, cfg, {
    instagramHandle: cfg.instagram ? "@" + cfg.instagram.replace(/^@/, "") : "",
    year: String(new Date().getFullYear())
  });

  function isExternal(href) {
    return /^https?:\/\//.test(href);
  }

  function setLink(el, href) {
    el.setAttribute("href", href);
    if (isExternal(href)) {
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    }
  }

  function each(selector, fn) {
    Array.prototype.forEach.call(document.querySelectorAll(selector), fn);
  }

  /* ---- Simple text and links ---- */
  each("[data-text]", function (el) {
    var v = text[el.getAttribute("data-text")];
    if (typeof v === "string" && v) el.textContent = v;
  });

  each("[data-link]", function (el) {
    var href = links[el.getAttribute("data-link")];
    if (href) setLink(el, href);
  });

  each("[data-requires]", function (el) {
    var key = el.getAttribute("data-requires");
    var v = key === "squareStoreUrl" ? cfg.squareStoreUrl : (links[key] || cfg[key]);
    el.hidden = !v;
  });

  // Shop buttons say "opening soon" until the Square store URL is set.
  if (!cfg.squareStoreUrl) {
    each("[data-link='shop'][data-soon-label]", function (el) {
      el.textContent = el.getAttribute("data-soon-label");
    });
  }

  /* ---- Brand story paragraphs (About page) ---- */
  each("[data-story]", function (el) {
    if (!Array.isArray(cfg.story) || !cfg.story.length) return;
    el.textContent = "";
    cfg.story.forEach(function (para) {
      var p = document.createElement("p");
      p.textContent = para;
      el.appendChild(p);
    });
  });

  /* ---- Collection cards (Home page) ---- */
  var grid = document.getElementById("collections-grid");
  if (grid && Array.isArray(cfg.collections) && cfg.collections.length) {
    grid.textContent = "";
    cfg.collections.forEach(function (c) {
      var href = c.squareUrl || links.shop;

      var li = document.createElement("li");
      li.className = "card";

      var img = document.createElement("img");
      img.src = c.image;
      img.alt = c.imageAlt || "";
      img.width = 800;
      img.height = 1000;
      img.loading = "lazy";
      img.decoding = "async";

      var body = document.createElement("div");
      body.className = "card__body";

      var h3 = document.createElement("h3");
      h3.textContent = c.name;

      var p = document.createElement("p");
      p.textContent = c.description || "";

      var a = document.createElement("a");
      a.className = "btn btn--small";
      a.textContent = cfg.squareStoreUrl || c.squareUrl ? "Shop " + c.name : "Ask about " + c.name;
      a.setAttribute("aria-label", a.textContent);
      setLink(a, href);

      body.appendChild(h3);
      body.appendChild(p);
      body.appendChild(a);
      li.appendChild(img);
      li.appendChild(body);
      grid.appendChild(li);
    });
  }

  /* ---- Upcoming pop-ups & stalls (Home page) ---- */
  var eventsSection = document.getElementById("events");
  var eventsList = document.getElementById("events-list");
  if (eventsSection && eventsList) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var upcoming = (cfg.events || [])
      .map(function (e) {
        var parts = String(e.date || "").split("-").map(Number);
        return Object.assign({}, e, { when: new Date(parts[0], parts[1] - 1, parts[2]) });
      })
      .filter(function (e) { return !isNaN(e.when) && e.when >= today; })
      .sort(function (a, b) { return a.when - b.when; });

    if (!upcoming.length) {
      eventsSection.hidden = true;
    } else {
      eventsSection.hidden = false;
      eventsList.textContent = "";
      upcoming.forEach(function (e) {
        var li = document.createElement("li");
        li.className = "event";

        var time = document.createElement("time");
        time.className = "event__date";
        time.dateTime = e.date;
        var month = document.createElement("span");
        month.textContent = e.when.toLocaleDateString("en-US", { month: "short" });
        var day = document.createElement("strong");
        day.textContent = e.when.getDate();
        time.appendChild(month);
        time.appendChild(day);

        var info = document.createElement("div");
        var h3 = document.createElement("h3");
        h3.textContent = e.title;
        var meta = document.createElement("p");
        meta.className = "event__meta";
        meta.textContent = [
          e.when.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
          e.time,
          e.location
        ].filter(Boolean).join(" · ");
        info.appendChild(h3);
        info.appendChild(meta);
        if (e.details) {
          var d = document.createElement("p");
          d.textContent = e.details;
          info.appendChild(d);
        }
        if (e.link) {
          var a = document.createElement("a");
          a.textContent = "Event details";
          setLink(a, e.link);
          info.appendChild(a);
        }

        li.appendChild(time);
        li.appendChild(info);
        eventsList.appendChild(li);
      });
    }
  }

  /* ---- Mobile menu ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && nav.classList.contains("is-open")) {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        toggle.focus();
      }
    });
  }
})();
