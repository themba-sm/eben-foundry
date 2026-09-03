/*
 * Eben Foundry — Industry Configuration Engine
 * ------------------------------------------------
 * The thesis: different businesses have different growth mechanics, but they can
 * all run on the same underlying growth infrastructure. Each industry below is a
 * configuration, not a separate application.
 */

export const MODES = {
  high: {
    id: 'high',
    label: 'High-Ticket',
    description: 'Considered, high-value purchases. The system sells by capturing, qualifying and converting.',
    workflow: [
      { id: 'attract', label: 'Attract', description: 'Position the business where serious buyers are already looking.' },
      { id: 'capture', label: 'Capture', description: 'Turn interest into an enquiry with a clear, low-friction offer.' },
      { id: 'qualify', label: 'Qualify', description: 'Score every lead on budget, need, timeline, location and intent.' },
      { id: 'book', label: 'Book', description: 'Move high-intent leads straight into a booked appointment.' },
      { id: 'follow', label: 'Follow Up', description: 'Structured follow-up until the buyer is ready to decide.' },
      { id: 'convert', label: 'Convert', description: 'Track every opportunity through to a won or lost outcome.' },
    ],
  },
  low: {
    id: 'low',
    label: 'Low-Ticket / High-Frequency',
    description: 'Everyday, repeat demand. The system sells by showcasing, booking and bringing people back.',
    workflow: [
      { id: 'attract', label: 'Attract', description: 'Show up in local discovery, social and search every day.' },
      { id: 'showcase', label: 'Showcase', description: 'Put the offer in front of buyers as shoppable, bookable items.' },
      { id: 'buy', label: 'Buy / Book', description: 'One clear path from interest to a booking or purchase.' },
      { id: 'remind', label: 'Remind', description: 'Automatic reminders bring each customer back at the right time.' },
      { id: 'repeat', label: 'Repeat', description: 'Loyalty and offers turn one visit into a habit.' },
      { id: 'retain', label: 'Retain', description: 'Campaigns keep the base warm and measured, not guessed.' },
    ],
  },
};

/* Standard qualification scoring model for the High-Ticket Engine (max 100). */
export const QUAL_OPTIONS = {
  budget: [
    { label: 'Under R5,000', points: 5 },
    { label: 'R5,000 – R20,000', points: 10 },
    { label: 'R20,000 – R100,000', points: 18 },
    { label: 'R100,000+', points: 25 },
  ],
  timeline: [
    { label: 'Just researching', points: 4 },
    { label: 'Within 1–3 months', points: 12 },
    { label: 'This month', points: 20 },
  ],
  intent: [
    { label: 'Exploring options', points: 5 },
    { label: 'Comparing providers', points: 12 },
    { label: 'Ready to engage now', points: 20 },
  ],
  location: [
    { label: 'Outside the area', points: 5 },
    { label: 'Nearby', points: 12 },
    { label: 'In the target area', points: 15 },
  ],
};

/* need matching: exact service match = 20, other = 8 */
export const NEED_MATCH = { exact: 20, other: 8 };

export function scoreLead({ need, services = [], budget, timeline, intent, location }) {
  const pick = (options, value) =>
    (options.find((o) => o.label === value) || { points: 0 }).points;
  let score = 0;
  score += pick(QUAL_OPTIONS.budget, budget);
  score += pick(QUAL_OPTIONS.timeline, timeline);
  score += pick(QUAL_OPTIONS.intent, intent);
  score += pick(QUAL_OPTIONS.location, location);
  score += services.some((s) => (s.name || s) === need) ? NEED_MATCH.exact : NEED_MATCH.other;
  return Math.min(100, Math.max(0, score));
}

export function statusFromScore(score) {
  if (score >= 80) return 'high-intent';
  if (score >= 60) return 'qualified';
  return 'new';
}

export const LEAD_STATUSES = [
  { id: 'new', label: 'New' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'high-intent', label: 'High Intent' },
  { id: 'booked', label: 'Appointment Booked' },
  { id: 'won', label: 'Won' },
  { id: 'lost', label: 'Lost' },
];

export const INDUSTRIES = [
  {
    id: 'real-estate', name: 'Real Estate', mode: 'high',
    audience: 'Property buyers and sellers',
    offer: 'Free property valuation within 48 hours',
    services: ['Property valuation', 'Seller listing & marketing', 'Buyer representation'],
    qualQuestions: [
      { id: 'q-type', label: 'What type of property is this about?', options: ['Freehold house', 'Townhouse / cluster', 'Apartment', 'Commercial'] },
      { id: 'q-finance', label: 'Is finance pre-approved?', options: ['Yes, pre-approved', 'In application', 'Not yet'] },
    ],
  },
  {
    id: 'law-firm', name: 'Law Firm', mode: 'high',
    audience: 'Individuals and companies with legal matters',
    offer: 'Free 20-minute case assessment',
    services: ['Case assessment', 'Litigation', 'Contracts & commercial'],
    qualQuestions: [
      { id: 'q-matter', label: 'What is the matter about?', options: ['Civil dispute', 'Commercial / contract', 'Family law', 'Labour'] },
      { id: 'q-counsel', label: 'Do you have existing legal representation?', options: ['No', 'Yes, reviewing options'] },
    ],
  },
  {
    id: 'car-dealership', name: 'Car Dealership', mode: 'high',
    audience: 'Vehicle buyers upgrading or replacing a car',
    offer: 'Trade-in valuation + test drive, same week',
    services: ['Trade-in valuation', 'New vehicle sales', 'Certified pre-owned'],
    qualQuestions: [
      { id: 'q-vehicle', label: 'What are you looking for?', options: ['SUV / crossover', 'Sedan', 'Hatchback', 'Bakkie / double cab'] },
      { id: 'q-tradein', label: 'Do you have a vehicle to trade in?', options: ['Yes', 'No'] },
    ],
  },
  {
    id: 'construction', name: 'Construction', mode: 'high',
    audience: 'Property owners and developers with build projects',
    offer: 'Free site visit and fixed-price quotation',
    services: ['Site visit & quotation', 'Home extensions', 'Commercial fit-out'],
    qualQuestions: [
      { id: 'q-project', label: 'What is the project?', options: ['New build', 'Renovation / extension', 'Fit-out', 'Repairs'] },
      { id: 'q-plans', label: 'Are plans approved?', options: ['Yes, approved', 'In progress', 'Not yet'] },
    ],
  },
  {
    id: 'professional-services', name: 'Professional Services', mode: 'high',
    audience: 'Businesses needing specialised professional support',
    offer: 'Free discovery call with a senior advisor',
    services: ['Discovery call', 'Advisory retainer', 'Project delivery'],
    qualQuestions: [
      { id: 'q-need', label: 'What support do you need?', options: ['Strategy', 'Compliance & risk', 'Operations', 'Finance'] },
      { id: 'q-team', label: 'Who handles this internally today?', options: ['No one, we need help', 'An internal team, under-resourced', 'Another provider'] },
    ],
  },
  {
    id: 'consulting', name: 'Consulting', mode: 'high',
    audience: 'Companies with a growth or efficiency problem',
    offer: 'Free operational diagnostic (2 weeks)',
    services: ['Operational diagnostic', 'Growth strategy', 'Implementation partner'],
    qualQuestions: [
      { id: 'q-problem', label: 'What problem are you solving?', options: ['Growth has stalled', 'Costs are too high', 'Processes are chaotic', 'Team & structure'] },
      { id: 'q-sponsor', label: 'Who owns this decision?', options: ['Owner / founder', 'MD or executive', 'Board'] },
    ],
  },
  {
    id: 'salon', name: 'Salon & Beauty', mode: 'low',
    audience: 'Local clients who book regularly',
    offer: 'First-visit 20% off — quote EBEN20',
    services: ['Cut & style', 'Full colour', 'Manicure & gel'],
    retention: { cadence: 'Every 4–6 weeks', loyalty: '10 points per visit · 100 points = a free treatment' },
  },
  {
    id: 'barber', name: 'Barbershop', mode: 'low',
    audience: 'Men who cut every 2–4 weeks',
    offer: 'Every 5th cut free with the loyalty card',
    services: ['Signature cut', 'Cut & beard', 'Kids cut'],
    retention: { cadence: 'Every 2–4 weeks', loyalty: 'Stamp card · 5th cut free' },
  },
  {
    id: 'gym', name: 'Gym / Fitness', mode: 'low',
    audience: 'People starting or restarting training',
    offer: 'Free 7-day all-access pass',
    services: ['Monthly membership', 'Personal training pack', 'Group classes'],
    retention: { cadence: 'Weekly check-in', loyalty: '10 points per visit · redeem against merch' },
  },
  {
    id: 'restaurant', name: 'Restaurant', mode: 'low',
    audience: 'Local diners and families',
    offer: 'Two-for-one mains, Monday–Wednesday',
    services: ['Dinner booking', 'Lunch special', 'Family platter'],
    retention: { cadence: 'Every 2–3 weeks', loyalty: '10 points per R100 · free dessert at 100' },
  },
  {
    id: 'retail', name: 'Retail Store', mode: 'low',
    audience: 'Local shoppers hunting value',
    offer: 'Weekly specials sent every Friday',
    services: ['Weekly specials', 'Bulk deals', 'Lay-by'],
    retention: { cadence: 'Weekly Friday specials', loyalty: '10 points per R150 spent · R50 off at 100' },
  },
  {
    id: 'ecommerce', name: 'E-commerce', mode: 'low',
    audience: 'Online buyers in your category',
    offer: 'Free delivery on your first order',
    services: ['Core product range', 'Bundles & upsells', 'Subscription refills'],
    retention: { cadence: 'Every 3–4 weeks', loyalty: '10 points per order · 100 points = R100 off' },
  },
];

export function industryById(id) {
  return INDUSTRIES.find((i) => i.id === id) || null;
}

export function servicesAsItems(services) {
  return services.map((s) =>
    typeof s === 'string' ? { name: s, price: '—', note: '' } : s
  );
}
