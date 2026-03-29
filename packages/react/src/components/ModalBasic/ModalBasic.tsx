import { OverlayContent } from '@mainset/react/containers';
import React from 'react';

interface ModalBasicProps {
  mdlId: string;
  mdlIsOpen: boolean;
}

const ModalBasic = ({
  mdlId,
  mdlIsOpen,

  children,
}: React.PropsWithChildren<ModalBasicProps>) => {
  const ovrId = React.useMemo(() => `modal--${mdlId}`, [mdlId]);

  return (
    <OverlayContent ovrId={ovrId} ovrIsOpen={mdlIsOpen} ovrPlacement="middle">
      {children}
    </OverlayContent>
  );
};

export { ModalBasic };
