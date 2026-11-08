/*
 * ============================================================
 *  VASTRAM COLLECTIONS — SITE SETTINGS
 *  This is the ONLY file you need to edit for day-to-day updates.
 *
 *  Search for "TODO" to find every placeholder still to fill in.
 *
 *  Rules of thumb:
 *   - Keep the quotes around text: "like this".
 *   - Keep the comma at the end of each line inside a list or block.
 *   - Leave a value as "" (empty quotes) to hide it on the site.
 * ============================================================
 */
window.SITE_CONFIG = {

  /* ---------- Brand ---------- */
  shopName: "Vastram Collections",
  legalName: "Vastram Collections",
  tagline: "Handpicked sarees, straight from India's weavers to you.",

  // Short teaser on the home page (1–2 sentences).
  storyTeaser: "We work directly with weavers in India to bring their sarees to you — no middlemen, just beautiful handwork and fair prices for the artisans who make it.",

  // Full story on the About page. Each item in the list becomes its own paragraph.
  story: [
    "TODO: Placeholder brand story. Tell visitors who you are and how Vastram Collections started.",
    "TODO: Where in India your sarees come from, and how you choose each piece.",
    "TODO: What you hope customers feel when they wear a Vastram saree."
  ],

  /* ---------- Online store (Square) ---------- */
  // Your Square Online store home page, e.g. "https://vastramcollections.square.site"
  // "Buy now" uses each item's own Square page when Square provides one,
  // otherwise its collection's squareUrl, otherwise this store link.
  squareStoreUrl: "https://vastramusa.square.site/",

  // One entry per collection: the cards on the home page and the filters on the Shop page.
  // Items appear on the Shop page automatically from Square, matched by category.
  //  - name / description: what visitors see
  //  - image: photo in the images/ folder (portrait, about 4:5, e.g. 800×1000)
  //  - imageAlt: describe the photo for screen readers, e.g. "Model wearing a red silk saree with gold border"
  //  - squareUrl: the matching category page in your Square store. The long code at the end
  //    tells the site which Square category belongs to this collection.
  //  - productNote: optional line shown on every item page in this collection
  collections: [
    {
      name: "Silk Sarees",
      description: "Rich silks with classic borders for weddings, festivals and family celebrations.",
      image: "images/collection-1.jpg", // TODO: replace photo
      imageAlt: "Placeholder image for the silk sarees collection", // TODO: describe your photo
      squareUrl: "https://vastramusa.square.site/shop/silk-sarees/EMB3WMXEXNX32VGND4QKDD27",
      productNote: "Comes with a stitched blouse, ready to wear.",
    },
    {
      name: "Soft Silk Sarees",
      description: "Lightweight silks that drape easily and stay comfortable all day.",
      image: "images/collection-2.jpg", // TODO: replace photo
      imageAlt: "Placeholder image for the soft silk sarees collection", // TODO: describe your photo
      squareUrl: "https://vastramusa.square.site/shop/soft-silk-sarees/CA4C6P63QZF4DARALWMONTVD",
      productNote: "Comes with a stitched blouse, ready to wear.",
    },
    {
      name: "Banarasi Silk Sarees",
      description: "Silks from Varanasi, known for their intricate woven brocade.",
      image: "images/collection-3.jpg", // TODO: replace photo
      imageAlt: "Placeholder image for the Banarasi silk sarees collection", // TODO: describe your photo
      squareUrl: "https://vastramusa.square.site/shop/banarasi-silk-sarees/GIT67QA3TM2V6HSCLSQM4QQ6",
      productNote: "Comes with a stitched blouse, ready to wear.",
    },
    {
      name: "Silk Cotton Sarees",
      description: "The sheen of silk with the ease of cotton, for work, poojas and everyday occasions.",
      image: "images/collection-4.jpg", // TODO: replace photo
      imageAlt: "Placeholder image for the silk cotton sarees collection", // TODO: describe your photo
      squareUrl: "https://vastramusa.square.site/shop/silk-cotton/2EOOSOFPVNGTQ5IGWRMBTURX",
      productNote: "Comes with a stitched blouse, ready to wear.",
    },
    {
      name: "Half Sarees",
      description: "Langa voni (pavadai davani) sets for festivals, functions and coming-of-age celebrations.",
      image: "images/collection-5.jpg", // TODO: replace photo
      imageAlt: "Placeholder image for the half sarees collection", // TODO: describe your photo
      squareUrl: "https://vastramusa.square.site/shop/half-sarees/BQ7RB32CPGR4DJZDY5HVRVJG",
      productNote: "", // TODO: e.g. "Skirt, blouse and davani included." (shown on each half saree page)
    },
    {
      name: "Men's Dhotis, Kurtas & Shirts",
      description: "Traditional wear for him, ready for festivals, weddings and family functions.",
      image: "images/collection-6.jpg", // TODO: replace photo
      imageAlt: "Placeholder image for the men's dhotis, kurtas and shirts collection", // TODO: describe your photo
      squareUrl: "https://vastramusa.square.site/shop/men/LI43L7DGUOBH4N2UJVWQXNU2"
    }
  ],

  /* ---------- Contact ---------- */
  email: "vastramatlanta@gmail.com",
  // Full number with country code, any format, e.g. "+1 470 555 0123". "" hides phone links.
  phone: "", // TODO: phone number
  // WhatsApp number (usually the same as phone). "" hides WhatsApp buttons.
  whatsapp: "", // TODO: WhatsApp number
  whatsappMessage: "Hi Vastram Collections! I have a question about your sarees.",

  /* ---------- Social ---------- */
  instagram: "", // TODO: Instagram handle without the @, e.g. "vastramcollections". "" hides Instagram links.
  facebookUrl: "", // optional, full URL

  /* ---------- Care page ---------- */
  // "Watch draping videos" button. Swap in your own Instagram Reel or YouTube video when you have one.
  drapingGuideUrl: "https://www.youtube.com/results?search_query=how+to+drape+a+saree+nivi+style",

  /* ---------- Local pickup ---------- */
  pickupArea: "Johns Creek, GA",

  /* ---------- Shipping & policies (used on the FAQ page) ---------- */
  shippingRegion: "the United States",
  shippingCost: "Shipping is a flat $15.99 per order.",
  shippingTime: "Orders usually arrive within 3–5 business days.",
  returnPolicy: "All sales are final — we don't accept returns or exchanges. If you have any questions about a saree, please message us before you order and we'll gladly send more photos or details. If your saree arrives damaged, email us within 48 hours of delivery with photos of the damage and the packaging, and we'll make it right.",

  /* ---------- Upcoming pop-ups & stalls ---------- */
  // Add one block per event. Past events disappear automatically the day after.
  // When there are no upcoming events, the section is hidden on the home page.
  //  - date: "YYYY-MM-DD"
  //  - link: optional event page or map link ("" for none)
  events: [
    {
      date: "2026-10-10",
      title: "Vastram Collections stall", // TODO: event name
      location: "Cumming, GA", // TODO: venue / address
      time: "", // TODO: e.g. "10 AM – 5 PM"
      details: "More details coming soon — follow us for updates.",
      link: ""
    }
  ]
};
