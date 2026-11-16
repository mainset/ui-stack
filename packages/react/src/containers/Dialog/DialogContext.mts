'use client';

import React from 'react';

interface DialogContextValue {
  /** Closes the dialog / drawer it's rendered in, as Escape does */
  dismiss: () => void;
  /** The id `Dialog.Title` renders, which names the dialog (`aria-labelledby`) */
  titleId: string;
  setHasTitle: (hasTitle: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

/**
 * Inside a `Dialog` / `Drawer`: `dismiss()` closes it (a footer "Cancel" button, after a submit).
 *
 * @example
 * const { dismiss } = useDialog();
 * <Button onClick={dismiss}>Cancel</Button>
 */
const useDialog = () => {
  const context = React.useContext(DialogContext);

  if (!context) {
    throw new Error('useDialog must be used within a Dialog or a Drawer');
  }

  return context;
};

export { DialogContext, useDialog };
export type { DialogContextValue };
