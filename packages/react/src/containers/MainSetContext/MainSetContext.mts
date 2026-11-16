'use client';

import React from 'react';

/** How an open overlay is dismissed by the provider (Escape, a backdrop click) */
interface OverlayRegistration {
  onDismiss: () => void;
  /** `false` for alert dialogs: a click on the backdrop doesn't close them */
  isBackdropDismissable: boolean;
}

interface MainSetContextValue {
  /** Overlays opened by id (`openOverlayById`): dialogs / drawers without their own `*IsOpen` */
  isOverlayOpenById: Record<string, boolean>;
  /** Every open overlay, opened by id or controlled, bottom → top */
  overlayStackIds: string[];
  openOverlayById: (id: string) => void;
  closeOverlayById: (id: string) => void;
  toggleOverlayOpenById: (id: string) => void;
  /** Dismisses the top-most overlay, as Escape / a backdrop click do */
  dismissTopOverlay: (reason: 'escape' | 'backdrop') => void;
  /** Used by overlays while they're open: puts them on the stack; returns the cleanup */
  registerOverlay: (
    id: string,
    registration: OverlayRegistration,
  ) => () => void;
}

const MainSetContext = React.createContext<MainSetContextValue | null>(null);

const useMainSet = (): MainSetContextValue => {
  const context = React.useContext(MainSetContext);

  if (!context) {
    throw new Error('useMainSet must be used within a MainSetProvider');
  }

  return context;
};

/**
 * Opens / closes a dialog or drawer by its id, from any place under the `MainSetProvider`.
 *
 * @example
 * const deleteDialog = useOverlay('delete-project');
 * <Button onClick={deleteDialog.open}>Delete</Button>
 * // anywhere else
 * <Dialog dlgId="delete-project">…</Dialog>
 */
const useOverlay = (id: string) => {
  const {
    isOverlayOpenById,
    openOverlayById,
    closeOverlayById,
    toggleOverlayOpenById,
  } = useMainSet();

  return React.useMemo(
    () => ({
      isOpen: isOverlayOpenById[id] ?? false,
      open: () => openOverlayById(id),
      close: () => closeOverlayById(id),
      toggle: () => toggleOverlayOpenById(id),
    }),
    [
      id,
      isOverlayOpenById,
      openOverlayById,
      closeOverlayById,
      toggleOverlayOpenById,
    ],
  );
};

export { MainSetContext, useMainSet, useOverlay };
export type { MainSetContextValue, OverlayRegistration };
