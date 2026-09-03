import { useMemo, useState } from 'react';
import { Link } from '../lib/router.jsx';
import { useBusiness, DEMO_LOW_BUSINESS, makeBusiness } from '../lib/store.jsx';
import { MODES, industryById } from '../data/industries.js';
import { DEMO_CUSTOMERS, DEMO_CAMPAIGNS } from '../data/demo.js';
import { Btn, Badge, Card, Field, Input, Select, Modal, Stat, EmptyState, Toast, SectionTitle } from '../components/ui.jsx';

let nextId = 100;

export default function LowTicket() {
  const { business, setBusiness } = useBusiness();

  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingItem, setBookingItem] = useState(null);
  const [custForm, setCustForm] = useState({ name: '', phone: '', email: '' });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState('');
  const [campaigns] = useState(DEMO_CAMPAIGNS);

  const industry = business ? industryById(business.industryId) : null;
  const items = (business?.services || []).map((s) =>
    typeof s === 'string' ? { name: s, price: '—', note: '' } : s
  );
  const retention = business?.retention || industry?.retention || { cadence: 'Every 4 weeks', loyalty: 'Points per visit' };

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2400);
  };

  const loadDemo = () => {
    setBusiness(makeBusiness({ ...DEMO_LOW_BUSINESS }));
    setCustomers(DEMO_CUSTOMERS.map((c) => ({ ...c })));
    notify('Demo business and sample customers loaded.');
  };

  const openBooking = (item) => {
    setBookingItem(item);
    setCustForm({ name: '', phone: '', email: '' });
    setErrors({});
  };

  const confirmBooking = () => {
    const er = {};
    if (!custForm.name.trim()) er.name = 'Name is required.';
    if (!custForm.phone.trim()) er.phone = 'Phone is required.';
    setErrors(er);
    if (Object.keys(er).length) return;

    const customerId = `cust-${nextId++}`;
    const customer = {
      id: customerId,
      name: custForm.name.trim(),
      phone: custForm.phone.trim(),
      visits: 1,
      points: 10,
      lastVisit: 'Today',
      nextReminder: retention.cadence,
    };
    const booking = {
      id: `bk-${nextId++}`,
      customerId,
      customerName: customer.name,
      item: bookingItem.name,
      price: bookingItem.price,
      status: 'Confirmed',
      reminder: `Scheduled for ${retention.cadence}`,
    };
    setCustomers((cs) => [customer, ...cs]);
    setBookings((bs) => [booking, ...bs]);
    setBookingItem(null);
    notify(`Booked: ${booking.item} for ${customer.name}. Reminder set (${retention.cadence}). +10 loyalty points.`);
  };

  const markReminderSent = (id) => {
    setCustomers((cs) => cs.map((c) => (c.id === id ? { ...c, nextReminder: 'Sent ✓' } : c)));
    notify('Reminder marked as sent (demo).');
  };

  const stats = useMemo(() => {
    return {
      customers: customers.length,
      bookings: bookings.length,
      points: customers.reduce((a, c) => a + (c.points || 0), 0),
      reminders: customers.filter((c) => c.nextReminder !== 'Sent ✓').length,
    };
  }, [customers, bookings]);

  /* ---------- No configuration yet ---------- */
  if (!business || business.mode !== 'low') {
    return (
      <div className="container page">
        <div className="page-head">
          <span className="eyebrow">Low-Ticket Engine</span>
          <h1 className="display">Showcase. Book. Remind. Repeat.</h1>
          <p className="lede">
            {business && business.mode === 'high'
              ? `Your active configuration (${business.name}) is a high-ticket business — this engine runs on a low-ticket configuration.`
              : 'This engine runs on a low-ticket business configuration — salons, barbers, gyms, restaurants, retail.'}
          </p>
        </div>
        <Card>
          <EmptyState
            glyph="LT"
            title="No low-ticket business configured yet"
            message="Run the Business Simulator to configure one, or load a demo salon with sample customers to see the full workflow immediately."
            actions={[
              <Link key="sim" to="simulator"><Btn variant="accent">Configure a business</Btn></Link>,
              <Btn key="demo" variant="outline" onClick={loadDemo}>Load demo business + customers</Btn>,
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
          <span className="eyebrow">Low-Ticket Engine · {business.name}</span>
          <div className="row">
            <Badge variant="ok">{MODES[business.mode].label}</Badge>
            <Badge variant="demo" dot>Browser-session demo</Badge>
          </div>
        </div>
        <h1 className="display" style={{ fontSize: 34 }}>
          Attract → Showcase → Buy / Book → Remind → Repeat → Retain
        </h1>
        <p className="lede">
          The win in everyday businesses is the second, fifth and fifteenth visit. This engine
          books the first one and schedules the rest.
        </p>
      </div>

      <div className="grid-4" style={{ marginBottom: 24 }}>
        <Stat value={stats.customers} label="Customers captured" note="This session" />
        <Stat value={stats.bookings} label="Bookings confirmed" />
        <Stat value={stats.points} label="Loyalty points issued" note={retention.loyalty} />
        <Stat value={stats.reminders} label="Reminders scheduled" note={retention.cadence} />
      </div>

      {/* Offer + showcase */}
      <div style={{ marginBottom: 28 }}>
        <Card pad className="spread" style={{ background: business.primary, borderColor: business.primary, color: '#fff' }}>
          <div className="stack" style={{ gap: 4 }}>
            <span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.75, fontWeight: 700 }}>Current offer</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 600, letterSpacing: '-0.01em' }}>{business.offer}</span>
            <span style={{ fontSize: 13, opacity: 0.8 }}>{business.audience} · {business.location}</span>
          </div>
          <Btn variant="outline" size="lg" style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }} onClick={() => document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' })}>
            See what's on offer ↓
          </Btn>
        </Card>
      </div>

      <div id="showcase" style={{ marginBottom: 16 }}>
        <SectionTitle
          eyebrow="Showcase"
          title="Every service, one tap from booked."
          sub="In production this is your storefront, menu or catalogue. Here it drives the booking flow."
        />
      </div>
      <div className="grid-3" style={{ marginBottom: 36 }}>
        {items.map((item) => (
          <Card key={item.name} pad hover className="stack">
            <div className="row-between">
              <div className="card-title" style={{ fontSize: 15.5 }}>{item.name}</div>
              <span className="chip" style={{ fontWeight: 700 }}>{item.price}</span>
            </div>
            {item.note && <span className="sub small">{item.note}</span>}
            <Btn variant="accent" size="sm" onClick={() => openBooking(item)}>
              {industry?.id === 'retail' || industry?.id === 'ecommerce' ? 'Buy / express interest' : 'Book now'}
            </Btn>
          </Card>
        ))}
      </div>

      {/* Customers & bookings */}
      <div className="grid-2" style={{ gridTemplateColumns: 'minmax(340px, 3fr) minmax(280px, 2fr)', alignItems: 'start', marginBottom: 36 }}>
        <Card pad className="stack">
          <div className="card-head">
            <div>
              <div className="card-title">Customer records & repeat-visit reminders</div>
              <div className="card-sub">Retention is scheduled, not improvised.</div>
            </div>
            {customers.length === 0 && (
              <Btn variant="outline" size="sm" onClick={() => { setCustomers(DEMO_CUSTOMERS.map((c) => ({ ...c }))); notify('Sample demo customers loaded.'); }}>
                Load sample customers
              </Btn>
            )}
          </div>
          {customers.length === 0 ? (
            <EmptyState
              glyph="↺"
              title="No customers yet"
              message="Book a service above to capture the first customer, or load the sample demo customers."
            />
          ) : (
            <div className="table-wrap">
              <table className="data">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Visits</th>
                    <th>Points</th>
                    <th>Last visit</th>
                    <th>Next reminder</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <strong style={{ fontSize: 13.5 }}>{c.name}</strong>
                        <div className="sub small">{c.phone}</div>
                      </td>
                      <td className="mono">{c.visits}</td>
                      <td className="mono">{c.points}</td>
                      <td className="sub small">{c.lastVisit}</td>
                      <td>
                        <span className={`chip small ${c.nextReminder === 'Overdue' ? 'badge-bad' : ''}`} style={{ fontSize: 11.5 }}>
                          {c.nextReminder}
                        </span>
                      </td>
                      <td>
                        {c.nextReminder !== 'Sent ✓' && (
                          <Btn variant="ghost" size="sm" onClick={() => markReminderSent(c.id)}>Send</Btn>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card pad className="stack">
          <div>
            <div className="card-title">Recent bookings</div>
            <div className="card-sub">Captured through the showcase above.</div>
          </div>
          {bookings.length === 0 ? (
            <p className="sub" style={{ fontStyle: 'italic' }}>
              No bookings this session yet — book a service to see it appear here.
            </p>
          ) : (
            <div className="stack" style={{ gap: 10 }}>
              {bookings.slice(0, 5).map((b) => (
                <div key={b.id} className="stack" style={{ gap: 3, background: 'var(--surface-2)', borderRadius: 9, padding: '10px 12px' }}>
                  <div className="row-between">
                    <strong style={{ fontSize: 13.5 }}>{b.item}</strong>
                    <Badge variant="ok">{b.status}</Badge>
                  </div>
                  <span className="sub small">{b.customerName} · {b.price} · {b.reminder}</span>
                </div>
              ))}
            </div>
          )}
          <div className="notice">
            <span aria-hidden>ⓘ</span>
            <span>Loyalty concept: {retention.loyalty}. Demonstrated in-session.</span>
          </div>
        </Card>
      </div>

      {/* Campaigns */}
      <SectionTitle
        eyebrow="Campaign tracking"
        title="Keep the base warm — and measured."
        sub="Seeded campaign examples. In production these are your real sends, measured against real bookings."
      />
      <div className="grid-3">
        {campaigns.map((c) => (
          <Card key={c.id} pad hover className="stack">
            <div className="row-between">
              <div className="card-title" style={{ fontSize: 15 }}>{c.name}</div>
              <Badge variant="demo">Demo data</Badge>
            </div>
            <span className="sub small">{c.type} · {c.note}</span>
            <div className="grid-3" style={{ gap: 8 }}>
              <div className="stack" style={{ gap: 1 }}>
                <strong className="mono" style={{ fontSize: 17 }}>{c.sent}</strong>
                <span className="sub small">Sent</span>
              </div>
              <div className="stack" style={{ gap: 1 }}>
                <strong className="mono" style={{ fontSize: 17 }}>{c.opens}</strong>
                <span className="sub small">Opened</span>
              </div>
              <div className="stack" style={{ gap: 1 }}>
                <strong className="mono" style={{ fontSize: 17, color: 'var(--accent)' }}>{c.conversions}</strong>
                <span className="sub small">Converted</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {bookingItem && (
        <Modal
          title={`Book: ${bookingItem.name}`}
          sub={`${bookingItem.price}${bookingItem.note ? ' · ' + bookingItem.note : ''} — capture the customer, schedule the reminder.`}
          onClose={() => setBookingItem(null)}
        >
          <div className="stack">
            <Field label="Customer name" required error={errors.name}>
              <Input
                value={custForm.name}
                onChange={(e) => { setCustForm((f) => ({ ...f, name: e.target.value })); setErrors((er) => ({ ...er, name: undefined })); }}
                invalid={!!errors.name}
                placeholder="e.g. Nomvula Khumalo"
              />
            </Field>
            <Field label="Phone (WhatsApp)" required error={errors.phone}>
              <Input
                value={custForm.phone}
                onChange={(e) => { setCustForm((f) => ({ ...f, phone: e.target.value })); setErrors((er) => ({ ...er, phone: undefined })); }}
                invalid={!!errors.phone}
                placeholder="+27 82 000 0000"
              />
            </Field>
            <Field label="Email (optional)">
              <Input
                type="email"
                value={custForm.email}
                onChange={(e) => setCustForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="name@example.com"
              />
            </Field>
            <Btn variant="accent" onClick={confirmBooking}>Confirm booking</Btn>
            <span className="sub small">
              Demo action — creates the customer record, schedules a {retention.cadence} reminder and issues 10 loyalty points.
            </span>
          </div>
        </Modal>
      )}

      <Toast message={toast} />
    </div>
  );
}
