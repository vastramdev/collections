# Vastram Collections — brand website

Static site for **vastramusa.com**, hosted on GitHub Pages. It's plain HTML, CSS and JavaScript, with no build step.

**Square is the single source of truth for items, prices and stock.** Every hour, a GitHub job reads your Square catalog and rebuilds the Shop page and one page per item, so whatever you add or sell in Square shows up on vastramusa.com automatically. Payment happens in Square's secure checkout.

## How the shop works

1. Add an item in Square (app or dashboard) with **photos, a price, a description, its category** (e.g. Silk Sarees) and its **stock count**.
2. Within the hour it appears on the Shop page, under its collection, and on the home page's "New arrivals".
3. When it sells (online or at a stall), Square lowers the stock. At 0 the site shows it as **Sold out**.
4. **Want it on the site right now?** GitHub → this repo → **Actions** → **Build and deploy** → **Run workflow**.

Tips:
- The first photo in Square is the main photo. Add 3–5 photos: full drape, border, pallu, blouse.
- Put each saree in its specific category (Silk Sarees, not just Sarees). Collections are matched by the code at the end of each `squareUrl` in `site-config.js`.
- To hide an item from the website without deleting it, archive it in Square.
- Items with several sizes or colours (variations) show each option, and sold-out options are crossed out.

### Connecting Square (one-time)
1. Go to **developer.squareup.com** → sign in with your Square account → **Create an application** (any name, e.g. "Vastram website").
2. Open the app → switch to **Production** → copy the **Production Access token**.
3. GitHub → this repo → **Settings → Secrets and variables → Actions → New repository secret**. Name: `SQUARE_ACCESS_TOKEN`, value: the token.
4. Never paste the token into chats, emails or files. Anyone with it can see your Square account's data. If it ever leaks, replace it in the Square developer dashboard.

Until the secret is set, the Shop page shows "Our shop is being stocked" with links to each collection in the Square store.

GitHub pauses hourly jobs after 60 days with no commits to the repo. If GitHub emails you about it, open **Actions** and re-enable the workflow.

## Everyday edits: `site-config.js`

Almost everything you'll want to change is in **`site-config.js`**:

| What | Setting |
| --- | --- |
| Tagline, story teaser, full brand story | `tagline`, `storyTeaser`, `story` |
| Square store link (fallback for Buy buttons) | `squareStoreUrl` |
| Collections: cards, Shop filters, Square category, per-item note | `collections` |
| Email, phone, WhatsApp, Instagram, Facebook | `email`, `phone`, `whatsapp`, `instagram`, `facebookUrl` |
| Local pickup area | `pickupArea` |
| Shipping & returns text (FAQ) | `shippingCost`, `shippingTime`, `returnPolicy` |
| Pop-ups & stalls | `events` |
| Draping video link | `drapingGuideUrl` |

Search the file for `TODO` to find placeholders. If you set a value to `""`, the matching button or link is hidden, so you won't end up with broken WhatsApp or Instagram links.

**Pop-ups:** add one block per event to `events`. An event drops off the site the day after its date. If no events are upcoming, the "Upcoming pop-ups & stalls" section is hidden.


### Finding Square category URLs
In Square Online, open your site, click into a category on the live store, and copy the address from the browser bar. Paste it into that collection's `squareUrl`.

## Photos to replace (`images/`)

The logo images are made from the Vastram Collections logo. The collection and Our Story photos are still placeholders, labeled **PLACEHOLDER** on the image. Replace each file with a photo of **the same filename**, or change the filename in `site-config.js` / the HTML.

| File | Used for | Shape / size |
| --- | --- | --- |
| `logo.webp` | Round logo in the home-page banner | Square, 640×640, transparent corners |
| `lotus-mark.webp` | Small lotus in the header and footer | Square, 144×144 |
| `collection-1.jpg` … `collection-6.jpg` | Collection cards (in the order listed in `site-config.js`) | Portrait 4:5, ~800×1000 |
| `about.jpg` | Our Story (home + About page) | Portrait 4:5, ~1000×1250 |
| `og-image.jpg` | Link preview on WhatsApp/Instagram/Facebook (logo on maroon) | Exactly 1200×630 |
| `apple-touch-icon.png` | iPhone home-screen icon (lotus) | 180×180 |
| `favicon-32.png`, `favicon-192.png` | Browser tab icon (lotus) | 32×32 / 192×192 |

Keep JPGs under ~300 KB each so the site stays fast on phones. Exporting from your phone or Canva at "medium" quality is usually enough. When you replace a photo, also update its `alt` text (in `site-config.js` for collections, or in the HTML for the about photo) to describe the photo.

## Text that lives in the HTML

Search engines and WhatsApp link previews don't run JavaScript, so a few things are written directly in each page's `<head>`: the page title, description, and `og:` preview tags. If you change the shop name or domain, update those too. Search all files for `vastramusa.com`.

## Hosting on GitHub Pages with vastramusa.com

1. GitHub → this repo → **Settings → Pages** → Source: **GitHub Actions**. (The `Build and deploy` workflow publishes the site, including the shop.)
2. Custom domain: `vastramusa.com` (the `CNAME` file already contains it). Tick **Enforce HTTPS** once it becomes available.
3. At your domain registrar's DNS settings:
   - **A records** for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - **CNAME** for `www` → `vastramdev.github.io`
4. DNS can take up to a day to start working.

## Previewing locally

```bash
python3 scripts/build_shop.py --sample   # fills the shop with made-up items
python3 -m http.server 8000
# open http://localhost:8000
```

To preview with your real Square items instead: `SQUARE_ACCESS_TOKEN=... python3 scripts/build_shop.py`. The generated `data/` and `products/` folders are not committed; GitHub builds them on every deploy.
