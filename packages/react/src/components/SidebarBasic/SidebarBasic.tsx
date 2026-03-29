import { OverlayContent } from '@mainset/react/containers';
import React from 'react';

interface SidebarBasicProps {
  sbrId: string;
  sbrIsOpen: boolean;
}

const SidebarBasic = ({
  sbrId,
  sbrIsOpen,

  children,
}: React.PropsWithChildren<SidebarBasicProps>) => {
  const ovrId = React.useMemo(() => `sidebar--${sbrId}`, [sbrId]);

  return (
    <OverlayContent ovrId={ovrId} ovrIsOpen={sbrIsOpen} ovrPlacement="end">
      {children}
    </OverlayContent>
  );
};

export { SidebarBasic };
