/**
 * Whether {node} is laid out right-to-left: its computed `direction`, which comes from the
 * nearest `dir` (a whole page or a single section). Arrow keys mirror with it.
 */
function isRtl(node: Element) {
  const { direction } = getComputedStyle(node);

  // NOTE: DOM implementations without a cascade (jsdom) leave it empty: read the attribute
  if (direction) return direction === 'rtl';
  return node.closest('[dir]')?.getAttribute('dir') === 'rtl';
}

export { isRtl };
