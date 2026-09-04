/*
 * Eben Foundry — Campaign Asset Configuration
 * ------------------------------------------------
 * Finished campaign creative per flagship industry.
 * Authoritative mapping: two assets per industry, in order.
 * "Other" intentionally has no dedicated campaign assets — the
 * Marketing Studio experience continues unchanged for it.
 *
 * DO NOT remap assets between industries — the pairing below is authoritative.
 */

export const CAMPAIGN_INDUSTRIES = [
  {
    id: 'real-estate',
    name: 'Real Estate',
    glyph: 'RE',
    asset01: {
      src: '/campaigns/real-estate-01.jpg',
      width: 1003,
      height: 1568,
      alt: 'Finished Real Estate campaign creative 01 — EBEN Foundry marketing execution',
    },
    asset02: {
      src: '/campaigns/real-estate-02.jpg',
      width: 1122,
      height: 1402,
      alt: 'Finished Real Estate campaign creative 02 — EBEN Foundry marketing execution',
    },
  },
  {
    id: 'law',
    name: 'Law',
    glyph: 'LW',
    asset01: {
      src: '/campaigns/law-01.jpg',
      width: 1122,
      height: 1402,
      alt: 'Finished Law campaign creative 01 — EBEN Foundry marketing execution',
    },
    asset02: {
      src: '/campaigns/law-02.jpg',
      width: 1003,
      height: 1568,
      alt: 'Finished Law campaign creative 02 — EBEN Foundry marketing execution',
    },
  },
  {
    id: 'automotive',
    name: 'Automotive',
    glyph: 'AU',
    asset01: {
      src: '/campaigns/automotive-01.jpg',
      width: 1024,
      height: 1535,
      alt: 'Finished Automotive campaign creative 01 — EBEN Foundry marketing execution',
    },
    asset02: {
      src: '/campaigns/automotive-02.jpg',
      width: 1024,
      height: 1536,
      alt: 'Finished Automotive campaign creative 02 — EBEN Foundry marketing execution',
    },
  },
  {
    id: 'salon',
    name: 'Salon & Beauty',
    glyph: 'SB',
    asset01: {
      src: '/campaigns/salon-01.jpg',
      width: 1004,
      height: 1567,
      alt: 'Finished Salon & Beauty campaign creative 01 — EBEN Foundry marketing execution',
    },
    asset02: {
      src: '/campaigns/salon-02.jpg',
      width: 960,
      height: 1600,
      alt: 'Finished Salon & Beauty campaign creative 02 — EBEN Foundry marketing execution',
    },
  },
  {
    id: 'gym',
    name: 'Gym & Fitness',
    glyph: 'GF',
    asset01: {
      src: '/campaigns/gym-01.jpg',
      width: 1254,
      height: 1254,
      alt: 'Finished Gym & Fitness campaign creative 01 — EBEN Foundry marketing execution',
    },
    // asset 02 is being finalised — the presentation degrades gracefully until it is added
    asset02: null,
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    glyph: 'RS',
    asset01: {
      src: '/campaigns/restaurant-01.jpg',
      width: 1023,
      height: 1537,
      alt: 'Finished Restaurant campaign creative 01 — EBEN Foundry marketing execution',
    },
    asset02: {
      src: '/campaigns/restaurant-02.jpg',
      width: 1254,
      height: 1254,
      alt: 'Finished Restaurant campaign creative 02 — EBEN Foundry marketing execution',
    },
  },
  {
    id: 'construction',
    name: 'Construction',
    glyph: 'CN',
    asset01: {
      src: '/campaigns/construction-01.jpg',
      width: 1003,
      height: 1568,
      alt: 'Finished Construction campaign creative 01 — EBEN Foundry marketing execution',
    },
    asset02: {
      src: '/campaigns/construction-02.jpg',
      width: 1122,
      height: 1402,
      alt: 'Finished Construction campaign creative 02 — EBEN Foundry marketing execution',
    },
  },
  {
    id: 'prof-services',
    name: 'Professional Services',
    glyph: 'PS',
    asset01: {
      src: '/campaigns/professional-services-01.jpg',
      width: 1122,
      height: 1402,
      alt: 'Finished Professional Services campaign creative 01 — EBEN Foundry marketing execution',
    },
    asset02: {
      src: '/campaigns/professional-services-02.jpg',
      width: 1122,
      height: 1402,
      alt: 'Finished Professional Services campaign creative 02 — EBEN Foundry marketing execution',
    },
  },
  {
    id: 'retail-ecommerce',
    name: 'Retail / E-commerce',
    glyph: 'RC',
    asset01: {
      src: '/campaigns/retail-ecommerce-01.jpg',
      width: 1122,
      height: 1402,
      alt: 'Finished Retail / E-commerce campaign creative 01 — EBEN Foundry marketing execution',
    },
    asset02: {
      src: '/campaigns/retail-ecommerce-02.jpg',
      width: 1122,
      height: 1402,
      alt: 'Finished Retail / E-commerce campaign creative 02 — EBEN Foundry marketing execution',
    },
  },
];

/* Maps the business configuration's industryId (set by Build Your System) to its campaign pair. */
const STORE_INDUSTRY_TO_CAMPAIGN = {
  'real-estate': 'real-estate',
  'law-firm': 'law',
  'car-dealership': 'automotive',
  salon: 'salon',
  gym: 'gym',
  restaurant: 'restaurant',
  construction: 'construction',
  'professional-services': 'prof-services',
  ecommerce: 'retail-ecommerce',
};

export function campaignByStoreIndustry(industryId) {
  if (!industryId) return null;
  const campaignId = STORE_INDUSTRY_TO_CAMPAIGN[industryId];
  if (!campaignId) return null; // 'other' and unknown industries have no dedicated pair
  return CAMPAIGN_INDUSTRIES.find((c) => c.id === campaignId) || null;
}
