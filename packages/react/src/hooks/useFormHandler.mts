import { set } from '@mainset/toolkit-js';
import React from 'react';

function useFormHandler(initialState: Record<string, any>) {
  const [formHandlerValues, setFormHandlerState] = React.useState(initialState);

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFormHandlerValues = { ...formHandlerValues };
      const {
        currentTarget: { name, value },
      } = e;

      set(newFormHandlerValues, name, value);
      setFormHandlerState(newFormHandlerValues);
    },
    [],
  );

  return [formHandlerValues, { handleInputChange }];
}

export { useFormHandler };
