import React from 'react';

import { OverlayContent } from '../../containers/Overlay/OverlayContent.js';

interface ModalBasicProps extends Pick<
  React.AriaAttributes,
  'aria-label' | 'aria-labelledby' | 'aria-describedby'
> {
  mdlId: string;
  mdlIsOpen: boolean;
}

const ModalBasic = ({
  mdlId,
  mdlIsOpen,

  children,
  ...ariaProps
}: React.PropsWithChildren<ModalBasicProps>) => {
  const ovrId = React.useMemo(() => `modal--${mdlId}`, [mdlId]);

  return (
    <OverlayContent
      {...ariaProps}
      ovrId={ovrId}
      ovrIsOpen={mdlIsOpen}
      ovrPlacement="middle"
    >
      {children}
    </OverlayContent>
  );
};

export { ModalBasic };
