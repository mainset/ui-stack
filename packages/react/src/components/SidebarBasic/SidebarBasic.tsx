import React from 'react';

import { OverlayContent } from '../../containers/Overlay/OverlayContent.js';

interface SidebarBasicProps extends Pick<
  React.AriaAttributes,
  'aria-label' | 'aria-labelledby' | 'aria-describedby'
> {
  sbrId: string;
  sbrIsOpen: boolean;
}

const SidebarBasic = ({
  sbrId,
  sbrIsOpen,

  children,
  ...ariaProps
}: React.PropsWithChildren<SidebarBasicProps>) => {
  const ovrId = React.useMemo(() => `sidebar--${sbrId}`, [sbrId]);

  return (
    <OverlayContent
      {...ariaProps}
      ovrId={ovrId}
      ovrIsOpen={sbrIsOpen}
      ovrPlacement="end"
    >
      {children}
    </OverlayContent>
  );
};

export { SidebarBasic };
