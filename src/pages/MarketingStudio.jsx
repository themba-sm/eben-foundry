import { useEffect, useState } from 'react';
import { useBusiness } from '../lib/store.jsx';
import { Btn, Badge, Card, Field, Input, TextArea, ColorInput, Tabs, Toast } from '../components/ui.jsx';

const TABS = [
  { id: 'social', label: 'Social media ad' },
  { id: 'offer', label: 'Promotional offer' },
  { id: 'landing', label: 'Landing-page hero' },
  { id: 'whatsapp', label: 'WhatsApp CTA' },
  { id: 'campaign', label: 'Lead-gen campaign' },
];

function couponCode(name) {
  const base = (name || 'EBEN').replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase() || 'EBEN';
  return `${base}-${String(1000 + (name ? name.length * 37 : 0)).slice(0, 4)}`;
}

function initials(name) {
  return (name || 'EF')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export default function MarketingStudio() {
  const { business } = useBusiness();
  const [form, setForm] = useState({
    name: '', primary: '#15171C', secondary: '#C8401C',
    product: '', offer: '', audience: '', cta: 'Book now',
  });
  const [seeded, setSeeded] = useState(false);
  const [tab, setTab] = useState('social');
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (business && !seeded) {
      setForm({
        name: business.name,
        primary: business.primary,
        secondary: business.secondary,
        product: business.productService,
        offer: business.offer,
        audience: business.audience,
        cta: 'Book now',
      });
      setSeeded(true);
    }
  }, [business, seeded]);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target ? e.target.value : e }));
  const valid = form.name.trim() && form.product.trim() && form.offer.trim();

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const copy = (text) => {
    const done = () => notify('Copied to clipboard.');
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => window.prompt('Copy this:', text));
    } else {
      window.prompt('Copy this:', text);
    }
  };

  const adCopy = `${form.offer} — ${form.product} at ${form.name}.`;

  return (
    <div className="container page">
      <div className="page-head">
        <div className="row-between">
          <span className="eyebrow">Marketing Studio</span>
          <Badge variant="preview" dot>Preview — simulated output</Badge>
        </div>
        <h1 className="display">Business information in. Marketing concepts out.</h1>
        <p className="lede">
          The Studio demonstrates the chain: business information → brand configuration → marketing
          concept → lead / sales workflow. Not a design tool — a demonstration of how configuration
          becomes demand.
        </p>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: 'minmax(320px, 2fr) minmax(360px, 3fr)', alignItems: 'start' }}>
        {/* Inputs */}
        <Card pad className="stack">
          <div>
            <div className="card-title">Brand & offer inputs</div>
            <div className="card-sub">
              {business ? 'Pre-filled from your simulator configuration.' : 'No active configuration — enter details manually or run the Business Simulator.'}
            </div>
          </div>
          <Field label="Business name" required>
            <Input value={form.name} onChange={update('name')} placeholder="e.g. Studio Lavish" />
          </Field>
          <div className="grid-2">
            <ColorInput label="Primary colour" value={form.primary} onChange={(v) => setForm((f) => ({ ...f, primary: v }))} />
            <ColorInput label="Secondary colour" value={form.secondary} onChange={(v) => setForm((f) => ({ ...f, secondary: v }))} />
          </div>
          <Field label="Product / service" required>
            <Input value={form.product} onChange={update('product')} placeholder="e.g. Hair styling & beauty treatments" />
          </Field>
          <Field label="Offer" required>
            <TextArea value={form.offer} onChange={update('offer')} placeholder="e.g. First-visit 20% off" />
          </Field>
          <Field label="Target customer">
            <Input value={form.audience} onChange={update('audience')} placeholder="e.g. Local clients who book regularly" />
          </Field>
          <Field label="Call to action">
            <Input value={form.cta} onChange={update('cta')} placeholder="e.g. Book now" />
          </Field>
          {!valid && <span className="field-error">Business name, product and offer are required to generate previews.</span>}
        </Card>

        {/* Previews */}
        <Card pad className="stack-lg">
          <Tabs items={TABS} active={tab} onChange={setTab} />

          {!valid ? (
            <div className="empty" style={{ padding: '40px 16px' }}>
              <div className="empty-glyph">✎</div>
              <div className="empty-title">Fill in the inputs to generate previews</div>
              <p className="empty-msg">Business name, product and offer are the minimum needed for every preview below.</p>
            </div>
          ) : tab === 'social' ? (
            <div className="stack" style={{ gap: 14 }}>
              <div className="ad-frame">
                <div style={{ background: form.primary, color: '#fff', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 38, height: 38, borderRadius: '50%', background: form.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#fff' }}>
                    {initials(form.name)}
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{form.name}</div>
                    <div style={{ fontSize: 11, opacity: 0.75 }}>Sponsored · Demo ad preview</div>
                  </div>
                </div>
                <div style={{ padding: '20px' }} className="stack">
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 21, lineHeight: 1.25 }}>{form.offer}</div>
                  <p className="sub" style={{ fontSize: 13.5 }}>
                    {form.product}{form.audience ? ` — made for ${form.audience.toLowerCase()}` : ''}.
                  </p>
                  <Btn variant="accent" style={{ background: form.secondary, alignSelf: 'flex-start' }}>{form.cta} →</Btn>
                </div>
              </div>
              <div className="row">
                <Badge variant="preview">Social ad preview</Badge>
                <Btn variant="outline" size="sm" onClick={() => copy(`${form.offer}\n${form.product}${form.audience ? ' — made for ' + form.audience.toLowerCase() : ''}.\n${form.cta}: [your link]`)}>Copy ad text</Btn>
              </div>
            </div>
          ) : tab === 'offer' ? (
            <div className="stack" style={{ gap: 14 }}>
              <div className="coupon" style={{ color: form.primary, background: 'var(--surface)' }}>
                <span className="coupon-cut left" /><span className="coupon-cut right" />
                <span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, color: form.secondary }}>Limited-time offer</span>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 24, margin: '8px 0' }}>{form.offer}</div>
                <p className="sub" style={{ fontSize: 13 }}>{form.product} at {form.name}</p>
                <div style={{ marginTop: 14, display: 'inline-block', border: '1.5px dashed ' + form.secondary, borderRadius: 8, padding: '7px 16px', fontFamily: 'var(--font-body)', fontWeight: 700, letterSpacing: '0.06em', color: form.secondary }}>
                  {couponCode(form.name)}
                </div>
              </div>
              <div className="row">
                <Badge variant="preview">Promotional offer preview</Badge>
                <Btn variant="outline" size="sm" onClick={() => copy(`${form.offer} at ${form.name}. Use code ${couponCode(form.name)} — ${form.cta}.`)}>Copy offer text</Btn>
              </div>
            </div>
          ) : tab === 'landing' ? (
            <div className="stack" style={{ gap: 14 }}>
              <div className="browser-frame">
                <div className="bf-bar">
                  <span className="bf-dot" /><span className="bf-dot" /><span className="bf-dot" />
                  <span className="bf-url">{form.name.toLowerCase().replace(/[^a-z0-9]+/g, '')}.co.za/{form.cta.toLowerCase().replace(/\s+/g, '-')}</span>
                </div>
                <div style={{ padding: '34px 28px' }} className="stack">
                  <span className="eyebrow" style={{ color: form.secondary }}>{form.name}</span>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 30, lineHeight: 1.15, maxWidth: 420 }}>
                    {form.offer}
                  </div>
                  <p className="sub" style={{ maxWidth: 400 }}>
                    {form.product}{form.audience ? ` for ${form.audience.toLowerCase()}` : ''}. {form.cta} in under a minute.
                  </p>
                  <div className="row">
                    <Btn variant="accent" style={{ background: form.primary }}>{form.cta}</Btn>
                    <Btn variant="outline">See how it works</Btn>
                  </div>
                  <div className="row" style={{ gap: 20, paddingTop: 8 }}>
                    {['Capture form', 'Instant confirmation', 'Follow-up sequence'].map((f) => (
                      <span key={f} className="sub small"><strong style={{ color: 'var(--ok)' }}>✓</strong> {f}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="row">
                <Badge variant="preview">Landing-page hero preview</Badge>
                <Btn variant="outline" size="sm" onClick={() => copy(`${form.offer}\n${form.product}${form.audience ? ' for ' + form.audience.toLowerCase() : ''}.\n${form.cta} in under a minute.`)}>Copy hero copy</Btn>
              </div>
            </div>
          ) : tab === 'whatsapp' ? (
            <div className="stack" style={{ gap: 14 }}>
              <div className="phone">
                <div className="phone-head" style={{ background: '#075E54', color: '#fff' }}>
                  <span className="phone-avatar" style={{ background: form.primary }}>{initials(form.name)}</span>
                  <div>
                    <div className="phone-title">{form.name}</div>
                    <div className="phone-subtitle">WhatsApp Business · Demo preview</div>
                  </div>
                </div>
                <div className="phone-body">
                  <div className="bubble bubble-in">Hi! I saw your ad — “{form.offer}”. Is that still on?</div>
                  <div className="bubble bubble-out">
                    Absolutely! {form.product}. Would you like me to {form.cta.toLowerCase()} for you right now?
                  </div>
                  <div className="bubble bubble-in">Yes please 👍</div>
                  <div className="bubble bubble-out">
                    Done — you're confirmed. You'll get a reminder before your slot, and 10 loyalty points have been added.
                  </div>
                </div>
              </div>
              <div className="row" style={{ justifyContent: 'center' }}>
                <Badge variant="preview">WhatsApp-style CTA preview</Badge>
                <Btn variant="outline" size="sm" onClick={() => copy(`Hi! Thanks for your interest in ${form.name}. ${form.offer} — shall I ${form.cta.toLowerCase()} for you right now?`)}>Copy CTA script</Btn>
              </div>
            </div>
          ) : (
            <div className="stack" style={{ gap: 14 }}>
              <div className="grid-2">
                <div className="stack" style={{ gap: 6 }}>
                  <span className="eyebrow">Campaign objective</span>
                  <strong style={{ fontSize: 14 }}>Generate qualified leads for “{form.offer}”</strong>
                </div>
                <div className="stack" style={{ gap: 6 }}>
                  <span className="eyebrow">Audience</span>
                  <strong style={{ fontSize: 14 }}>{form.audience || 'Your defined target customer'}</strong>
                </div>
              </div>
              <div className="stack" style={{ gap: 8, background: 'var(--surface-2)', borderRadius: 10, padding: 16 }}>
                {[
                  ['1. Attract', `Social ad + landing hero promote “${form.offer}”.`],
                  ['2. Capture', `Enquiry form or WhatsApp CTA records the lead.`],
                  ['3. Qualify', `Lead scored on budget, need, timeline and intent.`],
                  ['4. Convert', `${form.cta} — booked, followed up and tracked to a decision.`],
                ].map(([step, desc]) => (
                  <div key={step} className="row" style={{ gap: 10 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: form.secondary, minWidth: 96 }}>{step}</span>
                    <span className="sub" style={{ fontSize: 13 }}>{desc}</span>
                  </div>
                ))}
              </div>
              <div className="row">
                <Badge variant="preview">Lead-generation campaign preview</Badge>
                <Badge variant="demo">Expected outcomes are illustrative</Badge>
                <Btn variant="outline" size="sm" onClick={() => copy(`Campaign: ${form.offer}\nObjective: qualified leads for ${form.product}\nAudience: ${form.audience || 'target customer'}\nFlow: ad → landing hero → capture → qualification → ${form.cta}`)}>Copy campaign brief</Btn>
              </div>
            </div>
          )}

          <div className="notice">
            <span aria-hidden>ⓘ</span>
            <span>
              Every preview is generated from configuration alone — no design skills required. In
              production, these connect to live channels and real measurement. Here they are
              labelled PREVIEW and simulated.
            </span>
          </div>
        </Card>
      </div>

      <Toast message={toast} />
    </div>
  );
}
