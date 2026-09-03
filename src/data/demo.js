/*
 * Eben Foundry — Seeded demonstration data.
 * Every record exported here is DEMO DATA and must be labelled as such in the UI.
 */

export const DEMO_LEADS = [
  {
    id: 'demo-lead-1', name: 'Thandi Mokoena', phone: '+27 82 000 0001',
    need: 'Property valuation', budget: 'R100,000+', timeline: 'This month',
    intent: 'Ready to engage now', location: 'In the target area',
    custom: { 'q-type': 'Freehold house', 'q-finance': 'Yes, pre-approved' },
    score: 100, status: 'high-intent', followups: [
      { at: 'Day 1', note: 'Intro call — very motivated, selling to upgrade.' },
    ], appointment: null,
  },
  {
    id: 'demo-lead-2', name: 'Ravi Pillay', phone: '+27 83 000 0002',
    need: 'Seller listing & marketing', budget: 'R20,000 – R100,000', timeline: 'Within 1–3 months',
    intent: 'Comparing providers', location: 'Nearby',
    custom: { 'q-type': 'Townhouse / cluster', 'q-finance': 'Not yet' },
    score: 65, status: 'qualified', followups: [], appointment: null,
  },
  {
    id: 'demo-lead-3', name: 'Lerato Dlamini', phone: '+27 84 000 0003',
    need: 'Buyer representation', budget: 'Under R5,000', timeline: 'Just researching',
    intent: 'Exploring options', location: 'Outside the area',
    custom: { 'q-type': 'Apartment', 'q-finance': 'In application' },
    score: 22, status: 'new', followups: [], appointment: null,
  },
  {
    id: 'demo-lead-4', name: 'Johan van Wyk', phone: '+27 82 000 0004',
    need: 'Property valuation', budget: 'R100,000+', timeline: 'This month',
    intent: 'Ready to engage now', location: 'In the target area',
    custom: { 'q-type': 'Commercial', 'q-finance': 'Yes, pre-approved' },
    score: 100, status: 'booked', followups: [
      { at: 'Day 1', note: 'Valuation booked for Thursday 10:00.' },
    ],
    appointment: { date: 'Thu 10:00', note: 'On-site commercial valuation' },
  },
];

export const DEMO_CUSTOMERS = [
  { id: 'demo-cust-1', name: 'Aisha Patel', phone: '+27 82 111 0001', visits: 6, points: 60, lastVisit: '3 weeks ago', nextReminder: 'In 1 week' },
  { id: 'demo-cust-2', name: 'Nomvula Khumalo', phone: '+27 83 111 0002', visits: 2, points: 20, lastVisit: 'This week', nextReminder: 'In 5 weeks' },
  { id: 'demo-cust-3', name: 'Sipho Ndlovu', phone: '+27 84 111 0003', visits: 9, points: 90, lastVisit: '2 weeks ago', nextReminder: 'In 2 weeks' },
  { id: 'demo-cust-4', name: 'Marta Silva', phone: '+27 82 111 0004', visits: 4, points: 40, lastVisit: '6 weeks ago', nextReminder: 'Overdue' },
];

export const DEMO_CAMPAIGNS = [
  { id: 'camp-1', name: 'EBEN20 first-visit offer', type: 'WhatsApp broadcast', sent: 210, opens: 168, conversions: 27, note: '20% off first visit' },
  { id: 'camp-2', name: 'Winter colour special', type: 'Social + in-store', sent: 340, opens: 246, conversions: 31, note: 'Full colour R520' },
  { id: 'camp-3', name: 'Rebook reminder — 6-week lapsed', type: 'SMS', sent: 95, opens: 61, conversions: 14, note: 'Book this week, get a free gloss' },
];

export const DEMO_SUPPLIERS = [
  {
    id: 'sup-1', demo: true, business: 'Atterbury Civils', category: 'Construction & Build',
    location: 'Midrand, Gauteng', capabilities: ['Bulk earthworks', 'Road layerworks', 'Stormwater'],
    capacity: 'Large (500+ units equivalent)', verified: 'Verified', readiness: 86,
  },
  {
    id: 'sup-2', demo: true, business: 'Kalahari Steelworks', category: 'Manufacturing',
    location: 'Vereeniging, Gauteng', capabilities: ['Structural steel', 'Fabrication', 'On-site erection'],
    capacity: 'Medium (50–500 units equivalent)', verified: 'Verified', readiness: 78,
  },
  {
    id: 'sup-3', demo: true, business: 'Cape Fruit Processors', category: 'Agri-processing',
    location: 'Paarl, Western Cape', capabilities: ['Juice extraction', 'Cold-chain storage', 'Private label packing'],
    capacity: 'Large (500+ units equivalent)', verified: 'Pending', readiness: 64,
  },
  {
    id: 'sup-4', demo: true, business: 'Meridian Legal Advisory', category: 'Professional Services',
    location: 'Sandton, Gauteng', capabilities: ['Commercial contracts', 'Regulatory compliance', 'Bid documentation'],
    capacity: 'Small (up to 50 units equivalent)', verified: 'Verified', readiness: 91,
  },
  {
    id: 'sup-5', demo: true, business: 'SwiftCross Logistics', category: 'Logistics & Distribution',
    location: 'Durban, KwaZulu-Natal', capabilities: ['Long-haul freight', 'Cold-chain fleet', 'Last-mile network'],
    capacity: 'Large (500+ units equivalent)', verified: 'Verified', readiness: 83,
  },
  {
    id: 'sup-6', demo: true, business: 'Vaal Print & Packaging', category: 'Print & Packaging',
    location: 'Vanderbijlpark, Gauteng', capabilities: ['Corrugated packaging', 'Flexo printing', 'Short-run boxes'],
    capacity: 'Medium (50–500 units equivalent)', verified: 'Unverified', readiness: 47,
  },
  {
    id: 'sup-7', demo: true, business: 'Ambani Facilities Group', category: 'Facilities Management',
    location: 'Pretoria, Gauteng', capabilities: ['Cleaning contracts', 'Security integration', 'Maintenance crews'],
    capacity: 'Medium (50–500 units equivalent)', verified: 'Pending', readiness: 71,
  },
  {
    id: 'sup-8', demo: true, business: 'Thuto IT Services', category: 'IT Services',
    location: 'Cape Town, Western Cape', capabilities: ['Managed support', 'Cloud migration', 'Cybersecurity audits'],
    capacity: 'Small (up to 50 units equivalent)', verified: 'Verified', readiness: 88,
  },
];

export const SUPPLIER_CATEGORIES = [...new Set(DEMO_SUPPLIERS.map((s) => s.category))];

/* Impact dashboard — illustrative pilot targets, not real achievements. */
export const PILOT_METRICS = [
  { id: 'onboarded', label: 'Businesses onboarded', value: 24, target: 120, unit: '' },
  { id: 'leads', label: 'Leads generated', value: 640, target: 2500, unit: '' },
  { id: 'qualified', label: 'Qualified leads', value: 210, target: 900, unit: '' },
  { id: 'appointments', label: 'Appointments booked', value: 96, target: 450, unit: '' },
  { id: 'opportunities', label: 'Opportunities facilitated', value: 18, target: 80, unit: '' },
  { id: 'contracts', label: 'Contracts facilitated', value: 7, target: 30, unit: '' },
  { id: 'campaigns', label: 'Marketing campaigns run', value: 38, target: 150, unit: '' },
  { id: 'pipeline', label: 'Estimated pipeline value', value: 4.2, target: 18, unit: 'R m', display: 'R4.2m', targetDisplay: 'R18m' },
];

export const READINESS_AREAS = [
  {
    id: 'digital', label: 'Digital presence', weight: 1,
    statements: [
      'Customers can find and learn about the business online.',
      'The business appears in local search and maps.',
      'The website or page clearly states what the business offers.',
    ],
  },
  {
    id: 'capture', label: 'Lead capture', weight: 1,
    statements: [
      'There is a clear way for a new customer to enquire.',
      'Enquiries are recorded somewhere structured (not just DMs).',
      'Every enquiry gets a response the same day.',
    ],
  },
  {
    id: 'sales', label: 'Sales process', weight: 1,
    statements: [
      'Every serious enquiry is asked about budget and timeline.',
      'Someone owns moving each deal to a decision.',
      'Quotes or proposals are sent within 48 hours.',
    ],
  },
  {
    id: 'followup', label: 'Customer follow-up', weight: 1,
    statements: [
      'Existing customers are contacted regularly.',
      'Repeat purchases or visits are tracked per customer.',
      'Lapsed customers get a win-back attempt.',
    ],
  },
  {
    id: 'marketing', label: 'Marketing readiness', weight: 1,
    statements: [
      'The business runs offers, not just announcements.',
      'Marketing performance is measured (clicks, calls, conversions).',
      'Brand materials are consistent across channels.',
    ],
  },
  {
    id: 'automation', label: 'Automation readiness', weight: 1,
    statements: [
      'Reminders or confirmations are sent automatically.',
      'Recurring admin tasks run without manual steps.',
      'The team follows a defined process, not memory.',
    ],
  },
  {
    id: 'ai', label: 'AI readiness', weight: 1,
    statements: [
      'The team is open to AI-assisted workflows.',
      'There is data (customers, leads, content) an AI could use.',
      'Someone can own and supervise AI tools.',
    ],
  },
];

export const READINESS_ACTIONS = {
  digital: 'Publish or refresh your web presence with a clear offer, and claim your local listings so discovery works for you.',
  capture: 'Install a single capture point — form, booking link or WhatsApp — and log every enquiry in one place.',
  sales: 'Define qualification questions (budget, timeline, need) and assign an owner to every active deal.',
  followup: 'Set a repeat cadence per customer and automate a reminder before each one lapses.',
  marketing: 'Run one measurable offer per month and track where every enquiry came from.',
  automation: 'Automate confirmations and reminders first — they remove the most manual, repetitive work.',
  ai: 'Start with one assisted workflow (e.g. drafting follow-ups), and put someone in charge of reviewing outputs.',
};
