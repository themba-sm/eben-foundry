import { useMemo, useState } from 'react';
import { READINESS_AREAS, READINESS_ACTIONS } from '../data/demo.js';
import { Btn, Badge, Card, ScoreRing, Progress, SectionTitle } from '../components/ui.jsx';

function areaScore(area, answers) {
  const total = area.statements.length * 2;
  const got = area.statements.reduce((acc, _, i) => acc + (answers[`${area.id}-${i}`] ?? 0), 0);
  return { pct: total ? Math.round((got / total) * 100) : 0 };
}

export default function Readiness() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = READINESS_AREAS.reduce((a, ar) => a + ar.statements.length, 0);
  const complete = answeredCount === totalQuestions;

  const result = useMemo(() => {
    const areas = READINESS_AREAS.map((area) => {
      const { pct } = areaScore(area, answers);
      return { id: area.id, label: area.label, pct };
    });
    const overall = areas.length
      ? Math.round(areas.reduce((a, x) => a + x.pct, 0) / areas.length)
      : 0;
    const strengths = areas.filter((a) => a.pct >= 67);
    const gaps = areas.filter((a) => a.pct < 50);
    return { areas, overall, strengths, gaps };
  }, [answers]);

  const setAnswer = (key, value) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    setSubmitted(false);
  };

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="container-narrow page">
      <div className="page-head">
        <div className="row-between">
          <span className="eyebrow">Business Readiness</span>
          <Badge variant="demo" dot>Self-assessment · not a score of record</Badge>
        </div>
        <h1 className="display">How ready is the business to grow systematically?</h1>
        <p className="lede">
          Seven growth-readiness areas, three statements each. Answer honestly — the output is a
          directional indicator with recommended next actions, nothing more.
        </p>
      </div>

      <Card pad className="stack" style={{ gap: 14 }}>
        <div className="row-between">
          <span className="field-label">
            {answeredCount} of {totalQuestions} statements answered
          </span>
          <div style={{ width: 180 }}><Progress value={answeredCount} max={totalQuestions} ink /></div>
        </div>

        {READINESS_AREAS.map((area, ai) => (
          <div key={area.id} className="assess-area">
            <div className="assess-head">
              <div className="assess-title">
                <span className="assess-num">{String(ai + 1).padStart(2, '0')}</span>
                {area.label}
              </div>
              {submitted && (
                <span className="assess-pct mono">{areaScore(area, answers).pct}%</span>
              )}
            </div>
            {area.statements.map((st, i) => {
              const key = `${area.id}-${i}`;
              const value = answers[key];
              return (
                <div key={key} className="assess-row">
                  <span className={value !== undefined ? 'assess-statement answered' : 'assess-statement'}>{st}</span>
                  <div className="seg" role="group" aria-label={st}>
                    {[
                      ['Yes', 2],
                      ['Partly', 1],
                      ['No', 0],
                    ].map(([label, pts]) => (
                      <button
                        key={label}
                        type="button"
                        className={value === pts ? 'active' : ''}
                        onClick={() => setAnswer(key, pts)}
                        aria-label={`${st} — ${label}`}
                        aria-pressed={value === pts}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        <div className="row">
          <Btn
            variant="accent"
            size="lg"
            disabled={!complete}
            onClick={() => { setSubmitted(true); document.getElementById('readiness-result')?.scrollIntoView({ behavior: 'smooth' }); }}
          >
            {complete ? 'See my readiness result' : `Answer all ${totalQuestions} statements to continue`}
          </Btn>
          {answeredCount > 0 && <Btn variant="ghost" onClick={reset}>Reset</Btn>}
        </div>
      </Card>

      {submitted && (
        <div id="readiness-result" className="stack-lg reveal" style={{ marginTop: 24 }}>
          <Card pad className="row-between" style={{ gap: 20 }}>
            <div className="stack" style={{ gap: 6 }}>
              <span className="eyebrow">Overall readiness</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <ScoreRing score={result.overall} size={84} stroke={7} />
                <div className="stack" style={{ gap: 4 }}>
                  <strong style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>
                    {result.overall >= 70 ? 'System-ready' : result.overall >= 45 ? 'Building' : 'Foundational'}
                  </strong>
                  <span className="sub" style={{ maxWidth: 340 }}>
                    A directional indicator of how ready this business is for systematic growth.
                  </span>
                </div>
              </div>
            </div>
            <div className="stack" style={{ gap: 8, minWidth: 240, flex: 1 }}>
              {result.areas.map((a) => (
                <div key={a.id} className="stack" style={{ gap: 4 }}>
                  <div className="row-between" style={{ fontSize: 12 }}>
                    <span>{a.label}</span>
                    <span className="mono sub">{a.pct}%</span>
                  </div>
                  <Progress value={a.pct} />
                </div>
              ))}
            </div>
          </Card>

          <div className="grid-2">
            <Card pad className="stack">
              <span className="eyebrow assess-result-label">Strengths</span>
              {result.strengths.length ? (
                <div className="stack" style={{ gap: 8 }}>
                  {result.strengths.map((s) => (
                    <div key={s.id} className="row" style={{ gap: 8 }}>
                      <strong style={{ color: 'var(--ok)' }}>✓</strong>
                      <span style={{ fontSize: 13.5 }}>{s.label} — {s.pct}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="sub" style={{ fontStyle: 'italic' }}>No area scored above 66% yet — see the recommended actions.</p>
              )}
            </Card>
            <Card pad className="stack">
              <span className="eyebrow assess-gap-label">Gaps</span>
              {result.gaps.length ? (
                <div className="stack" style={{ gap: 8 }}>
                  {result.gaps.map((g) => (
                    <div key={g.id} className="row" style={{ gap: 8 }}>
                      <strong style={{ color: 'var(--bad)' }}>!</strong>
                      <span style={{ fontSize: 13.5 }}>{g.label} — {g.pct}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="sub" style={{ fontStyle: 'italic' }}>No area scored below 50% — a strong foundation.</p>
              )}
            </Card>
          </div>

          {result.gaps.length > 0 && (
            <Card pad className="stack">
              <span className="eyebrow">Recommended next actions</span>
              <div className="stack" style={{ gap: 12 }}>
                {result.gaps.map((g) => (
                  <div key={g.id} className="stack assess-action" style={{ gap: 4 }}>
                    <strong style={{ fontSize: 13.5 }}>{g.label}</strong>
                    <span className="sub small">{READINESS_ACTIONS[g.id]}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="notice">
            <span aria-hidden>ⓘ</span>
            <span>
              This assessment is a self-reported readiness indicator generated from your answers in
              this session. It is not a financial, legal, compliance or credit score, and it is not
              an authoritative evaluation of the business.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
