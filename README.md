# Vastram Collections — brand website

Static site for **vastramusa.com**, hosted on GitHub Pages. It's plain HTML, CSS and JavaScript, with no build step.

This site is the brand "front door". **Products, prices, stock, cart and checkout all live in the Square Online store.** The site only shows collections, and each "Shop" button links to the matching Square category, so the site never goes out of date when stock changes.

## Everyday edits: `site-config.js`

Almost everything you'll want to change is in **`site-config.js`**:

| What | Setting |
| --- | --- |
| Tagline, story teaser, full brand story | `tagline`, `storyTeaser`, `story` |
| Square store link | `squareStoreUrl` |
| Collection cards (name, text, photo, Square link) | `collections` |
| Email, phone, WhatsApp, Instagram, Facebook | `email`, `phone`, `whatsapp`, `instagram`, `facebookUrl` |
| Local pickup area | `pickupArea` |
| Shipping & returns text (FAQ) | `shippingCost`, `shippingTime`, `returnPolicy` |
| Pop-ups & stalls | `events` |
| Draping video link | `drapingGuideUrl` |

Search the file for `TODO` to find placeholders. If you set a value to `""`, the matching button or link is hidden, so you won't end up with broken WhatsApp or Instagram links.

**Pop-ups:** add one block per event to `events`. An event drops off the site the day after its date. If no events are upcoming, the "Upcoming pop-ups & stalls" section is hidden.

**Before the Square store is ready:** while `squareStoreUrl` is `""`, the Shop buttons say "Shop opening soon — ask us" and link to the Contact page.

### Finding Square category URLs
In Square Online, open your site, click into a category on the live store, and copy the address from the browser bar. Paste it into that collection's `squareUrl`.

## Photos to replace (`images/`)

Every placeholder is labeled **PLACEHOLDER** on the image. Replace each file with a photo of **the same filename**, or change the filename in `site-config.js` / the HTML.

| File | Used for | Shape / size |
| --- | --- | --- |
| `hero.jpg` | Big home-page banner | Landscape, ~1600×1000. Keep the bottom-left area simple, because text sits there. |
| `collection-1.jpg` … `collection-6.jpg` | Collection cards (in the order listed in `site-config.js`) | Portrait 4:5, ~800×1000 |
| `about.jpg` | Our Story (home + About page) | Portrait 4:5, ~1000×1250 |
| `og-image.jpg` | Link preview on WhatsApp/Instagram/Facebook | Exactly 1200×630, with your logo or best saree photo |
| `apple-touch-icon.png` | iPhone home-screen icon | 180×180 |
| `favicon-32.png` and `/favicon.svg` | Browser tab icon | 32×32 / square SVG |

Keep JPGs under ~300 KB each so the site stays fast on phones. Exporting from your phone or Canva at "medium" quality is usually enough. When you replace a photo, also update its `alt` text (in `site-config.js` for collections, or in the HTML for the hero and about photos) to describe the photo.

## Text that lives in the HTML

Search engines and WhatsApp link previews don't run JavaScript, so a few things are written directly in each page's `<head>`: the page title, description, and `og:` preview tags. If you change the shop name or domain, update those too. Search all files for `vastramusa.com`.

## Hosting on GitHub Pages with vastramusa.com

1. GitHub → this repo → **Settings → Pages** → Source: *Deploy from a branch*, branch `main`, folder `/ (root)`.
2. Custom domain: `vastramusa.com` (the `CNAME` file already contains it). Tick **Enforce HTTPS** once it becomes available.
3. At your domain registrar's DNS settings:
   - **A records** for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - **CNAME** for `www` → `vastramdev.github.io`
4. DNS can take up to a day to start working.

## Previewing locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```
