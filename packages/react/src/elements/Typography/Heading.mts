import type { HeadingLevel, TextStyleProps } from '@mainset/ui-core';
import {
  HEADING__CLASS_NAME_CONFIG,
  TEXT_BASE__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
} from '@mainset/ui-core';
import React from 'react';

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>, TextStyleProps {
  /** The heading level (semantics, document outline); its default size follows the level */
  hAs?: HeadingLevel;
}

/**
 * `hAs` sets the level, `txtSize` the looks: `<Heading hAs="h1" txtSize="lg">` is the page's
 * `h1` with a small, toolbar-like title.
 */
function Heading({ hAs = 'h1', className, children, ...props }: HeadingProps) {
  const [classNames, restProps] = extractClassNamesFromProps(
    [HEADING__CLASS_NAME_CONFIG, TEXT_BASE__CLASS_NAME_CONFIG],
    props,
  );

  return React.createElement(
    hAs,
    {
      className: cnx(className, classNames),
      ...restProps,
    },
    children,
  );
}

export { Heading };
export type { HeadingProps };
