import type { HrStyleProps, SpacingStyleProps } from '@mainset/ui-core';
import {
  HR__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
  extractSpacingClassNamesFromProps,
} from '@mainset/ui-core';
import React from 'react';

type HrProps = React.HTMLAttributes<HTMLHRElement> &
  HrStyleProps &
  Partial<SpacingStyleProps>;

const Hr: React.FC<HrProps> = ({
  children,
  className,

  ...props
}) => {
  const [classNames, extractedCNProps] = extractClassNamesFromProps(
    [HR__CLASS_NAME_CONFIG],
    props,
  );
  const [spacingClassNames, restProps] =
    extractSpacingClassNamesFromProps(extractedCNProps);

  return React.createElement(
    'hr',
    {
      className: cnx(className, classNames, spacingClassNames),
      ...restProps,
    },
    children,
  );
};

export { Hr };
