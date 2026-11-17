/**
 * Prints the contrast of every built-in text / UI color on its surfaces: WCAG 2 (the gate, also
 * enforced by `src/theme/contrast.test.mts`) and APCA Lc (advisory: a perceptual second opinion,
 * worth a look when a palette or derivation changes).
 *
 * Usage: pnpm contrast:report
 */
import {
  MIN_CONTRAST__BY_KIND,
  contrastPairs,
  passesWcag,
} from './contrast-pairs.mjs';

// APCA Lc a text color should reach, by use (advisory)
const APCA_TEXT__MIN_LC = 60;

const rows = contrastPairs().map((pair) => ({
  scheme: pair.scheme,
  color: pair.label,
  on: pair.on,
  wcag: `${pair.wcag.toFixed(2)}${passesWcag(pair) ? '' : ` ✖ < ${MIN_CONTRAST__BY_KIND[pair.kind]}`}`,
  apca: `${Math.abs(pair.apca).toFixed(0)}${
    pair.kind === 'text' && Math.abs(pair.apca) < APCA_TEXT__MIN_LC ? ' ⚠' : ''
  }`,
}));

console.table(rows);
console.log(
  `✖ fails WCAG 2 (the gate) · ⚠ APCA |Lc| < ${APCA_TEXT__MIN_LC} for text (advisory: fine for large / bold text, worth a look for body copy)`,
);
