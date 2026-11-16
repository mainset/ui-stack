import type { SpinnerStyleProps } from '@mainset/ui-core';
import { SPINNER__CLASS_NAME_CONFIG, cnx } from '@mainset/ui-core';
import React from 'react';

import { VisuallyHidden } from '../VisuallyHidden/index.mjs';
import { splitStyleProps } from '../utils/index.mjs';

type SpinnerProps = React.ComponentPropsWithRef<'span'> &
  SpinnerStyleProps & {
    /** Announced to assistive tech (default "Loading") */
    spnLabel?: string;
  };

/**
 * A loading indicator in the current text color. It's a `role="status"` region, so its label
 * is announced; inside a busy button, use the button's `aria-busy` instead.
 *
 * @example <Spinner spnSize="sm" spnLabel="Saving" />
 */
function Spinner({ spnLabel = 'Loading', className, ...props }: SpinnerProps) {
  const [classNames, restProps, style] = splitStyleProps(
    [SPINNER__CLASS_NAME_CONFIG],
    props,
  );

  return React.createElement(
    'span',
    {
      role: 'status',
      className: cnx(className, classNames),
      style,
      ...restProps,
    },
    React.createElement(VisuallyHidden, null, spnLabel),
  );
}

export { Spinner };
export type { SpinnerProps };
