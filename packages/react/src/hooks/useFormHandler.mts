import { set } from '@mainset/toolkit-js';
import React from 'react';

function useFormHandler(initialState: Record<string, any>) {
  const [formHandlerValues, setFormHandlerState] = React.useState(initialState);

  const handleInputChange = React.useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value } = e.currentTarget;

      // NOTE: functional update — reading {formHandlerValues} from the closure would be stale
      // (memoized with `[]`), so every change would start from {initialState} and wipe other fields
      setFormHandlerState((prevValues) => {
        // structuredClone keeps nested objects immutable, as {set} mutates by path (e.g. `address.city`)
        const newFormHandlerValues = structuredClone(prevValues);
        set(newFormHandlerValues, name, value);
        return newFormHandlerValues;
      });
    },
    [],
  );

  return [formHandlerValues, { handleInputChange }] as const;
}

export { useFormHandler };
