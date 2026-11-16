'use client';

import type { DialogStyleProps, OverlayStyleProps } from '@mainset/ui-core';
import {
  DIALOG__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
} from '@mainset/ui-core';
import React from 'react';

import { useMainSet } from '../MainSetContext/MainSetContext.mjs';
import type { OverlayContentProps } from '../Overlay/OverlayContent.js';
import { OverlayContent } from '../Overlay/OverlayContent.js';
import type { DialogContextValue } from './DialogContext.mjs';
import { DialogContext } from './DialogContext.mjs';
import { DIALOG__PARTS } from './DialogParts.js';

type PanelProps = Omit<
  OverlayContentProps,
  | 'ovrId'
  | 'ovrIsOpen'
  | 'ovrOnOpenChange'
  | 'ovrRole'
  | 'ovrIsBackdropDismissable'
  | 'ovrPlacement'
>;

interface DialogPanelOptions {
  id?: string;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  role?: 'dialog' | 'alertdialog';
  isBackdropDismissable?: boolean;
  placement: NonNullable<OverlayStyleProps['ovrPlacement']>;
  styleProps: DialogStyleProps;
}

// Shared by Dialog and Drawer: the overlay behaviour + the `ms-dialog` panel + the parts' context
function DialogPanel({
  options: {
    id,
    isOpen,
    onOpenChange,
    role,
    isBackdropDismissable,
    placement,
    styleProps,
  },
  className,
  children,
  ...props
}: PanelProps & { options: DialogPanelOptions }) {
  const { closeOverlayById } = useMainSet();
  const generatedId = React.useId();
  const overlayId = id ?? generatedId;
  const [hasTitle, setHasTitle] = React.useState(false);

  const [classNames] = extractClassNamesFromProps(
    [DIALOG__CLASS_NAME_CONFIG],
    styleProps,
  );

  const context = React.useMemo<DialogContextValue>(
    () => ({
      dismiss() {
        onOpenChange?.(false);
        if (isOpen === undefined) closeOverlayById(overlayId);
      },
      titleId: `${overlayId}-title`,
      setHasTitle,
    }),
    [overlayId, isOpen, onOpenChange, closeOverlayById],
  );

  // NOTE: named by its title, unless the caller names it
  const isNamed = props['aria-label'] || props['aria-labelledby'];

  return (
    <OverlayContent
      ovrId={overlayId}
      ovrIsOpen={isOpen}
      ovrOnOpenChange={onOpenChange}
      ovrRole={role}
      ovrIsBackdropDismissable={isBackdropDismissable}
      ovrPlacement={placement}
      aria-labelledby={!isNamed && hasTitle ? context.titleId : undefined}
      className={cnx(className, classNames)}
      {...props}
    >
      <DialogContext.Provider value={context}>
        {children}
      </DialogContext.Provider>
    </OverlayContent>
  );
}

type DialogProps = PanelProps &
  Pick<DialogStyleProps, 'dlgSize'> & {
    /** Opens it from anywhere: `useOverlay(dlgId).open()`, when {dlgIsOpen} isn't given */
    dlgId?: string;
    /** Controlled open state */
    dlgIsOpen?: boolean;
    /** Escape, a backdrop click or `Dialog.CloseButton` asks to close: `false` */
    dlgOnOpenChange?: (isOpen: boolean) => void;
    /** `alertdialog` for confirmations: a backdrop click doesn't close it @default 'dialog' */
    dlgRole?: 'dialog' | 'alertdialog';
    /** @default true, `false` for an `alertdialog` */
    dlgIsBackdropDismissable?: boolean;
  };

/**
 * A modal dialog, centered. Open it by id from anywhere under the `MainSetProvider`, or control it.
 *
 * @example
 * const deleteDialog = useOverlay('delete-project');
 * <Button onClick={deleteDialog.open}>Delete</Button>
 *
 * <Dialog dlgId="delete-project" dlgRole="alertdialog" dlgSize="sm">
 *   <Dialog.Header>
 *     <Dialog.Title>Delete the project?</Dialog.Title>
 *   </Dialog.Header>
 *   <Dialog.Body>It can't be undone.</Dialog.Body>
 *   <Dialog.Footer>
 *     <Button onClick={deleteDialog.close}>Cancel</Button>
 *     <Button srfTheme="error" srfVariant="solid" onClick={deleteProject}>Delete</Button>
 *   </Dialog.Footer>
 * </Dialog>
 */
function DialogRoot({
  dlgId,
  dlgIsOpen,
  dlgOnOpenChange,
  dlgRole,
  dlgIsBackdropDismissable,
  dlgSize,
  ...props
}: DialogProps) {
  return (
    <DialogPanel
      options={{
        id: dlgId,
        isOpen: dlgIsOpen,
        onOpenChange: dlgOnOpenChange,
        role: dlgRole,
        isBackdropDismissable: dlgIsBackdropDismissable,
        placement: 'center',
        styleProps: { dlgSize },
      }}
      {...props}
    />
  );
}

type DrawerProps = PanelProps & {
  /** Opens it from anywhere: `useOverlay(drwId).open()`, when {drwIsOpen} isn't given */
  drwId?: string;
  /** Controlled open state */
  drwIsOpen?: boolean;
  /** Escape, a backdrop click or `Drawer.CloseButton` asks to close: `false` */
  drwOnOpenChange?: (isOpen: boolean) => void;
  /**
   * The edge it slides in from: `start` / `end` follow `dir` (inline edges), `top` / `bottom`
   * @default 'end'
   */
  drwPlacement?: Exclude<OverlayStyleProps['ovrPlacement'], 'center' | null>;
  /** Its width at `start` / `end`, its height at `top` / `bottom` @default 'base' */
  drwSize?: DialogStyleProps['dlgSize'];
  /** @default true */
  drwIsBackdropDismissable?: boolean;
};

/**
 * A modal panel at an edge of the screen: navigation, filters, details. The same parts and
 * behaviour as `Dialog`.
 *
 * @example
 * <Drawer drwId="filters" drwPlacement="start">
 *   <Drawer.Header>
 *     <Drawer.Title>Filters</Drawer.Title>
 *     <Drawer.CloseButton />
 *   </Drawer.Header>
 *   <Drawer.Body>…</Drawer.Body>
 * </Drawer>
 */
function DrawerRoot({
  drwId,
  drwIsOpen,
  drwOnOpenChange,
  drwPlacement = 'end',
  drwSize,
  drwIsBackdropDismissable,
  ...props
}: DrawerProps) {
  return (
    <DialogPanel
      options={{
        id: drwId,
        isOpen: drwIsOpen,
        onOpenChange: drwOnOpenChange,
        isBackdropDismissable: drwIsBackdropDismissable,
        placement: drwPlacement,
        styleProps: { dlgSize: drwSize, dlgIsDrawer: true },
      }}
      {...props}
    />
  );
}

const Dialog = Object.assign(DialogRoot, DIALOG__PARTS);
const Drawer = Object.assign(DrawerRoot, DIALOG__PARTS);

export { Dialog, Drawer };
export type { DialogProps, DrawerProps };
