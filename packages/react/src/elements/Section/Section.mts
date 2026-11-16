import type { BackgroundStyleProps, SectionStyleProps } from '@mainset/ui-core';
import {
  BACKGROUND__CLASS_NAME_CONFIG,
  SECTION__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
} from '@mainset/ui-core';
import React from 'react';

import type { PolymorphicProps } from '../utils/index.mjs';

// Same band, another landmark: a page `footer`, the `main` wrapper, an `aside`…
type SectionElementType =
  'section' | 'div' | 'header' | 'footer' | 'main' | 'article' | 'aside';

type SectionProps<C extends SectionElementType = 'section'> = PolymorphicProps<
  'secAs',
  C,
  SectionStyleProps & BackgroundStyleProps
>;

function Section<C extends SectionElementType = 'section'>({
  secAs,

  children,
  className,

  ...props
}: SectionProps<C>) {
  const [classNames, restProps] = extractClassNamesFromProps(
    [SECTION__CLASS_NAME_CONFIG, BACKGROUND__CLASS_NAME_CONFIG],
    props,
  );

  return React.createElement(
    secAs || 'section',
    {
      className: cnx(className, classNames),
      ...restProps,
    },
    children,
  );
}

export { Section };
export type { SectionElementType, SectionProps };
