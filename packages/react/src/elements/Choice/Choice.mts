import {
  CHECKBOX__CLASS_NAME_CONFIG,
  CHOICE__CLASS_NAME_CONFIG,
  RADIO__CLASS_NAME_CONFIG,
  SWITCH__CLASS_NAME_CONFIG,
  cnx,
} from '@mainset/ui-core';
import React from 'react';

type ChoiceProps = Omit<React.ComponentPropsWithRef<'input'>, 'type'> & {
  /** The label text: wraps the control in a `<label class="ms-choice">` */
  children?: React.ReactNode;
};

const { baseClass: CHECKBOX } = CHECKBOX__CLASS_NAME_CONFIG;

// With a label text, the whole row is clickable
function withLabel(control: React.ReactElement, children: React.ReactNode) {
  if (children === undefined || children === null) return control;

  return React.createElement(
    'label',
    { className: CHOICE__CLASS_NAME_CONFIG.baseClass },
    control,
    React.createElement('span', null, children),
  );
}

/**
 * A native checkbox (uncontrolled: `name` + `defaultChecked`), checked in the current tone.
 * `className` / `ref` go on the `<input>`; the indeterminate state is the DOM property
 * (`ref.current.indeterminate = true`).
 *
 * @example <Checkbox name="terms" required>I accept the terms</Checkbox>
 */
function Checkbox({ className, children, ...props }: ChoiceProps) {
  return withLabel(
    React.createElement(
      'span',
      { className: CHECKBOX },
      React.createElement('input', {
        type: 'checkbox',
        className: cnx(className, `${CHECKBOX}__input`),
        ...props,
      }),
      React.createElement(
        'svg',
        {
          className: `${CHECKBOX}__icon`,
          viewBox: '0 0 16 16',
          'aria-hidden': true,
          focusable: false,
        },
        React.createElement('path', {
          className: `${CHECKBOX}__check`,
          d: 'M3.75 8.25l2.75 2.75 5.75-6',
        }),
        React.createElement('path', {
          className: `${CHECKBOX}__dash`,
          d: 'M4.5 8h7',
        }),
      ),
    ),
    children,
  );
}

/**
 * A native radio; group them by `name`, ideally in a `<fieldset>` with a `<legend>`.
 *
 * @example <Radio name="plan" value="pro" defaultChecked>Pro</Radio>
 */
function Radio({ className, children, ...props }: ChoiceProps) {
  return withLabel(
    React.createElement('input', {
      type: 'radio',
      className: cnx(className, RADIO__CLASS_NAME_CONFIG.baseClass),
      ...props,
    }),
    children,
  );
}

/**
 * An on / off switch: a native checkbox with `role="switch"` (announced as on / off), so it
 * submits and resets like any checkbox.
 *
 * @example <Switch name="notifications" defaultChecked>Email notifications</Switch>
 */
function Switch({ className, children, ...props }: ChoiceProps) {
  return withLabel(
    React.createElement('input', {
      type: 'checkbox',
      role: 'switch',
      className: cnx(className, SWITCH__CLASS_NAME_CONFIG.baseClass),
      ...props,
    }),
    children,
  );
}

export { Checkbox, Radio, Switch };
export type { ChoiceProps };
