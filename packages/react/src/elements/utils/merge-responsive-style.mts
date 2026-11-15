import type { ResponsiveStyle } from '@mainset/ui-core';
import type React from 'react';

/**
 * Merges the CSS variables of `css-var` responsive props into the element's own `style`
 * (which wins). Keeps the caller's object, or `undefined`, when there is nothing to add.
 */
function mergeResponsiveStyle(
  responsiveStyle: ResponsiveStyle,
  style: React.CSSProperties | undefined,
): React.CSSProperties | undefined {
  if (!Object.keys(responsiveStyle).length) return style;

  return { ...(responsiveStyle as React.CSSProperties), ...style };
}

export { mergeResponsiveStyle };
