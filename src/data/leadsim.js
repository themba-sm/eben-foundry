/*
 * Eben Foundry — Flagship experience: live simulation engine.
 * Generates realistic demo leads / customers instantly (no network, no waiting).
 */
import { QUAL_OPTIONS, scoreLead } from './industries.js';

export const FLAGSHIP_INDUSTRIES = [
  { id: 'real-estate', name: 'Real Estate', ref: 'real-estate', mode: 'high', audience: 'Property buyers and sellers', offer: 'Free property valuation within 48 hours', secondary: '#1E4A6E', glyph: 'RE' },
  { id: 'law', name: 'Law', ref: 'law-firm', mode: 'high', audience: 'Individuals and companies with legal matters', offer: 'Free 20-minute case assessment', secondary: '#26413C', glyph: 'LW' },
  { id: 'automotive', name: 'Automotive', ref: 'car-dealership', mode: 'high', audience: 'Vehicle buyers and owners', offer: 'Trade-in valuation + test drive, same week', secondary: '#7A2E2E', glyph: 'AU' },
  { id: 'salon', name: 'Salon & Beauty', ref: 'salon', mode: 'low', audience: 'Local clients who book regularly', offer: 'First-visit 20% off — quote EBEN20', secondary: '#7A3E5B', glyph: 'SB' },
  { id: 'gym', name: 'Gym & Fitness', ref: 'gym', mode: 'low', audience: 'People starting or restarting training', offer: 'Free 7-day all-access pass', secondary: '#2E5D4E', glyph: 'GF' },
  { id: 'restaurant', name: 'Restaurant', ref: 'restaurant', mode: 'low', audience: 'Local diners and families', offer: 'Two-for-one mains, Monday–Wednesday', secondary: '#8C4A2F', glyph: 'RS' },
  { id: 'construction', name: 'Construction', ref: 'construction', mode: 'high', audience: 'Property owners and developers', offer: 'Free site visit and fixed-price quotation', secondary: '#8C6D1E', glyph: 'CN' },
  { id: 'prof-services', name: 'Professional Services', ref: 'professional-services', mode: 'high', audience: 'Businesses needing specialised support', offer: 'Free discovery call with a senior advisor', secondary: '#2E4A5A', glyph: 'PS' },
  { id: 'retail-ecommerce', name: 'Retail / E-commerce', ref: 'ecommerce', mode: 'low', audience: 'Local and online shoppers', offer: 'Free delivery on your first order', secondary: '#A63A4E', glyph: 'RC' },
  { id: 'other', name: 'Other', ref: null, mode: null, audience: 'Your target customer', offer: 'Describe your main offer', secondary: '#C8401C', glyph: 'EF' },
];

export const GENERIC_SERVICES = ['Core product or service', 'Consultation / quote', 'Premium option'];

const LEAD_NAMES = [
  'Thandi Mokoena', 'Ravi Pillay', 'Lerato Dlamini', 'Johan van Wyk', 'Aisha Patel',
  'Sipho Ndlovu', 'Marta Silva', 'Kabelo Sithole', 'Zanele Mbeki', 'Pieter Coetzee',
  'Nomsa Zwane', 'Tumi Rakoma',
];

const LEAD_SOURCES = [
  'Website enquiry', 'Instagram DM', 'Google search', 'Referral',
  'WhatsApp click-to-chat', 'Walk-in scan (QR)',
];

const CUSTOMER_SOURCES = [
  'Instagram', 'Walk-in', 'Google Maps', 'Friend referral', 'WhatsApp status',
];

const SLOTS = ['Thu 10:00', 'Fri 14:00', 'Mon 09:00', 'Wed 11:00', 'Sat 09:30'];

function weightedPick(options, weights) {
  const total = weights.reduce((a, w) => a + w, 0);
  let r = Math.random() * total;
  for (let i = 0; i < options.length; i++) {
    r -= weights[i];
    if (r <= 0) return options[i];
  }
  return options[options.length - 1];
}

/* Generates a realistic demo lead that qualifies (score ≥ 55) — instantly. */
export function genLead(services) {
  const svc = services.length ? services : GENERIC_SERVICES;
  let best = null;
  for (let attempt = 0; attempt < 8; attempt++) {
    const lead = {
      id: 'sim-' + Math.random().toString(36).slice(2, 8),
      name: LEAD_NAMES[Math.floor(Math.random() * LEAD_NAMES.length)],
      source: LEAD_SOURCES[Math.floor(Math.random() * LEAD_SOURCES.length)],
      need: svc[Math.floor(Math.random() * svc.length)],
      budget: weightedPick(QUAL_OPTIONS.budget, [0.08, 0.22, 0.35, 0.35]).label,
      timeline: weightedPick(QUAL_OPTIONS.timeline, [0.14, 0.44, 0.42]).label,
      intent: weightedPick(QUAL_OPTIONS.intent, [0.14, 0.4, 0.46]).label,
      location: weightedPick(QUAL_OPTIONS.location, [0.08, 0.3, 0.62]).label,
    };
    lead.score = scoreLead({ ...lead, services: svc });
    if (lead.score >= 55) return lead;
    if (!best || lead.score > best.score) best = lead;
  }
  return best;
}

export function genCustomer() {
  return {
    id: 'cust-' + Math.random().toString(36).slice(2, 8),
    name: LEAD_NAMES[Math.floor(Math.random() * LEAD_NAMES.length)],
    source: CUSTOMER_SOURCES[Math.floor(Math.random() * CUSTOMER_SOURCES.length)],
    phone: '+27 8' + (2 + Math.floor(Math.random() * 3)) + ' ' +
      String(100 + Math.floor(Math.random() * 899)) + ' ' +
      String(1000 + Math.floor(Math.random() * 8999)),
  };
}

export function genSlot() {
  return SLOTS[Math.floor(Math.random() * SLOTS.length)];
}
