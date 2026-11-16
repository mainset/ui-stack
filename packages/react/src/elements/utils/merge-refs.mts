import type React from 'react';

/** Sets a ref of any kind (callback or object) */
function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value);
  else if (ref) ref.current = value;
}

/**
 * One callback ref that sets every given ref, so a component's own ref and the caller's `ref`
 * both receive the node. Memoize it (`React.useCallback`) to keep it stable between renders.
 */
function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    refs.forEach((ref) => assignRef(ref, node));
  };
}

export { assignRef, mergeRefs };
