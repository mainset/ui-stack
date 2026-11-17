import { describe, expect, it } from 'vitest';

import {
  type ContrastPair,
  contrastPairs,
  passesWcag,
} from '../../scripts/contrast-pairs.mjs';

// NOTE: the feedback hues are hand-picked and due to be regenerated; until then light text on their
// solids is short of AA. Listed so a new gap still fails, and an entry that passes must be removed.
const KNOWN__GAPS = new Set([
  'light success on-solid',
  'dark success on-solid',
]);

const describePair = ({ scheme, label, on }: ContrastPair) =>
  `${scheme} ${label} on ${on}`;
const gapKey = ({ scheme, label }: ContrastPair) => `${scheme} ${label}`;

describe('built-in theme contrast (WCAG 2: 4.5 text, 3 UI)', () => {
  const pairs = contrastPairs();

  it('every text and UI color passes on every surface it sits on', () => {
    const failing = pairs
      .filter((pair) => !passesWcag(pair) && !KNOWN__GAPS.has(gapKey(pair)))
      .map(describePair);

    expect(failing).toEqual([]);
  });

  it('known gaps are still gaps (remove an entry once it passes)', () => {
    const fixed = [...KNOWN__GAPS].filter((key) =>
      pairs.filter((pair) => gapKey(pair) === key).every(passesWcag),
    );

    expect(fixed).toEqual([]);
  });
});
