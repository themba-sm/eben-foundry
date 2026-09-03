/*
 * Eben Foundry — colour utilities.
 * Users choose their own brand colours; UI text must stay readable on them.
 */

/* Returns '#15171C' or '#FFFFFF' — whichever reads better on the given background. */
export function contrastText(hex) {
  const raw = String(hex || '#15171C').replace('#', '');
  const full = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.55 ? '#15171C' : '#FFFFFF';
}
