import { BREADCRUMB__CLASS_NAME_CONFIG, cnx } from '@mainset/ui-core';
import React from 'react';

import type {
  AnyComponent,
  PolymorphicProps,
} from '../../elements/utils/index.mjs';

const { baseClass: BREADCRUMB } = BREADCRUMB__CLASS_NAME_CONFIG;

type BreadcrumbProps = React.ComponentPropsWithRef<'nav'> & {
  /**
   * Between items; `›` is mirrored by the browser in RTL text, an icon may need mirroring
   * @default '/'
   */
  brcSeparator?: React.ReactNode;
  /** @default 'Breadcrumb' */
  brcLabel?: string;
};

/**
 * Where the current page sits: a `nav` with a list of `Breadcrumb.Item`s (links, the last one
 * the current page), separated by {brcSeparator}. Each child becomes a list item.
 *
 * @example
 * <Breadcrumb>
 *   <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
 *   <Breadcrumb.Item brcAs={RouterLink} to="/docs">Docs</Breadcrumb.Item>
 *   <Breadcrumb.Item brcIsCurrent>Install</Breadcrumb.Item>
 * </Breadcrumb>
 */
function Breadcrumb({
  brcSeparator = '/',
  brcLabel = 'Breadcrumb',

  className,
  children,
  ...props
}: BreadcrumbProps) {
  const items = React.Children.toArray(children);

  return (
    <nav
      aria-label={brcLabel}
      className={cnx(className, BREADCRUMB)}
      {...props}
    >
      <ol className={`${BREADCRUMB}__list`}>
        {items.map((item, index) => (
          <li
            key={
              React.isValidElement(item) && item.key !== null ? item.key : index
            }
            className={`${BREADCRUMB}__item`}
          >
            {item}
            {index < items.length - 1 && (
              <span className={`${BREADCRUMB}__separator`} aria-hidden="true">
                {brcSeparator}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

type BreadcrumbItemElementType = 'a' | 'span' | AnyComponent;

type BreadcrumbItemProps<C extends BreadcrumbItemElementType = 'a'> =
  PolymorphicProps<
    'brcAs',
    C,
    {
      /** The page the user is on (`aria-current="page"`) */
      brcIsCurrent?: boolean;
    }
  >;

/**
 * A link of the trail, or the current page: a `span` unless it has an `href` or a {brcAs}
 * (`brcAs={RouterLink}` keeps the router's navigation)
 */
function BreadcrumbItem<C extends BreadcrumbItemElementType = 'a'>({
  brcAs,
  brcIsCurrent,

  className,
  ...props
}: BreadcrumbItemProps<C>): React.ReactElement {
  const isLink = brcAs !== undefined || 'href' in props;

  return React.createElement(brcAs || (isLink ? 'a' : 'span'), {
    'aria-current': brcIsCurrent ? 'page' : undefined,
    className: cnx(className, `${BREADCRUMB}__link`),
    ...props,
  });
}

Breadcrumb.Item = BreadcrumbItem;

export { Breadcrumb };
export type { BreadcrumbItemElementType, BreadcrumbItemProps, BreadcrumbProps };
