import type { LabelStyleProps } from '@mainset/ui-core';
import { LABEL__CLASS_NAME_CONFIG, cnx } from '@mainset/ui-core';
import React from 'react';

import { splitStyleProps } from '../utils/index.mjs';

type LabelProps = React.ComponentPropsWithRef<'label'> & LabelStyleProps;

/** A form label; `lblIsRequired` adds a decorative asterisk (put `required` on the input) */
function Label({ className, children, ...props }: LabelProps) {
  const [classNames, restProps, style] = splitStyleProps(
    [LABEL__CLASS_NAME_CONFIG],
    props,
  );

  return React.createElement(
    'label',
    { className: cnx(className, classNames), style, ...restProps },
    children,
  );
}

export { Label };
export type { LabelProps };
