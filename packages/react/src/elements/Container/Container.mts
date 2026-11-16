import type { ContainerStyleProps, SpacingStyleProps } from '@mainset/ui-core';
import { CONTAINER__CLASS_NAME_CONFIG, cnx } from '@mainset/ui-core';
import React from 'react';

import type { BlockElementType, PolymorphicProps } from '../utils/index.mjs';
import { splitStyleProps } from '../utils/index.mjs';

type ContainerProps<C extends BlockElementType = 'div'> = PolymorphicProps<
  'ctnAs',
  C,
  ContainerStyleProps & Partial<SpacingStyleProps>
>;

/**
 * Centered content up to a container width (`ctnSize`, default `xl` = 1200px), with side
 * gutters (`--ms-container-gutter`; `ctnIsGutterless` removes them).
 *
 * @example
 * <Section bgColor="muted"><Container ctnSize="lg">…</Container></Section>
 */
function Container<C extends BlockElementType = 'div'>({
  ctnAs,

  children,
  className,

  ...props
}: ContainerProps<C>): React.ReactElement {
  const [classNames, restProps, style] = splitStyleProps(
    [CONTAINER__CLASS_NAME_CONFIG],
    props,
  );

  return React.createElement(
    ctnAs || 'div',
    { className: cnx(className, classNames), style, ...restProps },
    children,
  );
}

export { Container };
export type { ContainerProps };
