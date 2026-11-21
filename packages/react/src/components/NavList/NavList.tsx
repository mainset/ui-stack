import type { NavListStyleProps } from '@mainset/ui-core';
import {
  DISCLOSURE__CLASS_NAME_CONFIG,
  NAV_LIST__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
} from '@mainset/ui-core';
import React from 'react';

import type {
  AnyComponent,
  PolymorphicProps,
} from '../../elements/utils/index.mjs';

const { baseClass: NAV_LIST } = NAV_LIST__CLASS_NAME_CONFIG;
const { baseClass: DISCLOSURE } = DISCLOSURE__CLASS_NAME_CONFIG;

type NavListProps = React.ComponentPropsWithRef<'ul'> & NavListStyleProps;

/**
 * A vertical list of links (put it in a `nav` with an `aria-label`): `NavList.Item`s, each a
 * `NavList.Link`, a nested `NavList`, or a `NavList.Group` that opens without script. The
 * current link is the one with `aria-current` (`page`, `location`, …), in the current tone.
 * `navVariant`: `soft` (default) tints the current row, `line` marks it on a guide line.
 *
 * @example
 * <nav aria-label="Docs">
 *   <NavList>
 *     <NavList.Item>
 *       <NavList.Link navAs={RouterLink} to="/docs" aria-current="page">Intro</NavList.Link>
 *     </NavList.Item>
 *     <NavList.Item>
 *       <NavList.Group navLabel="Elements" open>
 *         <NavList>
 *           <NavList.Item><NavList.Link href="/docs/button">Button</NavList.Link></NavList.Item>
 *         </NavList>
 *       </NavList.Group>
 *     </NavList.Item>
 *   </NavList>
 * </nav>
 */
function NavList({ className, ...props }: NavListProps) {
  const [classNames, restProps] = extractClassNamesFromProps(
    [NAV_LIST__CLASS_NAME_CONFIG],
    props,
  );

  return <ul className={cnx(className, classNames)} {...restProps} />;
}

type NavListItemProps = React.ComponentPropsWithRef<'li'>;

function NavListItem({ className, ...props }: NavListItemProps) {
  return <li className={cnx(className, `${NAV_LIST}__item`)} {...props} />;
}

type NavListLinkElementType = 'a' | AnyComponent;

type NavListLinkProps<C extends NavListLinkElementType = 'a'> =
  PolymorphicProps<'navAs', C>;

/** A whole-row link; `navAs={RouterLink}` keeps the router's navigation */
function NavListLink<C extends NavListLinkElementType = 'a'>({
  navAs,

  className,
  ...props
}: NavListLinkProps<C>): React.ReactElement {
  return React.createElement(navAs || 'a', {
    className: cnx(className, `${NAV_LIST}__link`),
    ...props,
  });
}

type NavListGroupProps = React.ComponentPropsWithRef<'details'> & {
  /** The group's name, the row that opens and closes it */
  navLabel: React.ReactNode;
};

/**
 * A collapsible group: a native `<details>` (`open` / `onToggle` are its own), its label a row
 * with a chevron; put the group's own `NavList` inside
 */
function NavListGroup({
  navLabel,

  className,
  children,
  ...props
}: NavListGroupProps) {
  return (
    <details className={cnx(className, `${NAV_LIST}__group`)} {...props}>
      <summary className={`${NAV_LIST}__group-label`}>
        <span>{navLabel}</span>
        <span className={`${DISCLOSURE}__icon`} aria-hidden="true" />
      </summary>
      {children}
    </details>
  );
}

NavList.Item = NavListItem;
NavList.Link = NavListLink;
NavList.Group = NavListGroup;

export { NavList };
export type {
  NavListGroupProps,
  NavListItemProps,
  NavListLinkElementType,
  NavListLinkProps,
  NavListProps,
};
