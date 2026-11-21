import { KEYBOARD_KEY__CLASS_NAME_CONFIG, cnx } from '@mainset/ui-core';
import React from 'react';

const { baseClass: KEYBOARD_KEY } = KEYBOARD_KEY__CLASS_NAME_CONFIG;

type KeyboardKeyProps = React.ComponentPropsWithRef<'kbd'>;

/**
 * A key or a shortcut (`ms-keyboard-key`); one per key of a combination.
 *
 * @example <KeyboardKey>⌘K</KeyboardKey>
 */
function KeyboardKey({
  className,
  ...props
}: KeyboardKeyProps): React.ReactElement {
  return React.createElement('kbd', {
    className: cnx(className, KEYBOARD_KEY),
    ...props,
  });
}

export { KeyboardKey };
export type { KeyboardKeyProps };
