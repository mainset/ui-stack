import React from 'react';

import type { ButtonProps } from '../Button/index.mjs';
import { Button } from '../Button/index.mjs';

type CloseButtonProps = Omit<ButtonProps<'button'>, 'btnAs'>;

/**
 * An icon button (×) for closing / dismissing: ghost, in the current tone, `aria-label`
 * "Close" by default. `children` replace the icon.
 *
 * @example <CloseButton aria-label="Dismiss" onClick={onDismiss} />
 */
function CloseButton({ children, ...props }: CloseButtonProps) {
  return (
    <Button aria-label="Close" btnIsIcon srfVariant="ghost" {...props}>
      {children ?? (
        // NOTE: the same icon as `CLOSE_ICON__SVG` (ui-core, for markup by hand); symmetric
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

export { CloseButton };
export type { CloseButtonProps };
