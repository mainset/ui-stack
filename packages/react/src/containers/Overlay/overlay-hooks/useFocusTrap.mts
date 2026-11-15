import React from 'react';

// NOTE: covers every focusable input type (email, password, number, search, etc.), not only text/radio/checkbox
const FOCUSABLE_ELEMENTS_SELECTOR = [
  'a[href]',
  'area[href]',
  'button',
  'input:not([type="hidden"])',
  'select',
  'textarea',
  'summary',
  'iframe',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

const getFocusableNodes = (rootNode: HTMLElement) =>
  Array.from(
    rootNode.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS_SELECTOR),
  ).filter(
    (node) =>
      !node.hasAttribute('disabled') &&
      node.tabIndex !== -1 &&
      !node.closest('[inert]'),
  );

const useFocusTrap = (
  ref: React.RefObject<HTMLElement | null>,
  isActive: boolean,
) => {
  React.useEffect(() => {
    if (!isActive || !ref.current) return;

    const rootNode = ref.current;
    // Remember what had focus before the overlay opened, to restore it on close (WAI-ARIA dialog pattern)
    const previouslyFocusedNode = document.activeElement as HTMLElement | null;

    const handleKeyDown = (e: KeyboardEvent) => {
      // We only care about the Tab key
      if (e.key !== 'Tab') return;

      // Find all valid focusable elements inside the modal
      const focusableNodes = getFocusableNodes(rootNode);

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
    // Use requestAnimationFrame to ensure DOM is fully painted after Presence mounts
    const frameId = requestAnimationFrame(() => {
      const [firstFocusableNode] = getFocusableNodes(rootNode);
      // Fall back to the container itself so focus never stays behind the overlay
      (firstFocusableNode || rootNode).focus();
    });

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedNode?.focus?.();
    };
  }, [isActive, ref]);
};

export { useFocusTrap };
