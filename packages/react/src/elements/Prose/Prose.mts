import { PROSE__CLASS_NAME_CONFIG, cnx } from '@mainset/ui-core';
import React from 'react';

import type { PolymorphicProps } from '../utils/index.mjs';

const { baseClass: PROSE } = PROSE__CLASS_NAME_CONFIG;

type ProseElementType = 'div' | 'article' | 'section';

type ProseProps<C extends ProseElementType = 'div'> = PolymorphicProps<
  'prsAs',
  C
>;

/**
 * Rich text whose markup has no classes, e.g. rendered markdown or CMS content (`ms-prose`):
 * spaced blocks, headings, lists, quotes, inline code, keys and links.
 *
 * @example <Prose prsAs="article" dangerouslySetInnerHTML={{ __html: html }} />
 */
function Prose<C extends ProseElementType = 'div'>({
  prsAs,

  className,
  ...props
}: ProseProps<C>): React.ReactElement {
  return React.createElement(prsAs || 'div', {
    className: cnx(className, PROSE),
    ...props,
  });
}

export { Prose };
export type { ProseElementType, ProseProps };
