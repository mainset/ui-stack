import { set } from '@mainset/toolkit-js';
import React from 'react';

type FormRecord = Record<string, unknown>;

// Shallow-copies only the objects along {keys}, so {set} can mutate that path without touching
// {source}. Untouched branches keep their identity (cheap, and memo-friendly).
// NOTE: instead of {structuredClone}, which needs Safari 15.4 / Chrome 98 (2022)
function copyAlongPath<T extends object>(source: T, keys: string[]): T {
  const root = { ...source };
  let current = root as FormRecord;

  for (const key of keys.slice(0, -1)) {
    const next = current[key];
    if (next === null || typeof next !== 'object') break;

    current[key] = Array.isArray(next) ? [...next] : { ...next };
    current = current[key] as FormRecord;
  }

  return root;
}

type FormField = Pick<HTMLInputElement, 'type' | 'value'> &
  Partial<Pick<HTMLInputElement, 'checked'>>;

/** A field's value; checkboxes and switches give `checked` (their `value` is "on" either way) */
function readFieldValue(field: FormField): string | boolean {
  return field.type === 'checkbox' ? Boolean(field.checked) : field.value;
}

function useFormHandler<T extends object>(initialState: T) {
  const [formHandlerValues, setFormHandlerState] = React.useState(initialState);

  const handleInputChange = React.useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const field = e.currentTarget;
      const { name } = field;
      const value = readFieldValue(field);
      // NOTE: same path syntax as {set}: `address.city`, `items[0].name`
      const keys = name.match(/[^.[\]]+/g) || [];

      // NOTE: functional update — reading {formHandlerValues} from the closure would be stale
      // (memoized with `[]`), so every change would start from {initialState} and wipe other fields
      setFormHandlerState((prevValues) =>
        set(copyAlongPath(prevValues, keys), keys, value),
      );
    },
    [],
  );

  return [formHandlerValues, { handleInputChange }] as const;
}

export { readFieldValue, useFormHandler };
