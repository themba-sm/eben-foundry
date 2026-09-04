import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from '../lib/router.jsx';
import { useBusiness, makeBusiness } from '../lib/store.jsx';
import { MODES, industryById } from '../data/industries.js';
import { READINESS_ACTIONS } from '../data/demo.js';
import { FLAGSHIP_INDUSTRIES, GENERIC_SERVICES, genLead, genCustomer, genSlot } from '../data/leadsim.js';
import {
  Btn, Badge, Card, Field, Input, TextArea, ColorInput, SectionTitle, Progress, Toast,
} from '../components/ui.jsx';
import { contrastText } from '../lib/color.js';

const STEP_LABELS = ['Business', 'Details', 'Model', 'Build', 'System', 'Simulation', 'Marketing', 'Readiness', 'Reveal'];

/* Smooth count-up for the qualification score. */
function useCountUp(target, ms = 600) {
  const [val, setVal] = useState(target);
  const prev = useRef(0);
  useEffect(() => {
    const from = prev.current;
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(from + (target - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
      else prev.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return val;
}

const HIGH_KEYWORDS = ['property', 'legal', 'law', 'contract', 'build', 'construction', 'consult', 'architect', 'engineer', 'audit', 'tender', 'vehicle', 'fleet', 'insurance', 'finance', 'solar', 'install'];
const LOW_KEYWORDS = ['salon', 'nail', 'hair', 'coffee', 'food', 'meal', 'clothing', 'retail', 'store', 'menu', 'delivery', 'bakery', 'barber', 'gym', 'cleaning', 'catering'];

function recommendMode(industry, product, offer) {
  if (industry && industry.mode) return industry.mode;
  const text = `${product} ${offer}`.toLowerCase();
  if (HIGH_KEYWORDS.some((k) => text.includes(k))) return 'high';
  if (LOW_KEYWORDS.some((k) => text.includes(k))) return 'low';
  return null;
}

export default function Simulator() {
  const { setBusiness, clearBusiness } = useBusiness();

  const [step, setStep] = useState(1);
  const [ind, setInd] = useState(null);
  const [customIndustry, setCustomIndustry] = useState('');
  const [details, setDetails] = useState({
    name: '', product: '', audience: '', location: '', offer: '',
    primary: '#15171C', secondary: '#C8401C',
  });
  const [errors, setErrors] = useState({});
  const [mode, setMode] = useState(null);

  // Build moment
  const [buildPct, setBuildPct] = useState(0);
  const [buildDone, setBuildDone] = useState(false);
  const timers = useRef([]);

  // High-ticket simulation
  const [lead, setLead] = useState(null);
  const [phase, setPhase] = useState(0);
  const [slot, setSlot] = useState(null);

  // Low-ticket simulation
  const [customer, setCustomer] = useState(null);
  const [lphase, setLPhase] = useState(0);

  // Studio / readiness
  const [studio, setStudio] = useState(null);
  const [studioTab, setStudioTab] = useState('social');
  const [rAnswers, setRAnswers] = useState({});
  const [toast, setToast] = useState('');

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const notify = (m) => { setToast(m); setTimeout(() => setToast(''), 2200); };

  /* ---------- Derived configuration ---------- */
  const industryName = ind
    ? (ind.id === 'other' ? (customIndustry.trim() || 'Your business') : ind.name)
    : '';
  const recommended = recommendMode(ind, details.product, details.offer);
  const refConfig = ind?.ref ? industryById(ind.ref) : null;
  const services = useMemo(() => {
    if (refConfig?.services?.length) return refConfig.services;
    if (ind?.id === 'other') return GENERIC_SERVICES;
    return [];
  }, [refConfig, ind]);

  const config = useMemo(() => ({
    industryId: ind?.ref || 'other',
    industryName,
    mode,
    name: details.name,
    productService: details.product,
    audience: details.audience,
    location: details.location,
    offer: details.offer,
    primary: details.primary,
    secondary: details.secondary,
    services,
    qualQuestions: mode === 'high' ? (refConfig?.qualQuestions || []) : null,
    retention: mode === 'low'
      ? (refConfig?.retention || { cadence: 'Every 4 weeks', loyalty: '10 points per visit · 100 points = a reward' })
      : null,
  }), [ind, customIndustry, mode, details, refConfig, services, industryName]);

  /* ---------- Step transitions ---------- */
  const pickIndustry = (industry) => {
    setInd(industry);
    if (industry.id !== 'other') {
      setDetails((d) => ({
        ...d,
        audience: industry.audience,
        offer: industry.offer,
        secondary: industry.secondary,
      }));
      const t = setTimeout(() => setStep(2), 260);
      timers.current.push(t);
    } else {
      setDetails((d) => ({ ...d }));
    }
  };

  const setDetail = (k) => (e) => {
    const v = e.target ? e.target.value : e;
    setDetails((f) => ({ ...f, [k]: v }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const continueDetails = () => {
    const er = {};
    if (!details.name.trim()) er.name = 'Give the business a name.';
    if (!details.product.trim()) er.product = 'What does it sell?';
    if (!details.location.trim()) er.location = 'Where does it operate?';
    if (!details.offer.trim()) er.offer = 'What offer gets someone to act?';
    setErrors(er);
    if (Object.keys(er).length) return;
    if (ind.id === 'other' && !customIndustry.trim()) {
      notify('Name your industry (or just describe it) to continue.');
      return;
    }
    setStep(3);
  };

  const startBuild = () => {
    setStep(4);
    setBuildPct(0);
    setBuildDone(false);
    const started = Date.now();
    const iv = setInterval(() => {
      const pct = Math.min(100, Math.round(((Date.now() - started) / 1500) * 100));
      setBuildPct(pct);
      if (pct >= 100) {
        clearInterval(iv);
        setBuildDone(true);
        setBusiness(makeBusiness(config));
        const t = setTimeout(() => setStep(5), 1100);
        timers.current.push(t);
      }
    }, 90);
  };

  const reset = () => {
    clearBusiness();
    setStep(1); setInd(null); setCustomIndustry('');
    setDetails({ name: '', product: '', audience: '', location: '', offer: '', primary: '#15171C', secondary: '#C8401C' });
    setErrors({}); setMode(null);
    setLead(null); setPhase(0); setSlot(null);
    setCustomer(null); setLPhase(0);
    setStudio(null); setRAnswers({});
  };

  const goto = (s) => { setStep(s); window.scrollTo({ top: 0 }); };

  /* ---------- Render ---------- */
  if (step === 4) {
    const lines = [
      'Reading industry configuration…',
      'Configuring capture infrastructure…',
      'Generating qualification logic…',
      'Calibrating marketing templates…',
      'System ready.',
    ];
    const activeLine = Math.min(lines.length - 1, Math.floor((buildPct / 100) * lines.length));
    return (
      <div className="container-narrow page" style={{ paddingTop: 110, paddingBottom: 110, textAlign: 'center' }}>
        <div className="stack-lg" style={{ alignItems: 'center' }}>
          {!buildDone ? (
            <>
              <span className="eyebrow">Building</span>
              <h1 className="display" style={{ fontSize: 'clamp(26px, 5vw, 42px)' }}>
                CONFIGURING YOUR EBEN SYSTEM…
              </h1>
              <div style={{ width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Progress value={buildPct} />
                <span className="sub mono">{buildPct}%</span>
              </div>
              <div className="stack" style={{ gap: 8, alignItems: 'center', minHeight: 90 }}>
                {lines.slice(0, activeLine + 1).map((l, i) => (
                  <span key={l} className={`build-stage-line field-pop ${i === activeLine ? 'on' : ''}`}>
                    <span className="building-dot" style={{ display: i === activeLine ? 'inline-block' : 'none' }} />
                    {l}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="stack-lg field-pop" style={{ alignItems: 'center' }}>
              <span className="eyebrow" style={{ color: 'var(--ok)' }}>Complete</span>
              <h1 className="display" style={{ fontSize: 'clamp(28px, 5.5vw, 48px)', color: 'var(--ink)' }}>
                YOUR BUSINESS SYSTEM IS READY.
              </h1>
              <div className="row" style={{ gap: 10 }}>
                <span className="swatch"><span className="swatch-dot" style={{ background: details.primary }} /> {industryName}</span>
                <span className="swatch"><span className="swatch-dot" style={{ background: details.secondary }} /> {details.name || 'Your business'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container-narrow page">
      {/* Step indicator */}
      <div className="row-between" style={{ marginBottom: 8 }}>
        <span className="eyebrow">Build Your Business System</span>
        <span className="sub mono small">STEP {step} OF 9 — {STEP_LABELS[step - 1]}</span>
      </div>
      <div className="flag-dots" style={{ marginBottom: 30 }}>
        {STEP_LABELS.map((_, i) => (
          <span key={i} className={`fdot ${step === i + 1 ? 'on' : ''}`} />
        ))}
      </div>

      {(step >= 5 && step <= 8) && (
        <div style={{ marginBottom: 18 }}>
          <Btn variant="ghost" size="sm" onClick={() => goto(step - 1)}>← Back</Btn>
        </div>
      )}

      <div key={step} className="panel">
        {/* ============ STEP 1 — CHOOSE YOUR BUSINESS ============ */}
        {step === 1 && (
          <div className="stack-lg">
            <div className="section-head" style={{ marginBottom: 0 }}>
              <h1 className="display" style={{ fontSize: 'clamp(30px, 4.5vw, 44px)' }}>Choose your business.</h1>
              <p className="lede">One decision and the engine starts adapting. Everything after this configures itself.</p>
            </div>
            <div className="ind-grid">
              {FLAGSHIP_INDUSTRIES.map((industry) => (
                <button
                  key={industry.id}
                  className={`ind-card ${ind?.id === industry.id ? 'selected' : ''}`}
                  onClick={() => pickIndustry(industry)}
                >
                  <span className="ind-glyph">{industry.glyph}</span>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{industry.name}</span>
                  {industry.mode && (
                    <span className="sub small">
                      {industry.mode === 'high' ? 'High-ticket' : 'Low-ticket'}
                    </span>
                  )}
                </button>
              ))}
            </div>
            {ind?.id === 'other' && (
              <Card pad className="stack field-pop">
                <Field label="What industry is your business in?">
                  <Input
                    value={customIndustry}
                    onChange={(e) => setCustomIndustry(e.target.value)}
                    placeholder="e.g. Driving school, Photography studio, Panel beaters…"
                    autoFocus
                  />
                </Field>
                <Btn variant="accent" onClick={() => setStep(2)}>Continue →</Btn>
              </Card>
            )}
          </div>
        )}

        {/* ============ STEP 2 — DEFINE THE BUSINESS ============ */}
        {step === 2 && (
          <div className="stack-lg">
            <div className="section-head" style={{ marginBottom: 0 }}>
              <h1 className="display" style={{ fontSize: 'clamp(30px, 4.5vw, 44px)' }}>
                Define {details.name ? details.name : 'your business'}.
              </h1>
              <p className="lede">
                {ind?.id === 'other'
                  ? `${customIndustry || 'Your business'} — seven quick fields, then the engine takes over.`
                  : `${ind?.name} — seven quick fields, then the engine takes over.`}
              </p>
            </div>
            <Card pad className="stack-lg">
              <div className="grid-2">
                <Field label="Business name" required error={errors.name}>
                  <Input value={details.name} onChange={setDetail('name')} invalid={!!errors.name} placeholder="e.g. Meridian Property Group" autoFocus />
                </Field>
                <Field label="Main product / service" required error={errors.product}>
                  <Input value={details.product} onChange={setDetail('product')} invalid={!!errors.product} placeholder="e.g. Residential property sales" />
                </Field>
                <Field label="Target customer">
                  <Input value={details.audience} onChange={setDetail('audience')} placeholder={ind?.audience || 'e.g. Local homeowners'} />
                </Field>
                <Field label="Location" required error={errors.location}>
                  <Input value={details.location} onChange={setDetail('location')} invalid={!!errors.location} placeholder="e.g. Sandton, Johannesburg" />
                </Field>
              </div>
              <Field label="Main offer" required error={errors.offer}>
                <TextArea value={details.offer} onChange={setDetail('offer')} invalid={!!errors.offer} placeholder="What gets someone to act? e.g. Free valuation within 48 hours" />
              </Field>
              <div className="grid-2">
                <ColorInput label="Primary brand colour" value={details.primary} onChange={setDetail('primary')} />
                <ColorInput label="Secondary brand colour" value={details.secondary} onChange={setDetail('secondary')} />
              </div>
              <div className="row">
                <Btn variant="ghost" onClick={() => goto(1)}>← Back</Btn>
                <Btn variant="accent" size="lg" onClick={continueDetails}>Continue →</Btn>
              </div>
            </Card>
          </div>
        )}

        {/* ============ STEP 3 — DETERMINE BUSINESS MODEL ============ */}
        {step === 3 && (
          <div className="stack-lg">
            <div className="section-head" style={{ marginBottom: 0 }}>
              <h1 className="display" style={{ fontSize: 'clamp(30px, 4.5vw, 44px)' }}>How does your business sell?</h1>
              <p className="lede">
                {recommended
                  ? `Based on how ${industryName} sells, we recommend the ${recommended === 'high' ? 'HIGH-TICKET' : 'LOW-TICKET'} model. You can override it.`
                  : "We don't know this industry yet — pick the model closest to your average transaction."}
              </p>
            </div>
            <div className="grid-2">
              {['high', 'low'].map((m) => (
                <button
                  key={m}
                  className={`mode-card ${mode === m ? 'selected' : ''}`}
                  onClick={() => setMode(m)}
                >
                  {recommended === m && <span className="mode-tag">Recommended</span>}
                  <Badge variant={m === 'high' ? 'accent' : 'ok'}>{m === 'high' ? 'High-Ticket' : 'Low-Ticket'}</Badge>
                  <span className="display" style={{ fontSize: 17 }}>
                    {m === 'high' ? 'Fewer customers. Higher-value transactions.' : 'More customers. Higher purchase frequency.'}
                  </span>
                  <span className="sub" style={{ fontSize: 13 }}>
                    {m === 'high'
                      ? 'Long considered cycles — the system qualifies, books and follows up.'
                      : 'Everyday repeat demand — the system showcases, books and brings them back.'}
                  </span>
                  <div className="row">
                    {MODES[m].workflow.slice(0, 3).map((s) => (
                      <span key={s.id} className="chip">{s.label}</span>
                    ))}
                    <span className="chip">…</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="row">
              <Btn variant="ghost" onClick={() => goto(2)}>← Back</Btn>
              <Btn variant="accent" size="lg" disabled={!mode} onClick={startBuild}>
                {mode ? 'Build my system' : 'Choose a model to continue'}
              </Btn>
            </div>
          </div>
        )}

        {/* ============ STEP 5 — PERSONALIZED SYSTEM ============ */}
        {step === 5 && (
          <div className="stack-lg">
            <Card pad style={{ background: details.primary, borderColor: details.primary, color: contrastText(details.primary) }} className="stack field-pop">
              <div className="row-between">
                <div>
                  <span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, opacity: 0.75 }}>
                    {industryName} · {MODES[mode].label}
                  </span>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(26px, 4.5vw, 40px)', marginTop: 6 }}>
                    {details.name}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 34, height: 34, borderRadius: '50%', background: details.secondary }} aria-hidden />
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: contrastText(details.primary) }}>
                    {initialsOf(details.name)}
                  </span>
                </div>
              </div>
            </Card>

            <div>
              <SectionTitle
                eyebrow={`Configured for ${details.name}`}
                title={`Your ${MODES[mode].label} workflow`}
                sub={mode === 'high'
                  ? 'The system will capture enquiries, score them on budget, need, timeline and intent, book the serious ones and follow up until decision.'
                  : 'The system will showcase your offer, take bookings, capture customers, remind them at the right cadence and turn visits into habit.'}
              />
              <div className="stage-track">
                {MODES[mode].workflow.map((s, i) => (
                  <div key={s.id} className={`stage-node done field-pop`} style={{ animationDelay: `${i * 0.12}s` }}>
                    {s.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid-3">
              <Card pad className="stack">
                <span className="eyebrow">Main offer</span>
                <span style={{ fontWeight: 600, fontSize: 14.5 }}>{details.offer}</span>
              </Card>
              <Card pad className="stack">
                <span className="eyebrow">Product / service</span>
                <span style={{ fontWeight: 600, fontSize: 14.5 }}>{details.product}</span>
              </Card>
              <Card pad className="stack">
                <span className="eyebrow">Target customer</span>
                <span style={{ fontWeight: 600, fontSize: 14.5 }}>{details.audience || 'As entered'}</span>
              </Card>
            </div>

            <Card pad className="spread">
              <p className="sub" style={{ maxWidth: 420 }}>
                Next: trigger the workflow yourself with a live simulation — no diagrams, real interactions.
              </p>
              <Btn variant="accent" size="lg" onClick={() => goto(6)}>Run the live simulation →</Btn>
            </Card>
          </div>
        )}

        {/* ============ STEP 6 — LIVE SIMULATION ============ */}
        {step === 6 && mode === 'high' && (
          <HighSim
            details={details}
            industryName={industryName}
            lead={lead}
            phase={phase}
            slot={slot}
            onSimulate={() => { setLead(genLead(services)); setPhase(1); }}
            onQualify={() => setPhase(2)}
            onBook={() => { setSlot(genSlot()); setPhase(3); }}
            onFollowUp={() => setPhase(4)}
            onConvert={() => setPhase(5)}
            onDone={() => goto(7)}
          />
        )}
        {step === 6 && mode === 'low' && (
          <LowSim
            details={details}
            config={config}
            industryName={industryName}
            customer={customer}
            phase={lphase}
            onSimulate={() => { setCustomer(genCustomer()); setLPhase(1); }}
            onViewOffer={() => setLPhase(2)}
            onBook={() => setLPhase(3)}
            onCapture={() => setLPhase(4)}
            onRemind={() => setLPhase(5)}
            onRepeat={() => setLPhase(6)}
            onDone={() => goto(7)}
          />
        )}

        {/* ============ STEP 7 — MARKETING STUDIO ============ */}
        {step === 7 && (
          <StudioStep
            initial={{
              name: details.name,
              product: details.product,
              price: '',
              offer: details.offer,
              primary: details.primary,
              secondary: details.secondary,
              cta: 'Book now',
            }}
            onDone={() => goto(8)}
          />
        )}

        {/* ============ STEP 8 — READINESS ============ */}
        {step === 8 && (
          <ReadinessStep
            mode={mode}
            answers={rAnswers}
            setAnswers={setRAnswers}
            onDone={() => goto(9)}
          />
        )}

        {/* ============ STEP 9 — THE REVEAL ============ */}
        {step === 9 && (
          <div className="stack-lg" style={{ textAlign: 'center', paddingTop: 30 }}>
            <span className="eyebrow">The experience, named</span>
            <h1 className="display reveal-word" style={{ fontSize: 'clamp(24px, 4.2vw, 40px)', maxWidth: 760, margin: '0 auto' }}>
              YOU JUST EXPERIENCED ONE ENGINE CONFIGURED FOR YOUR BUSINESS.
            </h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '26px 0' }}>
              <span className="display reveal-word field-pop" style={{ fontSize: 'clamp(20px, 3.2vw, 30px)' }}>ONE ENGINE</span>
              <span className="display reveal-word field-pop" style={{ fontSize: 'clamp(34px, 6vw, 64px)', color: details.secondary, animationDelay: '0.15s' }}>
                MANY BUSINESS MODELS.
              </span>
            </div>

            <div className="grid-2" style={{ textAlign: 'left' }}>
              <Card pad className="stack">
                <Badge variant="crimson">High-Ticket</Badge>
                <span className="display" style={{ fontSize: 17 }}>Lead → Qualification → Appointment → Conversion</span>
                <span className="sub small">Fewer customers, higher-value transactions — worked deliberately.</span>
              </Card>
              <Card pad className="stack">
                <Badge variant="ok">Low-Ticket</Badge>
                <span className="display" style={{ fontSize: 17 }}>Discovery → Purchase/Booking → Retention → Repeat</span>
                <span className="sub small">More customers, higher frequency — made effortless.</span>
              </Card>
            </div>

            <div className="stack field-pop" style={{ gap: 12, padding: '8px 0' }}>
              {[
                ['Today:', 'Business growth infrastructure.'],
                ['Next:', 'Business readiness + opportunity infrastructure.'],
                ['Long term:', 'Economic participation infrastructure.'],
              ].map(([k, v], i) => (
                <div key={k} className="row" style={{ justifyContent: 'center', gap: 10 }}>
                  <span className="sub small" style={{ fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{k}</span>
                  <span style={{ fontSize: i === 0 ? 16 : 14.5, fontWeight: i === 0 ? 600 : 500, color: i === 0 ? 'var(--ink)' : 'var(--muted)' }}>{v}</span>
                </div>
              ))}
            </div>

            <div className="row" style={{ justifyContent: 'center', paddingTop: 12 }}>
              <Link to={mode === 'high' ? 'high-ticket' : 'low-ticket'}>
                <Btn variant="accent">Explore the full {MODES[mode].label} Engine →</Btn>
              </Link>
              <Link to="about"><Btn variant="outline">About the thesis</Btn></Link>
              <Btn variant="ghost" onClick={reset}>Start over</Btn>
            </div>
          </div>
        )}
      </div>

      <Toast message={toast} />
    </div>
  );
}

function initialsOf(name) {
  return (name || 'EF').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

/* ================= HIGH-TICKET LIVE SIMULATION ================= */

function HighSim({ details, industryName, lead, phase, slot, onSimulate, onQualify, onBook, onFollowUp, onConvert, onDone }) {
  const displayScore = useCountUp(phase >= 2 ? lead?.score || 0 : 0, 700);
  const nodes = ['Attract', 'Capture', 'Qualify', 'Book', 'Follow Up', 'Convert'];
  const nodeDone = [phase >= 1, phase >= 1, phase >= 2, phase >= 3, phase >= 4, phase >= 5];

  const action = phase === 0 ? { label: 'SIMULATE NEW LEAD', fn: onSimulate }
    : phase === 1 ? { label: 'QUALIFY LEAD', fn: onQualify }
    : phase === 2 ? { label: 'BOOK APPOINTMENT', fn: onBook }
    : phase === 3 ? { label: 'TRIGGER FOLLOW-UP', fn: onFollowUp }
    : phase === 4 ? { label: 'CLOSE THE DEAL — CONVERT', fn: onConvert }
    : null;

  return (
    <div className="stack-lg">
      <div className="section-head" style={{ marginBottom: 0 }}>
        <h1 className="display" style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}>Live simulation: run the engine.</h1>
        <p className="lede">
          A realistic {industryName.toLowerCase()} lead arrives. Qualify it, book it, follow up, convert it — and watch it move.
        </p>
      </div>

      <div className="stage-track">
        {nodes.map((n, i) => (
          <div key={n} className={`stage-node ${nodeDone[i] ? 'done' : (phase === 0 && i === 0) || (phase < 5 && i === nodeDone.findIndex((d) => !d)) ? 'active' : ''}`}>
            {n}
          </div>
        ))}
      </div>

      <div className="grid-4">
        <Card pad className="stack" style={{ gap: 2 }}>
          <span className="stat-value mono" style={{ fontSize: 22 }}>{phase >= 1 ? 1 : 0}</span>
          <span className="stat-label">Leads captured</span>
        </Card>
        <Card pad className="stack" style={{ gap: 2 }}>
          <span className="stat-value mono" style={{ fontSize: 22, color: phase >= 2 ? 'var(--ink)' : 'var(--faint)' }}>{phase >= 2 ? 1 : 0}</span>
          <span className="stat-label">Qualified</span>
        </Card>
        <Card pad className="stack" style={{ gap: 2 }}>
          <span className="stat-value mono" style={{ fontSize: 22, color: phase >= 3 ? 'var(--ink)' : 'var(--faint)' }}>{phase >= 3 ? 1 : 0}</span>
          <span className="stat-label">Appointments</span>
        </Card>
        <Card pad className="stack" style={{ gap: 2 }}>
          <span className="stat-value mono" style={{ fontSize: 22, color: 'var(--ok)' }}>{phase >= 5 ? 1 : 0}</span>
          <span className="stat-label">Converted</span>
        </Card>
      </div>

      <Card pad className="stack-lg">
        {!lead ? (
          <div className="empty" style={{ padding: '38px 16px' }}>
            <div className="empty-glyph">→</div>
            <div className="empty-title">The engine is idle — generate a lead</div>
            <p className="empty-msg">One tap creates a realistic enquiry with source, need, budget, timeline and intent.</p>
          </div>
        ) : (
          <div className="grid-2" style={{ gridTemplateColumns: 'minmax(280px, 1fr) minmax(280px, 1fr)', alignItems: 'start' }}>
            {/* Lead card */}
            <div className="stack">
              <div className="row-between">
                <span className="lead-name" style={{ fontWeight: 700 }}>{lead.name}</span>
                <Badge variant="muted">Live demo lead</Badge>
              </div>
              {[
                ['Source', lead.source],
                ['Need', lead.need],
                ['Budget', lead.budget],
                ['Timeline', lead.timeline],
                ['Intent', lead.intent],
              ].slice(0, phase >= 1 ? 5 : 1).map(([k, v], i) => (
                <div key={k} className="row-between field-pop" style={{ animationDelay: `${i * 0.09}s`, fontSize: 13.5 }}>
                  <span className="sub">{k}</span>
                  <strong>{v}</strong>
                </div>
              ))}
            </div>

            {/* Qualification panel */}
            <div className="stack">
              {phase === 1 && <span className="sub small">Capture complete — qualify the lead to score it.</span>}
              {phase >= 2 && (
                <div className="field-pop stack" style={{ gap: 8 }}>
                  <div className="row-between">
                    <span className="eyebrow">Qualification score</span>
                    <span className={`score-pill ${lead.score >= 80 ? 'score-high' : 'score-mid'} mono`} style={{ fontSize: 14 }}>
                      {displayScore}/100
                    </span>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>
                    {lead.score >= 80 ? 'HIGH INTENT — prioritize immediately.' : 'QUALIFIED — worth a conversation.'}
                  </span>
                  <span className="sub small">
                    Scored on budget ({lead.budget}), timeline ({lead.timeline}), intent ({lead.intent}) and need match.
                  </span>
                </div>
              )}
              {phase >= 3 && (
                <div className="chat-bubble field-pop stack" style={{ gap: 4 }}>
                  <strong style={{ fontSize: 13.5 }}>Appointment booked</strong>
                  <span className="sub small">{slot} — confirmed to the client instantly (simulated).</span>
                </div>
              )}
              {phase >= 4 && (
                <div className="chat-bubble field-pop stack" style={{ gap: 4 }}>
                  <strong style={{ fontSize: 13.5 }}>Day 2 — Follow-up sent</strong>
                  <span className="sub small">"Hi {lead.name.split(' ')[0]}, confirming your slot for {slot}. Any questions before we finalise?" — replied within the hour (simulated).</span>
                </div>
              )}
              {phase >= 5 && (
                <div className="field-pop" style={{ background: 'var(--ok-soft)', border: '1px solid rgba(30,122,70,0.25)', borderRadius: 10, padding: '12px 14px' }}>
                  <strong style={{ fontSize: 14, color: 'var(--ok)' }}>CONVERTED — deal won.</strong>
                  <div className="sub small">The {industryName} lead became a customer of {details.name}. That is the engine working.</div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="row">
          {action ? (
            <Btn variant="accent" size="lg" onClick={action.fn} className="counter-pop" key={action.label}>
              {action.label}
            </Btn>
          ) : (
            <>
              <Btn variant="accent" size="lg" onClick={onDone}>Continue to Marketing Studio →</Btn>
              <span className="sub small">Simulated demonstration — leads are generated locally, instantly.</span>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

/* ================= LOW-TICKET LIVE SIMULATION ================= */

function LowSim({ details, config, industryName, customer, phase, onSimulate, onViewOffer, onBook, onCapture, onRemind, onRepeat, onDone }) {
  const nodes = ['Attract', 'Showcase', 'Book/Buy', 'Capture', 'Remind', 'Repeat'];
  const nodeDone = [phase >= 1, phase >= 2, phase >= 3, phase >= 4, phase >= 5, phase >= 6];
  const item = (config.services?.length ? config.services : ['Core product or service'])[0];
  const cadence = (config.retention?.cadence || 'Every 4 weeks').toLowerCase();
  const dayNum = cadence.startsWith('weekly') ? 7 : cadence.includes('week') ? 28 : 21;

  const action = phase === 0 ? { label: 'SIMULATE CUSTOMER', fn: onSimulate }
    : phase === 1 ? { label: 'VIEW OFFER', fn: onViewOffer }
    : phase === 2 ? { label: 'BOOK / BUY', fn: onBook }
    : phase === 3 ? { label: 'CUSTOMER CAPTURE', fn: onCapture }
    : phase === 4 ? { label: 'REMINDER', fn: onRemind }
    : phase === 5 ? { label: 'REPEAT VISIT', fn: onRepeat }
    : null;

  return (
    <div className="stack-lg">
      <div className="section-head" style={{ marginBottom: 0 }}>
        <h1 className="display" style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}>Live simulation: run the engine.</h1>
        <p className="lede">
          A customer discovers {details.name}, sees the offer, books — and the system schedules them back.
        </p>
      </div>

      <div className="stage-track">
        {nodes.map((n, i) => (
          <div key={n} className={`stage-node ${nodeDone[i] ? 'done' : (phase === 0 && i === 0) || (phase < 6 && i === nodeDone.findIndex((d) => !d)) ? 'active' : ''}`}>
            {n}
          </div>
        ))}
      </div>

      <div className="grid-4">
        {[
          [phase >= 1 ? 1 : 0, 'Customers reached'],
          [phase >= 3 ? 1 : 0, 'Bookings taken'],
          [phase >= 4 ? 10 : 0, 'Loyalty points'],
          [phase >= 6 ? 1 : 0, 'Repeat visits'],
        ].map(([v, l]) => (
          <Card pad key={l} className="stack" style={{ gap: 2 }}>
            <span className="stat-value mono" style={{ fontSize: 22 }}>{v}</span>
            <span className="stat-label">{l}</span>
          </Card>
        ))}
      </div>

      <Card pad className="stack-lg">
        {!customer ? (
          <div className="empty" style={{ padding: '38px 16px' }}>
            <div className="empty-glyph">→</div>
            <div className="empty-title">The engine is idle — simulate a customer</div>
            <p className="empty-msg">One tap creates a local customer discovering the business right now.</p>
          </div>
        ) : (
          <div className="stack-lg">
            <div className="row-between field-pop">
              <div className="row">
                <span style={{ width: 38, height: 38, borderRadius: '50%', background: details.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
                  {initialsOf(customer.name)}
                </span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>{customer.name}</div>
                  <div className="sub small">Discovered {details.name} via {customer.source}</div>
                </div>
              </div>
              <Badge variant="muted">Live demo customer</Badge>
            </div>

            {phase >= 2 && (
              <div className="field-pop" style={{ background: details.primary, color: contrastText(details.primary), borderRadius: 12, padding: '18px 20px' }}>
                <span style={{ fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, opacity: 0.75 }}>
                  {details.name} · current offer
                </span>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, marginTop: 4 }}>{details.offer}</div>
                <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>{details.product}</div>
              </div>
            )}

            {phase >= 3 && (
              <div className="chat-bubble field-pop stack" style={{ gap: 4 }}>
                <strong style={{ fontSize: 13.5 }}>Booked / purchased: {item}</strong>
                <span className="sub small">Booking confirmed for tomorrow — details sent via WhatsApp (simulated).</span>
              </div>
            )}

            {phase >= 4 && (
              <div className="field-pop" style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '6px 26px', background: 'var(--surface-2)', borderRadius: 10, padding: '12px 16px', width: 'fit-content' }}>
                <span className="sub small">Customer record created</span>
                <strong style={{ fontSize: 13.5 }}>{customer.name} · {customer.phone}</strong>
                <span className="sub small">Loyalty</span>
                <strong style={{ fontSize: 13.5 }}>10 points</strong>
              </div>
            )}

            {phase >= 5 && (
              <div className="chat-bubble field-pop stack" style={{ gap: 4 }}>
                <strong style={{ fontSize: 13.5 }}>Day {dayNum} — reminder sent</strong>
                <span className="sub small">
                  "Hi {customer.name.split(' ')[0]}! It's about time for your next visit — {details.offer} is on. Shall I book you in?" — {config.retention?.cadence || 'Every 4 weeks'} cadence (simulated).
                </span>
              </div>
            )}

            {phase >= 6 && (
              <div className="field-pop" style={{ background: 'var(--ok-soft)', border: '1px solid rgba(30,122,70,0.25)', borderRadius: 10, padding: '12px 14px' }}>
                <strong style={{ fontSize: 14, color: 'var(--ok)' }}>REPEAT VISIT — booked again.</strong>
                <div className="sub small">Second visit confirmed · 20 loyalty points · the habit loop is working. That is the engine.</div>
              </div>
            )}
          </div>
        )}

        <div className="row">
          {action ? (
            <Btn variant="accent" size="lg" key={action.label} className="counter-pop" onClick={action.fn}>
              {action.label}
            </Btn>
          ) : (
            <>
              <Btn variant="accent" size="lg" onClick={onDone}>Continue to Marketing Studio →</Btn>
              <span className="sub small">Simulated demonstration — customers are generated locally, instantly.</span>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

/* ================= STEP 7 — MARKETING STUDIO ================= */

function StudioStep({ initial, onDone }) {
  const [s, setS] = useState(initial);
  const [tab, setTab] = useState('social');
  const set = (k) => (e) => setS((f) => ({ ...f, [k]: e.target ? e.target.value : e }));
  const valid = s.name.trim() && s.offer.trim();

  const TABS = [
    { id: 'social', label: 'Social Ad' },
    { id: 'landing', label: 'Landing Page' },
    { id: 'promo', label: 'Promotion' },
    { id: 'whatsapp', label: 'WhatsApp CTA' },
  ];

  const code = `${(s.name || 'EBEN').replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase()}-2026`;

  return (
    <div className="stack-lg">
      <div className="section-head" style={{ marginBottom: 0 }}>
        <h1 className="display" style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}>Your brand, generating demand.</h1>
        <p className="lede">Change any input — the advertising preview updates instantly. This is configuration becoming marketing.</p>
      </div>

      <div className="split">
        <Card pad className="stack">
          <div className="card-title">Brand inputs</div>
          <div className="card-sub">Live — every keystroke re-renders the preview.</div>
          <Field label="Brand name"><Input value={s.name} onChange={set('name')} /></Field>
          <Field label="Product / service"><Input value={s.product} onChange={set('product')} /></Field>
          <Field label="Price"><Input value={s.price} onChange={set('price')} placeholder="e.g. R79.99" /></Field>
          <Field label="Offer"><Input value={s.offer} onChange={set('offer')} /></Field>
          <Field label="Call to action"><Input value={s.cta} onChange={set('cta')} /></Field>
          <div className="grid-2">
            <ColorInput label="Primary" value={s.primary} onChange={set('primary')} />
            <ColorInput label="Secondary" value={s.secondary} onChange={set('secondary')} />
          </div>
        </Card>

        <Card pad className="stack-lg">
          <div className="tabs">
            {TABS.map((t) => (
              <button key={t.id} type="button" className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>

          {!valid ? (
            <p className="sub">Brand name and offer are required for the preview.</p>
          ) : tab === 'social' ? (
            <div className="ad-frame field-pop" key={tab}>
              <div style={{ background: s.primary, color: contrastText(s.primary), padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 36, height: 36, borderRadius: '50%', background: s.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12.5, color: contrastText(s.secondary) }}>
                  {initialsOf(s.name)}
                </span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>{s.name}</div>
                  <div style={{ fontSize: 10.5, opacity: 0.75 }}>Sponsored · preview</div>
                </div>
              </div>
              <div style={{ padding: 18 }} className="stack">
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 20, lineHeight: 1.25 }}>{s.offer}</div>
                <p className="sub" style={{ fontSize: 13 }}>{s.product}{s.price ? ` · ${s.price}` : ''}</p>
                <Btn variant="accent" style={{ background: s.secondary, color: contrastText(s.secondary), alignSelf: 'flex-start' }}>{s.cta} →</Btn>
              </div>
            </div>
          ) : tab === 'landing' ? (
            <div className="browser-frame field-pop" key={tab}>
              <div className="bf-bar">
                <span className="bf-dot" /><span className="bf-dot" /><span className="bf-dot" />
                <span className="bf-url">{s.name.toLowerCase().replace(/[^a-z0-9]+/g, '')}.co.za</span>
              </div>
              <div style={{ padding: '28px 24px' }} className="stack">
                <span className="eyebrow" style={{ color: s.secondary }}>{s.name}</span>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 26, lineHeight: 1.15 }}>{s.offer}</div>
                <p className="sub">{s.product}{s.price ? ` — ${s.price}` : ''}</p>
                <div className="row">
                  <Btn variant="accent" style={{ background: s.primary, color: contrastText(s.primary) }}>{s.cta}</Btn>
                  <Btn variant="outline">Learn more</Btn>
                </div>
                <div className="row" style={{ gap: 16 }}>
                  {['Instant booking', 'Automatic reminders', 'Loyalty rewards'].map((f) => (
                    <span key={f} className="sub small"><strong style={{ color: 'var(--ok)' }}>✓</strong> {f}</span>
                  ))}
                </div>
              </div>
            </div>
          ) : tab === 'promo' ? (
            <div className="coupon field-pop" key={tab} style={{ color: s.primary }}>
              <span className="coupon-cut left" /><span className="coupon-cut right" />
              <span style={{ fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, color: s.secondary }}>Limited-time offer</span>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, margin: '8px 0' }}>{s.offer}</div>
              <p className="sub" style={{ fontSize: 13 }}>{s.product}{s.price ? ` · ${s.price}` : ''} at {s.name}</p>
              <div style={{ marginTop: 12, display: 'inline-block', border: '1.5px dashed ' + s.secondary, borderRadius: 8, padding: '6px 14px', fontWeight: 700, letterSpacing: '0.06em', color: s.secondary }}>
                {code}
              </div>
            </div>
          ) : (
            <div className="phone field-pop" key={tab}>
              <div className="phone-head" style={{ background: '#075E54', color: '#fff' }}>
                <span className="phone-avatar" style={{ background: s.primary, color: contrastText(s.primary) }}>{initialsOf(s.name)}</span>
                <div>
                  <div className="phone-title">{s.name}</div>
                  <div className="phone-subtitle">WhatsApp Business · preview</div>
                </div>
              </div>
              <div className="phone-body">
                <div className="bubble bubble-in">Hi! Is the "{s.offer}" still available?</div>
                <div className="bubble bubble-out">
                  It is! {s.product}{s.price ? ` at ${s.price}` : ''}. Would you like me to {s.cta.toLowerCase()} right now?
                </div>
                <div className="bubble bubble-in">Yes please 👍</div>
                <div className="bubble bubble-out">
                  Done — you're booked, and you'll get a reminder before your slot. See you then!
                </div>
              </div>
            </div>
          )}

          <div className="row">
            <Badge variant="preview" dot>Instant preview — simulated marketing concept</Badge>
          </div>
        </Card>
      </div>

      <div className="row">
        <Btn variant="accent" size="lg" onClick={onDone}>Continue to Readiness →</Btn>
      </div>
    </div>
  );
}

/* ================= STEP 8 — READINESS ================= */

const R_STATUS = {
  ready: { label: 'READY', cls: 'ok' },
  developing: { label: 'DEVELOPING', cls: 'warn' },
  attention: { label: 'NEEDS ATTENTION', cls: 'bad' },
};

function ReadinessStep({ mode, answers, setAnswers, onDone }) {
  const qs = [
    { id: 'digital', label: 'Does the business have a website or active social page?' },
    { id: 'capture', label: 'Can a customer enquire right now — and does it get recorded?' },
    { id: 'sales', label: mode === 'high'
      ? 'Do you ask about budget and timeline before quoting?'
      : 'Is there a defined path from interest to booking or purchase?' },
    { id: 'followup', label: 'Do you follow up after a purchase or visit?' },
    { id: 'marketing', label: 'Do you run offers and measure what they bring in?' },
  ];

  const answered = qs.every((q) => answers[q.id] !== undefined);
  const val = (id) => answers[id];

  const areas = useMemo(() => {
    const fromQ = (id) => (answers[id] === 2 ? 'ready' : answers[id] === 1 ? 'developing' : answers[id] === 0 ? 'attention' : null);
    const base = [
      { id: 'digital', label: 'Digital Presence', status: fromQ('digital') },
      { id: 'capture', label: 'Lead Capture', status: fromQ('capture') },
      { id: 'sales', label: 'Sales Process', status: fromQ('sales') },
      { id: 'followup', label: 'Follow-Up', status: fromQ('followup') },
      { id: 'marketing', label: 'Marketing', status: fromQ('marketing') },
    ];
    const cap = fromQ('capture'); const fu = fromQ('followup');
    let automation = 'developing';
    if (cap === 'ready' && fu === 'ready') automation = 'ready';
    else if (cap === 'attention' && fu === 'attention') automation = 'attention';
    const mkt = fromQ('marketing');
    let ai = 'developing';
    if (cap === 'ready' && mkt === 'ready') ai = 'ready';
    else if (cap === 'attention' && mkt === 'attention') ai = 'attention';
    base.push({ id: 'automation', label: 'Automation', status: automation, derived: true });
    base.push({ id: 'ai', label: 'AI Readiness', status: ai, derived: true });
    return base;
  }, [answers, mode]);

  return (
    <div className="stack-lg">
      <div className="section-head" style={{ marginBottom: 0 }}>
        <h1 className="display" style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}>Your readiness, summarised.</h1>
        <p className="lede">Five quick answers, two derived from them — the system maps where the business stands and what to fix first.</p>
      </div>

      <Card pad className="stack-lg">
        {qs.map((q) => (
          <div key={q.id} className="row-between" style={{ gap: 12, borderBottom: '1px solid var(--line)', paddingBottom: 12 }}>
            <span style={{ fontSize: 13.5, color: 'var(--ink-2)', flex: 1, minWidth: 210 }}>{q.label}</span>
            <div className="seg">
              {[['Yes', 2], ['Partly', 1], ['No', 0]].map(([label, pts]) => (
                <button key={label} type="button" className={answers[q.id] === pts ? 'active' : ''} onClick={() => setAnswers((a) => ({ ...a, [q.id]: pts }))} aria-label={q.label}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        ))}

        {!answered ? (
          <span className="sub small">Answer all five to generate the summary — it takes ten seconds.</span>
        ) : (
          <div className="grid-2 field-pop">
            {areas.map((a) => {
              const st = R_STATUS[a.status] || R_STATUS.developing;
              return (
                <div key={a.id} className="stack" style={{ gap: 6, background: 'var(--surface-2)', borderRadius: 10, padding: 16 }}>
                  <div className="row-between">
                    <strong style={{ fontSize: 14 }}>{a.label}</strong>
                    <Badge variant={st.cls}>{st.label}</Badge>
                  </div>
                  {a.status === 'attention' && (
                    <span className="sub small" style={{ color: 'var(--ink)' }}>Next action: {READINESS_ACTIONS[a.id]}</span>
                  )}
                  {a.derived && <span className="sub small" style={{ fontStyle: 'italic' }}>Derived from your answers</span>}
                </div>
              );
            })}
            <div className="notice" style={{ gridColumn: '1 / -1' }}>
              <span aria-hidden>ⓘ</span>
              <span>
                Generated from this session's configuration and quick answers. A directional summary —
                not a financial, legal, compliance or credit score.
              </span>
            </div>
          </div>
        )}

        <div className="row">
          <Btn variant="accent" size="lg" disabled={!answered} onClick={onDone}>
            {answered ? 'Complete the experience →' : 'Answer the five questions to continue'}
          </Btn>
        </div>
      </Card>
    </div>
  );
}
