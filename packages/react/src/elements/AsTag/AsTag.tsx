import React from 'react';

// 1. T extends React.ElementType makes sure `as` is a valid React element/tag
type AsTagProps<T extends React.ElementType> = {
  as?: T;
  // 2. This grabs all native HTML attributes for that tag
} & React.ComponentPropsWithoutRef<T>;

const AsTag = <T extends React.ElementType = 'div'>({
  as,
  ...props
}: AsTagProps<T>) => {
  const Component = as || 'div';

  return <Component {...props} />;
};

export { AsTag };
export type { AsTagProps };
