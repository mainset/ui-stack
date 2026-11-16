import type { SurfaceRecipeProps } from '@mainset/ui-core';
import { ALERT__CLASS_NAME_CONFIG, cnx, surfaceRecipe } from '@mainset/ui-core';
import React from 'react';

import type { PolymorphicProps } from '../../elements/utils/index.mjs';
import { CloseButton } from '../CloseButton/index.mjs';

const { baseClass: ALERT } = ALERT__CLASS_NAME_CONFIG;

type AlertElementType = 'div' | 'section' | 'li';

type AlertOwnProps = Pick<SurfaceRecipeProps, 'srfTheme' | 'srfVariant'> & {
  /** A short summary, above the message (`children`) */
  alrtTitle?: React.ReactNode;
  /** Decorative: hidden from assistive tech */
  alrtIcon?: React.ReactNode;
  /** Buttons / links at the inline end */
  alrtActions?: React.ReactNode;
  /** Shows a close button that calls it */
  alrtOnDismiss?: () => void;
  /** @default 'Dismiss' */
  alrtDismissLabel?: string;
};

type AlertProps<C extends AlertElementType = 'div'> = PolymorphicProps<
  'alrtAs',
  C,
  AlertOwnProps
>;

// Urgent tones interrupt the screen reader, others wait for a pause
const ROLE__BY_TONE: Partial<Record<string, 'alert'>> = {
  error: 'alert',
  warning: 'alert',
};

/**
 * A message in a tone: a soft surface with an optional icon, title, actions and close button.
 * `role` is `alert` for `error` / `warning` (announced right away), `status` otherwise.
 *
 * @example
 * <Alert srfTheme="warning" alrtTitle="Payment failed" alrtActions={<Button>Retry</Button>}>
 *   Your card was declined.
 * </Alert>
 */
function Alert<C extends AlertElementType = 'div'>({
  alrtAs,
  srfTheme = 'info',
  srfVariant = 'soft',
  alrtTitle,
  alrtIcon,
  alrtActions,
  alrtOnDismiss,
  alrtDismissLabel = 'Dismiss',

  role,
  className,
  children,
  ...props
}: AlertProps<C>) {
  const tone = srfTheme ?? 'info';

  return React.createElement(
    alrtAs || 'div',
    {
      role: role ?? ROLE__BY_TONE[tone] ?? 'status',
      className: cnx(
        className,
        ALERT,
        surfaceRecipe({ srfTheme: tone, srfVariant }),
      ),
      ...props,
    },
    alrtIcon && (
      <span className={`${ALERT}__icon`} aria-hidden="true">
        {alrtIcon}
      </span>
    ),
    <div className={`${ALERT}__content`}>
      {alrtTitle && <p className={`${ALERT}__title`}>{alrtTitle}</p>}
      {children && <div className={`${ALERT}__description`}>{children}</div>}
    </div>,
    alrtActions && <div className={`${ALERT}__actions`}>{alrtActions}</div>,
    alrtOnDismiss && (
      <CloseButton
        btnSize="sm"
        aria-label={alrtDismissLabel}
        onClick={alrtOnDismiss}
      />
    ),
  );
}

export { Alert };
export type { AlertElementType, AlertProps };
