import { Link } from '../lib/router.jsx';
import { Btn, Badge, Card, SectionTitle } from '../components/ui.jsx';

export default function About() {
  return (
    <div className="container-narrow page">
      <div className="page-head">
        <span className="eyebrow">About</span>
        <h1 className="display">Eben Foundry is growth infrastructure, not another tool.</h1>
        <p className="lede">
          Most businesses are sold software by category — a CRM here, a booking app there, a
          website somewhere else. Eben Foundry starts from a different premise: the mechanics of
          growth are common, and what changes per business is configuration.
        </p>
      </div>

      <Card pad className="stack-lg" style={{ marginBottom: 20 }}>
        <div>
          <Badge variant="accent">The thesis</Badge>
          <h2 className="display" style={{ marginTop: 10, fontSize: 24 }}>
            “Different businesses have different growth mechanics, but they can run on the same
            underlying growth infrastructure.”
          </h2>
        </div>
        <div className="grid-2">
          <div className="stack">
            <strong>High-ticket businesses sell a considered purchase.</strong>
            <p className="sub">
              Fewer, larger deals. The system must capture interest, qualify it seriously — budget,
              need, timeline, intent — book appointments and follow up until a decision.
            </p>
          </div>
          <div className="stack">
            <strong>Low-ticket businesses sell a habit.</strong>
            <p className="sub">
              Many, smaller transactions. The system must showcase the offer, make booking
              effortless, remind customers at the right cadence and turn one visit into repeat.
            </p>
          </div>
        </div>
        <p className="sub">
          Same engine underneath: capture, configuration, workflow, marketing, measurement. This
          application demonstrates that premise end to end.
        </p>
      </Card>

      <SectionTitle
        eyebrow="Honesty about scope"
        title="What is real, and what is demonstration."
        sub="This is the Summit Experience MVP. It proves the thesis; it is not yet the full platform."
      />
      <Card pad className="stack">
        <div className="stack" style={{ gap: 8 }}>
          <strong style={{ fontSize: 14 }}>Working in this demo</strong>
          <span className="sub">
            Business configuration, lead capture and qualification scoring, pipeline management,
            booking, retention workflows, marketing previews and readiness scoring — all functional
            in your browser session, on simulated data.
          </span>
        </div>
        <div className="stack" style={{ gap: 8 }}>
          <strong style={{ fontSize: 14 }}>Simulated, clearly labelled</strong>
          <span className="sub">
            The Opportunity Network (demo supplier records), the Impact Dashboard (illustrative
            pilot targets), verification statuses and every metric labelled DEMO or PREVIEW.
            Nothing here is a real verification, a real transaction or a real achievement.
          </span>
        </div>
        <div className="stack" style={{ gap: 8 }}>
          <strong style={{ fontSize: 14 }}>Deliberately out of scope</strong>
          <span className="sub">
            Payments, messaging integrations, real AI model calls, multi-user accounts and live
            institutional connections. The foundation comes first; breadth follows.
          </span>
        </div>
      </Card>

      <Card pad className="spread" style={{ marginTop: 20, marginBottom: 8 }}>
        <div className="stack" style={{ maxWidth: 420 }}>
          <h3 className="display">See the thesis in action.</h3>
          <p className="sub">Configure a business and watch the same engine adapt to it.</p>
        </div>
        <Link to="simulator"><Btn variant="accent" size="lg">Build Your Business System →</Btn></Link>
      </Card>
    </div>
  );
}
