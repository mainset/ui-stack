import type { ElementColor } from '../elements/elements.types.mjs';
import '../styles/foundation.scss';

/**
 * `.ms-tone-{tone}` re-points the inherited `--ms-tone-*` contract for an element and its subtree.
 * Without it, an element uses the tone inherited from its ancestors (theme default: `primary`).
 */
function toneRecipe(tone?: ElementColor | null): string {
  return tone ? `ms-tone-${tone}` : '';
}

export { toneRecipe };
