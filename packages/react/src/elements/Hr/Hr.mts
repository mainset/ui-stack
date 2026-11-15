import type { HrStyleProps, SpacingStyleProps } from '@mainset/ui-core';
import {
  HR__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
  extractSpacingClassNamesFromProps,
} from '@mainset/ui-core';
import React from 'react';

import { mergeResponsiveStyle } from '../utils/index.mjs';

type HrProps = React.HTMLAttributes<HTMLHRElement> &
  HrStyleProps &
  Partial<SpacingStyleProps>;

const Hr: React.FC<HrProps> = ({
  children,
  className,
  style,

  ...props
}) => {
  const [classNames, extractedCNProps] = extractClassNamesFromProps(
    [HR__CLASS_NAME_CONFIG],
    props,
  );
  const [spacingClassNames, restProps, spacingStyle] =
    extractSpacingClassNamesFromProps(extractedCNProps);

  return React.createElement(
    'hr',
    {
      className: cnx(className, classNames, spacingClassNames),
      style: mergeResponsiveStyle(spacingStyle, style),
      ...restProps,
    },
    children,
  );
};

export { Hr };
