import type { ElementPlainSize, PaginationStyleProps } from '@mainset/ui-core';
import {
  PAGINATION__CLASS_NAME_CONFIG,
  cnx,
  composeClassNames,
  paginationRange,
} from '@mainset/ui-core';
import React from 'react';

import type { ButtonElementType } from '../../elements/ButtonBasic/index.mjs';
import { Button } from '../Button/index.mjs';

const { baseClass: PAGINATION } = PAGINATION__CLASS_NAME_CONFIG;

type PaginationProps = Omit<React.ComponentPropsWithRef<'nav'>, 'children'> &
  PaginationStyleProps & {
    /** The current page, from 1 */
    pgnPage: number;
    pgnPageCount: number;
    /** A page button was pressed (not called for links: {pgnGetHref}) */
    pgnOnPageChange?: (page: number) => void;
    /** Pages are links to these URLs instead of buttons */
    pgnGetHref?: (page: number) => string;
    /**
     * The link component of {pgnGetHref} pages (a router's), given `href`
     * @default 'a'
     */
    pgnLinkAs?: ButtonElementType;
    /** Pages on each side of the current one @default 1 */
    pgnSiblingCount?: number;
    /** Pages always shown at the start and at the end @default 1 */
    pgnBoundaryCount?: number;
    /** @default 'Pagination' */
    pgnLabel?: string;
    /** @default 'Previous page' */
    pgnPreviousLabel?: string;
    /** @default 'Next page' */
    pgnNextLabel?: string;
    /** @default (page) => `Page ${page}` */
    pgnGetPageLabel?: (page: number) => string;
  };

/**
 * Pages of a list: previous / next, the first and last pages, and the ones around the current
 * page (`paginationRange` from `@mainset/ui-core`), the rest behind ellipses. Buttons by default
 * ({pgnOnPageChange}); links with {pgnGetHref}. The current page is in the inherited tone
 * (`ms-tone-*` on an ancestor), the others neutral.
 * NOTE: the `‹` `›` arrows are mirrored by the browser in RTL text.
 *
 * @example
 * <Pagination pgnPage={page} pgnPageCount={20} pgnOnPageChange={setPage} />
 * <Pagination pgnPage={page} pgnPageCount={20} pgnGetHref={(page) => `?page=${page}`} />
 */
function Pagination({
  pgnPage,
  pgnPageCount,
  pgnOnPageChange,
  pgnGetHref,
  pgnLinkAs = 'a',
  pgnSiblingCount,
  pgnBoundaryCount,
  pgnSize = 'base',
  pgnLabel = 'Pagination',
  pgnPreviousLabel = 'Previous page',
  pgnNextLabel = 'Next page',
  pgnGetPageLabel = (page) => `Page ${page}`,

  className,
  ...props
}: PaginationProps) {
  const pageCount = Math.max(pgnPageCount, 1);
  const current = Math.min(Math.max(pgnPage, 1), pageCount);
  const items = paginationRange({
    page: current,
    pageCount,
    siblingCount: pgnSiblingCount,
    boundaryCount: pgnBoundaryCount,
  });
  const btnSize: ElementPlainSize = pgnSize ?? 'base';

  // A page button, or a link with {pgnGetHref}; out of range (previous on the first page) it's disabled
  const pageProps = (page: number) => {
    const isDisabled = page < 1 || page > pageCount;

    if (pgnGetHref) {
      return {
        btnAs: pgnLinkAs,
        btnIsDisabled: isDisabled,
        href: isDisabled ? undefined : pgnGetHref(page),
      };
    }

    return {
      btnIsDisabled: isDisabled,
      onClick: () => pgnOnPageChange?.(page),
    };
  };

  return (
    <nav
      aria-label={pgnLabel}
      className={cnx(
        className,
        composeClassNames([PAGINATION__CLASS_NAME_CONFIG], { pgnSize }),
      )}
      {...props}
    >
      <ul className={`${PAGINATION}__list`}>
        <li>
          <Button
            {...pageProps(current - 1)}
            btnIsIcon
            btnSize={btnSize}
            srfTheme="base"
            srfVariant="ghost"
            aria-label={pgnPreviousLabel}
          >
            <span className={`${PAGINATION}__arrow`} aria-hidden="true">
              ‹
            </span>
          </Button>
        </li>
        {items.map((item, index) => (
          <li key={item === 'ellipsis' ? `ellipsis-${index}` : item}>
            {item === 'ellipsis' ? (
              <span className={`${PAGINATION}__ellipsis`} aria-hidden="true">
                …
              </span>
            ) : (
              <Button
                {...pageProps(item)}
                className={`${PAGINATION}__page`}
                btnSize={btnSize}
                // NOTE: the current page in the inherited tone, the others neutral
                srfTheme={item === current ? undefined : 'base'}
                srfVariant={item === current ? 'solid' : 'ghost'}
                aria-label={pgnGetPageLabel(item)}
                aria-current={item === current ? 'page' : undefined}
              >
                {item}
              </Button>
            )}
          </li>
        ))}
        <li>
          <Button
            {...pageProps(current + 1)}
            btnIsIcon
            btnSize={btnSize}
            srfTheme="base"
            srfVariant="ghost"
            aria-label={pgnNextLabel}
          >
            <span className={`${PAGINATION}__arrow`} aria-hidden="true">
              ›
            </span>
          </Button>
        </li>
      </ul>
    </nav>
  );
}

export { Pagination };
export type { PaginationProps };
