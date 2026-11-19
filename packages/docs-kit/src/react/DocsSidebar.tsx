'use client';

import React from 'react';
import { Link } from 'react-router';

import type {
  DocsNavCategory,
  DocsNavItem,
  DocsPage,
} from '../core/docs.types.mjs';
import { containsPage } from '../core/nav-tree.mjs';
import { ChevronIcon } from './icons.js';

interface DocsSidebarProps {
  items: DocsNavItem[];
  /** Key of the page being shown */
  currentPageKey: string | undefined;
  /** Id of the heading being read (scroll-spy), for pages that list their anchors */
  activeHeadingId: string | null;
  getPagePath: (page: DocsPage) => string;
  label: string;
}

interface NavListProps extends Omit<DocsSidebarProps, 'items' | 'label'> {
  items: DocsNavItem[];
}

function NavCategory({
  category,
  ...props
}: Omit<NavListProps, 'items'> & { category: DocsNavCategory }) {
  const holdsCurrentPage =
    props.currentPageKey !== undefined &&
    containsPage(category, props.currentPageKey);
  const [isOpen, setIsOpen] = React.useState(
    holdsCurrentPage || !category.isCollapsed,
  );

  // NOTE: opens when a navigation lands in it, never closes by itself (the reader may have
  // opened it to look around)
  React.useEffect(() => {
    if (holdsCurrentPage) setIsOpen(true);
  }, [holdsCurrentPage]);

  return (
    <li className="msd-sidebar__category">
      {/* NOTE: native <details>: opens and closes without script (static pages) and is a
          disclosure for assistive tech */}
      <details
        open={isOpen}
        onToggle={(event) => setIsOpen(event.currentTarget.open)}
      >
        <summary className="msd-sidebar__category-label">
          <span>{category.label}</span>
          <ChevronIcon className="msd-sidebar__chevron" />
        </summary>
        <NavList {...props} items={category.items} />
      </details>
    </li>
  );
}

function NavList({ items, ...props }: NavListProps) {
  const { currentPageKey, activeHeadingId, getPagePath } = props;

  return (
    <ul className="msd-sidebar__list">
      {items.map((item) => {
        if (item.type === 'category') {
          return (
            <NavCategory
              key={`category:${item.key}`}
              category={item}
              {...props}
            />
          );
        }

        const isCurrent = item.key === currentPageKey;
        const anchors =
          isCurrent && item.page.meta.frontmatter.sidebar?.anchors
            ? item.page.meta.headings.filter(({ depth }) => depth === 2)
            : [];

        return (
          <li key={`page:${item.key}`} className="msd-sidebar__item">
            <Link
              to={getPagePath(item.page)}
              className="msd-sidebar__link"
              aria-current={isCurrent ? 'page' : undefined}
            >
              {item.label}
            </Link>

            {anchors.length > 0 && (
              <ul className="msd-sidebar__anchors">
                {anchors.map((heading) => (
                  <li key={heading.id}>
                    <a
                      href={`#${heading.id}`}
                      className="msd-sidebar__anchor"
                      aria-current={
                        heading.id === activeHeadingId ? 'location' : undefined
                      }
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** The section's pages: categories as collapsible groups, the current page marked */
function DocsSidebar({ items, label, ...props }: DocsSidebarProps) {
  return (
    <nav aria-label={label} className="msd-sidebar">
      <NavList items={items} {...props} />
    </nav>
  );
}

export { DocsSidebar };
export type { DocsSidebarProps };
