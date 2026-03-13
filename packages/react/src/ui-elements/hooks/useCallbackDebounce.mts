import { useCallback, useEffect, useMemo, useRef } from 'react';

import { msDebounce } from '../utils/index.mjs';

const useCallbackDebounce = <Deps extends any[], Args extends any[]>(
  dFunc: (dependenciesRef: React.MutableRefObject<Deps>, ...args: Args) => void,
  dependencies: Deps,
  delay: number,
) => {
  const debounceRef = useRef<Deps>(dependencies);

  useEffect(() => {
    debounceRef.current = dependencies;
  }, dependencies);

  const debounceFunc = useMemo(() => msDebounce(dFunc, delay), [dFunc, delay]);

  const callbackDebounce = useCallback(
    (...args: Args) => {
      debounceFunc(debounceRef, ...args);
    },
    [debounceFunc],
  );

  return callbackDebounce;
};

export { useCallbackDebounce };
