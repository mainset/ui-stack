'use client';

import { CHECKBOX__CLASS_NAME_CONFIG, cnx } from '@mainset/ui-core';
import React from 'react';

import { mergeRefs } from '../utils/index.mjs';
import type { ChoiceProps } from './Choice.mjs';
import { withLabel } from './Choice.mjs';

const { baseClass: CHECKBOX } = CHECKBOX__CLASS_NAME_CONFIG;

type CheckboxProps = ChoiceProps & {
  /** "Some selected": shows a dash. It's a DOM property only, so it's set after render. */
  chkIsIndeterminate?: boolean;
};

/**
 * A native checkbox (uncontrolled: `name` + `defaultChecked`), checked in the current tone.
 * `className` / `ref` go on the `<input>`.
 *
 * @example
 * <Checkbox name="terms" required>I accept the terms</Checkbox>
 * <Checkbox chkIsIndeterminate={someSelected && !allSelected}>Select all</Checkbox>
 */
function Checkbox({
  chkIsIndeterminate = false,
  className,
  children,
  ref,
  ...props
}: CheckboxProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = chkIsIndeterminate;
  }, [chkIsIndeterminate]);

  // NOTE: the caller's `ref` still receives the input
  const setRef = React.useMemo(() => mergeRefs(inputRef, ref), [ref]);

  return withLabel(
    <span className={CHECKBOX}>
      <input
        type="checkbox"
        className={cnx(className, `${CHECKBOX}__input`)}
        ref={setRef}
        {...props}
      />
      <svg
        className={`${CHECKBOX}__icon`}
        viewBox="0 0 16 16"
        aria-hidden="true"
        focusable="false"
      >
        <path
          className={`${CHECKBOX}__check`}
          d="M3.75 8.25l2.75 2.75 5.75-6"
        />
        <path className={`${CHECKBOX}__dash`} d="M4.5 8h7" />
      </svg>
    </span>,
    children,
  );
}

export { Checkbox };
export type { CheckboxProps };
