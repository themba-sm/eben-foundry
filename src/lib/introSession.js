/*
 * Eben Foundry — cinematic intro session helpers.
 * The intro plays once per browser session (tab), not on every internal navigation.
 * All storage access is defensive: private browsing / disabled storage never breaks the app.
 */

const KEY = 'eben-foundry:intro-shown:v1';

export function prefersReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

export function hasShownIntroThisSession() {
  try {
    return window.sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export function markIntroShown() {
  try {
    window.sessionStorage.setItem(KEY, '1');
  } catch {
    /* storage unavailable — intro may replay; not a functional problem */
  }
}

/* Only the very first mount of the app (this session) should attempt the video. */
export function shouldAttemptIntro() {
  return !hasShownIntroThisSession();
}
