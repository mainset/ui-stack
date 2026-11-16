'use client';

import React from 'react';

// NOTE: nothing to subscribe to, the value only differs between server and client
const subscribe = () => () => undefined;

/**
 * `false` on the server and while hydrating, `true` after: gates client-only output (portals)
 * without a hydration mismatch.
 */
function useIsClient() {
  return React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export { useIsClient };
