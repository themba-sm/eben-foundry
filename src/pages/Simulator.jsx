import { useEffect, useRef, useState } from 'react';
import { Link } from '../lib/router.jsx';
import { useBusiness, makeBusiness } from '../lib/store.jsx';
import { INDUSTRIES, MODES, industryById } from '../data/industries.js';
import { Btn, Badge, Card, Field, Input, Select, TextArea, ColorInput, Segmented, Stepper, Progress } from '../components/ui.jsx';

const STEPS = ['Industry', 'Business model', 'Business details', 'Build'];
const DEFAULT_PRIMARY = '#15171C';
const DEFAULT_SECONDARY = '#C8401C';

const BUILD_STAGES = [
  'Reading industry configuration…',
  'Configuring capture infrastructure…',
  'Generating qualification logic…',
  'Preparing marketing templates…',
  'Calibrating retention workflows…',
  'System ready.',
];

export default function Simulator() {
  const { setBusiness, clearBusiness, business: existing } = useBusiness();
  const [step, setStep] = useState(0);
  const [industry, setIndustry] = useState(null);
  const [mode, setMode] = useState('high');
  const [form, setForm] = useState({
    name: '', productService: '', offer: '', audience: '', location: '',
    primary: DEFAULT_PRIMARY, secondary: DEFAULT_SECONDARY,
  });
  const [errors, setErrors] = useState({});
  const [building, setBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [result, setResult] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const pickIndustry = (ind) => {
    setIndustry(ind);
    setMode(ind.mode);
    setErrors({});
    setStep(1);
  };

  const update = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target ? e.target.value : e }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validateDetails = () => {
    const er = {};
    if (!form.name.trim()) er.name = 'Give the business a name.';
    if (!form.productService.trim()) er.productService = 'Name a product or service to build around.';
    if (!form.offer.trim()) er.offer = 'Define a basic offer — what moves someone to act?';
    if (!form.location.trim()) er.location = 'Where does this business operate?';
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const startBuild = () => {
    if (!validateDetails()) return;
    setStep(3);
    setBuilding(true);
    setBuildProgress(0);
    const started = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - started;
      const pct = Math.min(100, Math.round((elapsed / 2000) * 100));
      setBuildProgress(pct);
      if (pct >= 100) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        const config = makeBusiness({
          industryId: industry.id,
          industryName: industry.name,
          mode,
          name: form.name.trim(),
          productService: form.productService.trim(),
          offer: form.offer.trim(),
          audience: form.audience.trim() || industry.audience,
          location: form.location.trim(),
          primary: form.primary,
          secondary: form.secondary,
          services: industry.services,
          qualQuestions: mode === 'high' ? industry.qualQuestions || [] : null,
          retention: mode === 'low' ? industry.retention : null,
        });
        setBusiness(config);
        setResult(config);
        setBuilding(false);
      }
    }, 120);
  };

  const reset = () => {
    clearBusiness();
    setIndustry(null); setStep(0); setResult(null);
    setForm({ name: '', productService: '', offer: '', audience: '', location: '', primary: DEFAULT_PRIMARY, secondary: DEFAULT_SECONDARY });
    setErrors({}); setBuildProgress(0);
  };

  /* ---------- Result blueprint ---------- */
  if (result) {
    const wf = MODES[result.mode].workflow;
    return (
      <div className="container page">
        <div className="page-head">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <span className="eyebrow">System blueprint — generated</span>
            <Badge variant="demo" dot>Simulated configuration</Badge>
          </div>
          <h1 className="display">{result.name} runs on the {MODES[result.mode].label} engine.</h1>
          <p className="lede">
            {result.industryName} · {result.location} · Offer: “{result.offer}”
          </p>
        </div>

        <Card pad className="stack-lg reveal" style={{ marginBottom: 20 }}>
          <div className="row-between">
            <div className="row">
              <span className="swatch"><span className="swatch-dot" style={{ background: result.primary }} /> Primary</span>
              <span className="swatch"><span className="swatch-dot" style={{ background: result.secondary }} /> Secondary</span>
            </div>
            <div className="row">
              <Badge variant={result.mode === 'high' ? 'accent' : 'ok'}>{MODES[result.mode].label}</Badge>
              <Badge variant="muted">{result.industryName}</Badge>
            </div>
          </div>
          <div>
            <div className="card-title">The growth workflow configured for this business</div>
            <div className="sub">The engine assembles the stages your business model actually needs.</div>
          </div>
          <div className="grid-3">
            {wf.map((s, i) => (
              <div key={s.id} className="stage" style={{ borderLeftColor: i === 0 ? 'var(--accent)' : 'var(--ink)' }}>
                <span className="stage-num">STAGE {i + 1}</span>
                <span className="stage-label">{s.label}</span>
                <span className="stage-desc">{s.description}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid-2" style={{ marginBottom: 20 }}>
          {result.mode === 'high' ? (
            <Card pad className="stack">
              <div>
                <div className="card-title">Qualification logic enabled</div>
                <div className="card-sub">Every lead is scored out of 100 before it takes your time.</div>
              </div>
              <div className="stack" style={{ gap: 6 }}>
                {['Budget', 'Need', 'Location', 'Timeline', 'Intent', ...(result.qualQuestions || []).map((q) => q.label)].map((q) => (
                  <div key={q} className="row" style={{ gap: 8 }}>
                    <span style={{ color: 'var(--ok)', fontWeight: 700 }}>✓</span>
                    <span style={{ fontSize: 13.5 }}>{q}</span>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card pad className="stack">
              <div>
                <div className="card-title">Retention system enabled</div>
                <div className="card-sub">Repeat demand, handled on a cadence.</div>
              </div>
              <div className="row">
                <span className="chip">Reminder cadence: {result.retention?.cadence || 'Every 4 weeks'}</span>
                <span className="chip">{result.retention?.loyalty || 'Loyalty points on every visit'}</span>
              </div>
            </Card>
          )}
          <Card pad className="stack">
            <div>
              <div className="card-title">Marketing Studio, pre-configured</div>
              <div className="card-sub">Your brand colours and offer flow into every preview.</div>
            </div>
            <div className="row">
              <span className="chip-strong" style={{ background: result.primary }}>{result.name}</span>
              <span className="chip" style={{ borderColor: result.secondary, color: result.secondary }}>{result.offer}</span>
            </div>
          </Card>
        </div>

        <Card pad className="spread">
          <div className="row">
            <Link to={result.mode === 'high' ? 'high-ticket' : 'low-ticket'}>
              <Btn variant="accent" size="lg">Open the {MODES[result.mode].label} Engine →</Btn>
            </Link>
            <Link to="marketing"><Btn variant="outline" size="lg">Open Marketing Studio</Btn></Link>
          </div>
          <Btn variant="ghost" onClick={reset}>Start over</Btn>
        </Card>
      </div>
    );
  }

  /* ---------- Build animation ---------- */
  if (step === 3 && building) {
    const stage = BUILD_STAGES[Math.min(BUILD_STAGES.length - 1, Math.floor((buildProgress / 100) * BUILD_STAGES.length))];
    return (
      <div className="container-narrow page" style={{ paddingTop: 120 }}>
        <div className="stack-lg" style={{ textAlign: 'center', alignItems: 'center' }}>
          <span className="eyebrow">Building your growth system</span>
          <h1 className="display" style={{ fontSize: 34 }}>One moment — configuring the engine.</h1>
          <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Progress value={buildProgress} />
            <span className="sub mono" style={{ textAlign: 'right' }}>{buildProgress}%</span>
          </div>
          <div className="stack" style={{ alignItems: 'center', gap: 6 }}>
            <span className="sub" style={{ fontWeight: 600, color: 'var(--ink)' }}>
              <span className="building-dot" />{stage}
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Wizard ---------- */
  return (
    <div className="container-narrow page">
      <div className="page-head">
        <span className="eyebrow">Business Simulator</span>
        <h1 className="display">Configure a business. Watch one engine adapt to it.</h1>
        <p className="lede">
          Choose an industry, confirm the business model, define an offer — Eben Foundry generates
          the growth system around it.
        </p>
      </div>

      <Card pad className="stack-lg">
        <Stepper steps={STEPS} current={step} />

        {step === 0 && (
          <div className="stack">
            <div>
              <div className="card-title">Choose an industry</div>
              <div className="card-sub">
                The classification — high-ticket or low-ticket — is derived from how the industry sells.
              </div>
            </div>
            <div className="grid-3">
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind.id}
                  className="card card-pad card-hover stack reveal"
                  style={{ cursor: 'pointer', textAlign: 'left', border: '1px solid var(--line)', background: 'var(--surface)' }}
                  onClick={() => pickIndustry(ind)}
                >
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16 }}>{ind.name}</span>
                  <Badge variant={ind.mode === 'high' ? 'accent' : 'ok'}>
                    {ind.mode === 'high' ? 'High-Ticket' : 'Low-Ticket'}
                  </Badge>
                  <span className="sub" style={{ fontSize: 12.5 }}>{ind.audience}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && industry && (
          <div className="stack-lg">
            <div>
              <div className="card-title">{industry.name} is classified as {MODES[industry.mode].label}</div>
              <div className="card-sub">{MODES[industry.mode].description}</div>
            </div>
            <div className="row" style={{ gap: 8 }}>
              {MODES[industry.mode].workflow.map((s, i) => (
                <span key={s.id} className="chip">{i + 1}. {s.label}</span>
              ))}
            </div>
            <div className="stack">
              <span className="field-label">Override the classification (optional)</span>
              <Segmented
                options={[
                  { id: 'high', label: 'High-Ticket' },
                  { id: 'low', label: 'Low-Ticket' },
                ]}
                value={mode}
                onChange={setMode}
              />
              <span className="sub small">
                The engine adapts either way — that is the point. {mode !== industry.mode && ' Using an override mode for this industry.'}
              </span>
            </div>
            <div className="row">
              <Btn variant="ghost" onClick={() => setStep(0)}>← Back</Btn>
              <Btn variant="accent" onClick={() => setStep(2)}>Continue →</Btn>
            </div>
          </div>
        )}

        {step === 2 && industry && (
          <div className="stack-lg">
            <div>
              <div className="card-title">Tell the system about the business</div>
              <div className="card-sub">Everything here flows into the engines and the Marketing Studio.</div>
            </div>
            <div className="grid-2">
              <Field label="Business name" required error={errors.name}>
                <Input value={form.name} onChange={update('name')} invalid={!!errors.name} placeholder="e.g. Meridian Property Group" />
              </Field>
              <Field label="Industry" >
                <Input value={industry.name} disabled />
              </Field>
              <Field label="Product or service" required error={errors.productService}>
                <Input value={form.productService} onChange={update('productService')} invalid={!!errors.productService} placeholder="e.g. Residential property sales" />
              </Field>
              <Field label="Location" required error={errors.location}>
                <Input value={form.location} onChange={update('location')} invalid={!!errors.location} placeholder="e.g. Sandton, Johannesburg" />
              </Field>
            </div>
            <Field label="Basic offer" required error={errors.offer} help>
              <TextArea value={form.offer} onChange={update('offer')} invalid={!!errors.offer} placeholder="What gets someone to act? e.g. Free valuation within 48 hours" />
            </Field>
            <Field label="Target customer (optional)">
              <Input value={form.audience} onChange={update('audience')} placeholder={`Defaults to: ${industry.audience}`} />
            </Field>
            <div className="grid-2">
              <ColorInput label="Primary brand colour" value={form.primary} onChange={(v) => setForm((f) => ({ ...f, primary: v }))} />
              <ColorInput label="Secondary brand colour" value={form.secondary} onChange={(v) => setForm((f) => ({ ...f, secondary: v }))} />
            </div>
            {existing && (
              <div className="notice">
                <span aria-hidden>ⓘ</span>
                <span>Building a new system replaces the current configuration ({existing.name}).</span>
              </div>
            )}
            <div className="row">
              <Btn variant="ghost" onClick={() => setStep(1)}>← Back</Btn>
              <Btn variant="accent" size="lg" onClick={startBuild}>Build My Growth System</Btn>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
