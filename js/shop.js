/*
 * Shop page, item pages and the home page "New arrivals" strip.
 * Items come from data/products.json, which scripts/build_shop.py builds from Square.
 * You should not need to edit this file — change site-config.js or Square instead.
 */
(function () {
  "use strict";

  var cfg = window.SITE_CONFIG || {};

  function digits(s) {
    return String(s || "").replace(/\D/g, "");
  }

  function slugify(s) {
    return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function el(tag, className, text) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (text != null) e.textContent = text;
    return e;
  }

  function setLink(a, href) {
    a.setAttribute("href", href);
    if (/^https?:\/\//.test(href)) {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
    }
  }

  function dollars(cents) {
    return "$" + (cents / 100).toLocaleString("en-US", {
      minimumFractionDigits: cents % 100 ? 2 : 0,
      maximumFractionDigits: 2
    });
  }

  function priceLabel(p) {
    if (p.price == null) return "Ask for price";
    return (p.priceMax !== p.price ? "From " : "") + dollars(p.price);
  }

  // Each collection's Square category ID is the last part of its squareUrl.
  var collections = (cfg.collections || []).map(function (c) {
    var m = String(c.squareUrl || "").match(/\/([A-Z0-9]{20,})\/?$/);
    return Object.assign({}, c, {
      slug: slugify(c.name),
      categoryId: c.squareCategoryId || (m ? m[1] : "")
    });
  });

  function collectionOf(categoryIds) {
    for (var i = 0; i < collections.length; i++) {
      if (categoryIds.indexOf(collections[i].categoryId) !== -1) return collections[i];
    }
    return null;
  }

  function whatsappLink(message) {
    if (!cfg.whatsapp) return "";
    return "https://wa.me/" + digits(cfg.whatsapp) + "?text=" + encodeURIComponent(message);
  }

  function askLink(name, url) {
    var msg = "Hi Vastram Collections! I'm interested in \"" + name + "\": " + url;
    return whatsappLink(msg) ||
      (cfg.email ? "mailto:" + cfg.email + "?subject=" + encodeURIComponent("Question about " + name) +
        "&body=" + encodeURIComponent(msg) : "/contact.html");
  }

  function loadCatalog() {
    return fetch("/data/products.json", { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : { products: [] }; })
      .then(function (d) { return d.products || []; })
      .catch(function () { return []; });
  }

  /* ---- Product card ---- */
  function productCard(p) {
    var li = el("li", "product-card" + (p.available ? "" : " is-sold-out"));
    var a = el("a");
    a.href = p.url;

    var media = el("div", "product-card__media");
    var img = el("img");
    img.src = p.images[0] || "/images/og-image.jpg";
    img.alt = p.name;
    img.width = 800;
    img.height = 1000;
    img.loading = "lazy";
    img.decoding = "async";
    media.appendChild(img);
    if (p.images[1]) {
      var alt = el("img", "product-card__alt");
      alt.src = p.images[1];
      alt.alt = "";
      alt.loading = "lazy";
      alt.decoding = "async";
      media.appendChild(alt);
    }
    if (!p.available) media.appendChild(el("span", "badge badge--out", "Sold out"));

    var body = el("div", "product-card__body");
    if (p.category) body.appendChild(el("span", "product-card__cat", p.category));
    body.appendChild(el("h3", null, p.name));
    body.appendChild(el("p", "product-card__price", priceLabel(p)));

    a.appendChild(media);
    a.appendChild(body);
    li.appendChild(a);
    return li;
  }

  function fill(list, products) {
    list.textContent = "";
    products.forEach(function (p) { list.appendChild(productCard(p)); });
  }

  /* ---- Shop page ---- */
  function initShop(products) {
    var grid = document.getElementById("shop-grid");
    if (!grid) return;

    var chips = document.getElementById("shop-filters");
    var sortSelect = document.getElementById("shop-sort");
    var soldToggle = document.getElementById("shop-sold");
    var count = document.getElementById("shop-count");
    var empty = document.getElementById("shop-empty");
    var noMatch = document.getElementById("shop-nomatch");
    var title = document.getElementById("shop-title");
    var intro = document.getElementById("shop-intro");
    var defaultTitle = title.textContent;
    var defaultIntro = intro.textContent;

    var params = new URLSearchParams(location.search);
    var state = {
      c: params.get("c") || "",
      sort: params.get("sort") || "new",
      sold: params.get("sold") !== "0"
    };

    // Before Square is connected: point shoppers to the Square store instead.
    if (!products.length) {
      document.getElementById("shop-tools").hidden = true;
      empty.hidden = false;
      var links = document.getElementById("shop-empty-links");
      collections.forEach(function (c) {
        var li = el("li");
        var a = el("a", "btn btn--outline btn--small", c.name);
        setLink(a, c.squareUrl || cfg.squareStoreUrl || "/contact.html");
        li.appendChild(a);
        links.appendChild(li);
      });
      return;
    }

    var visible = collections.filter(function (c) {
      return products.some(function (p) { return p.categoryIds.indexOf(c.categoryId) !== -1; });
    });
    [{ slug: "", name: "All" }].concat(visible).forEach(function (c) {
      var b = el("button", "chip", c.name);
      b.type = "button";
      b.setAttribute("data-c", c.slug);
      b.addEventListener("click", function () {
        state.c = c.slug;
        render();
      });
      chips.appendChild(b);
    });

    sortSelect.value = state.sort;
    soldToggle.checked = state.sold;
    sortSelect.addEventListener("change", function () { state.sort = sortSelect.value; render(); });
    soldToggle.addEventListener("change", function () { state.sold = soldToggle.checked; render(); });

    function render() {
      var current = collections.filter(function (c) { return c.slug === state.c; })[0] || null;
      if (!current) state.c = "";

      Array.prototype.forEach.call(chips.children, function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-c") === state.c));
      });
      title.textContent = current ? current.name : defaultTitle;
      intro.textContent = current ? current.description : defaultIntro;
      document.title = (current ? current.name : defaultTitle) + " | Vastram Collections";

      var list = products.filter(function (p) {
        return (!current || p.categoryIds.indexOf(current.categoryId) !== -1) &&
          (state.sold || p.available);
      });
      var price = function (p) { return p.price == null ? Infinity : p.price; };
      list.sort(function (a, b) {
        if (a.available !== b.available) return a.available ? -1 : 1;
        if (state.sort === "low") return price(a) - price(b);
        if (state.sort === "high") return price(b) - price(a);
        return a.createdAt < b.createdAt ? 1 : -1;
      });

      fill(grid, list);
      noMatch.hidden = list.length > 0;
      count.textContent = list.length + (list.length === 1 ? " piece" : " pieces");

      var q = new URLSearchParams();
      if (state.c) q.set("c", state.c);
      if (state.sort !== "new") q.set("sort", state.sort);
      if (!state.sold) q.set("sold", "0");
      var qs = q.toString();
      history.replaceState(null, "", location.pathname + (qs ? "?" + qs : ""));
    }

    render();
  }

  /* ---- Home page: new arrivals ---- */
  function initNewArrivals(products) {
    var grid = document.getElementById("new-arrivals-grid");
    if (!grid) return;
    var fresh = products.filter(function (p) { return p.available; }).slice(0, 8);
    if (!fresh.length) return;
    fill(grid, fresh);
    document.getElementById("new-arrivals").hidden = false;
  }

  /* ---- Item page ---- */
  function initProduct(products) {
    var article = document.querySelector(".product");
    if (!article) return;

    var ids = (article.getAttribute("data-category-ids") || "").split(" ").filter(Boolean);
    var collection = collectionOf(ids);
    var soldOut = article.getAttribute("data-sold-out") === "true";
    var name = article.querySelector("h1").textContent;
    var pageUrl = location.origin + location.pathname;

    // Photo gallery
    var main = article.querySelector(".gallery__main");
    Array.prototype.forEach.call(article.querySelectorAll(".gallery__thumbs button"), function (b, i, all) {
      b.addEventListener("click", function () {
        main.src = b.getAttribute("data-src");
        Array.prototype.forEach.call(all, function (x) { x.removeAttribute("aria-current"); });
        b.setAttribute("aria-current", "true");
      });
    });

    if (collection) {
      var crumb = document.querySelector("[data-category-link]");
      if (crumb) crumb.href = "/shop.html?c=" + collection.slug;
      var note = document.querySelector("[data-collection-note]");
      var noBlouse = article.getAttribute("data-no-blouse") === "true";
      if (note && (noBlouse || collection.productNote)) {
        note.textContent = noBlouse ? "Comes without a stitched blouse." : collection.productNote;
        note.hidden = false;
      }
    }

    // Buy: the item's own Square page, else its Square category, else the Square store.
    var buy = article.querySelector("[data-buy]");
    var ask = article.querySelector("[data-ask]");
    if (soldOut) {
      buy.textContent = "Sold out · Ask about similar pieces";
      buy.classList.remove("btn--gold");
      setLink(buy, askLink(name, pageUrl));
      ask.hidden = true;
    } else {
      var href = buy.getAttribute("data-buy") || (collection && collection.squareUrl) ||
        cfg.squareStoreUrl || "/contact.html";
      setLink(buy, href);
      if (cfg.whatsapp) {
        setLink(ask, askLink(name, pageUrl));
        ask.hidden = false;
      }
    }

    // You may also like: other available pieces from the same collection first.
    var self = location.pathname.replace(/index\.html$/, "");
    var others = products.filter(function (p) { return p.available && p.url !== self; });
    var same = others.filter(function (p) {
      return collection && p.categoryIds.indexOf(collection.categoryId) !== -1;
    });
    var related = same.concat(others.filter(function (p) { return same.indexOf(p) === -1; })).slice(0, 4);
    if (related.length) {
      fill(document.getElementById("related-grid"), related);
      document.getElementById("related").hidden = false;
    }
  }

  if (!document.getElementById("shop-grid") && !document.getElementById("new-arrivals-grid") &&
      !document.querySelector(".product")) return;

  loadCatalog().then(function (products) {
    initShop(products);
    initNewArrivals(products);
    initProduct(products);
  });
})();
