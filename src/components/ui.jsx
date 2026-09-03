import { useEffect } from 'react';

/* ============================================================
   Eben Foundry — Reusable UI components
   ============================================================ */

export function Btn({ variant = 'primary', size = '', className = '', children, ...props }) {
  return (
    <button className={`btn btn-${variant} ${size ? `btn-${size}` : ''} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Badge({ variant = 'muted', dot = false, children }) {
  return (
    <span className={`badge badge-${variant}`}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
}

export function Card({ pad = false, hover = false, className = '', children, ...props }) {
  return (
    <div className={`card ${pad ? 'card-pad' : ''} ${hover ? 'card-hover' : ''} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function SectionTitle({ eyebrow, title, sub, center = false, action = null }) {
  return (
    <div className={`section-head ${center ? 'center' : ''}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="display">{title}</h2>
      {sub && <p className="lede" style={center ? { margin: '0 auto' } : undefined}>{sub}</p>}
      {action}
    </div>
  );
}

export function Field({ label, required = false, error = null, children }) {
  return (
    <div className="field">
      {label && (
        <span className="field-label">
          {label}
          {required && <span className="req">*</span>}
        </span>
      )}
      {children}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

export function Input({ invalid = false, className = '', ...props }) {
  return <input className={`input ${invalid ? 'invalid' : ''} ${className}`} {...props} />;
}

export function Select({ invalid = false, className = '', children, ...props }) {
  return (
    <select className={`select ${invalid ? 'invalid' : ''} ${className}`} {...props}>
      {children}
    </select>
  );
}

export function TextArea({ invalid = false, className = '', ...props }) {
  return <textarea className={`textarea ${invalid ? 'invalid' : ''} ${className}`} {...props} />;
}

export function ColorInput({ value, onChange, label }) {
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <div className="color-row">
        <span className="color-swatch">
          <input
            type="color"
            className="color-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label={label}
          />
        </span>
        <span className="color-hex">{value.toUpperCase()}</span>
      </div>
    </div>
  );
}

export function Segmented({ options, value, onChange }) {
  return (
    <div className="seg" role="tablist">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className={value === opt.id ? 'active' : ''}
          onClick={() => onChange(opt.id)}
          role="tab"
          aria-selected={value === opt.id}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function Stat({ value, label, note }) {
  return (
    <div className="card stat">
      <div className="stat-value mono">{value}</div>
      <div className="stat-label">{label}</div>
      {note && <div className="stat-note">{note}</div>}
    </div>
  );
}

export function Stepper({ steps, current }) {
  return (
    <div className="stepper">
      {steps.map((s, i) => {
        const state = i < current ? 'done' : i === current ? 'active' : '';
        return (
          <div key={s} className={`step ${state}`}>
            <span className="n">{i < current ? '✓' : i + 1}</span>
            {s}
          </div>
        );
      })}
    </div>
  );
}

export function Tabs({ items, active, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {items.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={active === t.id}
          className={`tab ${active === t.id ? 'active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function ScoreRing({ score, size = 64, stroke = 6, color = 'var(--accent)' }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const filled = (Math.max(0, Math.min(100, score)) / 100) * c;
  return (
    <span className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={`${filled} ${c - filled}`}
        />
      </svg>
      <span className="ring-value" style={{ fontSize: size * 0.3 }}>{Math.round(score)}</span>
    </span>
  );
}

export function Progress({ value, max = 100, ink = false }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="progress">
      <div className={ink ? 'progress-ink' : 'progress-fill'} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function EmptyState({ glyph = 'EF', title, message, actions = [] }) {
  return (
    <div className="empty">
      <div className="empty-glyph">{glyph}</div>
      <div className="empty-title">{title}</div>
      {message && <p className="empty-msg">{message}</p>}
      {actions.length > 0 && <div className="row" style={{ justifyContent: 'center' }}>{actions}</div>}
    </div>
  );
}

export function Modal({ title, sub = null, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="spread">
          <div>
            <div className="card-title">{title}</div>
            {sub && <div className="card-sub">{sub}</div>}
          </div>
          <Btn variant="ghost" size="sm" onClick={onClose} aria-label="Close">Close</Btn>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="toast" role="status">
      <span className="tick">✓</span>
      {message}
    </div>
  );
}

export function Demarcation({ children }) {
  return (
    <div className="notice notice-info">
      <span aria-hidden>ⓘ</span>
      <span>{children}</span>
    </div>
  );
}
