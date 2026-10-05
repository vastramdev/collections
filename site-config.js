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
  tagline: "Directly from weavers to you.",

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
  // While this is "", every "Shop" button points to the Contact page instead.
  squareStoreUrl: "", // TODO: add your Square Online store URL

  // One entry per collection card on the home page.
  //  - name / description: what visitors see
  //  - image: photo in the images/ folder (portrait, about 4:5, e.g. 800×1000)
  //  - imageAlt: describe the photo for screen readers, e.g. "Model wearing a red silk saree with gold border"
  //  - squareUrl: link to the matching category page in your Square store ("" = use squareStoreUrl)
  collections: [
    {
      name: "Silk Sarees", // TODO: placeholder collection
      description: "Rich silks for weddings, festivals and family celebrations.",
      image: "images/collection-1.jpg",
      imageAlt: "Placeholder image for the silk sarees collection",
      squareUrl: "" // TODO: Square category URL
    },
    {
      name: "Cotton Sarees", // TODO: placeholder collection
      description: "Light, breathable weaves for everyday elegance.",
      image: "images/collection-2.jpg",
      imageAlt: "Placeholder image for the cotton sarees collection",
      squareUrl: "" // TODO: Square category URL
    },
    {
      name: "Party Wear", // TODO: placeholder collection
      description: "Statement drapes for receptions, sangeets and evenings out.",
      image: "images/collection-3.jpg",
      imageAlt: "Placeholder image for the party wear collection",
      squareUrl: "" // TODO: Square category URL
    },
    {
      name: "Festive Picks", // TODO: placeholder collection
      description: "Seasonal favourites for Diwali, Pongal and Navratri.",
      image: "images/collection-4.jpg",
      imageAlt: "Placeholder image for the festive picks collection",
      squareUrl: "" // TODO: Square category URL
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
  shippingCost: "TODO: shipping cost / free-shipping threshold (placeholder)",
  shippingTime: "TODO: typical processing and delivery time (placeholder)",
  returnPolicy: "TODO: return / exchange policy (placeholder) — e.g. how many days, condition of the saree, who pays return shipping.",

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
