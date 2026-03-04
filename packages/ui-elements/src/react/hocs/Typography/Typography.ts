import cn from 'classnames';
import React from 'react';

import BaseHeading from '../../Typography/Heading';
import BaseParagraph from '../../Typography/Paragraph';
import BaseTextSection from '../../Typography/TextSection';

function excludeClassParamsFromProps(
  params: Record<string, string>,
  props: Record<string, any>,
  defaultProps: Record<string, any> = {}
) {
  // @ts-ignore
  const propForClasses = Object.values(params);
  const restPropKeys = Object.keys(props).filter(
    (propKey) => !propForClasses.includes(propKey),
  );
  const result: { classObj: Record<string, boolean>; rest: Record<string, any> } = {
    classObj: {},
    rest: {},
  };

  // populate result rest
  restPropKeys.forEach((restPropKey) => {
    result.rest[restPropKey] = props[restPropKey];
  });

  // populate classObj
  Object.keys(params).forEach((keyAsClassName) => {
    const propKeyName = params[keyAsClassName];
    // Fallback to defaultProps if the prop was not provided
    const propValue = props[propKeyName] ?? defaultProps[propKeyName];

    if (propValue) {
      const classNameFromKey = keyAsClassName.replace(
        `%${propKeyName}`,
        String(propValue),
      );
      result.classObj[classNameFromKey] = true;
    }
  });

  return result;
}

interface WrappedComponentWithTypographyProps extends React.HTMLAttributes<HTMLElement> {
  truncate?: boolean;
  align?: 'center' | 'justify' | 'right';
  size?:
    | 'xx-small'
    | 'x-small'
    | 'smaller'
    | 'sm'
    | 'md'
    | 'lg'
    | 'larger'
    | 'x-large'
    | 'xx-large';
  transform?: 'capitalize' | 'uppercase';
  weight?: 'lightest' | 'lighter' | 'normal' | 'bold' | 'bolder' | 'boldest';
}

export interface TypographyConfig<CustomProps extends Record<string, any>> {
  defaultProps?: Partial<CustomProps>;
  propTypes?: Record<keyof CustomProps, any[]>;
}

const withTypography = <CustomProps extends Record<string, any>>(
  WrappedComponent: React.FC<React.HTMLAttributes<HTMLElement>>,
  params: Record<string, string>,
  config?: TypographyConfig<CustomProps>
) => {
  const WrappedComponentWithTypography: React.FC<
    WrappedComponentWithTypographyProps & Partial<CustomProps>
  > = ({
    children,
    className,

    truncate,
    align,
    size,
    transform,
    weight = 'normal',

    ...props
  }) => {
    const { classObj, rest } = excludeClassParamsFromProps(
      params,
      props,
      config?.defaultProps
    );
    return React.createElement(
      WrappedComponent,
      {
        className: cn(
          'ms-typography',
          {
            'ms-typography--truncate': truncate,
            [`ms-typography--align-${align}`]: align,
            [`ms-typography--size-${size}`]: size,
            [`ms-typography--transform-${transform}`]: transform,
            [`ms-typography--weight-${weight}`]: weight,
            ...classObj,
            // [`ms-typography--typeface-${typeface}`]: typeface,
          },
          className,
        ),
        ...rest,
      },
      children,
    );
  };

  return WrappedComponentWithTypography;
};

function createTypographyElements<CustomProps extends Record<string, any>>(
  typographyParams: Record<string, string>,
  config?: TypographyConfig<CustomProps>
) {
  const Heading = withTypography(BaseHeading, typographyParams, config);
  const Paragraph = withTypography(BaseParagraph, typographyParams, config);
  const TextSection = withTypography(BaseTextSection, typographyParams, config);
  return { Heading, Paragraph, TextSection };
}

export { createTypographyElements, withTypography };
export default createTypographyElements;
