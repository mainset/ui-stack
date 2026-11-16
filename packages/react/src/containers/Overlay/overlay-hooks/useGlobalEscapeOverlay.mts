import React from 'react';

/**
 * Escape dismisses the top-most overlay, unless something inside it handled the key first
 * (an open menu or popover calls `preventDefault()`) or an IME composition is in progress.
 */
const useGlobalEscapeOverlay = (
  isActive: boolean,
  dismissTopOverlay: (reason: 'escape') => void,
) => {
  React.useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented || event.isComposing)
        return;

      event.preventDefault();
      dismissTopOverlay('escape');
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, dismissTopOverlay]);
};

export { useGlobalEscapeOverlay };
