import _set from 'lodash/set.js';
import { useCallback, useState } from 'react';

function useFormHandler(initialState: Record<string, any>) {
  const [formHandlerValues, setFormHandlerState] = useState(initialState);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFormHandlerValues = { ...formHandlerValues };
      const {
        currentTarget: { name, value },
      } = e;

      _set(newFormHandlerValues, name, value);
      setFormHandlerState(newFormHandlerValues);
    },
    [],
  );

  return [formHandlerValues, { handleInputChange }];
}

export { useFormHandler };
