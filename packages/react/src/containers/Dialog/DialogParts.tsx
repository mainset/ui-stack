'use client';

import { DIALOG__CLASS_NAME_CONFIG, cnx } from '@mainset/ui-core';
import React from 'react';

import { Button } from '../../components/Button/index.mjs';
import type { ButtonProps } from '../../components/Button/index.mjs';
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

/**
 * An icon button (×) that closes the dialog; `aria-label` defaults to "Close", `children`
 * replace the icon
 */
function DialogCloseButton({
  children,
  onClick,
  ...props
}: Omit<ButtonProps<'button'>, 'btnAs'>) {
  const { dismiss } = useDialog();

  return (
    <Button
      aria-label="Close"
      btnIsIcon
      srfTheme="base"
      srfVariant="ghost"
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) dismiss();
      }}
    >
      {children ?? (
        // NOTE: the same icon as `CLOSE_ICON__SVG` (ui-core, for markup by hand)
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          focusable="false"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      )}
    </Button>
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
