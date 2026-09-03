import { useState } from 'react';
import { DEMO_SUPPLIERS, SUPPLIER_CATEGORIES } from '../data/demo.js';
import { Btn, Badge, Card, Field, Input, Select, EmptyState, Progress, SectionTitle } from '../components/ui.jsx';

const CAPACITIES = ['Any', 'Small (up to 50 units equivalent)', 'Medium (50–500 units equivalent)', 'Large (500+ units equivalent)'];
const READINESS_LEVELS = ['Any', 'Above 50', 'Above 70', 'Above 85'];

function verificationBadge(status) {
  if (status === 'Verified') return <Badge variant="ok">Verified</Badge>;
  if (status === 'Pending') return <Badge variant="warn">Verification pending</Badge>;
  return <Badge variant="bad">Unverified</Badge>;
}

export default function Network() {
  const [req, setReq] = useState({
    category: '',
    location: '',
    capacity: 'Any',
    readiness: 'Any',
    verifiedOnly: false,
  });
  const [matches, setMatches] = useState(null);

  const findSuppliers = (e) => {
    e.preventDefault();
    const minReadiness = { Any: 0, 'Above 50': 51, 'Above 70': 71, 'Above 85': 86 }[req.readiness] || 0;
    const results = DEMO_SUPPLIERS
      .filter((s) => (req.category ? s.category === req.category : true))
      .filter((s) =>
        req.location.trim()
          ? s.location.toLowerCase().includes(req.location.trim().toLowerCase())
          : true
      )
      .filter((s) => (req.capacity !== 'Any' ? s.capacity === req.capacity : true))
      .filter((s) => s.readiness >= minReadiness)
      .filter((s) => (req.verifiedOnly ? s.verified === 'Verified' : true))
      .map((s) => {
        const reasons = [];
        if (req.category && s.category === req.category) reasons.push('Category match');
        if (req.location.trim() && s.location.toLowerCase().includes(req.location.trim().toLowerCase())) reasons.push('Location match');
        if (req.capacity !== 'Any' && s.capacity === req.capacity) reasons.push('Capacity match');
        if (s.verified === 'Verified') reasons.push('Verified');
        reasons.push(`Readiness ${s.readiness}%`);
        return { ...s, reasons };
      })
      .sort((a, b) => b.readiness - a.readiness);
    setMatches(results);
  };

  const update = (k) => (e) => setReq((r) => ({ ...r, [k]: e.target ? e.target.value : e }));

  return (
    <div className="container page">
      <div className="page-head">
        <div className="row-between">
          <span className="eyebrow">Opportunity Network</span>
          <Badge variant="demo" dot>Demonstration only — seeded demo data</Badge>
        </div>
        <h1 className="display">Where verified businesses meet institutional demand.</h1>
        <p className="lede">
          A future-facing demonstration of how businesses that have been verified and measured for
          readiness could connect with institutional opportunities. Enter a buyer requirement and
          the network returns suitable, verified suppliers.
        </p>
      </div>

      <div className="notice" style={{ marginBottom: 24 }}>
        <span aria-hidden>ⓘ</span>
        <span>
          All suppliers below are seeded DEMO DATA. Verification and readiness statuses are
          illustrative and are not real vetting outcomes. This module demonstrates the concept of
          the Opportunity Network only.
        </span>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: 'minmax(300px, 2fr) minmax(340px, 3fr)', alignItems: 'start' }}>
        <Card pad className="stack">
          <div>
            <div className="card-title">Demo buyer requirement</div>
            <div className="card-sub">What does the buyer need? The network matches it.</div>
          </div>
          <form onSubmit={findSuppliers} className="stack" style={{ gap: 14 }}>
            <Field label="Category required">
              <Select value={req.category} onChange={update('category')}>
                <option value="">Any category</option>
                {SUPPLIER_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Location / region">
              <Input value={req.location} onChange={update('location')} placeholder="e.g. Gauteng (or leave blank)" />
            </Field>
            <Field label="Capacity needed">
              <Select value={req.capacity} onChange={update('capacity')}>
                {CAPACITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Minimum readiness">
              <Select value={req.readiness} onChange={update('readiness')}>
                {READINESS_LEVELS.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
            <label className="check">
              <input
                type="checkbox"
                checked={req.verifiedOnly}
                onChange={(e) => setReq((r) => ({ ...r, verifiedOnly: e.target.checked }))}
              />
              Only show verified suppliers
            </label>
            <Btn type="submit" variant="accent">Find matching suppliers</Btn>
          </form>
        </Card>

        <div className="stack">
          {matches === null ? (
            <>
              <SectionTitle
                eyebrow="Supplier directory"
                title="Seeded demo suppliers"
                sub="Browse the directory, or submit a requirement to see matching."
              />
              <div className="grid-2">
                {DEMO_SUPPLIERS.map((s) => (
                  <SupplierCard key={s.id} supplier={s} />
                ))}
              </div>
            </>
          ) : matches.length === 0 ? (
            <Card>
              <EmptyState
                glyph="∅"
                title="No suppliers match this requirement"
                message="Adjust the filters — try widening the location, capacity or readiness thresholds."
                actions={[
                  <Btn key="all" variant="outline" onClick={() => setMatches(null)}>Back to full directory</Btn>,
                ]}
              />
            </Card>
          ) : (
            <>
              <SectionTitle
                eyebrow="Match results"
                title={`${matches.length} supplier${matches.length === 1 ? '' : 's'} meet this requirement`}
                sub="Ranked by readiness. Every record is demo data."
                action={<Btn variant="ghost" size="sm" onClick={() => setMatches(null)}>Clear results</Btn>}
              />
              <div className="grid-2">
                {matches.map((s) => (
                  <SupplierCard key={s.id} supplier={s} reasons={s.reasons} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SupplierCard({ supplier, reasons = null }) {
  return (
    <Card pad hover className="supplier">
      <div className="card-head">
        <div>
          <div className="card-title" style={{ fontSize: 15.5 }}>{supplier.business}</div>
          <div className="card-sub">{supplier.category} · {supplier.location}</div>
        </div>
        {verificationBadge(supplier.verified)}
      </div>
      <div className="row">
        {supplier.capabilities.map((c) => (
          <span key={c} className="chip">{c}</span>
        ))}
      </div>
      <span className="sub small">Capacity: {supplier.capacity}</span>
      <div className="stack" style={{ gap: 5 }}>
        <div className="row-between" style={{ fontSize: 12 }}>
          <span className="sub">Readiness score</span>
          <span className="mono" style={{ fontWeight: 700 }}>{supplier.readiness}%</span>
        </div>
        <Progress value={supplier.readiness} />
      </div>
      {reasons && <div className="match-reason">✓ {reasons.join(' · ')}</div>}
      <Badge variant="demo">Demo data</Badge>
    </Card>
  );
}
