import { PILOT_METRICS } from '../data/demo.js';
import { Badge, Card, Progress, SectionTitle } from '../components/ui.jsx';
import { Link } from '../lib/router.jsx';
import { Btn } from '../components/ui.jsx';

export default function Impact() {
  return (
    <div className="container page">
      <div className="page-head">
        <div className="row-between">
          <span className="eyebrow">Impact Dashboard</span>
          <Badge variant="demo" dot>Illustrative pilot targets — not real achievements</Badge>
        </div>
        <h1 className="display">What the programme aims to move.</h1>
        <p className="lede">
          These are illustrative pilot targets for the Eben Foundry programme: what onboarding,
          qualification and connection could add up to at target cadence. They are not historical
          results, live figures or forecasts.
        </p>
      </div>

      <div className="notice" style={{ marginBottom: 24 }}>
        <span aria-hidden>ⓘ</span>
        <span>
          Every figure on this page is labelled DEMO / PILOT TARGETS. None of these numbers are real
          achievements, commitments or guarantees — they exist to show what the Impact Dashboard
          will measure in a live programme.
        </span>
      </div>

      <SectionTitle
        eyebrow="Pilot targets"
        title="Current pace vs programme targets"
        sub="Illustrative progress against a full-year pilot programme."
      />
      <div className="grid-3">
        {PILOT_METRICS.map((m) => {
          const pct = m.target ? Math.min(100, Math.round((m.value / m.target) * 100)) : 0;
          return (
            <Card key={m.id} pad hover className="stack" style={{ gap: 10 }}>
              <div className="row-between">
                <span className="stat-label" style={{ margin: 0 }}>{m.label}</span>
                <Badge variant="demo">Pilot target</Badge>
              </div>
              <div className="stat-value mono" style={{ fontSize: 24 }}>
                {m.display ?? `${m.value}${m.unit}`}
              </div>
              <div className="stack" style={{ gap: 5 }}>
                <div className="row-between" style={{ fontSize: 11.5 }}>
                  <span className="sub mono">{pct}% of target</span>
                  <span className="sub mono">Target: {m.targetDisplay ?? `${m.target}${m.unit}`}</span>
                </div>
                <Progress value={pct} />
              </div>
            </Card>
          );
        })}
      </div>

      <Card pad className="spread" style={{ marginTop: 32 }}>
        <div className="stack" style={{ maxWidth: 420 }}>
          <h3 className="display">The metrics follow the thesis.</h3>
          <p className="sub">
            Businesses onboarded → leads generated → qualified leads → appointments → opportunities →
            contracts. One system, measured end to end.
          </p>
        </div>
        <Link to="simulator"><Btn variant="accent" size="lg">See the system that produces it →</Btn></Link>
      </Card>
    </div>
  );
}
