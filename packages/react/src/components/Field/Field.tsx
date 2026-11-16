'use client';

import { FIELD__CLASS_NAME_CONFIG, cnx } from '@mainset/ui-core';
import React from 'react';

import { Label } from '../../elements/Label/index.mjs';

const { baseClass: FIELD } = FIELD__CLASS_NAME_CONFIG;

// The props a form control receives from its Field
type FieldControlProps = {
  id?: string;
  required?: boolean;
  'aria-describedby'?: string;
  'aria-invalid'?: React.AriaAttributes['aria-invalid'];
};

interface FieldProps extends Omit<
  React.ComponentPropsWithRef<'div'>,
  'children'
> {
  /** The label text */
  fldLabel: React.ReactNode;
  /** Help text under the control */
  fldHint?: React.ReactNode;
  /** Error message: also marks the control `aria-invalid` */
  fldError?: React.ReactNode;
  /** Marks the control `required` and the label with an asterisk */
  fldIsRequired?: boolean;
  /** The control's id (default: generated) */
  fldControlId?: string;
  /** One form control: `Input`, `Textarea`, `Select`, … (stays uncontrolled) */
  children: React.ReactElement<FieldControlProps>;
}

/**
 * Label + control + hint + error, wired for assistive tech: the control gets the `id` the label
 * points at, `aria-describedby` (hint, error), `aria-invalid` and `required`.
 *
 * @example
 * <Field fldLabel="Email" fldHint="We never share it" fldError={errors.email} fldIsRequired>
 *   <Input name="email" type="email" />
 * </Field>
 */
function Field({
  fldLabel,
  fldHint,
  fldError,
  fldIsRequired,
  fldControlId,
  className,
  children,
  ...props
}: FieldProps) {
  const generatedId = React.useId();
  const controlId = fldControlId ?? children.props.id ?? generatedId;
  const hintId = fldHint ? `${controlId}-hint` : undefined;
  const hasError =
    fldError !== undefined && fldError !== null && fldError !== false;
  const errorId = hasError ? `${controlId}-error` : undefined;

  const describedBy = [children.props['aria-describedby'], hintId, errorId]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cnx(className, FIELD)} {...props}>
      <Label htmlFor={controlId} lblIsRequired={fldIsRequired}>
        {fldLabel}
      </Label>
      {React.cloneElement(children, {
        id: controlId,
        required: fldIsRequired || children.props.required,
        'aria-describedby': describedBy || undefined,
        'aria-invalid': hasError || children.props['aria-invalid'],
      })}
      {fldHint && (
        <p className={`${FIELD}__hint`} id={hintId}>
          {fldHint}
        </p>
      )}
      {hasError && (
        <p className={`${FIELD}__error`} id={errorId}>
          {fldError}
        </p>
      )}
    </div>
  );
}

export { Field };
export type { FieldProps };
