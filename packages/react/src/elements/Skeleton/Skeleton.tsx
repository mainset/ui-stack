import type { SkeletonStyleProps } from '@mainset/ui-core';
import { SKELETON__CLASS_NAME_CONFIG, cnx } from '@mainset/ui-core';
import React from 'react';

import { splitStyleProps } from '../utils/index.mjs';

type SkeletonProps = React.ComponentPropsWithRef<'span'> &
  SkeletonStyleProps & {
    /** While `false`, renders its children as they are @default true */
    sklIsLoading?: boolean;
    /** Several `text` lines, the last one shorter */
    sklLines?: number;
  };

/**
 * A placeholder while content loads: a `text` line, a `rect` (default) or a `circle`. Size it
 * with `style` / a class, or wrap the content to load: it then takes the content's size, and
 * shows it once {sklIsLoading} is `false`. Hidden from assistive tech; mark the loading region
 * `aria-busy="true"`.
 *
 * @example
 * <Skeleton sklVariant="text" sklLines={3} />
 * <Skeleton sklIsLoading={!user}><Heading>{user?.name ?? 'Name'}</Heading></Skeleton>
 */
function Skeleton({
  sklIsLoading = true,
  sklLines,

  className,
  children,
  ...props
}: SkeletonProps) {
  const [classNames, spanProps, style] = splitStyleProps(
    [SKELETON__CLASS_NAME_CONFIG],
    props,
  );

  if (!sklIsLoading) return <>{children}</>;

  if (sklLines !== undefined && sklLines > 1) {
    return (
      <span
        aria-hidden="true"
        className={cnx(className, 'ms-skeleton-lines')}
        style={style}
        {...spanProps}
      >
        {Array.from({ length: sklLines }, (_, index) => (
          <span key={index} className={cnx(classNames)} />
        ))}
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cnx(className, classNames)}
      style={style}
      {...spanProps}
    >
      {children}
    </span>
  );
}

export { Skeleton };
export type { SkeletonProps };
