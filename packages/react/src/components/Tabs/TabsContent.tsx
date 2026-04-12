import React from 'react';

import { useTabsContext } from './TabsContext.mjs';

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  tbsId: string;
}

function TabsContent({ tbsId, children, ...props }: TabsContentProps) {
  const context = useTabsContext();

  if (context.tbsId !== tbsId) return null;

  return (
    <div role="tabpanel" data-state="active" {...props}>
      {children}
    </div>
  );
}

export { TabsContent };
export type { TabsContentProps };
