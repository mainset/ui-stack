import { DISCLOSURE__CLASS_NAME_CONFIG, cnx } from '@mainset/ui-core';
import React from 'react';

const { baseClass: DISCLOSURE } = DISCLOSURE__CLASS_NAME_CONFIG;

type DisclosureProps = React.ComponentPropsWithRef<'details'> & {
  /** What is always shown; a click (or Enter / Space) on it opens and closes the rest */
  dscSummary: React.ReactNode;
  /** Props of the `<summary>` */
  dscSummaryProps?: React.ComponentPropsWithRef<'summary'>;
};

/**
 * A native `<details>` in the disclosure look: opens and closes without script (static pages,
 * before hydration) and is a disclosure for assistive tech. `open` / `onToggle` are the
 * element's own; for several sections opening one at a time, use `Accordion`.
 *
 * @example
 * <Disclosure dscSummary="Shipping">Free over 50 €.</Disclosure>
 */
function Disclosure({
  dscSummary,
  dscSummaryProps,

  className,
  children,
  ...props
}: DisclosureProps) {
  return (
    <details className={cnx(className, DISCLOSURE)} {...props}>
      <summary
        {...dscSummaryProps}
        className={cnx(dscSummaryProps?.className, `${DISCLOSURE}__trigger`)}
      >
        {dscSummary}
        <span className={`${DISCLOSURE}__icon`} aria-hidden="true" />
      </summary>
      <div className={`${DISCLOSURE}__panel-content`}>{children}</div>
    </details>
  );
}

export { Disclosure };
export type { DisclosureProps };
