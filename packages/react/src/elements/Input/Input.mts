import type { ControlStyleProps } from '@mainset/ui-core';
import { cnx, inputRecipe, selectWrapperRecipe } from '@mainset/ui-core';
import React from 'react';

// Text-like types; checkboxes, radios and switches have their own elements
type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'search'
  | 'tel'
  | 'url'
  | 'number'
  | 'date'
  | 'datetime-local'
  | 'month'
  | 'time'
  | 'week';

type InputProps = Omit<React.ComponentPropsWithRef<'input'>, 'type'> &
  ControlStyleProps & {
    type?: InputType;
  };

/**
 * A native text-like `<input>`, sized like every control (`ctlSize`) and uncontrolled by default:
 * use `name` + `defaultValue` (and read the form), or `useFormHandler`. Invalid via
 * `aria-invalid` (set by `Field`) or the browser's own validation (`:user-invalid`).
 */
function Input({ ctlSize, type = 'text', className, ...props }: InputProps) {
  return React.createElement('input', {
    className: cnx(className, inputRecipe({ ctlSize })),
    type,
    ...props,
  });
}

type TextareaProps = React.ComponentPropsWithRef<'textarea'> &
  ControlStyleProps;

/** A native `<textarea>` with the input look; grows with `rows` (default 3), resizable vertically */
function Textarea({ ctlSize, rows = 3, className, ...props }: TextareaProps) {
  return React.createElement('textarea', {
    className: cnx(className, inputRecipe({ ctlSize })),
    rows,
    ...props,
  });
}

type SelectProps = React.ComponentPropsWithRef<'select'> & ControlStyleProps;

/**
 * A native `<select>` (keyboard, mobile pickers and a11y for free) with the input look; a
 * wrapper `<span class="ms-select">` draws the chevron. `className` goes on the `<select>`.
 */
function Select({ ctlSize, className, children, ...props }: SelectProps) {
  return React.createElement(
    'span',
    { className: selectWrapperRecipe() },
    React.createElement(
      'select',
      { className: cnx(className, inputRecipe({ ctlSize })), ...props },
      children,
    ),
  );
}

export { Input, Select, Textarea };
export type { InputProps, InputType, SelectProps, TextareaProps };
