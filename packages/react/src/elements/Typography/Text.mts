import type { SpacingStyleProps, TextStyleProps } from '@mainset/ui-core';
import { TEXT_BASE__CLASS_NAME_CONFIG, cnx } from '@mainset/ui-core';
import React from 'react';

import type { PolymorphicProps } from '../utils/index.mjs';
import { splitStyleProps } from '../utils/index.mjs';

type TextElementType =
  | 'span'
  | 'p'
  | 'div'
  | 'strong'
  | 'em'
  | 'small'
  | 'code'
  | 'kbd'
  | 'mark'
  | 'time'
  | 'abbr'
  | 'label'
  | 'figcaption'
  | 'blockquote';

type TextProps<C extends TextElementType = 'span'> = PolymorphicProps<
  'txtAs',
  C,
  TextStyleProps & Partial<SpacingStyleProps>
>;

/**
 * Text with the `txt*` utilities (size, weight, color, align…) and spacing, on any text tag.
 *
 * @example <Text txtAs="small" txtSize="xs" txtColor="muted">Updated 2 min ago</Text>
 */
function Text<C extends TextElementType = 'span'>({
  txtAs,

  children,
  className,

  ...props
}: TextProps<C>): React.ReactElement {
  const [classNames, restProps, style] = splitStyleProps(
    [TEXT_BASE__CLASS_NAME_CONFIG],
    props,
  );

  return React.createElement(
    txtAs || 'span',
    { className: cnx(className, classNames), style, ...restProps },
    children,
  );
}

export { Text };
export type { TextElementType, TextProps };
