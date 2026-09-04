import { useEffect, useRef, useState } from 'react';
import { CAMPAIGN_INDUSTRIES, campaignByStoreIndustry } from '../data/campaign-assets.js';
import { Btn } from './ui.jsx';

/* ============================================================
   Eben Foundry — Campaign Preview
   Premium presentation of finished campaign creative inside the
   Marketing Studio. Different businesses. Different growth
   mechanics. One underlying engine.

   Layering (so transform, entrance and hover never fight):
   .cp-asset  — parallax perspective layer (transition)
   .cp-anim   — cinematic reveal (one-shot keyframes)
   .cp-frame  — framing, shadow, hover elevation
   ============================================================ */

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* A single campaign visual with graceful degradation if it is missing or fails to load. */
function CampaignVisual({ asset, glyph, label, index }) {
  const [failed, setFailed] = useState(false);

  if (!asset || failed) {
    return (
      <div
        className="cp-fallback"
        role="img"
        aria-label={`${label} campaign visual ${String(index + 1).padStart(2, '0')} is being finalised`}
      >
        <span className="cp-fallback-glyph" aria-hidden="true">{glyph}</span>
        <span className="cp-fallback-line">
          Campaign visual {String(index + 1).padStart(2, '0')}
        </span>
        <span className="cp-fallback-sub">Being finalised for {label}</span>
      </div>
    );
  }

  return (
    <img
      src={asset.src}
      width={asset.width}
      height={asset.height}
      alt={asset.alt}
      loading="eager"
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}

export default function CampaignPreview({
  businessName,
  offer,
  industryId,
  activeChannel,
}) {
  const configured = campaignByStoreIndustry(industryId);
  const [selectedId, setSelectedId] = useState(configured ? configured.id : null);
  const [focused, setFocused] = useState(0); // 0 → asset01 dominant, 1 → asset02 dominant
  const stageRef = useRef(null);
  const rafRef = useRef(0);
  const touchRef = useRef(null);

  const campaign = CAMPAIGN_INDUSTRIES.find((c) => c.id === selectedId) || null;

  /* Follow the business configuration when its industry changes. */
  useEffect(() => {
    if (configured) setSelectedId(configured.id);
  }, [configured && configured.id]);

  /* New industry → begin from campaign asset 01. */
  useEffect(() => {
    setFocused(0);
  }, [selectedId]);

  /* Preload only the selected industry's pair — everything else stays lazy. */
  useEffect(() => {
    if (!campaign) return;
    [campaign.asset01, campaign.asset02].forEach((a) => {
      if (a) {
        const img = new Image();
        img.src = a.src;
      }
    });
  }, [campaign && campaign.id]);

  /* Desktop: very subtle parallax. No hover-dependent behaviour on touch. */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reducedMotion()) return;
    if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;

    const setVars = (x, y) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        stage.style.setProperty('--px', x.toFixed(3));
        stage.style.setProperty('--py', y.toFixed(3));
      });
    };
    const onMove = (e) => {
      const r = stage.getBoundingClientRect();
      setVars((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5);
    };
    const onLeave = () => setVars(0, 0);

    stage.addEventListener('mousemove', onMove);
    stage.addEventListener('mouseleave', onLeave);
    return () => {
      stage.removeEventListener('mousemove', onMove);
      stage.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [campaign && campaign.id]);

  /* Mobile: natural swipe between the two assets. */
  const onTouchStart = (e) => {
    touchRef.current = e.touches[0] ? e.touches[0].clientX : null;
  };
  const onTouchEnd = (e) => {
    if (touchRef.current == null) return;
    const end = e.changedTouches[0] ? e.changedTouches[0].clientX : null;
    if (end != null && Math.abs(end - touchRef.current) > 44) {
      setFocused((f) => (f === 0 ? 1 : 0));
    }
    touchRef.current = null;
  };

  const hasPair = !!(campaign && campaign.asset01 && campaign.asset02);
  const dominant = campaign ? (focused === 0 ? campaign.asset01 : campaign.asset02) : null;
  const secondary = campaign ? (focused === 0 ? campaign.asset02 : campaign.asset01) : null;

  return (
    <section className="cp-section" aria-labelledby="cp-title">
      <div className="section-head">
        <span className="eyebrow">Campaign preview</span>
        <h2 id="cp-title" className="display" style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}>
          This is what your business could look like.
        </h2>
        <p className="lede">
          See how your business could show up in the real world — finished campaign
          execution, configured around the industry you serve.
        </p>
      </div>

      {/* Industry switcher — the engine reconfigures for the selected business. */}
      <div className="cp-switcher" role="tablist" aria-label="Campaign industries">
        {CAMPAIGN_INDUSTRIES.map((ind) => (
          <button
            key={ind.id}
            type="button"
            role="tab"
            aria-selected={selectedId === ind.id}
            className={`cp-pill${selectedId === ind.id ? ' cp-pill-active' : ''}`}
            onClick={() => setSelectedId(ind.id)}
          >
            {ind.name}
          </button>
        ))}
      </div>

      {campaign ? (
        <div className="cp-body">
          {/* The stage — keyed on industry so each switch plays the reveal once. */}
          <div
            className="cp-stage"
            key={campaign.id}
            ref={stageRef}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <span className="cp-stage-sheen" aria-hidden="true" />

            <figure className="cp-asset cp-asset-back">
              <div className="cp-anim cp-anim-back" key={`back-${campaign.id}-${focused}`}>
                <div className="cp-frame cp-frame-back">
                  <CampaignVisual
                    asset={secondary}
                    glyph={campaign.glyph}
                    label={campaign.name}
                    index={focused === 0 ? 1 : 0}
                  />
                </div>
              </div>
            </figure>

            <figure className="cp-asset cp-asset-front">
              <div className="cp-anim cp-anim-front" key={`front-${campaign.id}-${focused}`}>
                <div className="cp-frame cp-frame-front">
                  <CampaignVisual
                    asset={dominant}
                    glyph={campaign.glyph}
                    label={campaign.name}
                    index={focused}
                  />
                </div>
              </div>
            </figure>

            <span className="cp-stage-tag" aria-hidden="true">
              <span className="cp-stage-glyph">{campaign.glyph}</span>
              {campaign.name}
            </span>
          </div>

          {/* Meta — personalisation + two-asset navigation. */}
          <div className="cp-meta">
            <div className="cp-meta-copy">
              <span className="eyebrow">{businessName || campaign.name}</span>
              <p className="sub">
                Campaign direction for {campaign.name}
                {offer ? <> — “{offer}”</> : null}.
              </p>
            </div>
            <div className="cp-pager" role="group" aria-label="Move between the two campaign assets">
              <Btn
                variant="ghost"
                size="sm"
                onClick={() => setFocused(0)}
                aria-label="Show campaign asset 01"
                disabled={focused === 0 || !hasPair}
              >
                ←
              </Btn>
              <span className="cp-pager-index mono" aria-live="polite">
                {String(focused + 1).padStart(2, '0')} / 02
              </span>
              <Btn
                variant="ghost"
                size="sm"
                onClick={() => setFocused(1)}
                aria-label="Show campaign asset 02"
                disabled={!hasPair || focused === 1}
              >
                →
              </Btn>
              <span className="cp-swipe-hint" aria-hidden="true">Swipe →</span>
            </div>
          </div>

          {/* The system chain — configuration becomes execution. */}
          <div className="cp-chain" aria-label="How this connects to the studio">
            <span className="cp-chain-step">Business information</span>
            <span className="cp-chain-arrow" aria-hidden="true">→</span>
            <span className="cp-chain-step">Marketing strategy</span>
            <span className="cp-chain-arrow" aria-hidden="true">→</span>
            <span className="cp-chain-step cp-chain-step-active">
              Campaign execution{activeChannel ? <em> · in focus: {activeChannel}</em> : null}
            </span>
          </div>
          <p className="cp-note sub small">
            Finished campaign creative from the Eben Foundry portfolio, shown for the selected
            industry. In production, execution is built around your business.
          </p>
        </div>
      ) : (
        <div className="cp-empty">
          <div className="cp-empty-frame">
            <span className="cp-empty-glyph" aria-hidden="true">◈</span>
            <div className="cp-empty-title">
              Every flagship industry has a finished campaign pair.
            </div>
            <p className="sub">
              {industryId
                ? 'Your configuration runs on the same engine — select an industry above to see how campaign execution shows up in the real world.'
                : 'Select an industry above to see how campaign execution shows up in the real world.'}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
