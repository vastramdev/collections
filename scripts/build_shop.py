#!/usr/bin/env python3
"""
Builds the online shop from your Square catalog.

Reads every item, photo, price and stock count from Square, then writes:
  data/products.json         -> used by the Shop page and "New arrivals"
  products/<name>/index.html -> one page per item (good for Google and WhatsApp previews)
  sitemap.xml                -> so Google finds every item

GitHub runs this every hour (see .github/workflows/deploy.yml), so the site
follows your Square inventory automatically. You don't need to run it yourself.

Local preview with made-up items:
  python3 scripts/build_shop.py --sample
  python3 -m http.server 8000

Local run against your real Square catalog:
  SQUARE_ACCESS_TOKEN=... python3 scripts/build_shop.py
"""
import html
import json
import os
import re
import shutil
import sys
import urllib.error
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE_URL = "https://vastramusa.com"
SQUARE_API = "https://connect.squareup.com/v2"
SQUARE_VERSION = "2025-01-23"

STATIC_PAGES = ["", "shop.html", "about.html", "care.html", "faq.html", "contact.html"]


# ---------------------------------------------------------------- Square API

def square(method, path, token, body=None):
    req = urllib.request.Request(
        SQUARE_API + path,
        method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={
            "Authorization": "Bearer " + token,
            "Square-Version": SQUARE_VERSION,
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as e:
        detail = e.read().decode(errors="replace")
        sys.exit("Square API error %s on %s: %s" % (e.code, path, detail))


def fetch_catalog(token):
    objects, cursor = [], None
    while True:
        q = "/catalog/list?types=ITEM,IMAGE,CATEGORY" + ("&cursor=" + cursor if cursor else "")
        page = square("GET", q, token)
        objects += page.get("objects", [])
        cursor = page.get("cursor")
        if not cursor:
            return objects


def fetch_stock(token, variation_ids):
    """Returns {variation_id: in-stock quantity summed over all locations}."""
    stock = {}
    for i in range(0, len(variation_ids), 500):
        body = {"catalog_object_ids": variation_ids[i:i + 500], "states": ["IN_STOCK"]}
        while True:
            page = square("POST", "/inventory/counts/batch-retrieve", token, body)
            for c in page.get("counts", []):
                vid = c["catalog_object_id"]
                stock[vid] = stock.get(vid, 0) + float(c.get("quantity") or 0)
            if not page.get("cursor"):
                break
            body["cursor"] = page["cursor"]
    return stock


# ---------------------------------------------------------------- Catalog -> products

def slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-") or "item"


def paragraphs(text):
    return [p.strip() for p in re.split(r"\n\s*\n|\r\n\s*\r\n", text or "") if p.strip()]


def money(m):
    return m.get("amount") if m else None


def build_products(objects, stock):
    images = {o["id"]: o["image_data"]["url"] for o in objects
              if o["type"] == "IMAGE" and o.get("image_data", {}).get("url")}
    categories = {o["id"]: o.get("category_data", {}) for o in objects if o["type"] == "CATEGORY"}

    products, used_slugs = [], set()
    for o in objects:
        if o["type"] != "ITEM" or o.get("is_deleted"):
            continue
        d = o.get("item_data", {})
        if d.get("is_archived") or d.get("ecom_visibility") == "HIDDEN":
            continue
        if d.get("product_type") not in (None, "REGULAR"):
            continue

        variations = []
        for v in d.get("variations", []):
            vd = v.get("item_variation_data", {})
            if vd.get("sellable") is False:
                continue
            tracked = vd.get("track_inventory", False) or v["id"] in stock
            qty = int(stock.get(v["id"], 0)) if tracked else None
            variations.append({
                "name": vd.get("name") or "",
                "price": money(vd.get("price_money")),
                "available": qty is None or qty > 0,
                "quantity": qty,
            })
        if not variations:
            continue

        cat_ids = [c["id"] for c in d.get("categories", []) if c.get("id") in categories]
        if not cat_ids and d.get("category_id") in categories:
            cat_ids = [d["category_id"]]
        # Show the most specific category (e.g. "Silk Sarees" rather than "Sarees").
        leaf = next((c for c in cat_ids if not categories[c].get("is_top_level", True)), None)
        leaf = leaf or (cat_ids[0] if cat_ids else None)

        slug = slugify(d.get("name", ""))
        if slug in used_slugs:
            slug += "-" + o["id"][-6:].lower()
        used_slugs.add(slug)

        prices = [v["price"] for v in variations if v["price"] is not None]
        in_stock = [v for v in variations if v["available"]]
        quantities = [v["quantity"] for v in in_stock]
        products.append({
            "id": o["id"],
            "slug": slug,
            "url": "/products/%s/" % slug,
            "name": d.get("name", "").strip(),
            "description": paragraphs(d.get("description_plain") or d.get("description")),
            "category": categories[leaf].get("name", "") if leaf else "",
            "categoryIds": cat_ids,
            "price": min(prices) if prices else None,
            "priceMax": max(prices) if prices else None,
            "images": [images[i] for i in d.get("image_ids", []) if i in images],
            "available": bool(in_stock),
            "quantity": None if None in quantities else sum(quantities),
            "variations": variations if len(variations) > 1 else [],
            "squareUrl": d.get("ecom_uri") or "",
            "createdAt": o.get("created_at") or o.get("updated_at") or "",
        })

    products.sort(key=lambda p: p["createdAt"], reverse=True)
    return products


def sample_products():
    """Made-up items for previewing the design before Square is connected."""
    cats = {
        "silk": "EMB3WMXEXNX32VGND4QKDD27", "soft": "CA4C6P63QZF4DARALWMONTVD",
        "banarasi": "GIT67QA3TM2V6HSCLSQM4QQ6", "cotton": "2EOOSOFPVNGTQ5IGWRMBTURX",
        "half": "BQ7RB32CPGR4DJZDY5HVRVJG", "men": "LI43L7DGUOBH4N2UJVWQXNU2",
    }
    names = {"silk": "Silk Sarees", "soft": "Soft Silk Sarees", "banarasi": "Banarasi Silk Sarees",
             "cotton": "Silk Cotton Sarees", "half": "Half Sarees", "men": "Men"}
    rows = [
        ("Maroon Kanjivaram Silk with Gold Zari Border", "silk", 34900, 1, 1),
        ("Peacock Blue Pure Silk with Temple Border", "silk", 28900, 2, 1),
        ("Mustard Yellow Silk with Mango Butta", "silk", 31900, 3, 0),
        ("Rose Pink Soft Silk with Silver Zari", "soft", 18900, 2, 1),
        ("Bottle Green Soft Silk", "soft", 16900, 4, 2),
        ("Ruby Red Banarasi Brocade", "banarasi", 24900, 3, 1),
        ("Ivory and Gold Banarasi Katan Silk", "banarasi", 27900, 1, 1),
        ("Lavender Silk Cotton with Checks", "cotton", 8900, 4, 3),
        ("Sea Green Silk Cotton", "cotton", 7900, 2, 0),
        ("Magenta and Green Pavadai Davani Set", "half", 15900, 5, 1),
        ("Cream Silk Dhoti and Kurta Set", "men", 9900, 6, None),
    ]
    out = []
    for i, (name, key, price, img, qty) in enumerate(rows):
        variations = []
        if key == "men":
            variations = [{"name": s, "price": price, "available": s != "XL",
                           "quantity": None if s != "XL" else 0} for s in ("S", "M", "L", "XL")]
        out.append({
            "id": "SAMPLE%02d" % i, "slug": slugify(name), "url": "/products/%s/" % slugify(name),
            "name": name,
            "description": ["SAMPLE ITEM. Your Square item description appears here.",
                            "Saree length 5.5 m plus a 0.8 m blouse piece, stitched to size 38 (can be let out to 42)."],
            "category": names[key], "categoryIds": [cats[key]],
            "price": price, "priceMax": price,
            "images": ["/images/collection-%d.jpg" % img, "/images/about.jpg", "/images/hero.jpg"],
            "available": qty is None or qty > 0, "quantity": qty,
            "variations": variations, "squareUrl": "",
            "createdAt": "2026-11-%02dT00:00:00Z" % (20 - i),
        })
    return out


# ---------------------------------------------------------------- Output

def esc(s):
    return html.escape(str(s or ""), quote=True)


def dollars(cents):
    return "${:,.2f}".format(cents / 100).replace(".00", "")


def price_label(p):
    if p["price"] is None:
        return "Ask for price"
    if p["priceMax"] != p["price"]:
        return "From " + dollars(p["price"])
    return dollars(p["price"])


def absolute(url):
    return url if url.startswith("http") else SITE_URL + url


def render_product_page(template, p):
    images = p["images"] or ["/images/og-image.jpg"]
    thumbs = ""
    if len(images) > 1:
        thumbs = '<ul class="gallery__thumbs">' + "".join(
            '<li><button type="button" data-src="%s" aria-label="Show photo %d"%s>'
            '<img src="%s" alt="" width="160" height="200" loading="lazy" decoding="async"></button></li>'
            % (esc(src), n + 1, ' aria-current="true"' if n == 0 else "", esc(src))
            for n, src in enumerate(images)) + "</ul>"

    if not p["available"]:
        stock = '<p class="stock stock--out">Sold out</p>'
    elif p["quantity"] == 1:
        stock = '<p class="stock stock--low">Only 1 left</p>'
    else:
        stock = '<p class="stock">In stock</p>'

    options = ""
    if p["variations"]:
        options = '<ul class="options" aria-label="Options">' + "".join(
            '<li class="%s">%s%s</li>' % (
                "" if v["available"] else "is-out", esc(v["name"]),
                "" if v["available"] else " <span>(sold out)</span>")
            for v in p["variations"]) + "</ul>"

    desc = "".join("<p>%s</p>" % esc(t) for t in p["description"])
    summary = (p["description"][0] if p["description"] else
               "%s from Vastram Collections, handpicked from India's weavers." % p["name"])
    jsonld = {
        "@context": "https://schema.org", "@type": "Product",
        "name": p["name"], "description": summary,
        "image": [absolute(i) for i in images], "sku": p["id"],
        "brand": {"@type": "Brand", "name": "Vastram Collections"},
    }
    if p["price"] is not None:
        jsonld["offers"] = {
            "@type": "Offer", "priceCurrency": "USD", "price": "%.2f" % (p["price"] / 100),
            "availability": "https://schema.org/" + ("InStock" if p["available"] else "SoldOut"),
            "url": absolute(p["url"]),
        }

    values = {
        "name": esc(p["name"]),
        "summary": esc(summary[:200]),
        "url": esc(absolute(p["url"])),
        "image": esc(images[0]),
        "image_abs": esc(absolute(images[0])),
        "price": esc(price_label(p)),
        "category": esc(p["category"] or "Shop"),
        "category_ids": esc(" ".join(p["categoryIds"])),
        "square_url": esc(p["squareUrl"]),
        "sold_out": "true" if not p["available"] else "false",
        "thumbs": thumbs,
        "stock": stock,
        "options": options,
        "description": desc,
        "jsonld": json.dumps(jsonld, ensure_ascii=False).replace("</", "<\\/"),
    }
    return re.sub(r"\{\{(\w+)\}\}", lambda m: values[m.group(1)], template)


def write(path, text):
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(text)


def main():
    sample = "--sample" in sys.argv
    token = os.environ.get("SQUARE_ACCESS_TOKEN", "").strip()

    if sample:
        products = sample_products()
    elif token:
        objects = fetch_catalog(token)
        kinds = [o["type"] for o in objects]
        print("Square catalog: %d items, %d categories, %d photos."
              % (kinds.count("ITEM"), kinds.count("CATEGORY"), kinds.count("IMAGE")))
        variation_ids = [v["id"] for o in objects if o["type"] == "ITEM"
                         for v in o.get("item_data", {}).get("variations", [])]
        products = build_products(objects, fetch_stock(token, variation_ids))
    else:
        print("SQUARE_ACCESS_TOKEN is not set: building an empty shop. "
              "The Shop page will point visitors to the Square store instead.")
        products = []

    write("data/products.json", json.dumps({"products": products}, ensure_ascii=False, indent=1))

    shutil.rmtree(os.path.join(ROOT, "products"), ignore_errors=True)
    with open(os.path.join(ROOT, "templates/product.html"), encoding="utf-8") as f:
        template = f.read()
    for p in products:
        write("products/%s/index.html" % p["slug"], render_product_page(template, p))

    if not sample:
        urls = [SITE_URL + "/" + page for page in STATIC_PAGES] + [absolute(p["url"]) for p in products]
        write("sitemap.xml",
              '<?xml version="1.0" encoding="UTF-8"?>\n'
              '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
              "".join("  <url><loc>%s</loc></url>\n" % esc(u) for u in urls) +
              "</urlset>\n")

    available = sum(p["available"] for p in products)
    print("Built %d products (%d available, %d sold out)%s."
          % (len(products), available, len(products) - available, " from SAMPLE data" if sample else ""))


if __name__ == "__main__":
    main()
