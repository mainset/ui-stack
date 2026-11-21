import { CODE__CLASS_NAME_CONFIG, cnx } from '@mainset/ui-core';
import React from 'react';

const { baseClass: CODE } = CODE__CLASS_NAME_CONFIG;

type CodeProps = React.ComponentPropsWithRef<'code'>;

/**
 * A code span in running text (`ms-code`), sized to the text around it.
 *
 * @example <Text>Run <Code>pnpm build</Code> first.</Text>
 */
function Code({ className, ...props }: CodeProps): React.ReactElement {
  return React.createElement('code', {
    className: cnx(className, CODE),
    ...props,
  });
}

export { Code };
export type { CodeProps };
