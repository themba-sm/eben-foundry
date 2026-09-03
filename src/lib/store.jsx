import { createContext, useContext, useState } from 'react';

const STORAGE_KEY = 'eben-foundry:business:v1';
const BusinessContext = createContext(null);

export function BusinessProvider({ children }) {
  const [business, setBusinessState] = useState(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const setBusiness = (next) => {
    setBusinessState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — session-only configuration */
    }
  };

  const clearBusiness = () => {
    setBusinessState(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  };

  return (
    <BusinessContext.Provider value={{ business, setBusiness, clearBusiness }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  return useContext(BusinessContext);
}

export function makeBusiness(config) {
  return {
    createdAt: new Date().toISOString(),
    ...config,
  };
}

/* Pre-built demo configurations used by the engines' "Use a demo business" actions. */
export const DEMO_HIGH_BUSINESS = {
  createdAt: null,
  industryId: 'real-estate',
  industryName: 'Real Estate',
  mode: 'high',
  name: 'Meridian Property Group',
  productService: 'Residential property sales & valuations',
  offer: 'Free, no-obligation property valuation within 48 hours',
  audience: 'Homeowners and property buyers',
  location: 'Greater Sandton, Johannesburg',
  primary: '#15171C',
  secondary: '#C8401C',
  services: [
    { name: 'Property valuation', price: 'Free', note: '48-hour turnaround' },
    { name: 'Seller listing & marketing', price: 'From 3.5% commission', note: 'Full campaign included' },
    { name: 'Buyer representation', price: 'No buyer fee', note: 'Finance-ready guidance' },
  ],
  qualQuestions: [
    { id: 'q-property-type', label: 'What type of property is this about?', options: ['Freehold house', 'Townhouse / cluster', 'Apartment', 'Commercial'] },
    { id: 'q-finance', label: 'Is finance pre-approved?', options: ['Yes, pre-approved', 'In application', 'Not yet'] },
  ],
  retention: null,
};

export const DEMO_LOW_BUSINESS = {
  createdAt: null,
  industryId: 'salon',
  industryName: 'Salon & Beauty',
  mode: 'low',
  name: 'Studio Lavish',
  productService: 'Hair styling, nails & beauty treatments',
  offer: 'First-visit 20% off — quote EBEN20',
  audience: 'Local clients who book regularly',
  location: 'Rosebank, Johannesburg',
  primary: '#7A3E5B',
  secondary: '#C8401C',
  services: [
    { name: 'Cut & style', price: 'R280', note: '45 min' },
    { name: 'Full colour', price: 'R620', note: '90 min' },
    { name: 'Manicure & gel', price: 'R240', note: '50 min' },
  ],
  qualQuestions: null,
  retention: { cadence: 'Every 4–6 weeks', loyalty: '10 points per visit · 100 points = free cut & style' },
};
