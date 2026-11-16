import { debounce } from '@mainset/toolkit-js';
import React from 'react';

function useCallbackDebounce<Deps extends unknown[], Args extends unknown[]>(
  dFunc: (dependenciesRef: React.RefObject<Deps>, ...args: Args) => void,
  dependencies: Deps,
  delay: number,
) {
  const debounceRef = React.useRef<Deps>(dependencies);

  React.useEffect(() => {
    debounceRef.current = dependencies;
  }, dependencies);

  const debounceFunc = React.useMemo(
    () => debounce(dFunc, delay),
    [dFunc, delay],
  );

  const callbackDebounce = React.useCallback(
    (...args: Args) => {
      debounceFunc(debounceRef, ...args);
    },
    [debounceFunc],
  );

  return callbackDebounce;
}

export { useCallbackDebounce };
