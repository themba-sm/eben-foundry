import { useMemo, useState } from 'react';
import { Link } from '../lib/router.jsx';
import { useBusiness, DEMO_HIGH_BUSINESS, makeBusiness } from '../lib/store.jsx';
import { QUAL_OPTIONS, LEAD_STATUSES, scoreLead, statusFromScore, MODES, industryById } from '../data/industries.js';

// New → cool and unworked. Qualified → warming up. High Intent → hottest,
// the site's red accent. Booked/Won → success green. Lost → the danger tone.
const STATUS_TINT = {
  new: 'info',
  qualified: 'warn',
  'high-intent': 'accent',
  booked: 'ok',
  won: 'ok',
  lost: 'bad',
};
import { DEMO_LEADS } from '../data/demo.js';
import { Btn, Badge, Card, Field, Input, Select, Modal, Stat, EmptyState, Progress, Toast, SectionTitle } from '../components/ui.jsx';

let nextId = 1;

function scorePill(score) {
  const cls = score >= 80 ? 'score-high' : score >= 60 ? 'score-mid' : 'score-low';
  return <span className={`score-pill ${cls}`}>{score}/100</span>;
}

export default function HighTicket() {
  const { business, setBusiness } = useBusiness();

  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '', need: '', budget: '', timeline: '', intent: '', location: '' });
  const [custom, setCustom] = useState({});
  const [errors, setErrors] = useState({});
  const [bookingLead, setBookingLead] = useState(null);
  const [bookingForm, setBookingForm] = useState({ date: '', time: '09:00' });
  const [bookingError, setBookingError] = useState('');
  const [toast, setToast] = useState('');

  const industry = business ? industryById(business.industryId) : null;
  const services = (business?.services || []).map((s) => (typeof s === 'string' ? s : s.name));
  const qualQuestions = business?.qualQuestions || industry?.qualQuestions || [];

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2400);
  };

  const loadDemo = () => {
    setBusiness(makeBusiness({ ...DEMO_HIGH_BUSINESS }));
    setLeads(DEMO_LEADS.map((l) => ({ ...l })));
    setForm({ name: '', phone: '', need: '', budget: '', timeline: '', intent: '', location: '' });
    setCustom({});
    notify('Demo business and sample leads loaded.');
  };

  const update = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const captureLead = (e) => {
    e.preventDefault();
    const er = {};
    if (!form.name.trim()) er.name = 'Name is required.';
    if (!form.phone.trim()) er.phone = 'A contact number is required.';
    if (!form.need) er.need = 'Select what they need.';
    if (!form.budget) er.budget = 'Budget range is required.';
    if (!form.timeline) er.timeline = 'Timeline is required.';
    if (!form.intent) er.intent = 'Intent is required.';
    if (!form.location) er.location = 'Location is required.';
    setErrors(er);
    if (Object.keys(er).length) return;

    const score = scoreLead({ need: form.need, services, budget: form.budget, timeline: form.timeline, intent: form.intent, location: form.location });
    const status = statusFromScore(score);
    const lead = {
      id: `lead-${nextId++}`,
      ...form,
      custom: { ...custom },
      score,
      status,
      followups: [],
      appointment: null,
    };
    setLeads((ls) => [lead, ...ls]);
    setForm({ name: '', phone: '', need: '', budget: '', timeline: '', intent: '', location: '' });
    setCustom({});
    notify(`Lead captured — score ${score}/100 (${LEAD_STATUSES.find((s) => s.id === status).label}).`);
  };

  const moveLead = (id, status) => {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
    notify(`Moved to ${LEAD_STATUSES.find((s) => s.id === status).label}.`);
  };

  const logFollowup = (id) => {
    setLeads((ls) =>
      ls.map((l) =>
        l.id === id
          ? { ...l, followups: [...l.followups, { at: 'Just now', note: 'Follow-up logged — contact attempted.' }] }
          : l
      )
    );
    notify('Follow-up logged.');
  };

  const confirmBooking = () => {
    if (!bookingForm.date.trim()) {
      setBookingError('Enter an appointment date — e.g. "Thu 10:00" or "12 Sep".');
      return;
    }
    setBookingError('');
    setLeads((ls) =>
      ls.map((l) =>
        l.id === bookingLead.id
          ? { ...l, status: 'booked', appointment: { date: `${bookingForm.date} at ${bookingForm.time}`, note: '' } }
          : l
      )
    );
    setBookingLead(null);
    setBookingForm({ date: '', time: '09:00' });
    notify('Appointment booked — status updated.');
  };

  const stats = useMemo(() => {
    const total = leads.length;
    const qualified = leads.filter((l) => ['qualified', 'high-intent', 'booked', 'won'].includes(l.status)).length;
    const booked = leads.filter((l) => l.status === 'booked').length;
    const won = leads.filter((l) => l.status === 'won').length;
    const rate = total ? Math.round((won / total) * 100) : 0;
    const avg = total ? Math.round(leads.reduce((a, l) => a + l.score, 0) / total) : 0;
    return { total, qualified, booked, won, rate, avg };
  }, [leads]);

  /* ---------- No configuration yet ---------- */
  if (!business || business.mode !== 'high') {
    return (
      <div className="container page">
        <div className="page-head">
          <span className="eyebrow">High-Ticket Engine</span>
          <h1 className="display">Capture. Qualify. Book. Convert.</h1>
          <p className="lede">
            {business && business.mode === 'low'
              ? `Your active configuration (${business.name}) is a low-ticket business — this engine runs on a high-ticket configuration.`
              : 'This engine runs on a high-ticket business configuration — real estate, law, dealerships, construction, professional services.'}
          </p>
        </div>
        <Card>
          <EmptyState
            glyph="HT"
            title="No high-ticket business configured yet"
            message="Run Build Your System to configure one, or load a demo business with sample leads to see the full workflow immediately."
            actions={[
              <Link key="sim" to="simulator"><Btn variant="accent">Configure a business</Btn></Link>,
              <Btn key="demo" variant="outline" onClick={loadDemo}>Load demo business + leads</Btn>,
            ]}
          />
        </Card>
      </div>
    );
  }

  /* ---------- Engine ---------- */
  return (
    <div className="container page">
      <div className="page-head">
        <div className="row-between">
          <span className="eyebrow">High-Ticket Engine · {business.name}</span>
          <div className="row">
            <Badge variant={business.mode === 'high' ? 'accent' : 'ok'}>{MODES[business.mode].label}</Badge>
            <Badge variant="demo" dot>Browser-session demo</Badge>
          </div>
        </div>
        <h1 className="display" style={{ fontSize: 34 }}>
          Attract → Capture → Qualify → Book → Follow up → Convert
        </h1>
        <p className="lede">
          Every lead is scored out of 100 on budget, need, location, timeline and intent — the system
          decides how seriously to take it before you spend a minute on it.
        </p>
      </div>

      <div className="grid-4" style={{ marginBottom: 24 }}>
        <Stat value={stats.total} label="Leads captured" note="This session" />
        <Stat value={`${stats.avg}/100`} label="Average lead score" note="Qualification model" />
        <Stat value={stats.booked} label="Appointments booked" />
        <Stat value={`${stats.rate}%`} label="Conversion rate" note={`${stats.won} won of ${stats.total}`} />
      </div>

      <div className="split">
        {/* Capture + qualification form */}
        <Card pad className="stack-lg">
          <div>
            <div className="card-title">Capture a lead & qualify in one motion</div>
            <div className="card-sub">Simulates a website enquiry form + the qualification call.</div>
          </div>
          <form onSubmit={captureLead} className="stack" style={{ gap: 14 }}>
            <div className="grid-2">
              <Field label="Full name" required error={errors.name}>
                <Input value={form.name} onChange={update('name')} invalid={!!errors.name} placeholder="e.g. Thandi Mokoena" />
              </Field>
              <Field label="Phone" required error={errors.phone}>
                <Input value={form.phone} onChange={update('phone')} invalid={!!errors.phone} placeholder="+27 82 000 0000" />
              </Field>
            </div>
            <div className="grid-2">
              <Field label="Need / service" required error={errors.need}>
                <Select value={form.need} onChange={update('need')} invalid={!!errors.need}>
                  <option value="">Select…</option>
                  {services.map((s) => <option key={s} value={s}>{s}</option>)}
                  <option value="Other">Other</option>
                </Select>
              </Field>
              <Field label="Budget range" required error={errors.budget}>
                <Select value={form.budget} onChange={update('budget')} invalid={!!errors.budget}>
                  <option value="">Select…</option>
                  {QUAL_OPTIONS.budget.map((o) => <option key={o.label} value={o.label}>{o.label}</option>)}
                </Select>
              </Field>
              <Field label="Timeline" required error={errors.timeline}>
                <Select value={form.timeline} onChange={update('timeline')} invalid={!!errors.timeline}>
                  <option value="">Select…</option>
                  {QUAL_OPTIONS.timeline.map((o) => <option key={o.label} value={o.label}>{o.label}</option>)}
                </Select>
              </Field>
              <Field label="Intent" required error={errors.intent}>
                <Select value={form.intent} onChange={update('intent')} invalid={!!errors.intent}>
                  <option value="">Select…</option>
                  {QUAL_OPTIONS.intent.map((o) => <option key={o.label} value={o.label}>{o.label}</option>)}
                </Select>
              </Field>
            </div>
            <Field label="Location" required error={errors.location}>
              <Select value={form.location} onChange={update('location')} invalid={!!errors.location}>
                <option value="">Select…</option>
                {QUAL_OPTIONS.location.map((o) => <option key={o.label} value={o.label}>{o.label}</option>)}
              </Select>
            </Field>

            {qualQuestions.map((q) => (
              <Field key={q.id} label={`${q.label} (industry-specific qualification)`}>
                <Select
                  value={custom[q.id] || ''}
                  onChange={(e) => setCustom((c) => ({ ...c, [q.id]: e.target.value }))}
                >
                  <option value="">Select…</option>
                  {q.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </Select>
              </Field>
            ))}

            <div className="row">
              <Btn type="submit" variant="accent">Capture & score lead</Btn>
              {leads.length === 0 && (
                <Btn type="button" variant="outline" onClick={() => { setLeads(DEMO_LEADS.map((l) => ({ ...l }))); notify('Sample demo leads loaded.'); }}>
                  Load sample leads
                </Btn>
              )}
            </div>
          </form>
        </Card>

        {/* How scoring works */}
        <Card pad className="stack">
          <div>
            <div className="card-title">How the system decides</div>
            <div className="card-sub">The qualification model, transparently.</div>
          </div>
          {[
            ['Budget', 25, 'R100,000+ scores full marks'],
            ['Timeline', 20, '"This month" scores full marks'],
            ['Intent', 20, '"Ready to engage now" scores full marks'],
            ['Need match', 20, 'Exact service match scores full marks'],
            ['Location', 15, '"In the target area" scores full marks'],
          ].map(([label, max, note]) => (
            <div key={label} className="stack" style={{ gap: 5 }}>
              <div className="row-between" style={{ fontSize: 13 }}>
                <strong>{label}</strong>
                <span className="sub mono">max {max}</span>
              </div>
              <Progress value={max} max={25} ink />
              <span className="sub small">{note}</span>
            </div>
          ))}
          <div className="notice">
            <span aria-hidden>ⓘ</span>
            <span>80+ is flagged High Intent · 60–79 Qualified · below 60 stays New. Scoring is demonstrated logic, not a live credit decision.</span>
          </div>
        </Card>
      </div>

      {/* Pipeline */}
      <div style={{ marginTop: 40, marginBottom: 16 }}>
        <SectionTitle
          eyebrow="Pipeline"
          title="Every lead, worked to a decision."
          sub="Move leads through stages, book appointments, log follow-ups. Nothing sits still."
        />
      </div>
      {leads.length === 0 ? (
        <Card>
          <EmptyState
            glyph="≡"
            title="The pipeline is empty"
            message="Capture a lead on the left, or load the sample demo leads to see the full workflow."
          />
        </Card>
      ) : (
        <div className="pipeline">
          {LEAD_STATUSES.map((status) => {
            const col = leads.filter((l) => l.status === status.id);
            const tint = STATUS_TINT[status.id] || 'info';
            return (
              <div className={`pipe-col pipe-col--${tint}`} key={status.id}>
                <div className={`pipe-head pipe-head--${tint}`}>
                  <span>{status.label}</span>
                  <span className="pipe-count">{col.length}</span>
                </div>
                {col.map((lead) => (
                  <div key={lead.id} className="card lead-card">
                    <div className="row-between">
                      <span className="lead-name">{lead.name}</span>
                      {scorePill(lead.score)}
                    </div>
                    <div className="lead-meta">
                      <span>Need: {lead.need}</span>
                      <span>{lead.budget} · {lead.timeline}</span>
                      {lead.appointment && <span style={{ color: 'var(--ok)', fontWeight: 600 }}>Booked: {lead.appointment.date}</span>}
                    </div>
                    {lead.followups.length > 0 && (
                      <div className="followup-log">
                        {lead.followups.slice(-2).map((f, i) => (
                          <span key={i}><strong>{f.at}</strong> — {f.note}</span>
                        ))}
                      </div>
                    )}
                    <div className="lead-actions">
                      <Select value={lead.status} onChange={(e) => moveLead(lead.id, e.target.value)} aria-label="Move lead">
                        {LEAD_STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                      </Select>
                      {['qualified', 'high-intent'].includes(lead.status) && (
                        <Btn variant="accent" size="sm" onClick={() => { setBookingLead(lead); setBookingForm({ date: '', time: '09:00' }); setBookingError(''); }}>
                          Book appointment
                        </Btn>
                      )}
                      <Btn variant="outline" size="sm" onClick={() => logFollowup(lead.id)}>
                        Log follow-up
                      </Btn>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {bookingLead && (
        <Modal
          title={`Book an appointment — ${bookingLead.name}`}
          sub={`Score ${bookingLead.score}/100 · ${bookingLead.need}`}
          onClose={() => setBookingLead(null)}
        >
          <div className="stack">
            <Field label="Date" required error={bookingError}>
              <Input
                value={bookingForm.date}
                invalid={!!bookingError}
                onChange={(e) => { setBookingForm((b) => ({ ...b, date: e.target.value })); setBookingError(''); }}
                placeholder="e.g. Thu 12 Sep"
              />
            </Field>
            <Field label="Time">
              <Select value={bookingForm.time} onChange={(e) => setBookingForm((b) => ({ ...b, time: e.target.value }))}>
                {['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
            </Field>
            <Btn variant="accent" onClick={confirmBooking}>Confirm booking</Btn>
            <span className="sub small">Demo action — the lead moves to “Appointment Booked”.</span>
          </div>
        </Modal>
      )}

      <Toast message={toast} />
    </div>
  );
}
