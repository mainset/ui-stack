'use client';

import { DIALOG__CLASS_NAME_CONFIG, cnx } from '@mainset/ui-core';
import React from 'react';

import type { CloseButtonProps } from '../../components/CloseButton/index.mjs';
import { CloseButton } from '../../components/CloseButton/index.mjs';
import { useDialog } from './DialogContext.mjs';

const { baseClass: DIALOG } = DIALOG__CLASS_NAME_CONFIG;

type DialogPartProps = React.ComponentPropsWithRef<'div'>;

/** The title row: `Dialog.Title` and `Dialog.CloseButton` */
function DialogHeader({ className, ...props }: DialogPartProps) {
  return <div className={cnx(className, `${DIALOG}__header`)} {...props} />;
}

type DialogTitleProps = React.ComponentPropsWithRef<'h2'> & {
  /** The heading level @default 'h2' */
  hAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
};

/** Names the dialog: it's referenced by the dialog's `aria-labelledby` */
function DialogTitle({ hAs = 'h2', className, ...props }: DialogTitleProps) {
  const { titleId, setHasTitle } = useDialog();

  React.useLayoutEffect(() => {
    setHasTitle(true);
    return () => setHasTitle(false);
  }, [setHasTitle]);

  return React.createElement(hAs, {
    id: titleId,
    className: cnx(className, `${DIALOG}__title`),
    ...props,
  });
}

/** An icon button (×) that closes the dialog; `aria-label` defaults to "Close" */
function DialogCloseButton({ onClick, ...props }: CloseButtonProps) {
  const { dismiss } = useDialog();

  return (
    <CloseButton
      srfTheme="base"
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) dismiss();
      }}
    />
  );
}

/** The content; scrolls when the dialog is taller than the screen */
function DialogBody({ className, ...props }: DialogPartProps) {
  return <div className={cnx(className, `${DIALOG}__body`)} {...props} />;
}

/** Actions, aligned to the inline end */
function DialogFooter({ className, ...props }: DialogPartProps) {
  return <div className={cnx(className, `${DIALOG}__footer`)} {...props} />;
}

const DIALOG__PARTS = {
  Header: DialogHeader,
  Title: DialogTitle,
  CloseButton: DialogCloseButton,
  Body: DialogBody,
  Footer: DialogFooter,
};

export { DIALOG__PARTS };
export type { DialogPartProps, DialogTitleProps };
