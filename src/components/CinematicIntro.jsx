import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../lib/introSession.js';

const VIDEO_SRC = '/media/eben-intro.mp4';
const POSTER_SRC = '/media/eben-intro-poster.jpg';
const SLOW_CONNECTION_TIMEOUT_MS = 4200; /* if the video hasn't started by then, reveal the site */
const AUTOPLAY_GRACE_MS = 900; /* if play() hasn't resolved by then, offer a tap-to-enter prompt */

/*
 * CinematicIntro
 * ------------------------------------------------
 * Architecture: Video Layer → Transition Layer → Main Experience.
 *
 * States (exposed via `phase` for debugging / analytics, not required by callers):
 *   'loading'              — deciding how to proceed (checking reduced-motion, mounting <video>)
 *   'playing'               — video is actively autoplaying
 *   'awaiting-gesture'      — autoplay blocked; showing a tap-to-enter prompt over the poster
 *   'completing'            — playback ended / skipped / errored — fading out
 *   'done'                  — unmounted; onComplete has fired
 *
 * Contract: onComplete ALWAYS fires exactly once, no matter what happens (success, skip,
 * error, autoplay block, slow connection, reduced motion). The rest of the app never waits
 * on the video succeeding.
 */
export default function CinematicIntro({ onComplete }) {
  const [phase, setPhase] = useState('loading');
  const [fading, setFading] = useState(false);
  const videoRef = useRef(null);
  const doneRef = useRef(false);
  const skipBtnRef = useRef(null);
  const timers = useRef([]);

  const finish = (reason) => {
    if (doneRef.current) return;
    doneRef.current = true;
    setPhase('completing');
    setFading(true);
    const t = setTimeout(() => {
      onComplete(reason);
    }, 420); /* short, controlled opacity transition — no flashy effects */
    timers.current.push(t);
  };

  useEffect(() => {
    if (prefersReducedMotion()) {
      /* No forced motion — reveal immediately with a minimal, near-instant fade. */
      finish('reduced-motion');
      return;
    }

    setPhase('playing');

    /* Safety net: never let a slow connection or a stalled video trap the user. */
    const slowTimer = setTimeout(() => finish('timeout'), SLOW_CONNECTION_TIMEOUT_MS);
    timers.current.push(slowTimer);

    /* Focus the skip control for keyboard users without stealing the visual moment. */
    const focusTimer = setTimeout(() => skipBtnRef.current?.focus({ preventScroll: true }), 500);
    timers.current.push(focusTimer);

    const onKeyDown = (e) => {
      if (e.key === 'Escape') finish('skipped');
    };
    window.addEventListener('keydown', onKeyDown);

    const v = videoRef.current;
    if (!v) return;

    const playPromise = v.play();
    let gestureTimer;
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        /* Autoplay blocked by the browser — offer a deliberate, minimal entry action. */
        setPhase('awaiting-gesture');
      });
    }
    gestureTimer = setTimeout(() => {
      if (v.paused) setPhase('awaiting-gesture');
    }, AUTOPLAY_GRACE_MS);
    timers.current.push(gestureTimer);

    return () => {
      timers.current.forEach(clearTimeout);
      window.removeEventListener('keydown', onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEnded = () => {
    clearTimeout(timers.current[0]);
    finish('completed');
  };

  const handleError = () => {
    finish('error');
  };

  const handleManualPlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.play().then(() => setPhase('playing')).catch(() => finish('autoplay-unavailable'));
  };

  const handleSkip = () => finish('skipped');

  return (
    <div
      className={`cine-overlay ${fading ? 'fading' : ''}`}
      role="dialog"
      aria-label="Eben Foundry cinematic introduction"
      aria-modal="true"
    >
      <div className="cine-stage">
        <video
          ref={videoRef}
          className="cine-video"
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          muted
          playsInline
          preload="auto"
          autoPlay
          onEnded={handleEnded}
          onError={handleError}
          aria-hidden="true"
        />
        {phase === 'awaiting-gesture' && (
          <button className="cine-enter" onClick={handleManualPlay} autoFocus>
            Enter Eben Foundry
          </button>
        )}
      </div>

      <button
        ref={skipBtnRef}
        type="button"
        className="cine-skip"
        onClick={handleSkip}
        aria-label="Skip introduction"
      >
        Skip intro
      </button>
    </div>
  );
}
