import { useState } from 'react';
import { useHashRoute, Link } from './lib/router.jsx';
import { BusinessProvider, useBusiness } from './lib/store.jsx';
import { Badge } from './components/ui.jsx';
import Home from './pages/Home.jsx';
import Simulator from './pages/Simulator.jsx';
import HighTicket from './pages/HighTicket.jsx';
import LowTicket from './pages/LowTicket.jsx';
import MarketingStudio from './pages/MarketingStudio.jsx';
import Readiness from './pages/Readiness.jsx';
import Network from './pages/Network.jsx';
import Impact from './pages/Impact.jsx';
import About from './pages/About.jsx';

const NAV_ITEMS = [
  { id: 'home', label: 'Experience' },
  { id: 'simulator', label: 'Build Your System' },
  { id: 'high-ticket', label: 'High-Ticket Engine' },
  { id: 'low-ticket', label: 'Low-Ticket Engine' },
  { id: 'marketing', label: 'Marketing Studio' },
  { id: 'readiness', label: 'Readiness' },
  { id: 'network', label: 'Opportunity Network' },
  { id: 'impact', label: 'Impact' },
  { id: 'about', label: 'About' },
];

function Header({ route }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { business } = useBusiness();

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="home" className="brand">
          <img src="/brand/eben-mark.png" alt="Eben Foundry" className="brand-mark" />
          <span className="brand-name">Eben Foundry</span>
        </Link>
        <nav className="nav-links" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              to={item.id}
              className={`nav-link ${route === item.id ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          className={`burger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </div>
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.id}
            to={item.id}
            className={`nav-link ${route === item.id ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </div>
      {business && (
        <div style={{ borderTop: '1px solid var(--line)', background: 'var(--surface-2)' }}>
          <div className="container row" style={{ justifyContent: 'space-between', padding: '8px 24px', fontSize: 12 }}>
            <span className="row" style={{ gap: 8, color: 'var(--muted)' }}>
              <span
                className="swatch-dot"
                style={{ background: business.primary }}
                aria-hidden
              />
              Active configuration: <strong style={{ color: 'var(--ink)' }}>{business.name}</strong>
            </span>
            <span className="row" style={{ gap: 8 }}>
              <Badge variant={business.mode === 'high' ? 'crimson' : 'ok'}>
                {business.mode === 'high' ? 'High-Ticket' : 'Low-Ticket'}
              </Badge>
              <Badge variant="demo">Demo</Badge>
            </span>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="row-between">
          <Link to="home" className="brand">
            <img src="/brand/eben-mark.png" alt="Eben Foundry" className="brand-mark" />
            <span className="brand-name">Eben Foundry</span>
          </Link>
          <div className="footer-links">
            <Link to="simulator">Build Your System</Link>
            <Link to="readiness">Readiness</Link>
            <Link to="about">About</Link>
          </div>
        </div>
        <p className="footer-note">
          Eben Foundry is a summit demonstration of a modular business growth infrastructure — one
          engine, many business models. Interfaces and data labelled DEMO or PREVIEW are simulated
          for illustration and are not live functionality, real verification, or real analytics.
        </p>
        <p className="small" style={{ color: 'var(--faint)' }}>
          © {new Date().getFullYear()} Eben Foundry. Summit Experience MVP.
        </p>
      </div>
    </footer>
  );
}

const PAGES = {
  home: Home,
  simulator: Simulator,
  'high-ticket': HighTicket,
  'low-ticket': LowTicket,
  marketing: MarketingStudio,
  readiness: Readiness,
  network: Network,
  impact: Impact,
  about: About,
};

export default function App() {
  const [route] = useHashRoute();
  const Page = PAGES[route] || Home;

  return (
    <BusinessProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <a href="#main" className="skip-link">Skip to content</a>
        <Header route={PAGES[route] ? route : 'home'} />
        <main id="main" style={{ flex: 1 }}>
          <Page />
        </main>
        <Footer />
      </div>
    </BusinessProvider>
  );
}
