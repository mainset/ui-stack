import React from 'react';

const FOCUSABLE_ELEMENTS_SELECTOR =
  'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])';

const useFocusTrap = (
  ref: React.RefObject<HTMLElement | null>,
  isActive: boolean,
) => {
  React.useEffect(() => {
    if (!isActive || !ref.current) return;

    const rootNode = ref.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      // We only care about the Tab key
      if (e.key !== 'Tab') return;

      // Find all valid focusable elements inside the modal
      const focusableNodes = Array.from(
        rootNode.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS_SELECTOR),
      ).filter(
        (node) => !node.hasAttribute('disabled') && node.tabIndex !== -1,
      );

      if (focusableNodes.length === 0) {
        // If there's nothing to focus, prevent default tabbing behavior
        e.preventDefault();
        return;
      }

      const firstNode = focusableNodes[0];
      const lastNode = focusableNodes[focusableNodes.length - 1];

      // If holding shift (tabbing backwards)
      if (e.shiftKey) {
        if (document.activeElement === firstNode) {
          lastNode.focus();
          e.preventDefault();
        }
      }
      // If not holding shift (tabbing forwards)
      else {
        if (document.activeElement === lastNode) {
          firstNode.focus();
          e.preventDefault();
        }
      }
    };

    // Auto-focus the first element when the trap activates
    const initialFocusableNodes = Array.from(
      rootNode.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS_SELECTOR),
    ).filter((node) => !node.hasAttribute('disabled') && node.tabIndex !== -1);

    if (initialFocusableNodes.length > 0) {
      // Use requestAnimationFrame to ensure DOM is fully painted after Presence mounts
      requestAnimationFrame(() => {
        initialFocusableNodes[0].focus();
      });
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, ref]);
};

export { useFocusTrap };
