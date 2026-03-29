import React from 'react';

const useGlobalEscapeOverlay = (
  overlayStackIds: string[],
  toggleOverlayOpenById: (id: string) => void,
) => {
  const stackRef = React.useRef(overlayStackIds);

  React.useEffect(() => {
    stackRef.current = overlayStackIds;
  }, [overlayStackIds]);

  React.useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const currentStackIds = stackRef.current;
        if (currentStackIds.length === 0) return;

        const topOverlayId = currentStackIds[currentStackIds.length - 1];
        if (topOverlayId) {
          toggleOverlayOpenById(topOverlayId);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleOverlayOpenById]);
};

export { useGlobalEscapeOverlay };
