import {
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

const { baseClass: SWITCH } = SWITCH__CLASS_NAME_CONFIG;

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
 * submits and resets like any checkbox. The thumb moves along the inline axis, so it follows the
 * `dir` of its section (`dir="rtl"` on any ancestor). `className` / `ref` go on the `<input>`.
 *
 * @example <Switch name="notifications" defaultChecked>Email notifications</Switch>
 */
function Switch({ className, children, ...props }: ChoiceProps) {
  return withLabel(
    React.createElement(
      'span',
      { className: SWITCH },
      React.createElement('input', {
        type: 'checkbox',
        role: 'switch',
        className: cnx(className, `${SWITCH}__input`),
        ...props,
      }),
      React.createElement('span', {
        className: `${SWITCH}__thumb`,
        'aria-hidden': true,
      }),
    ),
    children,
  );
}

export { Radio, Switch, withLabel };
export type { ChoiceProps };
