'use client';

import React from 'react';

import type { AlertProps } from '../../components/Alert/index.mjs';

interface ToastOptions extends Pick<
  AlertProps,
  'srfTheme' | 'srfVariant' | 'alrtIcon'
> {
  /** Shows it again in place of the toast with the same id (e.g. "Saving…" → "Saved") */
  tstId?: string;
  tstTitle: React.ReactNode;
  tstDescription?: React.ReactNode;
  /** How long it stays, in ms; `Infinity` until dismissed. Paused while hovered / focused. @default 5000 */
  tstDuration?: number;
  /** One action button; clicking it also dismisses the toast */
  tstAction?: { label: React.ReactNode; onClick: () => void };
}

interface ToastContextValue {
  /** Shows a toast; returns its id */
  toast: (options: ToastOptions) => string;
  dismissToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

/**
 * Shows toasts from any place under the `MainSetProvider`.
 *
 * @example
 * const { toast } = useToast();
 * toast({ tstTitle: 'Saved', srfTheme: 'success' });
 * toast({
 *   tstTitle: 'Message archived',
 *   tstAction: { label: 'Undo', onClick: unarchive },
 * });
 */
const useToast = (): ToastContextValue => {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a MainSetProvider');
  }

  return context;
};

export { ToastContext, useToast };
export type { ToastContextValue, ToastOptions };
