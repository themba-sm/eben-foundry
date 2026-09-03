import { Link } from '../lib/router.jsx';
import { Btn, Badge, Card, SectionTitle } from '../components/ui.jsx';
import { MODES } from '../data/industries.js';

const MODULES = [
  { id: 'simulator', title: 'Build Your Business System', desc: 'The flagship journey: your business in, a configured growth system out — in about 3 minutes.' },
  { id: 'high-ticket', title: 'High-Ticket Engine', desc: 'Capture, qualify, score, book, follow up and convert considered purchases.' },
  { id: 'low-ticket', title: 'Low-Ticket Engine', desc: 'Showcase, book, remind and retain everyday, repeat demand.' },
  { id: 'marketing', title: 'Marketing Studio', desc: 'Turn business information and brand colours into marketing previews.' },
  { id: 'readiness', title: 'Readiness Assessment', desc: 'Score seven growth-readiness areas and get recommended next actions.' },
  { id: 'network', title: 'Opportunity Network', desc: 'A demonstration of verified suppliers meeting buyer requirements. Demo data.' },
  { id: 'impact', title: 'Impact Dashboard', desc: 'Illustrative pilot targets for the programme. Not real achievements.' },
];

export default function Home() {
  return (
    <div className="container page">
      {/* Hero */}
      <section style={{ padding: '72px 0 64px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
        <div className="reveal">
          <span className="eyebrow">Business growth infrastructure</span>
        </div>
        <h1 className="display reveal reveal-1" style={{ maxWidth: 780, margin: '0 auto' }}>
          Turn your business into a growth system.
        </h1>
        <p className="lede reveal reveal-2" style={{ textAlign: 'center', margin: '0 auto' }}>
          Different businesses grow differently — but they can run on the same underlying
          infrastructure. Eben Foundry configures one engine to the way your business actually sells.
        </p>
        <div className="row reveal reveal-3" style={{ justifyContent: 'center' }}>
          <Link to="simulator"><Btn variant="accent" size="lg">Build Your Business System →</Btn></Link>
          <Link to="high-ticket"><Btn variant="outline" size="lg">See a live demo</Btn></Link>
        </div>
        <div className="row reveal reveal-4" style={{ justifyContent: 'center', gap: 10 }}>
          <Badge variant="demo" dot>Summit demo</Badge>
          <span className="sub">A complete journey takes about 2–4 minutes.</span>
        </div>
      </section>

      {/* Thesis */}
      <section style={{ padding: '8px 0 60px' }}>
        <SectionTitle
          eyebrow="The thesis"
          title="One engine. Many business models."
          sub="The same capture, qualification, booking, retention and marketing infrastructure — configured to the mechanics of how each kind of business sells."
          center
        />
        <div className="grid-2">
          <Card pad hover className="stack-lg">
            <div className="card-head">
              <div>
                <Badge variant="accent">High-Ticket</Badge>
                <h3 className="display" style={{ marginTop: 12 }}>Considered, high-value purchases</h3>
              </div>
            </div>
            <p className="sub">
              Real estate, law, dealerships, construction, professional services. Long cycles, few
              deals, every lead must be qualified and worked.
            </p>
            <div className="row">
              {MODES.high.workflow.map((s, i) => (
                <span key={s.id} className="chip">{i + 1}. {s.label}</span>
              ))}
            </div>
            <Link to="high-ticket"><Btn variant="outline">Open the High-Ticket Engine</Btn></Link>
          </Card>
          <Card pad hover className="stack-lg">
            <div className="card-head">
              <div>
                <Badge variant="ok">Low-Ticket / High-Frequency</Badge>
                <h3 className="display" style={{ marginTop: 12 }}>Everyday, repeat demand</h3>
              </div>
            </div>
            <p className="sub">
              Salons, barbers, gyms, restaurants, retail, e-commerce. Short cycles, many
              transactions, the win is bringing people back.
            </p>
            <div className="row">
              {MODES.low.workflow.map((s, i) => (
                <span key={s.id} className="chip">{i + 1}. {s.label}</span>
              ))}
            </div>
            <Link to="low-ticket"><Btn variant="outline">Open the Low-Ticket Engine</Btn></Link>
          </Card>
        </div>
      </section>

      {/* Modules */}
      <section style={{ padding: '8px 0 24px' }}>
        <SectionTitle
          eyebrow="What you can do here"
          title="Seven modules. One system."
          sub="Every screen is an interactive demonstration, not a brochure. Pick any module and complete a journey."
        />
        <div className="grid-3">
          {MODULES.map((m, i) => (
            <Link to={m.id} key={m.id}>
              <Card pad hover className="stack reveal" style={{ height: '100%' }}>
                <span className="eyebrow" style={{ fontSize: 10 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="card-title">{m.title}</div>
                <p className="sub" style={{ flex: 1 }}>{m.desc}</p>
                <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 13 }}>Open module →</span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '48px 0 8px' }}>
        <Card pad style={{ display: 'flex', gap: 26, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 34, flexWrap: 'wrap' }}>
            {[
              ['1. Configure', 'Choose an industry, name your business, define an offer.'],
              ['2. See your system', 'The engine builds the workflow your business needs.'],
              ['3. Watch it run', 'Capture, qualify, book, retain — in minutes, on demo data.'],
            ].map(([t, d]) => (
              <div key={t} className="stack" style={{ gap: 6, maxWidth: 230 }}>
                <strong style={{ fontSize: 14.5 }}>{t}</strong>
                <span className="sub">{d}</span>
              </div>
            ))}
          </div>
          <Link to="simulator">
            <Btn variant="accent" size="lg">Start now →</Btn>
          </Link>
        </Card>
      </section>
    </div>
  );
}
