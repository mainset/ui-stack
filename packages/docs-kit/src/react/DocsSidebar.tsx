'use client';

import { NavList } from '@mainset/react/components';
import React from 'react';
import { Link } from 'react-router';

import type {
  DocsNavCategory,
  DocsNavItem,
  DocsPage,
} from '../core/docs.types.mjs';
import { containsPage } from '../core/nav-tree.mjs';

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
    <NavList.Item>
      {/* NOTE: native <details>: opens and closes without script (static pages) */}
      <NavList.Group
        navLabel={category.label}
        open={isOpen}
        onToggle={(event) => setIsOpen(event.currentTarget.open)}
      >
        <SidebarList {...props} items={category.items} />
      </NavList.Group>
    </NavList.Item>
  );
}

function SidebarList({ items, ...props }: NavListProps) {
  const { currentPageKey, activeHeadingId, getPagePath } = props;

  return (
    <NavList>
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
          <NavList.Item key={`page:${item.key}`}>
            <NavList.Link
              navAs={Link}
              to={getPagePath(item.page)}
              aria-current={isCurrent ? 'page' : undefined}
            >
              {item.label}
            </NavList.Link>

            {anchors.length > 0 && (
              <NavList navVariant="line">
                {anchors.map((heading) => (
                  <NavList.Item key={heading.id}>
                    <NavList.Link
                      href={`#${heading.id}`}
                      aria-current={
                        heading.id === activeHeadingId ? 'location' : undefined
                      }
                    >
                      {heading.text}
                    </NavList.Link>
                  </NavList.Item>
                ))}
              </NavList>
            )}
          </NavList.Item>
        );
      })}
    </NavList>
  );
}

/** The section's pages: categories as collapsible groups, the current page marked */
function DocsSidebar({ items, label, ...props }: DocsSidebarProps) {
  return (
    <nav aria-label={label}>
      <SidebarList items={items} {...props} />
    </nav>
  );
}

export { DocsSidebar };
export type { DocsSidebarProps };
