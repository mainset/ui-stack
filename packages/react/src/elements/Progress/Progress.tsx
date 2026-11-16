import type { ProgressStyleProps, Tone } from '@mainset/ui-core';
import { PROGRESS__CLASS_NAME_CONFIG, cnx, toneRecipe } from '@mainset/ui-core';
import React from 'react';

import { splitStyleProps } from '../utils/index.mjs';

type ProgressProps = Omit<
  React.ComponentPropsWithRef<'div'>,
  'children' | 'role'
> &
  Omit<ProgressStyleProps, 'prgIsIndeterminate'> & {
    /** How much is done, from {prgMin} to {prgMax}; unset or `null` while it's unknown */
    prgValue?: number | null;
    /** @default 0 */
    prgMin?: number;
    /** @default 100 */
    prgMax?: number;
    /** Read instead of the percentage, e.g. "3 of 8 files" */
    prgValueText?: string;
    /** The bar's tone @default the inherited one */
    prgTone?: Tone;
  };

/**
 * A progress bar (`role="progressbar"`), filled to {prgValue}; without one, a bar runs across
 * while the amount of work is unknown. Name it (`aria-label` / `aria-labelledby`).
 *
 * @example <Progress aria-label="Upload" prgValue={uploaded} prgMax={total} prgTone="success" />
 */
function Progress({
  prgValue,
  prgMin = 0,
  prgMax = 100,
  prgValueText,
  prgTone,

  className,
  ...props
}: ProgressProps) {
  const isIndeterminate = prgValue === undefined || prgValue === null;
  const value = isIndeterminate
    ? undefined
    : Math.min(Math.max(prgValue, prgMin), prgMax);
  const ratio =
    value === undefined || prgMax <= prgMin
      ? 0
      : (value - prgMin) / (prgMax - prgMin);

  const [classNames, divProps, style] = splitStyleProps(
    [PROGRESS__CLASS_NAME_CONFIG],
    { ...props, prgIsIndeterminate: isIndeterminate },
  );

  return (
    <div
      role="progressbar"
      aria-valuemin={prgMin}
      aria-valuemax={prgMax}
      aria-valuenow={value}
      aria-valuetext={prgValueText}
      className={cnx(className, classNames, toneRecipe(prgTone))}
      style={
        {
          '--ms-progress-value': ratio,
          ...style,
        } as React.CSSProperties
      }
      {...divProps}
    >
      <span className="ms-progress__bar" />
    </div>
  );
}

export { Progress };
export type { ProgressProps };
